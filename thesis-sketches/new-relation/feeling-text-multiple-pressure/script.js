import { Forces } from "@ixfx/modulation.js";
import { continuously } from "@ixfx/flow.js";
import { clamp, interpolate } from "@ixfx/numbers.js";
import { Easings } from "@ixfx/modulation.js";

const settings = {
  paragraphs: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed ipsum metus. Quisque eleifend consectetur mollis. Proin eu tortor magna. Suspendisse potenti. Praesent cursus urna ac aliquam pharetra. Duis ac elit id tellus volutpat pharetra non eu velit. Sed aliquet vitae dui eget laoreet. Mauris aliquet maximus commodo. Pellentesque pulvinar nisl quis libero sollicitudin, quis sollicitudin nisi ornare. Fusce sed lacus nulla. Suspendisse vitae odio scelerisque lacus laoreet tincidunt. Duis lobortis non nisi et placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Sed faucibus maximus magna, quis ultrices mi consectetur quis. Nullam eget mi porttitor, aliquet sem vel, tincidunt massa. Nam commodo et velit nec tempor. Donec ut diam imperdiet, feugiat sem eu, semper quam. In dolor augue, egestas convallis nulla sed, ullamcorper sodales sapien. Nullam elit ligula, suscipit nec libero id, consectetur viverra nulla. Curabitur sit amet ipsum eget tortor ullamcorper fermentum vel a augue. Suspendisse id laoreet eros. Donec sit amet lectus et orci egestas congue. Proin mattis aliquet ipsum eu rhoncus. Sed vitae erat vel elit ultrices pharetra sed a ante. Vivamus nunc velit, egestas at neque eu, dictum semper justo. Ut ex ligula, sodales auctor imperdiet sed, ullamcorper nec massa. Etiam blandit nisi ac enim tincidunt facilisis. Praesent dignissim dolor non mi consectetur, sed molestie nulla consectetur. Aenean eu odio porttitor, rutrum quam nec, tempor lacus.`,
    `Vestibulum ut nibh feugiat, porta tellus gravida, lobortis odio. Nam tristique feugiat metus a volutpat. Sed sit amet malesuada tortor. Nulla nec enim eget elit sollicitudin efficitur. Sed ac vulputate quam, ut ullamcorper enim. In tincidunt lorem felis, quis semper mi feugiat maximus. Vivamus velit ante, ultrices sed felis ac, pretium sodales lectus. Etiam elementum eros a justo convallis fermentum. Nam dui justo, varius vel erat a, suscipit bibendum dolor. Quisque sed tortor in odio condimentum maximus. Phasellus finibus arcu vitae orci euismod, vel viverra turpis molestie.`,
  ],

  tools: [
    {
      id: `fine`,
      boundaryKey: `word`,
      edgeRadius: 18,
      snapStrength: 0.90,
      frictionNear: 0.30,
      frictionFar: 0.03,
      color: `#2255ee`,
    },
    {
      id: `medium`,
      boundaryKey: `sentence`,
      edgeRadius: 55,
      snapStrength: 0.45,
      frictionNear: 0.20,
      frictionFar: 0.03,
      color: `#2255ee`,
    },
    {
      id: `broad`,
      boundaryKey: `paragraph`,
      edgeRadius: 120,
      snapStrength: 0.35,
      frictionNear: 0.14,
      frictionFar: 0.03,
      color: `#2255ee`,
    },
  ],

  targetDiminish: 0.05,
  fontsize: 18,
  fontFamily: `Times New Roman, serif`,
  lineHeight: 1.75,
  paragraphGap: 20,
  padding: 52,
  highlightColor: `rgba(80,140,255,0.22)`,
  textColor: `#1a1a1a`,
  btnGap: 10,

  canvas: /** @type {HTMLCanvasElement} */ (document.getElementById(`canvas`)),
  debug: /** @type {HTMLElement} */ (document.getElementById(`debug`)),
  toggleBtn: /** @type {HTMLButtonElement} */ (document.getElementById(`toggleBtn`)),
  vizCanvas: /** @type {HTMLCanvasElement} */ (document.getElementById(`vizCanvas`)),
  vizToggleBtn: /** @type {HTMLButtonElement} */ (document.getElementById(`vizToggleBtn`)),
};

const ctx = /** @type {CanvasRenderingContext2D} */ (
  settings.canvas.getContext(`2d`)
);
const vizCtx = /** @type {CanvasRenderingContext2D} */ (
  settings.vizCanvas.getContext(`2d`)
);

let toolIndex = 0;
let inputMode = `pressure`;
let vizVisible = true;

settings.toggleBtn.addEventListener(`click`, () => {
  inputMode = inputMode === `pressure` ? `tilt` : `pressure`;
  settings.toggleBtn.textContent = `by: ${inputMode}`;
  settings.toggleBtn.classList.toggle(`tilt`, inputMode === `tilt`);
});

settings.vizToggleBtn.addEventListener(`click`, () => {
  vizVisible = !vizVisible;
  settings.vizCanvas.classList.toggle(`hidden`, !vizVisible);
  settings.vizToggleBtn.classList.toggle(`hidden`, !vizVisible);
  settings.vizToggleBtn.textContent = vizVisible ? `◉` : `○`;
});

const state = {
  dpr: 1,
  cssW: 0,
  cssH: 0,
  dragging: false,
  selectStart: /** @type {number | null} */ (null),
  selectStartY: /** @type {number | null} */ (null),
  targetX: 0,
  pointerY: 0,
  pressure: 0,
  tiltX: 0,
  tiltY: 0,
  words: /** @type {{ word: string, x: number, y: number, width: number, height: number, isSentenceEnd: boolean, isParaEnd: boolean, pi: number }[]} */ ([]),
  boundaries: /** @type {{ word: number[], sentence: number[], paragraph: number[], y: number }[]} */ ([]),
  activeLineY: /** @type {number | null} */ (null),
};

let cursor = { position: { x: 0.5, y: 0.5 }, mass: 1 };

function layoutWords() {
  const {
    fontsize,
    fontFamily,
    lineHeight,
    paragraphGap,
    padding,
    paragraphs,
  } = settings;

  ctx.font = `${fontsize}px ${fontFamily}`;
  const spaceW = ctx.measureText(` `).width;
  const lineH = fontsize * lineHeight;
  const maxW = state.cssW - padding * 2;

  state.words = [];
  state.boundaries = [];

  const sort = (s) => [ ...s ].sort((a, b) => a - b);

  const lineMap = new Map();
  const getLine = (lineY) => {
    if (!lineMap.has(lineY)) {
      lineMap.set(lineY, { wb: new Set(), sb: new Set(), pb: new Set() });
    }
    return lineMap.get(lineY);
  };

  let y = 52;

  for (let pi = 0; pi < paragraphs.length; pi++) {
    if (pi > 0) y += lineH + paragraphGap;
    let x = padding;
    const rawWords = paragraphs[pi].split(` `);

    for (let wi = 0; wi < rawWords.length; wi++) {
      const word = rawWords[wi];
      const w = ctx.measureText(word).width;

      if (x + w > padding + maxW && x !== padding) {
        x = padding;
        y += lineH;
      }

      const isSentenceEnd = /[.!?]$/.test(word);
      const isParaEnd = wi === rawWords.length - 1;

      state.words.push({
        word,
        x,
        y,
        width: w,
        height: fontsize,
        isSentenceEnd,
        isParaEnd,
        pi,
      });

      const line = getLine(y);
      line.wb.add(Math.round(x));
      line.wb.add(Math.round(x + w));

      if (isSentenceEnd) line.sb.add(Math.round(x + w));
      if (isParaEnd) line.pb.add(Math.round(x + w));

      x += w + spaceW;
    }
  }

  state.boundaries = [ ...lineMap.entries() ]
    .sort(([ a ], [ b ]) => a - b)
    .map(([ lineY, sets ]) => ({
      word: sort(sets.wb),
      sentence: sort(sets.sb),
      paragraph: sort(sets.pb),
      y: lineY,
    }));
}

function resize() {
  const { canvas } = settings;
  state.dpr = window.devicePixelRatio || 1;
  state.cssW = canvas.clientWidth;
  state.cssH = canvas.clientHeight;

  canvas.width = Math.floor(state.cssW * state.dpr);
  canvas.height = Math.floor(state.cssH * state.dpr);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);

  const vizSize = 36;
  settings.vizCanvas.width = Math.round(vizSize * state.dpr);
  settings.vizCanvas.height = Math.round(vizSize * state.dpr);
  settings.vizCanvas.style.width = `${vizSize}px`;
  settings.vizCanvas.style.height = `${vizSize}px`;
  vizCtx.setTransform(1, 0, 0, 1, 0, 0);
  vizCtx.scale(state.dpr, state.dpr);

  layoutWords();
}

function nearestBoundary(lx, boundaries) {
  let best = null;
  let bestDist = Infinity;

  for (const bx of boundaries) {
    const d = Math.abs(lx - bx);
    if (d < bestDist) {
      bestDist = d;
      best = bx;
    }
  }

  return { boundary: best, dist: bestDist };
}

function nearestLine(py, /** @type {number | null} */ currentLineY = null) {
  const lines = [ ...new Set(state.words.map((w) => w.y)) ];
  const nearest = lines.reduce(
    (best, lineY) => Math.abs(lineY - py) < Math.abs(best - py) ? lineY : best,
    lines[0]
  );

  if (currentLineY === null || nearest === currentLineY) return nearest;

  // Only switch lines when pointer has moved clearly past the midpoint
  const hysteresis = 10;
  return Math.abs(currentLineY - py) - Math.abs(nearest - py) > hysteresis
    ? nearest
    : currentLineY;
}

function getLineBounds(py) {
  let best = state.boundaries[0];
  let bestDist = Infinity;

  for (const b of state.boundaries) {
    const dist = Math.abs(py - b.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = b;
    }
  }

  return best;
}

function toolFromPressure(pressure) {
  return Math.min(
    Math.floor((1 - pressure) * settings.tools.length),
    settings.tools.length - 1
  );
}

function toolFromTilt(tiltX, tiltY) {
  const magnitude = Math.min(Math.hypot(tiltX, tiltY), 90);
  return Math.min(
    Math.floor((magnitude / 90) * settings.tools.length),
    settings.tools.length - 1
  );
}

function getCanvasPos(e) {
  const rect = settings.canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

settings.canvas.addEventListener(`pointerdown`, (e) => {
  const pos = getCanvasPos(e);
  state.pointerY = pos.y;
  state.selectStart = pos.x;

  if (e.pointerType === `pen`) {
    state.pressure = e.pressure;
    state.tiltX = e.tiltX;
    state.tiltY = e.tiltY;
    toolIndex =
      inputMode === `tilt` ?
        toolFromTilt(e.tiltX, e.tiltY) :
        toolFromPressure(e.pressure);
  }

  settings.canvas.setPointerCapture(e.pointerId);
  state.dragging = true;
  state.targetX = pos.x;
  state.selectStart = pos.x;
  state.selectStartY = pos.y;
  cursor = { position: { x: pos.x / state.cssW, y: 0.5 }, mass: 1 };
});

settings.canvas.addEventListener(`pointermove`, (e) => {
  if (!state.dragging) return;

  const pos = getCanvasPos(e);
  state.targetX = pos.x;
  state.pointerY = pos.y;

  if (e.pointerType === `pen`) {
    state.pressure = e.pressure;
    state.tiltX = e.tiltX;
    state.tiltY = e.tiltY;
    toolIndex =
      inputMode === `tilt` ?
        toolFromTilt(e.tiltX, e.tiltY) :
        toolFromPressure(e.pressure);
  }
});

settings.canvas.addEventListener(`pointerup`, stopDrag);
settings.canvas.addEventListener(`pointercancel`, stopDrag);

function stopDrag() {
  state.dragging = false;
  state.selectStart = null;
  state.selectStartY = null;
  state.activeLineY = null;
  state.pressure = 0;
  state.tiltX = 0;
  state.tiltY = 0;
}

window.addEventListener(`keydown`, (e) => {
  if (e.key === `1`) toolIndex = 0;
  if (e.key === `2`) toolIndex = 1;
  if (e.key === `3`) toolIndex = 2;
});

function draw() {
  const { cssW, cssH, words, selectStart, dragging, targetX } = state;
  const {
    fontsize,
    fontFamily,
    textColor,
    highlightColor,
    padding,
    targetDiminish,
    tools,
    debug,
  } = settings;

  const tool = tools[toolIndex];
  const paraB = getLineBounds(state.pointerY);
  const activeBounds = paraB[tool.boundaryKey];

  if (dragging) {
    const cursorPx = cursor.position.x * cssW;
    const { boundary, dist } = nearestBoundary(cursorPx, activeBounds);

    const t = clamp(dist / tool.edgeRadius, 0, 1);
    const smooth = Easings.Named.smoothstep(t);

    const snapForce = {
      x:
        boundary !== null ?
          (1 - smooth) * ((boundary / cssW) - cursor.position.x) * tool.snapStrength :
          0,
      y: 0,
    };

    const friction = Forces.velocityForce(
      interpolate(smooth, tool.frictionNear, tool.frictionFar),
      `dampen`
    );

    const applied = Forces.apply(
      cursor,
      Forces.targetForce({ x: targetX / cssW, y: 0.5 }, {
        diminishBy: targetDiminish,
      }),
      snapForce,
      friction
    );

    cursor = {
      ...applied,
      position: {
        x: clamp(applied.position?.x ?? cursor.position.x, 0, 1),
        y: 0.5,
      },
      mass: applied.mass ?? cursor.mass,
    };
  }

  const cursorX = cursor.position.x * cssW;

  ctx.clearRect(0, 0, cssW, cssH);
  ctx.font = `${fontsize}px ${fontFamily}`;
  ctx.textBaseline = `alphabetic`;
  ctx.textAlign = `left`;

  if (dragging && selectStart !== null && state.selectStartY !== null) {
    const startLineY = nearestLine(state.selectStartY);
    state.activeLineY = nearestLine(state.pointerY, state.activeLineY);
    const endLineY = state.activeLineY;
    const topLineY = Math.min(startLineY, endLineY);
    const botLineY = Math.max(startLineY, endLineY);
    const draggingDown = startLineY <= endLineY;
    const allLineYs = [ ...new Set(words.map((w) => w.y)) ].sort((a, b) => a - b);

    ctx.fillStyle = highlightColor;

    for (const lineY of allLineYs) {
      if (lineY < topLineY || lineY > botLineY) continue;

      const lw = words.filter((w) => w.y === lineY);
      if (!lw.length) continue;

      const last = lw[lw.length - 1];
      const lineL = lw[0].x;
      const lineR = last.x + last.width;

      let hlL;
      let hlR;

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

      if (hlR > hlL) {
        ctx.fillRect(hlL, lineY - fontsize * 0.85, hlR - hlL, fontsize * 1.1);
      }
    }
  }

  ctx.fillStyle = textColor;
  for (const w of words) ctx.fillText(w.word, w.x, w.y);

  if (dragging) {
    const lineY = state.activeLineY ?? nearestLine(state.pointerY);
    const topY = lineY - fontsize * 0.85;
    const botY = lineY + fontsize * 0.25;

    ctx.strokeStyle = tool.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cursorX, topY);
    ctx.lineTo(cursorX, botY);
    ctx.stroke();
  }

  const vel = cursor.velocity?.x.toFixed(5) ?? `0`;
  const { dist } = nearestBoundary(cursorX, activeBounds);
  debug.textContent = `  tool: ${tool.id}  |  cursorX ${Math.round(
    cursorX
  )}  |  vel.x ${vel}  |  nearest ${Math.round(dist)}px`;

  drawViz();
}

function drawViz() {
  if (!vizVisible) return;
  const size = 36;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  vizCtx.clearRect(0, 0, size, size);

  // Track ring
  vizCtx.strokeStyle = `rgba(0,0,0,0.1)`;
  vizCtx.lineWidth = 1;
  vizCtx.beginPath();
  vizCtx.arc(cx, cy, r, 0, Math.PI * 2);
  vizCtx.stroke();

  if (inputMode === `pressure`) {
    const fillR = r * state.pressure;
    if (fillR > 0.5) {
      vizCtx.fillStyle = `#2255ee`;
      vizCtx.globalAlpha = 0.8;
      vizCtx.beginPath();
      vizCtx.arc(cx, cy, fillR, 0, Math.PI * 2);
      vizCtx.fill();
      vizCtx.globalAlpha = 1;
    }
  } else {
    const dx = (state.tiltX / 90) * r;
    const dy = (state.tiltY / 90) * r;
    const hasTilt = Math.hypot(dx, dy) > 0.5;

    if (hasTilt) {
      vizCtx.strokeStyle = `rgba(34,85,238,0.3)`;
      vizCtx.lineWidth = 1;
      vizCtx.beginPath();
      vizCtx.moveTo(cx, cy);
      vizCtx.lineTo(cx + dx, cy + dy);
      vizCtx.stroke();

      vizCtx.fillStyle = `#2255ee`;
      vizCtx.beginPath();
      vizCtx.arc(cx + dx, cy + dy, 3.5, 0, Math.PI * 2);
      vizCtx.fill();
    }

    // Center mark
    vizCtx.fillStyle = `rgba(0,0,0,0.2)`;
    vizCtx.beginPath();
    vizCtx.arc(cx, cy, 1.5, 0, Math.PI * 2);
    vizCtx.fill();
  }
}

window.addEventListener(`resize`, resize);
resize();
continuously(draw).start();
