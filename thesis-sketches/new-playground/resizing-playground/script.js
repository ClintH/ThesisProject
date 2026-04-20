import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

const settings = {
  minSize: 30,
  maxSize: 800,
  handleRadius: 8,
  handleHit: 14,
  canvas: /** @type {HTMLCanvasElement} */  (document.getElementById(`canvas`)),
  debug: /** @type {HTMLElement} */         (document.getElementById(`debug`)),
  frictionInput: /** @type {HTMLInputElement} */    (document.getElementById(`friction`)),
  pullInput: /** @type {HTMLInputElement} */     (document.getElementById(`pull`)),
  weightInput: /** @type {HTMLInputElement} */     (document.getElementById(`weight`)),
  presetsInput: /** @type {HTMLSelectElement} */    (document.getElementById(`presets`)),
  frictionValue: /** @type {HTMLElement} */          (document.getElementById(`frictionValue`)),
  pullValue: /** @type {HTMLElement} */           (document.getElementById(`pullValue`)),
  weightValue: /** @type {HTMLElement} */           (document.getElementById(`weightValue`)),
};
const ctx = /** @type {CanvasRenderingContext2D} */ (settings.canvas.getContext(`2d`));

const state = {
  dpr: window.devicePixelRatio || 1,
  cssW: 0,
  cssH: 0,
  ax: 120,
  ay: 120,
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
  initialized: false,
};

function resizeCanvas() {
  state.dpr = window.devicePixelRatio || 1;
  const rect = settings.canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));
  settings.canvas.width = Math.floor(cssW * state.dpr);
  settings.canvas.height = Math.floor(cssH * state.dpr);
  settings.canvas.style.width = `${cssW}px`;
  settings.canvas.style.height = `${cssH}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);
  state.cssW = cssW;
  state.cssH = cssH;

  if (!state.initialized) {
    const s = Math.min(cssW, cssH) * 0.35;
    state.virtW = s;
    state.virtH = s;
    state.targetW = s;
    state.targetH = s;
    state.ax = cssW * 0.4;
    state.ay = cssH * 0.1;
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
  if (state.resizing) settings.canvas.style.cursor = `nwse-resize`;
  else if (state.moving) settings.canvas.style.cursor = `grabbing`;
  else if (hitHandle(px, py)) settings.canvas.style.cursor = `nwse-resize`;
  else if (hitBody(px, py)) settings.canvas.style.cursor = `grab`;
  else settings.canvas.style.cursor = `default`;
}

settings.canvas.addEventListener(`pointerdown`, (e) => {
  const x = e.offsetX,
    y = e.offsetY;
  if (hitHandle(x, y)) {
    state.resizing = true;
    settings.canvas.setPointerCapture(e.pointerId);
  } else if (hitBody(x, y)) {
    state.moving = true;
    state.moveDx = x - state.ax;
    state.moveDy = y - state.ay;
    settings.canvas.setPointerCapture(e.pointerId);
  }
});

settings.canvas.addEventListener(`pointermove`, (e) => {
  const x = e.offsetX,
    y = e.offsetY;
  updateCursor(x, y);

  if (state.resizing) {
    state.targetW = Numbers.clamp(x - state.ax, settings.minSize, settings.maxSize);
    state.targetH = Numbers.clamp(y - state.ay, settings.minSize, settings.maxSize);
  } else if (state.moving) {
    state.ax = Numbers.clamp(x - state.moveDx, 0, state.cssW - state.virtW);
    state.ay = Numbers.clamp(y - state.moveDy, 0, state.cssH - state.virtH);
  }

  updateDebug(e);
});

settings.canvas.addEventListener(`pointerup`, () => {
  state.resizing = false; state.moving = false;
});
settings.canvas.addEventListener(`pointercancel`, () => {
  state.resizing = false; state.moving = false;
});

const loop = continuously(() => {
  const { frictionInput, pullInput, weightInput } = settings;
  const weightClamped = Numbers.clamp(+weightInput.value, 1, 100);
  const friction = Numbers.scale(+frictionInput.value, 0, 100, 0, 0.7);
  const pull = Numbers.scale(+pullInput.value, 0, 100, 0, 1);
  const weight = Numbers.scale(weightClamped, 1, 100, 0.1, 40);

  // spring force on each axis independently
  const forceW = (state.targetW - state.virtW) * pull;
  const forceH = (state.targetH - state.virtH) * pull;

  state.velW += forceW / weight;
  state.velH += forceH / weight;
  state.velW *= (1 - friction);
  state.velH *= (1 - friction);
  state.virtW += state.velW;
  state.virtH += state.velH;

  state.virtW = Numbers.clamp(state.virtW, settings.minSize - 30, settings.maxSize + 30);
  state.virtH = Numbers.clamp(state.virtH, settings.minSize - 30, settings.maxSize + 30);

  draw();
});
loop.start();

function draw() {
  ctx.clearRect(0, 0, state.cssW, state.cssH);

  const { ax, ay, virtW, virtH } = state;

  // square body
  ctx.fillStyle = `rgb(0, 0, 0)`;
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

  // handle circle
  ctx.beginPath();
  ctx.arc(hp.x, hp.y, settings.handleRadius, 0, Math.PI * 2);
  ctx.fillStyle = `#fff`;
  ctx.fill();
  ctx.strokeStyle = state.resizing ? `#3B82F6` : `#999`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function updateDebug(e) {
  const type = e.pointerType;
  const x = Math.round(e.offsetX);
  const y = Math.round(e.offsetY);
  const lagW = Math.abs(state.targetW - state.virtW).toFixed(1);
  const lagH = Math.abs(state.targetH - state.virtH).toFixed(1);
  const w = Math.round(state.virtW);
  const h = Math.round(state.virtH);
  settings.debug.textContent =
    `type: ${type}   |   x: ${x}   y: ${y}   |   size: ${w} × ${h}px   |   lag: ${lagW} × ${lagH}px`;
}

const presets = {
  bouncy: { friction: 6, pull: 95, weight: 51 },
  heavy: { friction: 75, pull: 100, weight: 42 },
  flexible: { friction: 7, pull: 1, weight: 10 },
  jiggly: { friction: 19, pull: 44, weight: 6 },
  straightforward: { friction: 99, pull: 30, weight: 1 },
};

settings.presetsInput.addEventListener(`change`, () => {
  const preset = presets[settings.presetsInput.value];
  if (!preset) return;
  settings.frictionInput.value = String(preset.friction);
  settings.pullInput.value = String(preset.pull);
  settings.weightInput.value = String(preset.weight);
  updateSliderDisplays();
});

function updateSliderDisplays() {
  settings.frictionValue.textContent = settings.frictionInput.value;
  settings.pullValue.textContent = settings.pullInput.value;
  settings.weightValue.textContent = settings.weightInput.value;
}
settings.frictionInput.addEventListener(`input`, updateSliderDisplays);
settings.pullInput.addEventListener(`input`, updateSliderDisplays);
settings.weightInput.addEventListener(`input`, updateSliderDisplays);
updateSliderDisplays();
