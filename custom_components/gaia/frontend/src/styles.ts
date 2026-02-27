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

/* Horizontal Tabs Menu */
.gaia-tabs-container {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    padding: 12px 32px 12px 32px;
    background-color: var(--gaia-card-bg);
    border-bottom: 1px solid var(--gaia-border);
    overflow-x: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

.gaia-tabs-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
}

.gaia-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border: 1px solid transparent;
    border-radius: 20px;
    background: transparent;
    color: var(--gaia-text-sec);
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: var(--gaia-font);
    white-space: nowrap;
}

.gaia-tab:hover {
    color: var(--gaia-text);
    background: var(--gaia-bg);
}

.gaia-tab.active {
    color: var(--gaia-primary);
    background: rgba(3, 169, 244, 0.1); /* Fallback tint, overridden if ha-primary-color exists */
    border-color: rgba(3, 169, 244, 0.2);
    font-weight: 600;
}

.gaia-tab-badge {
    background: var(--gaia-border);
    color: var(--gaia-text-sec);
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
}

.gaia-tab.active .gaia-tab-badge {
    background: rgba(3, 169, 244, 0.1);
    color: var(--gaia-primary);
}

/* Epic 4: Domain Tab Alert Colors */
.gaia-tab.tab-red { border-color: rgba(239, 83, 80, 0.3); color: #ef5350; }
.gaia-tab.tab-orange { border-color: rgba(255, 152, 0, 0.3); color: #ff9800; }
.gaia-tab.tab-lightgreen { border-color: rgba(129, 199, 132, 0.3); color: #81c784; }
.gaia-tab.tab-darkgreen { border-color: rgba(76, 175, 80, 0.3); color: #4CAF50; }

.gaia-tab.tab-red.active { background: #ef5350; color: white; border-color: #ef5350; }
.gaia-tab.tab-orange.active { background: #ff9800; color: white; border-color: #ff9800; }
.gaia-tab.tab-lightgreen.active { background: #81c784; color: white; border-color: #81c784; }
.gaia-tab.tab-darkgreen.active { background: #4CAF50; color: white; border-color: #4CAF50; }

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

.gaia-segment-control {
    display: flex;
    background: var(--gaia-bg);
    border-radius: 8px;
    padding: 4px;
    border: 1px solid var(--gaia-border);
}

.gaia-segment-btn {
    padding: 6px 16px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--gaia-text-sec);
    cursor: pointer;
    font-weight: 600;
    font-family: var(--gaia-font);
    transition: all 0.2s;
}

.gaia-segment-btn.active-hide {
    background: var(--gaia-card-bg);
    color: var(--gaia-text);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.gaia-segment-btn.active-expose {
    background: var(--gaia-card-bg);
    color: var(--gaia-text);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.gaia-global-desc {
    margin: 0 0 0 auto;
    font-size: 0.85rem;
    color: var(--gaia-text-sec);
}

.gaia-table-container {
    overflow-x: auto;
}

.gaia-table {
    width: 100%;
    border-collapse: collapse;
}

.gaia-table th {
    text-align: left;
    padding: 12px 24px;
    color: var(--gaia-text-sec);
    font-size: 0.8rem;
    text-transform: uppercase;
    border-bottom: 1px solid var(--gaia-border);
}

.gaia-table td {
    padding: 16px 24px;
    border-bottom: 1px solid var(--gaia-border);
    vertical-align: middle;
}

.gaia-table tr:hover td {
    background: rgba(0, 0, 0, 0.02);
}

.gaia-entity-name {
    font-weight: 600;
    font-size: 1.05rem;
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
