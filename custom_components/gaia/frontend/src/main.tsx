import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

class GaiaDashboard extends HTMLElement {
    connectedCallback() {
        if (!document.getElementById('gaia-dashboard-style')) {
            const link = document.createElement('link');
            link.id = 'gaia-dashboard-style';
            link.rel = 'stylesheet';
            link.href = '/gaia_frontend/index.css';
            document.head.appendChild(link);
        }

        ReactDOM.createRoot(this).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
        );
    }
}

customElements.define('gaia-dashboard', GaiaDashboard);
