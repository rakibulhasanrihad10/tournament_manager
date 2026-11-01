# Tournament Manager — Architecture & Engineering Guardrails

This document establishes the permanent architectural principles, coding standards, and operational rules for the **Tournament Manager** repository. All AI assistants, agents, and human contributors must strictly adhere to these rules.

---

## 🏛️ 1. Architecture & Component Separation (SoC)

The codebase strictly enforces **Separation of Concerns (SoC)** and **Modularity**:

1. **NEVER manually edit root `index.html`:**
   - Root `index.html` is a compiled artifact assembled from `src/index.template.html` and components in `src/components/`.
   - Any markup modifications must be made in the dedicated component file under `src/components/`.
   - After modifying any component, run `node scripts/build.js` to compile the changes into `index.html`.
   - Verify synchronization with `node scripts/build.js --check` or `node --test tests/components.test.js`.

2. **Component Directory Structure:**
   - `src/components/common/`: Shared elements (`head.html`, `navbar.html`, `welcome-banner.html`, `scripts.html`).
   - `src/components/hub/`: Multi-sports landing page and roadmaps (`sports-hub-view.html`).
   - `src/components/football/`: Football views (`page1-sheet.html`, `page2-sheet.html`, `poster-sheet.html`, `blank-roster-sheet.html`).
   - `src/components/modals/`: Isolated modal views (`tournament-wizard-modal.html`, `team-registration-modal.html`, `match-events-modal.html`, `promo-poster-modal.html`, `entry-choice-modal.html`, `blank-roster-modal.html`, `sport-preview-modal.html`, `tournament-rules-modal.html`).

3. **Adding New Sports (Extensibility & SRP):**
   - When introducing new sports (e.g., Cricket, Badminton, Carrom, Chess), **NEVER** append markup to football files.
   - Create a dedicated folder: `src/components/<sport>/` with its own views and sheets.
   - Create a dedicated logic file: `src/js/<sport>.js` or import modular sport handlers.
   - Include the new components into `src/index.template.html` using `<!-- @@include('<sport>/<file>.html') -->`.

---

## 🎨 2. Presentation Layer & Styling Discipline

1. **Screen vs. Print Separation:**
   - `src/css/main.css`: Core design tokens, layout grids, typography, badges, dark/light theme, and mobile responsive media queries (`@media screen and (max-width: ...)`).
   - `src/css/print.css`: Strictly isolated for **A4 Landscape printing** (`@media print`). **NEVER** add screen-only interaction or responsive rules here.
   - `src/css/modals.css`: Isolated modal, dialog, and wizard styles.
   - `src/css/hub.css`: Landing hub navigation, cards, and animations.
   - `src/css/style.css`: Master stylesheet entry point.

2. **Responsive Design:**
   - Always ensure mobile responsiveness down to 360px without breaking desktop layout or A4 print fidelity.

---

## 🌐 3. Internationalization (i18n) & Localization

1. **Bilingual Parity:**
   - All user-facing text must support both **Bengali (`bn`)** and **English (`en`)**.
   - HTML elements must include a valid `data-i18n="key"` or `data-i18n-title="key"`.
   - Whenever a new key is added, define it in both `BN` and `EN` dictionaries in `src/js/i18n.js`.
   - Run `node scripts/verify-i18n.js` to guarantee 100% dictionary parity (0 missing keys).

---

## 🧪 4. Testing & Verification Guardrails

1. **Zero-Dependency Native Tests:**
   - Tests run directly via Node.js built-in test runner: `node --test tests/*.test.js`.
2. **Mandatory Pre-Completion Verification:**
   - Before completing any task or claiming work is done, **ALWAYS** run the master test runner:
     ```bash
     node scripts/test-all.js
     ```
   - All test suites (over 450 unit tests across 12 suites) must pass with **100% success** (0 failures, 0 regressions).
   - If a test fails, diagnose and fix the root cause immediately.

---

## 🔒 5. Git & Operational Safety Rules

1. **NEVER Auto Git Push:**
   - **CRITICAL STANDING RULE:** Do **NOT** run `git push` automatically.
   - Always prepare commits locally and wait for the user to explicitly say "push" or give permission before pushing to `origin`.
2. **Commit Hygiene:**
   - Use standard Conventional Commits format (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).

---

## ⚡ 6. Zero-Dependency Pure Client Runtime

1. **Client Compatibility:**
   - The application must remain executable by simply opening `index.html` via double-click (`file://`) or Live Server.
   - Do NOT introduce build-time bundlers (webpack, vite) or npm runtime dependencies that require a server to render the UI.
