/**
 * ========================================================
 * SPORTS HUB & MULTI-SPORT ROUTER UNIT TEST SUITE
 * ========================================================
 * Run with: node tests/hub.test.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🏟️ Running Sports Hub & Multi-Sport Router Tests...\n');

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

// 1. Mock Browser DOM Environment
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
    attributes: {},
    setAttribute(k, v) { this.attributes[k] = v; },
    removeAttribute(k) { delete this.attributes[k]; },
    getAttribute(k) { return this.attributes[k] || null; },
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
    if (!domElements[id]) domElements[id] = createMockElement(id);
    return domElements[id];
  },
  querySelector: (sel) => {
    if (sel.startsWith('#')) return global.document.getElementById(sel.slice(1));
    if (sel === '.btn-football-launch') return global.document.getElementById('btn-football-launch');
    return null;
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
  documentElement: { lang: 'bn' },
  title: ''
};

global.window = {
  location: { hash: '' },
  scrollTo: () => {},
  addEventListener: () => {}
};

// 2. Load Scripts
const constantsCode = fs.readFileSync(path.join(__dirname, '../src/js/constants.js'), 'utf8');
const stateCode = fs.readFileSync(path.join(__dirname, '../src/js/state.js'), 'utf8');
const i18nCode = fs.readFileSync(path.join(__dirname, '../src/js/i18n.js'), 'utf8');
const hubCode = fs.readFileSync(path.join(__dirname, '../src/js/hub.js'), 'utf8');

vm.runInThisContext(constantsCode);
vm.runInThisContext(stateCode);
vm.runInThisContext(i18nCode);
vm.runInThisContext(hubCode);

// ==========================================
// TEST SUITE 1: Navigation Routing & View Toggle
// ==========================================
console.log('🧭 Test Suite 1: Navigation Routing & View Toggle');

navigateToView('football');
assert(window.location.hash === '#football', 'navigateToView("football") sets URL hash to #football');
assert(document.getElementById('sports-hub-view').style.display === 'none', 'Sports Hub is hidden when in football view');
assert(document.getElementById('football-app-view').style.display === 'block', 'Football app view is displayed');

navigateToView('hub');
assert(window.location.hash === '#hub', 'navigateToView("hub") sets URL hash to #hub');
assert(document.getElementById('sports-hub-view').style.display === 'block', 'Sports Hub is displayed when in hub view');
assert(document.getElementById('football-app-view').style.display === 'none', 'Football app view is hidden');

// ==========================================
// TEST SUITE 2: Upcoming Sport Roadmap Modal
// ==========================================
console.log('\n🔍 Test Suite 2: Upcoming Sport Roadmap Modal');

openSportPreviewModal('cricket');
const previewModal = document.getElementById('sport-preview-modal');
assert(previewModal.classList.contains('active'), 'Cricket preview modal activates with "active" class');
assert(previewModal.style.display === 'flex', 'Cricket preview modal displays as flex');

const previewTitle = document.getElementById('preview-sport-title').innerHTML;
assert(previewTitle.includes('ক্রিকেট'), 'Cricket roadmap content is rendered properly');

openSportPreviewModal('badminton');
const badmintonTitle = document.getElementById('preview-sport-title').innerHTML;
assert(badmintonTitle.includes('ব্যাডমিন্টন'), 'Badminton roadmap content is rendered properly');

closeSportPreviewModal();
assert(!previewModal.classList.contains('active'), 'Modal removes "active" class on close');
assert(previewModal.style.display === 'none', 'Modal hides on close');

// ==========================================
// TEST SUITE 3: Football Entry Choice Onboarding Modal
// ==========================================
console.log('\n⚽ Test Suite 3: Football Entry Choice Onboarding Modal');

openFootballEntryChoiceModal();
const entryModal = document.getElementById('football-entry-modal');
assert(entryModal.classList.contains('active'), 'Football entry choice modal activates with "active" class');
assert(entryModal.style.display === 'flex', 'Football entry choice modal displays as flex');

closeFootballEntryChoiceModal();
assert(!entryModal.classList.contains('active'), 'Entry choice modal removes "active" class on close');
assert(entryModal.style.display === 'none', 'Entry choice modal hides on close');

navigateToView('hub');
startFootballWithDemo();
assert(window.location.hash === '#football', 'startFootballWithDemo() switches view to #football');
assert(!entryModal.classList.contains('active'), 'startFootballWithDemo() ensures entry modal is closed');

navigateToView('hub');
let wizardOpened = false;
global.openTournamentWizard = () => { wizardOpened = true; };
startFootballWithWizard();
assert(window.location.hash === '#football', 'startFootballWithWizard() switches view to #football');

// ==========================================
// TEST SUITE 4: Smart Tournament Resume & Launch
// ==========================================
console.log('\n🚀 Test Suite 4: Smart Tournament Resume & Launch');

// 1. Clean slate test
tournamentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
tournamentConfig.isCustomConfig = false;
updateHubFootballCard();
updateNavWizardButton();
const launchBtn = document.getElementById('btn-football-launch');
const navBtn = document.getElementById('btn-nav-wizard');
assert(launchBtn.textContent.includes('ফুটবল টুর্নামেন্টে প্রবেশ করুন'), 'Clean slate button text is default prompt');
assert(!launchBtn.classList.contains('btn-has-active-tournament'), 'Clean slate does not have active tournament class');
assert(navBtn.textContent.includes('টুর্নামেন্ট সেটআপ ও রুলস'), 'Clean slate nav button shows Setup & Rules');
assert(!navBtn.classList.contains('btn-mode-edit'), 'Clean slate does not have btn-mode-edit');

openFootballEntryChoiceModal();
const cleanChoices = document.getElementById('football-entry-choices').innerHTML;
assert(cleanChoices.includes('choice-setup'), 'Clean slate modal contains setup card');
assert(cleanChoices.includes('choice-demo'), 'Clean slate modal contains demo card');
assert(!cleanChoices.includes('choice-resume'), 'Clean slate modal does NOT contain resume card');
closeFootballEntryChoiceModal();

// 2. Active custom tournament test
tournamentConfig.title = 'কোটচাঁদপুর প্রিমিয়ার লিগ ২০২৬';
tournamentConfig.isCustomConfig = true;
updateHubFootballCard();
updateNavWizardButton();
assert(launchBtn.textContent.includes('পরিচালনা করুন: কোটচাঁদপুর প্রিমিয়ার লিগ ২০২৬'), 'Button dynamically updates to resume active tournament title');
assert(launchBtn.getAttribute('title') === 'কোটচাঁদপুর প্রিমিয়ার লিগ ২০২৬', 'Button tooltip stores full tournament title');
assert(launchBtn.classList.contains('btn-has-active-tournament'), 'Button gets "btn-has-active-tournament" class');
assert(navBtn.textContent.includes('এডিট টুর্নামেন্ট ও রুলস'), 'Active custom tournament updates nav button to "এডিট টুর্নামেন্ট ও রুলস"');
assert(navBtn.classList.contains('btn-mode-edit'), 'Active custom tournament adds btn-mode-edit class');

openFootballEntryChoiceModal();
const activeChoices = document.getElementById('football-entry-choices').innerHTML;
const activeHeader = document.getElementById('football-entry-header').innerHTML;
const activeFooter = document.getElementById('football-entry-footer').innerHTML;
assert(activeHeader.includes('কোটচাঁদপুর প্রিমিয়ার লিগ ২০২৬'), 'Header renders custom tournament title');
assert(activeHeader.includes('সক্রিয় টুর্নামেন্ট'), 'Header renders active status badge');
assert(activeChoices.includes('choice-resume'), 'Active modal renders primary resume card');
assert(activeChoices.includes('choice-edit'), 'Active modal renders edit settings card');
assert(activeFooter.includes('btn-start-fresh'), 'Active modal renders start fresh tournament option');

// 3. Start fresh confirmation and execution
global.confirm = () => true;
let wizardOpenedFromFresh = false;
global.openTournamentWizard = () => { wizardOpenedFromFresh = true; };
startFreshTournament();
assert(!tournamentConfig.isCustomConfig, 'startFreshTournament resets isCustomConfig flag');
assert(window.location.hash === '#football', 'startFreshTournament switches view to #football');
assert(!document.getElementById('football-entry-modal').classList.contains('active'), 'startFreshTournament closes modal');

// ==========================================
// SUMMARY REPORT
// ==========================================
console.log('\n==========================================');
console.log(`Results: ${passedCount} passed, ${failedCount} failed`);
if (failedCount === 0) {
  console.log('🎉 All Sports Hub & Router automated tests passed with 100% success!');
  console.log('==========================================\n');
  process.exit(0);
} else {
  console.error('❌ Some Sports Hub tests failed.');
  process.exit(1);
}
