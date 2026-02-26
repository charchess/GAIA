import { useState, useEffect } from 'react';

// Using a generic any type for the hass object as we don't have full types in this scope
export interface HassEntity {
    entity_id: string;
    state: string;
    attributes: Record<string, any>;
    last_changed: string;
    last_updated: string;
    context: { id: string; parent_id: string | null; user_id: string | null };
}

export interface HomeAssistant {
    states: Record<string, HassEntity>;
    connection: any;
    callWS: (msg: any) => Promise<any>;
}

export function useHass() {
    const [hass, setHass] = useState<HomeAssistant | null>(null);

    useEffect(() => {
        // In a custom panel, Home Assistant injects the 'hass' property into the DOM element
        // We need to listen to the properties-changed event or polyfill it

        const dashboardElement = document.querySelector('gaia-dashboard') as any;

        if (dashboardElement && dashboardElement.hass) {
            setHass(dashboardElement.hass);
        }

        // Setting up an observer on the panel element to catch hass updates
        const observer = new MutationObserver(() => {
            if (dashboardElement && dashboardElement.hass) {
                setHass(dashboardElement.hass);
            }
        });

        if (dashboardElement) {
            observer.observe(dashboardElement, { attributes: true, childList: false, subtree: false });
        }

        return () => observer.disconnect();
    }, []);

    return hass;
}
