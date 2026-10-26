const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('🌐 Running Internationalization (i18n) & Localization (l10n) Tests...\n');

// Mock browser environment
const localStorageStore = {};
global.localStorage = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, val) => { localStorageStore[key] = String(val); },
  removeItem: (key) => { delete localStorageStore[key]; }
};

const domElements = new Map();
function createMockElement(tag, attrs = {}) {
  const el = {
    tagName: tag.toUpperCase(),
    attributes: { ...attrs },
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (this.contains(c)) this.remove(c); else this.add(c);
        } else {
          if (force) this.add(c); else this.remove(c);
        }
      }
    },
    textContent: attrs.textContent || '',
    innerHTML: attrs.innerHTML || '',
    placeholder: attrs.placeholder || '',
    title: attrs.title || '',
    getAttribute(name) { return this.attributes[name] || null; },
    setAttribute(name, val) { this.attributes[name] = val; }
  };
  return el;
}

global.document = {
  documentElement: { lang: 'bn' },
  title: '',
  getElementById(id) {
    if (!domElements.has(id)) {
      const el = createMockElement('div', { id });
      domElements.set(id, el);
    }
    return domElements.get(id);
  },
  querySelectorAll(selector) {
    const res = [];
    for (const el of domElements.values()) {
      if (selector === '[data-i18n]' && el.getAttribute('data-i18n')) res.push(el);
      if (selector === '[data-i18n-html]' && el.getAttribute('data-i18n-html')) res.push(el);
      if (selector === '[data-i18n-placeholder]' && el.getAttribute('data-i18n-placeholder')) res.push(el);
      if (selector === '[data-i18n-title]' && el.getAttribute('data-i18n-title')) res.push(el);
      if (selector === '.p2-team-tab') res.push(el);
    }
    return res;
  }
};

// Load scripts into vm
const constantsCode = fs.readFileSync('src/js/constants.js', 'utf8');
const i18nCode = fs.readFileSync('src/js/i18n.js', 'utf8');
const stateCode = fs.readFileSync('src/js/state.js', 'utf8');
const rosterCode = fs.readFileSync('src/js/roster.js', 'utf8');

vm.runInThisContext(constantsCode);
vm.runInThisContext(i18nCode);
vm.runInThisContext(stateCode);
vm.runInThisContext(rosterCode);

let passCount = 0;
let failCount = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

console.log('📦 Test Suite 1: Translations Dictionary Integrity');
it('Bengali and English translation keys are complete and non-empty', () => {
  assert(typeof TRANSLATIONS === 'object', 'TRANSLATIONS dictionary is defined');
  assert(typeof TRANSLATIONS.bn === 'object', 'Bengali translations defined');
  assert(typeof TRANSLATIONS.en === 'object', 'English translations defined');
  assert(Object.keys(TRANSLATIONS.bn).length >= 150, 'At least 150 translation keys exist');
  assert.strictEqual(Object.keys(TRANSLATIONS.bn).length, Object.keys(TRANSLATIONS.en).length, 'Both languages have equal key counts');
});

it('t(key) correctly returns requested translation for current language', () => {
  setLanguage('bn', false);
  assert.strictEqual(t('nav.btn_demo'), '⚡ ডেমো ডাটা');
  setLanguage('en', false);
  assert.strictEqual(t('nav.btn_demo'), '⚡ Demo Data');
});

it('t(key) falls back gracefully on missing keys', () => {
  const fallback = 'Fallback Value';
  assert.strictEqual(t('non_existent_key_12345', fallback), fallback);
});

console.log('\n🔄 Test Suite 2: Language Switching & Storage Persistence');
it('setLanguage persists to localStorage', () => {
  setLanguage('en', true);
  assert.strictEqual(localStorage.getItem('tournament_lang_pref'), 'en');
  assert.strictEqual(document.documentElement.lang, 'en');

  setLanguage('bn', true);
  assert.strictEqual(localStorage.getItem('tournament_lang_pref'), 'bn');
  assert.strictEqual(document.documentElement.lang, 'bn');
});

it('initI18n reads preference from localStorage', () => {
  localStorage.setItem('tournament_lang_pref', 'en');
  initI18n();
  assert.strictEqual(currentLang, 'en');

  localStorage.setItem('tournament_lang_pref', 'bn');
  initI18n();
  assert.strictEqual(currentLang, 'bn');
});

console.log('\n🖥️ Test Suite 3: Live DOM Translation Updates');
it('Live DOM element with data-i18n translates on setLanguage', () => {
  const testEl = createMockElement('button', { 'data-i18n': 'nav.btn_reset' });
  domElements.set('test-btn', testEl);

  setLanguage('en', false);
  assert.strictEqual(testEl.textContent, '🔄 Reset');

  setLanguage('bn', false);
  assert.strictEqual(testEl.textContent, '🔄 রিসেট');
});

it('Placeholder element with data-i18n-placeholder translates on setLanguage', () => {
  const testInput = createMockElement('input', { 'data-i18n-placeholder': 'page2.mgr_placeholder' });
  domElements.set('test-input', testInput);

  setLanguage('en', false);
  assert.strictEqual(testInput.placeholder, 'Manager name...');

  setLanguage('bn', false);
  assert.strictEqual(testInput.placeholder, 'ম্যানেজারের নাম...');
});

console.log('\n📜 Test Suite 4: Master Rules Catalog Bilingual Support');
it('All rules in MASTER_RULES_CATALOG have English category, title and description', () => {
  assert(MASTER_RULES_CATALOG.length >= 25, 'At least 25 master rules exist');
  for (const rule of MASTER_RULES_CATALOG) {
    assert(rule.titleEn && rule.titleEn.trim().length > 0, `Rule ${rule.id} missing titleEn`);
    assert(rule.categoryEn && rule.categoryEn.trim().length > 0, `Rule ${rule.id} missing categoryEn`);
    assert(rule.descEn && rule.descEn.trim().length > 0, `Rule ${rule.id} missing descEn`);
  }
});

it('renderPage2RulesList renders empty message when no rules are configured', () => {
  loadTournamentConfig();
  tournamentConfig.selectedRules = [];
  setLanguage('bn', false);
  renderPage2RulesList();
  const listEl = document.getElementById('tournament-rules-list');
  assert(listEl.innerHTML.includes('কোনো বিশেষ নিয়মাবলী সেট করা হয়নি'), 'Empty message rendered in Bengali');

  setLanguage('en', false);
  renderPage2RulesList();
  assert(listEl.innerHTML.includes('No special rules selected'), 'Empty message rendered in English');
});

it('renderPage2RulesList renders in English when currentLang is en', () => {
  loadTournamentConfig();
  tournamentConfig.selectedRules = ['r_squad_11'];
  setLanguage('en', false);
  renderPage2RulesList();
  const listEl = document.getElementById('tournament-rules-list');
  assert(listEl.innerHTML.includes('Squad Size &amp; Player Registration'), 'English rule title rendered');
});

it('renderPage2RulesList renders in Bengali when currentLang is bn', () => {
  loadTournamentConfig();
  tournamentConfig.selectedRules = ['r_squad_11'];
  setLanguage('bn', false);
  renderPage2RulesList();
  const listEl = document.getElementById('tournament-rules-list');
  assert(listEl.innerHTML.includes('দল গঠন ও সর্বোচ্চ স্কোয়াড'), 'Bengali rule title rendered');
});

console.log('\n==========================================');
console.log(`Results: ${passCount} passed, ${failCount} failed`);
if (failCount === 0) {
  console.log('🎉 All i18n/l10n automated unit tests passed with 100% success!');
} else {
  console.log('⚠️ Some tests failed. Please review the errors above.');
  process.exit(1);
}
console.log('==========================================\n');
