import { Forces, Easings } from "@ixfx/modulation.js";
import { continuously } from "@ixfx/flow.js";
import { clamp, interpolate } from "@ixfx/numbers.js";

const settings = {
  targetDiminish: 0.05,
  fontsize: 18,
  fontFamily: "Times New Roman, serif",
  lineHeight: 1.75,
  paragraphGap: 20,
  padding: 52,
  highlightColor: "rgba(80,140,255,0.22)",
  caretColot: "#2255ee",
  textColor: "#1a1a1a",
  btnY: 24,
  btnH: 36,
  btnW: 130,
  btnGap: 10,
  paragraphs: [
    "Drag to select text. The cursor snaps to linguistic boundaries: in fine mode, every word edge acts as a bump; in medium, only sentence ends; in broad, only paragraph breaks. The text and its structure stay the same, but the resolution of what you feel changes.",
    "Sed faucibus maximus magna, quis ultrices mi consectetur quis. Nullam eget mi porttitor, aliquet sem vel, tincidunt massa. Nam commodo et velit nec tempor. Donec ut diam imperdiet, feugiat sem eu, semper quam. In dolor augue, egestas convallis nulla sed, ullamcorper sodales sapien. Nullam elit ligula, suscipit nec libero id, consectetur viverra nulla. Curabitur sit amet ipsum eget tortor ullamcorper fermentum vel a augue. Suspendisse id laoreet eros. Donec sit amet lectus et orci egestas congue. Proin mattis aliquet ipsum eu rhoncus. Sed vitae erat vel elit ultrices pharetra sed a ante. Vivamus nunc velit, egestas at neque eu, dictum semper justo. Ut ex ligula, sodales auctor imperdiet sed, ullamcorper nec massa. Etiam blandit nisi ac enim tincidunt facilisis. Praesent dignissim dolor non mi consectetur, sed molestie nulla consectetur. Aenean eu odio porttitor, rutrum quam nec, tempor lacus.",
    "Vestibulum ut nibh feugiat, porta tellus gravida, lobortis odio. Nam tristique feugiat metus a volutpat. Sed sit amet malesuada tortor. Nulla nec enim eget elit sollicitudin efficitur. Sed ac vulputate quam, ut ullamcorper enim. In tincidunt lorem felis, quis semper mi feugiat maximus. Vivamus velit ante, ultrices sed felis ac, pretium sodales lectus. Etiam elementum eros a justo convallis fermentum. Nam dui justo, varius vel erat a, suscipit bibendum dolor. Quisque sed tortor in odio condimentum maximus. Phasellus finibus arcu vitae orci euismod, vel viverra turpis molestie.",
  ],
  tools: [
    {
      id: "fine",
      boundaryKey: "word",
      edgeRadius: 16,
      snapStrength: 0.90,
      frictionNear: 0.30,
      frictionFar: 0.03,
    },
    {
      id: "medium",
      boundaryKey: "sentence",
      edgeRadius: 55,
      snapStrength: 0.45,
      frictionNear: 0.20,
      frictionFar: 0.03,
    },
    {
      id: "broad",
      boundaryKey: "paragraph",
      edgeRadius: 120,
      snapStrength: 0.35,
      frictionNear: 0.14,
      frictionFar: 0.03,
    },
  ],
};

const state = {
  dpr: 1,
  cssW: 0,
  cssH: 0,
  dragging: false,
  /** @type {number|null} */
  selectStart: null,
  /** @type {number|null} */
  selectStartY: null,
  targetX: 0,
  pointerY: 0,
  toolIndex: 0,
  cursor: { position: { x: 0.5, y: 0.5 }, mass: 1 },
  /** @type {{ word: string, x: number, y: number, width: number, height: number, isSentenceEnd: boolean, isParaEnd: boolean, pi: number }[]} */
  words: [],
  // per-line boundary sets
  /** @type {{ word: number[], sentence: number[], paragraph: number[], y: number }[]} */
  boundaries: [],
};

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
const debug = /** @type {HTMLElement} */ (document.getElementById("debug"));


function layoutWords() {
  const { fontsize, fontFamily, lineHeight, paragraphGap, padding, btnY, btnH } = settings;
  ctx.font = `${fontsize}px ${fontFamily}`;
  const spaceW = ctx.measureText(" ").width;
  const lineH = fontsize * lineHeight;
  const maxW = state.cssW - padding * 2;

  state.words = [];
  state.boundaries = [];
  const sort = s => [...s].sort((a, b) => a - b);

  /** @type {Map<number, { wb: Set<number>, sb: Set<number>, pb: Set<number> }>} */
  const lineMap = new Map();
  const getLine = (/** @type {number} */ lineY) => {
    if (!lineMap.has(lineY)) lineMap.set(lineY, { wb: new Set(), sb: new Set(), pb: new Set() });
    return /** @type {{ wb: Set<number>, sb: Set<number>, pb: Set<number> }} */ (lineMap.get(lineY));
  };

  let y = btnY + btnH + 30;  // start below the button strip

  for (let pi = 0; pi < settings.paragraphs.length; pi++) {
    if (pi > 0) y += lineH + paragraphGap;
    let x = padding;
    const rawWords = settings.paragraphs[pi].split(" ");

    for (let wi = 0; wi < rawWords.length; wi++) {
      const word = rawWords[wi];
      const w = ctx.measureText(word).width;

      if (x + w > padding + maxW && x !== padding) {
        x = padding;
        y += lineH;
      }

      const isSentenceEnd = /[.!?]$/.test(word);
      const isParaEnd = wi === rawWords.length - 1;

      state.words.push({ word, x, y, width: w, height: fontsize, isSentenceEnd, isParaEnd, pi });

      const line = getLine(y);
      line.wb.add(Math.round(x));
      line.wb.add(Math.round(x + w));
      if (isSentenceEnd) line.sb.add(Math.round(x + w));
      if (isParaEnd) line.pb.add(Math.round(x + w));

      x += w + spaceW;
    }
  }

  state.boundaries = [...lineMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([lineY, { wb, sb, pb }]) => ({
      word: sort(wb),
      sentence: sort(sb),
      paragraph: sort(pb),
      y: lineY,
    }));
}

function resize() {
  state.dpr = window.devicePixelRatio || 1;
  state.cssW = canvas.clientWidth;
  state.cssH = canvas.clientHeight;

  canvas.width = Math.floor(state.cssW * state.dpr);
  canvas.height = Math.floor(state.cssH * state.dpr);
  canvas.style.width = state.cssW + "px";
  canvas.style.height = state.cssH + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);
  layoutWords();
}

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

function getLineBounds(py) {
  let best = state.boundaries[0];
  let bestDist = Infinity;
  for (const b of state.boundaries) {
    const dist = Math.abs(py - b.y);
    if (dist < bestDist) { bestDist = dist; best = b; }
  }
  return best;
}

canvas.addEventListener("pointerdown", e => {
  const { padding, btnY, btnH, btnW, btnGap } = settings;
  state.pointerY = e.offsetY;
  state.selectStart = e.offsetX;
  for (let i = 0; i < settings.tools.length; i++) {
    const bx = padding + i * (btnW + btnGap);
    if (e.offsetX >= bx && e.offsetX <= bx + btnW &&
        e.offsetY >= btnY && e.offsetY <= btnY + btnH) {
      state.toolIndex = i;
      return;
    }
  }

  canvas.setPointerCapture(e.pointerId);
  state.dragging = true;
  state.targetX = e.offsetX;
  state.selectStart = e.offsetX;
  state.selectStartY = e.offsetY;
  state.cursor = { position: { x: e.offsetX / state.cssW, y: 0.5 }, mass: 1 };
});

canvas.addEventListener("pointermove", e => {
  if (state.dragging) {
    state.targetX = e.offsetX;
    state.pointerY = e.offsetY;
  }
});

canvas.addEventListener("pointerup", stopDrag);
canvas.addEventListener("pointercancel", stopDrag);
function stopDrag() { state.dragging = false; state.selectStart = null; state.selectStartY = null; }


const toolBtns = /** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll(".tool-btn"));
function updateToolButtons() {
  toolBtns.forEach(btn => btn.classList.toggle("active", Number(btn.dataset.tool) === state.toolIndex));
}
toolBtns.forEach(btn => btn.addEventListener("pointerdown", e => {
  e.stopPropagation();
  state.toolIndex = Number(btn.dataset.tool);
  updateToolButtons();
}));
updateToolButtons();

// draw
function draw() {
  const { cssW, cssH, words, selectStart, dragging, targetX } = state;
  const { fontsize, fontFamily, textColor, highlightColor, padding, targetDiminish } = settings;
  const tool = settings.tools[state.toolIndex];
  const activeBounds = getLineBounds(state.pointerY)[tool.boundaryKey];

  // physics
  if (dragging) {
    const cursorPx = state.cursor.position.x * cssW;
    const { boundary, dist } = nearestBoundary(cursorPx, activeBounds);

    const t = clamp(dist / tool.edgeRadius, 0, 1);
    const smooth = Easings.Named.smoothstep(t);  
    
    const snapForce = {
      x: boundary !== null
        ? (1 - smooth) * ((boundary / cssW) - state.cursor.position.x) * tool.snapStrength
        : 0,
      y: 0,
    };

    const friction = Forces.velocityForce(
      interpolate(smooth, tool.frictionNear, tool.frictionFar),
      "dampen"
    );

    state.cursor = /** @type {typeof state.cursor} */ (Forces.apply(
      state.cursor,
      Forces.targetForce({ x: targetX / cssW, y: 0.5 }, { diminishBy: targetDiminish }),
      snapForce,
      friction,
    ));

    state.cursor = {
      ...state.cursor,
      position: { x: clamp(state.cursor.position.x, 0, 1), y: 0.5 },
    };
  }

  const cursorX = state.cursor.position.x * cssW;

  ctx.clearRect(0, 0, cssW, cssH);

  ctx.font = `${fontsize}px ${fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  if (dragging && selectStart !== null && state.selectStartY !== null) {
    const startLineY = nearestLine(state.selectStartY);
    const endLineY = nearestLine(state.pointerY);
    const topLineY = Math.min(startLineY, endLineY);
    const botLineY = Math.max(startLineY, endLineY);
    const draggingDown = startLineY <= endLineY;
    const allLineYs = [...new Set(words.map(w => w.y))].sort((a, b) => a - b);

    ctx.fillStyle = highlightColor;
    for (const lineY of allLineYs) {
      if (lineY < topLineY || lineY > botLineY) continue;
      const lw = words.filter(w => w.y === lineY);
      if (!lw.length) continue;
      const last = lw[lw.length - 1];
      const lineL = lw[0].x;
      const lineR = last.x + last.width;

      let hlL, hlR;
      if (lineY === startLineY && lineY === endLineY) {
        hlL = Math.min(selectStart, cursorX);
        hlR = Math.max(selectStart, cursorX);
      } else if (lineY === startLineY) {
        hlL = draggingDown ? selectStart : lineL;
        hlR = draggingDown ? lineR : selectStart;
      } else if (lineY === endLineY) {
        hlL = draggingDown ? lineL : cursorX;
        hlR = draggingDown ? cursorX : lineR;
      } else {
        hlL = lineL;
        hlR = lineR;
      }

      hlL = Math.max(hlL, lineL);
      hlR = Math.min(hlR, lineR);
      if (hlR > hlL) ctx.fillRect(hlL, lineY - fontsize * 0.85, hlR - hlL, fontsize * 1.1);
    }
  }

  ctx.fillStyle = textColor;
  for (const w of words) ctx.fillText(w.word, w.x, w.y);

  if (dragging) {
    const lineY = nearestLine(state.pointerY);
    const topY = lineY - fontsize * 0.85;
    const botY = lineY + fontsize * 0.25;

    ctx.strokeStyle = settings.caretColot;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cursorX, topY);
    ctx.lineTo(cursorX, botY);
    ctx.stroke();
  }

  const { dist } = nearestBoundary(cursorX, activeBounds);
  debug.textContent = `tool: ${tool.id}  |  cursorX ${Math.round(cursorX)}  |  nearest ${Math.round(dist)}px`;
}

window.addEventListener("resize", resize);
resize();
continuously(draw).start();
