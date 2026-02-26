"""WebSocket API for GAIA."""
import logging
import voluptuous as vol

from homeassistant.core import HomeAssistant, callback
from homeassistant.components import websocket_api
from homeassistant.helpers import entity_registry as er

_LOGGER = logging.getLogger(__name__)

@callback
def async_register_websockets(hass: HomeAssistant):
    """Register WebSocket API endpoints."""
    websocket_api.async_register_command(hass, ws_get_entities)
    websocket_api.async_register_command(hass, ws_update_exposure)

@websocket_api.websocket_command(
    {
        vol.Required("type"): "gaia/get_entities",
    }
)
@callback
def ws_get_entities(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict):
    """Handle get entities request.
    
    This command will fetch all entities and cross-reference them with Google Assistant configuration.
    """
    entity_reg = er.async_get(hass)
    entities = []

    # TODO: Fetch google_assistant specific entity configs to see what is exposed
    # For now, we just list entities from the registry
    for entity_id, entry in entity_reg.entities.items():
        if entry.disabled_by or entry.hidden_by:
            continue
            
        # Simplified example structure
        entities.append({
            "entity_id": entity_id,
            "domain": entry.domain,
            "name": entry.name or entry.original_name or entity_id,
            "exposed": False, # TODO: determine real exposure status
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
    """Handle update exposure request.
    
    This command will update the entity's exposure settings for Google Assistant.
    """
    entity_id = msg["entity_id"]
    expose = msg["expose"]
    
    _LOGGER.info(f"Requested to {'expose' if expose else 'hide'} {entity_id} to Google Assistant")
    
    # TODO: Actually mutate the Google Assistant config entry / YAML state
    
    connection.send_result(msg["id"], {"success": True, "entity_id": entity_id, "exposed": expose})
