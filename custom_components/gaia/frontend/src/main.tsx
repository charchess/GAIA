import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
        if (!document.getElementById('gaia-dashboard-style')) {
            const link = document.createElement('link');
            link.id = 'gaia-dashboard-style';
            link.rel = 'stylesheet';
            // We append Date.now() to ensure the browser strictly fetches the latest CSS 
            link.href = '/gaia_frontend/index.css?v=' + Date.now();
            document.head.appendChild(link);
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
