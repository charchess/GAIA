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
    """Handle get entities request."""
    entity_reg = er.async_get(hass)
    entities = []

    # TODO: Fetch true google_assistant specific entity configs
    for entity_id, entry in entity_reg.entities.items():
        if entry.disabled_by or entry.hidden_by:
            continue
            
        # Simplified example structure - random exposure for dev testing
        # We store domain exposure defaults in hass.data in a real impl
        entities.append({
            "entity_id": entity_id,
            "domain": entry.domain,
            "name": entry.name or entry.original_name or entity_id,
            "exposed": False, # Real exposure status goes here
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
    expose = msg["expose"]
    _LOGGER.info(f"Requested to {'expose' if expose else 'hide'} {entity_id} to Google Assistant")
    # TODO: Mutate the Google Assistant config entry
    connection.send_result(msg["id"], {"success": True, "entity_id": entity_id, "exposed": expose})

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
    expose = msg["expose"]
    _LOGGER.info(f"Requested to set {domain} domain default to {'expose' if expose else 'hide'}")
    # TODO: Mutate the Google Assistant global domain config
    connection.send_result(msg["id"], {"success": True, "domain": domain, "exposed": expose})
