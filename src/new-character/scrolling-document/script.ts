import { continuously } from "@ixfx/flow";

const canvas = document.getElementById(`canvas`) as HTMLCanvasElement;
const ctx = canvas.getContext(`2d`)!;

const settings = {
  docMaxW: 580,
  docPadding: 90,
  lineH: 20,
  marginBefore: { h1: 10, h2: 36, body: 12, highlight: 16 },
  zones: {
    heavyHigh: {
      hitPadding: 40,
      apply(delta: number) {
        return delta * 0.1;
      },
    },
    heavyMed: {
      hitPadding: 20,
      apply(delta: number) {
        return delta * 0.45;
      },
    },
    smooth: {
      hitPadding: 0,
      apply(delta: number) {
        return delta * 2;
      },
    },
    heavyLow: {
      hitPadding: 30,
      apply(delta: number) {
        return delta * 0.25;
      },
    },
  },
  colors: {
    docBg: `#fafaf8`,
    pageBg: `#1a1a1a`,
    h1: `#111`,
    h2: `#222`,
    body: `#333`,
  },

  rawBlocks: [
    { type: `h1`, text: `Semantic Friction` },
    {
      type: `body`, segments: [
        { text: `Most digital interfaces treat all content the same, scrolling through a Word document feels identical whether you're passing over a title or a footnote. But in the physical world, things have different weights, textures, and resistances. Some things are harder to move past than others, and that difficulty carries information. This sketch asks what would happen if that was true digitally too. Headings and highlighted passages,` },
        { text: `content that carries more semantic meaning,`, highlight: true },
        { text: `requires more effort to drag while ordinary body text has no resistance. The hierarchy of the document becomes something you feel, not just read with your eyes. ` },
      ]
    },
    { type: `h2`, text: `Heading 2` },
    {
      type: `body`, segments: [
        { text: `Nam id felis nec neque gravida accumsan. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec rutrum lacinia ultricies. Vivamus lobortis tempus nunc at finibus. Vivamus aliquet vitae magna at convallis. Praesent sollicitudin massa sit amet egestas imperdiet. Duis eu velit hendrerit, finibus arcu a, tempus urna. ` },
        { text: `Vestibulum at orci vitae lorem consequat faucibus. Fusce consectetur varius condimentum.`, highlight: true },
        { text: ` Quisque finibus, arcu eu dignissim consectetur, justo est mollis leo, non feugiat orci nisl vitae elit. Proin ornare turpis augue, a lacinia ligula pretium a. In semper, orci nec vehicula pulvinar, sapien augue feugiat velit, ac semper odio odio quis lacus.` },
      ]
    },
    { type: `body`, text: `Donec tempor malesuada maximus. Integer vel lorem eu ante vulputate fringilla vel sit amet mi. Morbi sed odio dapibus, bibendum velit ut, tempor ex. Quisque in molestie sem, at varius mi. Etiam in feugiat metus. Fusce at augue sit amet nunc ultrices accumsan ac et lectus. Pellentesque est ex, ultrices vitae nulla at, ullamcorper interdum odio.` },
    { type: `h2`, text: `Heading 3` },
    { type: `body`, text: `Aenean eget porttitor nibh, eget sodales massa. Ut quis libero elit. Vivamus condimentum ac velit vitae molestie. Quisque tincidunt volutpat ipsum sit amet faucibus. Curabitur ullamcorper risus ac leo mattis, id ultrices arcu tincidunt. Vivamus et egestas libero, vel mollis felis. Nunc efficitur ligula quis libero posuere pharetra. Donec at enim dolor. Maecenas rutrum egestas mollis. Quisque eu elit lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.` },
    { type: `body`, text: `Fusce mattis, ligula sit amet ullamcorper ultricies, lacus tortor viverra ante, dapibus ultrices nulla nibh semper quam. Cras a magna nulla. Vivamus porttitor nulla felis, ac tristique tellus consectetur sit amet. Praesent fringilla molestie velit ac pellentesque. Etiam dignissim et odio nec pharetra. Vivamus felis tortor, consectetur commodo commodo id, dapibus quis elit. Nam non magna hendrerit, fringilla tellus vitae, finibus felis. Integer accumsan, nunc in elementum facilisis, nunc enim rhoncus tellus, vel fringilla justo metus vel sapien.` },
    { type: `h2`, text: `Heading 4` },
    {
      type: `body`, segments: [
        { text: `Duis id diam a tellus tincidunt imperdiet ac non enim. Aliquam imperdiet tortor vel arcu tincidunt mollis. Morbi vel nisi vitae urna ultrices fringilla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam mi orci, facilisis vel rhoncus eget, mollis sed enim. Phasellus sed magna tempus, lobortis lorem non, aliquam arcu. Etiam ut porttitor purus. Quisque at mollis ipsum, nec laoreet nisl. ` },
        { text: `Nulla facilisi. Maecenas sit amet risus non nibh bibendum volutpat. Vestibulum nisl libero, porta vel elit non, dignissim suscipit leo.`, highlight: true },
        { text: ` Nullam ac bibendum augue. Ut nisi dolor, luctus ac nisi vitae, facilisis sodales sapien. Aliquam vitae risus est. Morbi blandit urna eu magna volutpat maximus.` },
      ]
    },
    { type: `body`, text: `Fusce sit amet nunc sit amet mi efficitur congue. Morbi sapien sem, egestas eu est eu, vehicula facilisis elit. Phasellus gravida ullamcorper velit. In ut nisi quis risus lacinia elementum at vel lacus. Etiam id sem ac tortor consectetur interdum a sit amet lorem. Curabitur egestas massa ut orci tempus condimentum. Duis vitae sollicitudin odio. Nunc rhoncus dui sed dui pellentesque, non maximus lectus dictum.` },
    { type: `h2`, text: `Heading 5` },
    { type: `body`, text: `Vivamus sodales porta magna, in rutrum quam consectetur sit amet. Curabitur maximus, quam vel feugiat viverra, mauris risus tincidunt odio, eu porttitor mi urna sit amet augue. Nunc euismod tempor dui ac lacinia. Cras blandit sem eget molestie bibendum. Fusce nec mattis metus, a pretium velit. Quisque est risus, ultrices dapibus dolor non, congue tincidunt metus. Vestibulum facilisis sollicitudin sapien, at aliquet felis finibus eu. In tempor euismod elementum. Pellentesque ac libero ut eros viverra pharetra ut non arcu. Etiam nec feugiat massa. Nam eget elementum nibh, at tincidunt dolor.` },
  ],
} as const;

let state = {
  dpr: window.devicePixelRatio || 1,
  cssWidth: 0,
  cssHeight: 0,
  contentOffset: 0,
  isScrolling: false,
  lastY: /** @type {number|null} */ (null),
  activeZone: settings.zones.smooth,
  activeBlock: /** @type {any} */ (null),
  layout: /** @type {any[]} */ ([]),
  contentTotalH: 0,
};

const saveState = (patch: Partial<typeof state>) => {
  state = { ...state, ...patch };
};

function zoneForType(type: string) {
  if (type === `h1`) return settings.zones.heavyHigh;
  if (type === `h2`) return settings.zones.heavyMed;
  if (type === `highlight`) return settings.zones.heavy;
  return settings.zones.smooth;
}

function countWrappedLines(text: string, maxW: number) {
  const words = text.split(` `);
  let lines = 0;
  let current = [];
  for (const word of words) {
    const test = [ ...current, word ].join(` `);
    if (ctx.measureText(test).width > maxW && current.length > 0) {
      lines++;
      current = [ word ];
    } else {
      current.push(word);
    }
  }
  if (current.length > 0) lines++;
  return lines;
}

function buildLayout(docW: number) {
  const { docPadding, lineH, marginBefore, rawBlocks } = settings;
  const textW = docW - docPadding * 2;
  const layout = [];
  let y = 24;

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[ i ];

    if (i > 0) y += marginBefore[ block.type ] ?? 12;

    let h;
    if (block.type === `h1`) {
      h = 36;
    } else if (block.type === `h2`) {
      h = 28;
    } else {
      const fullText = block.segments
        ? block.segments.map(s => s.text).join(``)
        : block.text;
      ctx.font = `13px 'Times New Roman', serif`;
      const lines = countWrappedLines(fullText, textW);
      h = lines * lineH + 20;
    }
    const highlightZones = block.segments
      ? computeHighlightZones(block.segments, textW, lineH, y)
      : null;
    layout.push({ block, zone: zoneForType(block.type), y, h, highlightZones });
    y += h;
  }

  saveState({ layout, contentTotalH: y + 40 });
}

function computeHighlightZones(segments, maxW: number, lineH: number, blockDocY: number) {
  const tokens = [];
  for (const seg of segments) {
    for (const word of seg.text.split(` `).filter(w => w.length > 0)) {
      tokens.push({ word, highlight: seg.highlight || false });
    }
  }

  const lines = [];
  let current = [];
  for (const token of tokens) {
    const testW = ctx.measureText([ ...current, token ].map(t => t.word).join(` `)).width;
    if (testW > maxW && current.length > 0) { lines.push(current); current = [ token ]; }
    else current.push(token);
  }
  if (current.length > 0) lines.push(current);

  const zones = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[ i ].some(t => t.highlight)) {
      zones.push({ y: blockDocY + (i + 1) * lineH, h: lineH });
    }
  }
  return zones;
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = window.innerWidth;
  const cssHeight = window.innerHeight;
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  canvas.style.width = `${ cssWidth }px`;
  canvas.style.height = `${ cssHeight }px`;
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

  let newActiveBlock = null;
  let newActiveZone = activeZone;

  for (const item of layout) {
    const pad = item.zone.hitPadding;
    if (pad > 0 && docY >= item.y - pad && docY < item.y + item.h + pad) {
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

  if (newActiveBlock?.highlightZones) {
    for (const hz of newActiveBlock.highlightZones) {
      if (docY >= hz.y && docY < hz.y + hz.h) {
        newActiveZone = settings.zones.heavyLow;
        break;
      }
    }
  }

  const patch: Partial<typeof state> = {
    activeBlock: newActiveBlock,
    activeZone: newActiveZone,
  };

  if (isScrolling && lastY !== null) {
    const delta = e.offsetY - lastY;
    patch.lastY = e.offsetY;
    patch.contentOffset = clampOffset(contentOffset + newActiveZone.apply(-delta));
  }

  saveState(patch)
});

canvas.addEventListener(`pointerup`, stopScroll);
canvas.addEventListener(`pointercancel`, stopScroll);
function stopScroll() {
  saveState({ isScrolling: false, lastY: null });
}

function clampOffset(v: number) {
  const { contentTotalH, cssHeight } = state;
  return Math.max(0, Math.min(contentTotalH - cssHeight, v));
}

const docW = () => Math.min(settings.docMaxW, state.cssWidth - 40);
const docX = () => (state.cssWidth - docW()) / 2;

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
      ctx.font = `bold 24px 'Times New Roman', serif`;
      ctx.fillStyle = colors.h1;
      ctx.fillText(block.text, tx, screenY + 26);

    } else if (block.type === `h2`) {
      ctx.font = `bold 16px 'Times New Roman', serif`;
      ctx.fillStyle = colors.h2;
      ctx.fillText(block.text, tx, screenY + 20);

    } else {
      ctx.font = `13px 'Times New Roman', serif`;
      ctx.fillStyle = colors.body;
      if (block.segments) {
        wrapSegments(ctx, block.segments, tx, screenY + lineH, textW, lineH);
      } else {
        wrapText(ctx, block.text, tx, screenY + lineH, textW, lineH);
      }
    }
  }

  ctx.restore();
}).start();

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number, highlightColor: string | null = null) {
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

  for (let i = 0; i < lines.length; i++) {
    const lineWords = lines[ i ];
    const isLast = i === lines.length - 1;

    if (highlightColor) {
      const lineW = isLast
        ? ctx.measureText(lineWords.join(` `)).width
        : maxW;
      ctx.fillStyle = highlightColor;
      ctx.fillRect(x - 1, y - lineH + 5, lineW + 2, lineH - 2);
      ctx.fillStyle = `#333`;
    }

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

function wrapSegments(ctx: CanvasRenderingContext2D, segments, x: number, y: number, maxW: number, lineH: number) {
  const tokens = [];
  for (const seg of segments) {
    const words = seg.text.split(` `).filter(w => w.length > 0);
    for (const word of words) {
      tokens.push({ word, highlight: seg.highlight || false });
    }
  }

  const lines = [];
  let current = [];
  for (const token of tokens) {
    const testW = ctx.measureText([ ...current, token ].map(t => t.word).join(` `)).width;
    if (testW > maxW && current.length > 0) {
      lines.push(current);
      current = [ token ];
    } else {
      current.push(token);
    }
  }
  if (current.length > 0) lines.push(current);

  for (let i = 0; i < lines.length; i++) {
    const lineTokens = lines[ i ];
    const isLast = i === lines.length - 1;

    const totalWordW = lineTokens.reduce((sum, t) => sum + ctx.measureText(t.word).width, 0);
    const gap = (isLast || lineTokens.length === 1)
      ? ctx.measureText(` `).width
      : (maxW - totalWordW) / (lineTokens.length - 1);

    let wx = x;
    for (const token of lineTokens) {
      const tw = ctx.measureText(token.word).width;
      if (token.highlight) {
        ctx.fillStyle = `rgba(255, 251, 0, 0.5)`;
        ctx.fillRect(wx - 1, y - lineH + 5, tw + gap + 2, lineH - 2);
      }
      wx += tw + gap;
    }

    wx = x;
    ctx.fillStyle = `#333`;
    for (const token of lineTokens) {
      ctx.fillText(token.word, wx, y);
      wx += ctx.measureText(token.word).width + gap;
    }

    y += lineH;
  }
};