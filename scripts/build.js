/**
 * Zero-dependency HTML Component Compiler
 * Assembles modular components from src/components/ into index.html
 * 
 * Usage:
 *   node scripts/build.js         # Builds index.html from src/index.template.html
 *   node scripts/build.js --check # Validates that index.html is up to date with components
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT_DIR, 'src', 'index.template.html');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'src', 'components');
const OUTPUT_PATH = path.join(ROOT_DIR, 'index.html');

function compileTemplate() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found at ${TEMPLATE_PATH}`);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Match <!-- @@include('filepath') --> with optional indentation preserved
  const compiled = template.replace(/^([ \t]*)<!--\s*@@include\(['"]([^'"]+)['"]\)\s*-->/gm, (match, indent, includePath) => {
    const fullIncludePath = path.join(COMPONENTS_DIR, includePath);
    if (!fs.existsSync(fullIncludePath)) {
      throw new Error(`Component not found: ${fullIncludePath} (referenced in template)`);
    }

    const componentContent = fs.readFileSync(fullIncludePath, 'utf8');
    // If indent is present, prepend indent to each line of component
    if (indent) {
      return componentContent
        .split(/\r?\n/)
        .map(line => line.length > 0 ? indent + line : line)
        .join('\n');
    }
    return componentContent;
  });

  return compiled;
}

function run() {
  const isCheckMode = process.argv.includes('--check');

  const compiled = compileTemplate();
  const normalizedCompiled = compiled.replace(/\r\n/g, '\n').trim();

  if (isCheckMode) {
    if (!fs.existsSync(OUTPUT_PATH)) {
      console.error('❌ index.html does not exist! Run "node scripts/build.js" first.');
      process.exit(1);
    }
    const current = fs.readFileSync(OUTPUT_PATH, 'utf8').replace(/\r\n/g, '\n').trim();
    if (current !== normalizedCompiled) {
      console.error('❌ index.html is out of sync with src/components/! Run "node scripts/build.js" to update.');
      process.exit(1);
    }
    console.log('✅ index.html is in sync with src/components/.');
    return;
  }

  // Write compiled output
  fs.writeFileSync(OUTPUT_PATH, compiled, 'utf8');
  console.log(`🚀 Successfully compiled modular components into index.html (${compiled.split('\n').length} lines).`);
}

if (require.main === module) {
  run();
}

module.exports = { compileTemplate };
