import { Forces, Easings } from "@ixfx/modulation.js";
import { continuously } from "@ixfx/flow.js";
import { clamp, interpolate } from "@ixfx/numbers.js";

const settings = {
  targetDiminish: 0.05,
  fontsize: 16,
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
  // tilt-tick gesture: a quick angular flick of the stylus nudges the caret
  tiltTickThreshold: 15,      // degrees that must accumulate (after decay) to count as a tick
  tiltDecayMs: 120,           // half-life of accumulator — slow tilts drain away, fast flicks don't
  tiltImpulseStrength: 0.01,  // normalized velocity added per tick (fraction of canvas width)
  tiltCooldownFrames: 5,      // frames before another tick can fire
  paragraphs: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed ipsum metus. Quisque eleifend consectetur mollis. Proin eu tortor magna. Suspendisse potenti. Praesent cursus urna ac aliquam pharetra. Duis ac elit id tellus volutpat pharetra non eu velit. Sed aliquet vitae dui eget laoreet. Mauris aliquet maximus commodo. Pellentesque pulvinar nisl quis libero sollicitudin, quis sollicitudin nisi ornare. Fusce sed lacus nulla. Suspendisse vitae odio scelerisque lacus laoreet tincidunt. Duis lobortis non nisi et placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "FSed faucibus maximus magna, quis ultrices mi consectetur quis. Nullam eget mi porttitor, aliquet sem vel, tincidunt massa. Nam commodo et velit nec tempor. Donec ut diam imperdiet, feugiat sem eu, semper quam. In dolor augue, egestas convallis nulla sed, ullamcorper sodales sapien. Nullam elit ligula, suscipit nec libero id, consectetur viverra nulla. Curabitur sit amet ipsum eget tortor ullamcorper fermentum vel a augue. Suspendisse id laoreet eros. Donec sit amet lectus et orci egestas congue. Proin mattis aliquet ipsum eu rhoncus. Sed vitae erat vel elit ultrices pharetra sed a ante. Vivamus nunc velit, egestas at neque eu, dictum semper justo. Ut ex ligula, sodales auctor imperdiet sed, ullamcorper nec massa. Etiam blandit nisi ac enim tincidunt facilisis. Praesent dignissim dolor non mi consectetur, sed molestie nulla consectetur. Aenean eu odio porttitor, rutrum quam nec, tempor lacus.",
    "Vestibulum ut nibh feugiat, porta tellus gravida, lobortis odio. Nam tristique feugiat metus a volutpat. Sed sit amet malesuada tortor. Nulla nec enim eget elit sollicitudin efficitur. Sed ac vulputate quam, ut ullamcorper enim. In tincidunt lorem felis, quis semper mi feugiat maximus. Vivamus velit ante, ultrices sed felis ac, pretium sodales lectus. Etiam elementum eros a justo convallis fermentum. Nam dui justo, varius vel erat a, suscipit bibendum dolor. Quisque sed tortor in odio condimentum maximus. Phasellus finibus arcu vitae orci euismod, vel viverra turpis molestie.",
  ],
  tools: [
    {
      id: "fine",
      boundaryKey: "word",
      edgeRadius: 16,
      snapStrength: 0.60,
      frictionNear: 0.24,
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
  /** @type {number|null} */
  prevTiltX: null,
  /** @type {number|null} */
  tiltLastTime: null,
  tiltCooldown: 0,
  tiltTickFlash: 0,
  tiltDeltaAccum: 0,
  thrown: false,
  /** @type {{ word: string, x: number, y: number, width: number, height: number, isSentenceEnd: boolean, isParaEnd: boolean, pi: number }[]} */
  words: [],
  // per-line boundary sets
  /** @type {{ word: number[], sentence: number[], paragraph: number[], y: number }[]} */
  boundaries: [],
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const debug = document.getElementById("debug");

// lay out all words, tag each with paragraph/sentence metadata,
// and compute the three boundary sets
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
  state.cssW = window.innerWidth;
  state.cssH = window.innerHeight - (debug.offsetHeight || 28);

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

// returns the boundary set for whichever line is closest to py
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
  state.tiltDeltaAccum = 0;
  state.targetX = e.offsetX;
  state.selectStart = e.offsetX;
  state.selectStartY = e.offsetY;
  if (!state.thrown) {
    state.cursor = { position: { x: e.offsetX / state.cssW, y: 0.5 }, mass: 1 };
  }
});

canvas.addEventListener("pointermove", e => {
  if (state.dragging) {
    state.targetX = e.offsetX;
    state.pointerY = e.offsetY;

    // tilt-tick gesture: decaying accumulator — fast flicks charge it, slow tilts drain away
    if (e.pointerType === "pen") {
      const tiltX = e.tiltX;
      const now = e.timeStamp;
      if (state.prevTiltX !== null) {
        const delta = tiltX - state.prevTiltX;
        const dt = state.tiltLastTime !== null ? now - state.tiltLastTime : 0;

        // decay the accumulator based on elapsed time (half-life = tiltDecayMs)
        if (dt > 0) {
          state.tiltDeltaAccum *= Math.exp(-dt * Math.LN2 / settings.tiltDecayMs);
        }

        // direction reversal resets rather than subtracts
        if (delta !== 0 && Math.sign(delta) !== Math.sign(state.tiltDeltaAccum)) {
          state.tiltDeltaAccum = 0;
        }
        state.tiltDeltaAccum += delta;

        if (state.tiltCooldown <= 0 && Math.abs(state.tiltDeltaAccum) >= settings.tiltTickThreshold) {
          const sign = state.tiltDeltaAccum > 0 ? -1 : 1;
          const magnitude = Math.abs(state.tiltDeltaAccum) / settings.tiltTickThreshold;
          const vel = state.cursor.velocity ?? { x: 0, y: 0 };
          state.cursor = {
            ...state.cursor,
            velocity: { x: vel.x + sign * settings.tiltImpulseStrength * magnitude, y: vel.y },
          };
          state.thrown = true;
          state.tiltDeltaAccum = 0;
          state.tiltCooldown = settings.tiltCooldownFrames;
          state.tiltTickFlash = settings.tiltCooldownFrames;
        }
      }
      state.prevTiltX = tiltX;
      state.tiltLastTime = now;
    }
  } else {
    state.prevTiltX = null;
    state.tiltLastTime = null;
    state.tiltDeltaAccum = 0;
  }
});

canvas.addEventListener("pointerup", stopDrag);
canvas.addEventListener("pointercancel", stopDrag);
function stopDrag() {
  state.dragging = false;
  if (!state.thrown) {
    state.selectStart = null;
    state.selectStartY = null;
  }
}


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

  // tick cooldown
  if (state.tiltCooldown > 0) state.tiltCooldown--;

  // physics
  if (dragging || state.thrown) {
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

    const applied = state.thrown
      // caret is flying — only snap + friction, no pull toward stylus
      ? Forces.apply(state.cursor, snapForce, friction)
      : Forces.apply(
          state.cursor,
          Forces.targetForce({ x: targetX / cssW, y: 0.5 }, { diminishBy: targetDiminish }),
          snapForce,
          friction,
        );
    state.cursor = { ...state.cursor, ...applied, position: applied.position ?? state.cursor.position };

    state.cursor = {
      ...state.cursor,
      position: { x: clamp(state.cursor.position.x, 0, 1), y: 0.5 },
    };
  }

  const cursorX = state.cursor.position.x * cssW;

  ctx.clearRect(0, 0, cssW, cssH);

  // selection highlight
  ctx.font = `${fontsize}px ${fontFamily}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  if ((dragging || state.thrown) && selectStart !== null && state.selectStartY !== null) {
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

  // words
  ctx.fillStyle = textColor;
  for (const w of words) ctx.fillText(w.word, w.x, w.y);

  // cursor
  if (dragging || state.thrown) {
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

  // debug
  if (state.tiltTickFlash > 0) state.tiltTickFlash--;
  const vel = state.cursor.velocity?.x.toFixed(5) ?? "0";
  const { dist } = nearestBoundary(cursorX, activeBounds);
  const tilt = state.prevTiltX !== null ? `${Math.round(state.prevTiltX)}°` : "—";
  const accum = Math.round(state.tiltDeltaAccum);
  const accumPct = Math.min(Math.abs(state.tiltDeltaAccum) / settings.tiltTickThreshold, 1);
  const tickOpacity = state.tiltTickFlash > 0
    ? (state.tiltTickFlash / settings.tiltCooldownFrames).toFixed(2)
    : "0.15";
  debug.innerHTML =
    `tool: ${tool.id}  |  tiltX ${tilt}  |  accum ${accum > 0 ? "+" : ""}${accum}° / ${settings.tiltTickThreshold}°` +
    `  <span style="display:inline-block;width:60px;height:8px;background:#ddd;border-radius:4px;vertical-align:middle">` +
    `<span style="display:block;width:${Math.round(accumPct * 100)}%;height:100%;background:${accumPct >= 1 ? "#d94f00" : "#888"};border-radius:4px"></span></span>` +
    `  |  cd ${state.tiltCooldown}  |  vel.x ${vel}` +
    `  |  <span class="tick-indicator" style="opacity:${tickOpacity}">&#x25CF; TICK</span>`;
}

window.addEventListener("resize", resize);
resize();
continuously(draw).start();
