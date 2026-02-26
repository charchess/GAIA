import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    Lightbulb,
    Power,
    Thermometer,
    Shield,
    Smartphone,
    Settings,
    Search,
    CheckCircle2,
    XCircle,
    Mic,
    Activity,
    Check
} from 'lucide-react';

// MOCK DATA for development layout
const MOCK_ENTITIES = [
    { id: 'light.living_room', name: 'Living Room Lights', domain: 'light', exposed: true },
    { id: 'light.kitchen', name: 'Kitchen Lights', domain: 'light', exposed: false },
    { id: 'light.bedroom', name: 'Bedroom Ceiling', domain: 'light', exposed: true },
    { id: 'switch.coffee_maker', name: 'Coffee Maker', domain: 'switch', exposed: true },
    { id: 'switch.tv_plug', name: 'TV Smart Plug', domain: 'switch', exposed: false },
    { id: 'climate.home', name: 'Home Thermostat', domain: 'climate', exposed: true },
    { id: 'alarm_control_panel.home', name: 'House Alarm', domain: 'alarm_control_panel', exposed: false },
];

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
    light: <Lightbulb size={24} />,
    switch: <Power size={24} />,
    climate: <Thermometer size={24} />,
    alarm_control_panel: <Shield size={24} />,
    default: <Smartphone size={24} />
};

export default function App() {
    const [entities, setEntities] = useState(MOCK_ENTITIES);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleExposure = (id: string) => {
        setEntities(entities.map(e => e.id === id ? { ...e, exposed: !e.exposed } : e));
    };

    const domainCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        entities.forEach(e => {
            counts[e.domain] = (counts[e.domain] || 0) + 1;
        });
        return counts;
    }, [entities]);

    const filteredEntities = useMemo(() => {
        let filtered = entities;
        if (activeTab !== 'all') {
            filtered = filtered.filter(e => e.domain === activeTab);
        }
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            filtered = filtered.filter(e => e.name.toLowerCase().includes(lowerQ) || e.id.toLowerCase().includes(lowerQ));
        }
        return filtered;
    }, [entities, activeTab, searchQuery]);

    // Group entities by domain
    const groupedEntities = useMemo(() => {
        const groups: Record<string, typeof entities> = {};
        filteredEntities.forEach(e => {
            if (!groups[e.domain]) groups[e.domain] = [];
            groups[e.domain].push(e);
        });
        return groups;
    }, [filteredEntities]);

    const stats = {
        total: entities.length,
        exposed: entities.filter(e => e.exposed).length,
        hidden: entities.filter(e => !e.exposed).length,
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Mic size={28} />
                    <h1 className="sidebar-title">GAIA - Google Assistant Integration Administrator</h1>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <LayoutDashboard size={20} />
                        <span>All Entities</span>
                        <span className="nav-badge">{stats.total}</span>
                    </button>

                    <div style={{ margin: '24px 0 8px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Domains
                    </div>

                    {Object.entries(domainCounts).map(([domain, count]) => (
                        <button
                            key={domain}
                            className={`nav-item ${activeTab === domain ? 'active' : ''}`}
                            onClick={() => setActiveTab(domain)}
                        >
                            {DOMAIN_ICONS[domain] || DOMAIN_ICONS.default}
                            <span style={{ textTransform: 'capitalize' }}>{domain}</span>
                            <span className="nav-badge">{count}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar">
                    <h2 className="topbar-title">Exposure Dashboard</h2>
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search entities by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="content-area">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon stat-blue"><Activity size={28} /></div>
                            <div>
                                <p className="stat-value">{stats.total}</p>
                                <p className="stat-label">Total Entities Found</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-green"><Check size={28} /></div>
                            <div>
                                <p className="stat-value">{stats.exposed}</p>
                                <p className="stat-label">Exposed to Google</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon stat-gray"><Settings size={28} /></div>
                            <div>
                                <p className="stat-value">{stats.hidden}</p>
                                <p className="stat-label">Excluded Entities</p>
                            </div>
                        </div>
                    </div>

                    {Object.entries(groupedEntities).map(([domain, domainEntities]) => (
                        <div key={domain} className="domain-card">
                            <div className="domain-header">
                                <h3 className="domain-title">
                                    {DOMAIN_ICONS[domain] || DOMAIN_ICONS.default}
                                    {domain}
                                </h3>
                                <div className="domain-actions">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => {
                                            const allExposed = domainEntities.every(e => e.exposed);
                                            setEntities(entities.map(e => e.domain === domain ? { ...e, exposed: !allExposed } : e));
                                        }}
                                    >
                                        Toggle All {domain}
                                    </button>
                                </div>
                            </div>

                            <table className="entity-table">
                                <thead>
                                    <tr>
                                        <th>Entity</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Expose to Google</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {domainEntities.map(entity => (
                                        <tr key={entity.id}>
                                            <td>
                                                <div className="entity-name-col">
                                                    <div className="entity-icon">
                                                        {DOMAIN_ICONS[domain] || DOMAIN_ICONS.default}
                                                    </div>
                                                    <div>
                                                        <div className="entity-name">{entity.name}</div>
                                                        <div className="entity-id">{entity.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${entity.exposed ? 'status-exposed' : 'status-hidden'}`}>
                                                    {entity.exposed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                    {entity.exposed ? 'Exposed' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={entity.exposed}
                                                        onChange={() => toggleExposure(entity.id)}
                                                    />
                                                    <span className="slider"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {Object.keys(groupedEntities).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
                            <Settings size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <h3>No entities found</h3>
                            <p>Try adjusting your search criteria.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
