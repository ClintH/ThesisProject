import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

const canvas = document.getElementById(`canvas`);
if (!canvas) throw new Error(`Canvas element not found`);
// @ts-ignore
const ctx = canvas.getContext(`2d`);
const debug = document.getElementById(`debug`);
const frictionInput = document.getElementById(`friction`);
const pullInput = document.getElementById(`pull`);
const weightInput = document.getElementById(`weight`);
const presetsInput = document.getElementById(`presets`);
const frictionValue = document.getElementById(`frictionValue`);
const pullValue = document.getElementById(`pullValue`);
const weightValue = document.getElementById(`weightValue`);

const settings = {
  size: 120,
};

const state = {
  dpr: window.devicePixelRatio || 1,
  cssW: 0,
  cssH: 0,
  virtX: 120,
  virtY: 120,
  velX: 0,
  velY: 0,
  targetX: 120,
  targetY: 120,
  dragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  initialized: false,
};

function resizeCanvas() {
  state.dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));
  canvas.width = Math.floor(cssW * state.dpr);
  canvas.height = Math.floor(cssH * state.dpr);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);
  state.cssW = cssW;
  state.cssH = cssH;

  if (!state.initialized) {
    state.virtX = (cssW - settings.size) / 2;
    state.virtY = (cssH - settings.size) / 2;
    state.targetX = state.virtX;
    state.targetY = state.virtY;
    state.initialized = true;
  }
}
window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();

function hitBody(px, py) {
  return (
    px >= state.virtX && px <= state.virtX + settings.size &&
    py >= state.virtY && py <= state.virtY + settings.size
  );
}

function updateCursor(px, py) {
  if (state.dragging) canvas.style.cursor = `grabbing`;
  else if (hitBody(px, py)) canvas.style.cursor = `grab`;
  else canvas.style.cursor = `default`;
}

canvas.addEventListener(`pointerdown`, (e) => {
  const x = e.offsetX,
    y = e.offsetY;
  if (hitBody(x, y)) {
    state.dragging = true;
    state.dragOffsetX = x - state.virtX;
    state.dragOffsetY = y - state.virtY;
    canvas.setPointerCapture(e.pointerId);
  }
});

canvas.addEventListener(`pointermove`, (e) => {
  const x = e.offsetX,
    y = e.offsetY;
  updateCursor(x, y);

  if (state.dragging) {
    state.targetX = Numbers.clamp(x - state.dragOffsetX, 0, state.cssW - settings.size);
    state.targetY = Numbers.clamp(y - state.dragOffsetY, 0, state.cssH - settings.size);
  }

  updateDebug(e);
});

canvas.addEventListener(`pointerup`, () => {
  state.dragging = false;
});
canvas.addEventListener(`pointercancel`, () => {
  state.dragging = false;
});

const loop = continuously(() => {
  const weightClamped = Numbers.clamp(weightInput.value, 1, 100);
  const friction = Numbers.scale(frictionInput.value, 0, 100, 0, 0.7);
  const pull = Numbers.scale(pullInput.value, 0, 100, 0, 1);
  const weight = Numbers.scale(weightClamped, 1, 100, 0.1, 40);

  // spring force on each axis independently
  const forceX = (state.targetX - state.virtX) * pull;
  const forceY = (state.targetY - state.virtY) * pull;

  state.velX += forceX / weight;
  state.velY += forceY / weight;
  state.velX *= (1 - friction);
  state.velY *= (1 - friction);
  state.virtX += state.velX;
  state.virtY += state.velY;

  draw();
});
loop.start();

function draw() {
  ctx.clearRect(0, 0, state.cssW, state.cssH);

  const { virtX, virtY } = state;
  const s = settings.size;

  ctx.fillStyle = `rgb(0, 0, 0)`;
  ctx.fillRect(virtX, virtY, s, s);
}

function updateDebug(e) {
  const type = e.pointerType;
  const x = Math.round(e.offsetX);
  const y = Math.round(e.offsetY);
  const lagX = Math.abs(state.targetX - state.virtX).toFixed(1);
  const lagY = Math.abs(state.targetY - state.virtY).toFixed(1);
  const vx = Math.round(state.virtX);
  const vy = Math.round(state.virtY);
  debug.textContent =
    `type: ${type}   |   x: ${x}   y: ${y}   |   pos: ${vx} × ${vy}px   |   lag: ${lagX} × ${lagY}px`;
}

const presets = {
  bouncy: { friction: 6, pull: 95, weight: 51 },
  heavy: { friction: 75, pull: 100, weight: 42 },
  flexible: { friction: 7, pull: 1, weight: 10 },
  jiggly: { friction: 19, pull: 44, weight: 6 },
  straightforward: { friction: 99, pull: 30, weight: 1 },
};

presetsInput.addEventListener(`change`, () => {
  const preset = presets[presetsInput.value];
  if (!preset) return;
  frictionInput.value = preset.friction;
  pullInput.value = preset.pull;
  weightInput.value = preset.weight;
  updateSliderDisplays();
});

function updateSliderDisplays() {
  frictionValue.textContent = frictionInput.value;
  pullValue.textContent = pullInput.value;
  weightValue.textContent = weightInput.value;
}
frictionInput.addEventListener(`input`, updateSliderDisplays);
pullInput.addEventListener(`input`, updateSliderDisplays);
weightInput.addEventListener(`input`, updateSliderDisplays);
updateSliderDisplays();
