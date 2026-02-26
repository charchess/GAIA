"""The GAIA - Google Assistant Integration Administrator integration.

This component provides an advanced dashboard to manage entity exposure to Google Assistant.
"""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.components.http import StaticPathConfig

from .api import async_register_websockets
from .const import DOMAIN, DOMAIN_VERSION, PANEL_NAME, PANEL_TITLE, PANEL_ICON, PANEL_URL_PATH

_LOGGER = logging.getLogger(__name__)

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the GAIA component."""
    _LOGGER.info("Setting up GAIA component")
    
    # Register websocket API commands
    async_register_websockets(hass)

    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up GAIA from a config entry."""
    # Register websocket API commands
    async_register_websockets(hass)

    # Register the frontend panel
    await hass.http.async_register_static_paths([
        StaticPathConfig("/gaia_frontend", hass.config.path("custom_components/gaia/frontend/dist"), False)
    ])

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=PANEL_URL_PATH,
        config={
            "_panel_custom": {
                "name": PANEL_NAME,
                "embed_iframe": False,
                "trust_external": False,
                "module_url": f"/gaia_frontend/index.js?v={DOMAIN_VERSION}",
            }
        },
        require_admin=True,
    )
    
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Remove panel
    hass.components.frontend.async_remove_panel(PANEL_URL_PATH)
    return True
