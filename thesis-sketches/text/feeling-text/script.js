import { Forces }      from "@ixfx/modulation.js";
import { continuously } from "@ixfx/flow.js";
import { clamp, interpolate } from "@ixfx/numbers.js";
import { Easings } from "@ixfx/modulation.js";

// SETTINGS
const settings = {
  // Forces tuning
  targetDiminish: 0.05,  // how fast cursor chases pointer
  snapStrength:   0.5,   // pull toward nearest word boundary
  edgeRadius:     20,    // zone around a boundary where snap activates
  frictionNear:   0.25,   // friction right at a boundary
  frictionFar:    0.03,  // friction in free space
  // Visual
  text:           "The quick brown fox jumps over the lazy dog",
  fontsize:       48,
  fontFamily:     "serif",
  lineHeight:     1.4,
  highlightColor: "rgba(80, 140, 255, 0.35)",
  textColor:      "#111",
  cursorColor:    "#3366ff",
};

// STATE
const state = {
  dpr:         1,
  cssW:        0,
  cssH:        0,
  selectStart: null,
  dragging:    false,
  pointerType: "",
  words:       [],
  targetX:     0,
};

let cursor = { position: { x: 0.5, y: 0.5 }, mass: 1 };

const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");
const debug  = document.getElementById("debug");

// LAYOUT
function layoutWords() {
  const { text, fontsize, fontFamily, lineHeight } = settings;
  ctx.font = `${fontsize}px ${fontFamily}`;
  const padding    = fontsize;
  const maxWidth   = state.cssW - padding * 2;
  const spaceWidth = ctx.measureText(" ").width;
  const lineH      = fontsize * lineHeight;

  state.words = [];
  let x = padding, y = padding + fontsize;

  for (const word of text.split(" ")) {
    const w = ctx.measureText(word).width;
    if (x + w > padding + maxWidth && x !== padding) {
      x  = padding;
      y += lineH;
    }
    state.words.push({ word, x, y, width: w, height: fontsize });
    x += w + spaceWidth;
  }
}

// RESIZE
function resize() {
  state.dpr  = window.devicePixelRatio || 1;
  state.cssW = window.innerWidth;
  state.cssH = window.innerHeight - (debug.offsetHeight || 28);

  canvas.width        = Math.floor(state.cssW * state.dpr);
  canvas.height       = Math.floor(state.cssH * state.dpr);
  canvas.style.width  = state.cssW + "px";
  canvas.style.height = state.cssH + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);
  layoutWords();
}

function nearestBoundary(lx) {
  let best = null, bestDist = Infinity;
  for (const w of state.words) {
    for (const bx of [w.x, w.x + w.width]) {
      const d = Math.abs(lx - bx);
      if (d < bestDist) { bestDist = d; best = bx; }
    }
  }
  return { boundary: best, dist: bestDist };
}

// POINTER
canvas.addEventListener("pointerdown", e => {
  canvas.setPointerCapture(e.pointerId);
  state.dragging    = true;
  state.targetX     = e.offsetX;
  state.selectStart = e.offsetX;
  state.pointerType = e.pointerType || "mouse";
  cursor = { position: { x: e.offsetX / state.cssW, y: 0.5 }, mass: 1 };
});

canvas.addEventListener("pointermove", e => {
  state.pointerType = e.pointerType || "mouse";
  if (state.dragging) state.targetX = e.offsetX;
});

canvas.addEventListener("pointerup",     stopDrag);
canvas.addEventListener("pointercancel", stopDrag);

function stopDrag() {
  state.dragging    = false;
  state.selectStart = null;
}

// PHYSICS + DRAW
function draw() {
  const { cssW, cssH, words, selectStart, dragging, targetX } = state;
  const { fontsize, fontFamily, highlightColor, textColor, cursorColor,
          targetDiminish, snapStrength, edgeRadius, frictionNear, frictionFar } = settings;

  if (dragging) {
    const cursorPx = cursor.position.x * cssW;

    // Pull toward nearest word boundary
    const { boundary, dist } = nearestBoundary(cursorPx);
    const t = clamp(dist / edgeRadius, 0, 1);
    const smooth = Easings.Named.smoothstep(t);    // 0 = on edge, 1 = far away

    // Raw {x,y} acceleration vector
    const snapForce = {
      x: (1 - smooth) * ((boundary / cssW) - cursor.position.x) * snapStrength,
      y: 0,
    };

    // Dynamic friction, interpolate blends frictionNear to frictionFar
    const friction = Forces.velocityForce(
      interpolate(smooth, frictionNear, frictionFar),
      'dampen'
    );

    // Apply all forces
    cursor = Forces.apply(
      cursor,
      Forces.targetForce(                   
        { x: targetX / cssW, y: 0.5 },
        { diminishBy: targetDiminish }
      ),
      snapForce,                             // snaps to word boundary
      friction,                              // slows movement
    );

    // Clamp to canvas bounds
    cursor = {
      ...cursor,
      position: { x: clamp(cursor.position.x, 0, 1), y: 0.5 },
    };
  }

  const cursorX = cursor.position.x * cssW;

  ctx.clearRect(0, 0, cssW, cssH);
  ctx.font = `${fontsize}px ${fontFamily}`;

  // Highlight
  if (dragging && selectStart !== null) {
    const selL  = Math.min(selectStart, cursorX);
    const selR  = Math.max(selectStart, cursorX);
    const lines = [...new Set(words.map(w => w.y))];

    ctx.fillStyle = highlightColor;
    for (const lineY of lines) {
      const lineWords = words.filter(w => w.y === lineY);
      const lineL     = lineWords[0].x;
      const lineR     = lineWords.at(-1).x + lineWords.at(-1).width;
      const overlapL  = Math.max(selL, lineL);
      const overlapR  = Math.min(selR, lineR);
      if (overlapR > overlapL) {
        ctx.fillRect(overlapL, lineY - fontsize * 0.85, overlapR - overlapL, fontsize * 1.1);
      }
    }
  }

  // Words
  ctx.fillStyle    = textColor;
  ctx.textBaseline = "alphabetic";
  for (const w of words) ctx.fillText(w.word, w.x, w.y);

  // Cursor line
  if (dragging) {
    const nearest = words.reduce((best, w) =>
      Math.abs(w.x + w.width / 2 - cursorX) <
      Math.abs(best.x + best.width / 2 - cursorX) ? w : best
    , words[0]);

    ctx.strokeStyle = cursorColor;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(cursorX, nearest.y - nearest.height * 0.85);
    ctx.lineTo(cursorX, nearest.y + nearest.height * 0.25);
    ctx.stroke();
  }

  // Debug
  const vel = cursor.velocity?.x.toFixed(5) ?? "0";
  const { dist } = nearestBoundary(cursorX);
  debug.textContent =
    `cursorX ${Math.round(cursorX)}  ·  ` +
    `targetX ${Math.round(targetX)}  ·  ` +
    `vel.x ${vel}  ·  ` +
    `edge ${Math.round(dist)}px  ·  ` +
    `type ${state.pointerType}`;
}

window.addEventListener("resize", resize);
resize();
continuously(draw).start();
