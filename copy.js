
import * as fs from "node:fs";
fs.copyFileSync(`./index.html`, `./docs/index.html`);
fs.copyFileSync(`./demos.css`, `./docs/demos.css`);
fs.copyFileSync(`./base.css`, `./docs/base.css`);
