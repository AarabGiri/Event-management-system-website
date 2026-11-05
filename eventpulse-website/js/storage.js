/**
 * EventPulse - Local Storage Management System
 * Handles persistent state for registrations, favorites, user-created events, and theme preferences.
 */

const STORAGE_KEYS = {
    EVENTS: "eventpulse_custom_events",
    REGISTRATIONS: "eventpulse_registrations",
    FAVORITES: "eventpulse_favorites",
    THEME: "eventpulse_theme"
};

const StorageManager = {
    /**
     * Get all events (Initial events merged with any user-created custom events)
     */
    getEvents() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
            const customEvents = stored ? JSON.parse(stored) : [];
            return [...INITIAL_EVENTS, ...customEvents];
        } catch (e) {
            console.error("Failed to load events from storage:", e);
            return INITIAL_EVENTS;
        }
    },

    /**
     * Retrieve single event by ID
     */
    getEventById(id) {
        const allEvents = this.getEvents();
        return allEvents.find(e => e.id === id) || null;
    },

    /**
     * Add a newly hosted/created event
     */
    addCustomEvent(eventData) {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
            const customEvents = stored ? JSON.parse(stored) : [];
            const newEvent = {
                ...eventData,
                id: "custom-" + Date.now(),
                featured: false,
                registeredCount: 0,
                totalCapacity: parseInt(eventData.totalCapacity, 10) || 100,
                price: parseFloat(eventData.price) || 0,
                priceLabel: parseFloat(eventData.price) > 0 ? `$${parseFloat(eventData.price)} / Pass` : "Free Entry",
                displayDate: new Date(eventData.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }) + " • " + new Date(eventData.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit"
                }),
                badge: "Community Event 🌟"
            };
            customEvents.unshift(newEvent);
            localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(customEvents));
            return newEvent;
        } catch (e) {
            console.error("Failed to add custom event:", e);
            return null;
        }
    },

    /**
     * Get all saved user registrations
     */
    getRegistrations() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load registrations:", e);
            return [];
        }
    },

    /**
     * Save a registration record
     */
    saveRegistration(regData) {
        try {
            const registrations = this.getRegistrations();
            const newReg = {
                id: "EP-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000),
                registeredAt: new Date().toISOString(),
                ...regData
            };
            registrations.unshift(newReg);
            localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));

            // Increment registered count for the event
            this.adjustEventCapacity(regData.eventId, regData.ticketsCount || 1);

            return newReg;
        } catch (e) {
            console.error("Failed to save registration:", e);
            return null;
        }
    },

    /**
     * Cancel an existing registration
     */
    cancelRegistration(regId) {
        try {
            const registrations = this.getRegistrations();
            const target = registrations.find(r => r.id === regId);
            if (!target) return false;

            const filtered = registrations.filter(r => r.id !== regId);
            localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filtered));

            // Decrement registered count
            this.adjustEventCapacity(target.eventId, -(target.ticketsCount || 1));
            return true;
        } catch (e) {
            console.error("Failed to cancel registration:", e);
            return false;
        }
    },

    /**
     * Adjust event attendee count
     */
    adjustEventCapacity(eventId, delta) {
        try {
            const customStored = localStorage.getItem(STORAGE_KEYS.EVENTS);
            if (customStored) {
                const customEvents = JSON.parse(customStored);
                const match = customEvents.find(e => e.id === eventId);
                if (match) {
                    match.registeredCount = Math.max(0, (match.registeredCount || 0) + delta);
                    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(customEvents));
                    return;
                }
            }

            // Also check initial events in-memory adjustment
            const initMatch = INITIAL_EVENTS.find(e => e.id === eventId);
            if (initMatch) {
                initMatch.registeredCount = Math.max(0, (initMatch.registeredCount || 0) + delta);
            }
        } catch (e) {
            console.error("Failed to adjust capacity:", e);
        }
    },

    /**
     * Check if a specific registration ID exists
     */
    getRegistrationById(id) {
        const regs = this.getRegistrations();
        return regs.find(r => r.id === id) || null;
    },

    /**
     * Favorites / Bookmarks Management
     */
    getFavorites() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    },

    toggleFavorite(eventId) {
        let favs = this.getFavorites();
        const exists = favs.includes(eventId);
        if (exists) {
            favs = favs.filter(id => id !== eventId);
        } else {
            favs.push(eventId);
        }
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
        return !exists; // returns true if now favorited, false if removed
    },

    isFavorite(eventId) {
        return this.getFavorites().includes(eventId);
    },

    /**
     * Theme management
     */
    getTheme() {
        const saved = localStorage.getItem(STORAGE_KEYS.THEME);
        if (saved) return saved;
        // Check system preference
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },

    setTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }
};
