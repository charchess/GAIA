# GAIA — Google Assistant Integration Administrator

> **AI-Generated Software** — This project was entirely designed and coded by artificial intelligence (Claude / Anthropic). It is provided **as-is, with absolutely no warranty** — express or implied. Use at your own risk. The authors accept no responsibility for data loss, misconfiguration, or any damage resulting from the use of this software. **Always back up your YAML files before using GAIA.**

---

GAIA is a custom Home Assistant integration that provides a React dashboard to manage which entities are exposed to Google Assistant. It works by directly reading and writing a dedicated **`google_assistant.yaml`** file.

## How It Works

GAIA does **not** use the Home Assistant database for exposure settings. Instead, it manipulates a standalone YAML file (`google_assistant.yaml`) that you include from your main `configuration.yaml`. This means:

- All changes are transparent and version-controllable
- You always have a human-readable file you can edit manually if needed
- GAIA never touches your `configuration.yaml` directly

### What GAIA Controls

| Section | What it does |
|---------|-------------|
| `exposed_domains` | Which domains (light, switch, climate...) are exposed by default |
| `entity_config` | Per-entity overrides (`expose: true/false`) |

GAIA preserves YAML comments and formatting — it uses a custom line-based parser, not PyYAML.

## Prerequisites

### 1. Create `google_assistant.yaml`

Create a file named `google_assistant.yaml` in your Home Assistant config directory (`/config/` or wherever your `configuration.yaml` lives).

Minimal starting content:

```yaml
# Google Assistant configuration managed by GAIA
# Do not add project_id, service_account, or report_state here —
# those belong in configuration.yaml

exposed_domains:
  - light
  - switch
  - climate
  # - cover
  # - media_player
  # Add or comment out domains as needed
```

### 2. Include it from `configuration.yaml`

In your `configuration.yaml`, use `!include` to reference the file:

```yaml
google_assistant:
  project_id: your-project-id
  service_account: !include service_account.json
  report_state: true
  # GAIA manages everything below via google_assistant.yaml:
  <<: !include google_assistant.yaml
```

> **Important:** The `<<: !include` merge syntax imports the contents of `google_assistant.yaml` as if they were written inline under `google_assistant:`. This is the supported YAML merge pattern for Home Assistant.

### 3. Restart Home Assistant

After creating the file and updating `configuration.yaml`, restart Home Assistant for the changes to take effect.

## Installation

### Method 1: HACS (Recommended)

1. Open **HACS** in your Home Assistant instance.
2. Go to **Integrations** → three dots menu → **Custom repositories**.
3. Add `https://github.com/charchess/GAIA` as an **Integration**.
4. Search for "GAIA" and click **Download**.
5. Restart Home Assistant.
6. Go to **Settings → Devices & Services → Add Integration**, search for "GAIA".
7. The **GAIA Exposure** panel appears in your sidebar.

### Method 2: Manual

1. Download this repository as a ZIP.
2. Extract the `custom_components/gaia` folder into your HA `custom_components/` directory.
3. Restart Home Assistant.
4. Add the integration via **Settings → Devices & Services**.

## Features

- **Domain Toggles** — Set entire domains to Exposed (green) or Hidden (red) with a single click.
- **Entity Exception Model** — Toggle individual entities as exceptions to their domain default. Grey = follows domain, red = forced hidden, green = forced exposed.
- **Exception Persistence** — When you flip a domain, entity exceptions are automatically inverted to preserve their intent.
- **Batch Save** — All changes are staged locally and saved in a single write to `google_assistant.yaml`.
- **Reset** — Discard all unsaved changes with one click.
- **Entity Control** — Click any entity name to open its Home Assistant control dialog.
- **Debug Mode** — Toggle entity ID visibility for troubleshooting.
- **Search** — Filter entities by name in real time.
- **Dark Mode** — Follows your system/browser preference.
- **YAML-Safe** — Comments and formatting are preserved. No data is ever lost.

## Important Limitations

- GAIA **only reads and writes `google_assistant.yaml`**. It does not modify `configuration.yaml`.
- If `google_assistant.yaml` does not exist or is not included, GAIA will fall back to looking for `google_assistant:` configuration directly in `configuration.yaml`, but this is not the recommended setup.
- GAIA **cannot create the `exposed_domains:` block from scratch** if it's missing from the YAML. You must add at least a skeleton (see Prerequisites above).
- GAIA does **not** sync with Google — it only configures which entities Home Assistant *offers* to Google Assistant. The actual sync is handled by the official `google_assistant` integration.

## Disclaimer

> **This software is AI-generated and provided without warranty of any kind.**
>
> - It has **not been audited** for security, reliability, or correctness.
> - It directly **modifies YAML configuration files** on your system.
> - Bugs may cause **loss of configuration data** or unexpected behavior.
> - **Always maintain backups** of your `google_assistant.yaml` and `configuration.yaml`.
> - The authors and contributors — human or artificial — accept **no liability** for any damage, data loss, or misconfiguration caused by this software.
>
> By using GAIA, you acknowledge these risks and accept full responsibility.

## License

MIT — see [LICENSE](LICENSE) for details.
