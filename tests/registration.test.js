/**
 * ========================================================
 * TEAM REGISTRATION PORTAL UNIT TEST SUITE
 * ========================================================
 * Run with: node tests/registration.test.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('📝 Running Team Registration Portal Unit Tests...\n');

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

// 1. Mock Storage
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

// 2. Mock DOM Elements
const domElements = {};
function createMockElement(idOrTag) {
  const el = {
    id: idOrTag,
    tagName: (idOrTag || 'div').toUpperCase(),
    className: '',
    value: '',
    textContent: '',
    _innerHTML: '',
    checked: false,
    style: {},
    children: [],
    parentElement: null,
    focus: () => {},
    appendChild(child) {
      child.parentElement = this;
      this.children.push(child);
      this._innerHTML += (child.outerHTML || child.innerHTML || '');
    },
    removeChild(child) {
      const idx = this.children.indexOf(child);
      if (idx !== -1) {
        this.children.splice(idx, 1);
        child.parentElement = null;
      }
    },
    remove() {
      if (this.parentElement) {
        this.parentElement.removeChild(this);
      }
    },
    closest(sel) {
      return this;
    },
    get innerHTML() {
      if (this.children.length > 0) {
        return this.children.map(c => c.outerHTML || c.innerHTML || '').join('');
      }
      return this._innerHTML;
    },
    set innerHTML(val) {
      this._innerHTML = val;
      if (val === '') this.children = [];
    },
    get outerHTML() {
      return `<${this.tagName.toLowerCase()} class="${this.className}" id="${this.id}">${this.innerHTML}</${this.tagName.toLowerCase()}>`;
    },
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
    querySelectorAll: function(sel) {
      if (sel.includes('reg-player-row')) {
        return this.children;
      }
      return [];
    },
    querySelector: function(sub) {
      if (sub.includes('reg-inp-jersey')) {
        return { value: this._jersey || '1' };
      }
      if (sub.includes('reg-inp-name')) {
        return { value: this._name || 'Star Player' };
      }
      if (sub.includes('reg-inp-role')) {
        return { value: this._role || 'Player' };
      }
      if (sub.includes('reg-sl-cell')) {
        return { textContent: '1' };
      }
      return null;
    },
    addEventListener: () => {}
  };
  return el;
}

global.document = {
  readyState: 'complete',
  createElement: (tag) => {
    return createMockElement(tag);
  },
  getElementById: (id) => {
    if (!domElements[id]) {
      domElements[id] = createMockElement(id);
    }
    return domElements[id];
  },
  querySelectorAll: (sel) => {
    if (sel.includes('reg-player-row')) {
      const tbody = domElements['reg-players-tbody'];
      return tbody ? tbody.children : [];
    }
    return [];
  },
  addEventListener: () => {}
};

global.window = global;
global.addEventListener = () => {};
global.removeEventListener = () => {};
global.location = {
  hash: '',
  origin: 'http://localhost:3000',
  pathname: '/index.html'
};
try {
  Object.defineProperty(global.navigator, 'clipboard', {
    value: {
      writeText: (t) => Promise.resolve(t)
    },
    configurable: true,
    writable: true
  });
} catch (e) {
  if (!global.navigator) global.navigator = {};
  global.navigator.clipboard = { writeText: (t) => Promise.resolve(t) };
}
global.print = () => {};
global.open = () => {};

global.currentLang = 'bn';
global.alert = (msg) => { global.lastAlert = msg; };

// Load constants, state, and registration
const constantsCode = fs.readFileSync(path.join(__dirname, '../src/js/constants.js'), 'utf8');
const stateCode = fs.readFileSync(path.join(__dirname, '../src/js/state.js'), 'utf8');
const regCode = fs.readFileSync(path.join(__dirname, '../src/js/registration.js'), 'utf8');

vm.runInThisContext(constantsCode);
vm.runInThisContext(stateCode);
vm.runInThisContext(regCode);

// Mock dependent UI functions
global.recalculateAll = () => {};
global.renderPage2TeamTabs = () => {};
global.renderWizardTeamsTab = () => {};

console.log('🚪 Test Suite 1: Modal Open and Close Flow');
openTeamRegistrationModal();
assert(domElements['team-registration-modal'].classList.contains('active'), 'Registration modal has active class on open');
assert(domElements['team-registration-modal'].style.display === 'flex', 'Registration modal displays as flex');
assert(domElements['reg-form-section'].style.display === 'block', 'Form section is visible');
assert(domElements['reg-success-section'].style.display === 'none', 'Success section is hidden initially');

closeTeamRegistrationModal();
assert(!domElements['team-registration-modal'].classList.contains('active'), 'Registration modal removes active class on close');
assert(domElements['team-registration-modal'].style.display === 'none', 'Registration modal is hidden on close');

console.log('\n👥 Test Suite 2: Player Rows Manipulation');
openTeamRegistrationModal();
const tbody = domElements['reg-players-tbody'];
assert(tbody.innerHTML.includes('reg-inp-jersey'), 'Default player rows are rendered in tbody');

// Add player rows
const initialCount = tbody.children.length;
assert(initialCount === 11, 'Initial default player row count is 11');

addRegistrationPlayerRow();
const afterAddCount = tbody.children.length;
assert(afterAddCount === 12, 'Adding player row increases count to 12');

// Remove player row
const lastRowBtn = {
  closest: () => tbody.children[tbody.children.length - 1]
};
removeRegistrationPlayerRow(lastRowBtn);
const afterRemoveCount = tbody.children.length;
assert(afterRemoveCount === 11, 'Removing player row decreases count back to 11');

console.log('\n🛡️ Test Suite 3: Form Validation');
// Missing team name
domElements['reg-team-name'].value = '';
domElements['reg-manager-name'].value = 'রফিক';
domElements['reg-manager-phone'].value = '01711223344';
domElements['reg-terms-agree'].checked = true;
let submitted = submitTeamRegistration();
assert(submitted === false, 'Submit fails when team name is blank');

// Missing manager name
domElements['reg-team-name'].value = 'পদ্মা একাদশ';
domElements['reg-manager-name'].value = '';
domElements['reg-manager-phone'].value = '01711223344';
domElements['reg-terms-agree'].checked = true;
submitted = submitTeamRegistration();
assert(submitted === false, 'Submit fails when manager name is missing');

// Missing phone number
domElements['reg-team-name'].value = 'পদ্মা একাদশ';
domElements['reg-manager-name'].value = 'রফিক';
domElements['reg-manager-phone'].value = '';
domElements['reg-terms-agree'].checked = true;
submitted = submitTeamRegistration();
assert(submitted === false, 'Submit fails when contact phone is missing');

// Missing terms agreement
domElements['reg-team-name'].value = 'পদ্মা একাদশ';
domElements['reg-manager-name'].value = 'রফিক';
domElements['reg-manager-phone'].value = '01711223344';
domElements['reg-terms-agree'].checked = false;
submitted = submitTeamRegistration();
assert(submitted === false, 'Submit fails when terms & rules agreement checkbox is unchecked');

console.log('\n📝 Test Suite 4: Successful Team Registration & Auto-Sync');
domElements['reg-team-name'].value = 'পদ্মা একাদশ';
domElements['reg-manager-name'].value = 'মো. রফিক';
domElements['reg-manager-phone'].value = '01711223344';
domElements['reg-coach-name'].value = 'কোচ তারেক';
domElements['reg-jersey-color'].value = 'সবুজ-সাদা';
domElements['reg-payment-note'].value = 'বিকাশ নম্বর থেকে ফি দেওয়া হবে';
domElements['reg-terms-agree'].checked = true;

submitted = submitTeamRegistration();
assert(submitted === true, 'Team registration submits successfully');

// Verify state auto-synchronization
assert(tournamentConfig.teams.some(t => (t.name || t) === 'পদ্মা একাদশ'), 'New team is automatically synced into tournamentConfig.teams');
assert(tournamentConfig.teamDetails['পদ্মা একাদশ'] !== undefined, 'Team metadata details are saved in tournamentConfig.teamDetails');
assert(tournamentConfig.teamDetails['পদ্মা একাদশ'].manager === 'মো. রফিক', 'Team manager is accurately saved');
assert(tournamentConfig.teamDetails['পদ্মা একাদশ'].phone === '01711223344', 'Manager phone is accurately saved');
assert(tournamentConfig.teamDetails['পদ্মা একাদশ'].coach === 'কোচ তারেক', 'Coach name is accurately saved');
assert(tournamentConfig.teamDetails['পদ্মা একাদশ'].jerseyColor === 'সবুজ-সাদা', 'Jersey color is accurately saved');
assert(tournamentConfig.teamDetails['পদ্মা একাদশ'].feeStatus === 'due', 'Default fee status is set to due');

// Verify Roster
assert(teamRosters['পদ্মা একাদশ'] !== undefined, 'Team roster is initialized in teamRosters');
assert(teamRosters['পদ্মা একাদশ'].players.length >= 11, 'Squad roster contains registered players');

// Verify UI Transition to Success Slip
assert(domElements['reg-form-section'].style.display === 'none', 'Form section is hidden after successful submission');
assert(domElements['reg-success-section'].style.display === 'block', 'Success screen is displayed after submission');
assert(domElements['reg-slip-container'].innerHTML.includes('পদ্মা একাদশ'), 'Registration slip renders registered team name');
assert(domElements['reg-slip-container'].innerHTML.includes('মো. রফিক'), 'Registration slip renders manager name');

console.log('\n🔄 Test Suite 5: Update Existing Team Registration');
domElements['reg-team-name'].value = 'পদ্মা একাদশ';
domElements['reg-manager-name'].value = 'মো. রফিক (আপডেটেড)';
domElements['reg-manager-phone'].value = '01799887766';
domElements['reg-terms-agree'].checked = true;

submitted = submitTeamRegistration();
assert(submitted === true, 'Re-registering an existing team updates cleanly');
const matchCount = tournamentConfig.teams.filter(t => (t.name || t) === 'পদ্মা একাদশ').length;
assert(matchCount === 1, 'Team name is not duplicated in tournamentConfig.teams array');
assert(tournamentConfig.teamDetails['পদ্মা একাদশ'].manager === 'মো. রফিক (আপডেটেড)', 'Manager name updated successfully');

console.log('\n🔗 Test Suite 6: Shareable Link Generation');
let copiedLink = '';
global.navigator.clipboard.writeText = (txt) => {
  copiedLink = txt;
  return Promise.resolve(txt);
};
copyRegistrationLink();
assert(copiedLink.includes('#register'), 'Shareable link contains #register hash fragment');

console.log('\n==========================================');
console.log(`Results: ${passedCount} passed, ${failedCount} failed`);
if (failedCount === 0) {
  console.log('🎉 All Team Registration Portal tests passed with 100% success!');
} else {
  console.log('⚠️ Some tests failed. Please review the output above.');
}
console.log('==========================================\n');

if (failedCount > 0) {
  process.exit(1);
}
