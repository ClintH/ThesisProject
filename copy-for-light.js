/**
 * This script mirrors source files into ../demos-glitch,
 * re-writing the imports so they use URL imports.
 */
import cpy from 'cpy';
import { replaceInFileSync } from 'replace-in-file';
import { deleteSync } from 'del';

const destination = `../demos-light`;
const categories = `audio camera data dom flow geometry io ml modulation pointer starters visuals`.split(` `);
const deletePatterns = categories.map(c => `${destination}/${c}/`);

// Delete previous sketch categories
deleteSync(deletePatterns, { force: true });

// Copy files
for (const c of categories) {
  await cpy([ `${c}/**/*` ], `${destination}/${c}`);
}

// Copy loose files
await cpy([ `index.html`, `favicon.ico`, `demos.css`, `eslint.config.mjs` ], `${destination}/`);

try {
  // Re-write import map
  replaceInFileSync({
    files: `${destination}/**/*.html`,
    processor: (input) => input.replace(/<script type="importmap">[\s\S]*?<\/script>/, `<script type="importmap">{ "imports": { "@ixfx":"https://unpkg.com/ixfx/dist/min/core.js", "@ixfx/": "https://unpkg.com/ixfx/dist/min/" } }</script>`)

  });
  console.log(`copy-for-light done. Destination: ${destination}`);
} catch (error) {
  console.error(`copy-for-light error occurred:`, error);
}