import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

const settings = Object.freeze({
  canvas: /** @type HTMLElement */(document.getElementById(`canvas`)),
  debug: /** @type HTMLElement */(document.getElementById(`debug`)),
  ctx: canvas.getContext(`2d`),
  minSize: 30,
  maxSize: 800,
  handleR: 8,
  handleHit: 14,
  engageGain: 0.0002,
  engageDecay: 0.00002,
  pullCold: 0.04,
  pullWarm: 0.95,
  frictionCold: 0.78,
  frictionWarm: 0.10,
  weight: 12,
});

const state = {
  DPR: window.devicePixelRatio || 1,
  cssW: 0,
  cssH: 0,
  ax: 80,
  ay: 80,
  virtW: 160,
  virtH: 160,
  velW: 0,
  velH: 0,
  targetW: 160,
  targetH: 160,
  resizing: false,
  moving: false,
  moveDx: 0,
  moveDy: 0,
  lastPx: 0,
  lastPy: 0,
  engagement: 0,
  lastTime: performance.now(),
  lastEvent: null,
  initialized: false,
};

function resizeCanvas() {
  const { canvas, ctx } = settings;
  state.DPR = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));

  canvas.width = Math.floor(cssW * state.DPR);
  canvas.height = Math.floor(cssH * state.DPR);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.DPR, state.DPR);
  state.cssW = cssW;
  state.cssH = cssH;

  if (!state.initialized) {
    const s = Math.min(cssW, cssH) * 0.35;
    state.virtW = s;
    state.virtH = s;
    state.targetW = s;
    state.targetH = s;
    state.ax = cssW * 0.2;
    state.ay = cssH * 0.15;
    state.initialized = true;
  }
}

window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();

function handlePos() {
  return {
    x: state.ax + state.virtW,
    y: state.ay + state.virtH,
  };
}

function hitHandle(px, py) {
  const h = handlePos();
  const dx = px - h.x;
  const dy = py - h.y;
  return Math.sqrt(dx * dx + dy * dy) <= settings.handleHit;
}

function hitBody(px, py) {
  return (
    px >= state.ax && px <= state.ax + state.virtW &&
    py >= state.ay && py <= state.ay + state.virtH
  );
}

function updateCursor(px, py) {
  if (state.resizing) canvas.style.cursor = `nwse-resize`;
  else if (state.moving) canvas.style.cursor = `grabbing`;
  else if (hitHandle(px, py)) canvas.style.cursor = `nwse-resize`;
  else if (hitBody(px, py)) canvas.style.cursor = `grab`;
  else canvas.style.cursor = `default`;
}

canvas.addEventListener(`pointerdown`, (e) => {
  const x = e.offsetX,
    y = e.offsetY;
  if (hitHandle(x, y)) {
    state.resizing = true;
    state.lastPx = x;
    state.lastPy = y;
    canvas.setPointerCapture(e.pointerId);
  } else if (hitBody(x, y)) {
    state.moving = true;
    state.moveDx = x - state.ax;
    state.moveDy = y - state.ay;
    canvas.setPointerCapture(e.pointerId);
  }
});

canvas.addEventListener(`pointermove`, (e) => {
  const { minSize, maxSize } = settings;
  const x = e.offsetX,
    y = e.offsetY;
  state.lastEvent = e;
  updateCursor(x, y);

  if (state.resizing) {
    // drag accumulates into engagement, which affects friction/pull
    const dx = x - state.lastPx;
    const dy = y - state.lastPy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    state.engagement = Numbers.clamp(state.engagement + dist * settings.engageGain, 0, 1);
    state.lastPx = x;
    state.lastPy = y;
    state.targetW = Numbers.clamp(x - state.ax, minSize, maxSize);
    state.targetH = Numbers.clamp(y - state.ay, minSize, maxSize);
  } else if (state.moving) {
    state.ax = Numbers.clamp(x - state.moveDx, 0, state.cssW - state.virtW);
    state.ay = Numbers.clamp(y - state.moveDy, 0, state.cssH - state.virtH);
  }
});

canvas.addEventListener(`pointerup`, () => {
  state.resizing = false;
  state.moving = false;
});

canvas.addEventListener(`pointercancel`, () => {
  state.resizing = false;
  state.moving = false;
});

const loop = continuously(() => {
  const { frictionCold, frictionWarm, pullCold, pullWarm, weight, minSize, maxSize } = settings;
  const now = performance.now();
  const deltaMs = now - state.lastTime;
  state.lastTime = now;

  // decay engagement over time
  state.engagement = Numbers.clamp(state.engagement - settings.engageDecay * deltaMs, 0, 1);

  // interpolate physics based on engagement
  const friction = Numbers.interpolate(state.engagement, frictionCold, frictionWarm);
  const pull = Numbers.interpolate(state.engagement, pullCold, pullWarm);

  const forceW = (state.targetW - state.virtW) * pull;
  const forceH = (state.targetH - state.virtH) * pull;
  state.velW += forceW / weight;
  state.velH += forceH / weight;
  state.velW *= (1 - friction);
  state.velH *= (1 - friction);
  state.virtW += state.velW;
  state.virtH += state.velH;

  state.virtW = Numbers.clamp(state.virtW, minSize - 20, maxSize + 20);
  state.virtH = Numbers.clamp(state.virtH, minSize - 20, maxSize + 20);

  draw();
  updateDebug();
});

loop.start();

function draw() {
  const { ctx } = settings;
  ctx.clearRect(0, 0, state.cssW, state.cssH);
  const { ax, ay, virtW, virtH } = state;

  ctx.fillStyle = `#111`;
  ctx.fillRect(ax, ay, virtW, virtH);

  const hp = handlePos();
  ctx.save();
  const gs = 14;
  for (let i = 1; i <= 3; i++) {
    const d = (gs / 3) * i;
    ctx.beginPath();
    ctx.moveTo(hp.x - gs + d, hp.y - 1);
    ctx.lineTo(hp.x - 1, hp.y - gs + d);
    ctx.stroke();
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(hp.x, hp.y, settings.handleR, 0, Math.PI * 2);
  ctx.fillStyle = `#fff`;
  ctx.fill();
  ctx.strokeStyle = `#999`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function updateDebug() {
  const eng = (state.engagement * 100).toFixed(1);
  const fr = Numbers.interpolate(state.engagement, settings.frictionCold, settings.frictionWarm).toFixed(3);
  const pull = Numbers.interpolate(state.engagement, settings.pullCold, settings.pullWarm).toFixed(3);
  const w = Math.round(state.virtW);
  const h = Math.round(state.virtH);
  const type = state.lastEvent?.pointerType ?? `—`;

  settings.debug.textContent =
    `type: ${type}   |   size: ${w} × ${h}px   |   engagement: ${eng}%   |   friction: ${fr}   |   pull: ${pull}`;
}