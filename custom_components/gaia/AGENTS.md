# GAIA INTEGRATION

## OVERVIEW

Home Assistant integration: Python WebSocket API manipulates `google_assistant` YAML config; React frontend renders entity dashboard as HA panel.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| YAML path resolution | `api.py:13-23` | Checks `google_assistant.yaml` first, falls back to `configuration.yaml` |
| Comment-preserving parse | `api.py:25-82` | Regex-based; iterates lines tracking indent + block boundaries |
| Domain toggle (comment/uncomment) | `api.py:84-177` | Rewrites line with strict indentation; injects under block if missing |
| Entity exposure (4 cases) | `api.py:179-302` | default→remove, exposed/hidden→update or inject at 3 levels |
| Three-state inheritance | `api.py:318-358` | domain_exposed → yaml_has_override → override_value |
| Batch write optimization | `api.py:411-448` | Single file read, in-memory mutations, single write |
| Panel registration | `__init__.py` | `async_register_built_in_panel` + static path at `/gaia_frontend/` |
| Custom element mount | `frontend/src/main.tsx` | `customElements.define("gaia-dashboard", ...)` — HA requirement |
| All UI logic | `frontend/src/App.tsx` | Domain groups, search, toggles, batch save — single component |
| HA WebSocket hook | `frontend/src/useHass.ts` | Wraps `home-assistant-js-websocket` for React |
| Theme system | `frontend/src/styles.ts` | `--gaia-*` vars, `prefers-color-scheme` dark mode |

## YAML MANIPULATION ENGINE

Four entity injection cases in `update_yaml_exposure()`:
1. **expose line exists** → overwrite value in-place
2. **entity block exists, no expose** → insert `expose:` after entity line
3. **entity_config exists, entity missing** → inject entity + expose under `entity_config:`
4. **no entity_config** → inject full `entity_config:` block under `google_assistant:`

Domain toggle in `update_yaml_domain_exposure()`:
- Expose → uncomment: `# - light` → `  - light` (strict indent rewrite)
- Hide → comment: `  - light` → `  # - light` (strict indent rewrite)
- Missing domain → inject new line after `exposed_domains:`
- Missing `exposed_domains:` block → **no-op** (intentional limitation)

## FRONTEND ARCHITECTURE

- **Web Component**: `<gaia-dashboard>` custom element wrapping React root — required for HA panel system
- **Single-component app**: `App.tsx` contains all state, effects, and UI (no routing)
- **WebSocket commands**: `gaia/get_entities`, `gaia/update_exposure`, `gaia/update_domain_exposure`, `gaia/batch_update_exposures`
- **Icons**: `lucide-react` for UI, `mdi:google-assistant` for HA sidebar
- **Build**: Vite → single `dist/index.js`, base path `/gaia_frontend/`, versioned via query param `?v={VERSION}`

## ANTI-PATTERNS (ADDITIONS TO ROOT)

- **NEVER use optimistic UI** — was removed; always use backend JSON response as source of truth
- **NEVER assume `google_assistant.yaml` exists** — `get_google_assistant_yaml_path()` falls back to `configuration.yaml`
- **NEVER write file in batch mode** — `update_yaml_exposure`/`update_yaml_domain_exposure` accept `lines` param; batch caller owns the final write
