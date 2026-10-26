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

applyWizardPreset('minibar');
assert(!alertTriggered, 'Minibar preset loads silently without alert');
assert(domElements['btn-preset-minibar'].classList.contains('active'), 'Minibar preset button is highlighted active');
assert(!domElements['btn-preset-standard'].classList.contains('active'), 'Standard button is no longer active');
assert(Number(domElements['w-cfg-startingPlayers'].value) === 5, 'Minibar 5-a-side format loaded');

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
assert(domElements['w-structure-summary-text'].textContent.includes('৩টি গ্রুপ') && domElements['w-structure-summary-text'].textContent.includes('গ্রুপ ম্যাচ'), 'UI summary banner correctly renders 9-team structure');

// Test Suite 10: Live Visual Interactive Tournament Bracket & Match Roadmap Flow
console.log('\n🏆 Test Suite 10: Live Visual Interactive Tournament Bracket & Match Roadmap Flow');

// 1. 4 Teams with Knockout
setWizardTournamentType('knockout');
onWizardTeamCountChange(4);
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('সেমিফাইনাল'), '4 Teams Knockout: Visual bracket renders Semi-Finals');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('মেগা ফাইনাল'), '4 Teams Knockout: Visual bracket renders Grand Final');
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('মেগা চ্যাম্পিয়ন'), '4 Teams Knockout: Visual bracket renders Champion Trophy');
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
assert(domElements['w-visual-bracket-tree'].innerHTML.includes('w-group-filter-bar'), '9 Teams Groups: Visual bracket renders interactive group filter bar');

console.log('\n==========================================');
console.log(`Results: ${passedCount} passed, ${failedCount} failed`);
if (failedCount === 0) {
  console.log('🎉 All Tournament Wizard tests passed with 100% success!');
} else {
  process.exit(1);
}
console.log('==========================================\n');
