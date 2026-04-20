import * as Numbers from "@ixfx/numbers.js";
import { PointTracker } from "@ixfx/geometry.js";

// ─── SETTINGS ─────────────────────────────────────────────
const settings = {
  blockCount:   120,
  blockGap:     8,
  snapInterval: 90,
  snapDamping:  0.05,
  bumpFreq:     0.3,
  bumpAmp:      0.9,
  zones: [
    { name: 'sticky',   gain: (d, _o)      => d * 0.15 },
    { name: 'slippery', gain: (d, _o)      => d * 4.0  },
    { name: 'bumpy',    gain: (d, o, s)    => d * (1 + Math.sin(o * s.bumpFreq) * s.bumpAmp) },
    { name: 'magnetic', gain: (d, _o, _s)  => d * 1.0  },
  ],
};

// ─── STATE ────────────────────────────────────────────────
const state = {
  // canvas
  dpr:  1,
  cssW: 0,
  cssH: 0,

  // scroll
  contentOffset: 0,
  contentH:      0,

  // pointer
  scrolling:   false,
  activeZone:  0,
  stylusX:     0,
  stylusY:     0,
  pointerType: '',
  pressure:    0,

  // content
  blocks: [],
  blockY: [],
};

// ─── SETUP ────────────────────────────────────────────────
const canvas  = document.getElementById('canvas');
const ctx     = canvas.getContext('2d');
const debug   = document.getElementById('debug');
const tracker = new PointTracker();

function buildBlocks() {
  state.blocks = Array.from({ length: settings.blockCount }, (_, i) => ({
    height: 28 + (i % 9) * 12,
  }));

  state.blockY = [];
  let y = 0;
  for (const b of state.blocks) {
    state.blockY.push(y);
    y += b.height + settings.blockGap;
  }
  state.contentH = y - settings.blockGap;
}

// ─── RESIZE ───────────────────────────────────────────────
function resize() {
  state.dpr  = window.devicePixelRatio || 1;
  state.cssW = window.innerWidth;
  state.cssH = window.innerHeight - (debug.offsetHeight || 28);

  canvas.width        = Math.floor(state.cssW * state.dpr);
  canvas.height       = Math.floor(state.cssH * state.dpr);
  canvas.style.width  = state.cssW + 'px';
  canvas.style.height = state.cssH + 'px';

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);
}

// ─── HELPERS ──────────────────────────────────────────────
const clampOffset = (v) =>
  Numbers.clamp(v, 0, state.contentH - state.cssH);

const getZoneIndex = (y) =>
  Math.floor(Numbers.scaleClamped(y, 0, state.cssH, 0, settings.zones.length));

// ─── POINTER ──────────────────────────────────────────────
canvas.addEventListener('pointerdown', e => {
  canvas.setPointerCapture(e.pointerId);
  tracker.seen({ x: e.offsetX, y: e.offsetY });
  state.scrolling = true;
});

canvas.addEventListener('pointermove', e => {
  state.stylusX    = e.offsetX;
  state.stylusY    = e.offsetY;
  state.pressure   = e.pressure;
  state.pointerType = e.pointerType || 'mouse';
  state.activeZone  = getZoneIndex(e.offsetY);

  if (state.scrolling) {
    const info  = tracker.seen({ x: e.offsetX, y: e.offsetY });
    // fromLast.centroid.y is the midpoint between the last two points,
    // so subtracting the current y gives us a clean signed delta
    const delta = info.fromLast.centroid.y - e.offsetY;
    const zone  = settings.zones[state.activeZone];
    const moved = zone.gain(delta, state.contentOffset, settings);
    state.contentOffset = clampOffset(state.contentOffset - moved);
  }

  updateDebug();
});

canvas.addEventListener('pointerup',     stopScroll);
canvas.addEventListener('pointercancel', stopScroll);

function stopScroll() {
  state.scrolling = false;
  tracker.reset();
}

// ─── DEBUG ────────────────────────────────────────────────
function updateDebug() {
  const { stylusX, stylusY, pressure, activeZone, contentOffset, pointerType } = state;
  debug.textContent =
    `x ${Math.round(stylusX)}  y ${Math.round(stylusY)}  ·  ` +
    `pressure ${pressure.toFixed(3)}  ·  ` +
    `zone ${settings.zones[activeZone].name}  ·  ` +
    `offset ${Math.round(contentOffset)}  ·  ` +
    `type ${pointerType}`;
}

// ─── DRAW ─────────────────────────────────────────────────
function draw() {
  const { cssW, cssH, activeZone, blocks, blockY } = state;
  const { zones } = settings;

  // Magnetic zone: continuously lerp toward the nearest snap point
  if (zones[activeZone].name === 'magnetic' && !state.scrolling) {
    const nearest = Math.round(state.contentOffset / settings.snapInterval) * settings.snapInterval;
    state.contentOffset = clampOffset(
      Numbers.interpolate(settings.snapDamping, state.contentOffset, nearest)
    );
  }

  ctx.clearRect(0, 0, cssW, cssH);

  // Blocks
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, cssW, cssH);
  ctx.clip();

  for (let i = 0; i < blocks.length; i++) {
    const b  = blocks[i];
    const dy = blockY[i] - state.contentOffset;
    if (dy + b.height < 0) continue;
    if (dy > cssH) break;

    const bw = cssW * 0.5;
    const bx = (cssW - bw) / 2;
    ctx.fillStyle = `hsl(70, 0%, 70%)`;
    ctx.fillRect(bx, dy, bw, b.height);
  }

  ctx.restore();
  requestAnimationFrame(draw);
}

// ─── INIT ─────────────────────────────────────────────────
buildBlocks();
window.addEventListener('resize', resize);
resize();
draw();