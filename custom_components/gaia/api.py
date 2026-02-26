"""WebSocket API for GAIA."""
import logging
import voluptuous as vol

from homeassistant.core import HomeAssistant, callback
from homeassistant.components import websocket_api
from homeassistant.helpers import entity_registry as er
from homeassistant.components.homeassistant.exposed_entities import (
    async_expose_entity,
    async_should_expose,
)

_LOGGER = logging.getLogger(__name__)

ASSISTANT_ID = "google_assistant"

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
    """Handle get entities request and populate real exposed status."""
    entity_reg = er.async_get(hass)
    entities = []

    for entity_id, entry in entity_reg.entities.items():
        if entry.disabled_by or entry.hidden_by:
            continue
            
        is_exposed = async_should_expose(hass, ASSISTANT_ID, entity_id)

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
    _LOGGER.info(f"Requested to {'expose' if should_expose else 'hide'} {entity_id} to Google Assistant")
    
    # Mutate the Home Assistant native exposed entities registry
    async_expose_entity(hass, ASSISTANT_ID, entity_id, should_expose)
    
    connection.send_result(msg["id"], {"success": True, "entity_id": entity_id, "exposed": should_expose})

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
    _LOGGER.info(f"Requested to bulk set {domain} domain to {'expose' if should_expose else 'hide'}")
    
    entity_reg = er.async_get(hass)
    
    # Iterate all entities and expose/hide those matching the requested domain
    for entity_id, entry in entity_reg.entities.items():
        if entry.disabled_by or entry.hidden_by:
            continue
            
        if entry.domain == domain:
            async_expose_entity(hass, ASSISTANT_ID, entity_id, should_expose)
            
    connection.send_result(msg["id"], {"success": True, "domain": domain, "exposed": should_expose})
