import { Forces }      from "@ixfx/modulation.js";
import { continuously } from "@ixfx/flow.js";
import { clamp, interpolate } from "@ixfx/numbers.js";
import { Easings } from "@ixfx/modulation.js";

// ── CONTENT ──────────────────────────────────────────────────────────────
const PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed ipsum metus. Quisque eleifend consectetur mollis. Proin eu tortor magna. Suspendisse potenti. Praesent cursus urna ac aliquam pharetra. Duis ac elit id tellus volutpat pharetra non eu velit. Sed aliquet vitae dui eget laoreet. Mauris aliquet maximus commodo. Pellentesque pulvinar nisl quis libero sollicitudin, quis sollicitudin nisi ornare. Fusce sed lacus nulla. Suspendisse vitae odio scelerisque lacus laoreet tincidunt. Duis lobortis non nisi et placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "FSed faucibus maximus magna, quis ultrices mi consectetur quis. Nullam eget mi porttitor, aliquet sem vel, tincidunt massa. Nam commodo et velit nec tempor. Donec ut diam imperdiet, feugiat sem eu, semper quam. In dolor augue, egestas convallis nulla sed, ullamcorper sodales sapien. Nullam elit ligula, suscipit nec libero id, consectetur viverra nulla. Curabitur sit amet ipsum eget tortor ullamcorper fermentum vel a augue. Suspendisse id laoreet eros. Donec sit amet lectus et orci egestas congue. Proin mattis aliquet ipsum eu rhoncus. Sed vitae erat vel elit ultrices pharetra sed a ante. Vivamus nunc velit, egestas at neque eu, dictum semper justo. Ut ex ligula, sodales auctor imperdiet sed, ullamcorper nec massa. Etiam blandit nisi ac enim tincidunt facilisis. Praesent dignissim dolor non mi consectetur, sed molestie nulla consectetur. Aenean eu odio porttitor, rutrum quam nec, tempor lacus.",
  "Vestibulum ut nibh feugiat, porta tellus gravida, lobortis odio. Nam tristique feugiat metus a volutpat. Sed sit amet malesuada tortor. Nulla nec enim eget elit sollicitudin efficitur. Sed ac vulputate quam, ut ullamcorper enim. In tincidunt lorem felis, quis semper mi feugiat maximus. Vivamus velit ante, ultrices sed felis ac, pretium sodales lectus. Etiam elementum eros a justo convallis fermentum. Nam dui justo, varius vel erat a, suscipit bibendum dolor. Quisque sed tortor in odio condimentum maximus. Phasellus finibus arcu vitae orci euismod, vel viverra turpis molestie.",
];

// ── TOOLS ────────────────────────────────────────────────────────────────
// Each tool has different physics AND only perceives its own boundary level.
// Fine   → feels every word edge   (many snap points, tight radius)
// Medium → feels sentence endings  (fewer, wider radius)
// Broad  → feels paragraph ends    (very few, very wide radius)
const TOOLS = [
  {
    id:           "fine",
    label:        "1 · Fine",
    note:         "feels every word boundary",
    boundaryKey:  "word",
    edgeRadius:   16,
    snapStrength: 0.55,
    frictionNear: 0.28,
    frictionFar:  0.03,
    color:        "#2255ee",
  },
  {
    id:           "medium",
    label:        "2 · Medium",
    note:         "feels sentence endings only",
    boundaryKey:  "sentence",
    edgeRadius:   55,
    snapStrength: 0.45,
    frictionNear: 0.20,
    frictionFar:  0.03,
    color:        "#2255ee",
  },
  {
    id:           "broad",
    label:        "3 · Broad",
    note:         "feels paragraph ends only",
    boundaryKey:  "paragraph",
    edgeRadius:   120,
    snapStrength: 0.35,
    frictionNear: 0.14,
    frictionFar:  0.03,
    color:        "#2255ee",
  },
];

let toolIndex = 0;

// ── SETTINGS ─────────────────────────────────────────────────────────────
const settings = {
  targetDiminish: 0.05,
  fontsize:       16,
  fontFamily:     "Georgia, serif",
  lineHeight:     1.75,
  paragraphGap:   20,
  padding:        52,
  highlightColor: "rgba(80,140,255,0.22)",
  textColor:      "#1a1a1a",
  btnY:           24,   // top of tool-button strip
  btnH:           36,
  btnW:           130,
  btnGap:         10,
};

// ── STATE ─────────────────────────────────────────────────────────────────
const state = {
  dpr:         1,
  cssW:        0,
  cssH:        0,
  dragging:      false,
  /** @type {number|null} */
  selectStart:   null,
  /** @type {number|null} */
  selectStartY:  null,
  targetX:       0,
  pointerY:      0,
  /** @type {{ word: string, x: number, y: number, width: number, height: number, isSentenceEnd: boolean, isParaEnd: boolean, pi: number }[]} */
  words:       [],
  // Per-line boundary sets: [{ word, sentence, paragraph, y }, ...]
  /** @type {{ word: number[], sentence: number[], paragraph: number[], y: number }[]} */
  boundaries:  [],
};

let cursor = { position: { x: 0.5, y: 0.5 }, mass: 1 };

const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");
const debug  = document.getElementById("debug");

// ── LAYOUT ────────────────────────────────────────────────────────────────
// Lay out all words, tag each with paragraph/sentence metadata,
// and compute the three boundary sets in one pass.
function layoutWords() {
  const { fontsize, fontFamily, lineHeight, paragraphGap, padding, btnY, btnH } = settings;
  ctx.font = `${fontsize}px ${fontFamily}`;
  const spaceW = ctx.measureText(" ").width;
  const lineH  = fontsize * lineHeight;
  const maxW   = state.cssW - padding * 2;

  state.words      = [];
  state.boundaries = [];
  const sort = s => [...s].sort((a, b) => a - b);

  // lineMap: y → { wb, sb, pb } — one entry per rendered line
  /** @type {Map<number, { wb: Set<number>, sb: Set<number>, pb: Set<number> }>} */
  const lineMap = new Map();
  const getLine = (/** @type {number} */ lineY) => {
    if (!lineMap.has(lineY)) lineMap.set(lineY, { wb: new Set(), sb: new Set(), pb: new Set() });
    return /** @type {{ wb: Set<number>, sb: Set<number>, pb: Set<number> }} */ (lineMap.get(lineY));
  };

  // Start below the button strip
  let y = btnY + btnH + 52;

  for (let pi = 0; pi < PARAGRAPHS.length; pi++) {
    if (pi > 0) y += lineH + paragraphGap;
    let x = padding;
    const rawWords = PARAGRAPHS[pi].split(" ");

    for (let wi = 0; wi < rawWords.length; wi++) {
      const word = rawWords[wi];
      const w    = ctx.measureText(word).width;

      // Wrap to next line if needed
      if (x + w > padding + maxW && x !== padding) {
        x  = padding;
        y += lineH;
      }

      const isSentenceEnd = /[.!?]$/.test(word);
      const isParaEnd     = wi === rawWords.length - 1;

      state.words.push({ word, x, y, width: w, height: fontsize, isSentenceEnd, isParaEnd, pi });

      const line = getLine(y);
      line.wb.add(Math.round(x));
      line.wb.add(Math.round(x + w));
      if (isSentenceEnd) line.sb.add(Math.round(x + w));
      if (isParaEnd)     line.pb.add(Math.round(x + w));

      x += w + spaceW;
    }
  }

  // Convert lineMap to sorted array
  state.boundaries = [...lineMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([lineY, { wb, sb, pb }]) => ({
      word:      sort(wb),
      sentence:  sort(sb),
      paragraph: sort(pb),
      y:         lineY,
    }));
}

// ── RESIZE ────────────────────────────────────────────────────────────────
function resize() {
  state.dpr  = window.devicePixelRatio || 1;
  state.cssW = window.innerWidth;
  state.cssH = window.innerHeight - (debug.offsetHeight || 28);

  canvas.width        = Math.floor(state.cssW * state.dpr);
  canvas.height       = Math.floor(state.cssH * state.dpr);
  canvas.style.width  = state.cssW  + "px";
  canvas.style.height = state.cssH + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);
  layoutWords();
}

// ── NEAREST BOUNDARY ─────────────────────────────────────────────────────
function nearestBoundary(lx, boundaries) {
  let best = null, bestDist = Infinity;
  for (const bx of boundaries) {
    const d = Math.abs(lx - bx);
    if (d < bestDist) { bestDist = d; best = bx; }
  }
  return { boundary: best, dist: bestDist };
}

function nearestLine(py) {
  const lines = [...new Set(state.words.map(w => w.y))];
  return lines.reduce((best, lineY) =>
    Math.abs(lineY - py) < Math.abs(best - py) ? lineY : best
  , lines[0]);
}

// Returns the boundary set for whichever line is closest to py.
function getLineBounds(py) {
  let best = state.boundaries[0];
  let bestDist = Infinity;
  for (const b of state.boundaries) {
    const dist = Math.abs(py - b.y);
    if (dist < bestDist) { bestDist = dist; best = b; }
  }
  return best;
}

// ── INPUT ─────────────────────────────────────────────────────────────────
function toolFromTilt(/** @type {number} */ tiltX, /** @type {number} */ tiltY) {
  const magnitude = Math.sqrt(tiltX * tiltX + tiltY * tiltY);
  const normalized = clamp(magnitude / 90, 0, 1);
  // more angled (high tilt) → fine (0), upright (low tilt) → broad (2)
  return Math.min(Math.floor((1 - normalized) * TOOLS.length), TOOLS.length - 1);
}

canvas.addEventListener("pointerdown", e => {
  const { padding, btnY, btnH, btnW, btnGap } = settings;
  state.pointerY = e.offsetY;
  state.selectStart = e.offsetX;
  for (let i = 0; i < TOOLS.length; i++) {
    const bx = padding + i * (btnW + btnGap);
    if (e.offsetX >= bx && e.offsetX <= bx + btnW &&
        e.offsetY >= btnY && e.offsetY <= btnY + btnH) {
      toolIndex = i;
      return; // don't start a drag
    }
  }

  if (e.pointerType === "pen") toolIndex = toolFromTilt(e.tiltX, e.tiltY);

  canvas.setPointerCapture(e.pointerId);
  state.dragging     = true;
  state.targetX      = e.offsetX;
  state.selectStart  = e.offsetX;
  state.selectStartY = e.offsetY;
  cursor = { position: { x: e.offsetX / state.cssW, y: 0.5 }, mass: 1 };
});

canvas.addEventListener("pointermove", e => {
  if (state.dragging) {
    state.targetX = e.offsetX;
    state.pointerY = e.offsetY;
    if (e.pointerType === "pen") toolIndex = toolFromTilt(e.tiltX, e.tiltY);
  }
});

canvas.addEventListener("pointerup",     stopDrag);
canvas.addEventListener("pointercancel", stopDrag);
function stopDrag() { state.dragging = false; state.selectStart = null; state.selectStartY = null; }

// Keyboard shortcuts
window.addEventListener("keydown", e => {
  if (e.key === "1") toolIndex = 0;
  if (e.key === "2") toolIndex = 1;
  if (e.key === "3") toolIndex = 2;
});

// ── DRAW ──────────────────────────────────────────────────────────────────
function draw() {
  const { cssW, cssH, words, selectStart, dragging, targetX, boundaries } = state;
  const { fontsize, fontFamily, textColor, highlightColor,
          padding, targetDiminish, btnY, btnH, btnW, btnGap } = settings;
  const tool        = TOOLS[toolIndex];
  const paraB       = getLineBounds(state.pointerY);
  const activeBounds = paraB[tool.boundaryKey];

  // ── Physics ──
  if (dragging) {
    const cursorPx = cursor.position.x * cssW;
    const { boundary, dist } = nearestBoundary(cursorPx, activeBounds);

    const t      = clamp(dist / tool.edgeRadius, 0, 1);
    const smooth = Easings.Named.smoothstep(t); // 0 = on boundary, 1 = far

    const snapForce = {
      x: boundary !== null
        ? (1 - smooth) * ((boundary / cssW) - cursor.position.x) * tool.snapStrength
        : 0,
      y: 0,
    };

    const friction = Forces.velocityForce(
      interpolate(smooth, tool.frictionNear, tool.frictionFar),
      "dampen"
    );

    cursor = Forces.apply(
      cursor,
      Forces.targetForce({ x: targetX / cssW, y: 0.5 }, { diminishBy: targetDiminish }),
      snapForce,
      friction,
    );

    cursor = {
      ...cursor,
      position: { x: clamp(cursor.position.x, 0, 1), y: 0.5 },
    };
  }

  const cursorX = cursor.position.x * cssW;

  ctx.clearRect(0, 0, cssW, cssH);


  // ── Selection highlight ──
  ctx.font         = `${fontsize}px ${fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign    = "left";

  if (dragging && selectStart !== null && state.selectStartY !== null) {
    const startLineY   = nearestLine(state.selectStartY);
    const endLineY     = nearestLine(state.pointerY);
    const topLineY     = Math.min(startLineY, endLineY);
    const botLineY     = Math.max(startLineY, endLineY);
    const draggingDown = startLineY <= endLineY;
    const allLineYs    = [...new Set(words.map(w => w.y))].sort((a, b) => a - b);

    ctx.fillStyle = highlightColor;
    for (const lineY of allLineYs) {
      if (lineY < topLineY || lineY > botLineY) continue;
      const lw      = words.filter(w => w.y === lineY);
      if (!lw.length) continue;
      const last    = lw[lw.length - 1];
      const lineL   = lw[0].x;
      const lineR   = last.x + last.width;

      let hlL, hlR;
      if (lineY === startLineY && lineY === endLineY) {
        hlL = Math.min(selectStart, cursorX);
        hlR = Math.max(selectStart, cursorX);
      } else if (lineY === startLineY) {
        hlL = draggingDown ? selectStart : lineL;
        hlR = draggingDown ? lineR       : selectStart;
      } else if (lineY === endLineY) {
        hlL = draggingDown ? lineL   : cursorX;
        hlR = draggingDown ? cursorX : lineR;
      } else {
        hlL = lineL;
        hlR = lineR;
      }

      hlL = Math.max(hlL, lineL);
      hlR = Math.min(hlR, lineR);
      if (hlR > hlL) {
        ctx.fillRect(hlL, lineY - fontsize * 0.85, hlR - hlL, fontsize * 1.1);
      }
    }
  }

  // ── Words ──
  ctx.fillStyle = textColor;
  for (const w of words) ctx.fillText(w.word, w.x, w.y);

  // ── Cursor ──
  // Width scales with tool: fine = thin line, medium = band, broad = wide band.
  // This visually reinforces that a broader instrument averages over more surface.
  if (dragging) {
    const lineY      = nearestLine(state.pointerY);
    const lineWords  = words.filter(w => w.y === lineY);
    const hw         = 0;
    const topY       = lineY - fontsize * 0.85;
    const botY       = lineY + fontsize * 0.25;

    ctx.fillStyle   = tool.color + "28";
    ctx.fillRect(cursorX - hw, topY, hw * 2, botY - topY);

    ctx.strokeStyle = tool.color;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(cursorX - hw, topY); ctx.lineTo(cursorX - hw, botY);
    ctx.moveTo(cursorX + hw, topY); ctx.lineTo(cursorX + hw, botY);
    ctx.stroke();
  }

  // ── Debug ──
  const vel         = cursor.velocity?.x.toFixed(5) ?? "0";
  const { dist }    = nearestBoundary(cursorX, activeBounds);
  debug.textContent =
    `tool: ${tool.id}  |  cursorX ${Math.round(cursorX)}  |  ` +
    `vel.x ${vel}  |  nearest ${Math.round(dist)}px`;
}

window.addEventListener("resize", resize);
resize();
continuously(draw).start();