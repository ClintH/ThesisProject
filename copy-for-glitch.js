/**
 * This script mirrors source files into ../demos-glitch,
 * re-writing the imports so they use URL imports.
 */
import cpy from 'cpy';
import { replaceInFileSync } from 'replace-in-file';
import { deleteSync } from 'del';

const destination = `../../ixfx-demos-glitch`;
const categories = `audio camera data dom flow geometry io ml modulation pointer starters visuals`.split(` `);
const deletePatterns = categories.map(c => `${destination}/${c}/`);

// Delete previous sketch categories
deleteSync(deletePatterns, { force: true });

// Copy files
for (const c of categories) {
  await cpy([`${c}/**/*`], `${destination}/${c}`);
}

// Copy loose files
await cpy([`index.html`, `favicon.ico`, `demos.css`, `.eslintrc.json`], `${destination}/`);

// Re-write import map
const replaceOptions = {
  files: `${destination}/**/*.html`,
  from: /{ "ixfx\/": "\/ixfx\/" }/g,
  to: `{ "ixfx/": "https://unpkg.com/ixfx/dist/" }`
};

try {
  replaceInFileSync(replaceOptions);
  console.log(`copy-for-glitch done`);
}
catch (error) {
  console.error(`copy -for-glitch error occurred:`, error);
}