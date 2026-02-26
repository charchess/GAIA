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

import logging
import os
import re
import yaml
import voluptuous as vol

from homeassistant.core import HomeAssistant, callback
from homeassistant.components import websocket_api
from homeassistant.helpers import entity_registry as er

_LOGGER = logging.getLogger(__name__)

def get_google_assistant_yaml_path(hass: HomeAssistant) -> str | None:
    """Find the path to the google_assistant configuration file."""
    ga_path = hass.config.path("google_assistant.yaml")
    if os.path.exists(ga_path):
        return ga_path
        
    config_path = hass.config.path("configuration.yaml")
    if os.path.exists(config_path):
        return config_path
        
    return None

def read_config_from_yaml(filepath: str) -> tuple[dict, list, bool]:
    """Read entity configs, exposed domains, and default exposure from YAML."""
    if not filepath or not os.path.exists(filepath):
        return {}, [], False
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        # We manually parse exposed_domains to accurately capture commented fields
        # yaml.safe_load drops comments so we wouldn't see "# - light"
        exposed_domains = []
        exposed_domains_indent = 0
        
        for line in lines:
            stripped = line.strip()
            
            if stripped.startswith('exposed_domains:'):
                in_exposed_domains = True
                exposed_domains_indent = len(line) - len(line.lstrip())
                continue
                
            if in_exposed_domains:
                if not stripped:
                    continue
                    
                current_indent = len(line) - len(line.lstrip())
                
                # Check if we've exited the exposed_domains block
                # A block ends if we hit a non-empty, non-commented line with equal or lesser indent, that isn't a list item
                if current_indent <= exposed_domains_indent and not stripped.startswith('-') and not stripped.startswith('#'):
                    in_exposed_domains = False
                    continue
                    
                # Check for active domain "- light"
                match = re.match(r'^\s*-\s*\"?([a-zA-Z0-9_]+)\"?\s*$', line)
                if match:
                    exposed_domains.append(match.group(1))
                    
        # Now use safe_load for the rest
        with open(filepath, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f) or {}
            
            ga_config = config.get('google_assistant', config) if isinstance(config, dict) else config
            
            if isinstance(ga_config, dict):
                 entity_config = ga_config.get('entity_config', {})
                 expose_by_default = ga_config.get('expose_by_default', False)
                 return entity_config, exposed_domains, expose_by_default
                 
    except Exception as e:
        _LOGGER.error(f"Error reading YAML for GAIA: {e}")
        
    return {}, [], False

def update_yaml_domain_exposure(filepath: str, domain: str, should_expose: bool) -> bool:
    """Comment or uncomment a domain in exposed_domains."""
    if not filepath or not os.path.exists(filepath):
        return False
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        in_ga = False
        in_exposed_domains = False
        exposed_domains_idx = -1
        exposed_domains_indent = 0
        
        domain_idx = -1
        domain_indent = ""
        is_commented = False
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            if stripped.startswith('google_assistant:'):
                in_ga = True
                continue
                
            if stripped.startswith('exposed_domains:'):
                in_exposed_domains = True
                exposed_domains_idx = i
                exposed_domains_indent = len(line) - len(line.lstrip())
                continue
                
            if in_exposed_domains:
                if not stripped:
                    continue
                    
                current_indent = len(line) - len(line.lstrip())
                
                if current_indent <= exposed_domains_indent and not stripped.startswith('-') and not stripped.startswith('#'):
                    in_exposed_domains = False
                    continue
                
                # Match `- light` or `- "light"` capturing leading spaces
                match_active = re.match(r'^(\s*)-\s*(\"?'+ domain + r'\"?)\s*$', line)
                match_commented = re.match(r'^(\s*)#\s*-\s*(\"?'+ domain + r'\"?)\s*$', line)
                
                if match_active:
                    domain_idx = i
                    is_commented = False
                    domain_indent = match_active.group(1)
                    break
                elif match_commented:
                    domain_idx = i
                    is_commented = True
                    domain_indent = match_commented.group(1)
                    break
                    
        if domain_idx != -1:
            if should_expose and is_commented:
                # uncomment: replace the first '#' with space or remove it
                lines[domain_idx] = lines[domain_idx].replace('#', ' ', 1)
            elif not should_expose and not is_commented:
                # comment
                lines[domain_idx] = domain_indent + "# " + lines[domain_idx].lstrip()
        else:
            # We need to inject it under exposed_domains
            if exposed_domains_idx != -1:
                base_indent_match = re.search(r'^(\s*)', lines[exposed_domains_idx])
                base_indent = base_indent_match.group(1) if base_indent_match else ""
                child_indent = base_indent + "  "
                
                if should_expose:
                    new_line = f"{child_indent}- {domain}\n"
                else:
                    new_line = f"{child_indent}# - {domain}\n"
                    
                lines.insert(exposed_domains_idx + 1, new_line)
            else:
                 # No exposed_domains block exists. Need to append it to GA block.
                 # Very complex to guess correctly without ruamel, avoiding for now to keep it safe.
                 pass
                 
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
            
        return True
    except Exception as e:
        _LOGGER.error(f"Failed to write GAIA domain YAML update: {e}")
        return False

def update_yaml_exposure(filepath: str, entity_id: str, state: str) -> bool:
    """Safely update, inject, or delete the expose property of an entity in the YAML."""
    if not filepath or not os.path.exists(filepath):
         return False
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        in_entity_config = False
        in_target_entity = False
        
        target_entity_line_idx = -1
        expose_line_idx = -1
        other_prop_line_indices = []
        
        entity_config_indent = ""
        entity_indent = ""
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            if not stripped or stripped.startswith('#'):
                continue
                
            if stripped.startswith('entity_config:'):
                in_entity_config = True
                entity_config_indent = line[:len(line) - len(line.lstrip())]
                continue
                
            if in_entity_config and stripped.startswith(f"{entity_id}:") and not in_target_entity:
                in_target_entity = True
                target_entity_line_idx = i
                entity_indent = line[:len(line) - len(line.lstrip())]
                continue
                
            if in_target_entity:
                current_indent = len(line) - len(line.lstrip())
                if current_indent <= len(entity_indent) and not stripped.startswith('-'):
                    in_target_entity = False
                    continue
                    
                if stripped.startswith('expose:'):
                    expose_line_idx = i
                else:
                    other_prop_line_indices.append(i)

        if state == "default":
             if target_entity_line_idx != -1:
                 if expose_line_idx != -1:
                      if len(other_prop_line_indices) == 0:
                          # Both expose and the entity parent must be removed. Pop highest index first.
                          lines.pop(expose_line_idx)
                          lines.pop(target_entity_line_idx)
                      else:
                          lines.pop(expose_line_idx)
             else:
                 pass # Was already default
                 
        else:
            expose_str = "true" if state == "exposed" else "false"
            
            if expose_line_idx != -1:
                old_line = lines[expose_line_idx]
                indent = old_line[:len(old_line) - len(old_line.lstrip())]
                lines[expose_line_idx] = f"{indent}expose: {expose_str}\n"
                
            elif target_entity_line_idx != -1:
                 indent = lines[target_entity_line_idx][:len(lines[target_entity_line_idx]) - len(lines[target_entity_line_idx].lstrip())] + "  "
                 lines.insert(target_entity_line_idx + 1, f"{indent}expose: {expose_str}\n")
                 
            elif in_entity_config:
                 for i, line in enumerate(lines):
                     if line.strip().startswith('entity_config:'):
                         base_indent = line[:len(line) - len(line.lstrip())]
                         child_indent = base_indent + "  "
                         prop_indent = child_indent + "  "
                         
                         lines.insert(i + 1, f"{prop_indent}expose: {expose_str}\n")
                         lines.insert(i + 1, f"{child_indent}{entity_id}:\n")
                         break
                         
            else:
                 lines.append("\n  entity_config:\n")
                 lines.append(f"    {entity_id}:\n")
                 lines.append(f"      expose: {expose_str}\n")
                 
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
            
        return True
    except Exception as e:
        _LOGGER.error(f"Failed to write GAIA YAML entity update: {e}")
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
    """Handle get entities request and calculate three-state inheritance."""
    entity_reg = er.async_get(hass)
    entities = []

    yaml_path = get_google_assistant_yaml_path(hass)
    entity_configs, exposed_domains, expose_by_default = read_config_from_yaml(yaml_path)

    for entity_id, entry in entity_reg.entities.items():
        if entry.disabled_by or entry.hidden_by:
            continue
            
        domain = entry.domain
        
        # Calculate domain base inheritance
        domain_exposed = False
        if domain in exposed_domains:
             domain_exposed = True
        elif expose_by_default and not exposed_domains:
             # Typical HA behavior: if exposed_domains is empty but expose_by_default is true
             domain_exposed = True
             
        yaml_has_override = False
        override_value = None
        
        if entity_id in entity_configs:
             if 'expose' in entity_configs[entity_id]:
                 override_value = entity_configs[entity_id].get('expose')
                 yaml_has_override = True

        entities.append({
            "entity_id": entity_id,
            "domain": domain,
            "name": entry.name or entry.original_name or entity_id,
            "domain_exposed": domain_exposed,
            "yaml_has_override": yaml_has_override,
            "override_value": override_value,
            "icon": entry.icon or entry.original_icon
        })
        
    connection.send_result(msg["id"], entities)

@websocket_api.websocket_command(
    {
        vol.Required("type"): "gaia/update_exposure",
        vol.Required("entity_id"): str,
        vol.Required("state"): str, # 'default', 'exposed', 'hidden'
    }
)
@callback
def ws_update_exposure(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict):
    """Handle three-state entity update exposure request."""
    entity_id = msg["entity_id"]
    state = msg["state"]
    _LOGGER.info(f"Requested to set {entity_id} to {state} state via YAML")
    
    yaml_path = get_google_assistant_yaml_path(hass)
    success = update_yaml_exposure(yaml_path, entity_id, state)
    
    if success:
        hass.async_create_task(hass.services.async_call("google_assistant", "reload", blocking=False))
        
    connection.send_result(msg["id"], {"success": success, "entity_id": entity_id, "state": state})

@websocket_api.websocket_command(
    {
        vol.Required("type"): "gaia/update_domain_exposure",
        vol.Required("domain"): str,
        vol.Required("expose"): bool,
    }
)
@callback
def ws_update_domain_exposure(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict):
    """Handle domain commenting/uncommenting request."""
    domain = msg["domain"]
    should_expose = msg["expose"]
    _LOGGER.info(f"Requested to {'uncomment' if should_expose else 'comment'} {domain} under exposed_domains via YAML")
    
    yaml_path = get_google_assistant_yaml_path(hass)
    success = update_yaml_domain_exposure(yaml_path, domain, should_expose)
                 
    if success:
         hass.async_create_task(hass.services.async_call("google_assistant", "reload", blocking=False))
            
    connection.send_result(msg["id"], {"success": success, "domain": domain, "exposed": should_expose})

