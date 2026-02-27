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
}

@media (prefers-color-scheme: dark) {
    :root {
        --gaia-text: var(--primary-text-color, #f9fafb);
        --gaia-text-sec: var(--secondary-text-color, #9ca3af);
        --gaia-bg: #111827;
        --gaia-card-bg: #1f2937;
        --gaia-border: #374151;
    }
}

* {
    box-sizing: border-box;
}

.gaia-loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: var(--gaia-text);
    font-family: var(--gaia-font);
}

.gaia-app {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 56px);
    background-color: var(--gaia-bg);
    color: var(--gaia-text);
    font-family: var(--gaia-font);
}

.gaia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    background-color: var(--gaia-card-bg);
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
    gap: 16px;
}

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

.gaia-domain-select {
    padding: 8px 36px 8px 12px;
    border-radius: 8px;
    border: 1px solid var(--gaia-border);
    background-color: var(--gaia-bg);
    color: var(--gaia-text);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    font-family: var(--gaia-font);
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    transition: all 0.2s;
}

.gaia-domain-select:hover {
    border-color: var(--gaia-primary);
}

.gaia-domain-select:focus {
    border-color: var(--gaia-primary);
    box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2);
}

.gaia-main-area {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
}

.gaia-card {
    background: var(--gaia-card-bg);
    border-radius: 12px;
    border: 1px solid var(--gaia-border);
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Global Mode Switch */
.gaia-card-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--gaia-border);
    background-color: rgba(0, 0, 0, 0.02);
}

.gaia-global-switch {
    display: flex;
    align-items: center;
    gap: 16px;
}

.gaia-global-label {
    font-weight: 600;
    color: var(--gaia-text);
}

.gaia-global-desc {
    margin: 0 0 0 auto;
    font-size: 0.85rem;
    color: var(--gaia-text-sec);
}

/* Accordions & Grid System */
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
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.gaia-accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    cursor: pointer;
    background: var(--gaia-card-bg);
    transition: background-color 0.2s;
    user-select: none;
}

.gaia-accordion-header:hover {
    background: var(--gaia-bg);
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

/* CSS Grid for Entity Cards */
.gaia-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
}

.gaia-entity-card {
    background: var(--gaia-card-bg);
    border: 1px solid var(--gaia-border);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
}

.gaia-entity-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    border-color: var(--gaia-primary);
}

.gaia-entity-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
}

.gaia-entity-name {
    font-weight: 600;
    font-size: 1rem;
    color: var(--gaia-text);
    line-height: 1.3;
    word-break: break-word;
}

.gaia-entity-card-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px dashed var(--gaia-border);
}

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

/* Switches */
.gaia-switch-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 12px;
}

.gaia-switch {
    display: inline-flex;
    align-items: center;
    position: relative;
    width: 96px;
    height: 36px;
    border: none;
    padding: 0;
    outline: none;
    border-radius: 36px;
    cursor: pointer;
    background-color: var(--gaia-border);
    transition: background-color 0.3s;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.gaia-slider {
    position: absolute;
    width: 28px;
    height: 28px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 2;
}

.gaia-switch-text {
    position: absolute;
    width: 60px;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--gaia-text-sec);
    right: 4px;
    transition: 0.3s;
    z-index: 1;
}

.gaia-switch.checked .gaia-slider {
    transform: translateX(60px);
}

.gaia-switch.checked .gaia-switch-text {
    right: auto;
    left: 4px;
    color: white;
}

.gaia-switch.checked {
    background-color: var(--gaia-success);
}

.gaia-switch.global {
    width: 106px;
}

.gaia-switch.global.checked {
    background-color: var(--gaia-primary);
}

.gaia-switch.global .gaia-switch-text {
    width: 70px;
}

.gaia-switch.global.checked .gaia-slider {
    transform: translateX(70px);
}

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
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

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

.gaia-switch-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 12px;
}

.gaia-switch-label {
    font-size: 0.75rem;
    color: var(--gaia-text-sec);
    font-weight: 500;
    transition: color 0.2s;
    width: 50px;
    text-align: center;
}

.gaia-switch-label.active {
    color: var(--gaia-text);
    font-weight: 700;
}

.gaia-switch-label.active-exposed {
    color: var(--gaia-primary);
    font-weight: 700;
}

.gaia-switch-label.active-hidden {
    color: var(--gaia-text-sec);
    font-weight: 700;
}

.gaia-slim-switch {
    position: relative;
    width: 44px;
    height: 24px;
    border-radius: 12px;
    border: none;
    background-color: var(--gaia-border);
    cursor: pointer;
    padding: 0;
    transition: background-color 0.3s;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.gaia-slim-switch .slider-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.gaia-slim-switch.overridden.override-exposed {
    background-color: var(--gaia-primary);
}

.gaia-slim-switch.overridden.override-hidden {
    background-color: var(--gaia-text-sec);
}

.gaia-slim-switch.overridden .slider-thumb {
    transform: translateX(20px);
}

@media (prefers-color-scheme: dark) {
    .gaia-slim-switch .slider-thumb {
        background-color: #d1d5db;
    }
    .gaia-slim-switch.overridden.override-hidden {
        background-color: #4b5563;
    }
}

.override-badge {
    font-size: 0.65rem;
    background: rgba(3, 169, 244, 0.1); /* Fallback tint, overridden if ha-primary-color exists */
    color: var(--gaia-primary);
    padding: 2px 6px;
    border-radius: 8px;
    font-weight: 700;
    border: 1px solid rgba(3, 169, 244, 0.2);
}
`;
