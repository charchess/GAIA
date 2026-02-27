import React, { useState, useMemo, useEffect } from 'react';
import { styles } from './styles';
import {
    Lightbulb, Power, Thermometer, Shield, Smartphone,
    Settings, Search, CheckCircle2, XCircle, Mic, Activity, Check,
    RefreshCw, Calendar, Camera, MessageSquare, Blinds, MapPin, Zap,
    Image as ImageIcon, ToggleLeft, Clock, Hash, List, Key, Music,
    Users, Gamepad2, PlaySquare, FileText, MousePointer2, Droplets,
    Wind, Cloud, Map, Save
} from 'lucide-react';

interface GaiaEntity {
    id: string;
    name: string;
    domain: string;
    domain_exposed: boolean;
    yaml_has_override: boolean;
    override_value: boolean | null;
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

const EntityCard = React.memo(({
    entity,
    isDomainExposed,
    pendingOverride,
    onToggle
}: {
    entity: GaiaEntity,
    isDomainExposed: boolean,
    pendingOverride?: 'exposed' | 'hidden' | 'default',
    onToggle: (id: string, state: 'exposed' | 'hidden' | 'default') => void
}) => {

    let isOverridden = entity.yaml_has_override;
    let isOverrideExposed = !isDomainExposed;
    let isCurrentlyExposed = isOverridden ? entity.override_value : isDomainExposed;

    if (pendingOverride) {
        if (pendingOverride === 'default') {
            isOverridden = false;
            isCurrentlyExposed = isDomainExposed;
        } else {
            isOverridden = true;
            isOverrideExposed = pendingOverride === 'exposed';
            isCurrentlyExposed = pendingOverride === 'exposed';
        }
    }

    const handleToggle = () => {
        if (isOverridden) {
            onToggle(entity.id, 'default');
        } else {
            onToggle(entity.id, isOverrideExposed ? 'exposed' : 'hidden');
        }
    };

    return (
        <div className={`gaia-entity-card ${pendingOverride ? 'gaia-entity-unsaved' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, paddingRight: '12px' }}>
                    <div>
                        <div className="gaia-entity-name">{entity.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gaia-text-sec)', marginTop: '4px', fontFamily: 'monospace' }}>
                            {entity.id}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className={`gaia-status-badge ${isCurrentlyExposed ? 'gaia-status-exposed' : 'gaia-status-hidden'}`} style={{ display: 'inline-flex', padding: '4px 8px' }}>
                            {isCurrentlyExposed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {isCurrentlyExposed ? 'Exposed' : 'Hidden'}
                        </span>
                        {entity.yaml_has_override && !pendingOverride && (
                            <span className="override-badge">YML OVERRIDE</span>
                        )}
                        {pendingOverride && (
                            <span className="override-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--gaia-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>UNSAVED</span>
                        )}
                    </div>
                </div>

                <div className="gaia-switch-wrapper" style={{ flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, color: 'var(--gaia-text-sec)', padding: '0 2px' }}>
                        <span className={!isOverridden ? 'active' : ''}>Default</span>
                        <span className={isOverridden ? (isOverrideExposed ? 'active-exposed' : 'active-hidden') : ''}>
                            {isOverridden ? (isOverrideExposed ? 'Exposed' : 'Hidden') : ''}
                        </span>
                    </div>
                    <button
                        type="button"
                        className={`gaia-slim-switch ${isOverridden ? 'overridden' : ''} ${isOverrideExposed ? 'override-exposed' : 'override-hidden'}`}
                        onClick={handleToggle}
                        title={isOverridden ? "Return to Default" : "Override Domain"}
                    >
                        <div className="slider-thumb"></div>
                    </button>
                </div>

            </div>
        </div>
    );
});

export default function App({ hass, panel: _panel }: { hass?: any; panel?: any }) {
    const [entities, setEntities] = useState<GaiaEntity[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [domainModes, setDomainModes] = useState<Record<string, 'expose' | 'hide'>>({});
    const [pendingOverrides, setPendingOverrides] = useState<Record<string, 'exposed' | 'hidden' | 'default'>>({});
    const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

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
                domain_exposed: e.domain_exposed || false,
                yaml_has_override: e.yaml_has_override || false,
                override_value: e.override_value
            }));
            setEntities(formattedEntities);

            // Also update the global toggle switches to reflect actual backend state
            const newDomainModes: Record<string, 'expose' | 'hide'> = {};
            response.forEach((e: any) => {
                if (e.domain_exposed !== undefined) {
                    newDomainModes[e.domain] = e.domain_exposed ? 'expose' : 'hide';
                }
            });
            setDomainModes(prev => ({ ...prev, ...newDomainModes }));
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

    const toggleExposure = async (entityId: string, targetState: 'exposed' | 'hidden' | 'default') => {
        const entity = entities.find(e => e.id === entityId);
        if (!entity) return;

        setPendingOverrides(prev => {
            const next = { ...prev };
            // If the user reverts an unsaved change back to the YAML original state, remove it from pending.
            if (targetState === 'default' && !entity.yaml_has_override) {
                delete next[entityId];
            } else if (targetState === 'exposed' && entity.yaml_has_override && entity.override_value === true) {
                delete next[entityId];
            } else if (targetState === 'hidden' && entity.yaml_has_override && entity.override_value === false) {
                delete next[entityId];
            } else {
                next[entityId] = targetState;
            }
            return next;
        });
    };

    const saveBatchConfiguration = async () => {
        if (!hass || Object.keys(pendingOverrides).length === 0) return;
        setIsSaving(true);
        try {
            await hass.connection.sendMessagePromise({
                type: 'gaia/batch_update_exposures',
                updates: pendingOverrides
            });
            setPendingOverrides({});
            await fetchEntities();
        } catch (err) {
            console.error('Batch save failed', err);
            setError('Failed to save configuration.');
        } finally {
            setIsSaving(false);
        }
    };

    const domainCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        entities.forEach(e => counts[e.domain] = (counts[e.domain] || 0) + 1);
        return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
    }, [entities]);

    const filteredEntities = useMemo(() => {
        let filtered = entities;
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            filtered = filtered.filter(e => e.name.toLowerCase().includes(lowerQ));
        }
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [entities, searchQuery]);

    if (!hass) {
        return (
            <div className="gaia-loading-screen">
                <RefreshCw size={48} className="gaia-spin" style={{ marginBottom: '16px', opacity: 0.5 }} />
                <h2>Connecting to Home Assistant API...</h2>
            </div>
        );
    }

    const effectiveDomainModes = { ...domainModes };
    Object.keys(pendingOverrides).forEach(key => {
        if (!key.includes('.')) {
            effectiveDomainModes[key] = pendingOverrides[key] === 'exposed' ? 'expose' : 'hide';
        }
    });

    const setDomainMode = async (domain: string, targetMode: 'expose' | 'hide') => {
        const currentYamlMode = domainModes[domain] || 'hide';
        setPendingOverrides(prev => {
            const next = { ...prev };
            if (targetMode === currentYamlMode) {
                delete next[domain];
            } else {
                next[domain] = targetMode === 'expose' ? 'exposed' : 'hidden';
            }
            return next;
        });
    };

    const toggleAccordion = (domain: string) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domain]: prev[domain] === true ? false : true
        }));
    };

    const expandAll = () => {
        const all: Record<string, boolean> = {};
        Object.keys(domainCounts).forEach(d => all[d] = true);
        setExpandedDomains(all);
    };

    const collapseAll = () => {
        setExpandedDomains({});
    };

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
                    <>
                        {Object.keys(domainCounts).length > 0 && (
                            <div className="gaia-accordion-controls" style={{ padding: '0 32px 12px 32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                <button onClick={expandAll} style={{ background: 'none', border: 'none', color: 'var(--gaia-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Expand All</button>
                                <button onClick={collapseAll} style={{ background: 'none', border: 'none', color: 'var(--gaia-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Collapse All</button>
                            </div>
                        )}
                        <div className="gaia-accordions-wrapper" style={{ paddingTop: 0 }}>
                            {Object.keys(domainCounts).map((domain) => {
                                const domainEntities = filteredEntities.filter(e => e.domain === domain);
                                if (domainEntities.length === 0) return null; // Hide domain if all entities filtered out out by search

                                const isExpanded = expandedDomains[domain] === true; // Epic 9: Default to closed
                                const currentMode = effectiveDomainModes[domain] || 'hide';
                                const hasPendingDomainOverride = pendingOverrides[domain] !== undefined;

                                return (
                                    <div key={domain} className="gaia-accordion">
                                        <div className={`gaia-accordion-header ${hasPendingDomainOverride ? 'gaia-accordion-unsaved' : ''}`} onClick={() => toggleAccordion(domain)}>
                                            <div className="gaia-accordion-title">
                                                <span>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--gaia-text-sec)' }}>
                                                        <polyline points="9 18 15 12 9 6"></polyline>
                                                    </svg>
                                                </span>
                                                {DOMAIN_ICONS[domain] || DOMAIN_ICONS.default}
                                                {domain.replace(/_/g, ' ')}
                                                <span className="gaia-accordion-count">{domainEntities.length}</span>
                                            </div>
                                            <div className="gaia-accordion-actions" onClick={e => e.stopPropagation()}>
                                                <div className="gaia-switch-wrapper">
                                                    <span className={`gaia-switch-label ${currentMode === 'hide' ? 'active-hidden' : ''}`}>Hidden</span>
                                                    <button
                                                        type="button"
                                                        className={`gaia-slim-switch gaia-domain-switch ${currentMode === 'expose' ? 'overridden override-exposed' : 'override-hidden'}`}
                                                        onClick={() => setDomainMode(domain, currentMode === 'hide' ? 'expose' : 'hide')}
                                                        title={`Toggle default exposure for all ${domain} entities`}
                                                    >
                                                        <div className="slider-thumb"></div>
                                                    </button>
                                                    <span className={`gaia-switch-label ${currentMode === 'expose' ? 'active-exposed' : ''}`}>Exposed</span>
                                                </div>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="gaia-accordion-content">
                                                <div className="gaia-grid-container">
                                                    {domainEntities.map(entity => (
                                                        <EntityCard
                                                            key={entity.id}
                                                            entity={entity}
                                                            isDomainExposed={effectiveDomainModes[entity.domain] === 'expose'}
                                                            pendingOverride={pendingOverrides[entity.id]}
                                                            onToggle={toggleExposure}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>

            {Object.keys(pendingOverrides).length > 0 && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 1000,
                    animation: 'gaiaSubtleBounce 0.3s ease-out'
                }}>
                    <button
                        className="gaia-btn"
                        onClick={saveBatchConfiguration}
                        disabled={isSaving}
                        style={{
                            backgroundColor: 'white',
                            color: 'black',
                            padding: '12px 24px',
                            borderRadius: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: '15px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: isSaving ? 'wait' : 'pointer'
                        }}
                    >
                        {isSaving ? <RefreshCw size={20} className="gaia-spin" /> : <Save size={20} />}
                        {isSaving ? 'Saving Changes...' : `Save ${Object.keys(pendingOverrides).length} Changes`}
                    </button>
                    <style>{`
                        @keyframes gaiaSubtleBounce {
                            0% { transform: translateY(20px) scale(0.9); opacity: 0; }
                            100% { transform: translateY(0) scale(1); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
