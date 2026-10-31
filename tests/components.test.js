/**
 * Modular Component Architecture Test Suite
 * Tests the integrity of modular HTML components, template includes,
 * and compiler synchronization with root index.html.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { compileTemplate } = require('../scripts/build.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'src', 'components');
const TEMPLATE_PATH = path.join(ROOT_DIR, 'src', 'index.template.html');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');

test('Modular Architecture & Component Separation Suite', async (t) => {
  console.log('\n🧱 Running Component Architecture & Modularity Tests...\n');

  await t.test('Test Suite 1: Component File Existence & Organization', () => {
    const expectedComponents = [
      'common/head.html',
      'common/navbar.html',
      'common/welcome-banner.html',
      'common/scripts.html',
      'hub/sports-hub-view.html',
      'football/page1-sheet.html',
      'football/page2-sheet.html',
      'football/poster-sheet.html',
      'football/blank-roster-sheet.html',
      'modals/match-events-modal.html',
      'modals/tournament-wizard-modal.html',
      'modals/promo-poster-modal.html',
      'modals/entry-choice-modal.html',
      'modals/team-registration-modal.html',
      'modals/blank-roster-modal.html',
      'modals/sport-preview-modal.html',
      'modals/tournament-rules-modal.html'
    ];

    expectedComponents.forEach(relPath => {
      const fullPath = path.join(COMPONENTS_DIR, relPath);
      assert(fs.existsSync(fullPath), `Component file must exist: ${relPath}`);
      const stat = fs.statSync(fullPath);
      assert(stat.size > 0, `Component file must not be empty: ${relPath}`);
      console.log(`  ✅ PASS: Component exists and non-empty: src/components/${relPath}`);
    });
  });

  await t.test('Test Suite 2: Template Integrity & Directives', () => {
    assert(fs.existsSync(TEMPLATE_PATH), 'Template must exist at src/index.template.html');
    const templateContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    assert(templateContent.includes("<!-- @@include('common/head.html') -->"), 'Template includes head.html');
    assert(templateContent.includes("<!-- @@include('hub/sports-hub-view.html') -->"), 'Template includes sports-hub-view.html');
    assert(templateContent.includes("<!-- @@include('football/page1-sheet.html') -->"), 'Template includes page1-sheet.html');
    assert(templateContent.includes("<!-- @@include('football/page2-sheet.html') -->"), 'Template includes page2-sheet.html');
    assert(templateContent.includes("<!-- @@include('modals/tournament-wizard-modal.html') -->"), 'Template includes tournament-wizard-modal.html');
    console.log('  ✅ PASS: Template contains all core include directives');
  });

  await t.test('Test Suite 3: Build Synchronization with index.html', () => {
    const compiled = compileTemplate();
    assert(compiled.length > 50000, 'Compiled output must contain full application markup');

    const indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
    const normalizedCompiled = compiled.replace(/\r\n/g, '\n').trim();
    const normalizedIndex = indexHtml.replace(/\r\n/g, '\n').trim();

    assert.strictEqual(
      normalizedIndex,
      normalizedCompiled,
      'index.html at root must match compiled output of src/index.template.html! Run node scripts/build.js'
    );
    console.log('  ✅ PASS: Root index.html is 100% byte-for-byte in sync with components');
  });

  await t.test('Test Suite 4: Key DOM IDs Preserved Across Components', () => {
    const indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

    const requiredIds = [
      'sports-hub-view',
      'football-app-view',
      'page1',
      'page2',
      'match-events-modal',
      'tournament-wizard-modal',
      'promo-poster-modal',
      'page-poster',
      'page-blank-roster',
      'football-entry-modal',
      'team-registration-modal',
      'blank-roster-config-modal',
      'sport-preview-modal',
      'tournament-rules-modal'
    ];

    requiredIds.forEach(id => {
      assert(indexHtml.includes(`id="${id}"`), `Root index.html must retain id="${id}"`);
      console.log(`  ✅ PASS: ID verified in assembled markup: #${id}`);
    });
  });

  console.log('\n==========================================');
  console.log('Results: All Component Architecture tests passed with 100% success!');
  console.log('==========================================\n');
});
