/**
 * ========================================================
 * TOURNAMENT CALCULATION ENGINE - AUTOMATED UNIT TEST SUITE
 * ========================================================
 * Run with: node tests/calculator.test.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Running Tournament Engine Unit Tests...\n');

// 1. Mock Browser Environment
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

const domElements = {};
function createMockElement(id) {
  return {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    closest: () => createMockElement('closest'),
    querySelector: () => createMockElement('child'),
    querySelectorAll: () => []
  };
}

global.document = {
  getElementById: (id) => {
    if (!domElements[id]) domElements[id] = createMockElement(id);
    return domElements[id];
  },
  querySelector: () => createMockElement('any'),
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: (tag) => createMockElement(tag),
  body: {
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    appendChild: () => {},
    removeChild: () => {}
  },
  title: ''
};

// 2. Load Source Modules
const srcDir = path.join(__dirname, '..', 'src', 'js');
const filesToLoad = [
  'constants.js',
  'state.js',
  'calculator.js',
  'roster.js',
  'match-events.js',
  'wizard.js',
  'poster.js',
  'app.js'
];

filesToLoad.forEach(file => {
  const code = fs.readFileSync(path.join(srcDir, file), 'utf8');
  vm.runInThisContext(code);
});

// Simple Test Runner Harness
let passedCount = 0;
let failedCount = 0;

function assert(condition, testDescription) {
  if (condition) {
    console.log(`  ✅ PASS: ${testDescription}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testDescription}`);
    failedCount++;
  }
}

// ==========================================
// TEST SUITE 1: Master Constants & Presets
// ==========================================
console.log('📦 Test Suite 1: Master Constants & Presets');
assert(Array.isArray(MASTER_RULES_CATALOG) && MASTER_RULES_CATALOG.length >= 25, 'MASTER_RULES_CATALOG has 25+ rules');
assert(typeof DEFAULT_CONFIG === 'object' && DEFAULT_CONFIG.formatType, 'DEFAULT_CONFIG is properly structured');
assert(Object.keys(GROUPS).length === 3, 'GROUPS defines exactly 3 groups (A, B, C)');
assert(GROUP_MATCH_DEFS.length === 9, 'GROUP_MATCH_DEFS defines 9 group matches');

// ==========================================
// TEST SUITE 2: Group Match Scoring & Points Logic
// ==========================================
console.log('\n📊 Test Suite 2: Standings & Points Calculation Engine');
initAppState();

// Simulate Match 1 (Group B: মুকুন্দপুর 2 - 1 উত্তর ওড্ডা)
matchScores[1] = { s1: 2, s2: 1 };
recalculateAll();

// Check Table row values rendered for Group B
const groupBHtml = document.getElementById('tbody-group-B').innerHTML;
assert(groupBHtml.includes('মুকুন্দপুর') && groupBHtml.includes('<span class="pts-badge">3</span>'), 'Winner receives exactly 3 points');
assert(groupBHtml.includes('উত্তর ওড্ডা') && groupBHtml.includes('<span class="pts-badge">0</span>'), 'Loser receives 0 points');

// Check Goal Difference
assert(groupBHtml.includes('+1</td>'), 'Winner Goal Difference is +1');
assert(groupBHtml.includes('-1</td>'), 'Loser Goal Difference is -1');

// ==========================================
// TEST SUITE 3: Fair Play (FP) Cards Scoring
// ==========================================
console.log('\n⚖️ Test Suite 3: Fair Play (FP) Cards Scoring');
// Add 1 yellow card to winner (-1 FP) and 1 red card to loser (-3 FP)
matchEvents[1] = [
  { id: 101, team: 'মুকুন্দপুর', player: 'Player A', type: 'card', cardType: 'yellow' },
  { id: 102, team: 'উত্তর ওড্ডা', player: 'Player B', type: 'card', cardType: 'red' }
];
recalculateAll();

const updatedGroupBHtml = document.getElementById('tbody-group-B').innerHTML;
assert(updatedGroupBHtml.includes('title="হলুদ কার্ড: 1, লাল কার্ড: 0">-1</td>'), 'Yellow card deduces -1 Fair Play point');
assert(updatedGroupBHtml.includes('title="হলুদ কার্ড: 0, লাল কার্ড: 1">-3</td>'), 'Red card deduces -3 Fair Play points');

// ==========================================
// TEST SUITE 4: Knockout Evaluation Engine
// ==========================================
console.log('\n🏆 Test Suite 4: Knockout Match & Penalty Shootout Engine');
// Match 10: Semi-Final 1 (Draw 1 - 1, decided on Penalties 3 - 2)
koScores[10] = { s1: 1, s2: 1 };
koPenScores[10] = { p1: 3, p2: 2 };
koPenWinners[10] = 'টিম আলফা';

const res = evalKoMatch(10, 'টিম আলফা', 'টিম বিটা');
assert(res.winner === 'টিম আলফা', 'Knockout shootout winner is correctly evaluated');
assert(res.loser === 'টিম বিটা', 'Knockout shootout runner-up is correctly assigned');

// ==========================================
// TEST SUITE 5: Flexible Format Type & Config Independence
// ==========================================
console.log('\n🔀 Test Suite 5: Flexible Format Type & Config Independence');
tournamentConfig.formatType = '৯-এ-সাইড (প্রতি দলে ৯ জন মাঠে, ২ জন বদলি)';
saveTournamentConfig();
loadTournamentConfig();
assert(tournamentConfig.formatType === '৯-এ-সাইড (প্রতি দলে ৯ জন মাঠে, ২ জন বদলি)', 'Custom formatType saves and loads accurately');

const posterHtml = generatePromoPosterCardHtml();
assert(posterHtml.includes('৯-এ-সাইড (প্রতি দলে ৯ জন মাঠে, ২ জন বদলি)'), 'Promotional poster displays custom formatType');

// Points calculation should remain completely intact
recalculateAll();
const groupBAfterCustomFormat = document.getElementById('tbody-group-B').innerHTML;
assert(groupBAfterCustomFormat.includes('<strong>মুকুন্দপুর</strong>'), 'Standings calculation remains 100% decoupled from formatType');

// ==========================================
// TEST SUITE 6: Dynamic Multi-Group Standings (A, B, C, D & Future Groups)
// ==========================================
console.log('\n🎨 Test Suite 6: Dynamic Multi-Group Standings & Color Themes');

// Test 16 teams (4 groups: A, B, C, D)
const custom16Groups = {
  'A': ['দল ১', 'দল ২', 'দল ৩', 'দল ৪'],
  'B': ['দল ৫', 'দল ৬', 'দল ৭', 'দল ৮'],
  'C': ['দল ৯', 'দল ১০', 'দল ১১', 'দল ১২'],
  'D': ['দল ১৩', 'দল ১৪', 'দল ১৫', 'দল ১৬']
};

getActiveGroups = () => custom16Groups;
renderDynamicStandings();

const standingsContainer = document.getElementById('dynamic-standings-container');
const standingsHtml = standingsContainer.innerHTML;

assert(standingsHtml.includes('tbody-group-D'), 'Renders tbody-group-D for Group D');
assert(standingsHtml.includes('দল ১৩') && standingsHtml.includes('দল ১৬'), 'Renders Group D teams');
assert(standingsHtml.includes('গ্রুপ ডি') || standingsHtml.includes('Group D'), 'Renders Group D title text');
assert(standingsHtml.includes('grp-hd gd'), 'Applies grp-hd gd class to Group D header');
assert(standingsHtml.includes('background:#7c3aed'), 'Applies distinct non-white background color to Group D header');

// Test 5 groups (A, B, C, D, E) for dynamic auto-fallback
const custom5Groups = {
  ...custom16Groups,
  'E': ['দল ১৭', 'দল ১৮', 'দল ১৯', 'দল ২০']
};
getActiveGroups = () => custom5Groups;
renderDynamicStandings();

const standings5Html = standingsContainer.innerHTML;
assert(standings5Html.includes('tbody-group-E'), 'Renders tbody-group-E for Group E');
assert(standings5Html.includes('গ্রুপ E') || standings5Html.includes('Group E'), 'Renders Group E title text');
assert(standings5Html.includes('grp-hd ge'), 'Applies grp-hd ge class to Group E header');
assert(standings5Html.includes('background:#ea580c'), 'Applies distinct non-white background color to Group E header');

// Restore default
delete global.getActiveGroups;

// ==========================================
// SUMMARY REPORT
// ==========================================
console.log('\n==========================================');
console.log(`Results: ${passedCount} passed, ${failedCount} failed`);
if (failedCount === 0) {
  console.log('🎉 All automated unit tests passed with 100% success!');
  console.log('==========================================\n');
  process.exit(0);
} else {
  console.error('❌ Some unit tests failed. Please review.');
  console.log('==========================================\n');
  process.exit(1);
}
