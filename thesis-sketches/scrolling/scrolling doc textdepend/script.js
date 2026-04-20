import { continuously } from "@ixfx/flow.js";

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(`canvas`));
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext(`2d`));
const debug = /** @type {HTMLElement} */ (document.getElementById(`debug`));

const settings = {
  docMaxW: 580,
  docPadding: 90,
  lineH: 20,
  marginBefore: { h1: 10, h2: 36, body: 12, image: 20, comment: 16 },
  zones: {
    sticky: {
      label: `Sticky`,
      hitPadding: 30,  // extra grab area above and below the heading
      apply(/** @type {number} */ delta) {
        return delta * 0.2;
      },
    },
    slippery: {
      label: `Slippery`,
      hitPadding: 0,
      apply(/** @type {number} */ delta) {
        return delta * 3.5;
      },
    },
  },

  colors: {
    docBg: `#fafaf8`,
    pageBg: `#1a1a1a`,
    h1: `#111`,
    h2: `#222`,
    body: `#333`,
    imageBg: `#e8e4de`,
    imageLine: `rgba(0,0,0,0.07)`,
    imageIcon: `rgba(0,0,0,0.22)`,
    commentBg: `#fdf6e3`,
    commentAccent: `#c8a84b`,
    commentText: `#4a4540`,
    commentLine: `rgba(0,0,0,0.05)`,
  },

  rawBlocks: [
    { type: `h1`, text: `Heading 1` },
    { type: `body`, text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla parLorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum sagittis facilisis. Cras ac quam ac justo tristique rhoncus non at sem. Integer hendrerit pellentesque nisi vel euismod. Proin maximus elementum tincidunt. Phasellus sed tortor a dui vestibulum eleifend a eu magna. Integer id tristique urna, eu fermentum nunc. Vestibulum sodales, massa vel laoreet porttitor, lectus ex commodo eros, in rhoncus erat metus sit amet diam. Nunc ex arcu, varius eu purus ac, porta elementum arcu. Vestibulum sagittis sodales eros non efficitur. Pellentesque in dapibus nisl. Duis nec libero sapieniatur.` },
    { type: `image`, caption: `Figure 1. A placeholder image` },
    { type: `h2`, text: `Heading 2` },
    { type: `body`, text: `Nam id felis nec neque gravida accumsan. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec rutrum lacinia ultricies. Vivamus lobortis tempus nunc at finibus. Vivamus aliquet vitae magna at convallis. Praesent sollicitudin massa sit amet egestas imperdiet. Duis eu velit hendrerit, finibus arcu a, tempus urna. Vestibulum at orci vitae lorem consequat faucibus. Fusce consectetur varius condimentum. Quisque finibus, arcu eu dignissim consectetur, justo est mollis leo, non feugiat orci nisl vitae elit. Proin ornare turpis augue, a lacinia ligula pretium a. In semper, orci nec vehicula pulvinar, sapien augue feugiat velit, ac semper odio odio quis lacus.` },
    { type: `body`, text: `Donec tempor malesuada maximus. Integer vel lorem eu ante vulputate fringilla vel sit amet mi. Morbi sed odio dapibus, bibendum velit ut, tempor ex. Quisque in molestie sem, at varius mi. Etiam in feugiat metus. Fusce at augue sit amet nunc ultrices accumsan ac et lectus. Pellentesque est ex, ultrices vitae nulla at, ullamcorper interdum odio.` },
    { type: `comment`, text: `Note: the passage above draws on earlier observations regarding temporal structure and the movement of material through successive states.` },
    { type: `h2`, text: `Heading 3` },
    { type: `body`, text: `Aenean eget porttitor nibh, eget sodales massa. Ut quis libero elit. Vivamus condimentum ac velit vitae molestie. Quisque tincidunt volutpat ipsum sit amet faucibus. Curabitur ullamcorper risus ac leo mattis, id ultrices arcu tincidunt. Vivamus et egestas libero, vel mollis felis. Nunc efficitur ligula quis libero posuere pharetra. Donec at enim dolor. Maecenas rutrum egestas mollis. Quisque eu elit lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.` },
    { type: `body`, text: `Fusce mattis, ligula sit amet ullamcorper ultricies, lacus tortor viverra ante, dapibus ultrices nulla nibh semper quam. Cras a magna nulla. Vivamus porttitor nulla felis, ac tristique tellus consectetur sit amet. Praesent fringilla molestie velit ac pellentesque. Etiam dignissim et odio nec pharetra. Vivamus felis tortor, consectetur commodo commodo id, dapibus quis elit. Nam non magna hendrerit, fringilla tellus vitae, finibus felis. Integer accumsan, nunc in elementum facilisis, nunc enim rhoncus tellus, vel fringilla justo metus vel sapien.` },
    { type: `h2`, text: `Heading 4` },
    { type: `body`, text: `Duis id diam a tellus tincidunt imperdiet ac non enim. Aliquam imperdiet tortor vel arcu tincidunt mollis. Morbi vel nisi vitae urna ultrices fringilla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam mi orci, facilisis vel rhoncus eget, mollis sed enim. Phasellus sed magna tempus, lobortis lorem non, aliquam arcu. Etiam ut porttitor purus. Quisque at mollis ipsum, nec laoreet nisl. Nulla facilisi. Maecenas sit amet risus non nibh bibendum volutpat. Vestibulum nisl libero, porta vel elit non, dignissim suscipit leo. Nullam ac bibendum augue. Ut nisi dolor, luctus ac nisi vitae, facilisis sodales sapien. Aliquam vitae risus est. Morbi blandit urna eu magna volutpat maximus.` },
    { type: `body`, text: `Fusce sit amet nunc sit amet mi efficitur congue. Morbi sapien sem, egestas eu est eu, vehicula facilisis elit. Phasellus gravida ullamcorper velit. In ut nisi quis risus lacinia elementum at vel lacus. Etiam id sem ac tortor consectetur interdum a sit amet lorem. Curabitur egestas massa ut orci tempus condimentum. Duis vitae sollicitudin odio. Nunc rhoncus dui sed dui pellentesque, non maximus lectus dictum.` },
    { type: `h2`, text: `Heading 5` },
    { type: `body`, text: `Vivamus sodales porta magna, in rutrum quam consectetur sit amet. Curabitur maximus, quam vel feugiat viverra, mauris risus tincidunt odio, eu porttitor mi urna sit amet augue. Nunc euismod tempor dui ac lacinia. Cras blandit sem eget molestie bibendum. Fusce nec mattis metus, a pretium velit. Quisque est risus, ultrices dapibus dolor non, congue tincidunt metus. Vestibulum facilisis sollicitudin sapien, at aliquet felis finibus eu. In tempor euismod elementum. Pellentesque ac libero ut eros viverra pharetra ut non arcu. Etiam nec feugiat massa. Nam eget elementum nibh, at tincidunt dolor.` },
  ],
};

let state = {
  dpr: window.devicePixelRatio || 1,
  cssWidth: 0,
  cssHeight: 0,
  contentOffset: 0,
  isScrolling: false,
  lastY: /** @type {number|null} */ (null),
  activeZone: settings.zones.slippery,
  activeBlock: /** @type {any} */ (null),
  layout: /** @type {any[]} */ ([]),
  contentTotalH: 0,
};

const saveState = (/** @type {Partial<typeof state>} */ patch) => {
  state = { ...state, ...patch };
};

function zoneForType(/** @type {string} */ type) {
  return (type === `h1` || type === `h2`) ? settings.zones.sticky : settings.zones.slippery;
}

function buildLayout(/** @type {number} */ docW) {
  const { docPadding, lineH, marginBefore, rawBlocks } = settings;
  const textW = docW - docPadding * 2;
  const layout = [];
  let y = 24;

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i];

    // apply top margin for all blocks except the very first
    if (i > 0) y += marginBefore[block.type] ?? 12;

    let h;
    if (block.type === `h1`) {
      h = 36;
    } else if (block.type === `h2`) {
      h = 28;
    } else if (block.type === `image`) {
      h = 180;
    } else if (block.type === `comment`) {
      const charsPerLine = Math.floor(textW / ctx.measureText(`M`).width * 1.7);
      const lines = Math.ceil(block.text.length / charsPerLine);
      h = lines * lineH + 28;
    } else {
      const charsPerLine = Math.floor(textW / ctx.measureText(`M`).width * 1.7);
      const lines = Math.ceil(block.text.length / charsPerLine);
      h = lines * lineH + 20;
    }
    layout.push({ block, zone: zoneForType(block.type), y, h });
    y += h;
  }

  saveState({ layout, contentTotalH: y + 40 });
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = window.innerWidth;
  const cssHeight = window.innerHeight;
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  saveState({ dpr, cssWidth, cssHeight });
  buildLayout(Math.min(settings.docMaxW, cssWidth - 40));
}
window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();

canvas.addEventListener(`pointerdown`, (e) => {
  if (e.pointerType === `touch`) return;
  saveState({ isScrolling: true, lastY: e.offsetY });
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener(`pointermove`, (e) => {
  const { contentOffset, isScrolling, lastY, layout, activeZone } = state;
  const docY = contentOffset + e.offsetY;

  // find which block the pointer is over.
  // sticky blocks are checked with extra padding so headings are easier to grab.
  //sticky first so their padded area wins over adjacent body text.
  let newActiveBlock = null;
  let newActiveZone = activeZone;

  for (const item of layout) {
    const pad = item.zone.hitPadding;
    if (item.zone === settings.zones.sticky && docY >= item.y - pad && docY < item.y + item.h + pad) {
      newActiveBlock = item;
      newActiveZone = item.zone;
      break;
    }
  }

  if (!newActiveBlock) {
    for (const item of layout) {
      if (docY >= item.y && docY < item.y + item.h) {
        newActiveBlock = item;
        newActiveZone = item.zone;
        break;
      }
    }
  }

  const patch = /** @type {Partial<typeof state>} */ ({
    activeBlock: newActiveBlock,
    activeZone: newActiveZone,
  });

  if (isScrolling && lastY !== null) {
    const delta = e.offsetY - lastY;
    // negative delta: dragging up = scrolling down
    patch.lastY = e.offsetY;
    patch.contentOffset = clampOffset(contentOffset + newActiveZone.apply(-delta));
  }

  saveState(patch);
  updateDebug(e);
});

canvas.addEventListener(`pointerup`, stopScroll);
canvas.addEventListener(`pointercancel`, stopScroll);
function stopScroll() {
  saveState({ isScrolling: false, lastY: null });
}

function clampOffset(/** @type {number} */ v) {
  const { contentTotalH, cssHeight } = state;
  return Math.max(0, Math.min(contentTotalH - cssHeight, v));
}

const docW = () => Math.min(settings.docMaxW, state.cssWidth - 40);
const docX = () => (state.cssWidth - docW()) / 2;

// draw loop
continuously(() => {
  const { cssWidth, cssHeight, contentOffset, layout } = state;
  const { colors, docPadding, lineH } = settings;

  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const dw = docW();
  const dx = docX();

  ctx.fillStyle = colors.pageBg;
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  ctx.fillStyle = colors.docBg;
  ctx.fillRect(dx, 0, dw, cssHeight);

  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, 0, dw, cssHeight);
  ctx.clip();

  const textW = dw - docPadding * 2;
  const tx = dx + docPadding;

  for (const item of layout) {
    const { block, y, h } = item;
    const screenY = y - contentOffset;

    if (screenY + h < 0) continue;
    if (screenY > cssHeight) break;

    ctx.textAlign = `left`;

    if (block.type === `h1`) {
      // Vertical pinstripe texture behind h1
      ctx.save();
      ctx.beginPath();
      ctx.rect(tx, screenY, textW, h);
      ctx.clip();
      ctx.strokeStyle = `rgba(0,0,0,0.035)`;
      ctx.lineWidth = 1;
      for (let lx = tx; lx < tx + textW; lx += 6) {
        ctx.beginPath();
        ctx.moveTo(lx, screenY);
        ctx.lineTo(lx, screenY + h);
        ctx.stroke();
      }
      ctx.restore();

      ctx.font = `500 20px 'Times New Roman', serif`;
      ctx.fillStyle = colors.h1;
      ctx.fillText(block.text, tx, screenY + 26);

      ctx.strokeStyle = `rgba(0,0,0,0.12)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx, screenY + h - 2);
      ctx.lineTo(tx + textW, screenY + h - 2);
      ctx.stroke();

    } else if (block.type === `h2`) {
      // Single-direction diagonal hatching behind h2
      ctx.save();
      ctx.beginPath();
      ctx.rect(tx, screenY, textW, h);
      ctx.clip();
      ctx.strokeStyle = `rgba(0,0,0,0.045)`;
      ctx.lineWidth = 1;
      for (let i = -h; i < textW + h; i += 9) {
        ctx.beginPath();
        ctx.moveTo(tx + i, screenY);
        ctx.lineTo(tx + i + h, screenY + h);
        ctx.stroke();
      }
      ctx.restore();

      ctx.font = `500 16px 'Times New Roman', serif`;
      ctx.fillStyle = colors.h2;
      ctx.fillText(block.text, tx, screenY + 20);

    } else if (block.type === `image`) {
      drawImageBlock(tx, screenY, textW, h, block.caption);
    } else if (block.type === `comment`) {
      drawCommentBlock(tx, screenY, textW, h, block.text, lineH);
    } else {
      ctx.font = `13px 'Times New Roman', serif`;
      ctx.fillStyle = colors.body;
      wrapText(ctx, block.text, tx, screenY + lineH, textW, lineH);
    }
  }

  ctx.restore();
}).start();

function drawImageBlock(x, y, w, h, caption) {
  const { colors } = settings;

  // Background
  ctx.fillStyle = colors.imageBg;
  ctx.fillRect(x, y, w, h);

  // Diagonal linen texture — clipped to block
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = colors.imageLine;
  ctx.lineWidth = 1;
  const spacing = 9;
  for (let i = -h; i < w + h; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + h, y + h);
    ctx.stroke();
  }
  // Second set of diagonals at 90° to the first, creating a crosshatch
  for (let i = -h; i < w + h; i += spacing * 2) {
    ctx.beginPath();
    ctx.moveTo(x + i + h, y);
    ctx.lineTo(x + i, y + h);
    ctx.stroke();
  }
  ctx.restore();

  // Photo icon placeholder in the centre
  const cx = x + w / 2;
  const cy = y + h / 2 - 10;
  ctx.strokeStyle = colors.imageIcon;
  ctx.lineWidth = 1.5;
  // Outer frame
  ctx.strokeRect(cx - 24, cy - 18, 48, 34);
  // Mountain silhouette
  ctx.beginPath();
  ctx.moveTo(cx - 18, cy + 10);
  ctx.lineTo(cx - 6, cy - 4);
  ctx.lineTo(cx + 2, cy + 4);
  ctx.lineTo(cx + 10, cy - 8);
  ctx.lineTo(cx + 18, cy + 10);
  ctx.closePath();
  ctx.fillStyle = `rgba(0,0,0,0.1)`;
  ctx.fill();
  ctx.stroke();
  // Sun circle
  ctx.beginPath();
  ctx.arc(cx - 12, cy - 6, 4, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0,0,0,0.08)`;
  ctx.fill();
  ctx.stroke();

  // Caption below the image area
  if (caption) {
    ctx.font = `italic 11px 'Times New Roman', serif`;
    ctx.fillStyle = `rgba(0,0,0,0.4)`;
    ctx.textAlign = `center`;
    ctx.fillText(caption, cx, y + h - 10);
    ctx.textAlign = `left`;
  }
}

function drawCommentBlock(x, y, w, h, text, lineH) {
  const { colors } = settings;

  // Warm background
  ctx.fillStyle = colors.commentBg;
  ctx.fillRect(x, y, w, h);

  // Subtle horizontal ruled-line texture
  ctx.strokeStyle = colors.commentLine;
  ctx.lineWidth = 1;
  for (let ly = y + lineH; ly < y + h - 4; ly += lineH) {
    ctx.beginPath();
    ctx.moveTo(x + 10, ly);
    ctx.lineTo(x + w, ly);
    ctx.stroke();
  }

  // Left accent border
  ctx.fillStyle = colors.commentAccent;
  ctx.fillRect(x, y, 3, h);

  // Italic text indented past the border
  ctx.font = `italic 12px 'Times New Roman', serif`;
  ctx.fillStyle = colors.commentText;
  wrapText(ctx, text, x + 14, y + lineH, w - 18, lineH);
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  // split text into lines
  const words = text.split(` `);
  const lines = [];
  let current = [];

  for (const word of words) {
    const test = [ ...current, word ].join(` `);
    if (ctx.measureText(test).width > maxW && current.length > 0) {
      lines.push(current);
      current = [ word ];
    } else {
      current.push(word);
    }
  }
  if (current.length > 0) lines.push(current);

  // justify all lines except the last
  for (let i = 0; i < lines.length; i++) {
    const lineWords = lines[i];
    const isLast = i === lines.length - 1;

    if (isLast || lineWords.length === 1) {
      ctx.fillText(lineWords.join(` `), x, y);
    } else {
      const totalWordW = lineWords.reduce((sum, w) => sum + ctx.measureText(w).width, 0);
      const gap = (maxW - totalWordW) / (lineWords.length - 1);
      let wx = x;
      for (const word of lineWords) {
        ctx.fillText(word, wx, y);
        wx += ctx.measureText(word).width + gap;
      }
    }

    y += lineH;
  }
}

function updateDebug(e) {
  const { activeBlock, contentOffset } = state;
  const z = activeBlock ? activeBlock.zone.label : `—`;
  const t = activeBlock ? activeBlock.block.type : `—`;
  debug.textContent =
    `type: ${e.pointerType}  |  ` + `content-type: ${t}  |  ` + `zone: ${z}  |  `;
}
