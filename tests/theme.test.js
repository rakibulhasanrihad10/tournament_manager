const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

console.log('🎨 Running System-Wide Dark/Light Mode & Print Sheet Theme Tests...\n');

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
    style: {},
    closest(selector) {
      if (selector === '.dropdown-wrap' && this.parentElement) {
        return this.parentElement;
      }
      return null;
    },
    getAttribute(name) { return this.attributes[name] || null; },
    setAttribute(name, val) { this.attributes[name] = val; }
  };
  return el;
}

global.document = {
  documentElement: createMockElement('html', { lang: 'bn' }),
  body: createMockElement('body'),
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
      if (selector === '.theme-btn') res.push(el);
      if (selector === '.dropdown-menu' && el.classList.contains('dropdown-menu')) res.push(el);
      if (selector === '.dropdown-wrap' && el.classList.contains('dropdown-wrap')) res.push(el);
    }
    return res;
  },
  addEventListener() {}
};

global.window = {
  matchMedia: (query) => ({
    matches: query.includes('light') ? false : true,
    addEventListener: () => {}
  })
};

// Load code into vm
const constantsCode = fs.readFileSync('src/js/constants.js', 'utf8');
const i18nCode = fs.readFileSync('src/js/i18n.js', 'utf8');
const stateCode = fs.readFileSync('src/js/state.js', 'utf8');
const appCode = fs.readFileSync('src/js/app.js', 'utf8');

global.initAppState = () => {};
global.populateInputsFromState = () => {};
global.recalculateAll = () => {};

vm.runInThisContext(constantsCode);
vm.runInThisContext(i18nCode);
vm.runInThisContext(appCode);

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

console.log('🌙 Test Suite 1: System-Wide App Color Mode (Dark / Light)');

it('setAppTheme("light") sets data-theme to light and persists to localStorage', () => {
  setAppTheme('light', true);
  assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'light');
  assert.strictEqual(localStorage.getItem('tournament_theme_mode'), 'light');
  assert.strictEqual(currentAppTheme, 'light');
});

it('setAppTheme("dark") sets data-theme to dark and persists to localStorage', () => {
  setAppTheme('dark', true);
  assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');
  assert.strictEqual(localStorage.getItem('tournament_theme_mode'), 'dark');
  assert.strictEqual(currentAppTheme, 'dark');
});

it('toggleAppTheme() switches theme between dark and light', () => {
  setAppTheme('dark', false);
  toggleAppTheme();
  assert.strictEqual(currentAppTheme, 'light');
  assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'light');

  toggleAppTheme();
  assert.strictEqual(currentAppTheme, 'dark');
  assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');
});

it('initTheme() restores saved theme from localStorage', () => {
  localStorage.setItem('tournament_theme_mode', 'light');
  initTheme();
  assert.strictEqual(currentAppTheme, 'light');
  assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'light');

  localStorage.setItem('tournament_theme_mode', 'dark');
  initTheme();
  assert.strictEqual(currentAppTheme, 'dark');
  assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');
});

console.log('\n📄 Test Suite 2: Document / Sheet Print Theme (White Paper vs Stadium Color)');

it('setSheetTheme("paper") activates sheet-theme-paper and light-mode on body', () => {
  setSheetTheme('paper', true);
  assert.strictEqual(document.body.classList.contains('sheet-theme-paper'), true);
  assert.strictEqual(document.body.classList.contains('light-mode'), true);
  assert.strictEqual(localStorage.getItem('tournament_sheet_theme'), 'paper');
  assert.strictEqual(currentSheetTheme, 'paper');
});

it('setSheetTheme("stadium") removes paper theme and restores stadium floodlight', () => {
  setSheetTheme('stadium', true);
  assert.strictEqual(document.body.classList.contains('sheet-theme-paper'), false);
  assert.strictEqual(document.body.classList.contains('light-mode'), false);
  assert.strictEqual(localStorage.getItem('tournament_sheet_theme'), 'stadium');
  assert.strictEqual(currentSheetTheme, 'stadium');
});

it('toggleSheetTheme() toggles between paper and stadium theme', () => {
  setSheetTheme('stadium', false);
  toggleSheetTheme();
  assert.strictEqual(currentSheetTheme, 'paper');
  assert.strictEqual(document.body.classList.contains('sheet-theme-paper'), true);

  toggleSheetTheme();
  assert.strictEqual(currentSheetTheme, 'stadium');
  assert.strictEqual(document.body.classList.contains('sheet-theme-paper'), false);
});

it('toggleColorMode() alias triggers toggleSheetTheme() for backward compatibility', () => {
  setSheetTheme('stadium', false);
  toggleColorMode();
  assert.strictEqual(currentSheetTheme, 'paper');
});

it('initSheetTheme() restores sheet theme from localStorage', () => {
  localStorage.setItem('tournament_sheet_theme', 'paper');
  initSheetTheme();
  assert.strictEqual(currentSheetTheme, 'paper');
  assert.strictEqual(document.body.classList.contains('sheet-theme-paper'), true);
});

// ==========================================
// TEST SUITE 3: Action Bar Dropdowns & Onboarding Welcome Banner
// ==========================================
console.log('\n🧭 Test Suite 3: Action Bar Dropdowns & Onboarding Welcome Banner');

it('toggleDropdown() opens dropdown and toggles active wrap state', () => {
  const wrap = document.getElementById('test-wrap');
  wrap.classList.add('dropdown-wrap');

  const menu = document.getElementById('test-dropdown');
  menu.classList.add('dropdown-menu');
  menu.parentElement = wrap;

  toggleDropdown('test-dropdown');
  assert.strictEqual(menu.classList.contains('show'), true);
  assert.strictEqual(wrap.classList.contains('active'), true);

  // Toggle again closes
  toggleDropdown('test-dropdown');
  assert.strictEqual(menu.classList.contains('show'), false);
  assert.strictEqual(wrap.classList.contains('active'), false);
});

it('closeAllDropdowns() closes all open menus and wraps', () => {
  const menu = document.getElementById('test-dropdown');
  menu.classList.add('show');
  closeAllDropdowns();
  assert.strictEqual(menu.classList.contains('show'), false);
});

it('dismissWelcomeBanner() hides banner and saves state in localStorage', () => {
  const banner = document.getElementById('football-welcome-banner');
  banner.style.display = 'block';
  dismissWelcomeBanner();
  assert.strictEqual(banner.style.display, 'none');
  assert.strictEqual(localStorage.getItem('tournament_welcome_dismissed'), 'true');
});

it('initWelcomeBanner() restores dismissed state on page load', () => {
  const banner = document.getElementById('football-welcome-banner');
  localStorage.setItem('tournament_welcome_dismissed', 'true');
  initWelcomeBanner();
  assert.strictEqual(banner.style.display, 'none');

  localStorage.removeItem('tournament_welcome_dismissed');
  initWelcomeBanner();
  assert.strictEqual(banner.style.display, 'block');
});

console.log('\n==========================================');
console.log(`Results: ${passCount} passed, ${failCount} failed`);
if (failCount === 0) {
  console.log('🎉 All Theme & Print Mode automated tests passed with 100% success!');
} else {
  console.log('⚠️ Some tests failed. Please review the errors above.');
  process.exit(1);
}
console.log('==========================================\n');
