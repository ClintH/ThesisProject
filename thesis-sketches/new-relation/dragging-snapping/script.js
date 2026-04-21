import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(`canvas`));
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext(`2d`));
const debug = /** @type {HTMLElement} */ (document.getElementById(`debug`));

const settings = {
  iconSize: 64,
  gridSize: 100,
  menubarHeight: 28,
  friction: 0.25,
  pull: 0.12,
  iconDefs: [
    { label: `Browser`, emoji: `🌐`, color: `#3B82F6` },
    { label: `Files`, emoji: `📁`, color: `#F59E0B` },
    { label: `Music`, emoji: `🎵`, color: `#EC4899` },
    { label: `Photos`, emoji: `🖼`, color: `#10B981` },
    { label: `Mail`, emoji: `✉️`, color: `#8B5CF6` },
    { label: `Settings`, emoji: `⚙️`, color: `#6B7280` },
    { label: `Notes`, emoji: `📝`, color: `#F97316` },
    { label: `Calendar`, emoji: `📅`, color: `#EF4444` },
  ],
};

settings.icons = settings.iconDefs.map((def) => ({
  ...def,
  virtX: 0,
  virtY: 0,
  velX: 0,
  velY: 0,
  targetX: 0,
  targetY: 0,
}));

const state = {
  dpr: window.devicePixelRatio || 1,
  cssW: 0,
  cssH: 0,
  dragging: false,
  activeIdx: -1,
  dragOffsetX: 0,
  dragOffsetY: 0,
  rawX: 0,
  rawY: 0,
  lastPressure: 0,
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
    const g = settings.gridSize;
    settings.icons.forEach((icon, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      icon.virtX = icon.targetX = g + col * g;
      icon.virtY = icon.targetY = g + row * g;
    });
    state.initialized = true;
  }
}
window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();


function hitIcon(px, py) {
  const s = settings.iconSize;
  const { icons } = settings;
  for (let i = icons.length - 1; i >= 0; i--) {
    const ic = icons[i];
    if (px >= ic.virtX && px <= ic.virtX + s && py >= ic.virtY && py <= ic.virtY + s) {
      return i;
    }
  }
  return -1;
}

function snapPosition(x, y) {
  const g = settings.gridSize;
  const s = settings.iconSize;
  return {
    x: Numbers.clamp(Math.round(x / g) * g, 0, state.cssW - s),
    y: Numbers.clamp(Math.round(y / g) * g, settings.menubarHeight, state.cssH - s - 20),
  };
}

function snapWithPressure(rawX, rawY, pressure) {
  const snapped = snapPosition(rawX, rawY);
  const t = Numbers.clamp(pressure, 0, 1);
  return {
    x: snapped.x * (1 - t) + rawX * t,
    y: snapped.y * (1 - t) + rawY * t,
  };
}

canvas.addEventListener(`pointerdown`, (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  const idx = hitIcon(x, y);
  if (idx !== -1) {
    state.dragging = true;
    state.activeIdx = idx;
    state.dragOffsetX = x - settings.icons[idx].virtX;
    state.dragOffsetY = y - settings.icons[idx].virtY;
    canvas.setPointerCapture(e.pointerId);
  }
});

canvas.addEventListener(`pointermove`, (e) => {
  const x = e.offsetX;
  const y = e.offsetY;

  if (state.dragging && state.activeIdx !== -1) {
    const icon = settings.icons[state.activeIdx];
    const s = settings.iconSize;
    const rawX = Numbers.clamp(x - state.dragOffsetX, 0, state.cssW - s);
    const rawY = Numbers.clamp(y - state.dragOffsetY, settings.menubarHeight, state.cssH - s - 20);

    // Store raw position and latest pressure for use at drop time
    state.rawX = rawX;
    state.rawY = rawY;
    const pressure = e.pointerType === `pen` ? (e.pressure ?? 0) : 0;
    if (e.pointerType === `pen`) state.lastPressure = pressure;

    // During drag: pressure controls snap live
    const pos = snapWithPressure(rawX, rawY, pressure);
    icon.targetX = pos.x;
    icon.targetY = pos.y;
    updateDebug(e);
  } else {
    const idx = hitIcon(x, y);
    canvas.style.cursor = idx !== -1 ? `grab` : `default`;
  }
});

canvas.addEventListener(`pointerup`, (e) => {
  if (state.dragging && state.activeIdx !== -1) {
    const icon = settings.icons[state.activeIdx];
    // Use lastPressure from pointermove — pointerup pressure is 0 on lift
    const pressure = e.pointerType === `pen` ? state.lastPressure : 0;
    const pos = snapWithPressure(state.rawX, state.rawY, pressure);
    icon.targetX = pos.x;
    icon.targetY = pos.y;
    state.lastPressure = 0;
  }
  if (state.dragging) canvas.style.cursor = `grab`;
  state.dragging = false;
  state.activeIdx = -1;
});

canvas.addEventListener(`pointercancel`, () => {
  state.dragging = false;
  state.activeIdx = -1;
});

// ─── Physics loop ─────────────────────────────────────────────────────────────

const loop = continuously(() => {
  for (const icon of settings.icons) {
    const fx = (icon.targetX - icon.virtX) * settings.pull;
    const fy = (icon.targetY - icon.virtY) * settings.pull;
    icon.velX = (icon.velX + fx) * (1 - settings.friction);
    icon.velY = (icon.velY + fy) * (1 - settings.friction);
    icon.virtX += icon.velX;
    icon.virtY += icon.velY;
  }
  draw();
});
loop.start();

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, state.cssW, state.cssH);
  grad.addColorStop(0, `#0f0c29`);
  grad.addColorStop(0.5, `#1a1a4e`);
  grad.addColorStop(1, `#24243e`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, state.cssW, state.cssH);
}

function rrect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawIcon(icon, active) {
  const { virtX: x, virtY: y } = icon;
  const s = settings.iconSize;

  ctx.save();
  ctx.shadowColor = active ? `rgba(0,0,0,0.7)` : `rgba(0,0,0,0.35)`;
  ctx.shadowBlur = active ? 28 : 12;
  ctx.shadowOffsetY = active ? 12 : 5;
  ctx.fillStyle = icon.color;
  rrect(x, y, s, s, 14);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = `transparent`;
  ctx.fillStyle = `white`;
  ctx.font = `${Math.round(s * 0.48)}px serif`;
  ctx.textAlign = `center`;
  ctx.textBaseline = `middle`;
  ctx.fillText(icon.emoji, x + s / 2, y + s / 2);
  ctx.restore();

  ctx.save();
  ctx.font = `bold 11px -apple-system, system-ui, sans-serif`;
  ctx.fillStyle = `rgba(255,255,255,0.92)`;
  ctx.textAlign = `center`;
  ctx.textBaseline = `top`;
  ctx.shadowColor = `rgba(0,0,0,0.9)`;
  ctx.shadowBlur = 6;
  ctx.fillText(icon.label, x + s / 2, y + s + 5);
  ctx.restore();
}

function drawMenubar() {
  const h = settings.menubarHeight;
  ctx.fillStyle = `rgba(0,0,0,0.45)`;
  ctx.fillRect(0, 0, state.cssW, h);
  ctx.strokeStyle = `rgba(255,255,255,0.08)`;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(state.cssW, h);
  ctx.stroke();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: `2-digit`, minute: `2-digit` });
  ctx.font = `12px -apple-system, system-ui, sans-serif`;
  ctx.fillStyle = `rgba(255,255,255,0.8)`;
  ctx.textAlign = `right`;
  ctx.textBaseline = `middle`;
  ctx.fillText(timeStr, state.cssW - 14, h / 2);

  ctx.textAlign = `left`;
  ctx.fillText(`Desktop`, 14, h / 2);
}

function draw() {
  ctx.clearRect(0, 0, state.cssW, state.cssH);
  drawBackground();

  const { icons } = settings;
  icons.forEach((icon, i) => {
    if (i !== state.activeIdx) drawIcon(icon, false);
  });
  if (state.activeIdx !== -1) drawIcon(icons[state.activeIdx], true);

  drawMenubar();
}

function updateDebug(e) {
  const pressure = e.pointerType === `pen` ? (e.pressure ?? 0) : null;
  const snapPct = pressure == null ? 100 : Math.round((1 - Numbers.clamp(pressure, 0, 1)) * 100);
  debug.textContent =
    `type: ${e.pointerType}` +
    (pressure != null ? `   |   pressure: ${pressure.toFixed(2)}` : ``) +
    `   |   snap: ${snapPct}%`;
}
