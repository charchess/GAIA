import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import styles from './index.css?inline'

class GaiaDashboard extends HTMLElement {
    private _hass: any;
    private _panel: any;
    private root: ReactDOM.Root | null = null;

    set hass(hass: any) {
        this._hass = hass;
        this.render();
    }

    set panel(panel: any) {
        this._panel = panel;
        this.render();
    }

    connectedCallback() {
        if (!this.querySelector('#gaia-dashboard-inline-style')) {
            const styleTemplate = document.createElement('style');
            styleTemplate.id = 'gaia-dashboard-inline-style';
            styleTemplate.textContent = styles;
            this.appendChild(styleTemplate);
        }

        if (!this.root) {
            this.root = ReactDOM.createRoot(this);
        }
        this.render();
    }

    render() {
        if (!this.root) return;
        this.root.render(
            <React.StrictMode>
                <App hass={this._hass} panel={this._panel} />
            </React.StrictMode>
        );
    }
}

customElements.define('gaia-dashboard', GaiaDashboard);
