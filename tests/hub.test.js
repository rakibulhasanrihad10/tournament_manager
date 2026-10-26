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
  querySelectorAll: () => [],
  addEventListener: () => {},
  title: ''
};

global.window = {
  location: { hash: '' },
  scrollTo: () => {},
  addEventListener: () => {}
};

// 2. Load Hub & I18n scripts
const i18nCode = fs.readFileSync(path.join(__dirname, '../src/js/i18n.js'), 'utf8');
const hubCode = fs.readFileSync(path.join(__dirname, '../src/js/hub.js'), 'utf8');

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
