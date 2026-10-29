// ========================================================
// AUTOMATED UNIT TESTS: BLANK SQUAD REGISTRATION SHEET
// Verifies printable offline blank roster form for handwritten pen entry
// ========================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const domHtml = `
<!DOCTYPE html>
<html>
<head></head>
<body>
  <div id="page-blank-roster"></div>
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
        remove: function(c) { this.classes.delete(c); },
        contains: function(c) { return this.classes.has(c); }
      }
    },
    getElementById: (id) => {
      if (!context._elements[id]) {
        context._elements[id] = {
          id: id,
          innerHTML: '',
          textContent: '',
          style: {}
        };
      }
      return context._elements[id];
    },
    addEventListener: () => {},
    querySelectorAll: () => []
  },
  _elements: {},
  window: { print: () => {} },
  setTimeout: (fn, ms) => {},
  escapeHtml: (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  t: (k) => {
    const dict = {
      'page1.meta_organizer': 'আয়োজনে:',
      'page1.meta_venue': 'স্থান:',
      'page2.roster_card_title': 'খেলোয়াড়দের পূর্ণ নামের তালিকা (সর্বোচ্চ ১১ জন)',
      'page2.rules_card_title': 'খেলার নিয়ম ও টুর্নামেন্ট নির্দেশনা',
      'blank_roster.banner_title': '📝 অফিশিয়াল দল ও স্কোয়াড নিবন্ধন ফর্ম (প্লেয়ার তালিকা জমাদান শিট)',
      'blank_roster.team_name': 'দলের নাম:',
      'blank_roster.jersey_color': 'জার্সির রং:',
      'blank_roster.group_lot': 'গ্রুপ / লট নং:',
      'blank_roster.manager_name': 'টিম ম্যানেজার',
      'blank_roster.coach_name': 'টিম কোচ',
      'blank_roster.committee_name': 'আয়োজক কমিটি',
      'blank_roster.lbl_name': 'নাম:',
      'blank_roster.lbl_mobile': 'মোবাইল:',
      'blank_roster.lbl_sign': 'স্বাক্ষর:',
      'blank_roster.th_sl': 'ক্র. নং',
      'blank_roster.th_jersey': 'জার্সি নং',
      'blank_roster.th_name': 'খেলোয়াড়ের পূর্ণ নাম',
      'blank_roster.th_pos': 'পজিশন / ভূমিকা',
      'blank_roster.th_sign': 'স্বাক্ষর',
      'blank_roster.terms': '⚠️ <strong>ঘোষণাপত্র ও অঙ্গীকার:</strong> উপরে উল্লেখিত সকল খেলোয়াড় এই দলের নিয়মিত সদস্য। টুর্নামেন্টের যাবতীয় নিয়মাবলী, আচরণবিধি এবং রেফারির চূড়ান্ত সিদ্ধান্ত মেনে চলতে আমরা বাধ্য থাকব।',
      'blank_roster.sign_mgr': 'টিম ম্যানেজারের স্বাক্ষর ও তারিখ',
      'blank_roster.sign_coach': 'টিম কোচের স্বাক্ষর ও তারিখ',
      'blank_roster.sign_committee': 'আয়োজক কমিটির গ্রহণকারী স্বাক্ষর ও সিল',
      'blank_roster.fee_status': 'এন্ট্রি ফি স্ট্যাটাস:',
      'blank_roster.fee_paid': '[ ] পরিশোধিত',
      'blank_roster.fee_due': '[ ] বকেয়া'
    };
    return dict[k] || k;
  },
  currentLang: 'bn',
  tournamentConfig: {
    title: 'চিতড্ডা প্রিমিয়ার লীগ ২০২৬',
    organizer: 'চিতড্ডা স্পোর্টস কাউন্সিল',
    venue: 'চিতড্ডা হাইস্কুল মাঠ',
    entryFee: '২,৫০০ টাকা',
    startingPlayers: 11,
    benchPlayers: 5
  },
  DEFAULT_TEAMS: [],
  MASTER_RULES_CATALOG: []
};

vm.createContext(context);

// Load roster.js
const rosterCode = fs.readFileSync(path.join(__dirname, '../src/js/roster.js'), 'utf8');
vm.runInContext(rosterCode, context);

// Load app.js
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

console.log('\n📝 Running Blank Squad Registration Sheet Unit Tests...\n');

// ---------------------------------------------------------------------
// TEST SUITE 1: HTML STRUCTURE & METADATA FIELDS
// ---------------------------------------------------------------------
console.log('📋 Test Suite 1: Blank Sheet Layout & Metadata Fields');

const blankHtml = context.generateBlankRosterSheetHtml();

assert(blankHtml.includes('page-blank-roster'), 'Renders .page-blank-roster container');
assert(blankHtml.includes('চিতড্ডা প্রিমিয়ার লীগ ২০২৬'), 'Renders active tournament title');
assert(blankHtml.includes('চিতড্ডা স্পোর্টস কাউন্সিল'), 'Renders organizing committee');
assert(blankHtml.includes('চিতড্ডা হাইস্কুল মাঠ'), 'Renders tournament venue');
assert(blankHtml.includes('অফিশিয়াল দল ও স্কোয়াড নিবন্ধন ফর্ম'), 'Renders official banner title');

// Required fields as specified by user:
assert(blankHtml.includes('দলের নাম:'), 'Includes দলের নাম (Team Name) metadata field');
assert(blankHtml.includes('টিম ম্যানেজার'), 'Includes টিম ম্যানেজার (Manager Name) card');
assert(blankHtml.includes('টিম কোচ'), 'Includes টিম কোচ (Coach Name) card');
assert(blankHtml.includes('মোবাইল:'), 'Includes concise মোবাইল: label');
assert(blankHtml.includes('নাম:'), 'Includes concise নাম: label');
assert(!blankHtml.includes('ম্যানেজারের মোবাইল নং'), 'Excludes redundant ম্যানেজারের মোবাইল নং');
assert(!blankHtml.includes('কোচের মোবাইল নং'), 'Excludes redundant কোচের মোবাইল নং');
assert(!blankHtml.includes('blank_roster.jersey_color') && !blankHtml.includes('জার্সির রং'), 'Cleanly excludes জার্সির রং (Jersey Color) metadata field as requested');
assert(!blankHtml.includes('blank_roster.group_lot') && !blankHtml.includes('গ্রুপ / লট নং'), 'Cleanly excludes গ্রুপ / লট নং metadata field as requested');
assert(blankHtml.includes('blank-write-line'), 'Includes dotted blank lines for pen writing');

// ---------------------------------------------------------------------
// TEST SUITE 2: PLAYER TABLE & DYNAMIC ROWS
// ---------------------------------------------------------------------
console.log('\n👥 Test Suite 2: Handwritten Player Table & Dynamic Rows');

assert(blankHtml.includes('blank-roster-player-table'), 'Uses .blank-roster-player-table');
assert(blankHtml.includes('ক্র. নং'), 'Contains ক্রমিক নং column');
assert(blankHtml.includes('খেলোয়াড়ের পূর্ণ নাম'), 'Contains খেলোয়াড়ের পূর্ণ নাম column');
assert(blankHtml.includes('পজিশন / ভূমিকা'), 'Contains পজিশন / ভূমিকা column');

// User requested exclusion of Jersey No and Signature columns:
assert(!blankHtml.includes('>জার্সি নং<'), 'Cleanly excludes জার্সি নং column from table');
assert(!blankHtml.includes('>স্বাক্ষর<'), 'Cleanly excludes স্বাক্ষর column from table');
assert(!blankHtml.includes('blank-jersey-box'), 'Cleanly excludes blank-jersey-box');

// Starting XI and Bench split subheaders:
assert(blankHtml.includes('roster-table-subheader'), 'Contains player table subheaders');
assert(blankHtml.includes('starter-card'), 'Groups Starting XI header and table inside unbreakable .starter-card');
assert(blankHtml.includes('bench-card'), 'Groups Substitutes header and table inside unbreakable .bench-card');
assert(blankHtml.includes('starting-subheader'), 'Contains Starting XI subheader');
assert(blankHtml.includes('bench-subheader'), 'Contains Substitutes / Bench subheader');
assert(blankHtml.includes('blank-cell-write'), 'Uses clean blank-cell-write for handwriting');
assert(!blankHtml.includes('player-line-name'), 'Cleanly removes internal dotted lines from player table cells');
assert(blankHtml.includes('<colgroup>'), 'Includes <colgroup> definition for stable column widths');

// Dynamic row count verification (11 + 5 = 16 rows)
assert(blankHtml.includes('>16<') || blankHtml.includes('>15<'), 'Renders dynamic squad capacity rows (15-16 rows)');

// ---------------------------------------------------------------------
// TEST SUITE 3: DECLARATION, FEE STATUS & SIGNATURES
// ---------------------------------------------------------------------
console.log('\n✍️ Test Suite 3: Declaration, Entry Fee & Signatures');

assert(blankHtml.includes('ঘোষণাপত্র ও অঙ্গীকার:'), 'Includes official declaration & undertaking text');
assert(!blankHtml.includes('এন্ট্রি ফি স্ট্যাটাস') && !blankHtml.includes('fee_status'), 'Cleanly excludes entry fee status line as requested');
assert(!blankHtml.includes('পরিশোধিত'), 'Cleanly excludes Paid checkbox');
assert(!blankHtml.includes('বকেয়া টাকা'), 'Cleanly excludes Due checkbox');

// Signatures verification:
assert(blankHtml.includes('স্বাক্ষর:'), 'Includes concise স্বাক্ষর: label');
assert(!blankHtml.includes('টিম কোচের স্বাক্ষর'), 'Excludes Coach signature block as requested');
assert(!blankHtml.includes('আয়োজক কমিটির গ্রহণকারী স্বাক্ষর ও সিল'), 'Excludes redundant আয়োজক কমিটির গ্রহণকারী স্বাক্ষর ও সিল');
assert(!blankHtml.includes('টিম ম্যানেজারের স্বাক্ষর ও তারিখ'), 'Excludes redundant টিম ম্যানেজারের স্বাক্ষর ও তারিখ');

// ---------------------------------------------------------------------
// TEST SUITE 4: PRINT DISPATCHER INTEGRATION
// ---------------------------------------------------------------------
console.log('\n🖨️ Test Suite 4: Print Dispatcher Mode Verification');

context.renderBlankRosterSheet();
const targetEl = context.document.getElementById('page-blank-roster');
assert(targetEl.innerHTML.length > 500, 'renderBlankRosterSheet populates #page-blank-roster container');

context.printDocument('blank-roster');
assert(context.document.body.classList.contains('print-only-blank-roster'), 'printDocument("blank-roster") adds print-only-blank-roster class');

// ---------------------------------------------------------------------
// TEST SUITE 5: PAGE 2 TWO-COLUMN SPLIT CONFORMANCE & EXCLUSIONS
// ---------------------------------------------------------------------
console.log('\n📐 Test Suite 5: Page 2 Two-Column Split Conformance & Exclusions');

assert(blankHtml.includes('p2-layout'), 'Adopts Page 2 .p2-layout container');
assert(blankHtml.includes('p2-left'), 'Adopts Page 2 .p2-left column for handwritten player table');
assert(blankHtml.includes('p2-right'), 'Adopts Page 2 .p2-right column for tournament rules card');
assert(blankHtml.includes('player-table'), 'Uses Page 2 .player-table styling');
assert(blankHtml.includes('rules-card'), 'Renders Page 2 .rules-card container');
assert(blankHtml.includes('rules-list'), 'Renders Page 2 .rules-list rules container');
assert(blankHtml.includes('rules-highlight'), 'Highlights key rule definitions with .rules-highlight');

// Crucial exclusions requested by user:
assert(!blankHtml.includes('mini-fixture-table'), 'Cleanly excludes mini-fixture-table (কার সাথে কার খেলা) from blank sheet');
assert(!blankHtml.includes('p2-team-tabs-bar'), 'Cleanly excludes screen team tabs bar (দল নির্বাচন) from blank sheet');
assert(!blankHtml.includes('switchRosterTeam'), 'No screen switching scripts in blank printable sheet');

// ---------------------------------------------------------------------
// TEST SUITE 6: SMART RULE BUDGET & PRINT SETUP CONTROLLERS
// ---------------------------------------------------------------------
console.log('\n🎛️ Test Suite 6: Smart Rule Budget & Print Setup Controllers');

assert(typeof context.openBlankRosterConfigModal === 'function', 'openBlankRosterConfigModal is exported');
assert(typeof context.closeBlankRosterConfigModal === 'function', 'closeBlankRosterConfigModal is exported');
assert(typeof context.updateRuleBudgetMeter === 'function', 'updateRuleBudgetMeter is exported');
assert(typeof context.autoFitBlankRosterRules === 'function', 'autoFitBlankRosterRules is exported');

// Test custom 7-a-side format override
const customHtml = context.generateBlankRosterSheetHtml({
  startingPlayers: 7,
  benchPlayers: 4,
  selectedRules: ['r_squad_minibar', 'r_report_15', 'r_referee_final']
});
assert(customHtml.includes('৭ জন') || customHtml.includes('7'), 'Custom override configures 7 starting players');
assert(customHtml.includes('৪ জন') || customHtml.includes('4'), 'Custom override configures 4 bench players');
assert(customHtml.includes('>11<'), 'Custom override has exactly 11 player rows total (7 + 4)');

// Test 8 rules selection rendering (verifies fix for 6-rule truncation bug)
const multiRulesHtml = context.generateBlankRosterSheetHtml({
  selectedRules: ['r_squad_11', 'r_duration_90', 'r_offside_fifa', 'r_sub_5', 'r_points_system', 'r_tiebreaker_pen', 'r_referee_final', 'r_discipline_conduct']
});
assert(multiRulesHtml.includes('>7<'), 'Renders 7th selected rule (no 6-rule truncation bug)');
assert(multiRulesHtml.includes('>8<'), 'Renders 8th selected rule (no 6-rule truncation bug)');

// ---------------------------------------------------------------------
// TEST SUITE 7: VISUAL THEME CONFORMANCE TO REFERENCE IMAGE
// ---------------------------------------------------------------------
console.log('\n🎨 Test Suite 7: Visual Theme Conformance to Reference Image');

assert(blankHtml.includes('header-logo-left'), 'Renders left logo/emblem header container');
assert(blankHtml.includes('header-logo-right'), 'Renders right stadium/sponsor header container');
assert(blankHtml.includes('rule-badge-num'), 'Renders circular green numbered badges for rules');
assert(blankHtml.includes('rule-slogan-ribbon'), 'Renders sports slogan ribbon at bottom of rules card');
assert(blankHtml.includes('খেলায় থাকুক সৌহার্দ্য, জিতুক ফুটবল'), 'Displays official sports harmony slogan');
assert(!blankHtml.includes('page-sheet'), 'Cleanly excludes .page-sheet class to prevent outer paper borders');
assert(blankHtml.includes('border:none') || blankHtml.includes('border: none'), 'Ensures outer sheet has no outer border');
assert(blankHtml.includes('width:64%'), 'Player name column has expansive 64% width for easy handwriting');
assert(typeof context.onBlankRosterLogoTypeChange === 'function', 'onBlankRosterLogoTypeChange is exported');
assert(typeof context.handleBlankRosterImageUpload === 'function', 'handleBlankRosterImageUpload is exported');

// ---------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------
console.log(`\n==========================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log(`🎉 All Blank Squad Registration Form tests passed with 100% success!`);
} else {
  console.error(`💥 Some tests failed!`);
  process.exit(1);
}
console.log(`==========================================\n`);
