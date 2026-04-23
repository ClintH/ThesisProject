import * as path from "node:path";
import * as fs from "node:fs";
import { defineConfig } from "vite";

function getHtmlEntryFiles(srcDir) {
  const entry = {};

  function traverseDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    //console.log(currentDir);
    if (currentDir.startsWith(`src/ml`)) return;

    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const isDirectory = fs.statSync(filePath).isDirectory();

      if (isDirectory) {
        // If it's a directory, recursively traverse it
        traverseDir(filePath);
      } else if (path.extname(file) === `.html`) {
        // If it's an HTML file, add it to the entry object
        const name = path.relative(srcDir, filePath).replace(/\..*$/, ``);
        entry[name] = filePath;
      }
    });
  }

  traverseDir(srcDir);
  return entry;
}

export default defineConfig({
  root: `./src`,
  base: `/ThesisProject/`,
  build: {
    rollupOptions: {
      input: getHtmlEntryFiles(`src`)
    },
    outDir: `../docs`
  },
});


