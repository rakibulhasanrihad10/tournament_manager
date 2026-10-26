# ⚽ Universal Football Tournament Management System

An offline-first, client-side, interactive tournament management platform and print-ready fixture/roster generator built for local, regional, and municipal football tournaments.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🌟 Highlights & Key Features

1. **🚀 Universal Tournament Setup Wizard:**
   - Configure tournament title, organizer, venue, format (6-a-side, 7-a-side, 8-a-side, 5-a-side Futsal, 11-a-side), match duration, ball size, entry fee, registration deadline, and hotline contact.
   - **One-Click Presets:** Instant configuration for *Inter-Ward 6-a-side*, *Minibar Night Tournament*, and *Prize-Money Gold Cup*.

2. **📜 25+ Categorized Rules Catalog & Custom Rules Engine:**
   - Pre-configured with 25+ realistic football tournament rules across 7 categories:
     - 👥 Squad & Player Eligibility
     - ⏱️ Match Duration & Reporting
     - 🎯 Draws & Penalty Shootouts
     - 📊 Standings, GD & Tiebreakers
     - ⚖️ Discipline, Yellow/Red Cards & Fair Play
     - 🔄 Rolling Substitutions & Special In-Game Rules
     - 🛡️ Protest Fees, Entry Fees & Weather Policies
   - Live search filter and custom rule addition form.

3. **📢 Promotional Poster & Social Media Generator:**
   - Dark-stadium themed promotional circular preview showcasing champion/runner-up prizes, format, fees, and rules.
   - **1-Click Facebook / WhatsApp Copy:** Generates an emoji-rich, publication-ready circular directly to clipboard.
   - **Print / PDF Poster:** Standalone A4 poster export.

4. **⚡ Live Interactive Match Event Tracker:**
   - Event logging modal for each match: record Goals, Yellow Cards, and Red Cards with automatic player attribution.
   - Event-driven scoreline synchronization (readonly score inputs prevent manual tracking errors).
   - Instant 0–0 draw marker & live shootout winner selector.

5. **📊 Automated Standings & Knockout Engine:**
   - Auto-computes: Played (PL), Won (W), Drawn (D), Lost (L), GF, GA, GD, Points (PTS), and Disciplinary Fair Play Points (FP).
   - Strict tiebreaker order: Head-to-Head &rarr; Goal Difference &rarr; Goals For &rarr; Fair Play record.
   - Automatic Best Runner-Up qualification for the 4th semi-final slot.
   - Dynamic bracket resolution: Semi-finals &rarr; 3rd Place Playoff &rarr; Grand Final & Champion coronation.

6. **🏆 Individual Awards & Leaderboards:**
   - Real-time **Golden Boot** top goalscorer leaderboard.
   - Golden Glove (Best Goalkeeper) and Man of the Match/Tournament tracking.

7. **🌐 Full Internationalization (i18n) & Localization (l10n) Engine:**
   - Sleek **1-Click Language Switcher** in the action bar (`🌐 [বাংলা] [English]`) with persistence in `localStorage` (`tournament_lang_pref`).
   - Dynamic bilingual rendering across the entire interface:
     - Navigation buttons, headers, tooltips, and document titles.
     - Page 1 standings tables, tiebreaker formula, awards, Golden Boot chips, and knockout bracket match cards.
     - Page 2 squad registration tables, manager details, and dynamic tournament rules catalog.
     - Setup Wizard presets, category groupings, rules search, and custom rule builder.
     - Social Media Promotional Poster preview and dual-language Facebook/WhatsApp announcement generator.

8. **🖨️ Pixel-Perfect A4 Landscape Print Engine:**
   - Dedicated print stylesheet optimized for physical sheets or PDF export:
     - **Page 1:** Complete Tournament Fixture, Standings & Bracket.
     - **Page 2:** Official 9-Team Squad Rosters, Managers, Contacts & Rules.
     - **Single-Page Isolation:** Print Page 1 only, Page 2 only, or All.

9. **🎨 System-Wide Dark & Light Mode + Independent Print Sheet Theme:**
   - **System Color Mode:** True Design Token architecture (`:root` / `[data-theme="dark"]` / `[data-theme="light"]`) controlling the entire software shell (action bar, backgrounds, modals, forms, and inputs) with `localStorage` persistence and OS `prefers-color-scheme` sync.
   - **Flash-Free Loading:** Inline pre-render initialization script eliminates the Flash of Incorrect Theme (FOIT).
   - **Print Sheet Theme Option:** Dedicated toggle for tournament fixture sheets allowing organizers to choose between **White Paper (Ink-Saving)** and **Stadium Floodlight (Vibrant Color)** independently for printing and screen viewing.

---

## 📁 Project Architecture

The codebase follows strict **Separation of Concerns (SoC)** and is structured for seamless scaling or future framework migrations (e.g., Next.js):

```text
Tournament/
├── .gitattributes      # Normalizes line endings across OS platforms
├── .gitignore          # Ignores OS, IDE, logs, and temporary files
├── index.html          # Semantic HTML structure & modal containers
├── README.md           # Project documentation and guide
│
├── assets/             # Media assets (team crests, sponsor banners, fonts)
│   └── .gitkeep        # Preserves empty asset folder in Git
│
├── src/                # Primary Source Code
│   ├── css/            # Presentation Layer
│   │   ├── main.css    # Design tokens, layout, brackets, tables & awards
│   │   ├── modals.css  # Match event modal, wizard tabs & dark theme overrides
│   │   ├── print.css   # A4 landscape @media print isolation & paper theme styles
│   │   └── style.css   # Master stylesheet entry point
│   │
│   └── js/             # Business Logic & Controllers
│       ├── constants.js    # Master rules catalog, presets, default squads & fixtures
│       ├── i18n.js         # Internationalization (i18n) engine & bilingual dictionaries
│       ├── state.js        # Global reactive state & localStorage persistence
│       ├── calculator.js   # Standings math, tiebreakers, Golden Boot & bracket engine
│       ├── roster.js       # Page 2 squad selector & rules list DOM renderer
│       ├── match-events.js # Match events logger, live banner & penalty shootout
│       ├── wizard.js       # Tournament setup wizard & custom rules controller
│       ├── poster.js       # Social media promo card generator & clipboard copy
│       └── app.js          # App lifecycle, dark/light theme engine & print handlers
│
└── tests/              # Automated Test Suites
    ├── calculator.test.js  # Unit tests for standings math, GD, FP & tiebreakers
    ├── i18n.test.js        # Unit tests for bilingual translations & DOM switching
    └── theme.test.js       # Unit tests for dark/light mode & print sheet theme
```

---

## 🧪 Running Automated Tests

Zero-dependency unit test suites verify calculations, tiebreakers, rules catalogs, dual-language switching, and theme engines:

```bash
# 1. Test Standings, Goal Differences & Shootouts:
node tests/calculator.test.js

# 2. Test i18n / l10n Bilingual Dictionaries & DOM Engine:
node tests/i18n.test.js

# 3. Test System-Wide Dark/Light Mode & Print Sheet Themes:
node tests/theme.test.js

# 4. Verify All HTML i18n Attributes:
node scripts/verify-i18n.js
```

---

## 🚀 Getting Started

No build tools, package managers, or local server installations are required:

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/Tournament.git
   ```
2. Open [`index.html`](file:///d:/Projects/Tournament/index.html) in any modern web browser (Chrome, Edge, Firefox, Safari).
3. Click **"⚡ ডেমো ডাটা"** (Demo Data) on the top bar to preview a tournament in progress, or click **"🚀 টুর্নামেন্ট সেটআপ ও রুলস"** to set up a brand new tournament.

---

## 💾 Data Persistence

All tournament configurations, scores, penalty winners, rosters, and match events are automatically persisted to the browser's `localStorage` (`chitadda_tournament_config_2026`, `chitadda_app_state_2026`, and `chitadda_tournament_rosters_2026`). Refreshing or closing the tab will not lose any tournament progress.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
