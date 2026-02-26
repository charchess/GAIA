import React, { useState, useMemo, useEffect } from 'react';
import { styles } from './styles';
import {
    LayoutDashboard, Lightbulb, Power, Thermometer, Shield, Smartphone,
    Settings, Search, CheckCircle2, XCircle, Mic, Activity, Check,
    RefreshCw, Calendar, Camera, MessageSquare, Blinds, MapPin, Zap,
    Image as ImageIcon, ToggleLeft, Clock, Hash, List, Key, Music,
    Users, Gamepad2, PlaySquare, FileText, MousePointer2, Droplets,
    Wind, Cloud, Map
} from 'lucide-react';

interface GaiaEntity {
    id: string;
    name: string;
    domain: string;
    exposed: boolean;
}

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
    light: <Lightbulb size={18} />, switch: <Power size={18} />, climate: <Thermometer size={18} />,
    alarm_control_panel: <Shield size={18} />, binary_sensor: <ToggleLeft size={18} />,
    button: <MousePointer2 size={18} />, calendar: <Calendar size={18} />, camera: <Camera size={18} />,
    conversation: <MessageSquare size={18} />, cover: <Blinds size={18} />, device_tracker: <MapPin size={18} />,
    event: <Zap size={18} />, fan: <Wind size={18} />, image: <ImageIcon size={18} />,
    input_boolean: <ToggleLeft size={18} />, input_datetime: <Clock size={18} />,
    input_number: <Hash size={18} />, input_select: <List size={18} />, lock: <Key size={18} />,
    media_player: <Music size={18} />, number: <Hash size={18} />, person: <Users size={18} />,
    remote: <Gamepad2 size={18} />, scene: <PlaySquare size={18} />, script: <FileText size={18} />,
    select: <List size={18} />, sensor: <Activity size={18} />, stt: <Mic size={18} />, tts: <Mic size={18} />,
    time: <Clock size={18} />, todo: <Check size={18} />, update: <RefreshCw size={18} />,
    vacuum: <Settings size={18} />, water_heater: <Droplets size={18} />, weather: <Cloud size={18} />,
    zone: <Map size={18} />, ai_task: <Activity size={18} />, default: <Smartphone size={18} />
};

const EntityRow = React.memo(({ entity, onToggle }: { entity: GaiaEntity, onToggle: (id: string, exposed: boolean) => void }) => {
    return (
        <tr className="gaia-table-row">
            <td>
                <div className="gaia-entity-name">{entity.name}</div>
            </td>
            <td>
                <span className={`gaia-status-badge ${entity.exposed ? 'gaia-status-exposed' : 'gaia-status-hidden'}`}>
                    {entity.exposed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {entity.exposed ? 'Exposed' : 'Hidden'}
                </span>
            </td>
            <td style={{ textAlign: 'right' }}>
                <div className="gaia-switch-wrapper">
                    <button
                        type="button"
                        className={`gaia-switch ${entity.exposed ? 'checked' : ''}`}
                        onClick={() => onToggle(entity.id, entity.exposed)}
                    >
                        <span className="gaia-slider"></span>
                        <span className="gaia-switch-text">{entity.exposed ? 'EXPOSED' : 'HIDDEN'}</span>
                    </button>
                </div>
            </td>
        </tr>
    );
});

export default function App({ hass, panel: _panel }: { hass?: any; panel?: any }) {
    const [entities, setEntities] = useState<GaiaEntity[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [domainModes, setDomainModes] = useState<Record<string, 'expose' | 'hide'>>({});

    const fetchEntities = async () => {
        if (!hass) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await hass.connection.sendMessagePromise({ type: 'gaia/get_entities' });
            const formattedEntities = response.map((e: any) => ({
                id: e.entity_id,
                name: e.name || e.entity_id,
                domain: e.domain,
                exposed: e.exposed || false
            }));
            setEntities(formattedEntities);
        } catch (err: any) {
            console.error('Failed to fetch GAIA entities:', err);
            setError('Could not connect to Home Assistant API. Ensure GAIA is running.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (hass && entities.length === 0) fetchEntities();
    }, [hass]);

    const toggleExposure = async (id: string, currentStatus: boolean) => {
        if (!hass) return;
        setEntities(entities.map(e => e.id === id ? { ...e, exposed: !currentStatus } : e));
        try {
            await hass.connection.sendMessagePromise({
                type: 'gaia/update_exposure',
                entity_id: id,
                expose: !currentStatus
            });
        } catch (err) {
            console.error('Failed to update exposure:', err);
            setEntities(entities.map(e => e.id === id ? { ...e, exposed: currentStatus } : e));
        }
    };

    const domainCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        entities.forEach(e => counts[e.domain] = (counts[e.domain] || 0) + 1);
        return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
    }, [entities]);

    const filteredEntities = useMemo(() => {
        let filtered = entities;
        if (activeTab !== 'all') filtered = filtered.filter(e => e.domain === activeTab);
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            filtered = filtered.filter(e => e.name.toLowerCase().includes(lowerQ));
        }
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [entities, activeTab, searchQuery]);

    const stats = {
        total: entities.length,
        exposed: entities.filter(e => e.exposed).length,
        hidden: entities.filter(e => !e.exposed).length,
    };

    if (!hass) {
        return (
            <div className="gaia-loading-screen">
                <RefreshCw size={48} className="gaia-spin" style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h2>Connecting to Home Assistant API...</h2>
            </div>
        );
    }

    const currentMode = domainModes[activeTab] || 'hide'; // Default to hide
    const setMode = (mode: 'expose' | 'hide') => setDomainModes(prev => ({ ...prev, [activeTab]: mode }));

    return (
        <div className="gaia-app gaia-fade-in">
            <style>{styles}</style>
            {/* Header */}
            <header className="gaia-header">
                <div className="gaia-header-title">
                    <Mic size={28} style={{ color: 'var(--gaia-primary)' }} />
                    <h1>GAIA Exposure Manager</h1>
                </div>
                <div className="gaia-header-actions">
                    <div className="gaia-search">
                        <Search size={18} className="gaia-search-icon" />
                        <input
                            type="text"
                            placeholder="Search entities by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="gaia-btn" onClick={fetchEntities} disabled={isLoading}>
                        <RefreshCw size={16} className={isLoading ? "gaia-spin" : ""} /> Refresh
                    </button>
                </div>
            </header>

            {/* Horizontal Tabs */}
            <div className="gaia-tabs-container">
                <button
                    className={`gaia-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    <LayoutDashboard size={16} /> All Entities ({stats.total})
                </button>
                {Object.entries(domainCounts).map(([domain, count]) => (
                    <button
                        key={domain}
                        className={`gaia-tab ${activeTab === domain ? 'active' : ''}`}
                        onClick={() => setActiveTab(domain)}
                    >
                        {DOMAIN_ICONS[domain] || DOMAIN_ICONS.default}
                        <span style={{ textTransform: 'capitalize' }}>{domain.replace(/_/g, ' ')} ({count})</span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <main className="gaia-main-area">
                {error && (
                    <div className="gaia-error-banner">
                        <strong>Error: </strong> {error}
                    </div>
                )}

                {isLoading && entities.length === 0 ? (
                    <div className="gaia-empty-state">
                        <RefreshCw size={48} className="gaia-spin" style={{ opacity: 0.3, marginBottom: '24px' }} />
                        <h3>Loading your Home Assistant environment...</h3>
                    </div>
                ) : filteredEntities.length === 0 ? (
                    <div className="gaia-empty-state">
                        <Settings size={48} style={{ opacity: 0.2, marginBottom: '24px' }} />
                        <h3>No entities found</h3>
                        <p>Try adjusting your search criteria or select another tab.</p>
                    </div>
                ) : (
                    <div className="gaia-card">
                        {activeTab !== 'all' && (
                            <div className="gaia-card-header">
                                <div className="gaia-global-switch">
                                    <span className="gaia-global-label">Global Default View:</span>
                                    <div className="gaia-switch-wrapper">
                                        <button
                                            type="button"
                                            className={`gaia-switch global ${currentMode === 'expose' ? 'checked' : ''}`}
                                            onClick={() => setMode(currentMode === 'hide' ? 'expose' : 'hide')}
                                        >
                                            <span className="gaia-slider"></span>
                                            <span className="gaia-switch-text">{currentMode === 'expose' ? 'EXPOSE' : 'HIDE'}</span>
                                        </button>
                                    </div>
                                    <p className="gaia-global-desc">
                                        {currentMode === 'hide'
                                            ? "Entities are Hidden by default. Use switches to Expose them (Green)."
                                            : "Entities are Exposed by default. Use switches to explicitly Hide them (Red)."}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="gaia-table-container">
                            <table className="gaia-table">
                                <thead>
                                    <tr>
                                        <th>Entity Name</th>
                                        <th>Current Status</th>
                                        <th style={{ textAlign: 'right' }}>Toggle Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEntities.map(entity => (
                                        <EntityRow
                                            key={entity.id}
                                            entity={entity}
                                            onToggle={toggleExposure}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
