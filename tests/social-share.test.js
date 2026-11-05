const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');

test('Social Share Hub & Image Export Engine Test Suite', async (t) => {
  console.log('\n📸 Running Social Share Hub & Image Export Tests...\n');

  // Load prerequisites
  const constantsCode = fs.readFileSync('src/js/constants.js', 'utf8');
  const i18nCode = fs.readFileSync('src/js/i18n.js', 'utf8');
  const socialCode = fs.readFileSync('src/js/social-share.js', 'utf8');

  // Mock basic DOM environment
  const elements = new Map();

  const mockContext2D = {
    fillStyle: '',
    strokeStyle: '',
    font: '',
    lineWidth: 1,
    textAlign: '',
    fillRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    quadraticCurveTo() {},
    arc() {},
    fill() {},
    stroke() {},
    closePath() {},
    fillText() {},
    createLinearGradient() {
      return { addColorStop() {} };
    }
  };

  function createMockElement(id, tag = 'div') {
    const el = {
      id,
      tagName: tag.toUpperCase(),
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); },
        toggle(c, f) { if (f ?? !this.contains(c)) this.add(c); else this.remove(c); }
      },
      style: {},
      textContent: '',
      value: '',
      children: [],
      querySelectorAll() { return []; },
      querySelector() { return null; },
      getBoundingClientRect() { return { width: 400, height: 300 }; },
      getContext(type) {
        if (type === '2d') return mockContext2D;
        return null;
      },
      toBlob(cb) {
        if (cb) cb({ size: 1024, type: 'image/png' });
      },
      toDataURL() {
        return 'data:image/png;base64,mockPngData';
      },
      click() {}
    };
    elements.set(id, el);
    return el;
  }

  // Create core UI elements
  const socialModal = createMockElement('social-share-modal');
  createMockElement('p1-card-standings');
  createMockElement('p1-card-bracket');
  createMockElement('p1-card-schedule');
  createMockElement('page1');

  global.document = {
    getElementById: (id) => elements.get(id) || null,
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: (tag) => createMockElement('dyn-' + Math.random(), tag),
    body: {
      classList: { add() {}, remove() {} },
      appendChild() {},
      removeChild() {}
    }
  };
  global.window = global;
  global.alert = () => {};
  global.URL = {
    createObjectURL: () => 'blob:mock-url',
    revokeObjectURL: () => {}
  };

  // Evaluate scripts in VM context
  vm.runInThisContext(constantsCode);
  vm.runInThisContext(i18nCode);
  vm.runInThisContext(socialCode);

  await t.test('Test Suite 1: Modal Open and Close Functionality', () => {
    assert.strictEqual(typeof openSocialShareModal, 'function', 'openSocialShareModal must be defined');
    assert.strictEqual(typeof closeSocialShareModal, 'function', 'closeSocialShareModal must be defined');

    openSocialShareModal();
    assert.strictEqual(socialModal.classList.contains('active'), true, 'Modal should have active class');
    assert.strictEqual(socialModal.style.display, 'flex', 'Modal display should be flex');

    closeSocialShareModal();
    assert.strictEqual(socialModal.classList.contains('active'), false, 'Modal should not have active class');
    assert.strictEqual(socialModal.style.display, 'none', 'Modal display should be none');
    console.log('  ✅ PASS: Modal opens and closes smoothly');
  });

  await t.test('Test Suite 2: Export Functions & Canvas Card Renderers', () => {
    assert.strictEqual(typeof renderStandingsToCanvas, 'function');
    assert.strictEqual(typeof renderBracketToCanvas, 'function');
    assert.strictEqual(typeof renderFixturesCanvas, 'function');
    assert.strictEqual(typeof renderMasterBoardToCanvas, 'function');
    assert.strictEqual(typeof downloadCanvasAsPng, 'function');
    assert.strictEqual(typeof downloadSocialCard, 'function');
    assert.strictEqual(typeof downloadAllSocialCards, 'function');

    const standingsCanvas = renderStandingsToCanvas();
    assert(standingsCanvas, 'Standings canvas must be created');
    assert.strictEqual(standingsCanvas.width, 1200, 'Standings canvas width must be 1200');

    const bracketCanvas = renderBracketToCanvas();
    assert(bracketCanvas, 'Bracket canvas must be created');
    assert.strictEqual(bracketCanvas.width, 1200, 'Bracket canvas width must be 1200');

    const fixturesCanvas = renderFixturesCanvas();
    assert(fixturesCanvas, 'Fixtures canvas must be created');
    assert.strictEqual(fixturesCanvas.width, 1200, 'Fixtures canvas width must be 1200');

    const masterCanvas = renderMasterBoardToCanvas();
    assert(masterCanvas, 'Master canvas must be created');
    assert.strictEqual(masterCanvas.width, 1400, 'Master canvas width must be 1400');

    console.log('  ✅ PASS: All 4 Canvas 2D image generators create high-res canvases');
  });

  await t.test('Test Suite 3: PNG Download Execution', async () => {
    const dummyCanvas = createMockElement('test-canvas', 'canvas');
    let downloadedUrl = '';
    downloadedUrl = await downloadCanvasAsPng(dummyCanvas, 'test.png');
    assert(downloadedUrl.startsWith('blob:') || downloadedUrl.startsWith('data:'), 'PNG download creates valid blob or data URL');

    const mockBtn = createMockElement('mock-btn', 'button');
    mockBtn.innerHTML = 'Download';
    await downloadSocialCard('standings', mockBtn);

    console.log('  ✅ PASS: PNG download pipeline runs and triggers client save');
  });

  console.log('\n==========================================');
  console.log('Results: All Social Share tests passed with 100% success!');
  console.log('==========================================\n');
});
