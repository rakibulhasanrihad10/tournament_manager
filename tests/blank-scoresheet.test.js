// ========================================================
// AUTOMATED UNIT TESTS: BLANK SCORESHEET FOR ON-PITCH MANAGEMENT
// Verifies printable offline blank scoresheet for handwritten pen entry
// ========================================================

const { describe, it } = require('node:test');
const assert = require('node:assert');
const vm = require('vm');
const fs = require('fs');
const path = require('path');

describe('Blank Scoresheet (মাঠের স্কোরশিট - খাতা-কলমে লেখার ফাঁকা শিট)', () => {
  it('prepareBlankScoresheetForPrint() resets all scores, winners, knockout slots, and standings', () => {
    // Create mock DOM environment
    const elements = {};
    const getEl = (id) => {
      if (!elements[id]) {
        elements[id] = {
          id,
          value: 'test',
          textContent: 'live-data',
          innerHTML: '',
          style: { display: 'block' },
          className: '',
          classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            contains(c) { return this.classes.has(c); }
          },
          querySelector: () => null,
          querySelectorAll: () => []
        };
      }
      return elements[id];
    };

    // Pre-populate mock DOM with simulated live match state
    for (let i = 1; i <= 9; i++) {
      getEl(`m${i}-s1`).value = '3';
      getEl(`m${i}-s2`).value = '1';
      getEl(`m${i}-winner`).textContent = 'বিজয়ী: দল ১';
      getEl(`m${i}-pen-wrap`).style.display = 'block';
    }
    for (let m = 10; m <= 13; m++) {
      getEl(`ko${m}-s1`).value = '2';
      getEl(`ko${m}-s2`).value = '0';
      getEl(`ko${m}-winner`).textContent = '🏆 চ্যাম্পিয়ন';
      getEl(`ko${m}-pen-wrap`).style.display = 'block';
    }
    ['ko10-t1', 'ko10-t2', 'ko11-t1', 'ko11-t2', 'ko12-t1', 'ko12-t2', 'ko13-t1', 'ko13-t2'].forEach(id => {
      getEl(id).textContent = 'ব্রাজিল';
    });
    ['champ-a-display', 'champ-b-display', 'champ-c-display', 'best-ru-display'].forEach(id => {
      getEl(id).textContent = 'আর্জেন্টিনা';
    });
    ['p1-award-top-scorer-player', 'p1-award-top-scorer-team', 'p1-award-top-scorer-goals',
     'p1-award-mom-player', 'p1-award-mom-team', 'p1-award-gk-player', 'p1-award-gk-team'].forEach(id => {
      getEl(id).textContent = 'মেসি';
    });

    // Mock standings rows
    const mockTdCells = [
      { textContent: '১' }, // 0: pos
      { textContent: 'মুড়িয়ারা 🥇' }, // 1: team
      { textContent: '২' }, // 2: PL
      { textContent: '২' }, // 3: W
      { textContent: '০' }, // 4: D
      { textContent: '০' }, // 5: L
      { textContent: '৪-১' }, // 6: +/-
      { textContent: '+৩', className: 'gd-record gd-pos' }, // 7: GD
      { textContent: '০', className: 'fp-record fp-perfect' }, // 8: FP
      { textContent: '৬', querySelector: () => ({ textContent: '৬' }) }, // 9: PTS
      { innerHTML: '<span class="form-badge form-w">W</span>' } // 10: Form
    ];
    const mockRow = {
      querySelectorAll: (sel) => sel === 'td' ? mockTdCells : []
    };
    const mockTbody = {
      querySelectorAll: (sel) => sel === 'tr' ? [mockRow] : []
    };
    elements['tbody-group-A'] = mockTbody;

    const mockDocument = {
      body: {
        classList: {
          classes: new Set(),
          add(...args) { args.forEach(c => this.classes.add(c)); },
          remove(...args) { args.forEach(c => this.classes.delete(c)); },
          contains(c) { return this.classes.has(c); }
        }
      },
      head: { appendChild: () => {} },
      createElement: () => ({ textContent: '', id: '' }),
      getElementById: (id) => getEl(id),
      querySelectorAll: (sel) => {
        if (sel === '.score-input') {
          return [getEl('m1-s1'), getEl('m1-s2'), getEl('ko10-s1'), getEl('ko10-s2')];
        }
        if (sel === '.ko-team-name') {
          return [getEl('ko10-t1'), getEl('ko10-t2')];
        }
        return [];
      },
      querySelector: (sel) => null,
      addEventListener: () => {},
      removeEventListener: () => {}
    };

    const sandbox = {
      document: mockDocument,
      window: {
        print: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      },
      setTimeout: (fn, ms) => {
        if (ms <= 100) fn();
      },
      currentLang: 'bn',
      module: { exports: {} }
    };

    const appJsCode = fs.readFileSync(path.resolve(__dirname, '..', 'src/js/app.js'), 'utf8');
    vm.createContext(sandbox);
    vm.runInContext(appJsCode, sandbox);

    // Call prepareBlankScoresheetForPrint()
    sandbox.prepareBlankScoresheetForPrint();

    // Verify Group match scores are blank
    assert.strictEqual(getEl('m1-s1').value, '', 'Group match m1-s1 score must be blank');
    assert.strictEqual(getEl('m1-s2').value, '', 'Group match m1-s2 score must be blank');
    assert.strictEqual(getEl('m9-s1').value, '', 'Group match m9-s1 score must be blank');
    assert.strictEqual(getEl('m1-winner').textContent, '__________________', 'm1 winner line must be blank dotted line');
    assert.strictEqual(getEl('m1-pen-wrap').style.display, 'none', 'Penalty shootout wrap must be hidden');

    // Verify Knockout scores and winners are blank
    assert.strictEqual(getEl('ko10-s1').value, '', 'Knockout ko10-s1 score must be blank');
    assert.strictEqual(getEl('ko13-s2').value, '', 'Knockout ko13-s2 score must be blank');
    assert.strictEqual(getEl('ko10-winner').textContent, '', 'Knockout ko10-winner must be blank');
    assert.strictEqual(getEl('ko10-pen-wrap').style.display, 'none', 'Knockout pen wrap must be hidden');

    // Verify Knockout team advancement slots are blank for pen writing
    assert.strictEqual(getEl('ko10-t1').textContent, '', 'ko10-t1 slot must be blank');
    assert.strictEqual(getEl('ko10-t2').textContent, '', 'ko10-t2 slot must be blank');
    assert.strictEqual(getEl('ko12-t1').textContent, '', 'ko12-t1 (3rd place) slot must be blank');
    assert.strictEqual(getEl('ko13-t1').textContent, '', 'ko13-t1 (Final) slot must be blank');

    // Verify Group Champions and Best Runner-Up displays are blank
    assert.strictEqual(getEl('champ-a-display').textContent, '', 'champ-a-display must be blank');
    assert.strictEqual(getEl('champ-b-display').textContent, '', 'champ-b-display must be blank');
    assert.strictEqual(getEl('best-ru-display').textContent, '', 'best-ru-display must be blank');

    // Verify Standings table stats are completely blank for handwriting and erasing
    const rowCells = mockRow.querySelectorAll('td');
    assert.strictEqual(rowCells[1].textContent, 'মুড়িয়ারা', 'Medals must be stripped from team name');
    assert.strictEqual(rowCells[2].textContent, '', 'PL must be blank for pencil entry');
    assert.strictEqual(rowCells[3].textContent, '', 'W must be blank for pencil entry');
    assert.strictEqual(rowCells[4].textContent, '', 'D must be blank for pencil entry');
    assert.strictEqual(rowCells[5].textContent, '', 'L must be blank for pencil entry');
    assert.strictEqual(rowCells[6].textContent, '', '+/- must be blank for pencil entry');
    assert.strictEqual(rowCells[7].textContent, '', 'GD must be blank for pencil entry');
    assert.strictEqual(rowCells[8].textContent, '', 'FP must be blank for pencil entry');
    assert.strictEqual(rowCells[9].innerHTML, '', 'PTS must be blank for pencil entry');
    assert.strictEqual(rowCells[10].innerHTML, '', 'Form must be blank for pencil entry');

    // Verify Awards Ceremony on Page 1 are blank
    assert.strictEqual(getEl('p1-award-top-scorer-player').textContent, '', 'Top scorer player name must be blank');
    assert.strictEqual(getEl('p1-award-top-scorer-goals').textContent, '', 'Top scorer goals box must be blank');
    assert.strictEqual(getEl('p1-award-mom-player').textContent, '', 'Player of the Tournament name must be blank');
    assert.strictEqual(getEl('p1-award-gk-player').textContent, '', 'Best Goalkeeper name must be blank');
  });

  it('printDocument("blank-scoresheet") attaches print-only-1 and print-blank-scoresheet classes and prepares sheet', () => {
    let blankPrepared = false;
    let switchStageCalled = false;
    let windowPrintCalled = false;

    const mockDocument = {
      body: {
        classList: {
          classes: new Set(),
          add(...args) { args.forEach(c => this.classes.add(c)); },
          remove(...args) { args.forEach(c => this.classes.delete(c)); },
          contains(c) { return this.classes.has(c); }
        }
      },
      head: { appendChild: () => {} },
      createElement: () => ({ textContent: '', id: '' }),
      getElementById: (id) => {
        if (id === 'page1') {
          return {
            classList: {
              contains: () => false,
              remove: () => {},
              add: () => {}
            }
          };
        }
        return {
          style: {},
          textContent: '',
          value: '',
          classList: { remove: () => {}, add: () => {}, contains: () => false },
          setAttribute: () => {},
          removeAttribute: () => {}
        };
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelectorAll: () => [],
      querySelector: () => null
    };

    const sandbox = {
      document: mockDocument,
      window: {
        print: () => { windowPrintCalled = true; },
        addEventListener: () => {},
        removeEventListener: () => {}
      },
      switchP1Stage: (stage) => {
        if (stage === 'all') switchStageCalled = true;
      },
      prepareBlankScoresheetForPrint: () => {
        blankPrepared = true;
      },
      setTimeout: (fn, ms) => {
        if (ms <= 100) fn();
      },
      module: { exports: {} }
    };

    const appJsCode = fs.readFileSync(path.resolve(__dirname, '..', 'src/js/app.js'), 'utf8');
    vm.createContext(sandbox);
    vm.runInContext(appJsCode, sandbox);

    const origPrepare = sandbox.prepareBlankScoresheetForPrint;
    sandbox.prepareBlankScoresheetForPrint = () => {
      blankPrepared = true;
      if (origPrepare) origPrepare();
    };

    sandbox.printDocument('blank-scoresheet');

    assert.strictEqual(mockDocument.body.classList.contains('print-only-1'), true, 'Must add print-only-1');
    assert.strictEqual(mockDocument.body.classList.contains('print-blank-scoresheet'), true, 'Must add print-blank-scoresheet');
    assert.strictEqual(blankPrepared, true, 'Must call prepareBlankScoresheetForPrint');
  });

  it('verifies that print.css keeps the tournament cover image and swoosh visible during printing', () => {
    const printCss = fs.readFileSync(path.resolve(__dirname, '..', 'src/css/print.css'), 'utf8');

    // Ensure .cover-hero-bg-wrap is NOT set to display: none
    assert(!printCss.includes('.cover-hero-bg-wrap {\n        display: none'), '.cover-hero-bg-wrap must not be hidden in print styles');
    assert(printCss.includes('.cover-hero-bg-wrap {'), 'Includes print styling for .cover-hero-bg-wrap');
    assert(printCss.includes('display: block !important;'), 'Ensures cover-hero-bg-wrap is displayed in print');
    assert(printCss.includes('.cover-hero-img'), 'Styles .cover-hero-img for high fidelity print');
    assert(printCss.includes('print-color-adjust: exact'), 'Enforces exact print color adjust for cover banner graphics');
  });

  it('verifies that print.css enforces pure white background and borderless sheet for blank scoresheet', () => {
    const printCss = fs.readFileSync(path.resolve(__dirname, '..', 'src/css/print.css'), 'utf8');

    // Ensure .print-blank-scoresheet is excluded from the green gradient
    assert(printCss.includes(':not(.print-blank-scoresheet) .page-sheet'), 'Excludes print-blank-scoresheet from green stadium gradient');
    assert(printCss.includes('body.print-blank-scoresheet .page-sheet {\n        background: #ffffff !important;'), 'Enforces pure white background on .page-sheet for blank scoresheet');
    assert(printCss.includes('border: none !important;'), 'Enforces border: none on .page-sheet');
    assert(printCss.includes('body.print-blank-scoresheet .p1-card {\n        background: #ffffff !important;'), 'Enforces pure white background on .p1-card for blank scoresheet');
  });
});
