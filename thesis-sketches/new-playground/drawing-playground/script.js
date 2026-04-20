import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

const settings = {
  defaultLineWidth: 4,
  strokeStyle: `#000000`,
  /** @type {CanvasLineCap} */
  lineCap: `round`,
  /** @type {CanvasLineJoin} */
  lineJoin: `round`,
  canvas: /** @type {HTMLCanvasElement} */ (document.getElementById(`canvas`)),
  debug: /** @type {HTMLElement} */ (document.getElementById(`debug`)),
  clearBtn: /** @type {HTMLButtonElement} */ (document.getElementById(`clearBtn`)),
  frictionInput: /** @type {HTMLInputElement} */ (document.getElementById(`friction`)),
  pullInput:/** @type {HTMLInputElement} */ (document.getElementById(`pull`)),
  weightInput: /** @type {HTMLInputElement} */ (document.getElementById(`weight`)),
  presetsInput: /** @type {HTMLSelectElement} */ (document.getElementById(`presets`)),
  frictionValue: /** @type {HTMLElement} */ (document.getElementById(`frictionValue`)),
  pullValue: /** @type {HTMLElement} */ (document.getElementById(`pullValue`)),
  weightValue: /** @type {HTMLElement} */ (document.getElementById(`weightValue`)),
};

const ctx = /** @type {CanvasRenderingContext2D} */ (settings.canvas.getContext(`2d`));

const state = {
  DPR: window.devicePixelRatio || 1,
  isDrawing: false,
  realX: 0,
  realY: 0,
  virtX: 0,
  virtY: 0,
  velX: 0,
  velY: 0,
  /** @type {PointerEvent|null} */
  lastEvent: null,
};

function resizeCanvas() {
  const { canvas } = settings;
  state.DPR = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(0, Math.floor(rect.width));
  const cssHeight = Math.max(0, Math.floor(rect.height));
  canvas.width = Math.max(1, Math.floor(cssWidth * state.DPR));
  canvas.height = Math.max(1, Math.floor(cssHeight * state.DPR));
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.DPR, state.DPR);
}

window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();

settings.canvas.addEventListener(`pointerdown`, (e) => {
  if (e.pointerType === `touch`) return;

  state.isDrawing = true;

  // Save starting position
  state.realX = e.offsetX;
  state.realY = e.offsetY;
  state.virtX = e.offsetX;
  state.virtY = e.offsetY;

  state.lastEvent = e;

  ctx.beginPath();
  ctx.moveTo(state.virtX, state.virtY);
});

settings.canvas.addEventListener(`pointermove`, (e) => {
  updateDebug(e);
  if (e.pointerType === `touch`) return;
  if (!state.isDrawing) return;

  state.realX = e.offsetX;
  state.realY = e.offsetY;
  state.lastEvent = e;
});

settings.canvas.addEventListener(`pointerup`, (e) => {
  if (e.pointerType === `touch`) return;
  state.isDrawing = false;
});

settings.canvas.addEventListener(`pointerleave`, (e) => {
  if (e.pointerType === `touch`) return;
  state.isDrawing = false;
});

const loop = continuously(() => {
  if (!state.isDrawing) return;
  const { frictionInput, pullInput, weightInput } = settings;

  const weightClamped = Numbers.clamp(+weightInput.value, 0, 100);

  // read damping amt from the slider and scale to a usable range
  const friction = Numbers.scale(+frictionInput.value, 0, 100, 0, 0.7);
  const pull = Numbers.scale(+pullInput.value, 0, 100, 0, 1);
  const weight = Numbers.scale(weightClamped, 0, 100, 0, 40);
  // how hard the spring pulls is proportional to the gap (distance from virt to real)
  // pull scales how aggressive is the pull
  const forceX = (state.realX - state.virtX) * pull;
  const forceY = (state.realY - state.virtY) * pull;

  // velocity wants to move toward the real pointer
  state.velX += forceX / weight;
  state.velY += forceY / weight;

  // apply damping by multiplying velocity by (1-damping) each frame
  // low damping = keeps moving = overshoot
  // high damping = slows fast = less overshoot
  state.velX *= (1 - friction);
  state.velY *= (1 - friction);

  // move virtual pen by velocity
  // if velocity is large enough it will go past the real pointer, the spring then will pull it back
  state.virtX += state.velX;
  state.virtY += state.velY;

  ctx.lineWidth = settings.defaultLineWidth;
  ctx.strokeStyle = settings.strokeStyle;
  ctx.lineCap = settings.lineCap;
  ctx.lineJoin = settings.lineJoin;

  ctx.lineTo(state.virtX, state.virtY);
  ctx.stroke();
});

loop.start();

function updateDebug(e) {
  const type = e.pointerType;
  const x = Math.round(e.offsetX);
  const y = Math.round(e.offsetY);
  const pressure = e.pressure.toFixed(3);
  const tiltX = Math.round(e.tiltX);
  const tiltY = Math.round(e.tiltY);
  const twist = Math.round(e.twist);

  const speed = Math.hypot(state.velX, state.velY).toFixed(1);
  const lag = Math.hypot(state.virtX - state.realX, state.virtY - state.realY).toFixed(1);

  settings.debug.textContent =
    `type: ${type}   |   x: ${x}   y: ${y}   |   pressure: ${pressure}   |   tilt: ${tiltX} / ${tiltY} deg   |   twist: ${twist} deg  |   speed: ${speed}   |   lag: ${lag}px`;
}

function clearCanvas() {
  ctx.clearRect(0, 0, settings.canvas.width / state.DPR, settings.canvas.height / state.DPR);
}

settings.clearBtn.addEventListener(`click`, clearCanvas);

const presets = {
  floaty:     { friction: 24, pull: 95,  weight: 95 },
  quick:      { friction: 47, pull: 82,  weight: 2  },
  lovely:     { friction: 38, pull: 100, weight: 10 },
  slow:       { friction: 59, pull: 44,  weight: 31 },
  eager:      { friction: 67, pull: 30,  weight: 1  },
  easy:       { friction: 28, pull: 82,  weight: 40 },
  rushed:     { friction: 28, pull: 82,  weight: 7  },
  energetic:  { friction: 30, pull: 100, weight: 3  },
  shaky:      { friction: 44, pull: 93,  weight: 1  },
  deliberate: { friction: 36, pull: 66,  weight: 47 },
};

settings.presetsInput.addEventListener(`change`, () => {
  const preset = presets[settings.presetsInput.value];
  if (!preset) return;
  settings.frictionInput.value = String(preset.friction);
  settings.pullInput.value     = String(preset.pull);
  settings.weightInput.value   = String(preset.weight);
  updateSliderDisplays();
});

function updateSliderDisplays() {
  settings.frictionValue.textContent = settings.frictionInput.value;
  settings.pullValue.textContent     = settings.pullInput.value;
  settings.weightValue.textContent   = settings.weightInput.value;
}

settings.frictionInput.addEventListener(`input`, updateSliderDisplays);
settings.pullInput.addEventListener(`input`, updateSliderDisplays);
settings.weightInput.addEventListener(`input`, updateSliderDisplays);
updateSliderDisplays();
