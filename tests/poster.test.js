// ========================================================
// AUTOMATED UNIT TESTS: SOCIAL MEDIA POSTER GENERATOR
// Tests Fixture & Schedule Poster (Phase 2) & Promo Poster (Phase 1)
// Dynamic Team Count & Format Responsiveness Verification
// ========================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Mock browser environment
const domHtml = `
<!DOCTYPE html>
<html>
<head></head>
<body>
  <div id="promo-poster-render-target"></div>
  <div id="tab-btn-poster-fixture"></div>
  <div id="tab-btn-poster-promo"></div>
  <button id="btn-poster-copy-action"></button>
  <button id="btn-poster-print-action"></button>
  <div id="promo-poster-modal" style="display:none;"></div>
  <div id="page-poster" style="display:none;"></div>
</body>
</html>
`;

const context = {
  console: console,
  document: {
    body: {
      classList: {
        classes: new Set(),
        add: function(c) { this.classes.add(c); },
        remove: function(...cs) { cs.forEach(c => this.classes.delete(c)); },
        contains: function(c) { return this.classes.has(c); }
      }
    },
    head: {
      appendChild: function(el) {
        if (el && el.id) context._elements[el.id] = el;
      }
    },
    addEventListener: () => {},
    getElementById: (id) => {
      if (!context._elements[id]) {
        context._elements[id] = {
          id: id,
          innerHTML: '',
          textContent: '',
          classList: {
            classes: new Set(),
            add: function(c) { this.classes.add(c); },
            remove: function(c) { this.classes.delete(c); },
            toggle: function(c, val) { if (val) this.classes.add(c); else this.classes.delete(c); },
            contains: function(c) { return this.classes.has(c); }
          },
          style: {},
          setAttribute: function(attr, val) { this[attr] = val; },
          getAttribute: function(attr) { return this[attr]; }
        };
      }
      return context._elements[id];
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: (tag) => {
      const el = {
        tagName: tag,
        id: '',
        textContent: '',
        innerHTML: '',
        style: {}
      };
      return el;
    }
  },
  _elements: {},
  localStorage: {
    _store: {},
    getItem: function(k) { return this._store[k] || null; },
    setItem: function(k, v) { this._store[k] = String(v); },
    removeItem: function(k) { delete this._store[k]; },
    clear: function() { this._store = {}; }
  },
  window: { print: () => {} },
  setTimeout: (fn, ms) => {},
  clearTimeout: () => {},
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  alert: () => {},
  escapeHtml: (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  t: (k) => {
    if (k === 'common.items_unit') return 'টি';
    if (k === 'poster.rules_title') return 'টুর্নামেন্ট পরিচালনা সংক্রান্ত নিয়মাবলী';
    return k;
  },
  currentLang: 'bn',
  tournamentConfig: {
    title: 'চিতড্ডা প্রিমিয়ার ফুটবল টুর্নামেন্ট ২০২৬',
    organizer: 'চিতড্ডা প্রবাসী ফোরাম',
    venue: 'চিতড্ডা ফুটবল মাঠ',
    formatType: '৬-এ-সাইড',
    matchDuration: '২০ মিনিট',
    startDate: '১০ নভেম্বর ২০২৬',
    tournamentType: 'groups',
    teamCount: 9,
    teams: [
      { name: 'মুড়িয়ারা' }, { name: 'নোয়াপাড়া' }, { name: 'চিতড্ডা' },
      { name: 'মুকুন্দপুর' }, { name: 'উত্তর ওড্ডা' }, { name: 'দক্ষিণ ওড্ডা' },
      { name: 'বাতাবাড়িয়া' }, { name: 'মোহাম্মদপুর' }, { name: 'ভংগুয়া' }
    ]
  },
  DEFAULT_TEAMS: [
    { name: 'দল ১' }, { name: 'দল ২' }, { name: 'দল ৩' }, { name: 'দল ৪' },
    { name: 'দল ৫' }, { name: 'দল ৬' }, { name: 'দল ৭' }, { name: 'দল ৮' }
  ],
  MASTER_RULES_CATALOG: [],
  getActiveGroupMatches: () => [],
  getActiveGroups: () => ({ 'A': ['মুড়িয়ারা', 'নোয়াপাড়া', 'চিতড্ডা'], 'B': ['মুকুন্দপুর', 'উত্তর ওড্ডা', 'দক্ষিণ ওড্ডা'], 'C': ['বাতাবাড়িয়া', 'মোহাম্মদপুর', 'ভংগুয়া'] })
};

vm.createContext(context);

// Load constants.js
const constantsCode = fs.readFileSync(path.join(__dirname, '../src/js/constants.js'), 'utf8');
vm.runInContext(constantsCode, context);

// Load state.js to get generateTournamentStructure & getActiveGroupMatches
const stateCode = fs.readFileSync(path.join(__dirname, '../src/js/state.js'), 'utf8');
vm.runInContext(stateCode, context);

// Load poster.js
const posterCode = fs.readFileSync(path.join(__dirname, '../src/js/poster.js'), 'utf8');
vm.runInContext(posterCode, context);

// Load app.js for printDocument
const appCode = fs.readFileSync(path.join(__dirname, '../src/js/app.js'), 'utf8');
vm.runInContext(appCode, context);

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('\n🎨 Running Social Media Poster & Dynamic Fixture Tests...\n');

// ---------------------------------------------------------------------
// TEST SUITE 1: 9 TEAMS (GROUPS FORMAT) FIXTURE POSTER SPEC COMPLIANCE
// ---------------------------------------------------------------------
console.log('📋 Test Suite 1: 9 Teams Standard Group Stage Fixture Poster');

context.saveTournamentConfig({
  title: 'সোনালী অতীত কাপ ২০২৬',
  organizer: 'কমিটি স্পোর্টস',
  venue: 'জেলা স্টেডিয়াম',
  formatType: '৬-এ-সাইড',
  matchDuration: '২০ মিনিট',
  startDate: '১৫ নভেম্বর',
  tournamentType: 'groups',
  teamCount: 9,
  teams: [
    { name: 'মুকুন্দপুর' }, { name: 'উত্তর ওড্ডা' }, { name: 'দক্ষিণ ওড্ডা' },
    { name: 'মুড়িয়ারা' }, { name: 'নোয়াপাড়া' }, { name: 'চিতড্ডা' },
    { name: 'বাতাবাড়িয়া' }, { name: 'মোহাম্মদপুর' }, { name: 'ভংগুয়া' }
  ]
});

const posterHtml = context.generateFixturePosterCardHtml();

assert(posterHtml.includes('fixture-poster-card'), 'Renders .fixture-poster-card container');
assert(posterHtml.includes('সোনালী অতীত কাপ ২০২৬'), 'Renders custom tournament title');
assert(posterHtml.includes('জেলা স্টেডিয়াম'), 'Renders custom tournament venue');
assert(posterHtml.includes('কমিটি স্পোর্টস'), 'Renders custom tournament organizer');
assert(posterHtml.includes('গ্রুপ পর্বের ম্যাচ সূচি'), 'Renders group stage schedule header');

// Exact Table Column Requirements:
assert(posterHtml.includes('ম্যাচ নং'), 'Contains ম্যাচ নং header column');
assert(posterHtml.includes('সময়'), 'Contains সময় header column');
assert(posterHtml.includes('গ্রুপ / পর্ব'), 'Contains গ্রুপ / পর্ব header column');
assert(posterHtml.includes('মুখোমুখি দল'), 'Contains মুখোমুখি দল header column');

// Verification of EXCLUSION of score & winner columns:
assert(!posterHtml.includes('<th>স্কোর</th>'), 'Cleanly excludes স্কোর header column');
assert(!posterHtml.includes('<th>ফলাফল / বিজয়ী</th>'), 'Cleanly excludes ফলাফল / বিজয়ী header column');
assert(!posterHtml.includes('score-input'), 'Cleanly excludes input score boxes');
assert(!posterHtml.includes('btn-match-event'), 'Cleanly excludes match event buttons');
assert(!posterHtml.includes('pen-picker-wrap'), 'Cleanly excludes penalty shootout picker wraps');

// Matchup rendering in .match-vs-grid with .vs-badge:
assert(posterHtml.includes('match-vs-grid'), 'Uses management panel .match-vs-grid');
assert(posterHtml.includes('team-left'), 'Uses management panel .team-left');
assert(posterHtml.includes('vs-badge'), 'Uses management panel .vs-badge');
assert(posterHtml.includes('team-right'), 'Uses management panel .team-right');

// Knockout Bracket Section:
assert(posterHtml.includes('bracket-header'), 'Renders .bracket-header');
assert(posterHtml.includes('trophies-showcase'), 'Renders .trophies-showcase with gold/silver/bronze trophies');
assert(posterHtml.includes('bracket-grid-2x2'), 'Renders .bracket-grid-2x2 layout');
assert(posterHtml.includes('match-card'), 'Uses management panel .match-card');
assert(posterHtml.includes('mc-head'), 'Uses management panel .mc-head');
assert(posterHtml.includes('mc-red'), 'Uses management panel .mc-red for Semi 1');
assert(posterHtml.includes('mc-blue'), 'Uses management panel .mc-blue for Semi 2');
assert(posterHtml.includes('mc-purple'), 'Uses management panel .mc-purple for 3rd Place');
assert(posterHtml.includes('mc-dark'), 'Uses management panel .mc-dark for Grand Final');

// Verification of EXCLUSION of winner input boxes & score rows in knockout cards:
assert(!posterHtml.includes('winner-input'), 'Cleanly excludes winner-input in knockout cards');
assert(!posterHtml.includes('winner-blank'), 'Cleanly excludes winner-blank in knockout cards');
assert(!posterHtml.includes('mc-score-row'), 'Cleanly excludes mc-score-row in knockout cards');

// ---------------------------------------------------------------------
// TEST SUITE 2: DYNAMIC RESPONSIBILITY UPON FORMAT / TEAM COUNT CHANGE
// ---------------------------------------------------------------------
console.log('\n🔄 Test Suite 2: Dynamic Format & Team Count Responsiveness');

// Case 1: 4 Teams Direct Knockout
context.saveTournamentConfig({
  title: '৪ দলীয় মিনি কাপ',
  tournamentType: 'knockout',
  teamCount: 4,
  teams: [{ name: 'টাইগার্স' }, { name: 'লায়ন্স' }, { name: 'ঈগলস' }, { name: 'ফ্যালকনস' }]
});

const ko4Html = context.generateFixturePosterCardHtml();
assert(ko4Html.includes('৪ দল') || ko4Html.includes('৪ টি দল'), 'Displays 4 teams in metadata strip');
assert(ko4Html.includes('টাইগার্স') && ko4Html.includes('লায়ন্স'), 'Displays Knockout Semi 1 teams: টাইগার্স VS লায়ন্স');
assert(ko4Html.includes('ঈগলস') && ko4Html.includes('ফ্যালকনস'), 'Displays Knockout Semi 2 teams: ঈগলস VS ফ্যালকনস');
assert(ko4Html.includes('গ্র্যান্ড ফাইনাল'), 'Includes Grand Final card');

// Case 2: 8 Teams Direct Knockout
context.saveTournamentConfig({
  title: '৮ দল নকআউট টুর্নামেন্ট',
  tournamentType: 'knockout',
  teamCount: 8,
  teams: [
    { name: 'টিম ১' }, { name: 'টিম ২' }, { name: 'টিম ৩' }, { name: 'টিম ৪' },
    { name: 'টিম ৫' }, { name: 'টিম ৬' }, { name: 'টিম ৭' }, { name: 'টিম ৮' }
  ]
});

const ko8Html = context.generateFixturePosterCardHtml();
assert(ko8Html.includes('৮টি দল') || ko8Html.includes('৮ টি দল') || ko8Html.includes('৮ দল'), 'Displays 8 teams in metadata strip');
assert(ko8Html.includes('কোয়ার্টার ফাইনাল'), 'Displays Quarter-Finals in opening or bracket');

// Case 3: 2 Groups (6 Teams: 3 in A, 3 in B)
context.saveTournamentConfig({
  title: '৬ দলীয় দ্বৈত গ্রুপ টুর্নামেন্ট',
  tournamentType: 'groups',
  teamCount: 6,
  teams: [
    { name: 'দল এ১' }, { name: 'দল এ২' }, { name: 'দল এ৩' },
    { name: 'দল বি১' }, { name: 'দল বি২' }, { name: 'দল বি৩' }
  ]
});

const grp6Html = context.generateFixturePosterCardHtml();
assert(grp6Html.includes('২ গ্রুপের সেরা ৪ দল'), 'Bracket subtitle dynamically shows 2 groups qualification');
assert(grp6Html.includes('গ্রুপ এ চ্যাম্পিয়ন') && grp6Html.includes('গ্রুপ বি রানার্স-আপ'), 'Semi 1 is Group A Champion vs Group B Runner-Up');

// Case 4: Single League (5 Teams Round-Robin)
context.saveTournamentConfig({
  title: '৫ দলীয় একক লিগ',
  tournamentType: 'league',
  teamCount: 5,
  teams: [
    { name: 'লিগ দল ১' }, { name: 'লিগ দল ২' }, { name: 'লিগ দল ৩' },
    { name: 'লিগ দল ৪' }, { name: 'লিগ দল ৫' }
  ]
});

const leagueHtml = context.generateFixturePosterCardHtml();
assert(leagueHtml.includes('একক লিগ পর্বের ম্যাচ সূচি'), 'Renders Single League schedule title');
assert(leagueHtml.includes('লিগ টেবিল ১ম স্থান') && leagueHtml.includes('লিগ টেবিল ২য় স্থান'), 'Final is League 1st vs League 2nd place');

// ---------------------------------------------------------------------
// TEST SUITE 3: TAB NAVIGATION & MODAL CONTROLS
// ---------------------------------------------------------------------
console.log('\n📑 Test Suite 3: Modal Tab Switching & Copy Handlers');

context.openPromoPosterModal('fixture');
assert(context.activePosterTab === 'fixture', 'openPromoPosterModal("fixture") sets activePosterTab to fixture');

context.switchPosterTab('promo');
assert(context.activePosterTab === 'promo', 'switchPosterTab("promo") switches activePosterTab to promo');

context.switchPosterTab('fixture');
assert(context.activePosterTab === 'fixture', 'switchPosterTab("fixture") switches activePosterTab back to fixture');

let copyCalled = false;
context.navigator.clipboard.writeText = (txt) => {
  copyCalled = true;
  assert(txt.includes('অফিশিয়াল ম্যাচ ফিক্সচার ও খেলার সময়সূচি ঘোষণা!'), 'Fixture copy text contains official match schedule announcement header');
  assert(txt.includes('#FootballTournament'), 'Fixture copy text contains hashtags');
  return Promise.resolve();
};

context.copyFacebookFixturePost();
assert(copyCalled, 'copyFacebookFixturePost successfully copies fixture text to clipboard');

// ---------------------------------------------------------------------
// TEST SUITE 4: STADIUM COVER HERO BANNER & BRANDING INTEGRATION
// ---------------------------------------------------------------------
console.log('\n🏟️ Test Suite 4: Stadium Cover Hero Banner & Branding Integration');

const fixPoster = context.generateFixturePosterCardHtml();
assert(fixPoster.includes('poster-hero-cover-banner'), 'Fixture poster renders .poster-hero-cover-banner');
assert(fixPoster.includes('poster-hero-img'), 'Fixture poster renders stadium cover img');
assert(fixPoster.includes('poster-hero-logo'), 'Fixture poster renders left and right logos');
assert(fixPoster.includes('poster-hero-swoosh'), 'Fixture poster renders gold & blue curved swoosh ribbon');

const promoPoster = context.generatePromoPosterCardHtml();
assert(promoPoster.includes('poster-hero-cover-banner'), 'Promo poster renders .poster-hero-cover-banner');
assert(promoPoster.includes('poster-hero-img'), 'Promo poster renders stadium cover img');
assert(promoPoster.includes('poster-hero-logo'), 'Promo poster renders left and right logos');
assert(promoPoster.includes('poster-hero-swoosh'), 'Promo poster renders gold & blue curved swoosh ribbon');
assert(!promoPoster.includes('promo-badge-tag'), 'Promo poster cleanly omits redundant notice badge text');
assert(fixPoster.includes('promo-badge-tag'), 'Fixture poster retains official fixture schedule badge tag');

// ---------------------------------------------------------------------
// TEST SUITE 5: PRINT DISPATCHER & SINGLE-PAGE A4 PORTRAIT CONFORMANCE
// ---------------------------------------------------------------------
console.log('\n🖨️ Test Suite 5: Print Dispatcher & Single-Page A4 Portrait Fit Verification');

context.switchPosterTab('fixture');
context.printDocument('poster');

assert(context.document.body.classList.contains('print-only-poster'), 'printDocument("poster") adds print-only-poster class');
const pageStyle = context.document.getElementById('dynamic-print-page-style');
assert(pageStyle && pageStyle.textContent.includes('size: A4 portrait'), 'Poster print dynamically configures A4 portrait');
assert(pageStyle && pageStyle.textContent.includes('margin: 0'), 'Poster print dynamically configures 0 margins for edge-to-edge 1-page fit');

const pagePoster = context.document.getElementById('page-poster');
assert(pagePoster.innerHTML.includes('fixture-poster-card'), 'renderPrintablePosterSheet populates #page-poster with active fixture poster');
assert(pagePoster.innerHTML.includes('fixture-poster-footer'), 'Fixture poster includes .fixture-poster-footer for bottom anchoring');

context.switchPosterTab('promo');
context.renderPrintablePosterSheet();
assert(pagePoster.innerHTML.includes('promo-poster-card'), 'Switched tab populates #page-poster with promo poster');
assert(pagePoster.innerHTML.includes('promo-footer-sign'), 'Promo poster includes .promo-footer-sign');

// ---------------------------------------------------------------------
// TEST SUITE 6: CUSTOM SELECTED RULES SUBSET IN PROMOTIONAL POSTER
// ---------------------------------------------------------------------
console.log('\n📜 Test Suite 6: Custom Selected Rules Subset in Promotional Poster');

context.saveTournamentConfig({
  selectedRules: ['r_squad_minibar', 'r_match_duration', 'r_direct_shootout', 'r_residency', 'r_referee_final'],
  customRules: []
});

const fiveRulesPoster = context.generatePromoPosterCardHtml();
assert(fiveRulesPoster.includes('(5 টি)'), 'Promotional poster displays exactly (5 টি) count');
assert(fiveRulesPoster.includes('স্কোয়াড ও মাঠের খেলোয়াড়') || fiveRulesPoster.includes('মিনিবার স্কোয়াড'), 'Contains selected rule 1');
assert(fiveRulesPoster.includes('ম্যাচের সময়কাল'), 'Contains selected rule 2');
assert(fiveRulesPoster.includes('সরাসরি টাইব্রেকার'), 'Contains selected rule 3');
assert(fiveRulesPoster.includes('স্থায়ী বাসিন্দা'), 'Contains selected rule 4');
assert(fiveRulesPoster.includes('রেফারির সিদ্ধান্ত'), 'Contains selected rule 5');
assert(!fiveRulesPoster.includes('ওয়াকওভার'), 'Cleanly excludes unselected rules');
assert(!fiveRulesPoster.includes('আবহাওয়াজনিত বাধা'), 'Cleanly excludes unselected rule 24');

// Test 0 rules empty state
context.saveTournamentConfig({
  selectedRules: [],
  customRules: []
});
const zeroRulesPoster = context.generatePromoPosterCardHtml();
assert(zeroRulesPoster.includes('(0 টি)'), 'Promotional poster displays (0 টি)');
assert(zeroRulesPoster.includes('কোনো বিশেষ নিয়মাবলী সেট করা হয়নি'), 'Promotional poster renders clean empty state when no rules are selected');

// ---------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------
console.log(`\n==========================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log(`🎉 All Social Media Fixture Poster tests passed with 100% success!`);
} else {
  console.error(`💥 Some tests failed!`);
  process.exit(1);
}
console.log(`==========================================\n`);
