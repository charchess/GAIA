import React, { useState, useMemo, useEffect } from 'react';
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
    Check,
    RefreshCw
} from 'lucide-react';

interface GaiaEntity {
    id: string;
    name: string;
    domain: string;
    exposed: boolean;
}

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
    light: <Lightbulb size={24} />,
    switch: <Power size={24} />,
    climate: <Thermometer size={24} />,
    alarm_control_panel: <Shield size={24} />,
    default: <Smartphone size={24} />
};

export default function App({ hass, panel: _panel }: { hass?: any; panel?: any }) {
    const [entities, setEntities] = useState<GaiaEntity[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch entities from the GAIA backend WS API
    const fetchEntities = async () => {
        if (!hass) return;

        setIsLoading(true);
        setError(null);
        try {
            // Call our custom python websocket command
            const response = await hass.connection.sendMessagePromise({
                type: 'gaia/get_entities'
            });

            const formattedEntities = response.map((e: any) => ({
                id: e.entity_id,
                name: e.name,
                domain: e.domain,
                exposed: e.exposed || false
            }));

            setEntities(formattedEntities);
        } catch (err: any) {
            console.error('Failed to fetch GAIA entities:', err);
            setError('Could not connect to Home Assistant API.');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch when HA object becomes available
    useEffect(() => {
        if (hass && entities.length === 0) {
            fetchEntities();
        }
    }, [hass]); // Intentionally omitting `entities.length` to not loop

    const toggleExposure = async (id: string, currentStatus: boolean) => {
        if (!hass) return;

        // Optimistic UI update
        setEntities(entities.map(e => e.id === id ? { ...e, exposed: !currentStatus } : e));

        try {
            await hass.connection.sendMessagePromise({
                type: 'gaia/update_exposure',
                entity_id: id,
                expose: !currentStatus
            });
        } catch (err) {
            console.error('Failed to update exposure:', err);
            // Revert optimistic update on failure
            setEntities(entities.map(e => e.id === id ? { ...e, exposed: currentStatus } : e));
        }
    };

    const domainCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        entities.forEach(e => {
            counts[e.domain] = (counts[e.domain] || 0) + 1;
        });
        return Object.fromEntries(
            // Sort domains alphabetically
            Object.entries(counts).sort(([a], [b]) => a.localeCompare(b))
        );
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
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [entities, activeTab, searchQuery]);

    // Group entities by domain
    const groupedEntities = useMemo(() => {
        const groups: Record<string, GaiaEntity[]> = {};
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

    if (!hass) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
                <RefreshCw size={48} className="spin-animation" style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h2>Connecting to Home Assistant...</h2>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Mic size={28} />
                    <h1 className="sidebar-title">GAIA Setup</h1>
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
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button className="btn-secondary" onClick={fetchEntities} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RefreshCw size={16} /> Refresh
                        </button>
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

                    {error && (
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--danger-color)' }}>
                            <strong>Error: </strong> {error}
                        </div>
                    )}

                    {isLoading && entities.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
                            <RefreshCw size={48} className="spin-animation" style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <h3>Loading your Home Assistant environment...</h3>
                        </div>
                    ) : Object.entries(groupedEntities).map(([domain, domainEntities]) => (
                        <div key={domain} className="domain-card">
                            <div className="domain-header">
                                <h3 className="domain-title">
                                    {DOMAIN_ICONS[domain] || DOMAIN_ICONS.default}
                                    {domain}
                                </h3>
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
                                                        onChange={() => toggleExposure(entity.id, entity.exposed)}
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

                    {!isLoading && Object.keys(groupedEntities).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
                            <Settings size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <h3>No entities found</h3>
                            <p>Try adjusting your search criteria or hit refresh.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
