import { continuously }    from "@ixfx/flow.js";
import { clamp }            from "@ixfx/numbers.js";
import { Points }           from "@ixfx/geometry.js";

// ─────────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────────
const settings = Object.freeze({
  trackH:   52,
  trackGap: 6,
  padX:     28,
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
  initialTracks: Object.freeze([
    Object.freeze([
      Object.freeze({ sTop: 0.03, sBot: 0.03, eTop: 0.27, eBot: 0.27, hue: 210 }),
      Object.freeze({ sTop: 0.32, sBot: 0.32, eTop: 0.60, eBot: 0.60, hue: 210 }),
      Object.freeze({ sTop: 0.65, sBot: 0.65, eTop: 0.96, eBot: 0.96, hue: 210 }),
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
  realX: 0,
  realY: 0,
  virtX:    0,
  virtY:    0,
  velX:     0,
  velY:     0,
  virtInit: false,
  noiseT: 0,
  canvasW:     0,
  canvasH:     0,
  timelineTop: 0,
  tracks:  settings.initialTracks.map(t => t.map(c => ({ ...c }))),
  cutPath: [],
};
const saveState = (patch) => { state = { ...state, ...patch }; };

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
  const toolbar = document.getElementById('toolbar');
  const tbH     = toolbar?.offsetHeight ?? 0;
  const { trackH, trackGap } = settings;
  const totalH   = state.tracks.length * trackH + (state.tracks.length - 1) * trackGap;
  const visibleH = height - tbH;
  saveState({
    canvasW: width,
    canvasH: height,
    timelineTop: tbH + (visibleH - totalH) / 2,
  });
}
resize();
window.addEventListener('resize', resize);

// ─────────────────────────────────────────────────────────────────────────────
// Geometry helpers
// ─────────────────────────────────────────────────────────────────────────────
const trackTop = (i) => state.timelineTop + i * (settings.trackH + settings.trackGap);
const trackCY  = (i) => trackTop(i) + settings.trackH / 2;
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
function pathXAtY(path, targetY) {
  for (let i = 0; i < path.length - 1; i++) {
    const { x: x0, y: y0 } = path[i];
    const { x: x1, y: y1 } = path[i + 1];
    const lo = Math.min(y0, y1), hi = Math.max(y0, y1);
    if (targetY >= lo && targetY <= hi && Math.abs(y1 - y0) > 0.001) {
      return x0 + (x1 - x0) * (targetY - y0) / (y1 - y0);
    }
  }
  return null;
}

function cutEdgeForTrack(cutPath, ti) {
  const ty    = trackTop(ti);
  const topY  = ty, botY = ty + settings.trackH;
  const inside = cutPath.filter(p => p.y > topY && p.y < botY);
  if (inside.length === 0) return null;

  let xTop = pathXAtY(cutPath, topY);
  let xBot = pathXAtY(cutPath, botY);

  if (xTop === null) {
    const fi = cutPath.indexOf(inside[0]);
    const { x: x0, y: y0 } = fi > 0 ? cutPath[fi - 1] : inside[0];
    const { x: x1, y: y1 } = inside[0];
    xTop = Math.abs(y1 - y0) > 0.001
      ? x0 + (x1 - x0) * (topY - y0) / (y1 - y0)
      : inside[0].x;
  }
  if (xBot === null) {
    const li = cutPath.indexOf(inside.at(-1));
    const { x: x0, y: y0 } = inside.at(-1);
    const { x: x1, y: y1 } = li < cutPath.length - 1 ? cutPath[li + 1] : inside.at(-1);
    xBot = Math.abs(y1 - y0) > 0.001
      ? x0 + (x1 - x0) * (botY - y0) / (y1 - y0)
      : inside.at(-1).x;
  }

  return { xTop, xBot };
}

function applyCut() {
  const { cutPath } = state;
  if (cutPath.length < 2) { saveState({ cutPath: [] }); return; }

  const tracks = state.tracks.map((track, ti) => {
    const edge = cutEdgeForTrack(cutPath, ti);
    if (!edge) return track;

    const fTop = clamp(toFrac(edge.xTop), 0, 1);
    const fBot = clamp(toFrac(edge.xBot), 0, 1);

    return track.flatMap(clip => {
      const margin = 0.006;
      const inTop  = fTop > clip.sTop + margin && fTop < clip.eTop - margin;
      const inBot  = fBot > clip.sBot + margin && fBot < clip.eBot - margin;
      if (!inTop && !inBot) return [clip];

      const cutTop = clamp(fTop, clip.sTop + margin, clip.eTop - margin);
      const cutBot = clamp(fBot, clip.sBot + margin, clip.eBot - margin);
      return [
        { sTop: clip.sTop, sBot: clip.sBot, eTop: cutTop, eBot: cutBot, hue: clip.hue },
        { sTop: cutTop,    sBot: cutBot,    eTop: clip.eTop, eBot: clip.eBot, hue: clip.hue },
      ];
    });
  });

  saveState({ tracks, cutPath: [] });
}

// ─────────────────────────────────────────────────────────────────────────────
// Draw helpers
// ─────────────────────────────────────────────────────────────────────────────
function drawRoundRect(x, y, w, h, r) {
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
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
  const { tracks }       = state;
  const { padX, trackH } = settings;
  const tw = trackW();

  for (let ti = 0; ti < tracks.length; ti++) {
    const ty = trackTop(ti);
    ctx.fillStyle = '#191919';
    ctx.beginPath();
    drawRoundRect(padX, ty, tw, trackH, 3);
    ctx.fill();

    for (const clip of tracks[ti]) {
      const ins    = 1;
      const x_sTop = fromFrac(clip.sTop) + ins;
      const x_sBot = fromFrac(clip.sBot) + ins;
      const x_eTop = fromFrac(clip.eTop) - ins;
      const x_eBot = fromFrac(clip.eBot) - ins;
      ctx.fillStyle   = `hsl(${clip.hue} 25% 24%)`;
      ctx.strokeStyle = `hsl(${clip.hue} 30% 34%)`;
      ctx.lineWidth   = 0.75;
      ctx.beginPath();
      ctx.moveTo(x_sTop, ty + ins);
      ctx.lineTo(x_eTop, ty + ins);
      ctx.lineTo(x_eBot, ty + trackH - ins);
      ctx.lineTo(x_sBot, ty + trackH - ins);
      ctx.closePath();
      ctx.fill();
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
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(state.cutPath[0].x, state.cutPath[0].y);
    for (let i = 1; i < state.cutPath.length; i++) ctx.lineTo(state.cutPath[i].x, state.cutPath[i].y);
    ctx.stroke();
  } else if (!pressing && onTrack) {
    const lineAlpha = tool === 'razor' ? 0.50 : 0.46;
    ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
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
  const { pointerIn, virtInit, realX, realY, virtX, virtY, velX, velY,
          pressing, noiseT, tool } = state;
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
  if (pressing) {
    const last = newCutPath.at(-1);
    const pt   = { x: newVirtX, y: newVirtY };
    if (!last || Points.distance(pt, last) > 1.5) {
      newCutPath = [...newCutPath, pt];
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
  saveState({ pressing: false, cutPath: [] });
});

canvasElement.addEventListener('pointerleave', (e) => {
  if (!isValidPointer(e)) return;
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