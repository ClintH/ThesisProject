import { continuously } from "@ixfx/flow.js";

const canvas = document.getElementById(`canvas`);
const ctx    = canvas.getContext(`2d`);
const debug  = document.getElementById(`debug`);

// ─── ZONES ────────────────────────────────────────────────
// Each zone applies a different gain to the stylus delta,
// creating pseudo-haptic resistance/slippage/texture.
const zones = [
  {
    name:  `normal`,
    label: `Normal`,
    desc:  `1 : 1`,
    color: `#e8e8e8`,
    // Content moves exactly with stylus
    apply(delta, _offset) { return delta * 1.0; },
  },
  {
    name:  `sticky`,
    label: `Sticky`,
    desc:  `slow / resistant`,
    color: `#c4c4c4`,
    // Content barely moves — feels thick, resistant
    apply(delta, _offset) { return delta * 0.2; },
  },
  {
    name:  `slippery`,
    label: `Slippery`,
    desc:  `fast / loose`,
    color: `#f4f4f4`,
    // Content races ahead — feels frictionless, hard to place
    apply(delta, _offset) { return delta * 3.5; },
  },
  {
    name:  `bumpy`,
    label: `Bumpy`,
    desc:  `oscillating`,
    color: `#d8d8d8`,
    // Gain oscillates — feels like ridges or texture
    apply(delta, offset) {
      const osc = Math.sin(offset * 0.07) * 0.85;
      return delta * (1 + osc);
    },
  },
  {
    name:  `magnetic`,
    label: `Magnetic`,
    desc:  `snapping`,
    color: `#d0d0d0`,
    // Content is pulled toward snap points — feels like detents
    apply(delta, offset) {
      const SNAP    = 80;
      const nearest = Math.round(offset / SNAP) * SNAP;
      const pull    = (nearest - offset) * 0.25;
      return delta * 0.9 + pull;
    },
  },
  
];

// ─── CONTENT ──────────────────────────────────────────────
// A long strip of blocks — abstract, just something to scroll through.
const BLOCK_GAP   = 6;
const BLOCK_COUNT = 80;

const blocks = Array.from({ length: BLOCK_COUNT }, (_, i) => ({
  width: 36 + (i % 7) * 14,
  hue:   (i * 41) % 360,
  label: i + 1,
}));

// Precompute cumulative x positions
const blockX = [];
{
  let x = 0;
  for (const b of blocks) { blockX.push(x); x += b.width + BLOCK_GAP; }
}
const CONTENT_TOTAL_W = blockX[blockX.length - 1] + blocks[blocks.length - 1].width;

// ─── STATE ────────────────────────────────────────────────
let DPR        = window.devicePixelRatio || 1;
let cssWidth   = 0;
let cssHeight  = 0;

let contentOffset = 0;   // how far into the content strip we are
let isScrolling   = false;
let lastX         = null;
let activeZone    = 0;
let stylusX       = 0;
let stylusY       = 0;

// ─── RESIZE ───────────────────────────────────────────────
function resizeCanvas() {
  DPR = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  cssWidth  = Math.max(1, Math.floor(rect.width));
  cssHeight = Math.max(1, Math.floor(rect.height));
  canvas.width         = Math.floor(cssWidth  * DPR);
  canvas.height        = Math.floor(cssHeight * DPR);
  canvas.style.width   = `${cssWidth}px`;
  canvas.style.height  = `${cssHeight}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(DPR, DPR);
}
window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();

// ─── POINTER EVENTS ───────────────────────────────────────
canvas.addEventListener(`pointerdown`, (e) => {
  if (e.pointerType === `touch`) return;
  isScrolling = true;
  lastX       = e.offsetX;
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener(`pointermove`, (e) => {
  stylusX = e.offsetX;
  stylusY = e.offsetY;
  activeZone = Math.min(
    Math.floor(stylusX / cssWidth * zones.length),
    zones.length - 1
  );

  if (isScrolling && lastX !== null) {
    const delta   = e.offsetX - lastX;
    lastX         = e.offsetX;

    // Apply zone behavior — positive delta (drag right) reveals earlier content
    const dContent = zones[activeZone].apply(delta, contentOffset);
    contentOffset  = clampOffset(contentOffset - dContent);
  }

  updateDebug(e);
});

canvas.addEventListener(`pointerup`,     stopScroll);
canvas.addEventListener(`pointercancel`, stopScroll);
function stopScroll() { isScrolling = false; lastX = null; }

function clampOffset(v) {
  return Math.max(0, Math.min(CONTENT_TOTAL_W - cssWidth, v));
}

// ─── DRAW ─────────────────────────────────────────────────
const ZONE_H    = 0.30;  // top 30% of canvas = zone labels
const STRIP_TOP = 0.38;  // content strip starts here
const STRIP_H   = 88;
const TRACK_Y   = 0.82;  // two-track comparison area

continuously(() => {

  // Magnetic zone: also apply continuous snap while dragging
  // so the pull is felt even mid-stroke
  if (zones[activeZone].name === `magnetic`) {
    const SNAP    = 80;
    const nearest = Math.round(contentOffset / SNAP) * SNAP;
    contentOffset = clampOffset(contentOffset + (nearest - contentOffset) * 0.04);
  }

  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const zoneW  = cssWidth / zones.length;
  const stripY = cssHeight * STRIP_TOP;
  const trackY = cssHeight * TRACK_Y;

  // ── Zone columns ─────────────────────────────────────
  zones.forEach((zone, i) => {
    const x        = i * zoneW;
    const isActive = i === activeZone;

    ctx.fillStyle = isActive ? `#d4d4d4` : zone.color;
    ctx.fillRect(x, 0, zoneW, cssHeight * ZONE_H);

    ctx.strokeStyle = `#aaa`;
    ctx.lineWidth   = 1;
    ctx.strokeRect(x + 0.5, 0.5, zoneW - 1, cssHeight * ZONE_H - 1);

    ctx.fillStyle  = `#111`;
    ctx.font       = `bold 13px 'Courier New', monospace`;
    ctx.textAlign  = `center`;
    ctx.fillText(zone.label, x + zoneW / 2, cssHeight * ZONE_H * 0.42);

    ctx.fillStyle = `#666`;
    ctx.font      = `11px 'Courier New', monospace`;
    ctx.fillText(zone.desc, x + zoneW / 2, cssHeight * ZONE_H * 0.70);
  });

  // Active zone column highlight (full height, subtle)
  ctx.fillStyle = `rgba(0, 0, 0, 0.03)`;
  ctx.fillRect(activeZone * zoneW, 0, zoneW, cssHeight);

  // ── Content strip ────────────────────────────────────
  ctx.fillStyle = `#f0f0f0`;
  ctx.fillRect(0, stripY, cssWidth, STRIP_H);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, stripY, cssWidth, STRIP_H);
  ctx.clip();

  for (let i = 0; i < blocks.length; i++) {
    const b  = blocks[i];
    const dx = blockX[i] - contentOffset;
    if (dx + b.width < 0) continue;
    if (dx > cssWidth)    break;

    ctx.fillStyle = `hsl(${b.hue}, 12%, 62%)`;
    ctx.fillRect(dx, stripY + 10, b.width, STRIP_H - 20);

    ctx.fillStyle  = `rgba(0,0,0,0.35)`;
    ctx.font       = `10px 'Courier New', monospace`;
    ctx.textAlign  = `center`;
    ctx.fillText(b.label, dx + b.width / 2, stripY + STRIP_H / 2 + 4);
  }
  ctx.restore();

  ctx.strokeStyle = `#c0c0c0`;
  ctx.lineWidth   = 1;
  ctx.strokeRect(0, stripY, cssWidth, STRIP_H);

  // ── Two-track visualization ───────────────────────────
  // Shows the decoupling between where the stylus IS
  // and where the content IS — this is the mechanism made visible.

  ctx.strokeStyle = `#ddd`;
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.moveTo(0, trackY);      ctx.lineTo(cssWidth, trackY);      ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, trackY + 28); ctx.lineTo(cssWidth, trackY + 28); ctx.stroke();

  ctx.font      = `10px 'Courier New', monospace`;
  ctx.textAlign = `left`;
  ctx.fillStyle = `#999`;
  ctx.fillText(`stylus`,  10, trackY - 5);
  ctx.fillText(`content`, 10, trackY + 22);

  // Stylus dot — actual hand position
  ctx.fillStyle = `#222`;
  ctx.beginPath();
  ctx.arc(stylusX, trackY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Content dot — where content has ended up (mapped to screen width)
  const maxOffset  = Math.max(1, CONTENT_TOTAL_W - cssWidth);
  const contentDotX = (contentOffset / maxOffset) * cssWidth;
  ctx.fillStyle = `#222`;
  ctx.beginPath();
  ctx.arc(contentDotX, trackY + 28, 5, 0, Math.PI * 2);
  ctx.fill();

  // ── Stylus crosshair ─────────────────────────────────
  ctx.strokeStyle = `rgba(0,0,0,0.12)`;
  ctx.lineWidth   = 1;
  ctx.setLineDash([3, 6]);
  ctx.beginPath();
  ctx.moveTo(stylusX, 0);
  ctx.lineTo(stylusX, cssHeight);
  ctx.stroke();
  ctx.setLineDash([]);

}).start();

// ─── DEBUG ────────────────────────────────────────────────
function updateDebug(e) {
  debug.textContent =
    `type: ${e.pointerType}  |  ` +
    `x: ${Math.round(e.offsetX)}  y: ${Math.round(e.offsetY)}  |  ` +
    `pressure: ${e.pressure.toFixed(3)}  |  ` +
    `zone: ${zones[activeZone].label}  |  ` +
    `offset: ${Math.round(contentOffset)}`;
}