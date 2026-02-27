# GAIA — Google Assistant Integration Administrator

> **AI-Generated Software** — This entire project — code, architecture, and documentation — was designed and produced by artificial intelligence (Claude / Anthropic). It is provided **as-is, with absolutely no warranty**, express or implied. Use at your own risk. The authors accept no responsibility for data loss, misconfiguration, or any damage resulting from the use of this software. **Always back up your YAML files before using GAIA.**

---

## The Problem

Home Assistant offers two ways to connect Google Assistant:

| | **Nabu Casa (Cloud)** | **Manual Setup (YAML)** |
|---|---|---|
| **Cost** | ~75 €/year subscription | Free (self-hosted) |
| **Setup** | UI-based, one click | Google Cloud project, service account, OAuth |
| **Entity exposure UI** | Full per-entity toggles in *Settings → Voice Assistants → Expose* | **Disabled / Hidden** |
| **Changing exposure** | Toggle in the UI, instant sync | Edit YAML, restart Home Assistant |

When you configure `google_assistant:` manually in YAML, Home Assistant **disables the native exposure UI entirely**. The "Expose" tab in *Settings → Voice Assistants* is [reserved for Nabu Casa users](https://github.com/home-assistant/core/issues/92445). Specifically, the presence of `exposed_domains`, `entity_config`, or `expose_by_default` in your YAML means:

- No per-entity toggle in the UI
- No domain-level control in the UI
- Every change requires manually editing YAML and restarting HA

This forces manual users to maintain long, error-prone YAML files with hundreds of entity IDs — a tedious process that scales poorly as your smart home grows.

## The Solution

**GAIA restores the graphical exposure management experience for manual Google Assistant users.**

It provides a dedicated React dashboard inside Home Assistant that reads and writes a `google_assistant.yaml` file — giving you the same domain and per-entity control that Nabu Casa users enjoy, without the subscription.

### How It Works

GAIA operates on a standalone **`google_assistant.yaml`** file that you `!include` from your main `configuration.yaml`. It never touches `configuration.yaml` directly.

| YAML Section | What GAIA controls |
|---|---|
| `exposed_domains` | Which domains (light, switch, climate…) are exposed by default |
| `entity_config` | Per-entity overrides (`expose: true` / `expose: false`) |

GAIA uses a custom line-based YAML parser that **preserves comments and formatting** — it does not use PyYAML, which would strip comments and break `!secret` / `!include` tags.

## Who Is This For?

You need GAIA if:

- ✅ You use the **manual** `google_assistant:` integration (not Nabu Casa)
- ✅ You want to **control entity exposure from a UI** instead of editing YAML by hand
- ✅ You have **dozens or hundreds of entities** and managing them in YAML is painful
- ✅ You want domain-level defaults with per-entity exceptions
- ✅ You prefer **keeping your config in YAML files** (version-controllable, auditable)

You do **not** need GAIA if:

- ❌ You use **Nabu Casa / Home Assistant Cloud** — you already have the Expose UI
- ❌ You have very few entities and YAML editing is manageable

## Setup

### 1. Create `google_assistant.yaml`

Create this file in your Home Assistant config directory (`/config/`):

```yaml
# Google Assistant exposure — managed by GAIA
# Authentication (project_id, service_account, report_state) belongs
# in configuration.yaml, NOT here.

exposed_domains:
  - light
  - switch
  - climate
  # - cover
  # - media_player
  # - camera
  # Comment/uncomment domains as needed
```

### 2. Include it from `configuration.yaml`

```yaml
google_assistant:
  project_id: your-project-id
  service_account: !include service_account.json
  report_state: true
  # Everything below is managed by GAIA via google_assistant.yaml:
  <<: !include google_assistant.yaml
```

The `<<: !include` merge syntax imports the contents of `google_assistant.yaml` as if they were written inline under `google_assistant:`.

### 3. Install GAIA

#### HACS (Recommended)

1. Open **HACS** → **Integrations** → three dots → **Custom repositories**
2. Add `https://github.com/charchess/GAIA` as **Integration**
3. Search "GAIA" → **Download**
4. Restart Home Assistant
5. **Settings → Devices & Services → Add Integration** → search "GAIA"
6. The **GAIA Exposure** panel appears in your sidebar

#### Manual

1. Download this repository as ZIP
2. Copy `custom_components/gaia` into your HA `custom_components/` directory
3. Restart Home Assistant
4. Add the integration via Settings

## Features

- **Domain Toggles** — Expose (green) or Hide (red) entire domains with one click
- **Exception Model** — Toggle individual entities as exceptions to their domain default:
  - Grey = follows domain default
  - Red = forced hidden (on an exposed domain)
  - Green = forced exposed (on a hidden domain)
- **Smart Inversion** — When you flip a domain, entity exceptions are automatically inverted to preserve your intent
- **Batch Save** — All changes are staged locally and written in a single operation
- **Reset** — Discard all unsaved changes with one click
- **Entity Control** — Click any entity name to open its Home Assistant control dialog
- **Debug Mode** — Show entity IDs for troubleshooting
- **Live Search** — Filter entities by name in real time
- **Dark Mode** — Automatic, follows your system preference
- **YAML-Safe** — Comments, formatting, and `!include`/`!secret` tags are preserved

## Limitations

- GAIA **only reads and writes `google_assistant.yaml`**. It never modifies `configuration.yaml`.
- GAIA **cannot create the `exposed_domains:` block** if it's missing from the YAML file. You must provide at least the skeleton shown above.
- If `google_assistant.yaml` doesn't exist, GAIA falls back to looking for config in `configuration.yaml` directly — this works but is not recommended.
- GAIA **does not sync with Google**. It configures which entities HA *offers* to Google Assistant. The actual sync is handled by the official `google_assistant` integration.
- After saving changes in GAIA, you may need to **restart HA or reload the integration** for Google to pick up the new exposure settings.

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
