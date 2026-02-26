import logging
import os
import yaml
import voluptuous as vol

from homeassistant.core import HomeAssistant, callback
from homeassistant.components import websocket_api
from homeassistant.helpers import entity_registry as er

_LOGGER = logging.getLogger(__name__)

def get_google_assistant_yaml_path(hass: HomeAssistant) -> str | None:
    """Find the path to the google_assistant configuration file."""
    # First, try to see if there is a standalone google_assistant.yaml
    ga_path = hass.config.path("google_assistant.yaml")
    if os.path.exists(ga_path):
        return ga_path
        
    # If not, assume it's directly in configuration.yaml
    config_path = hass.config.path("configuration.yaml")
    if os.path.exists(config_path):
        return config_path
        
    return None

def read_exposure_from_yaml(filepath: str) -> dict:
    """Read existing entity configurations from the YAML file."""
    if not filepath or not os.path.exists(filepath):
        return {}
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            # Safe yaml load is necessary to avoid running malicious code
            # Note: PyYAML safe_load doesn't preserve comments, but we strictly read here
            config = yaml.safe_load(f) or {}
            
            # If the user included it directly, the root IS the google_assistant config
            ga_config = config.get('google_assistant', config) if isinstance(config, dict) else config
            
            if isinstance(ga_config, dict):
                 return ga_config.get('entity_config', {})
    except Exception as e:
        _LOGGER.error(f"Error reading YAML for GAIA: {e}")
        
    return {}

def update_yaml_exposure(filepath: str, entity_id: str, should_expose: bool) -> bool:
    """Safely update the expose property of an entity in the YAML file without breaking comments."""
    if not filepath or not os.path.exists(filepath):
        _LOGGER.error("Cannot update YAML: File not found.")
        return False
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        # We need a basic state machine to find google_assistant -> entity_config -> entity_id -> expose
        in_google_assistant = False
        in_entity_config = False
        in_target_entity = False
        
        target_entity_line_idx = -1
        expose_line_idx = -1
        
        entity_config_indent = ""
        entity_indent = ""
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            # Skip empty lines or pure comments
            if not stripped or stripped.startswith('#'):
                continue
                
            # If the file is only google_assistant.yaml (via !include), then root is google_assistant inherently 
            # or it might have google_assistant: at the top.
            if stripped.startswith('google_assistant:'):
                in_google_assistant = True
                continue
                
            if stripped.startswith('entity_config:'):
                in_entity_config = True
                entity_config_indent = line[:len(line) - len(line.lstrip())]
                continue
                
            # If we are in entity config, look for our entity ID
            if in_entity_config and stripped.startswith(f"{entity_id}:"):
                in_target_entity = True
                target_entity_line_idx = i
                entity_indent = line[:len(line) - len(line.lstrip())]
                continue
                
            # If we are in our target entity, look for the 'expose:' key
            if in_target_entity:
                current_indent = len(line) - len(line.lstrip())
                # If indentation drops back to entity level or lower, we left the entity block
                if current_indent <= len(entity_indent) and not stripped.startswith('-'):
                    in_target_entity = False
                    continue
                    
                if stripped.startswith('expose:'):
                    expose_line_idx = i
                    break # Found it!

        # Case 1: The 'expose:' key exists under the entity. We just replace it.
        expose_str = "true" if should_expose else "false"
        
        if expose_line_idx != -1:
            old_line = lines[expose_line_idx]
            indent = old_line[:len(old_line) - len(old_line.lstrip())]
            lines[expose_line_idx] = f"{indent}expose: {expose_str}\n"
            
        # Case 2: The entity exists, but has no 'expose:' key. Insert it right after the entity line.
        elif target_entity_line_idx != -1:
             # Standard YAML indent is +2 spaces
             indent = lines[target_entity_line_idx][:len(lines[target_entity_line_idx]) - len(lines[target_entity_line_idx].lstrip())] + "  "
             lines.insert(target_entity_line_idx + 1, f"{indent}expose: {expose_str}\n")
             
        # Case 3: The entity config block exists, but our entity is not in it.
        elif in_entity_config:
             # Find where to append - right after entity_config:
             # We should theoretically find the end of entity config but inserting at the top is easiest
             for i, line in enumerate(lines):
                 if line.strip().startswith('entity_config:'):
                     base_indent = line[:len(line) - len(line.lstrip())]
                     child_indent = base_indent + "  "
                     prop_indent = child_indent + "  "
                     
                     lines.insert(i + 1, f"{prop_indent}expose: {expose_str}\n")
                     lines.insert(i + 1, f"{child_indent}{entity_id}:\n")
                     break
                     
        # Case 4: No entity_config block exists. We must inject it.
        else:
             # This is a bit unsafe without ruamel, but we assume file ends with valid yaml
             lines.append("\n  entity_config:\n")
             lines.append(f"    {entity_id}:\n")
             lines.append(f"      expose: {expose_str}\n")
             
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
            
        return True
    except Exception as e:
        _LOGGER.error(f"Failed to write GAIA YAML update: {e}")
        return False

@callback
def async_register_websockets(hass: HomeAssistant):
    """Register WebSocket API endpoints."""
    websocket_api.async_register_command(hass, ws_get_entities)
    websocket_api.async_register_command(hass, ws_update_exposure)
    websocket_api.async_register_command(hass, ws_update_domain_exposure)

@websocket_api.websocket_command(
    {
        vol.Required("type"): "gaia/get_entities",
    }
)
@callback
def ws_get_entities(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict):
    """Handle get entities request and populate real exposed status from YAML."""
    entity_reg = er.async_get(hass)
    entities = []

    yaml_path = get_google_assistant_yaml_path(hass)
    entity_configs = read_exposure_from_yaml(yaml_path)

    for entity_id, entry in entity_reg.entities.items():
        if entry.disabled_by or entry.hidden_by:
            continue
            
        # Parse logic: Default to false, check if manually forced to true in YAML
        is_exposed = False
        if entity_id in entity_configs:
            is_exposed = entity_configs[entity_id].get('expose', False)

        entities.append({
            "entity_id": entity_id,
            "domain": entry.domain,
            "name": entry.name or entry.original_name or entity_id,
            "exposed": is_exposed,
            "icon": entry.icon or entry.original_icon
        })
        
    connection.send_result(msg["id"], entities)

@websocket_api.websocket_command(
    {
        vol.Required("type"): "gaia/update_exposure",
        vol.Required("entity_id"): str,
        vol.Required("expose"): bool,
    }
)
@callback
def ws_update_exposure(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict):
    """Handle update exposure request."""
    entity_id = msg["entity_id"]
    should_expose = msg["expose"]
    _LOGGER.info(f"Requested to {'expose' if should_expose else 'hide'} {entity_id} to Google Assistant via YAML")
    
    yaml_path = get_google_assistant_yaml_path(hass)
    success = update_yaml_exposure(yaml_path, entity_id, should_expose)
    
    if success:
        hass.async_create_task(hass.services.async_call("google_assistant", "reload", blocking=False))
        
    connection.send_result(msg["id"], {"success": success, "entity_id": entity_id, "exposed": should_expose})

@websocket_api.websocket_command(
    {
        vol.Required("type"): "gaia/update_domain_exposure",
        vol.Required("domain"): str,
        vol.Required("expose"): bool,
    }
)
@callback
def ws_update_domain_exposure(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict):
    """Handle domain-wide default exposure request."""
    domain = msg["domain"]
    should_expose = msg["expose"]
    _LOGGER.info(f"Requested to bulk set {domain} domain to {'expose' if should_expose else 'hide'} via YAML")
    
    yaml_path = get_google_assistant_yaml_path(hass)
    entity_reg = er.async_get(hass)
    
    success = True
    for entity_id, entry in entity_reg.entities.items():
        if entry.disabled_by or entry.hidden_by:
            continue
            
        if entry.domain == domain:
            if not update_yaml_exposure(yaml_path, entity_id, should_expose):
                 success = False
                 
    if success:
         hass.async_create_task(hass.services.async_call("google_assistant", "reload", blocking=False))
            
    connection.send_result(msg["id"], {"success": success, "domain": domain, "exposed": should_expose})
