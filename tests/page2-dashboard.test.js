// ========================================================
// AUTOMATED UNIT TESTS: PAGE 2 TOURNAMENT SQUAD & OPERATIONS DASHBOARD
// Verifies on-screen squad lineup, real-time performance badges,
// top scorers leaderboard, discipline & suspension tracker,
// and tournament rules modal access.
// ========================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Lightweight DOM mock
const elementsMap = {};
function getMockElement(id) {
  if (!elementsMap[id]) {
    elementsMap[id] = {
      id: id,
      innerHTML: '',
      textContent: '',
      value: '',
      style: {},
      classList: {
        classes: new Set(),
        add: function(c) { this.classes.add(c); },
        remove: function(c) { this.classes.delete(c); },
        contains: function(c) { return this.classes.has(c); }
      },
      querySelectorAll: () => []
    };
  }
  return elementsMap[id];
}

const context = {
  console: console,
  document: {
    getElementById: (id) => getMockElement(id),
    querySelectorAll: (sel) => [],
    body: {
      classList: {
        classes: new Set(),
        add: function(c) { this.classes.add(c); },
        remove: function(c) { this.classes.delete(c); },
        contains: function(c) { return this.classes.has(c); }
      }
    }
  },
  window: { print: () => {} },
  setTimeout: (fn, ms) => fn(),
  escapeHtml: (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  t: (k) => k,
  currentLang: 'bn',
  tournamentConfig: {
    title: 'বিশ্বকাপ ২০২৬',
    selectedRules: ['r_squad_11']
  },
  DEFAULT_TEAMS: [
    { name: 'মুড়িয়ারা', group: 'A' },
    { name: 'নোয়াপাড়া', group: 'A' },
    { name: 'মুকুন্দপুর', group: 'B' }
  ],
  getActiveTeams: () => [
    { name: 'মুড়িয়ারা', group: 'A' },
    { name: 'নোয়াপাড়া', group: 'A' },
    { name: 'মুকুন্দপুর', group: 'B' }
  ],
  teamRosters: {
    'মুড়িয়ারা': {
      group: 'A',
      manager: 'আরিফুল ইসলাম',
      phone: '01711223344',
      players: [
        { no: 1, jersey: 1, name: 'সাকিব হাসান' },
        { no: 2, jersey: 10, name: 'তামিম ইকবাল' },
        { no: 3, jersey: 7, name: 'রফিক আহমেদ' }
      ]
    }
  },
  currentRosterTeam: 'মুড়িয়ারা',
  activeModalMatchId: null,
  saveRosters: () => {},
  populateModalDropdowns: () => {},
  MASTER_RULES_CATALOG: [
    { id: 'r_squad_11', title: 'দল গঠন', desc: 'সর্বোচ্চ ১১ জন সদস্য' }
  ],
  matchEvents: {
    1: [
      { id: 101, team: 'মুড়িয়ারা', player: 'তামিম ইকবাল', type: 'goal', count: 2 },
      { id: 102, team: 'মুড়িয়ারা', player: 'রফিক আহমেদ', type: 'card', cardType: 'red' },
      { id: 103, team: 'নোয়াপাড়া', player: 'জাহিদ হাসান', type: 'goal', count: 1 },
      { id: 104, team: 'নোয়াপাড়া', player: 'জাহিদ হাসান', type: 'card', cardType: 'yellow' }
    ],
    2: [
      { id: 105, team: 'নোয়াপাড়া', player: 'জাহিদ হাসান', type: 'card', cardType: 'yellow' } // 2nd yellow -> suspension
    ]
  }
};

vm.createContext(context);

// Load roster.js
const rosterCode = fs.readFileSync(path.join(__dirname, '../src/js/roster.js'), 'utf8');
vm.runInContext(rosterCode, context);

let passed = 0;
let failed = 0;

function assert(cond, name) {
  if (cond) {
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${name}`);
    failed++;
  }
}

console.log('\n🧭 Running Page 2 Squad & Operations Dashboard Tests...\n');

// ---------------------------------------------------------------------
// TEST SUITE 1: HTML STRUCTURE & REMOVAL OF UNNECESSARY SCREEN ELEMENTS
// ---------------------------------------------------------------------
console.log('📋 Test Suite 1: Verification of Screen Cleanliness & Redundancy Removal');

// Extract page2 markup from index.html
const p2Start = indexHtml.indexOf('id="page2"');
const p2End = indexHtml.indexOf('<!-- MATCH EVENT LOGGING MODAL -->');
const p2Html = indexHtml.substring(p2Start, p2End);

assert(!p2Html.includes('mini-fixture-table'), 'Page 2 screen cleanly removes redundant mini-fixture table');
assert(!p2Html.includes('sign-row'), 'Page 2 screen cleanly removes useless on-screen signature blocks');
assert(!p2Html.includes('sched_note_hd'), 'Page 2 screen cleanly removes redundant schedule note box');
assert(!p2Html.includes('p2-top-scorers-container'), 'Page 2 screen cleanly removes duplicate top scorers table (dedicated to Page 1)');
assert(!p2Html.includes('award-top-scorer-name'), 'Page 2 screen cleanly removes duplicate ceremony awards card');
assert(indexHtml.includes('p1-top-scorers-container'), 'Page 1 renders #p1-top-scorers-container for live goal leaderboard');
assert(p2Html.includes('p2-discipline-container'), 'Page 2 renders #p2-discipline-container for card & suspension watch');
assert(p2Html.includes('p2-overview-container'), 'Page 2 renders #p2-overview-container for tournament overview');
assert(p2Html.includes('p2-team-stats-strip'), 'Page 2 renders active team performance summary strip');
assert(indexHtml.includes('id="tournament-rules-modal"'), 'index.html contains dedicated #tournament-rules-modal');
assert(indexHtml.includes('id="tournament-rules-list"'), 'Rules list element preserved in modal for i18n & dynamic rules');

// ---------------------------------------------------------------------
// TEST SUITE 2: LIVE PLAYER PERFORMANCE BADGES ON SQUAD TABLE
// ---------------------------------------------------------------------
console.log('\n👥 Test Suite 2: Dynamic Player Badges & Team Stats Strip');

context.switchRosterTeam('মুড়িয়ারা');

const tbodyEl = elementsMap['roster-players-tbody'];
assert(tbodyEl && tbodyEl.innerHTML.length > 0, 'switchRosterTeam renders player rows');

// Tamim Iqbal scored 2 goals in matchEvents
assert(tbodyEl.innerHTML.includes('তামিম ইকবাল'), 'Renders player Tamim Iqbal');
assert(tbodyEl.innerHTML.includes('⚽ 2'), 'Displays live ⚽ 2 goal badge for Tamim Iqbal');

// Rafik Ahmed received a direct red card
assert(tbodyEl.innerHTML.includes('রফিক আহমেদ'), 'Renders player Rafik Ahmed');
assert(tbodyEl.innerHTML.includes('🟥'), 'Displays live 🟥 Red Card suspension badge for Rafik Ahmed');

// Team strip summary
const stripGoals = context.document.getElementById('p2-strip-team-goals');
const stripReds = context.document.getElementById('p2-strip-team-reds');
assert(stripGoals && String(stripGoals.textContent) === '2', 'Team stats strip reflects total 2 goals scored by team');
assert(stripReds && String(stripReds.textContent) === '1', 'Team stats strip reflects total 1 red card received by team');

// ---------------------------------------------------------------------
// TEST SUITE 3: OPERATIONS HUB (TOP SCORERS, DISCIPLINE & SUSPENSIONS)
// ---------------------------------------------------------------------
console.log('\n🏆 Test Suite 3: Operations Hub (Top Scorers & Suspension Alerts)');

context.renderPage2OperationsHub();

const p1TopScorersEl = context.document.getElementById('p1-top-scorers-container');
assert(p1TopScorersEl && p1TopScorersEl.innerHTML.includes('তামিম ইকবাল'), 'Top Scorers lists top scorer Tamim Iqbal on Page 1 summary');
assert(p1TopScorersEl.innerHTML.includes('মুড়িয়ারা'), 'Top Scorers lists scorer team on Page 1 summary');
assert(p1TopScorersEl.innerHTML.includes('⚽ 2'), 'Top Scorers shows 2 goals on Page 1 summary');

const disciplineEl = context.document.getElementById('p2-discipline-container');
assert(disciplineEl && disciplineEl.innerHTML.includes('রফিক আহমেদ'), 'Discipline tracker lists red card holder Rafik Ahmed');
assert(disciplineEl.innerHTML.includes('জাহিদ হাসান'), 'Discipline tracker lists carded player Jahid Hasan');

// Suspension alerts:
// 1. Rafik Ahmed (direct red card) -> suspended!
// 2. Jahid Hasan (2 yellow cards accumulated) -> suspended!
assert(disciplineEl.innerHTML.includes('শৃঙ্খলাজনিত নিষেধাজ্ঞা') || disciplineEl.innerHTML.includes('Suspension'), 'Renders prominent Suspension Alert box');
assert(disciplineEl.innerHTML.includes('রফিক আহমেদ') && disciplineEl.innerHTML.includes('লাল কার্ড'), 'Suspension Alert flags Rafik Ahmed for Red Card');
assert(disciplineEl.innerHTML.includes('জাহিদ হাসান') && disciplineEl.innerHTML.includes('২ হলুদ কার্ড'), 'Suspension Alert flags Jahid Hasan for accumulating 2 Yellow Cards');

// Tournament overview stats
const overviewEl = context.document.getElementById('p2-overview-container');
assert(overviewEl && overviewEl.innerHTML.includes('⚽ 3'), 'Overview calculates total 3 goals across tournament');
assert(overviewEl.innerHTML.includes('🟨 2'), 'Overview calculates total 2 yellow cards');
assert(overviewEl.innerHTML.includes('🟥 1'), 'Overview calculates total 1 red card');

// ---------------------------------------------------------------------
// TEST SUITE 4: TOURNAMENT RULES MODAL CONTROLLERS
// ---------------------------------------------------------------------
console.log('\n📜 Test Suite 4: Tournament Rules Modal Controllers');

const rulesModalEl = context.document.getElementById('tournament-rules-modal');

context.openTournamentRulesModal();
assert(rulesModalEl.classList.contains('active'), 'openTournamentRulesModal adds .active class');
assert(rulesModalEl.style.display === 'flex', 'openTournamentRulesModal sets display:flex');

context.closeTournamentRulesModal();
assert(!rulesModalEl.classList.contains('active'), 'closeTournamentRulesModal removes .active class');
assert(rulesModalEl.style.display === 'none', 'closeTournamentRulesModal sets display:none');

// ---------------------------------------------------------------------
// TEST SUITE 5: DYNAMIC 26-PLAYER SQUAD & EXPANDABLE BENCH
// ---------------------------------------------------------------------
console.log('\n🌟 Test Suite 5: Dynamic 26-Player Squad & Expandable Bench');

// Register 26 players for team 'মুকুন্দপুর'
const mukundapurPlayers = [];
for (let i = 1; i <= 26; i++) {
  mukundapurPlayers.push({
    no: i,
    jersey: i === 25 ? 99 : i,
    name: i === 15 ? 'মাহমুদুল্লাহ রিয়াদ' : (i === 25 ? 'নাসির হোসেন' : `খেলোয়াড় ${i}`)
  });
}
context.teamRosters['মুকুন্দপুর'] = {
  group: 'B',
  manager: 'খালেদ মাহমুদ',
  phone: '01811223344',
  players: mukundapurPlayers
};

// Add a goal for player 15 (substitute) in matchEvents
context.matchEvents[3] = [
  { id: 201, team: 'মুকুন্দপুর', player: 'মাহমুদুল্লাহ রিয়াদ', type: 'goal', count: 1 },
  { id: 202, team: 'মুকুন্দপুর', player: 'নাসির হোসেন', type: 'card', cardType: 'yellow' }
];

context.switchRosterTeam('মুকুন্দপুর');

const msqTbody = getMockElement('roster-players-tbody');
assert(msqTbody.innerHTML.includes('মাহমুদুল্লাহ রিয়াদ'), 'Dynamic table renders substitute player 15 Mahmudullah Riyad');
assert(msqTbody.innerHTML.includes('নাসির হোসেন'), 'Dynamic table renders substitute player 25 Nasir Hossain');
assert(msqTbody.innerHTML.includes('p-jersey-26'), 'Dynamic table renders row for all 26 players');
assert(msqTbody.innerHTML.includes('squad-section-hd'), 'Dynamic table renders Starting Lineup and Bench section dividers');
assert(msqTbody.innerHTML.includes('perf-badge-goal') && msqTbody.innerHTML.includes('⚽ 1'), 'Displays live ⚽ 1 goal badge for substitute player 15');
assert(msqTbody.innerHTML.includes('perf-badge-yellow') && msqTbody.innerHTML.includes('🟨 1'), 'Displays live 🟨 1 yellow card badge for substitute player 25');

const squadBadge = getMockElement('p2-team-squad-badge');
assert(squadBadge.textContent.includes('26') || squadBadge.textContent.includes('২৬'), 'Squad count badge dynamically reflects 26 players');

const mainCss = fs.readFileSync(path.join(__dirname, '../src/css/main.css'), 'utf8');
const printCss = fs.readFileSync(path.join(__dirname, '../src/css/print.css'), 'utf8');
assert(indexHtml.includes('class="p2-player-table-wrap"'), 'index.html contains .p2-player-table-wrap');
assert(indexHtml.includes('class="btn-add-p2-player"'), 'index.html contains .btn-add-p2-player button');
assert(mainCss.includes('.p2-player-table-wrap') && mainCss.includes('max-height: 440px;'), 'main.css contains scrollable .p2-player-table-wrap');
assert(printCss.includes('.p2-player-table-wrap') && printCss.includes('max-height: none !important;'), 'print.css ensures table expands without scroll on print');

// ---------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------
console.log(`\n==========================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log(`🎉 All Page 2 Squad & Operations Dashboard tests passed with 100% success!`);
} else {
  console.error(`💥 Some tests failed!`);
  process.exit(1);
}
console.log(`==========================================\n`);
