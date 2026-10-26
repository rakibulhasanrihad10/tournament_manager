const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const code = fs.readFileSync('src/js/i18n.js', 'utf8');
vm.runInThisContext(code);

const regexes = [
  /data-i18n="([^"]+)"/g,
  /data-i18n-placeholder="([^"]+)"/g,
  /data-i18n-title="([^"]+)"/g,
  /data-i18n-html="([^"]+)"/g
];

const missingBn = [];
const missingEn = [];
let totalChecked = 0;

regexes.forEach(reg => {
  let m;
  while ((m = reg.exec(html)) !== null) {
    totalChecked++;
    const key = m[1];
    if (!TRANSLATIONS.bn[key]) missingBn.push(key);
    if (!TRANSLATIONS.en[key]) missingEn.push(key);
  }
});

console.log('Total keys checked in HTML:', totalChecked);
console.log('Missing in BN:', [...new Set(missingBn)]);
console.log('Missing in EN:', [...new Set(missingEn)]);

if (missingBn.length === 0 && missingEn.length === 0) {
  console.log('✅ ALL HTML i18n keys are 100% matched in both Bengali & English!');
} else {
  console.error('❌ Found missing keys!');
  process.exit(1);
}
