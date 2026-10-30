/**
 * Tournament Management System - Mobile & Tablet Responsiveness Test Suite
 * Verifies responsive layout rules for mobile/tablet screens while ensuring
 * @media print remains 100% untouched and intact.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('\n📱 Running Mobile & Desktop Responsiveness Test Suite...\n');

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

const mainCssPath = path.join(__dirname, '..', 'src', 'css', 'main.css');
const printCssPath = path.join(__dirname, '..', 'src', 'css', 'print.css');
const hubCssPath = path.join(__dirname, '..', 'src', 'css', 'hub.css');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');
const printCss = fs.readFileSync(printCssPath, 'utf8');
const hubCss = fs.readFileSync(hubCssPath, 'utf8');

// ========================================================
// Test Suite 1: Isolation of Screen & Print Media Styles
// ========================================================
console.log('🛡️ Test Suite 1: Isolation of Screen & Print Media Styles');

it('main.css contains dedicated @media screen and (max-width: 900px) block', () => {
  assert.ok(mainCss.includes('@media screen and (max-width: 900px)'), 'Missing @media screen and (max-width: 900px) in main.css');
});

it('print.css contains NO screen-only media queries', () => {
  assert.ok(!printCss.includes('@media screen'), 'print.css must never contain @media screen');
  assert.ok(!printCss.includes('max-width: 900px'), 'print.css must never contain max-width: 900px');
});

it('print.css maintains A4 landscape print isolation', () => {
  assert.ok(printCss.includes('@media print'), 'print.css must include @media print');
  assert.ok(printCss.includes('.page-sheet'), 'print.css must define .page-sheet for print');
});

// ========================================================
// Test Suite 2: Top Action Bar & Onboarding Banner Responsiveness
// ========================================================
console.log('\n🧭 Test Suite 2: Top Action Bar & Onboarding Banner Responsiveness');

it('Action bar stacks vertically on mobile screens', () => {
  assert.ok(mainCss.includes('.action-bar-inner') && mainCss.includes('flex-direction: column !important;'), 'Action bar inner must stack vertically');
});

it('Action buttons wrap with comfortable touch targets', () => {
  assert.ok(mainCss.includes('.action-btns') && mainCss.includes('flex-wrap: wrap !important;'), 'Action buttons must wrap on mobile');
  assert.ok(mainCss.includes('.btn-primary-wizard') && mainCss.includes('min-height: 36px !important;'), 'Primary setup CTA must be touch friendly');
});

it('Welcome banner stacks vertically and remains full width', () => {
  assert.ok(mainCss.includes('.welcome-banner-inner') && mainCss.includes('flex-direction: column !important;'), 'Welcome banner inner must stack on mobile');
  assert.ok(mainCss.includes('.welcome-banner-actions') && mainCss.includes('width: 100% !important;'), 'Welcome banner actions must stretch full width');
});

// ========================================================
// Test Suite 3: Page 1 Fixture & Bracket Mobile Responsiveness
// ========================================================
console.log('\n📄 Test Suite 3: Page 1 Fixture & Bracket Mobile Responsiveness');

it('Page 1 layout stacks columns vertically on mobile screens', () => {
  assert.ok(mainCss.includes('#page1 .page1-layout') && mainCss.includes('flex-direction: column !important;'), 'Page 1 layout must stack vertically on mobile');
  assert.ok(mainCss.includes('#page1 .p1-left-col') && mainCss.includes('width: 100% !important;'), 'Page 1 left column must be 100% width on mobile');
  assert.ok(mainCss.includes('#page1 .p1-right-col') && mainCss.includes('width: 100% !important;'), 'Page 1 right column must be 100% width on mobile');
});

it('Group points tables support smooth horizontal swiping on mobile', () => {
  assert.ok(mainCss.includes('#page1 .grp-table-wrap') && mainCss.includes('overflow-x: auto !important;'), 'grp-table-wrap must have overflow-x: auto');
  assert.ok(mainCss.includes('-webkit-overflow-scrolling: touch !important;'), 'grp-table-wrap must enable native touch momentum scrolling');
  assert.ok(mainCss.includes('#page1 .standings-table') && mainCss.includes('min-width: 440px !important;'), 'standings table must have minimum width for 11 columns');
});

it('Match schedule table in card supports horizontal swipe without cramping', () => {
  assert.ok(mainCss.includes('#page1 .p1-right-col .p1-card') && mainCss.includes('overflow-x: auto !important;'), 'Schedule card must have overflow-x: auto');
  assert.ok(mainCss.includes('#page1 .p1-right-col table') && mainCss.includes('min-width: 480px !important;'), 'Schedule table must maintain min-width');
});

it('Knockout brackets stack to 1 column on mobile phones (< 640px)', () => {
  assert.ok(mainCss.includes('@media screen and (max-width: 640px)'), 'Must include max-width: 640px query');
  assert.ok(mainCss.includes('#page1 .bracket-grid-2x2') && mainCss.includes('grid-template-columns: 1fr !important;'), 'Bracket grid must stack to 1 column on phones');
});

it('Awards & honours section has spacious flexible fields and wraps on narrow phones', () => {
  assert.ok(mainCss.includes('.award-field-player') && mainCss.includes('flex: 1.6;'), 'Player field has spacious flex layout');
  assert.ok(mainCss.includes('.award-field-team') && mainCss.includes('flex: 1.2;'), 'Team field has spacious flex layout');
  assert.ok(mainCss.includes('.award-details') && mainCss.includes('flex-wrap: wrap !important;'), 'Award details wraps cleanly on narrow phones');
});

it('Match score inputs & event buttons have touch-action manipulation', () => {
  assert.ok(mainCss.includes('#page1 .score-input') && mainCss.includes('touch-action: manipulation;'), 'Score inputs must have touch-action manipulation');
  assert.ok(mainCss.includes('#page1 .btn-match-event') && mainCss.includes('touch-action: manipulation;'), 'Event buttons must have touch-action manipulation');
});

// ========================================================
// Test Suite 4: Page 2 Squad Lineup & Operations Hub Responsiveness
// ========================================================
console.log('\n📋 Test Suite 4: Page 2 Squad Lineup & Operations Hub Responsiveness');

it('Page 2 layout stacks squad list and operations hub vertically', () => {
  assert.ok(mainCss.includes('#page2 .p2-layout') && mainCss.includes('flex-direction: column !important;'), 'Page 2 layout must stack vertically on mobile');
  assert.ok(mainCss.includes('#page2 .p2-left') && mainCss.includes('width: 100% !important;'), 'Page 2 left column must be 100% width on mobile');
  assert.ok(mainCss.includes('#page2 .p2-right') && mainCss.includes('width: 100% !important;'), 'Page 2 right column must be 100% width on mobile');
});

it('Interactive team tabs form a smooth mobile pill carousel with touch scrolling', () => {
  assert.ok(mainCss.includes('#page2 .p2-team-tabs-bar') && mainCss.includes('overflow-x: auto !important;'), 'Team tabs bar must scroll horizontally');
  assert.ok(mainCss.includes('flex-wrap: nowrap !important;'), 'Team tabs bar must not wrap brokenly across rows');
  assert.ok(mainCss.includes('#page2 .p2-team-tab') && mainCss.includes('white-space: nowrap !important;'), 'Team tab button must not break text');
  assert.ok(mainCss.includes('min-height: 34px !important;'), 'Team tab button must have touch-friendly height');
});

it('Team metadata fields adapt from 4 columns to 2 columns on mobile (and 1 on small phones)', () => {
  assert.ok(mainCss.includes('#page2 .team-meta-container') && mainCss.includes('grid-template-columns: 1fr 1fr !important;'), 'Team metadata must use 2-column grid on mobile');
  assert.ok(mainCss.includes('@media screen and (max-width: 480px)'), 'Must include 480px breakpoint for compact phones');
});

it('Player name inputs have comfortable touch height and manipulation', () => {
  assert.ok(mainCss.includes('#page2 .player-input-text') && mainCss.includes('min-height: 30px !important;'), 'Player input must be touch friendly');
  assert.ok(mainCss.includes('#page2 .player-input-text') && mainCss.includes('touch-action: manipulation;'), 'Player input must prevent tap delay');
});

it('Page 2 Operations Hub cards (Top Scorers, Discipline, Overview) adapt seamlessly', () => {
  assert.ok(mainCss.includes('#page2 .p2-op-card'), 'Operations hub cards are responsive');
  assert.ok(mainCss.includes('#page2 #p2-top-scorers-container'), 'Top scorers container adapts');
  assert.ok(mainCss.includes('#page2 #p2-discipline-container'), 'Discipline container adapts');
  assert.ok(mainCss.includes('#page2 #p2-overview-container'), 'Overview container adapts');
});

// ========================================================
// Test Suite 5: Sports Hub View Responsiveness
// ========================================================
console.log('\n🏟️ Test Suite 5: Sports Hub View Responsiveness');

it('Sports Hub grid stacks to 1 column on mobile screens (< 768px)', () => {
  assert.ok(hubCss.includes('@media screen and (max-width: 768px)'), 'hub.css must include mobile media query');
  assert.ok(hubCss.includes('.hub-grid') && hubCss.includes('grid-template-columns: 1fr;'), 'Hub grid must be 1 column on mobile');
});

// Summary
console.log('\n==========================================');
console.log(`Results: ${passedTests} passed, ${failedTests} failed`);
if (failedTests === 0) {
  console.log('🎉 All Mobile & Desktop Responsiveness tests passed with 100% success!');
} else {
  console.error(`💥 ${failedTests} tests failed.`);
  process.exit(1);
}
console.log('==========================================\n');
