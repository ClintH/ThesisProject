import { continuously } from "@ixfx/flow.js";
import { clamp }        from "@ixfx/numbers.js";
import { Points }       from "@ixfx/geometry.js";

// ─────────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────────
const settings = Object.freeze({
  trackH:    52,
  trackGap:  6,
  padX:      28,
  physics: Object.freeze({
    razor: Object.freeze({
      pullX: 0.98, frictionX: 0.62,
      pullY: 0.09, frictionY: 0.012,
      weight: 9,
      noise:  0,
    }),
    scissors: Object.freeze({
      pullX: 0.66, frictionX: 0.65,
      pullY: 0.66, frictionY: 0.65,
      weight: 10,
      noise:  0.55,
    }),
  }),
  initialTracks: Object.freeze([
    Object.freeze([
      Object.freeze({ left: [{frac:0.03,t:0},{frac:0.03,t:1}], right: [{frac:0.27,t:0},{frac:0.27,t:1}], hue: 210 }),
      Object.freeze({ left: [{frac:0.32,t:0},{frac:0.32,t:1}], right: [{frac:0.60,t:0},{frac:0.60,t:1}], hue: 210 }),
      Object.freeze({ left: [{frac:0.65,t:0},{frac:0.65,t:1}], right: [{frac:0.96,t:0},{frac:0.96,t:1}], hue: 210 }),
    ]),
  ]),
});

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────
let state = {
  tool: 'razor',
  pointerIn: false,
  pressing:  false,
  realX: 0, realY: 0,
  virtX: 0, virtY: 0,
  velX:  0, velY:  0,
  virtInit: false,
  noiseT: 0,
  canvasW: 0, canvasH: 0,
  timelineTop: 0,
  tracks: settings.initialTracks.map(t => t.map(c => ({
    left:  c.left.map(p  => ({ ...p })),
    right: c.right.map(p => ({ ...p })),
    hue:   c.hue,
  }))),
  cutPath: [],
};
const saveState = (patch) => { state = { ...state, ...patch }; };

let cutAverager = null;

// ─────────────────────────────────────────────────────────────────────────────
// Canvas setup
// ─────────────────────────────────────────────────────────────────────────────
const canvasElement = document.getElementById('c');
const ctx = canvasElement.getContext('2d');

function resize() {
  const width  = window.innerWidth;
  const height = window.innerHeight;
  const dpr    = window.devicePixelRatio || 1;
  canvasElement.style.width  = width  + 'px';
  canvasElement.style.height = height + 'px';
  canvasElement.width  = width  * dpr;
  canvasElement.height = height * dpr;
  ctx.scale(dpr, dpr);
  const toolbar  = document.getElementById('toolbar');
  const tbH      = toolbar?.offsetHeight ?? 0;
  const { trackH, trackGap } = settings;
  const totalH   = state.tracks.length * trackH + (state.tracks.length - 1) * trackGap;
  const visibleH = height - tbH;
  saveState({ canvasW: width, canvasH: height, timelineTop: tbH + (visibleH - totalH) / 2 });
}
resize();
window.addEventListener('resize', resize);

// ─────────────────────────────────────────────────────────────────────────────
// Geometry helpers
// ─────────────────────────────────────────────────────────────────────────────
const trackTop = (i) => state.timelineTop + i * (settings.trackH + settings.trackGap);
const trackW   = ()  => state.canvasW - settings.padX * 2;
const toFrac   = (x) => (x - settings.padX) / trackW();
const fromFrac = (f) => settings.padX + f * trackW();

function trackAtY(y) {
  for (let i = 0; i < state.tracks.length; i++) {
    if (y >= trackTop(i) && y <= trackTop(i) + settings.trackH) return i;
  }
  return -1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cut logic
// ─────────────────────────────────────────────────────────────────────────────

function clipPathToTrack(cutPath, ti) {
  const topY = trackTop(ti);
  const botY = topY + settings.trackH;
  const h    = settings.trackH;
  const pts  = [];

  for (let i = 0; i < cutPath.length - 1; i++) {
    const { x: x0, y: y0 } = cutPath[i];
    const { x: x1, y: y1 } = cutPath[i + 1];
    const dy = y1 - y0;

    let tEnter = 0, tExit = 1;
    if (Math.abs(dy) > 0.001) {
      const tTop = (topY - y0) / dy;
      const tBot = (botY - y0) / dy;
      tEnter = Math.max(tEnter, Math.min(tTop, tBot));
      tExit  = Math.min(tExit,  Math.max(tTop, tBot));
    } else {
      if (y0 < topY || y0 > botY) continue;
    }
    if (tEnter >= tExit) continue;

    const lerp  = (t) => ({ x: x0 + t * (x1 - x0), y: y0 + t * (y1 - y0) });
    const enter = lerp(tEnter);
    const exit  = lerp(tExit);

    if (!pts.length || Points.distance(pts.at(-1), enter) > 0.1) pts.push(enter);
    if (Points.distance(enter, exit) > 0.1) pts.push(exit);
  }

  if (pts.length === 0) return null;
  return pts.map(p => ({ frac: clamp(toFrac(p.x), 0, 1), t: (p.y - topY) / h }));
}

function applyCut() {
  const { cutPath } = state;
  if (cutPath.length < 2) { saveState({ cutPath: [] }); return; }

  const tracks = state.tracks.map((track, ti) => {
    const cutEdge = clipPathToTrack(cutPath, ti);
    if (!cutEdge) return track;
    if (cutEdge.length > 1 && cutEdge[0].t > cutEdge[cutEdge.length - 1].t) cutEdge.reverse();

    const cutFracTop = cutEdge[0].frac;
    const cutFracBot = cutEdge.at(-1).frac;

    return track.flatMap(clip => {
      const margin = 0.006;
      const inTop  = cutFracTop > clip.left[0].frac      + margin && cutFracTop < clip.right[0].frac      - margin;
      const inBot  = cutFracBot > clip.left.at(-1).frac  + margin && cutFracBot < clip.right.at(-1).frac  - margin;
      if (!inTop && !inBot) return [clip];
      return [
        { left: clip.left, right: cutEdge,   hue: clip.hue },
        { left: cutEdge,   right: clip.right, hue: clip.hue },
      ];
    });
  });

  saveState({ tracks, cutPath: [] });
}

// ─────────────────────────────────────────────────────────────────────────────
// Draw helpers
// ─────────────────────────────────────────────────────────────────────────────
function drawTimeline() {
  const { tracks }       = state;
  const { padX, trackH } = settings;
  const tw = trackW();

  for (let ti = 0; ti < tracks.length; ti++) {
    const ty = trackTop(ti);

    ctx.fillStyle = '#191919';
    ctx.beginPath();
    ctx.roundRect(padX, ty, tw, trackH, 3);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(padX, ty, tw, trackH, 3);
    ctx.clip();

    for (const clip of tracks[ti]) {
      ctx.beginPath();
      ctx.moveTo(fromFrac(clip.left[0].frac), ty + clip.left[0].t * trackH);
      for (let i = 1; i < clip.left.length; i++) {
        ctx.lineTo(fromFrac(clip.left[i].frac), ty + clip.left[i].t * trackH);
      }
      for (let i = clip.right.length - 1; i >= 0; i--) {
        ctx.lineTo(fromFrac(clip.right[i].frac), ty + clip.right[i].t * trackH);
      }
      ctx.closePath();
      ctx.fillStyle   = `#F76FA4`;
      ctx.strokeStyle = `#f3367f`;
      ctx.lineWidth   = 1.5;
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawCursor() {
  const { pointerIn, pressing, tool, virtX, virtY, canvasW, tracks } = state;
  const { padX, trackH } = settings;
  if (!pointerIn) return;

  const onTrack = trackAtY(virtY) >= 0;
  ctx.save();

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

  if (pressing && state.cutPath.length > 1) {
    ctx.strokeStyle = 'rgba(255,255,255,0.88)';
    ctx.lineWidth   = 1.5;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.moveTo(state.cutPath[0].x, state.cutPath[0].y);
    for (let i = 1; i < state.cutPath.length; i++) ctx.lineTo(state.cutPath[i].x, state.cutPath[i].y);
    ctx.stroke();
  } else if (!pressing && onTrack) {
    ctx.strokeStyle = `rgba(255,255,255,${tool === 'razor' ? 0.50 : 0.46})`;
    ctx.lineWidth   = 1;
    for (let ti = 0; ti < tracks.length; ti++) {
      const ty = trackTop(ti);
      ctx.beginPath();
      ctx.moveTo(virtX, ty + 2);
      ctx.lineTo(virtX, ty + trackH - 2);
      ctx.stroke();
    }
  }

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
// Physics update
// ─────────────────────────────────────────────────────────────────────────────
function update() {
  const { pointerIn, virtInit, realX, realY, virtX, virtY,
          velX, velY, pressing, noiseT, tool } = state;
  if (!pointerIn) return;

  if (!virtInit) {
    saveState({ virtX: realX, virtY: realY, virtInit: true });
    return;
  }

  const ph = settings.physics[tool];

  let newVelX = velX + (realX - virtX) * ph.pullX / ph.weight;
  let newVelY = velY + (realY - virtY) * ph.pullY / ph.weight;
  newVelX *= (1 - ph.frictionX);
  newVelY *= (1 - ph.frictionY);

  let newNoiseT = noiseT;
  if (ph.noise > 0) {
    newNoiseT += 0.11;
    const n = Math.sin(newNoiseT * 2.7) * Math.cos(newNoiseT * 0.9 + 1.3);
    newVelY += n * ph.noise * 0.22;
    newVelX += (Math.random() - 0.5) * ph.noise * 0.04;
  }

  const newVirtX = virtX + newVelX;
  const newVirtY = virtY + newVelY;

  let newCutPath = state.cutPath;
  if (pressing && cutAverager) {
    const averaged = cutAverager({ x: newVirtX, y: newVirtY });
    const last = newCutPath.at(-1);
    if (!last || Points.distance(averaged, last) > 1.5) {
      newCutPath = [...newCutPath, averaged];
    }
  }

  saveState({ virtX: newVirtX, virtY: newVirtY, velX: newVelX, velY: newVelY,
              noiseT: newNoiseT, cutPath: newCutPath });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main loop
// ─────────────────────────────────────────────────────────────────────────────
continuously(() => { update(); draw(); }).start();

// ─────────────────────────────────────────────────────────────────────────────
// Pointer events
// ─────────────────────────────────────────────────────────────────────────────
const isValidPointer = (e) => e.pointerType === 'mouse' || e.pointerType === 'pen';

canvasElement.addEventListener('pointermove', (e) => {
  if (!isValidPointer(e)) return;
  saveState({ realX: e.offsetX, realY: e.offsetY, pointerIn: true });
});

canvasElement.addEventListener('pointerenter', (e) => {
  if (!isValidPointer(e)) return;
  saveState({ realX: e.offsetX, realY: e.offsetY, pointerIn: true, virtInit: false });
});

canvasElement.addEventListener('pointerdown', (e) => {
  if (!isValidPointer(e)) return;
  e.preventDefault();
  cutAverager = Points.averager('moving-average-light', {});
  saveState({
    realX:    e.offsetX,
    realY:    e.offsetY,
    pressing: true,
    cutPath:  [{ x: state.virtX, y: state.virtY }],
  });
});

canvasElement.addEventListener('pointerup', (e) => {
  if (!isValidPointer(e)) return;
  if (state.pressing) applyCut();
  cutAverager = null;
  saveState({ pressing: false, cutPath: [] });
});

canvasElement.addEventListener('pointerleave', (e) => {
  if (!isValidPointer(e)) return;
  cutAverager = null;
  saveState({ pointerIn: false, pressing: false, cutPath: [] });
});

canvasElement.addEventListener('contextmenu', (e) => e.preventDefault());

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar
// ─────────────────────────────────────────────────────────────────────────────
function switchTool(t) {
  saveState({ tool: t, velX: 0, velY: 0 });
  document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-${t}`)?.classList.add('active');
}

document.getElementById('btn-razor')   ?.addEventListener('click', () => switchTool('razor'));
document.getElementById('btn-scissors')?.addEventListener('click', () => switchTool('scissors'));