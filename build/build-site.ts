import { rmSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { loadAllData } from './load-data.js';
import { validateAllData } from './validate-data.js';
import { renderAllPages, getGeneratedPaths } from './render-pages.js';
import { copyAllAssets } from './copy-assets.js';
import { clearTemplateCache } from './template-engine.js';

const ROOT = join(import.meta.dirname, '..');
const SRC_DIR = join(ROOT, 'src');
const DATA_DIR = join(SRC_DIR, 'data');
const TEMPLATES_DIR = join(SRC_DIR, 'templates');
const OUTPUT_DIR = join(ROOT, 'docs');

const args = process.argv.slice(2);
const cleanOnly = args.includes('--clean');
const validateOnly = args.includes('--validate-only');

function clean(): void {
  console.log('Cleaning docs/ output...');
  // Only clean generated subdirectories, preserve docs/claude_code_levels_design.md etc.
  for (const subdir of ['ai-coding']) {
    const target = join(OUTPUT_DIR, subdir);
    if (existsSync(target)) {
      rmSync(target, { recursive: true, force: true });
    }
  }
}

function validate(skipNavCheck: boolean = false): boolean {
  console.log('Loading data...');
  const data = loadAllData(DATA_DIR);

  let generatedPaths: Set<string> | undefined;
  if (!skipNavCheck) {
    generatedPaths = getGeneratedPaths(data);
  }

  console.log('Validating data...');
  const result = validateAllData(data, generatedPaths);

  if (!result.valid) {
    console.error(`\nValidation failed with ${result.errors.length} error(s):\n`);
    for (const err of result.errors) {
      console.error(`  [${err.file}] ${err.field}: ${err.message}`);
    }
    return false;
  }

  console.log('Validation passed.');
  return true;
}

function build(): void {
  console.log('=== AI Coding Site Build ===\n');

  // Step 1: Clean
  clean();

  // Step 2: Load data
  console.log('Loading data...');
  const data = loadAllData(DATA_DIR);

  // Step 3: Get generated paths for nav validation
  const generatedPaths = getGeneratedPaths(data);

  // Step 4: Validate
  console.log('Validating data...');
  const result = validateAllData(data, generatedPaths);
  if (!result.valid) {
    console.error(`\nValidation failed with ${result.errors.length} error(s):\n`);
    for (const err of result.errors) {
      console.error(`  [${err.file}] ${err.field}: ${err.message}`);
    }
    process.exit(1);
  }
  console.log('  Validation passed.\n');

  // Step 5: Render pages
  console.log('Rendering pages...');
  clearTemplateCache();
  const pages = renderAllPages(data, TEMPLATES_DIR);
  console.log(`  Generated ${pages.length} page(s).\n`);

  // Step 6: Write HTML pages
  console.log('Writing HTML pages...');
  for (const page of pages) {
    const filePath = join(OUTPUT_DIR, page.outputPath);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, page.html, 'utf-8');
  }

  // Step 7: Copy assets (into basePath subdirectory so paths resolve)
  const basePath = data.site.site.siteBasePath.replace(/^\/|\/$/g, '');
  const assetsOutputDir = join(OUTPUT_DIR, basePath);
  console.log('Copying assets...');
  copyAllAssets(SRC_DIR, assetsOutputDir);

  // Step 8: Report
  console.log('\n=== Build Complete ===');
  console.log(`  Pages: ${pages.length}`);
  console.log(`  Output: ${OUTPUT_DIR}`);

  // List generated pages
  console.log('\nGenerated pages:');
  for (const page of pages) {
    console.log(`  ${page.outputPath}`);
  }
}

// Main entry point
if (cleanOnly) {
  clean();
  console.log('Clean complete.');
} else if (validateOnly) {
  const ok = validate();
  process.exit(ok ? 0 : 1);
} else {
  build();
}
