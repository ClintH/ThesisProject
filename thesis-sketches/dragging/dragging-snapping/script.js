import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

const canvas = document.getElementById(`canvas`);
const ctx = canvas.getContext(`2d`);
const debug = document.getElementById(`debug`);

const settings = {
  size: 60,
  // Grid sizes selectable by tilt:
  // upright (altitude ~90°) → fine, tilted (~45° or less) → coarse
  gridFine:   80,
  gridCoarse: 2000,
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
  // Pen state captured during drag, used on release
  releasePressure: 0,
  releaseAltitude: Math.PI / 2, // default: upright
  // Fixed physics (not driven by sliders — pen drives behaviour instead)
  friction: 0.18,
  pull:     0.12,
  weight:   1,
};

// ─── Canvas resize ───────────────────────────────────────────────────────────

function resizeCanvas() {
  state.dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));
  canvas.width  = Math.floor(cssW * state.dpr);
  canvas.height = Math.floor(cssH * state.dpr);
  canvas.style.width  = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);
  state.cssW = cssW;
  state.cssH = cssH;

  if (!state.initialized) {
    state.virtX   = (cssW - settings.size) / 2;
    state.virtY   = (cssH - settings.size) / 2;
    state.targetX = state.virtX;
    state.targetY = state.virtY;
    state.initialized = true;
  }
}
window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();

// ─── Hit test & cursor ───────────────────────────────────────────────────────

function hitBody(px, py) {
  return (
    px >= state.virtX && px <= state.virtX + settings.size &&
    py >= state.virtY && py <= state.virtY + settings.size
  );
}

function updateCursor(px, py) {
  if      (state.dragging)   canvas.style.cursor = `grabbing`;
  else if (hitBody(px, py))  canvas.style.cursor = `grab`;
  else                       canvas.style.cursor = `default`;
}

// ─── Snap logic ──────────────────────────────────────────────────────────────

/**
 * Pick grid size from altitude angle.
 * altitude = π/2 → pen upright → fine grid (precise placement)
 * altitude < π/4 → pen tilted  → coarse grid (rough placement)
 */
function gridSizeFromAltitude(altitude) {
  // Normalise: 1 = fully upright, 0 = fully flat
  const t = Numbers.clamp(altitude / (Math.PI / 2), 0, 1);
  // Blend between coarse and fine
  return Math.round(Numbers.scale(t, 0, 1, settings.gridCoarse, settings.gridFine));
}

/**
 * Snap a position to the nearest grid cell corner.
 * Keeps the icon within canvas bounds.
 */
function snapPosition(x, y, gridSize) {
  const snappedX = Math.round(x / gridSize) * gridSize;
  const snappedY = Math.round(y / gridSize) * gridSize;
  return {
    x: Numbers.clamp(snappedX, 0, state.cssW - settings.size),
    y: Numbers.clamp(snappedY, 0, state.cssH - settings.size),
  };
}

/**
 * Decide whether to snap at all, based on release pressure.
 *
 * Pressure mapping:
 *   light (< 0.25) → no snap, icon lands exactly where dropped
 *   medium (0.25–0.6) → snaps to coarse grid regardless of tilt
 *   hard (> 0.6) → snaps to tilt-selected grid (fine or coarse)
 *
 * Think of it as: how deliberately are you placing it?
 */
function resolveDropTarget(rawX, rawY, pressure, altitude) {
  if (pressure < 0.25) {
    // Light touch → free drop, no snap
    return { x: rawX, y: rawY };
  }
  if (pressure < 0.6) {
    // Medium press → always coarse snap (safe landing zone)
    return snapPosition(rawX, rawY, settings.gridCoarse);
  }
  // Hard press → tilt selects fine vs coarse grid
  const gridSize = gridSizeFromAltitude(altitude);
  return snapPosition(rawX, rawY, gridSize);
}

// ─── Pointer events ──────────────────────────────────────────────────────────

canvas.addEventListener(`pointerdown`, (e) => {
  const x = e.offsetX, y = e.offsetY;
  if (hitBody(x, y)) {
    state.dragging    = true;
    state.dragOffsetX = x - state.virtX;
    state.dragOffsetY = y - state.virtY;
    canvas.setPointerCapture(e.pointerId);
  }
});

canvas.addEventListener(`pointermove`, (e) => {
  const x = e.offsetX, y = e.offsetY;
  updateCursor(x, y);

  if (state.dragging) {
    // Track raw cursor — no snap during drag, just like macOS
    state.targetX = Numbers.clamp(x - state.dragOffsetX, 0, state.cssW - settings.size);
    state.targetY = Numbers.clamp(y - state.dragOffsetY, 0, state.cssH - settings.size);

    // Keep updating pen state throughout drag so we have fresh values on release
    if (e.pointerType === `pen`) {
      state.releasePressure = e.pressure ?? 0;
      state.releaseAltitude = e.altitudeAngle ?? Math.PI / 2;
    }
  }

  updateDebug(e);
});

canvas.addEventListener(`pointerup`, (e) => {
  if (state.dragging) {
    // ── The key moment: resolve where the icon should land ──
    const dropped = resolveDropTarget(
      state.targetX,
      state.targetY,
      e.pointerType === `pen` ? (e.pressure ?? state.releasePressure) : 0.8,
      e.pointerType === `pen` ? (e.altitudeAngle ?? state.releaseAltitude) : Math.PI / 2,
    );

    // Set target to resolved position — spring animates the icon there
    state.targetX = dropped.x;
    state.targetY = dropped.y;
  }
  state.dragging = false;
});

canvas.addEventListener(`pointercancel`, () => { state.dragging = false; });

// ─── Physics loop ────────────────────────────────────────────────────────────

const loop = continuously(() => {
  const forceX = (state.targetX - state.virtX) * state.pull;
  const forceY = (state.targetY - state.virtY) * state.pull;

  state.velX += forceX / state.weight;
  state.velY += forceY / state.weight;
  state.velX *= (1 - state.friction);
  state.velY *= (1 - state.friction);
  state.virtX += state.velX;
  state.virtY += state.velY;

  draw();
});
loop.start();

// ─── Draw ─────────────────────────────────────────────────────────────────────

function draw() {
  ctx.clearRect(0, 0, state.cssW, state.cssH);

  const { virtX, virtY } = state;
  const s = settings.size;

  ctx.fillStyle = `rgb(0, 0, 0)`;
  ctx.fillRect(virtX, virtY, s, s);
}

// ─── Debug ────────────────────────────────────────────────────────────────────

function updateDebug(e) {
  const pressure = e.pointerType === `pen` ? (e.pressure ?? 0) : null;
  const altitude = e.pointerType === `pen` && e.altitudeAngle != null
    ? `${(e.altitudeAngle * 180 / Math.PI).toFixed(0)}°`
    : `N/A`;

  const snapMode = pressure == null ? `mouse`
    : pressure < 0.25 ? `free drop`
    : pressure < 0.6  ? `coarse snap`
    : `${gridSizeFromAltitude(e.altitudeAngle ?? Math.PI / 2)}px grid`;

  debug.textContent =
    `type: ${e.pointerType}   |   ` +
    (pressure != null ? `pressure: ${pressure.toFixed(2)}   |   altitude: ${altitude}   |   ` : ``) +
    `mode: ${snapMode}`;
}