/**
 * Project-Wide Test Runner
 * Executes all automated unit test suites sequentially using Node.js built-in test runner.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const TESTS_DIR = path.resolve(__dirname, '..', 'tests');
const testFiles = fs.readdirSync(TESTS_DIR)
  .filter(f => f.endsWith('.test.js'))
  .map(f => path.join('tests', f));

console.log(`\n🏃 Running ${testFiles.length} test suites...\n`);

try {
  // First run component sync check
  execSync('node scripts/build.js --check', { stdio: 'inherit' });
  // Verify i18n
  execSync('node scripts/verify-i18n.js', { stdio: 'inherit' });

  // Run all unit tests
  execSync(`node --test ${testFiles.join(' ')}`, { stdio: 'inherit' });
  console.log('\n🎉 ALL PROJECT TEST SUITES PASSED WITH 100% SUCCESS!\n');
} catch (err) {
  console.error('\n❌ Tests failed.');
  process.exit(1);
}
