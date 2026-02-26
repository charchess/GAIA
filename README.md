# GAIA - Google Assistant Integration Administrator

GAIA is a modern, responsive, and easy-to-use custom panel for Home Assistant to manage which entities are exposed to Google Assistant.

## Features

- **Beautiful React Dashboard**: Clean "glassmorphism" UI with dark/light mode support.
- **Dynamic Inventory**: Automatically groups your entities by domain (`light`, `switch`, `climate`, etc.) using a wrapping tab grid with official `lucide-react` icons.
- **Live Search & Filter**: Easily find the exact entity you want to expose or hide.
- **Global Domain Overrides**: Set a domain to "EXPOSE" or "HIDE" by default using the massive blue toggle switch.
- **One-Click Exceptions**: Use the custom-built, physical-styled text toggles to create individual exceptions (Red/Green or Grey/Black depending on the Global Mode) for each entity.

![GAIA Dashboard Preview](preview.png)

## Installation via HACS (Recommended)

1. Open HACS in your Home Assistant instance.
2. Click on **Integrations**.
3. Click the three dots in the top right corner and select **Custom repositories**.
4. Add the repository URL `https://github.com/charchess/GAIA` and select **Integration** as the category.
5. Click **Add**, then search for "GAIA" and install it.
6. Restart Home Assistant.
7. Go to **Settings > Devices & Services > Add Integration** and search for "GAIA" to set it up.

## Manual Installation

1. Download the repository.
2. Copy the `custom_components/gaia` directory into your Home Assistant `custom_components` directory.
3. Restart Home Assistant.
4. Go to **Settings > Devices & Services > Add Integration** and search for "GAIA" to set it up.
