# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-27
**Commit:** 51ef5ea
**Branch:** main

## OVERVIEW

Home Assistant custom integration (HACS-compatible) providing a React dashboard for managing Google Assistant entity exposure via YAML manipulation. Python backend + React/TypeScript frontend.

## STRUCTURE

```
GAIA/
├── custom_components/gaia/   # HA integration (Python backend + React frontend)
│   ├── __init__.py           # Integration setup, panel registration, static path
│   ├── api.py                # WebSocket API + YAML parsing engine (448 lines, core logic)
│   ├── config_flow.py        # Single-instance config flow (no user input)
│   ├── const.py              # Domain, version (0.4.7), panel config
│   ├── manifest.json         # HA metadata (requires HA 2024.1.0+)
│   └── frontend/             # React 18 + Vite 5 + TypeScript 5
│       ├── src/
│       │   ├── main.tsx      # Custom element <gaia-dashboard> definition
│       │   ├── App.tsx       # Main component (417 lines, all UI logic)
│       │   ├── useHass.ts    # HA WebSocket hook
│       │   └── styles.ts     # CSS-in-JS with CSS custom properties
│       └── dist/             # Built output (single index.js bundle)
├── test_domain.py            # Manual YAML parsing test (no framework)
├── hacs.json                 # HACS metadata
└── README.md                 # Setup docs with critical YAML requirement
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| YAML parsing/manipulation | `api.py` lines 25-82 | Custom regex parser — preserves comments PyYAML drops |
| Entity exposure toggle | `api.py` lines 179-302 | `update_yaml_exposure()` — handles 4 injection cases |
| Domain exposure toggle | `api.py` lines 84-177 | `update_yaml_domain_exposure()` — comment/uncomment lines |
| WebSocket endpoints | `api.py` lines 304-448 | 4 commands: get_entities, update_exposure, update_domain_exposure, batch_update |
| UI components/layout | `frontend/src/App.tsx` | Single-file React app — domain groups, search, toggles |
| HA connection/auth | `frontend/src/useHass.ts` | WebSocket hook for HA communication |
| Styling/theming | `frontend/src/styles.ts` | CSS variables `--gaia-*`, dark mode via `prefers-color-scheme` |
| Integration setup | `__init__.py` | Panel registration, static path, WS registration |
| Version bumping | `const.py` + `manifest.json` | **Both must be updated** (currently mismatched: 0.4.7 vs 0.1.0) |

## CONVENTIONS

- **Python**: snake_case functions, UPPER_SNAKE constants, HA async pattern (`async_setup_entry`)
- **TypeScript**: PascalCase components/interfaces, camelCase functions/state
- **CSS**: `--gaia-*` custom properties, `gaia-*` class prefix, `!important` required to override HA base theme
- **No linter/formatter configs** — relies on TypeScript `strict: true` only
- **Frontend build**: `npm run build` in `frontend/` → single `dist/index.js` served at `/gaia_frontend/`

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER use PyYAML `safe_load` for exposed_domains** — drops comments, losing commented-out domains
- **NEVER skip HA tag sanitization** — `!secret`, `!include` crash PyYAML; must replace before parsing
- **NEVER delete YAML lines low-index-first** — index shifting corrupts subsequent deletions; always pop highest index first
- **NEVER inject `exposed_domains` block if missing** — too complex without ruamel; code intentionally skips this case
- **NEVER omit `!important`** on toggle/slider styles — HA base theme strips custom colors aggressively
- **NEVER use `content-visibility: auto`** — previously caused severe scroll clipping, was removed

## CRITICAL SETUP GOTCHA

If `google_assistant:` config contains `expose_by_default`, `exposed_domains`, or `entity_config` in YAML, **HA locks both native UI and GAIA**. Users must strip config down to auth-only (project_id, service_account, report_state). See README.

## COMMANDS

```bash
# Frontend build
cd custom_components/gaia/frontend && npm install && npm run build

# Frontend dev server
cd custom_components/gaia/frontend && npm run dev

# Run YAML parsing test (manual, no framework)
python test_domain.py
```

## NOTES

- Version mismatch: `const.py` says 0.4.7, `manifest.json` says 0.1.0
- No CI/CD, no automated tests, no linting pipeline
- Frontend is a Web Component (`customElements.define`) — required for HA panel integration
- Batch updates read file once, mutate in-memory, write once — entity updates always write immediately
