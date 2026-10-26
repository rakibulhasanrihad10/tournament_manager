# 🏟️ Sports Tournament Pro - Multi-Sport Tournament Management Platform

An offline-first, client-side, interactive sports management platform and print-ready fixture/roster generator built for local, regional, corporate, and municipal tournaments. Features a unified **Sports Hub** router supporting **Football**, **Cricket**, **Badminton**, and more.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-200%2B%20Passing-brightgreen?style=flat-square)

---

## 🌟 Platform Highlights & Multi-Sport Architecture

### 1. 🏠 Unified Sports Hub & Router
A central routing navigation hub that lets organizers seamlessly manage and switch across different sporting disciplines:
- ⚽ **Football Tournament Engine (Live & Full-Featured):** Complete tournament management suite with automated standings, tiebreakers, visual fixture brackets, and penalty shootouts.
- 🏏 **Cricket Tournament Manager (Roadmap / Next Module):** T-10, T-20 & short-over league fixtures, Net Run Rate (NRR) automated formula engine, ball-by-ball score tracking, and landscape scorebooks.
- 🏸 **Badminton Tournament Manager (Roadmap / Next Module):** Singles & doubles knockout brackets (8/16/32 players), official BWF 21-point & 3-set scoring with deuce/golden point rules, and multi-court umpire scheduling.
- ✨ **Future Sports Expansion:** Planned expansion for Volleyball (ভলিবল), Table Tennis (টেবিল টেনিস), Carrom (ক্যারাম), and Chess (দাবা).

---

### 2. ⚙️ Universal Tournament Setup & Rules Wizard
- **Intelligent Format Recommendation Engine:** Suggests the optimal tournament format based on the number of participating teams:
  - 🏆 **Groups + Knockout:** Automatically groups teams (e.g. 9 teams into 3 groups of 3; 8 teams into 2 groups of 4), schedules group stage matches, cross-over semifinals, and grand final.
  - 🔄 **Single League Table (Round-Robin):** Every team plays each other once or twice; top 2 qualify for the Mega Grand Final.
  - ⚡ **Direct Knockout:** Power-of-2 tournament tree (Quarter-finals, Semi-finals, Grand Final).
- **Squad Size & Substitution Rules Configuration:**
  - Preset configurations for **FIFA 11-a-side** (11 on-field, 15 bench, 5 max subs), **7-a-side**, and **5-a-side Futsal**.
  - Built-in validation guarding against entering more than 11 on-field players.
- **Categorized Rules Catalog:** 25+ pre-configured realistic rules across 7 categories (Eligibility, Timing, Shootouts, Tiebreakers, Cards, Rolling Substitutions, Protests).

---

### 3. 🗺️ Live Visual Interactive Match Bracket & Fixture Tree
- **Full Group Stage Rendering:** Displays every single scheduled group match (e.g., all 9 matches for 9 teams) organized cleanly by group with badges (`ম্যাচ ১ • গ্রুপ এ`, `মুড়িয়ারা ⚔️ নোয়াপাড়া`).
- **Interactive Group Filter Bar:** One-click filter buttons (`[সব (৯টি)]`, `[গ্রুপ এ (৩)]`, `[গ্রুপ বি (৩)]`, `[গ্রুপ সি (৩)]`) for quick inspection.
- **Complete Roadmap Flow:** Visual journey mapping from Group Stage ➔ Cross-Over Semi-Finals ➔ Mega Grand Final ➔ Champion Coronation Trophy.

---

### 4. 👥 Digital Team Registration & Squad Roster Portal
- **Online Team Registration Modal:** Team managers can register team names, manager names, phone numbers, jerseys, and player rosters.
- **Auto-Syncing with Tournament Config:** Newly registered teams automatically populate into the tournament roster and standings tables.
- **Digital Registration Slips:** Downloadable and printable verification slips for registered squads.
- **Shareable Registration Link:** Instant `#register` direct link for distribution to team managers.

---

### 5. 📊 Automated Standings & Disciplinary Tiebreaker Engine
- **Live Points Table:** Auto-calculates Played (PL), Won (W), Drawn (D), Lost (L), Goals For (GF), Goals Against (GA), Goal Difference (GD), Points (PTS), and Fair Play Disciplinary Points (FP).
- **Strict FIFA-Standard Tiebreakers:** Head-to-Head ➔ Goal Difference ➔ Goals For ➔ Disciplinary Fair Play Points (-1 for yellow card, -3 for red card).
- **Automatic Best Runner-Up Qualification:** Intelligently compares 2nd-place teams across groups for the 4th knockout semifinal slot.

---

### 6. ⏱️ Match Center & Live Event Logger
- **Match Event Modal:** Log individual goals, yellow cards, red cards, and player attributions.
- **Readonly Score Synchronization:** Automated event-driven scores eliminate manual input mistakes.
- **Penalty Shootout Shoot-off Engine:** Instant tie-breaker resolution for knockout stages including sudden-death penalties.

---

### 7. 🌐 100% Bilingual (i18n) Engine
- **1-Click Instant Language Toggle:** Seamless switching between **Bengali (বাংলা)** and **English (EN)** without reloading the page.
- Complete localization across all modules: Sports Hub, Navigation, Wizard, Standings, Leaderboards, Registration, and Promotional Posters.
- Persisted in browser `localStorage`.

---

### 8. 🎨 Design Tokens, Dark/Light Mode & Print Sheet Theme
- **System-Wide Dark / Light Mode:** Modern stadium floodlight dark theme and clean light theme powered by CSS custom properties.
- **Independent Print Sheet Theme:** Organizers can choose between **White Paper (Ink-Saving)** and **Stadium Floodlight (Vibrant)** independently for physical printouts and on-screen display.
- **A4 Landscape Print Engine:** Optimized print stylesheet (`src/css/print.css`) delivering crisp, vector-sharp double-page sheets:
  - **Page 1:** Fixtures, Group Standings, Knockout Tree & Golden Boot Leaderboard.
  - **Page 2:** Official 9-Team Squad Rosters, Manager Contacts, and Rulebook.

---

### 9. 📢 Social Media Circular & Promotional Poster Generator
- Dark-stadium themed circular preview showcasing champion prizes, venues, format, entry fees, and rules.
- **1-Click WhatsApp / Facebook Copy:** Copies an emoji-formatted, ready-to-publish announcement directly to the clipboard.
- **A4 Poster Print / PDF Export:** Standalone promotional flyer export.

---

## 📁 Project Architecture

The codebase follows strict **Separation of Concerns (SoC)** with zero external runtime dependencies:

```text
tournament_manager/
├── .gitattributes          # Normalizes line endings across OS platforms
├── .gitignore              # Ignores OS, IDE, logs, and temporary files
├── index.html              # Semantic HTML structure & modal containers
├── README.md               # Project documentation and guide
│
├── assets/                 # Media assets (crests, banners, icons)
│   └── .gitkeep
│
├── src/                    # Source Code
│   ├── css/                # Presentation Layer
│   │   ├── hub.css         # Sports Hub navigation & sport preview modal styles
│   │   ├── main.css        # Design tokens, layout, brackets, tables & awards
│   │   ├── modals.css      # Match events, wizard tabs, bracket trees & dark overrides
│   │   ├── print.css       # A4 landscape @media print isolation & paper theme
│   │   └── style.css       # Master stylesheet entry point
│   │
│   └── js/                 # Business Logic & Controllers
│       ├── hub.js          # Sports Hub navigation router & upcoming sport roadmaps
│       ├── constants.js    # Master rules catalog, presets, squads & fixtures
│       ├── i18n.js         # Internationalization (i18n) engine & bilingual dictionaries
│       ├── state.js        # Reactive state, structure generator & localStorage persistence
│       ├── calculator.js   # Standings math, tiebreakers, Golden Boot & bracket engine
│       ├── wizard.js       # Setup wizard, recommendations, squad rules & bracket viewer
│       ├── registration.js # Team registration portal, squad rosters & slip generator
│       ├── match-events.js # Match event logger, score sync & penalty shootouts
│       ├── roster.js       # Page 2 squad selector & rules catalog DOM renderer
│       ├── poster.js       # Social media promo card generator & clipboard copy
│       └── app.js          # Application lifecycle, theme engine & print controllers
│
├── scripts/                # Development & Verification Scripts
│   └── verify-i18n.js      # Verifies 100% parity between Bengali and English keys
│
└── tests/                  # Automated Test Suites (Native Node.js)
    ├── wizard.test.js       # Setup Wizard, recommendations, visual brackets (114 tests)
    ├── calculator.test.js   # Standings math, tiebreakers, GD, FP, shootouts (15 tests)
    ├── registration.test.js # Registration portal validation & roster sync (32 tests)
    ├── hub.test.js          # Sports Hub routing, sport previews & modal flows (19 tests)
    ├── theme.test.js        # System dark/light modes & print paper themes (13 tests)
    └── i18n.test.js         # Translations dictionary integrity & live DOM updates (11 tests)
```

---

## 🧪 Running Automated Unit Tests

The project includes **204 automated unit tests** built with zero external test runner dependencies. Run them directly using Node.js:

```bash
# Run all automated test suites:
node tests/wizard.test.js
node tests/calculator.test.js
node tests/registration.test.js
node tests/hub.test.js
node tests/theme.test.js
node tests/i18n.test.js

# Verify 100% parity of all HTML i18n dictionary keys:
node scripts/verify-i18n.js
```

---

## 🚀 Getting Started

No build tools, bundlers, or package installations are required:

1. **Clone this repository:**
   ```bash
   git clone https://github.com/rakibulhasanrihad10/tournament_manager.git
   cd tournament_manager
   ```

2. **Open the application:**
   - Double-click [`index.html`](file:///d:/Projects/Tournament/index.html) or open it in any modern browser (Chrome, Edge, Firefox, Safari, Brave).

3. **Explore Features:**
   - On the **Sports Hub**, click **"🚀 ফুটবল টুর্নামেন্টে প্রবেশ করুন"** (Launch Football Tournament).
   - Click **"⚡ ডেমো ডাটা"** (Demo Data) in the action bar to instantly populate a live tournament in progress.
   - Click **"⚙️ টুর্নামেন্ট সেটআপ ও নিয়মাবলী"** (Setup & Rules) to try the intelligent recommendation engine and interactive visual fixture bracket!

---

## 💾 Local Storage Persistence

All tournament data—including configurations, live scores, penalty shootouts, registrations, player rosters, and match events—are automatically persisted in the browser's `localStorage`:
- `chitadda_tournament_config_2026`
- `chitadda_app_state_2026`
- `chitadda_tournament_rosters_2026`
- `tournament_lang_pref`
- `chitadda_app_theme`
- `chitadda_sheet_theme`

Refreshing or closing your browser will never lose tournament progress.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
