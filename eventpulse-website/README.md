# EventPulse 🎟️ — Modern & Responsive Event Management Platform

[![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)](https://github.com/)
[![Built With](https://img.shields.io/badge/Built_With-HTML5_•_CSS3_•_JavaScript-orange?style=for-the-badge)](https://developer.mozilla.org/)
[![Styling](https://img.shields.io/badge/Styling-TailwindCSS_•_Custom_CSS-38bdf8?style=for-the-badge)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deployable_On-GitHub_Pages_•_Vercel_•_Netlify-000000?style=for-the-badge)](https://pages.github.com/)

> **Task Title:** Design and Develop a Responsive Event Management Website  
> **Course / Program:** K Explore – Web Designing  
> **Evaluation Criteria:** Creativity, UI/UX, Functionality, Responsiveness, Code Quality, GitHub Documentation & Deployment Readiness.

---

## 🌟 Live Demo & Preview
- **Live Deployment:** Deployable to [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com/), or [Netlify](https://www.netlify.com/) with zero build steps.
- **Repository:** Self-contained Git repository with clean modular architecture.

---

## 📖 Executive Summary

**EventPulse** is an interactive, mobile-first, responsive event discovery and registration web application. It empowers users to explore upcoming summits, conferences, music festivals, design masterclasses, and community hackathons. 

The application delivers an engaging user experience with:
- Intuitive navigation and real-time live search.
- Category filtering and sorting options.
- Dynamic event countdown timers.
- Detailed modal views with event schedules, speaker profiles, and venue locations.
- Client-side **JavaScript-based form validation** for registration.
- **Digital Ticket Pass** generation with unique Registration IDs and entrance QR codes.
- Local storage persistence for user registrations, bookmarks, and theme preferences.

---

## ✨ Features & Requirements Breakdown

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Attractive Hero Section** | High-impact headline, animated floating glow accents, quick platform metrics (48+ events, 18.5k+ attendees), and an interactive quick-search & category jump bar. | ✅ Completed |
| **Featured & Upcoming Events** | Showcase carousel highlighting premier events, high-resolution imagery, category tags, seating progress bars, and countdown timers. | ✅ Completed |
| **Event Cards & Data Display** | Name, date/time, venue with map directions, image, short summary, price badge, capacity counter, and action triggers (*"View Details"*, *"Register"*). | ✅ Completed |
| **Browse, Search & Filter** | Instant live search (matches title, description, venue, tags), category pills, sorting (*Soonest Date, Popularity, Price Asc/Desc, Alphabetical*), and Free/Favorites toggles. | ✅ Completed |
| **Detailed Event View** | Full modal view featuring rich agendas/timelines, key speaker cards, interactive Google Maps directions, and seating availability. | ✅ Completed |
| **Registration Form** | Modal form capturing participant name, email, phone number, pass tier, ticket quantity, special requests, and terms consent. | ✅ Completed |
| **JavaScript Form Validation** | Real-time input validation on `input` and `blur` using regex patterns; dynamic error messages and visual indicators (green checkmark / red alert). | ✅ Completed |
| **Confirmation & Digital Pass** | Celebratory confetti burst, booking confirmation, unique Ticket ID (e.g. `EP-2026-XXXXXX`), entrance QR code, and "Add to Calendar" link. | ✅ Completed |
| **Printable Ticket Pass** | Custom `@media print` stylesheet optimizing ticket layout for physical printing or PDF export. | ✅ Completed |
| **Responsive Design** | 100% mobile-first layout tested across mobile devices, tablets, laptops, and ultra-wide desktops. Accessible mobile menu drawer. | ✅ Completed |
| **Bonus: Dark / Light Mode** | Seamless color scheme toggling with local storage persistence and system preference fallback. | 🏆 Bonus Met |
| **Bonus: Countdown Timers** | Real-time ticker calculating Days, Hours, Minutes, and Seconds for all upcoming events. | 🏆 Bonus Met |
| **Bonus: LocalStorage Data** | Full registration management (*"My Tickets"* drawer), event bookmarking/favorites, and attendee count syncing. | 🏆 Bonus Met |
| **Bonus: Host Community Event** | Event organizers can publish custom events directly into the local directory via a dedicated form. | 🏆 Bonus Met |

---

## 🛠️ Tech Stack & Architecture

- **Markup:** Semantic **HTML5** (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) with ARIA roles for accessibility.
- **Styling:** **Tailwind CSS** (via CDN) paired with bespoke **CSS3** (`css/style.css`) for glassmorphism (`backdrop-filter: blur()`), custom keyframe animations, and `@media print` rules.
- **Scripting:** Pure vanilla modern **JavaScript (ES6+)**:
  - `js/events-data.js`: Dynamic dataset generating upcoming dates relative to current execution time.
  - `js/storage.js`: LocalStorage wrapper for registrations, custom events, favorites, and themes.
  - `js/countdown.js`: Interval-based countdown engine with badge and grid formatters.
  - `js/validation.js`: Regex form validation engine with real-time UI state mutation.
  - `js/app.js`: Master application controller handling filtering, modal lifecycle, and notifications.
- **Visuals & Assets:** Unsplash high-resolution photography, SVG iconography, and Canvas Confetti library.

---

## 📁 Project Directory Structure

```text
eventpulse-website/
├── index.html              # Main Single-Page Application (SPA) entry point
├── README.md               # Complete project documentation & guide
├── .gitignore              # Standard Git ignore file
├── css/
│   └── style.css           # Custom stylesheets, animations, themes & print layout
├── js/
│   ├── events-data.js      # Rich dataset of curated upcoming events
│   ├── storage.js          # LocalStorage CRUD manager
│   ├── countdown.js        # Dynamic countdown ticker engine
│   ├── validation.js       # Form validation logic & error display handlers
│   └── app.js              # Main application controller & modal managers
└── assets/                 # Static resources & icons
```

---

## 🔍 JavaScript Form Validation Specification

Form validation is handled by `js/validation.js` with strict rules before submission:

1. **Full Name:**
   - Pattern: `/^[a-zA-Z\s\.\-']{3,50}$/`
   - Constraints: Minimum 3 characters; allows letters, spaces, hyphens, and periods.
2. **Email Address:**
   - Pattern: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
   - Constraints: Standard RFC-compliant email structure with valid domain.
3. **Phone Number:**
   - Pattern: `/^\+?[0-9\s\-\(\)]{10,18}$/`
   - Constraints: Minimum 10 digits; allows international dialing codes (`+1`, `+91`, etc.).
4. **Selected Event:**
   - Mandatory selection matching an existing event record.
5. **Pass Quantity:**
   - Integer between 1 and 10.
6. **Terms & Guidelines Checkbox:**
   - Must be explicitly checked prior to confirmation.

---

## 🚀 How to Run the Project Locally

No Node.js or server installation is strictly necessary because EventPulse is written with zero-build web standards.

### Option 1: Direct Browser Launch
1. Clone or download this repository:
   ```bash
   git clone <your-repository-url>
   cd eventpulse-website
   ```
2. Double-click `index.html` or open it with any web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Using VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.
3. The site will run on `http://127.0.0.1:5500/`.

### Option 3: Using Python Built-in HTTP Server
```bash
# Python 3
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

---

## 🌐 Deployment Instructions

### 1. Deploying to GitHub Pages (Recommended)
1. Initialize Git in the project directory (already initialized) and commit all files:
   ```bash
   git add .
   git commit -m "Initial commit: EventPulse website complete implementation"
   ```
2. Create a new public repository on [GitHub](https://github.com/).
3. Link your local repo and push:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
4. On GitHub, navigate to **Settings** > **Pages**.
5. Under **Branch**, select `main` and root `/`, then click **Save**.
6. Your live website link will be generated in 1–2 minutes: `https://<your-username>.github.io/<your-repo-name>/`.

### 2. Deploying to Vercel
1. Install Vercel CLI (`npm i -g vercel`) or go to [vercel.com](https://vercel.com/).
2. Import your GitHub repository.
3. Keep default settings (Framework Preset: **Other**, Root Directory: `./`).
4. Click **Deploy**. Vercel will provide an instant live SSL link.

### 3. Deploying to Netlify
1. Log into [netlify.com](https://www.netlify.com/).
2. Drag and drop the `eventpulse-website` folder directly into the Netlify Drop area.
3. Netlify will deploy it instantly with a public `.netlify.app` domain.

---

## 🏆 Bonus Challenges Demonstrated

1. **Dark & Light Mode:**
   - Persisted via `localStorage`.
   - Real-time toggle button in navigation header.
   - Respects user's system OS preference (`prefers-color-scheme`).
2. **Dynamic Live Countdowns:**
   - Live 1-second ticker recalculating Days, Hours, Minutes, and Seconds.
   - Dates are calculated dynamically into the future so countdowns remain active regardless of when the site is viewed.
3. **Local Storage Registration Data Management:**
   - All bookings are saved in `localStorage`.
   - Dedicated *"My Tickets"* management drawer allows viewing passes, re-printing, and cancelling registrations.
   - Bookmarked / Favorited events persist across browser refreshes.
4. **Host a Community Event (CRUD):**
   - Modal form enabling users to add new custom events directly into the application state with instant persistence.

---

## 📝 Author & Acknowledgments

- **Project:** K Explore – Web Designing Task
- **Author:** KIIT / Web Designing Student Team
- **License:** MIT License — Open for educational and showcase purposes.
