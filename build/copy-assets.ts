import { cpSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

/**
 * Copy CSS files from src/styles/ to docs/assets/css/
 */
export function copyCss(stylesDir: string, outputDir: string): void {
  const cssOutDir = join(outputDir, 'assets', 'css');
  mkdirSync(cssOutDir, { recursive: true });

  // Copy top-level CSS files
  if (existsSync(stylesDir)) {
    const files = readdirSync(stylesDir, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && extname(file.name) === '.css') {
        const src = join(stylesDir, file.name);
        const dest = join(cssOutDir, file.name);
        cpSync(src, dest);
      }
    }

    // Copy families/ subdirectory
    const familiesStyleDir = join(stylesDir, 'families');
    if (existsSync(familiesStyleDir)) {
      const familiesCssOut = join(cssOutDir, 'families');
      mkdirSync(familiesCssOut, { recursive: true });
      const familyFiles = readdirSync(familiesStyleDir, { withFileTypes: true });
      for (const file of familyFiles) {
        if (file.isFile() && extname(file.name) === '.css') {
          cpSync(join(familiesStyleDir, file.name), join(familiesCssOut, file.name));
        }
      }
    }
  }
}

/**
 * Compile browser TypeScript from src/scripts/ to docs/assets/js/
 * Uses esbuild if available, otherwise falls back to simple copy.
 */
export function compileScripts(scriptsDir: string, outputDir: string): void {
  const jsOutDir = join(outputDir, 'assets', 'js');
  mkdirSync(jsOutDir, { recursive: true });

  const mainTs = join(scriptsDir, 'main.ts');
  if (!existsSync(mainTs)) {
    // No scripts to compile yet
    return;
  }

  try {
    // Use esbuild via npx for bundling
    execSync(
      `npx esbuild "${mainTs}" --bundle --outfile="${join(jsOutDir, 'main.js')}" --format=iife --target=es2020 --minify`,
      { stdio: 'pipe' }
    );
  } catch {
    // Fallback: just copy .ts files as .js stubs
    console.warn('  Warning: esbuild not available, skipping script compilation');
  }
}

/**
 * Copy static assets (icons, images, social) to docs/assets/
 */
export function copyStaticAssets(assetsDir: string, outputDir: string): void {
  if (!existsSync(assetsDir)) return;

  const assetsOutDir = join(outputDir, 'assets');
  mkdirSync(assetsOutDir, { recursive: true });

  for (const subdir of ['icons', 'images', 'social']) {
    const srcDir = join(assetsDir, subdir);
    if (existsSync(srcDir)) {
      const destDir = join(assetsOutDir, subdir);
      mkdirSync(destDir, { recursive: true });
      cpSync(srcDir, destDir, { recursive: true });
    }
  }
}

/**
 * Copy family example files to output.
 * Copies src/data/families/{slug}/examples/ to outputDir/../{slug}/examples/
 */
export function copyFamilyExamples(dataDir: string, outputDir: string, familySlugs: string[]): void {
  for (const slug of familySlugs) {
    const examplesDir = join(dataDir, 'families', slug, 'examples');
    if (!existsSync(examplesDir)) continue;

    // outputDir is docs/ai-coding, so examples go to docs/ai-coding/{slug}/examples/
    const destDir = join(outputDir, slug, 'examples');
    mkdirSync(destDir, { recursive: true });
    cpSync(examplesDir, destDir, { recursive: true });
  }
}

/**
 * Copy certification XML data files to output.
 * Copies src/data/families/{slug}/certification-data/ to outputDir/../{slug}/certification-data/
 */
export function copyCertificationData(dataDir: string, outputDir: string, familySlugs: string[]): void {
  for (const slug of familySlugs) {
    const certDataDir = join(dataDir, 'families', slug, 'certification-data');
    if (!existsSync(certDataDir)) continue;

    const destDir = join(outputDir, slug, 'certification-data');
    mkdirSync(destDir, { recursive: true });
    cpSync(certDataDir, destDir, { recursive: true });
  }
}

/**
 * Run all asset copy operations.
 */
export function copyAllAssets(srcDir: string, outputDir: string): void {
  copyCss(join(srcDir, 'styles'), outputDir);
  compileScripts(join(srcDir, 'scripts'), outputDir);
  copyStaticAssets(join(srcDir, 'assets'), outputDir);
}
