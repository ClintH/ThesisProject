import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

// ─────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────
const cfg = Object.freeze({
  trackHeight: 58,
  trackGap:    10,
  timelineY:   80,
  trackCount:  3,
  razorLerp:   0.18,   // glide factor — system assists the movement
});

// ─────────────────────────────────────────────
//  Clips — no labels, just shape
// ─────────────────────────────────────────────
const clips = [
  { track: 0, x1: 60,  x2: 290 },
  { track: 0, x1: 306, x2: 530 },
  { track: 0, x1: 546, x2: 760 },
  { track: 1, x1: 60,  x2: 350 },
  { track: 1, x1: 366, x2: 680 },
  { track: 2, x1: 60,  x2: 760 },
];

// Per-track hue — track identity without labels
const trackHue = [210, 28, 168];

// ─────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────
let state = {
  tool:         'razor',   // 'razor' | 'scissors'
  pointer:      { x: 0, y: 0 },
  cursorX:      200,
  hoveredTrack: -1,
  onCanvas:     false,
  cuts:         [],
  velX:         0,          // smoothed pointer speed (scissors blade animation)
  prevPointerX: 0,
  frame:        0,          // frame counter (scissors jitter phase)
};

// ─────────────────────────────────────────────
//  Canvas
// ─────────────────────────────────────────────
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

// ─────────────────────────────────────────────
//  Tool switching
// ─────────────────────────────────────────────
function selectTool(t) {
  state.tool = t;
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-${t}`)?.classList.add('active');
}

// ─────────────────────────────────────────────
//  Geometry helpers
// ─────────────────────────────────────────────
function trackY(i)     { return cfg.timelineY + i * (cfg.trackHeight + cfg.trackGap); }
function trackBottom() { return trackY(cfg.trackCount - 1) + cfg.trackHeight; }

function trackAtY(y) {
  for (let i = 0; i < cfg.trackCount; i++) {
    const ty = trackY(i);
    if (y >= ty && y <= ty + cfg.trackHeight) return i;
  }
  return -1;
}

// ─────────────────────────────────────────────
//  Cut action
// ─────────────────────────────────────────────
function onPointerDown() {
  if (!state.onCanvas || state.hoveredTrack < 0) return;
  state.cuts.push({ x: state.cursorX, track: state.hoveredTrack, tool: state.tool });
}

// ─────────────────────────────────────────────
//  Update
// ─────────────────────────────────────────────
function update() {
  const px = state.pointer.x;
  state.frame++;

  // Track pointer speed for scissors blade animation
  const rawVel   = Math.abs(px - state.prevPointerX);
  state.velX     = state.velX * 0.72 + rawVel * 0.28;
  state.prevPointerX = px;

  switch (state.tool) {
    case 'razor':
      // Glides — the system smooths for you, like a blade on rails
      state.cursorX = Numbers.interpolate(cfg.razorLerp, state.cursorX, px);
      break;

    case 'scissors':
      // Direct — you provide every movement, no assistance
      state.cursorX = px;
      break;
  }
}

// ─────────────────────────────────────────────
//  Draw
// ─────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClips();
  drawCuts();
  if (state.onCanvas && state.hoveredTrack >= 0) drawCursor();
}

function drawClips() {
  for (const clip of clips) {
    const y   = trackY(clip.track);
    const w   = clip.x2 - clip.x1;
    const hue = trackHue[clip.track];

    ctx.globalAlpha = 0.72;
    ctx.fillStyle   = `hsl(${hue}, 14%, 26%)`;
    ctx.fillRect(clip.x1, y, w, cfg.trackHeight);

    // Hairline top edge — gives depth without decoration
    ctx.globalAlpha = 0.18;
    ctx.fillStyle   = '#ffffff';
    ctx.fillRect(clip.x1, y, w, 1);

    ctx.globalAlpha = 1;
  }
}

function drawCuts() {
  ctx.setLineDash([]);
  for (const cut of state.cuts) {
    const y = trackY(cut.track);
    const h = cfg.trackHeight;

    if (cut.tool === 'razor') {
      // Single hairline — clean, cold, precise
      ctx.strokeStyle = 'rgba(180,210,255,0.9)';
      ctx.lineWidth   = 0.75;
      line(cut.x, y, cut.x, y + h);
    } else {
      // Double hairline — the two blades of a closed snip
      ctx.strokeStyle = 'rgba(215,210,160,0.8)';
      ctx.lineWidth   = 0.75;
      line(cut.x - 1.5, y, cut.x - 1.5, y + h);
      line(cut.x + 1.5, y, cut.x + 1.5, y + h);
    }
  }
}

// ─────────────────────────────────────────────
//  Cursor drawing
// ─────────────────────────────────────────────
function drawCursor() {
  if (state.tool === 'razor')    drawRazorCursor();
  if (state.tool === 'scissors') drawScissorsCursor();
}

function drawRazorCursor() {
  const x = state.cursorX;
  const y = trackY(state.hoveredTrack);
  const h = cfg.trackHeight;

  ctx.strokeStyle = 'rgba(180,210,255,0.88)';
  ctx.lineWidth   = 0.75;
  ctx.setLineDash([]);
  line(x, y - 14, x, y + h + 14);

  // Small blade wedge at top
  ctx.fillStyle = 'rgba(180,210,255,0.88)';
  ctx.beginPath();
  ctx.moveTo(x - 3.5, y - 21);
  ctx.lineTo(x + 3.5, y - 21);
  ctx.lineTo(x,       y - 12);
  ctx.closePath();
  ctx.fill();
}

function drawScissorsCursor() {
  const x   = state.cursorX;
  const y   = trackY(state.hoveredTrack);
  const h   = cfg.trackHeight;

  // Normalised speed 0–1
  const speed = Math.min(state.velX / 14, 1);

  // Blade angle: nearly closed at rest, opens with movement
  const bladeAngle = 0.07 + speed * 0.46;
  const bladeLen   = 20;

  // Slight y-jitter — conveys the manual effort of scissor cutting
  const jitterY = Math.sin(state.frame * 0.38) * speed * 2.8;
  const cy      = y + h / 2 + jitterY;

  const col = 'rgba(210,205,150,0.92)';
  ctx.strokeStyle = col;
  ctx.lineWidth   = 1.5;
  ctx.lineCap     = 'round';
  ctx.setLineDash([]);

  // Upper blade — pivots from cursor, opens upward
  ctx.beginPath();
  ctx.moveTo(x, cy);
  ctx.lineTo(x - Math.sin(bladeAngle) * bladeLen, cy - Math.cos(bladeAngle) * bladeLen);
  ctx.stroke();

  // Lower blade — pivots from cursor, opens downward
  ctx.beginPath();
  ctx.moveTo(x, cy);
  ctx.lineTo(x - Math.sin(bladeAngle) * bladeLen, cy + Math.cos(bladeAngle) * bladeLen);
  ctx.stroke();

  // Pivot dot
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Faint cut guide — where the cut will land
  ctx.strokeStyle = 'rgba(210,205,150,0.18)';
  ctx.lineWidth   = 1;
  ctx.lineCap     = 'butt';
  ctx.setLineDash([3, 4]);
  line(x, y, x, y + h);
  ctx.setLineDash([]);
}

// ─────────────────────────────────────────────
//  Drawing utilities
// ─────────────────────────────────────────────
function line(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

// ─────────────────────────────────────────────
//  Main loop & init
// ─────────────────────────────────────────────
function tick() {
  update();
  draw();
}

function init() {
  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('pointermove', e => {
    const r            = canvas.getBoundingClientRect();
    state.pointer      = { x: e.clientX - r.left, y: e.clientY - r.top };
    state.hoveredTrack = trackAtY(state.pointer.y);
    state.onCanvas     = true;
  });

  canvas.addEventListener('pointerleave', () => { state.onCanvas = false; });
  canvas.addEventListener('pointerdown',  onPointerDown);

  document.getElementById('btn-razor')?.addEventListener('click',    () => selectTool('razor'));
  document.getElementById('btn-scissors')?.addEventListener('click', () => selectTool('scissors'));

  document.addEventListener('keydown', e => {
    if (e.key === '1') selectTool('razor');
    if (e.key === '2') selectTool('scissors');
    if (e.key === 'Delete' || e.key === 'Backspace') state.cuts = [];
  });

  continuously(tick).start();
}

init();
