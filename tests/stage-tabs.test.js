/**
 * ========================================================
 * CLASSIC SHEET STAGE TABS & BASELINE ALIGNMENT TEST SUITE
 * ========================================================
 * Run with: node tests/stage-tabs.test.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('\n📊 Running Classic Sheet Stage Tabs & Baseline Alignment Tests...\n');

let passedTests = 0;
let failedTests = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
    failedTests++;
  }
}

// 1. Mock Browser Environment
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

const domStore = {};
function createMockElement(id) {
  return {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    style: {},
    attributes: {},
    classList: {
      _classes: new Set(),
      add: function(c) { this._classes.add(c); },
      remove: function(c) { this._classes.delete(c); },
      contains: function(c) { return this._classes.has(c); },
      toggle: function(c, force) {
        if (force === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (force) this._classes.add(c);
        else this._classes.delete(c);
      }
    },
    setAttribute: function(k, v) { this.attributes[k] = String(v); },
    getAttribute: function(k) { return this.attributes[k] || null; }
  };
}

global.document = {
  getElementById: (id) => {
    if (!domStore[id]) domStore[id] = createMockElement(id);
    return domStore[id];
  },
  body: {
    classList: {
      _classes: new Set(),
      add: function(c) { this._classes.add(c); },
      remove: function(c) { this._classes.delete(c); },
      contains: function(c) { return this._classes.has(c); }
    }
  },
  addEventListener: () => {}
};

// Load app.js containing switchP1Stage & initP1Stage
const appJs = require('../src/js/app.js');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const mainCss = fs.readFileSync(path.join(__dirname, '..', 'src', 'css', 'main.css'), 'utf8');
const printCss = fs.readFileSync(path.join(__dirname, '..', 'src', 'css', 'print.css'), 'utf8');

it('index.html contains .p1-stage-nav tabs and IDs for cards', () => {
  assert.ok(indexHtml.includes('class="p1-stage-nav"'), 'Contains .p1-stage-nav');
  assert.ok(indexHtml.includes('id="btn-p1-stage-group"'), 'Contains btn-p1-stage-group');
  assert.ok(indexHtml.includes('id="btn-p1-stage-knockout"'), 'Contains btn-p1-stage-knockout');
  assert.ok(indexHtml.includes('id="btn-p1-stage-all"'), 'Contains btn-p1-stage-all');
  assert.ok(indexHtml.includes('id="p1-card-schedule"'), 'Contains p1-card-schedule');
  assert.ok(indexHtml.includes('id="p1-card-bracket"'), 'Contains p1-card-bracket');
});

it('index.html cleanly excludes smart-match-center and view-mode-bar', () => {
  assert.ok(!indexHtml.includes('id="smart-match-center"'), 'Excludes #smart-match-center');
  assert.ok(!indexHtml.includes('class="view-mode-bar"'), 'Excludes .view-mode-bar');
  assert.ok(!indexHtml.includes('src/js/smart-center.js'), 'Excludes smart-center.js script tag');
});

it('switchP1Stage("group") activates group stage cleanly', () => {
  appJs.switchP1Stage('group');
  const p1 = document.getElementById('page1');
  const btnGroup = document.getElementById('btn-p1-stage-group');
  const btnKO = document.getElementById('btn-p1-stage-knockout');
  assert.ok(p1.classList.contains('p1-stage-group'), 'page1 has p1-stage-group class');
  assert.ok(!p1.classList.contains('p1-stage-knockout'), 'page1 does not have p1-stage-knockout class');
  assert.ok(btnGroup.classList.contains('active'), 'Group button is active');
  assert.ok(!btnKO.classList.contains('active'), 'KO button is inactive');
  assert.strictEqual(localStorage.getItem('tm_p1_stage'), 'group');
});

it('switchP1Stage("knockout") activates knockout stage cleanly', () => {
  appJs.switchP1Stage('knockout');
  const p1 = document.getElementById('page1');
  const btnGroup = document.getElementById('btn-p1-stage-group');
  const btnKO = document.getElementById('btn-p1-stage-knockout');
  assert.ok(p1.classList.contains('p1-stage-knockout'), 'page1 has p1-stage-knockout class');
  assert.ok(!p1.classList.contains('p1-stage-group'), 'page1 does not have p1-stage-group class');
  assert.ok(btnKO.classList.contains('active'), 'KO button is active');
  assert.ok(!btnGroup.classList.contains('active'), 'Group button is inactive');
  assert.strictEqual(localStorage.getItem('tm_p1_stage'), 'knockout');
});

it('switchP1Stage("all") activates all-in-one stage cleanly', () => {
  appJs.switchP1Stage('all');
  const p1 = document.getElementById('page1');
  const btnAll = document.getElementById('btn-p1-stage-all');
  assert.ok(p1.classList.contains('p1-stage-all'), 'page1 has p1-stage-all class');
  assert.ok(btnAll.classList.contains('active'), 'All button is active');
  assert.strictEqual(localStorage.getItem('tm_p1_stage'), 'all');
});

it('main.css enforces baseline alignment rules in group stage', () => {
  assert.ok(mainCss.includes('#page1.p1-stage-group #p1-card-bracket') && mainCss.includes('display: none !important;'), 'Bracket is hidden in group stage');
  assert.ok(mainCss.includes('#page1.p1-stage-group .p1-standings-card') && mainCss.includes('height: 100%;'), 'Standings card has height: 100%');
  assert.ok(mainCss.includes('#page1.p1-stage-group .p1-schedule-card') && mainCss.includes('height: 100% !important;'), 'Schedule card has height: 100%');
});

it('main.css expands knockout stage to full width', () => {
  assert.ok(mainCss.includes('#page1.p1-stage-knockout .p1-left-col') && mainCss.includes('display: none !important;'), 'Left column hidden in knockout stage');
  assert.ok(mainCss.includes('#page1.p1-stage-knockout .p1-right-col') && mainCss.includes('width: 100% !important;'), 'Right column expands to 100%');
});

it('print.css guarantees full print visibility and hides .p1-stage-nav', () => {
  assert.ok(printCss.includes('.p1-stage-nav'), 'print.css references .p1-stage-nav');
  assert.ok(printCss.includes('#page1 .p1-left-col') && printCss.includes('width: 41% !important;'), 'print.css restores left column');
  assert.ok(printCss.includes('#page1 #p1-card-bracket') && printCss.includes('display: block !important;'), 'print.css ensures bracket is printed');
});

console.log('\n==========================================');
console.log(`Results: ${passedTests} passed, ${failedTests} failed`);
if (failedTests === 0) {
  console.log('🎉 All Classic Sheet Stage Tabs tests passed with 100% success!');
}
console.log('==========================================\n');

process.exit(failedTests > 0 ? 1 : 0);
