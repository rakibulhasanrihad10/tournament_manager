/**
 * ========================================================
 * TOURNAMENT SETUP & RULES WIZARD UNIT TEST SUITE
 * ========================================================
 * Run with: node tests/wizard.test.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('⚙️ Running Tournament Setup & Rules Wizard Tests...\n');

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedCount++;
  }
}

// 1. Mock DOM
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
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (this.contains(c)) this.remove(c); else this.add(c);
        } else {
          if (force) this.add(c); else this.remove(c);
        }
      }
    },
    attributes: {},
    setAttribute(k, v) { this.attributes[k] = String(v); },
    getAttribute(k) { return this.attributes[k] || null; },
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 40, width: 100, height: 40 }),
    querySelectorAll: () => []
  };
}

global.document = {
  getElementById: (id) => {
    if (!domElements[id]) {
      domElements[id] = createMockElement(id);
    }
    return domElements[id];
  },
  querySelectorAll: () => []
};

global.window = global;
global.currentLang = 'bn';

// Load constants, state, and wizard
const constantsCode = fs.readFileSync(path.join(__dirname, '../src/js/constants.js'), 'utf8');
const stateCode = fs.readFileSync(path.join(__dirname, '../src/js/state.js'), 'utf8');
const wizardCode = fs.readFileSync(path.join(__dirname, '../src/js/wizard.js'), 'utf8');

vm.runInThisContext(constantsCode);
vm.runInThisContext(stateCode);
vm.runInThisContext(wizardCode);

console.log('📑 Test Suite 1: Tab Navigation');
switchWizardTab('info');
assert(domElements['wtab-btn-info'].classList.contains('active'), 'Tab btn info has active class');
assert(domElements['wtab-content-info'].classList.contains('active'), 'Tab content info has active class');
assert(!domElements['wtab-btn-prizes'].classList.contains('active'), 'Tab btn prizes is inactive');

switchWizardTab('prizes');
assert(domElements['wtab-btn-prizes'].classList.contains('active'), 'Tab btn prizes has active class');
assert(domElements['wtab-content-prizes'].classList.contains('active'), 'Tab content prizes has active class');
assert(!domElements['wtab-btn-info'].classList.contains('active'), 'Tab btn info is now inactive');

switchWizardTab('rules');
assert(domElements['wtab-btn-rules'].classList.contains('active'), 'Tab btn rules has active class');
assert(domElements['wtab-content-rules'].classList.contains('active'), 'Tab content rules has active class');

switchWizardTab('teams');
assert(domElements['wtab-btn-teams'].classList.contains('active'), 'Tab btn teams has active class (last tab)');
assert(domElements['wtab-content-teams'].classList.contains('active'), 'Tab content teams has active class');

console.log('\n⚡ Test Suite 2: Template Presets (Silent & Smooth)');
let alertTriggered = false;
global.alert = () => { alertTriggered = true; };

applyWizardPreset('standard');
assert(!alertTriggered, 'Standard preset loads silently without alert');
assert(domElements['btn-preset-standard'].classList.contains('active'), 'Standard preset button is highlighted active');
assert(!domElements['btn-preset-minibar'].classList.contains('active'), 'Minibar button is not active');
assert(Number(domElements['w-cfg-startingPlayers'].value) === 11, 'Standard 11-a-side format loaded');
assert(tempWizardSelectedRules.has('r_onfield_11') && !tempWizardSelectedRules.has('r_onfield_6'), 'Standard rules load 11 players on pitch, not 6');
assert(tempWizardSelectedRules.has('r_match_duration_90') && !tempWizardSelectedRules.has('r_match_duration'), 'Standard rules load 90 mins match, not 20 mins');
assert(tempWizardSelectedRules.has('r_pen_count_fifa') && !tempWizardSelectedRules.has('r_pen_count'), 'Standard rules load 5 penalties, not 3');
assert(tempWizardSelectedRules.has('r_fifa_offside') && !tempWizardSelectedRules.has('r_no_offside'), 'Standard rules enforce FIFA Law 11 offside');

applyWizardPreset('minibar');
assert(!alertTriggered, 'Minibar preset loads silently without alert');
assert(domElements['btn-preset-minibar'].classList.contains('active'), 'Minibar preset button is highlighted active');
assert(!domElements['btn-preset-standard'].classList.contains('active'), 'Standard button is no longer active');
assert(Number(domElements['w-cfg-startingPlayers'].value) === 5, 'Minibar 5-a-side format loaded');
assert(tempWizardSelectedRules.has('r_onfield_6') && !tempWizardSelectedRules.has('r_onfield_11'), 'Minibar rules load 5/6 players on pitch');
assert(tempWizardSelectedRules.has('r_match_duration') && !tempWizardSelectedRules.has('r_match_duration_90'), 'Minibar rules load 20-30 mins match');
assert(tempWizardSelectedRules.has('r_pen_count') && !tempWizardSelectedRules.has('r_pen_count_fifa'), 'Minibar rules load 3 penalties');
assert(tempWizardSelectedRules.has('r_no_offside') && !tempWizardSelectedRules.has('r_fifa_offside'), 'Minibar rules relax offside');
assert(tempWizardSelectedRules.has('r_rolling_subs'), 'Minibar rules enable rolling substitutions');

console.log('\n🔄 Test Suite 3: Rules Tab Card Toggle');
applyWizardPreset('standard');
assert(domElements['btn-preset-standard'].classList.contains('active'), 'Standard card active when standard preset applied');
assert(!domElements['btn-preset-minibar'].classList.contains('active'), 'Minibar card inactive');
applyWizardPreset('minibar');
assert(domElements['btn-preset-minibar'].classList.contains('active'), 'Minibar card active when minibar preset applied');
assert(!domElements['btn-preset-standard'].classList.contains('active'), 'Standard card inactive');

console.log('\n🚪 Test Suite 4: Open and Close Modal');
// Verify clean slate when starting fresh with no selected rules
tournamentConfig.selectedRules = [];
openTournamentWizard();
assert(domElements['tournament-wizard-modal'].classList.contains('active'), 'Wizard modal has active class on open');
assert(domElements['tournament-wizard-modal'].style.display === 'flex', 'Wizard modal displays as flex');
assert(!domElements['btn-preset-standard'].classList.contains('active'), 'Standard card is inactive by default on clean slate');
assert(!domElements['btn-preset-minibar'].classList.contains('active'), 'Minibar card is inactive by default on clean slate');
assert(domElements['w-cfg-startingPlayers'].value === '', 'Starting players input has NO default value on clean slate');
assert(domElements['w-cfg-benchPlayers'].value === '', 'Bench players input has NO default value on clean slate');
assert(domElements['w-cfg-maxSubstitutes'].value === '', 'Max substitutes input has NO default value on clean slate');
assert(domElements['w-cfg-teamCount'].value === '', 'Team count input has NO default value on clean slate');
assert(tempWizardTeamCount === null, 'tempWizardTeamCount is null on clean slate');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('মোট দলের সংখ্যা নির্বাচন করুন'), 'Bracket tree renders empty team prompt on clean slate');

closeTournamentWizard();
assert(!domElements['tournament-wizard-modal'].classList.contains('active'), 'Wizard modal removes active class on close');
assert(domElements['tournament-wizard-modal'].style.display === 'none', 'Wizard modal display is none on close');

console.log('\n📐 Test Suite 5: Dynamic Tournament Structure Generation');
// 1. Single League with 5 teams
const league5 = generateTournamentStructure(5, 'league');
assert(league5.tournamentType === 'league', '5-team format is league');
assert(league5.matches.length === 10, '5-team league has exactly 10 round-robin matches (5*4/2)');
assert(Object.keys(league5.groups).length === 1 && league5.groups['A'].length === 5, '5 teams are in single League table (Group A)');

// 2. Direct Knockout with 8 teams
const ko8 = generateTournamentStructure(8, 'knockout');
assert(ko8.tournamentType === 'knockout', '8-team format is direct knockout');
assert(ko8.matches.length === 4, '8-team opening knockout round has 4 matches (8/2)');

// 3. Group Stage with 6 teams (2 groups of 3)
const grp6 = generateTournamentStructure(6, 'groups');
assert(grp6.tournamentType === 'groups', '6-team format is group stage');
assert(Object.keys(grp6.groups).length === 2, '6 teams are split into 2 groups (A & B)');
assert(grp6.groups['A'].length === 3 && grp6.groups['B'].length === 3, 'Each group has exactly 3 teams');
assert(grp6.matches.length === 6, '6-team group stage has 6 matches (3 per group)');

// 4. Group Stage with 7 teams (groups of 4 and 3)
const grp7 = generateTournamentStructure(7, 'groups');
assert(grp7.groups['A'].length === 4 && grp7.groups['B'].length === 3, '7 teams gracefully split into 4 + 3');
assert(grp7.matches.length === 9, '7 teams group stage has 9 matches (6 in A + 3 in B)');

console.log('\n👥 Test Suite 6: Teams & Player Dashboard in Wizard');
// Tab switching to Teams
switchWizardTab('teams');
assert(domElements['wtab-btn-teams'].classList.contains('active'), 'Teams tab button has active class');
assert(domElements['wtab-content-teams'].classList.contains('active'), 'Teams tab content has active class');

// Open wizard and initialize temp teams
openTournamentWizard();
const initialTeamCount = tempWizardTeams.length;
addWizardTeam();
assert(tempWizardTeams.length === initialTeamCount + 1, 'Adding a team increments temp team count');

// Update manager and fee status
const teamIdx = tempWizardTeams.length - 1;
updateWizardTeamField(teamIdx, 'manager', 'আলী হাসান');
updateWizardTeamField(teamIdx, 'phone', '01700000000');
updateWizardTeamField(teamIdx, 'feeStatus', 'paid');
const updatedTeam = tempWizardTeams[teamIdx];
assert(updatedTeam.manager === 'আলী হাসান', 'Team manager is updated');
assert(updatedTeam.phone === '01700000000', 'Team phone is updated');
assert(updatedTeam.feeStatus === 'paid', 'Team fee payment status is updated to paid');

// Update player name
updateWizardPlayer(teamIdx, 1, 'name', 'রফিক উদ্দিন');
const teamName = updatedTeam.name;
assert(teamRosters[teamName] && teamRosters[teamName].players.some(p => p.name === 'রফিক উদ্দিন'), 'Player roster is updated');

// Save config and verify synchronization
saveTournamentConfigFromWizard();
assert(tournamentConfig.teams.some(t => t.manager === 'আলী হাসান'), 'Saved tournament config preserves custom team & manager');

console.log('\n👥 Test Suite 7: Squad Size & Substitution Rules Configuration');
applySquadPreset('fifa');
assert(Number(domElements['w-cfg-startingPlayers'].value) === 11, 'FIFA preset sets 11 starting players');
assert(Number(domElements['w-cfg-benchPlayers'].value) === 15, 'FIFA preset sets 15 bench players');
assert(Number(domElements['w-cfg-maxSubstitutes'].value) === 5, 'FIFA preset sets 5 max substitutes');
assert(domElements['w-squad-calc-summary'].innerHTML.includes('26'), 'Squad summary calculates 26 total players for FIFA World Cup');

applySquadPreset('seven');
assert(Number(domElements['w-cfg-startingPlayers'].value) === 7, '7-a-side preset sets 7 starting players');
assert(Number(domElements['w-cfg-benchPlayers'].value) === 4, '7-a-side preset sets 4 bench players');
assert(domElements['w-squad-calc-summary'].innerHTML.includes('11'), 'Squad summary calculates 11 total players for 7-a-side');

applySquadPreset('futsal');
assert(Number(domElements['w-cfg-startingPlayers'].value) === 5, 'Futsal preset sets 5 starting players');
assert(Number(domElements['w-cfg-benchPlayers'].value) === 5, 'Futsal preset sets 5 bench players');

// Save and verify persistence in tournamentConfig
saveTournamentConfigFromWizard();
assert(tournamentConfig.startingPlayers === 5, 'tournamentConfig persists startingPlayers');
assert(tournamentConfig.benchPlayers === 5, 'tournamentConfig persists benchPlayers');
assert(tournamentConfig.maxSubstitutes === 5, 'tournamentConfig persists maxSubstitutes');

// Test Suite 8: Starting XI Validation & Warning (> 11 players)
console.log('\n⚠️ Test Suite 8: Starting XI Validation & Warning (> 11 players)');
domElements['w-cfg-startingPlayers'].value = '14';
updateSquadCalculations();
assert(domElements['w-cfg-startingPlayers'].classList.contains('w-input-warning'), 'Input gets w-input-warning class when > 11');
assert(domElements['w-starting-players-warning'].style.display === 'block', 'Warning message displays when starting players > 11');
assert(domElements['w-starting-players-warning'].textContent.includes('১১-এর বেশি'), 'Warning text mentions maximum 11 limit');

validateStartingPlayers(domElements['w-cfg-startingPlayers']);
assert(Number(domElements['w-cfg-startingPlayers'].value) === 11, 'validateStartingPlayers resets value to 11');
assert(!domElements['w-cfg-startingPlayers'].classList.contains('w-input-warning'), 'Input warning class removed after reset');

// Attempt to save with > 11
domElements['w-cfg-startingPlayers'].value = '15';
saveTournamentConfigFromWizard();
assert(tournamentConfig.startingPlayers === 11, 'saveTournamentConfigFromWizard clamps startingPlayers to 11');

// Test Suite 8.5: Match Duration & Halves Selection System
console.log('\n⏱️ Test Suite 8.5: Match Duration & Halves Selection System');

// 1. Clean slate test:
populateMatchDurationFields('');
assert(domElements['w-cfg-half1'].value === '', 'Clean slate leaves half 1 empty');
assert(domElements['w-cfg-half2'].value === '', 'Clean slate leaves half 2 empty');
assert(domElements['w-cfg-matchDuration'].value === '', 'Clean slate leaves formatted matchDuration empty');

// 2. 1st half selection automatically syncs 2nd half
onHalf1Change('15');
assert(domElements['w-cfg-half2'].value === '15', 'onHalf1Change automatically syncs half 2 to match half 1');
assert(domElements['w-cfg-matchDuration'].value.includes('30') || domElements['w-cfg-matchDuration'].value.includes('৩০'), 'Calculates total 30 mins (15+15)');

// 3. Set break time and verify formatting
domElements['w-cfg-break'].value = '5';
updateMatchDurationFromHalves();
assert(domElements['w-cfg-matchDuration'].value.includes('15+5+15') || domElements['w-cfg-matchDuration'].value.includes('১৫+৫+১৫'), 'Match duration includes 5-minute break in breakdown');
assert((domElements['w-duration-summary-text'].innerHTML || domElements['w-duration-summary-text'].textContent).includes('30') || (domElements['w-duration-summary-text'].innerHTML || domElements['w-duration-summary-text'].textContent).includes('৩০'), 'Summary text displays calculated total minutes');

// 4. Quick preset testing
applyTimePreset(20, 20, 5);
assert(domElements['w-cfg-half1'].value === '20', 'applyTimePreset sets half 1 to 20');
assert(domElements['w-cfg-half2'].value === '20', 'applyTimePreset sets half 2 to 20');
assert(domElements['w-cfg-break'].value === '5', 'applyTimePreset sets break to 5');
assert(domElements['w-cfg-matchDuration'].value.includes('40') || domElements['w-cfg-matchDuration'].value.includes('৪০'), 'applyTimePreset formats 40 mins');

// 5. Populate from existing string
populateMatchDurationFields('90 mins (45+15+45 mins)');
assert(domElements['w-cfg-half1'].value === '45', 'populateMatchDurationFields parses 45 for half 1');
assert(domElements['w-cfg-break'].value === '15', 'populateMatchDurationFields parses 15 for break');
assert(domElements['w-cfg-half2'].value === '45', 'populateMatchDurationFields parses 45 for half 2');

populateMatchDurationFields('৩০ মিনিট (১৫+১৫ মিনিট)');
assert(domElements['w-cfg-half1'].value === '15', 'populateMatchDurationFields parses Bengali numeral ১৫ for half 1');
assert(domElements['w-cfg-half2'].value === '15', 'populateMatchDurationFields parses Bengali numeral ১৫ for half 2');
assert(domElements['w-cfg-break'].value === '0', 'populateMatchDurationFields defaults break to 0 when absent');

// Test Suite 9: Intelligent Format Recommendation Engine based on Team Count
console.log('\n🤖 Test Suite 9: Intelligent Format Recommendation Engine');

// 5 Teams: League is Best, Groups is Good Alternative, Knockout is Warn (odd/byes)
const rec5 = getTournamentFormatRecommendations(5, false);
assert(rec5.league.badge === 'best', '5 Teams: League is Best format');
assert(rec5.league.badgeText.includes('সেরা'), '5 Teams: League badge mentions সেরা');
assert(rec5.groups.badge === 'good', '5 Teams: Groups is Good alternative');
assert(rec5.groups.badgeText.includes('উপযুক্ত'), '5 Teams: Groups badge mentions উপযুক্ত');
assert(rec5.knockout.badge === 'warn', '5 Teams: Knockout is Warn (odd/byes)');
assert(rec5.knockout.badgeText.includes('বাই প্রয়োজন') || rec5.knockout.badgeText.includes('অসুপারিশকৃত'), '5 Teams: Knockout badge mentions বাই বা অসুপারিশকৃত');

// 9 Teams: Groups is Best (3 groups of 3), League is Warn (36 matches), Knockout is Warn (odd/byes)
const rec9 = getTournamentFormatRecommendations(9, false);
assert(rec9.groups.badge === 'best', '9 Teams: Groups is Best format (3 groups of 3)');
assert(rec9.groups.desc.includes('৩টি গ্রুপ') && rec9.groups.desc.includes('৯টি'), '9 Teams: Groups description mentions 3 groups & 9 matches');
assert(rec9.league.badge === 'warn', '9 Teams: League is Warn (36 matches too long)');
assert(rec9.knockout.badge === 'warn', '9 Teams: Knockout is Warn (needs byes)');

// 8 Teams: Knockout & Groups are Best, League is Good (long)
const rec8 = getTournamentFormatRecommendations(8, false);
assert(rec8.knockout.badge === 'best', '8 Teams: Knockout is Best format (power of 2)');
assert(rec8.groups.badge === 'best', '8 Teams: Groups is also Best format (2 groups of 4)');

// 4 Teams: Knockout & Groups are Best
const rec4 = getTournamentFormatRecommendations(4, false);
assert(rec4.knockout.badge === 'best', '4 Teams: Knockout is Best format');
assert(rec4.groups.badge === 'best', '4 Teams: Groups is Best format');

// English recommendations
const rec5En = getTournamentFormatRecommendations(5, true);
assert(rec5En.league.badge === 'best', '5 Teams EN: League is Best');
assert(rec5En.league.badgeText.includes('Recommended'), '5 Teams EN: Badge text in English');
assert(rec5En.knockout.badge === 'warn', '5 Teams EN: Knockout is Warn');

// Test UI updates on onWizardTeamCountChange(5)
onWizardTeamCountChange(5);
assert(tempWizardTeamCount === 5, 'tempWizardTeamCount updated to 5');
assert(Number(domElements['w-cfg-teamCount'].value) === 5, 'Input w-cfg-teamCount synced to 5');
assert(domElements['w-rec-pill-league'].textContent.includes('সেরা'), 'UI league recommendation pill shows সেরা for 5 teams');
assert(domElements['w-rec-pill-knockout'].textContent.includes('বাই') || domElements['w-rec-pill-knockout'].textContent.includes('অসুপারিশকৃত'), 'UI knockout pill shows warning for 5 teams');

// Test UI updates on onWizardTeamCountChange(9)
setWizardTournamentType('groups');
onWizardTeamCountChange(9);
assert(tempWizardTeamCount === 9, 'tempWizardTeamCount updated to 9');
assert(Number(domElements['w-cfg-teamCount'].value) === 9, 'Input w-cfg-teamCount synced to 9');
assert(domElements['w-rec-pill-groups'].textContent.includes('সেরা'), 'UI groups recommendation pill shows সেরা for 9 teams');
const struct9 = generateTournamentStructure(9, 'groups');
assert(struct9.summaryBn.includes('৩টি গ্রুপ') && struct9.summaryBn.includes('গ্রুপ ম্যাচ'), 'generateTournamentStructure correctly computes 9-team structure');
assert(domElements['w-bracket-stats-bar'].innerHTML.includes('9 দল'), 'UI summary stats bar correctly renders for 9 teams');

// Test Suite 10: Live Visual Interactive Tournament Bracket & Match Roadmap Flow
console.log('\n🏆 Test Suite 10: Live Visual Interactive Tournament Bracket & Match Roadmap Flow');

// 1. 4 Teams with Knockout
setWizardTournamentType('knockout');
onWizardTeamCountChange(4);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('সেমিফাইনাল'), '4 Teams Knockout: Visual bracket renders Semi-Finals');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('মেগা ফাইনাল'), '4 Teams Knockout: Visual bracket renders Grand Final');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('final-card') && !domElements['w-visual-bracket-tree'].innerHTML.includes('trophy-column'), '4 Teams Knockout: Visual bracket cleanly concludes at Grand Final');
assert(domElements['w-bracket-stats-bar'].innerHTML.includes('3'), '4 Teams Knockout: Stats bar shows 3 total matches');

// 2. 4 Teams with Groups + Knockout
setWizardTournamentType('groups');
onWizardTeamCountChange(4);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('গ্রুপ পর্ব'), '4 Teams Groups: Visual bracket renders Group Stage');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('সেমিফাইনাল'), '4 Teams Groups: Visual bracket renders Cross-Over Semi-Finals');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('মেগা ফাইনাল'), '4 Teams Groups: Visual bracket renders Grand Final');
assert(domElements['w-bracket-stats-bar'].innerHTML.includes('5'), '4 Teams Groups: Stats bar shows 5 total matches');

// 3. 4 Teams with Single League
setWizardTournamentType('league');
onWizardTeamCountChange(4);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('একক লিগ টেবিল'), '4 Teams League: Visual bracket renders League stage');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('মেগা ফাইনাল'), '4 Teams League: Visual bracket renders Top 2 Grand Final');
assert(domElements['w-bracket-stats-bar'].innerHTML.includes('7'), '4 Teams League: Stats bar shows 7 total matches');

// 4. 9 Teams with Groups (Real-world standard)
setWizardTournamentType('groups');
onWizardTeamCountChange(9);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('গ্রুপ এ') && domElements['w-visual-bracket-tree'].innerHTML.includes('গ্রুপ সি'), '9 Teams Groups: Visual bracket renders 3 groups');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('সেরা রানার্স-আপ'), '9 Teams Groups: Visual bracket renders Best Runner-Up semi');
assert(domElements['w-bracket-stats-bar'].innerHTML.includes('12'), '9 Teams Groups: Stats bar shows 12 total matches');

// Verify all 9 individual group match cards are present
for (let i = 1; i <= 9; i++) {
  assert(domElements['w-visual-bracket-tree'].innerHTML.includes(`ম্যাচ ${i}`), `9 Teams Groups: Visual bracket renders individual Match ${i}`);
}
assert(!domElements['w-visual-bracket-tree'].innerHTML.includes('w-group-filter-bar'), '9 Teams Groups: Visual bracket cleanly omits redundant group filter buttons');

console.log('\n🧭 Test Suite 11: Multi-Branch Connectors, Perspective View & Fullscreen Mode');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-multi-pathway-connector'), '9 Teams: Renders multi-branch pathway connector between groups and semis');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-pathway-block block-semi1'), '9 Teams: Renders dedicated Route 1 block to Semi-Final 1');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-pathway-block block-semi2'), '9 Teams: Renders dedicated Route 2 block to Semi-Final 2');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('badge-grp-a'), '9 Teams: Connects Group A winner to Semi 1');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('badge-runnerup'), '9 Teams: Connects Best Runner-Up pool to Semi 1');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('badge-grp-b'), '9 Teams: Connects Group B winner to Semi 2');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('badge-grp-c'), '9 Teams: Connects Group C winner to Semi 2');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-runnerup-pool-card'), '9 Teams: Renders explanatory Runner-Up qualification card');

// Test Fullscreen Toggle
const wrapperMock = document.getElementById('w-visual-bracket-wrapper');
toggleBracketFullscreen();
assert(wrapperMock.classList.contains('is-fullscreen'), 'toggleBracketFullscreen() activates is-fullscreen class');
toggleBracketFullscreen();
assert(!wrapperMock.classList.contains('is-fullscreen'), 'toggleBracketFullscreen() deactivates is-fullscreen class on second call');

// Test Zoom Bracket Safe Reset (Option 2)
zoomBracket('in');
assert(currentBracketZoom === 1.0, 'zoomBracket maintains stable 1.0 scale under Option 2');
zoomBracket('out');
assert(currentBracketZoom === 1.0, 'zoomBracket("out") maintains stable 1.0 scale under Option 2');
zoomBracket('reset');
assert(currentBracketZoom === 1.0, 'zoomBracket("reset") maintains stable 1.0 scale under Option 2');

// Test Perspective Switcher
filterBracketPerspective('semi-1');
assert(currentBracketPerspective === 'semi-1', 'filterBracketPerspective("semi-1") updates current perspective');
filterBracketPerspective('all');
assert(currentBracketPerspective === 'all', 'filterBracketPerspective("all") resets perspective to all');

console.log('\n🏹 Test Suite 12: Dynamic Vector Roadmap SVG Anchoring (Zero Hardcoded Pixels)');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-board'), '9 Teams: Renders high-fidelity w-roadmap-board');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-svg-canvas'), '9 Teams: Renders dynamic SVG overlay canvas');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-grpA-to-semi1"'), '9 Teams: Renders Group A -> Semi 1 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-runnerup-to-semi1"'), '9 Teams: Renders Runner-Up -> Semi 1 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-grpB-to-semi2"'), '9 Teams: Renders Group B -> Semi 2 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-grpC-to-semi2"'), '9 Teams: Renders Group C -> Semi 2 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi1-to-final"'), '9 Teams: Renders Semi 1 -> Final SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi2-to-final"'), '9 Teams: Renders Semi 2 -> Final SVG path');

// 8 Teams with Groups + Knockout (Universal Consistency)
setWizardTournamentType('groups');
onWizardTeamCountChange(8);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-board'), '8 Teams Groups: Renders high-fidelity w-roadmap-board');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-svg-canvas'), '8 Teams Groups: Renders dynamic SVG overlay canvas');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-badge-grpA-champ"'), '8 Teams Groups: Renders Group A Champion badge');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-badge-grpA-runnerup"'), '8 Teams Groups: Renders Group A Runner-Up badge');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-badge-grpB-champ"'), '8 Teams Groups: Renders Group B Champion badge');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-badge-grpB-runnerup"'), '8 Teams Groups: Renders Group B Runner-Up badge');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('গ্রুপ B রানার আপ'), '8 Teams Groups: Cross-over Semi 1 includes Group B Runner-Up');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('গ্রুপ A রানার আপ'), '8 Teams Groups: Cross-over Semi 2 includes Group A Runner-Up');
assert(domElements['w-bracket-stats-bar'].innerHTML.includes('15'), '8 Teams Groups: Stats bar shows 15 total matches');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-grpA-to-semi1"'), '8 Teams Groups: Renders Group A -> Semi 1 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-runnerup-to-semi1"'), '8 Teams Groups: Renders Runner-Up -> Semi 1 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-grpB-to-semi2"'), '8 Teams Groups: Renders Group B -> Semi 2 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-grpC-to-semi2"'), '8 Teams Groups: Renders Group A Runner-Up -> Semi 2 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi1-to-final"'), '8 Teams Groups: Renders Semi 1 -> Final SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi2-to-final"'), '8 Teams Groups: Renders Semi 2 -> Final SVG path');

// Direct Knockout (4 Teams) Universal Consistency
setWizardTournamentType('knockout');
onWizardTeamCountChange(4);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-board'), '4 Teams Knockout: Renders unified w-roadmap-board');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-svg-canvas'), '4 Teams Knockout: Renders dynamic SVG overlay canvas');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi1-to-final"'), '4 Teams Knockout: Renders Semi 1 -> Final SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi2-to-final"'), '4 Teams Knockout: Renders Semi 2 -> Final SVG path');

// Direct Knockout (8 Teams) Universal Consistency
setWizardTournamentType('knockout');
onWizardTeamCountChange(8);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-board'), '8 Teams Knockout: Renders unified w-roadmap-board');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-svg-canvas'), '8 Teams Knockout: Renders dynamic SVG overlay canvas');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-q1-to-s1"'), '8 Teams Knockout: Renders Q1 -> Semi 1 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-q4-to-s2"'), '8 Teams Knockout: Renders Q4 -> Semi 2 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi1-to-final"'), '8 Teams Knockout: Renders Semi 1 -> Final SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi2-to-final"'), '8 Teams Knockout: Renders Semi 2 -> Final SVG path');

// Direct Knockout (6 Teams General Knockout) Preliminary -> Semis paths
setWizardTournamentType('knockout');
onWizardTeamCountChange(6);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-board'), '6 Teams Knockout: Renders unified w-roadmap-board');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-m1-to-s1"'), '6 Teams Knockout: Renders M1 -> Semi 1 Winner 1 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-m2-to-s1"'), '6 Teams Knockout: Renders M2 -> Semi 1 Winner 2 SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-badge-ko-m1-win"'), '6 Teams Knockout: Renders M1 winner badge');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-badge-ko-m2-win"'), '6 Teams Knockout: Renders M2 winner badge');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-slot-semi1-t1"'), '6 Teams Knockout: Renders Semi 1 Winner 1 slot');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-slot-semi1-t2"'), '6 Teams Knockout: Renders Semi 1 Winner 2 slot');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-semi1-to-final"'), '6 Teams Knockout: Renders Semi 1 -> Final SVG path');

// Single League Table (4 Teams) Universal Consistency
setWizardTournamentType('league');
onWizardTeamCountChange(4);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-board'), '4 Teams League: Renders unified w-roadmap-board');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-roadmap-svg-canvas'), '4 Teams League: Renders dynamic SVG overlay canvas');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-league-1st-to-final"'), '4 Teams League: Renders 1st Place -> Final SVG path');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('id="w-path-league-2nd-to-final"'), '4 Teams League: Renders 2nd Place -> Final SVG path');
assert(!domElements['w-visual-bracket-tree'].innerHTML.includes('w-card-league-qualifiers'), '4 Teams League: Cleanly omits redundant qualification intermediate container');

// Return to 9 Teams Groups for updateRoadmapSvgPaths execution test
setWizardTournamentType('groups');
onWizardTeamCountChange(9);

// Test Dynamic updateRoadmapSvgPaths execution
const bodyMock = document.getElementById('w-roadmap-body');
bodyMock.getBoundingClientRect = () => ({ left: 10, top: 20, right: 900, bottom: 600, width: 890, height: 580 });
const grpAMock = document.getElementById('w-card-grp-A');
grpAMock.getBoundingClientRect = () => ({ left: 20, top: 40, right: 280, bottom: 160, width: 260, height: 120 });
const s1t1Mock = document.getElementById('w-slot-semi1-t1');
s1t1Mock.getBoundingClientRect = () => ({ left: 360, top: 120, right: 580, bottom: 160, width: 220, height: 40 });

updateRoadmapSvgPaths();
const pathGrpA = document.getElementById('w-path-grpA-to-semi1');
assert(pathGrpA.attributes['d'] && pathGrpA.attributes['d'].startsWith('M '), 'updateRoadmapSvgPaths() computes dynamic SVG path string');

// Test Zoom Factor Compensation in SVG paths
currentBracketZoom = 1.2;
updateRoadmapSvgPaths();
const pathZoomed = document.getElementById('w-path-grpA-to-semi1');
assert(pathZoomed.attributes['d'] && pathZoomed.attributes['d'].startsWith('M '), 'updateRoadmapSvgPaths() computes dynamic SVG path string under 120% zoom with scale compensation');
currentBracketZoom = 1.0;
assert(typeof attachRoadmapResizeObserver === 'function', 'attachRoadmapResizeObserver is a defined function');
attachRoadmapResizeObserver(); // executes safely

console.log('\n==========================================');
console.log(`Results: ${passedCount} passed, ${failedCount} failed`);
if (failedCount === 0) {
  console.log('🎉 All Tournament Wizard tests passed with 100% success!');
} else {
  process.exit(1);
}
console.log('==========================================\n');
