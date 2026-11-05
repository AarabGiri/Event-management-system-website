/**
 * EventPulse - Dynamic Event Countdown Engine
 * Calculates real-time Days, Hours, Minutes, Seconds till event kickoff
 */

const CountdownManager = {
    intervals: new Map(),

    /**
     * Compute remaining time object
     */
    getTimeRemaining(targetDateStr) {
        const target = new Date(targetDateStr).getTime();
        const now = new Date().getTime();
        const difference = target - now;

        if (difference <= 0) {
            return {
                total: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isPast: true,
                badgeText: "Event Ongoing / Ended"
            };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return {
            total: difference,
            days,
            hours,
            minutes,
            seconds,
            isPast: false,
            badgeText: `${days}d ${hours}h ${minutes}m ${seconds}s left`
        };
    },

    /**
     * Format a compact countdown string for card badges
     */
    formatCompact(targetDateStr) {
        const t = this.getTimeRemaining(targetDateStr);
        if (t.isPast) return "Started";
        if (t.days > 0) return `${t.days}d ${t.hours}h left`;
        return `${t.hours}h ${t.minutes}m ${t.seconds}s`;
    },

    /**
     * Render countdown HTML blocks for hero or modal
     */
    renderDetailedHtml(targetDateStr) {
        const t = this.getTimeRemaining(targetDateStr);
        if (t.isPast) {
            return `<div class="text-sm font-semibold text-rose-500 py-2">Event is currently live or completed</div>`;
        }
        return `
            <div class="grid grid-cols-4 gap-2 text-center" data-countdown-container="${targetDateStr}">
                <div class="bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700/60 rounded-xl p-2.5 shadow-sm">
                    <span class="block text-2xl font-black text-indigo-600 dark:text-indigo-400 countdown-val-days">${String(t.days).padStart(2, '0')}</span>
                    <span class="text-[11px] font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase">Days</span>
                </div>
                <div class="bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700/60 rounded-xl p-2.5 shadow-sm">
                    <span class="block text-2xl font-black text-indigo-600 dark:text-indigo-400 countdown-val-hours">${String(t.hours).padStart(2, '0')}</span>
                    <span class="text-[11px] font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase">Hours</span>
                </div>
                <div class="bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700/60 rounded-xl p-2.5 shadow-sm">
                    <span class="block text-2xl font-black text-indigo-600 dark:text-indigo-400 countdown-val-minutes">${String(t.minutes).padStart(2, '0')}</span>
                    <span class="text-[11px] font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase">Mins</span>
                </div>
                <div class="bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700/60 rounded-xl p-2.5 shadow-sm">
                    <span class="block text-2xl font-black text-indigo-600 dark:text-indigo-400 countdown-val-seconds">${String(t.seconds).padStart(2, '0')}</span>
                    <span class="text-[11px] font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase">Secs</span>
                </div>
            </div>
        `;
    },

    /**
     * Start a global 1-second ticker that updates any active countdown elements on screen
     */
    startGlobalTicker() {
        if (this.globalTicker) clearInterval(this.globalTicker);

        this.globalTicker = setInterval(() => {
            // Update badge countdowns
            document.querySelectorAll("[data-countdown-badge]").forEach(el => {
                const target = el.getAttribute("data-countdown-badge");
                if (target) {
                    const info = CountdownManager.getTimeRemaining(target);
                    el.textContent = info.badgeText;
                }
            });

            // Update detailed grid countdowns
            document.querySelectorAll("[data-countdown-container]").forEach(container => {
                const target = container.getAttribute("data-countdown-container");
                if (target) {
                    const t = CountdownManager.getTimeRemaining(target);
                    const daysEl = container.querySelector(".countdown-val-days");
                    const hoursEl = container.querySelector(".countdown-val-hours");
                    const minsEl = container.querySelector(".countdown-val-minutes");
                    const secsEl = container.querySelector(".countdown-val-seconds");

                    if (daysEl) daysEl.textContent = String(t.days).padStart(2, '0');
                    if (hoursEl) hoursEl.textContent = String(t.hours).padStart(2, '0');
                    if (minsEl) minsEl.textContent = String(t.minutes).padStart(2, '0');
                    if (secsEl) secsEl.textContent = String(t.seconds).padStart(2, '0');
                }
            });
        }, 1000);
    }
};

CountdownManager.startGlobalTicker();
