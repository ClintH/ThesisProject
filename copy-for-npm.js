/**
 * This script mirrors source files into ../demos-npm.
 */
import cpy from 'cpy';
import { deleteSync } from 'del';
import { replaceInFileSync } from 'replace-in-file';
const destinationRoot = `../demos-npm`;
const destination = `${destinationRoot}/src`;

// Delete previous src
deleteSync([ destination ], { force: true });

const categories = `audio camera data dom flow geometry io ml modulation pointer starters visuals`.split(` `);

// Copy sketches
for (const c of categories) {
  await cpy([ `${c}/**/*` ], `${destination}/${c}`);
}

// Re-write imports
// replaceInFileSync({
//   files: `${destination}/**/*.js`,
//   from: /^(import.*?["'])((?:@ixfx[^"']+))\.js(["'])/gm,
//   to: `$1$2$3`,
// });

replaceInFileSync({
  files: `${destination}/**/*.js`,
  from: /^(import.*?["'])((?:@ixfx[^"']+))\.js(["'])/gm,
  to: `$1$2$3`,
});

replaceInFileSync({
  files: `${destination}/**/*.js`,
  // from: /^import.*['"]@ixfx['"]/,
  from: /from\s+['"]@ixfx['"]/g,
  to: `from '@ixfx/core'`,
});

// Copy loose files
await cpy([ `index.html`, `favicon.ico`, `demos.css` ], `${destination}/`);

await cpy([ `eslint.config.mjs` ], `${destinationRoot}/`);

// Copy demos/jsconfig.json to demos/src/jsconfig.json
await cpy([ `${destinationRoot}/jsconfig.json` ], `${destination}/`, { flat: true });

console.log(`copy-for-npm done`);
