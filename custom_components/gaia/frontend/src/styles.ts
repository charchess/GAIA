export const styles = `
:root {
    --gaia-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --gaia-primary: var(--primary-color, #03a9f4);
    --gaia-success: var(--success-color, #10b981);
    --gaia-danger: var(--error-color, #ef4444);
    --gaia-text: var(--primary-text-color, #1f2937);
    --gaia-text-sec: var(--secondary-text-color, #6b7280);
    --gaia-bg: #f9fafb;
    --gaia-card-bg: #ffffff;
    --gaia-border: #e5e7eb;
    --gaia-shadow-soft: rgba(0, 0, 0, 0.05);
    --gaia-shadow-medium: rgba(0, 0, 0, 0.1);
    --gaia-hover-overlay: rgba(0, 0, 0, 0.03);
}

@media (prefers-color-scheme: dark) {
    :root {
        --gaia-text: var(--primary-text-color, #f9fafb);
        --gaia-text-sec: var(--secondary-text-color, #9ca3af);
        --gaia-bg: #111827;
        --gaia-card-bg: #1f2937;
        --gaia-border: #374151;
        --gaia-shadow-soft: rgba(0, 0, 0, 0.2);
        --gaia-shadow-medium: rgba(0, 0, 0, 0.3);
        --gaia-hover-overlay: rgba(255, 255, 255, 0.03);
    }
}

* {
    box-sizing: border-box;
}

/* ===== Loading ===== */
.gaia-loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: var(--gaia-text);
    font-family: var(--gaia-font);
}

/* ===== App Shell ===== */
.gaia-app {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 56px);
    background-color: var(--gaia-bg);
    color: var(--gaia-text);
    font-family: var(--gaia-font);
}

/* ===== Header ===== */
.gaia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    background-color: var(--gaia-card-bg);
    flex-wrap: wrap;
    gap: 12px;
}

.gaia-header-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.gaia-header-title h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gaia-text);
    letter-spacing: -0.5px;
}

.gaia-header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

/* ===== Search ===== */
.gaia-search {
    display: flex;
    align-items: center;
    background: var(--gaia-bg);
    border: 1px solid var(--gaia-border);
    border-radius: 8px;
    padding: 0 12px;
    width: 280px;
}

.gaia-search input {
    border: none;
    background: transparent;
    padding: 10px;
    width: 100%;
    color: var(--gaia-text);
    outline: none;
    font-family: var(--gaia-font);
}

.gaia-search-icon {
    color: var(--gaia-text-sec);
}

/* ===== Buttons ===== */
.gaia-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid var(--gaia-border);
    background: var(--gaia-card-bg);
    color: var(--gaia-text);
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    font-family: var(--gaia-font);
}

.gaia-btn:hover {
    background: var(--gaia-bg);
}

/* ===== Debug Checkbox ===== */
.gaia-debug-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: var(--gaia-text-sec);
    cursor: pointer;
    user-select: none;
    font-family: var(--gaia-font);
}

.gaia-debug-toggle input[type="checkbox"] {
    accent-color: var(--gaia-primary);
    cursor: pointer;
}

/* ===== Main Content ===== */
.gaia-main-area {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
}

/* ===== Accordion Controls ===== */
.gaia-accordion-controls {
    padding: 0 32px 12px 32px;
    display: flex;
    gap: 16px;
    justify-content: flex-end;
}

.gaia-accordion-controls button {
    background: none;
    border: none;
    color: var(--gaia-primary);
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: var(--gaia-font);
}

/* ===== Accordions ===== */
.gaia-accordions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 32px;
}

.gaia-accordion {
    border: 1px solid var(--gaia-border);
    border-radius: 12px;
    background: var(--gaia-card-bg);
    overflow: hidden;
    box-shadow: 0 4px 6px -1px var(--gaia-shadow-soft);
}

.gaia-accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    cursor: pointer;
    background: var(--gaia-bg);
    border-left: 4px solid transparent;
    transition: background-color 0.2s, border-color 0.2s;
    user-select: none;
}

.gaia-accordion-header:hover {
    background: var(--gaia-hover-overlay);
}

.gaia-accordion-header.gaia-accordion-unsaved {
    border-left-color: var(--gaia-primary);
    background: rgba(3, 169, 244, 0.05);
}

.gaia-accordion-unsaved .gaia-accordion-title {
    font-weight: 800;
}

.gaia-accordion-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--gaia-text);
    text-transform: capitalize;
}

.gaia-accordion-count {
    background: var(--gaia-border);
    color: var(--gaia-text-sec);
    font-size: 0.8rem;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.gaia-accordion-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.gaia-accordion-content {
    background: var(--gaia-bg);
    border-top: 1px solid var(--gaia-border);
    padding: 20px;
}

/* ===== Responsive Grid ===== */
.gaia-grid-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

@media (min-width: 640px) {
    .gaia-grid-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .gaia-grid-container {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1440px) {
    .gaia-grid-container {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* ===== Entity Cards ===== */
.gaia-entity-card {
    background: var(--gaia-card-bg);
    border: 1px solid var(--gaia-border);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 1px 3px var(--gaia-shadow-soft);
    transition: transform 0.2s, box-shadow 0.2s;
}

.gaia-entity-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px var(--gaia-shadow-medium);
    border-color: var(--gaia-primary);
}

.gaia-entity-name {
    font-weight: 600;
    font-size: 1rem;
    color: var(--gaia-text);
    line-height: 1.3;
    word-break: break-word;
    transition: color 0.2s;
}

.gaia-entity-unsaved .gaia-entity-name {
    font-weight: 800;
    color: var(--gaia-primary);
}

.gaia-entity-debug {
    font-size: 11px;
    color: var(--gaia-text-sec);
    margin-top: 4px;
    font-family: monospace;
}

/* ===== Status Badges ===== */
.gaia-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

.gaia-status-exposed {
    background: rgba(16, 185, 129, 0.1);
    color: var(--gaia-success);
}

.gaia-status-hidden {
    background: rgba(107, 114, 128, 0.1);
    color: var(--gaia-text-sec);
}

/* ===== Toggle Switches ===== */

/* Base Slim Switch (entity + domain) */
.gaia-slim-switch {
    position: relative;
    width: 80px;
    height: 28px;
    border-radius: 14px;
    border: none;
    background-color: var(--gaia-border);
    cursor: pointer;
    padding: 0;
    transition: background-color 0.3s;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
    overflow: hidden;
}

/* Thumb */
.gaia-slim-switch .slider-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 2;
}

/* Text inside toggle */
.gaia-slim-switch .gaia-toggle-text {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    z-index: 1;
    transition: opacity 0.2s;
    white-space: nowrap;
    pointer-events: none;
    color: var(--gaia-text-sec);
    /* Default (thumb left): text on right */
    right: 8px;
    left: auto;
}

/* Overridden (thumb right): text on left */
.gaia-slim-switch.overridden .slider-thumb {
    transform: translateX(52px);
}

.gaia-slim-switch.overridden .gaia-toggle-text {
    left: 7px;
    right: auto;
    color: white;
}

/* Entity Override Colors */
.gaia-slim-switch.overridden.override-exposed {
    background-color: var(--gaia-success) !important;
}

.gaia-slim-switch.overridden.override-hidden {
    background-color: var(--gaia-danger) !important;
}

/* ===== Domain Toggle ===== */
/* Wider, always colored: red=hidden, green=exposed */
.gaia-domain-switch {
    width: 90px;
    height: 30px;
    border-radius: 15px;
    background-color: var(--gaia-danger) !important;
}

.gaia-domain-switch .slider-thumb {
    top: 4px;
    left: 4px;
    width: 22px;
    height: 22px;
}

.gaia-domain-switch .gaia-toggle-text {
    color: white;
    font-size: 9px;
}

.gaia-domain-switch.overridden.override-exposed {
    background-color: var(--gaia-success) !important;
}

.gaia-domain-switch.overridden .slider-thumb {
    transform: translateX(60px);
}

/* Dark mode thumb */
@media (prefers-color-scheme: dark) {
    .gaia-slim-switch .slider-thumb {
        background-color: #d1d5db;
    }
}

/* ===== Override Badge ===== */
.override-badge {
    font-size: 0.65rem;
    background: rgba(3, 169, 244, 0.1);
    color: var(--gaia-primary);
    padding: 2px 6px;
    border-radius: 8px;
    font-weight: 700;
    border: 1px solid rgba(3, 169, 244, 0.2);
}

/* ===== Animations ===== */
.gaia-spin {
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}

.gaia-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* ===== Error & Empty States ===== */
.gaia-error-banner {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--gaia-danger);
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    border: 1px solid rgba(239, 68, 68, 0.2);
}

.gaia-empty-state {
    text-align: center;
    padding: 64px;
    color: var(--gaia-text-sec);
}

.gaia-empty-state h3 {
    margin: 0 0 8px 0;
    color: var(--gaia-text);
}

/* ===== Save FAB ===== */
.gaia-save-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    animation: gaiaFabIn 0.3s ease-out;
}

.gaia-save-fab button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 24px;
    border: 1px solid var(--gaia-border);
    background-color: var(--gaia-card-bg);
    color: var(--gaia-text);
    font-size: 15px;
    font-weight: 600;
    font-family: var(--gaia-font);
    cursor: pointer;
    box-shadow: 0 4px 12px var(--gaia-shadow-medium);
    transition: transform 0.2s, box-shadow 0.2s;
}

.gaia-save-fab button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px var(--gaia-shadow-medium);
}

.gaia-save-fab button:disabled {
    cursor: wait;
    opacity: 0.8;
}

@keyframes gaiaFabIn {
    0% { transform: translateY(20px) scale(0.9); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
    .gaia-header {
        padding: 16px;
    }

    .gaia-search {
        width: 100%;
        order: 10;
    }

    .gaia-main-area {
        padding: 16px;
    }

    .gaia-accordions-wrapper {
        padding: 16px;
    }

    .gaia-accordion-controls {
        padding: 0 16px 12px 16px;
    }

    .gaia-accordion-header {
        flex-wrap: wrap;
        gap: 12px;
    }

    .gaia-accordion-actions {
        width: 100%;
        justify-content: flex-end;
    }

    .gaia-empty-state {
        padding: 32px;
    }

    .gaia-save-fab {
        bottom: 16px;
        right: 16px;
    }
}
`;
