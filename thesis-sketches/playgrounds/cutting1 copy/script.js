import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

const settings = Object.freeze({
  trackH:   52,
  trackGap: 6,
  padX:     28,   // left/right canvas padding
 
  /** Physics presets per tool.
   *  Razor  — low X pull + very low X friction → momentum glide
   *           high Y pull + high Y friction    → snaps vertically
   *  Scissors — balanced pull + medium friction → tight follow
   *             small random Y noise           → feels manual/imprecise
   */
  physics: Object.freeze({
    razor: Object.freeze({
      pullX: 0.90, frictionX: 0.52,
      pullY: 0.09, frictionY: 0.022,
      weight: 9,
      noise:  0,
    }),
    scissors: Object.freeze({
      pullX: 0.56, frictionX: 0.40,
      pullY: 0.56, frictionY: 0.40,
      weight: 1.8,
      noise:  0.55,
    }),
  }),
 
  /** Initial clip layout — s/e as fractions 0–1, hue in degrees */
  initialTracks: Object.freeze([
    Object.freeze([
      Object.freeze({ s: 0.03, e: 0.27, hue: 210 }),
      Object.freeze({ s: 0.32, e: 0.60, hue: 210 }),
      Object.freeze({ s: 0.65, e: 0.96, hue: 210 }),
    ]),
  ]),
});
 
// ─────────────────────────────────────────────────────────────────────────────
// State  (all mutable runtime data lives here)
// ─────────────────────────────────────────────────────────────────────────────
let state = {
  // Tool
  tool: 'razor',
 
  // Pointer
  pointerIn: false,
  pressing:  false,
  realX: 0,
  realY: 0,
 
  // Virtual cursor (physics-driven)
  virtX:    0,
  virtY:    0,
  velX:     0,
  velY:     0,
  virtInit: false,
 
  // Scissors organic noise accumulator
  noiseT: 0,
 
  // Canvas / layout (computed in resize)
  canvasW:     0,
  canvasH:     0,
  dpr:         window.devicePixelRatio || 1,
  timelineTop: 0,
 
  // Tracks: array of clip arrays  { s, e, hue }
  tracks: settings.initialTracks.map(track => track.map(clip => ({ ...clip }))),
};
 
/** Merge partial updates into state — ixfx-style immutable-ish update helper */
const saveState = (patch) => { state = { ...state, ...patch }; };
 
// ─────────────────────────────────────────────────────────────────────────────
// Canvas
// ─────────────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
 
// ─────────────────────────────────────────────────────────────────────────────
// Geometry helpers  (read from state / settings, no side-effects)
// ─────────────────────────────────────────────────────────────────────────────
const trackTop  = (i) => state.timelineTop + i * (settings.trackH + settings.trackGap);
const trackCY   = (i) => trackTop(i) + settings.trackH / 2;
const trackW    = ()  => state.canvasW - settings.padX * 2;
const toFrac    = (x) => (x - settings.padX) / trackW();
const fromFrac  = (f) => settings.padX + f * trackW();
 
/** Returns track index for a given y, or -1 */
function trackAtY(y) {
  for (let i = 0; i < state.tracks.length; i++) {
    if (y >= trackTop(i) && y <= trackTop(i) + settings.trackH) return i;
  }
  return -1;
}
 
/** Returns the centre-y of whichever track is nearest to y */
function nearestTrackCY(y) {
  let best = -1, bestDist = Infinity;
  for (let i = 0; i < state.tracks.length; i++) {
    const d = Math.abs(y - trackCY(i));
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best >= 0 ? trackCY(best) : y;
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Cut logic
// ─────────────────────────────────────────────────────────────────────────────
function doCut(x) {
  const f = Numbers.clamp(toFrac(x), 0, 1);
  if (f <= 0.002 || f >= 0.998) return;
 
  const tracks = state.tracks.map(track =>
    track.flatMap(clip => {
      if (f > clip.s + 0.006 && f < clip.e - 0.006) {
        return [
          { s: clip.s, e: f,      hue: clip.hue },
          { s: f,      e: clip.e, hue: clip.hue },
        ];
      }
      return [clip];
    })
  );
 
  saveState({ tracks });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Draw helpers
// ─────────────────────────────────────────────────────────────────────────────
 
/** Rounded rect — uses native ctx.roundRect when available */
function drawRoundRect(x, y, w, h, r) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
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
 
function drawTimeline() {
  const { tracks }            = state;
  const { padX, trackH }     = settings;
  const tw = trackW();
 
  for (let ti = 0; ti < tracks.length; ti++) {
    const ty = trackTop(ti);
 
    // Track background
    ctx.fillStyle = '#191919';
    ctx.beginPath();
    drawRoundRect(padX, ty, tw, trackH, 3);
    ctx.fill();
 
    // Clips
    for (const clip of tracks[ti]) {
      const cx = fromFrac(clip.s);
      const cw = fromFrac(clip.e) - cx;
 
      ctx.fillStyle = `hsl(${clip.hue} 25% 24%)`;
      ctx.beginPath();
      drawRoundRect(cx + 1, ty + 1, cw - 2, trackH - 2, 2);
      ctx.fill();
 
      ctx.strokeStyle = `hsl(${clip.hue} 30% 34%)`;
      ctx.lineWidth   = 0.75;
      ctx.stroke();
    }
  }
}
 
function drawCursor() {
  const { pointerIn, pressing, tool, virtX, virtY, canvasW, tracks } = state;
  const { padX, trackH } = settings;
 
  if (!pointerIn) return;
 
  const onTrack = trackAtY(virtY) >= 0;
  ctx.save();
 
  // Razor: faint horizontal rail hint
  if (tool === 'razor' && !pressing) {
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth   = 0.5;
    ctx.setLineDash([2, 10]);
    ctx.beginPath();
    ctx.moveTo(padX, virtY);
    ctx.lineTo(canvasW - padX, virtY);
    ctx.stroke();
    ctx.setLineDash([]);
  }
 
  // Vertical cut line (only over tracks, or while pressing)
  if (onTrack || pressing) {
    const lineAlpha = pressing ? 0.92 : (tool === 'razor' ? 0.50 : 0.46);
    ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
    ctx.lineWidth   = pressing ? 1.5 : 1;
 
    for (let ti = 0; ti < tracks.length; ti++) {
      const ty = trackTop(ti);
      ctx.beginPath();
      ctx.moveTo(virtX, ty + 2);
      ctx.lineTo(virtX, ty + trackH - 2);
      ctx.stroke();
    }
  }
 
  // Cursor dot
  const dotRadius = pressing ? 2.5 : 3;
  const dotAlpha  = pressing ? 0.95 : 0.52;
  ctx.beginPath();
  ctx.arc(virtX, virtY, dotRadius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${dotAlpha})`;
  ctx.fill();
 
  ctx.restore();
}
 
function draw() {
  ctx.clearRect(0, 0, state.canvasW, state.canvasH);
  drawTimeline();
  drawCursor();
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Physics update  (called every frame by ixfx continuously)
// ─────────────────────────────────────────────────────────────────────────────
function update() {
  const { pointerIn, virtInit, realX, realY, virtX, virtY, velX, velY,
          tool, pressing, noiseT } = state;
 
  if (!pointerIn) return;
 
  if (!virtInit) {
    saveState({ virtX: realX, virtY: realY, virtInit: true });
    return;
  }
 
  const ph = settings.physics[tool];
 
  // Razor while cutting: lock Y to nearest track centre
  const targetY = (tool === 'razor' && pressing)
    ? nearestTrackCY(realY)
    : realY;
 
  // Spring force → velocity → position
  let newVelX = velX + (realX - virtX) * ph.pullX / ph.weight;
  let newVelY = velY + (targetY - virtY) * ph.pullY / ph.weight;
  newVelX *= (1 - ph.frictionX);
  newVelY *= (1 - ph.frictionY);
 
  // Scissors: organic Y/X noise (simulates manual imprecision)
  let newNoiseT = noiseT;
  if (ph.noise > 0) {
    newNoiseT += 0.11;
    const n = Math.sin(newNoiseT * 2.7) * Math.cos(newNoiseT * 0.9 + 1.3);
    newVelY += n * ph.noise * 0.22;
    newVelX += (Math.random() - 0.5) * ph.noise * 0.04;
  }
 
  saveState({
    virtX:  virtX + newVelX,
    virtY:  virtY + newVelY,
    velX:   newVelX,
    velY:   newVelY,
    noiseT: newNoiseT,
  });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Main loop  — ixfx `continuously` replaces raw requestAnimationFrame
// ─────────────────────────────────────────────────────────────────────────────
continuously(() => {
  update();
  draw();
}).start();
 
// ─────────────────────────────────────────────────────────────────────────────
// Resize
// ─────────────────────────────────────────────────────────────────────────────
function resize() {
  const dpr     = window.devicePixelRatio || 1;
  const toolbar = document.getElementById('toolbar');
  const tbH     = toolbar?.offsetHeight ?? 0;
  const canvasW = window.innerWidth;
  const canvasH = window.innerHeight - tbH;
 
  canvas.style.width  = `${canvasW}px`;
  canvas.style.height = `${canvasH}px`;
  canvas.width  = Math.round(canvasW * dpr);
  canvas.height = Math.round(canvasH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 
  const { trackH, trackGap } = settings;
  const totalH     = state.tracks.length * trackH + (state.tracks.length - 1) * trackGap;
  const timelineTop = (canvasH - totalH) / 2;
 
  saveState({ dpr, canvasW, canvasH, timelineTop });
}
 
window.addEventListener('resize', resize);
resize();
 
// ─────────────────────────────────────────────────────────────────────────────
// Pointer events  — mouse + pen (stylus) only, touch ignored
// ─────────────────────────────────────────────────────────────────────────────
const isValidPointer = (e) =>
  e.pointerType === 'mouse' || e.pointerType === 'pen';
 
canvas.addEventListener('pointermove', (e) => {
  if (!isValidPointer(e)) return;
  saveState({ realX: e.offsetX, realY: e.offsetY, pointerIn: true });
});
 
canvas.addEventListener('pointerenter', (e) => {
  if (!isValidPointer(e)) return;
  saveState({ realX: e.offsetX, realY: e.offsetY, pointerIn: true, virtInit: false });
});
 
canvas.addEventListener('pointerdown', (e) => {
  if (!isValidPointer(e)) return;
  e.preventDefault();
  saveState({ realX: e.offsetX, realY: e.offsetY, pressing: true });
  doCut(state.virtX);
});
 
canvas.addEventListener('pointerup', (e) => {
  if (!isValidPointer(e)) return;
  saveState({ pressing: false });
});
 
canvas.addEventListener('pointerleave', (e) => {
  if (!isValidPointer(e)) return;
  saveState({ pointerIn: false, pressing: false });
});
 
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
 
// ─────────────────────────────────────────────────────────────────────────────
// Toolbar
// ─────────────────────────────────────────────────────────────────────────────
function switchTool(t) {
  saveState({ tool: t, velX: 0, velY: 0 }); // reset velocity on tool switch
  document.querySelectorAll('.btn').forEach((b) => b.classList.remove('active'));
  document.getElementById(`btn-${t}`)?.classList.add('active');
}
 
document.getElementById('btn-razor')   ?.addEventListener('click', () => switchTool('razor'));
document.getElementById('btn-scissors')?.addEventListener('click', () => switchTool('scissors'));