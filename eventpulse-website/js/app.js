/**
 * EventPulse - Main Application Controller
 * Handles UI interactions, modal lifecycle, live search/filtering, ticket rendering, and animations
 */

const App = {
    // Current state
    state: {
        activeCategory: "All",
        searchQuery: "",
        sortBy: "date-upcoming",
        favoritesOnly: false,
        freeOnly: false,
        currentModal: null,
        selectedEventForRegistration: null
    },

    /**
     * Application Initialization
     */
    init() {
        this.initTheme();
        this.bindEvents();
        this.initValidation();
        this.renderAll();
        this.updateBadgeCounts();
        console.log("EventPulse Application Initialized Successfully");
    },

    /**
     * Theme Toggle & Persistence
     */
    initTheme() {
        const theme = StorageManager.getTheme();
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        this.updateThemeIcons(theme === "dark");
    },

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle("dark");
        StorageManager.setTheme(isDark ? "dark" : "light");
        this.updateThemeIcons(isDark);
        this.showToast(isDark ? "Dark theme enabled 🌙" : "Light theme enabled ☀️", "info");
    },

    updateThemeIcons(isDark) {
        const sunIcons = document.querySelectorAll(".theme-icon-sun");
        const moonIcons = document.querySelectorAll(".theme-icon-moon");
        sunIcons.forEach(el => el.classList.toggle("hidden", !isDark));
        moonIcons.forEach(el => el.classList.toggle("hidden", isDark));
    },

    /**
     * Global Event Listeners Binding
     */
    bindEvents() {
        // Theme toggle button
        const themeBtn = document.getElementById("theme-toggle-btn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => this.toggleTheme());
        }

        // Mobile theme toggle button
        const mobileThemeBtn = document.getElementById("mobile-theme-toggle-btn");
        if (mobileThemeBtn) {
            mobileThemeBtn.addEventListener("click", () => this.toggleTheme());
        }

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById("mobile-menu-btn");
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener("click", () => {
                mobileMenu.classList.toggle("hidden");
            });
        }

        // Live search bar (Main)
        const searchInput = document.getElementById("search-input");
        const searchClearBtn = document.getElementById("search-clear-btn");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.state.searchQuery = e.target.value.toLowerCase().trim();
                if (searchClearBtn) {
                    searchClearBtn.classList.toggle("hidden", this.state.searchQuery === "");
                }
                this.renderEventsGrid();
            });
        }

        if (searchClearBtn && searchInput) {
            searchClearBtn.addEventListener("click", () => {
                searchInput.value = "";
                this.state.searchQuery = "";
                searchClearBtn.classList.add("hidden");
                this.renderEventsGrid();
                searchInput.focus();
            });
        }

        // Hero quick search
        const heroSearchInput = document.getElementById("hero-search-input");
        const heroCategorySelect = document.getElementById("hero-category-select");
        const heroSearchBtn = document.getElementById("hero-search-btn");
        if (heroSearchBtn) {
            heroSearchBtn.addEventListener("click", () => {
                if (heroSearchInput && heroSearchInput.value.trim()) {
                    this.state.searchQuery = heroSearchInput.value.toLowerCase().trim();
                    if (searchInput) searchInput.value = heroSearchInput.value.trim();
                    if (searchClearBtn) searchClearBtn.classList.remove("hidden");
                }
                if (heroCategorySelect && heroCategorySelect.value) {
                    this.setCategory(heroCategorySelect.value);
                }
                // Scroll smoothly to browse events section
                const exploreSection = document.getElementById("explore-events");
                if (exploreSection) {
                    exploreSection.scrollIntoView({ behavior: "smooth" });
                }
                this.renderEventsGrid();
            });
        }

        // Category filter pills
        document.querySelectorAll("[data-category-filter]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const category = btn.getAttribute("data-category-filter");
                this.setCategory(category);
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById("sort-select");
        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                this.state.sortBy = e.target.value;
                this.renderEventsGrid();
            });
        }

        // Favorites only toggle
        const favToggleBtn = document.getElementById("filter-fav-btn");
        if (favToggleBtn) {
            favToggleBtn.addEventListener("click", () => {
                this.state.favoritesOnly = !this.state.favoritesOnly;
                favToggleBtn.classList.toggle("bg-rose-500", this.state.favoritesOnly);
                favToggleBtn.classList.toggle("text-white", this.state.favoritesOnly);
                this.renderEventsGrid();
            });
        }

        // Free only toggle
        const freeToggleBtn = document.getElementById("filter-free-btn");
        if (freeToggleBtn) {
            freeToggleBtn.addEventListener("click", () => {
                this.state.freeOnly = !this.state.freeOnly;
                freeToggleBtn.classList.toggle("bg-emerald-600", this.state.freeOnly);
                freeToggleBtn.classList.toggle("text-white", this.state.freeOnly);
                this.renderEventsGrid();
            });
        }

        // Reset all filters button
        const resetFiltersBtn = document.getElementById("reset-filters-btn");
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener("click", () => {
                this.resetFilters();
            });
        }

        // Navigation "My Tickets" button
        document.querySelectorAll(".open-my-tickets-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                this.openMyTicketsModal();
            });
        });

        // Host / Create Event button
        const hostEventBtn = document.getElementById("host-event-btn");
        if (hostEventBtn) {
            hostEventBtn.addEventListener("click", () => {
                this.openHostEventModal();
            });
        }

        // Global Modal Close on ESC or Backdrop click
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeAllModals();
            }
        });

        document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
            backdrop.addEventListener("click", (e) => {
                if (e.target === backdrop) {
                    this.closeAllModals();
                }
            });
        });

        document.querySelectorAll(".modal-close-trigger").forEach(btn => {
            btn.addEventListener("click", () => {
                this.closeAllModals();
            });
        });
    },

    /**
     * Form Validation Initialization
     */
    initValidation() {
        const regForm = document.getElementById("event-registration-form");
        if (regForm) {
            FormValidator.initFormValidation(regForm, (formData) => {
                this.processRegistrationSubmission(formData);
            });
        }

        // Event selector change listener in registration form to recalculate total
        const eventSelectInput = document.getElementById("selectedEventId");
        const ticketQtyInput = document.getElementById("ticketQuantity");
        const ticketTierInput = document.getElementById("ticketTier");

        const updateCostSummary = () => {
            if (!eventSelectInput) return;
            const eventId = eventSelectInput.value;
            const event = StorageManager.getEventById(eventId);
            const qty = parseInt(ticketQtyInput?.value || 1, 10);
            const tierMultiplier = ticketTierInput?.value === "VIP Pass" ? 1.8 : 1.0;
            const priceEl = document.getElementById("reg-price-summary");

            if (event && priceEl) {
                const unitPrice = event.price * tierMultiplier;
                const total = unitPrice * qty;
                priceEl.innerHTML = total > 0 
                    ? `Total: <span class="font-bold text-indigo-600 dark:text-indigo-400">$${total.toFixed(2)}</span> (${qty}x ${ticketTierInput?.value || 'Standard'})`
                    : `Total: <span class="font-bold text-emerald-600 dark:text-emerald-400">Free Entry</span>`;
            }
        };

        if (eventSelectInput) eventSelectInput.addEventListener("change", updateCostSummary);
        if (ticketQtyInput) ticketQtyInput.addEventListener("input", updateCostSummary);
        if (ticketTierInput) ticketTierInput.addEventListener("change", updateCostSummary);

        // Host event form setup
        const hostForm = document.getElementById("host-event-form");
        if (hostForm) {
            hostForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.processHostEvent(hostForm);
            });
        }
    },

    /**
     * Set active category filter
     */
    setCategory(category) {
        this.state.activeCategory = category;
        document.querySelectorAll("[data-category-filter]").forEach(btn => {
            const cat = btn.getAttribute("data-category-filter");
            if (cat === category) {
                btn.className = "px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white shadow-md shadow-indigo-500/20";
            } else {
                btn.className = "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700";
            }
        });
        this.renderEventsGrid();
    },

    /**
     * Reset all active filters
     */
    resetFilters() {
        this.state.activeCategory = "All";
        this.state.searchQuery = "";
        this.state.sortBy = "date-upcoming";
        this.state.favoritesOnly = false;
        this.state.freeOnly = false;

        const searchInput = document.getElementById("search-input");
        if (searchInput) searchInput.value = "";
        const searchClearBtn = document.getElementById("search-clear-btn");
        if (searchClearBtn) searchClearBtn.classList.add("hidden");

        const favToggleBtn = document.getElementById("filter-fav-btn");
        if (favToggleBtn) {
            favToggleBtn.classList.remove("bg-rose-500", "text-white");
        }

        const freeToggleBtn = document.getElementById("filter-free-btn");
        if (freeToggleBtn) {
            freeToggleBtn.classList.remove("bg-emerald-600", "text-white");
        }

        const sortSelect = document.getElementById("sort-select");
        if (sortSelect) sortSelect.value = "date-upcoming";

        this.setCategory("All");
        this.showToast("Filters reset to default", "info");
    },

    /**
     * Filter & sort events
     */
    getFilteredEvents() {
        let events = StorageManager.getEvents();

        // 1. Category filter
        if (this.state.activeCategory !== "All") {
            events = events.filter(e => e.category === this.state.activeCategory);
        }

        // 2. Search query filter
        if (this.state.searchQuery) {
            const q = this.state.searchQuery;
            events = events.filter(e => {
                const titleMatch = e.title.toLowerCase().includes(q);
                const descMatch = (e.description || "").toLowerCase().includes(q);
                const venueMatch = (e.venue || "").toLowerCase().includes(q);
                const tagMatch = (e.tags || []).some(t => t.toLowerCase().includes(q));
                return titleMatch || descMatch || venueMatch || tagMatch;
            });
        }

        // 3. Favorites only filter
        if (this.state.favoritesOnly) {
            const favs = StorageManager.getFavorites();
            events = events.filter(e => favs.includes(e.id));
        }

        // 4. Free events only filter
        if (this.state.freeOnly) {
            events = events.filter(e => e.price === 0);
        }

        // 5. Sorting
        events.sort((a, b) => {
            if (this.state.sortBy === "date-upcoming") {
                return new Date(a.date) - new Date(b.date);
            } else if (this.state.sortBy === "popular") {
                return (b.registeredCount || 0) - (a.registeredCount || 0);
            } else if (this.state.sortBy === "price-asc") {
                return a.price - b.price;
            } else if (this.state.sortBy === "price-desc") {
                return b.price - a.price;
            } else if (this.state.sortBy === "alpha") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        return events;
    },

    /**
     * Render entire view
     */
    renderAll() {
        this.renderFeaturedEvents();
        this.renderEventsGrid();
        this.populateEventSelectDropdown();
    },

    /**
     * Render Featured Events Carousel / Highlights
     */
    renderFeaturedEvents() {
        const container = document.getElementById("featured-events-container");
        if (!container) return;

        const allEvents = StorageManager.getEvents();
        const featured = allEvents.filter(e => e.featured);

        if (featured.length === 0) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML = featured.map(evt => {
            const countdown = CountdownManager.getTimeRemaining(evt.date);
            const remainingSpots = (evt.totalCapacity || 100) - (evt.registeredCount || 0);
            const percentFilled = Math.min(100, Math.round(((evt.registeredCount || 0) / (evt.totalCapacity || 100)) * 100));
            const isFav = StorageManager.isFavorite(evt.id);

            return `
                <div class="group relative overflow-hidden rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 transition-all duration-300 flex flex-col lg:flex-row gap-6 items-center">
                    <!-- Image Banner -->
                    <div class="relative w-full lg:w-1/2 h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden flex-shrink-0">
                        <img 
                            src="${evt.image}" 
                            alt="${evt.title}" 
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                        
                        <!-- Badges -->
                        <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-lg">
                                Featured
                            </span>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-md">
                                ${evt.category}
                            </span>
                        </div>

                        <!-- Favorite Button -->
                        <button 
                            onclick="App.handleToggleFavorite('${evt.id}', this)" 
                            class="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 backdrop-blur-md shadow-md transition-transform active:scale-90"
                            title="${isFav ? 'Remove from favorites' : 'Save to favorites'}"
                        >
                            <svg class="w-5 h-5 ${isFav ? 'text-rose-500 fill-rose-500' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        <!-- Live Countdown Pill -->
                        <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium bg-black/60 backdrop-blur-md rounded-xl px-3 py-2">
                            <span class="flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                Starts in
                            </span>
                            <span class="font-mono font-bold text-amber-300" data-countdown-badge="${evt.date}">${countdown.badgeText}</span>
                        </div>
                    </div>

                    <!-- Details Content -->
                    <div class="flex-1 flex flex-col justify-between w-full">
                        <div>
                            <div class="flex items-center justify-between gap-2 mb-2">
                                <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    ${evt.displayDate}
                                </span>
                                <span class="text-sm font-extrabold ${evt.price === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}">
                                    ${evt.priceLabel}
                                </span>
                            </div>

                            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer" onclick="App.openEventDetailsModal('${evt.id}')">
                                ${evt.title}
                            </h3>

                            <p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                                ${evt.tagline || evt.description}
                            </p>

                            <!-- Venue Info -->
                            <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>${evt.venue}, <strong>${evt.city}</strong></span>
                            </div>

                            <!-- Registration Progress Bar -->
                            <div class="mb-5">
                                <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                    <span>Capacity Filled: <strong>${percentFilled}%</strong></span>
                                    <span>${remainingSpots > 0 ? remainingSpots + ' spots left' : 'Fully Booked'}</span>
                                </div>
                                <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style="width: ${percentFilled}%"></div>
                                </div>
                            </div>
                        </div>

                        <!-- CTA Buttons -->
                        <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <button 
                                onclick="App.openRegistrationModal('${evt.id}')" 
                                class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                                Register Now
                            </button>
                            <button 
                                onclick="App.openEventDetailsModal('${evt.id}')" 
                                class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all"
                            >
                                Full Agenda
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    },

    /**
     * Render Main Events Grid
     */
    renderEventsGrid() {
        const grid = document.getElementById("events-grid");
        const emptyState = document.getElementById("empty-state");
        const countDisplay = document.getElementById("events-count-display");

        if (!grid) return;

        const filtered = this.getFilteredEvents();

        if (countDisplay) {
            countDisplay.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'event' : 'events'}`;
        }

        if (filtered.length === 0) {
            grid.classList.add("hidden");
            if (emptyState) emptyState.classList.remove("hidden");
            return;
        }

        grid.classList.remove("hidden");
        if (emptyState) emptyState.classList.add("hidden");

        grid.innerHTML = filtered.map(evt => {
            const isFav = StorageManager.isFavorite(evt.id);
            const countdown = CountdownManager.getTimeRemaining(evt.date);
            const remainingSpots = (evt.totalCapacity || 100) - (evt.registeredCount || 0);

            return `
                <article class="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
                    <div>
                        <!-- Card Media -->
                        <div class="relative h-48 sm:h-52 overflow-hidden">
                            <img 
                                src="${evt.image}" 
                                alt="${evt.title}" 
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

                            <!-- Category Badge -->
                            <div class="absolute top-3 left-3">
                                <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 text-white backdrop-blur-md">
                                    ${evt.category}
                                </span>
                            </div>

                            <!-- Favorite button -->
                            <button 
                                onclick="App.handleToggleFavorite('${evt.id}', this)" 
                                class="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-rose-500 backdrop-blur-md shadow transition-transform active:scale-90"
                                title="${isFav ? 'Remove favorite' : 'Bookmark event'}"
                            >
                                <svg class="w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>

                            <!-- Live Countdown on Card -->
                            <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                                <span class="flex items-center gap-1 font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md" data-countdown-badge="${evt.date}">
                                    ${countdown.badgeText}
                                </span>
                                <span class="px-2 py-0.5 rounded-md font-bold ${evt.price === 0 ? 'bg-emerald-500/90 text-white' : 'bg-indigo-600/90 text-white'} backdrop-blur-md">
                                    ${evt.priceLabel}
                                </span>
                            </div>
                        </div>

                        <!-- Card Content -->
                        <div class="p-4 sm:p-5">
                            <!-- Date & Time -->
                            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>${evt.displayDate}</span>
                            </div>

                            <!-- Title -->
                            <h4 
                                class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2"
                                onclick="App.openEventDetailsModal('${evt.id}')"
                            >
                                ${evt.title}
                            </h4>

                            <!-- Description -->
                            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                ${evt.tagline || evt.description}
                            </p>

                            <!-- Venue -->
                            <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <svg class="w-3.5 h-3.5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="truncate">${evt.venue}</span>
                            </div>

                            <!-- Tags -->
                            <div class="flex flex-wrap gap-1.5 mb-2">
                                ${(evt.tags || []).slice(0, 3).map(tag => `
                                    <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">#${tag}</span>
                                `).join("")}
                            </div>
                        </div>
                    </div>

                    <!-- Actions Footer -->
                    <div class="p-4 sm:p-5 pt-0 mt-auto flex items-center gap-2">
                        <button 
                            onclick="App.openEventDetailsModal('${evt.id}')" 
                            class="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all text-center"
                        >
                            View Details
                        </button>
                        <button 
                            onclick="App.openRegistrationModal('${evt.id}')" 
                            class="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all active:scale-95 text-center"
                        >
                            Register
                        </button>
                    </div>
                </article>
            `;
        }).join("");
    },

    /**
     * Populate Event Selector inside Registration Form
     */
    populateEventSelectDropdown() {
        const select = document.getElementById("selectedEventId");
        if (!select) return;

        const events = StorageManager.getEvents();
        select.innerHTML = `
            <option value="">-- Choose an Event --</option>
            ${events.map(e => `
                <option value="${e.id}">${e.title} (${e.priceLabel})</option>
            `).join("")}
        `;
    },

    /**
     * Toggle Favorite Handler
     */
    handleToggleFavorite(eventId, btnElement) {
        const isNowFav = StorageManager.toggleFavorite(eventId);
        this.updateBadgeCounts();

        // Refresh icons on screen
        const iconSvg = btnElement.querySelector("svg");
        if (iconSvg) {
            if (isNowFav) {
                iconSvg.classList.add("text-rose-500", "fill-rose-500");
                iconSvg.setAttribute("fill", "currentColor");
            } else {
                iconSvg.classList.remove("text-rose-500", "fill-rose-500");
                iconSvg.setAttribute("fill", "none");
            }
        }

        const event = StorageManager.getEventById(eventId);
        this.showToast(
            isNowFav ? `Saved "${event?.title || 'Event'}" to favorites ❤️` : `Removed from favorites`,
            isNowFav ? "success" : "info"
        );

        if (this.state.favoritesOnly) {
            this.renderEventsGrid();
        }
    },

    /**
     * Open Detailed Event Modal
     */
    openEventDetailsModal(eventId) {
        const evt = StorageManager.getEventById(eventId);
        if (!evt) return;

        const modal = document.getElementById("event-details-modal");
        const body = document.getElementById("event-details-modal-body");
        if (!modal || !body) return;

        const countdownHtml = CountdownManager.renderDetailedHtml(evt.date);
        const remainingSpots = (evt.totalCapacity || 100) - (evt.registeredCount || 0);
        const percentFilled = Math.min(100, Math.round(((evt.registeredCount || 0) / (evt.totalCapacity || 100)) * 100));

        body.innerHTML = `
            <!-- Modal Banner -->
            <div class="relative h-64 sm:h-80 w-full overflow-hidden">
                <img src="${evt.image}" alt="${evt.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <div class="absolute top-4 left-4 flex gap-2">
                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-600 text-white shadow">
                        ${evt.category}
                    </span>
                    ${evt.badge ? `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-slate-950">${evt.badge}</span>` : ''}
                </div>

                <div class="absolute bottom-4 left-6 right-6">
                    <span class="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1 block">
                        ${evt.displayDate}
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        ${evt.title}
                    </h2>
                </div>
            </div>

            <!-- Content Area -->
            <div class="p-6 sm:p-8 space-y-8">
                <!-- Live Countdown -->
                <div>
                    <h4 class="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Countdown to Event Kickoff
                    </h4>
                    ${countdownHtml}
                </div>

                <!-- Key Meta Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <div>
                        <span class="block text-xs font-medium text-slate-500 dark:text-slate-400">Date & Time</span>
                        <span class="text-sm font-bold text-slate-900 dark:text-white">${evt.displayDate}</span>
                    </div>
                    <div>
                        <span class="block text-xs font-medium text-slate-500 dark:text-slate-400">Location</span>
                        <a href="${evt.mapUrl || '#'}" target="_blank" class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                            ${evt.venue}
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </a>
                    </div>
                    <div>
                        <span class="block text-xs font-medium text-slate-500 dark:text-slate-400">Entry Admission</span>
                        <span class="text-sm font-extrabold ${evt.price === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}">
                            ${evt.priceLabel}
                        </span>
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">About This Event</h3>
                    <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        ${evt.description}
                    </p>
                </div>

                <!-- Agenda / Timeline -->
                ${evt.agenda && evt.agenda.length > 0 ? `
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Event Schedule & Agenda</h3>
                        <div class="space-y-3 border-l-2 border-indigo-500/30 pl-4 ml-2">
                            ${evt.agenda.map(item => `
                                <div class="relative">
                                    <div class="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900"></div>
                                    <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">${item.time}</span>
                                    <h5 class="text-sm font-bold text-slate-800 dark:text-slate-200">${item.title}</h5>
                                    ${item.speaker ? `<p class="text-xs text-slate-500 dark:text-slate-400">Led by ${item.speaker}</p>` : ''}
                                </div>
                            `).join("")}
                        </div>
                    </div>
                ` : ''}

                <!-- Featured Speakers -->
                ${evt.speakers && evt.speakers.length > 0 ? `
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Featured Speakers & Hosts</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${evt.speakers.map(spk => `
                                <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                                    <img src="${spk.avatar}" alt="${spk.name}" class="w-12 h-12 rounded-full object-cover shadow" />
                                    <div>
                                        <h5 class="text-sm font-bold text-slate-900 dark:text-white">${spk.name}</h5>
                                        <p class="text-xs text-indigo-600 dark:text-indigo-400">${spk.role}</p>
                                        <p class="text-[11px] text-slate-500 dark:text-slate-400">${spk.company}</p>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                ` : ''}

                <!-- Capacity & Progress -->
                <div class="p-4 rounded-xl bg-indigo-50/60 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-700">
                    <div class="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300 font-medium mb-1.5">
                        <span>Attending: <strong>${evt.registeredCount || 0} participants</strong></span>
                        <span>Capacity: <strong>${evt.totalCapacity || 100} max</strong> (${remainingSpots} spots remaining)</span>
                    </div>
                    <div class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style="width: ${percentFilled}%"></div>
                    </div>
                </div>

                <!-- Registration CTA Bar inside modal -->
                <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span class="block text-xs text-slate-500 dark:text-slate-400">Total Admission</span>
                        <span class="text-xl font-black ${evt.price === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}">
                            ${evt.priceLabel}
                        </span>
                    </div>
                    <div class="flex gap-3">
                        <button 
                            onclick="App.closeAllModals()" 
                            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Close
                        </button>
                        <button 
                            onclick="App.closeAllModals(); App.openRegistrationModal('${evt.id}')" 
                            class="px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                        >
                            Register For This Event
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.openModal(modal);
    },

    /**
     * Open Registration Modal Pre-filled with chosen event
     */
    openRegistrationModal(eventId) {
        const modal = document.getElementById("registration-modal");
        const select = document.getElementById("selectedEventId");
        const bannerContainer = document.getElementById("reg-event-banner-card");

        if (select && eventId) {
            select.value = eventId;
        }

        const evt = StorageManager.getEventById(eventId || (select ? select.value : null));

        if (bannerContainer && evt) {
            bannerContainer.innerHTML = `
                <div class="flex items-center gap-4 p-3 rounded-xl bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700">
                    <img src="${evt.image}" alt="${evt.title}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div class="overflow-hidden">
                        <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">${evt.category}</span>
                        <h5 class="text-sm font-bold text-slate-900 dark:text-white truncate">${evt.title}</h5>
                        <p class="text-xs text-slate-500 dark:text-slate-400">${evt.displayDate}</p>
                    </div>
                </div>
            `;
        }

        // Trigger cost recalculation
        const ticketTierInput = document.getElementById("ticketTier");
        const ticketQtyInput = document.getElementById("ticketQuantity");
        const priceEl = document.getElementById("reg-price-summary");
        if (evt && priceEl) {
            const qty = parseInt(ticketQtyInput?.value || 1, 10);
            const total = evt.price * qty;
            priceEl.innerHTML = total > 0 
                ? `Total: <span class="font-bold text-indigo-600 dark:text-indigo-400">$${total.toFixed(2)}</span>`
                : `Total: <span class="font-bold text-emerald-600 dark:text-emerald-400">Free Entry</span>`;
        }

        this.openModal(modal);
    },

    /**
     * Process validated Registration Submission
     */
    processRegistrationSubmission(formData) {
        const submitBtn = document.getElementById("reg-submit-btn");
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "Register";

        // Show spinner / loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Processing Registration...
            `;
        }

        // Simulate network processing delay for realistic UX
        setTimeout(() => {
            const event = StorageManager.getEventById(formData.selectedEventId);
            const savedRecord = StorageManager.saveRegistration({
                participantName: formData.participantName,
                participantEmail: formData.participantEmail,
                participantPhone: formData.participantPhone,
                eventId: formData.selectedEventId,
                eventTitle: event ? event.title : "Community Event",
                eventDate: event ? event.displayDate : "Upcoming",
                eventVenue: event ? event.venue : "Main Venue",
                ticketTier: formData.ticketTier || "Standard Pass",
                ticketsCount: parseInt(formData.ticketQuantity, 10) || 1,
                specialRequests: formData.specialRequests || "None",
                pricePaid: event ? (event.price * (formData.ticketTier === "VIP Pass" ? 1.8 : 1.0) * parseInt(formData.ticketQuantity, 10)) : 0
            });

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }

            // Close registration modal
            this.closeAllModals();

            // Reset the form
            const form = document.getElementById("event-registration-form");
            if (form) {
                form.reset();
                form.querySelectorAll(".input-field").forEach(f => FormValidator.resetField(f));
            }

            // Update app views
            this.renderAll();
            this.updateBadgeCounts();

            // Trigger Confetti Celebration (Bonus Polish)
            this.triggerConfetti();

            // Display Digital Ticket Confirmation Modal
            this.openConfirmationModal(savedRecord);
            this.showToast("Registration Confirmed! Ticket Generated 🎉", "success");
        }, 600);
    },

    /**
     * Confetti Animation Trigger
     */
    triggerConfetti() {
        if (typeof confetti === "function") {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    },

    /**
     * Open Ticket Confirmation Modal
     */
    openConfirmationModal(regRecord) {
        const modal = document.getElementById("ticket-confirmation-modal");
        const container = document.getElementById("confirmation-modal-content");
        if (!modal || !container || !regRecord) return;

        const event = StorageManager.getEventById(regRecord.eventId);

        // Generate QR Code URL via public SVG QR generator API
        const qrData = encodeURIComponent(`EVENTPULSE:${regRecord.id}:${regRecord.participantEmail}`);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`;

        container.innerHTML = `
            <!-- Success Header -->
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-3 shadow-inner">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 dark:text-white">Registration Confirmed!</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Your official admission pass is ready. A confirmation email has been logged.
                </p>
            </div>

            <!-- Printable Digital Ticket Card -->
            <div class="printable-ticket-wrapper">
                <div class="digital-ticket p-6 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <!-- Ticket Header -->
                    <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-indigo-600"></span>
                            <span class="font-black text-base tracking-wider uppercase text-slate-900 dark:text-white">EventPulse Pass</span>
                        </div>
                        <span class="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                            ${regRecord.id}
                        </span>
                    </div>

                    <!-- Ticket Event Details -->
                    <div class="py-4 space-y-3">
                        <h4 class="text-lg font-black text-slate-900 dark:text-white leading-tight">
                            ${regRecord.eventTitle}
                        </h4>
                        
                        <div class="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span class="text-slate-500 dark:text-slate-400 block font-medium">Attendee</span>
                                <span class="font-bold text-slate-800 dark:text-slate-200">${regRecord.participantName}</span>
                            </div>
                            <div>
                                <span class="text-slate-500 dark:text-slate-400 block font-medium">Pass Type</span>
                                <span class="font-bold text-indigo-600 dark:text-indigo-400">${regRecord.ticketTier} (${regRecord.ticketsCount}x)</span>
                            </div>
                            <div>
                                <span class="text-slate-500 dark:text-slate-400 block font-medium">Date & Time</span>
                                <span class="font-bold text-slate-800 dark:text-slate-200">${regRecord.eventDate}</span>
                            </div>
                            <div>
                                <span class="text-slate-500 dark:text-slate-400 block font-medium">Venue</span>
                                <span class="font-bold text-slate-800 dark:text-slate-200 truncate block">${regRecord.eventVenue}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Ticket QR & Verification Footer -->
                    <div class="pt-4 border-t border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
                        <div class="space-y-1">
                            <span class="text-[11px] text-slate-500 dark:text-slate-400 block">Scan at venue entrance</span>
                            <span class="text-[11px] font-mono text-slate-400 block">Status: <strong>VERIFIED</strong></span>
                            <span class="text-[10px] text-slate-400 block">Contact: ${regRecord.participantEmail}</span>
                        </div>
                        <div class="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
                            <img src="${qrUrl}" alt="QR Entry Code" class="w-16 h-16" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex flex-wrap items-center justify-center gap-3 non-printable">
                <button 
                    onclick="window.print()" 
                    class="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-white flex items-center gap-2 shadow"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    Print / Save PDF Ticket
                </button>
                <a 
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(regRecord.eventTitle)}&details=${encodeURIComponent('Event registration pass ' + regRecord.id)}&location=${encodeURIComponent(regRecord.eventVenue)}" 
                    target="_blank"
                    class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Add to Calendar
                </a>
                <button 
                    onclick="App.closeAllModals(); App.openMyTicketsModal();" 
                    class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                    View All My Tickets
                </button>
            </div>
        `;

        this.openModal(modal);
    },

    /**
     * Open "My Tickets / Registrations" Modal
     */
    openMyTicketsModal() {
        const modal = document.getElementById("my-tickets-modal");
        const listContainer = document.getElementById("my-tickets-list");
        if (!modal || !listContainer) return;

        const registrations = StorageManager.getRegistrations();

        if (registrations.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-12 px-4">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                    <h4 class="text-lg font-bold text-slate-800 dark:text-slate-200">No Registrations Yet</h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                        You have not registered for any upcoming events. Explore our schedule and book your pass!
                    </p>
                    <button 
                        onclick="App.closeAllModals()" 
                        class="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-700"
                    >
                        Browse Events Now
                    </button>
                </div>
            `;
        } else {
            listContainer.innerHTML = registrations.map(reg => `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-900 px-2 py-0.5 rounded">
                                ${reg.id}
                            </span>
                            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
                                Confirmed
                            </span>
                        </div>
                        <h4 class="text-base font-bold text-slate-900 dark:text-white">
                            ${reg.eventTitle}
                        </h4>
                        <div class="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                            <span>📅 ${reg.eventDate}</span>
                            <span>📍 ${reg.eventVenue}</span>
                            <span>👤 ${reg.participantName} (${reg.ticketTier})</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                        <button 
                            onclick="App.openConfirmationModal(StorageManager.getRegistrationById('${reg.id}'))" 
                            class="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-slate-600 transition"
                        >
                            View Ticket
                        </button>
                        <button 
                            onclick="App.handleCancelRegistration('${reg.id}')" 
                            class="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            `).join("");
        }

        this.openModal(modal);
    },

    /**
     * Handle Cancellation of Registration
     */
    handleCancelRegistration(regId) {
        if (!confirm("Are you sure you want to cancel this registration pass?")) {
            return;
        }

        const success = StorageManager.cancelRegistration(regId);
        if (success) {
            this.showToast("Registration cancelled successfully", "info");
            this.openMyTicketsModal(); // re-render modal list
            this.renderAll();
            this.updateBadgeCounts();
        }
    },

    /**
     * Host an Event Modal & Form Submission (Bonus CRUD Feature)
     */
    openHostEventModal() {
        const modal = document.getElementById("host-event-modal");
        this.openModal(modal);
    },

    processHostEvent(formElement) {
        const title = formElement.eventTitle.value.trim();
        const category = formElement.eventCategory.value;
        const date = formElement.eventDate.value;
        const venue = formElement.eventVenue.value.trim();
        const price = formElement.eventPrice.value;
        const capacity = formElement.eventCapacity.value;
        const image = formElement.eventImageUrl.value.trim() || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";
        const description = formElement.eventDesc.value.trim();

        if (!title || !date || !venue || !description) {
            alert("Please fill in all required fields to create the event.");
            return;
        }

        const created = StorageManager.addCustomEvent({
            title,
            category,
            date: new Date(date).toISOString(),
            venue,
            city: "Local Venue",
            price,
            totalCapacity: capacity,
            image,
            description,
            tagline: description.substring(0, 100) + "...",
            tags: [category, "Community"]
        });

        if (created) {
            this.closeAllModals();
            formElement.reset();
            this.renderAll();
            this.showToast(`Event "${created.title}" published successfully! 🚀`, "success");
            this.populateEventSelectDropdown();
        }
    },

    /**
     * Modal Helper Functions
     */
    openModal(modalElement) {
        if (!modalElement) return;
        this.closeAllModals();
        modalElement.classList.remove("hidden");
        modalElement.classList.add("flex");
        document.body.style.overflow = "hidden";
        this.state.currentModal = modalElement;
    },

    closeAllModals() {
        document.querySelectorAll(".modal-root").forEach(modal => {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        });
        document.body.style.overflow = "";
        this.state.currentModal = null;
    },

    /**
     * Update Badge Counts (My Tickets & Saved Favorites)
     */
    updateBadgeCounts() {
        const registrations = StorageManager.getRegistrations();
        const favorites = StorageManager.getFavorites();

        document.querySelectorAll(".my-tickets-count-badge").forEach(el => {
            el.textContent = registrations.length;
            el.classList.toggle("hidden", registrations.length === 0);
        });

        document.querySelectorAll(".favorites-count-badge").forEach(el => {
            el.textContent = favorites.length;
            el.classList.toggle("hidden", favorites.length === 0);
        });
    },

    /**
     * Toast Notifications System
     */
    showToast(message, type = "info") {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast-alert ${
            type === "success" 
                ? "border-emerald-500/40 text-emerald-900 dark:text-emerald-200" 
                : type === "error" 
                ? "border-rose-500/40 text-rose-900 dark:text-rose-200" 
                : "border-indigo-500/40 text-indigo-900 dark:text-indigo-200"
        }`;

        const iconHtml = type === "success"
            ? `<svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
            : type === "error"
            ? `<svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
            : `<svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

        toast.innerHTML = `
            ${iconHtml}
            <span class="text-xs sm:text-sm font-medium leading-tight">${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove after 3.5 seconds
        setTimeout(() => {
            toast.classList.add("fade-out");
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, 300);
        }, 3500);
    }
};

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
