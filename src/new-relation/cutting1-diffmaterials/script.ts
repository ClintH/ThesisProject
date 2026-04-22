import { continuously } from "@ixfx/flow";
import * as Numbers from "@ixfx/numbers";
import { Point, Points } from "@ixfx/geometry";

const settings = {
  trackH: 52,
  trackGap: 20,
  padX: 28,

  // tool physics params
  tools: Object.freeze({
    razor: Object.freeze({ pullX: 0.98, frictionX: 0.62, pullY: 0.09, frictionY: 0.02, weight: 8, noise: 0 }),
    scissors: Object.freeze({ pullX: 0.66, frictionX: 0.65, pullY: 0.66, frictionY: 0.65, weight: 10, noise: 0.55 }),
  }),

  // how each material modifies the base tool physics
  materials: {
    light: { pullMat: 1.18, weightMat: 0.50, noiseMat: 0.20, baseNoise: 0.00, fill: '#F76FA4', stroke: '#f3367f' },
    thick: { pullMat: 0.15, weightMat: 2.0, noiseMat: 1.80, baseNoise: 0.28, fill: '#E8914A', stroke: '#c26420' },
    springy: { pullMat: 1.4, weightMat: 0.80, noiseMat: 8.00, baseNoise: 0.00, fill: '#4DC9A0', stroke: '#1fa678' },
  } as const,

  initialTracks: Object.freeze([
    Object.freeze({
      material: 'light', clips: Object.freeze([
        Object.freeze({ left: [ { frac: 0.03, t: 0 }, { frac: 0.03, t: 1 } ], right: [ { frac: 0.27, t: 0 }, { frac: 0.27, t: 1 } ] }),
        Object.freeze({ left: [ { frac: 0.32, t: 0 }, { frac: 0.32, t: 1 } ], right: [ { frac: 0.60, t: 0 }, { frac: 0.60, t: 1 } ] }),
        Object.freeze({ left: [ { frac: 0.65, t: 0 }, { frac: 0.65, t: 1 } ], right: [ { frac: 0.96, t: 0 }, { frac: 0.96, t: 1 } ] }),
      ])
    }),
    Object.freeze({
      material: 'thick', clips: Object.freeze([
        Object.freeze({ left: [ { frac: 0.03, t: 0 }, { frac: 0.03, t: 1 } ], right: [ { frac: 0.38, t: 0 }, { frac: 0.38, t: 1 } ] }),
        Object.freeze({ left: [ { frac: 0.43, t: 0 }, { frac: 0.43, t: 1 } ], right: [ { frac: 0.96, t: 0 }, { frac: 0.96, t: 1 } ] }),
      ])
    }),
    Object.freeze({
      material: 'springy', clips: Object.freeze([
        Object.freeze({ left: [ { frac: 0.03, t: 0 }, { frac: 0.03, t: 1 } ], right: [ { frac: 0.20, t: 0 }, { frac: 0.20, t: 1 } ] }),
        Object.freeze({ left: [ { frac: 0.25, t: 0 }, { frac: 0.25, t: 1 } ], right: [ { frac: 0.48, t: 0 }, { frac: 0.48, t: 1 } ] }),
        Object.freeze({ left: [ { frac: 0.53, t: 0 }, { frac: 0.53, t: 1 } ], right: [ { frac: 0.73, t: 0 }, { frac: 0.73, t: 1 } ] }),
        Object.freeze({ left: [ { frac: 0.78, t: 0 }, { frac: 0.78, t: 1 } ], right: [ { frac: 0.96, t: 0 }, { frac: 0.96, t: 1 } ] }),
      ])
    }),
  ]),
} as const;

// state
let state = {
  blend: 0,
  pointerIn: false,
  pressing: false,
  realX: 0, realY: 0,
  virtX: 0, virtY: 0,
  velX: 0, velY: 0,
  virtInit: false,
  noiseT: 0,
  cutAverager: null as Points.PointAverager | null,
  canvasW: 0, canvasH: 0,
  timelineTop: 0,
  tracks: settings.initialTracks.map(t => ({
    material: t.material,
    clips: t.clips.map(c => ({
      left: c.left.map(p => ({ ...p })),
      right: c.right.map(p => ({ ...p })),
    })),
  })),
  cutPath: [] as Point[],
};

const saveState = (patch: Partial<typeof state>) => { state = { ...state, ...patch }; };

// canvas
const canvas = document.getElementById('c') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const toolbar = document.getElementById('toolbar')?.offsetHeight ?? 0;
  const { trackH, trackGap } = settings;
  const totalH = state.tracks.length * (trackH + trackGap) - trackGap;
  const visibleH = height - toolbar;
  saveState({ canvasW: width, canvasH: height, timelineTop: toolbar + (visibleH - totalH) / 2 });
}
resize();
window.addEventListener('resize', resize);

// geometry helpers
const trackTop = (i: number) => state.timelineTop + i * (settings.trackH + settings.trackGap);
const trackW = () => state.canvasW - settings.padX * 2;
const toFrac = (x: number) => Numbers.scale(x, settings.padX, settings.padX + trackW(), 0, 1);
const fromFrac = (f: number) => Numbers.scale(f, 0, 1, settings.padX, settings.padX + trackW());

function trackAtY(y: number) {
  for (let i = 0; i < state.tracks.length; i++) {
    if (y >= trackTop(i) && y <= trackTop(i) + settings.trackH) return i;
  }
  return -1;
}

// physics
function interpTools(blend: number) {
  const { razor: r, scissors: s } = settings.tools;
  const interp = (a: number, b: number) => Numbers.interpolate(blend, a, b);
  return {
    pullX: interp(r.pullX, s.pullX),
    frictionX: interp(r.frictionX, s.frictionX),
    pullY: interp(r.pullY, s.pullY),
    frictionY: interp(r.frictionY, s.frictionY),
    weight: interp(r.weight, s.weight),
    noise: interp(r.noise, s.noise),
  };
}

function getPhysics(blend: number, materialKey: keyof typeof settings.materials | null) {
  const base = interpTools(blend);
  const m = materialKey ? settings.materials[ materialKey ] : null;
  if (!m) return base;
  return {
    pullX: base.pullX * m.pullMat,
    frictionX: base.frictionX,
    pullY: base.pullY * m.pullMat,
    frictionY: base.frictionY,
    weight: base.weight * m.weightMat,
    noise: base.noise * m.noiseMat + m.baseNoise,
  };
}

function applyNoise(velX: number, velY: number, noiseT: number, noise: number) {
  const t = noiseT + 0.11;
  const n = Math.sin(t * 2.7) * Math.cos(t * 0.9 + 1.3);
  return {
    velX: velX + (Math.random() - 0.5) * noise * 0.04,
    velY: velY + n * noise * 0.22,
    noiseT: t,
  };
}

// cut logic
function clipPathToTrack(cutPath: Point[], ti: number) {
  const topY = trackTop(ti);
  const botY = topY + settings.trackH;
  const pts = [];

  for (let i = 0; i < cutPath.length - 1; i++) {
    const p0 = cutPath[ i ], p1 = cutPath[ i + 1 ];
    const dy = p1.y - p0.y;
    let tEnter = 0, tExit = 1;

    if (Math.abs(dy) > 0.001) {
      const tTop = (topY - p0.y) / dy;
      const tBot = (botY - p0.y) / dy;
      tEnter = Math.max(tEnter, Math.min(tTop, tBot));
      tExit = Math.min(tExit, Math.max(tTop, tBot));
    } else if (p0.y < topY || p0.y > botY) {
      continue;
    }

    if (tEnter >= tExit) continue;

    const enter = Points.interpolate(tEnter, p0, p1);
    const exit = Points.interpolate(tExit, p0, p1);
    // @ts-ignore
    if (!pts.length || Points.distance(pts.at(-1), enter) > 0.1) pts.push(enter);
    if (Points.distance(enter, exit) > 0.1) pts.push(exit);
  }

  if (!pts.length) return null;
  return pts.map(p => ({ frac: Numbers.clamp(toFrac(p.x), 0, 1), t: (p.y - topY) / settings.trackH }));
}

function applyCut() {
  const { cutPath } = state;
  if (cutPath.length < 2) { saveState({ cutPath: [] }); return; }

  const tracks = state.tracks.map((track, ti) => {
    const cutEdge = clipPathToTrack(cutPath, ti);
    if (!cutEdge) return track;
    // @ts-ignore
    if (cutEdge.length > 1 && cutEdge[ 0 ].t > cutEdge.at(-1).t) cutEdge.reverse();

    const cutFracTop = cutEdge[ 0 ].frac;
    // @ts-ignore
    const cutFracBot = cutEdge.at(-1).frac;
    const margin = 0.006;

    const clips = track.clips.flatMap(clip => {
      const inTop = cutFracTop > clip.left[ 0 ].frac + margin && cutFracTop < clip.right[ 0 ].frac - margin;
      // @ts-ignore
      const inBot = cutFracBot > clip.left.at(-1).frac + margin && cutFracBot < clip.right.at(-1).frac - margin;
      if (!inTop && !inBot) return [ clip ];
      return [
        { left: clip.left, right: cutEdge },
        { left: cutEdge, right: clip.right },
      ];
    });

    return { ...track, clips };
  });

  saveState({ tracks, cutPath: [] });
}

// draw
function drawTimeline() {
  const { tracks } = state;
  const { padX, trackH } = settings;
  const tw = trackW();

  for (let ti = 0; ti < tracks.length; ti++) {
    const track = tracks[ ti ];
    const mat = settings.materials[ track.material ];
    const ty = trackTop(ti);

    ctx.fillStyle = '#292929';
    ctx.beginPath();
    ctx.roundRect(padX, ty, tw, trackH, 3);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(padX, ty, tw, trackH, 3);
    ctx.clip();

    for (const clip of track.clips) {
      ctx.beginPath();
      ctx.moveTo(fromFrac(clip.left[ 0 ].frac), ty + clip.left[ 0 ].t * trackH);
      for (let i = 1; i < clip.left.length; i++)
        ctx.lineTo(fromFrac(clip.left[ i ].frac), ty + clip.left[ i ].t * trackH);
      for (let i = clip.right.length - 1; i >= 0; i--)
        ctx.lineTo(fromFrac(clip.right[ i ].frac), ty + clip.right[ i ].t * trackH);
      ctx.closePath();
      ctx.fillStyle = mat.fill;
      ctx.strokeStyle = mat.stroke;
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawCursor() {
  const { pointerIn, pressing, blend, virtX, virtY, canvasW, tracks, cutPath } = state;
  const { padX, trackH } = settings;
  if (!pointerIn) return;

  const hti = trackAtY(virtY);
  const matKey = hti >= 0 ? tracks[ hti ].material : null;
  const matColor = matKey ? settings.materials[ matKey ].fill : null;

  ctx.save();

  if (!pressing) {
    const guideAlpha = 0.05 * (1 - blend);
    if (guideAlpha > 0.001) {
      ctx.strokeStyle = `rgba(255,255,255,${ guideAlpha })`;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([ 2, 10 ]);
      ctx.beginPath();
      ctx.moveTo(padX, virtY);
      ctx.lineTo(canvasW - padX, virtY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  if (pressing && cutPath.length > 1) {
    ctx.strokeStyle = 'rgba(255,255,255,0.88)';
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    // @ts-ignore
    ctx.moveTo(cutPath[ 0 ].x, cutPath[ 0 ].y);
    // @ts-ignore
    for (let i = 1; i < cutPath.length; i++) ctx.lineTo(cutPath[ i ].x, cutPath[ i ].y);
    ctx.stroke();
  } else if (!pressing && hti >= 0) {
    ctx.strokeStyle = 'rgba(255,255,255,0.48)';
    ctx.lineWidth = 1;
    for (let ri = 0; ri < tracks.length; ri++) {
      const ty = trackTop(ri);
      ctx.beginPath();
      ctx.moveTo(virtX, ty + 2);
      ctx.lineTo(virtX, ty + trackH - 2);
      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.arc(virtX, virtY, pressing ? 2.5 : 3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${ pressing ? 0.95 : 0.52 })`;
  ctx.fill();

  ctx.restore();
}

const debugEl = document.getElementById('debug');
function drawDebug() {
  if (!debugEl) return;
  const { blend, virtY } = state;
  const matKey = state.tracks[ trackAtY(virtY) ]?.material ?? null;
  const ph = getPhysics(blend, matKey);
  const f2 = (n: number) => n.toFixed(2);
  debugEl.textContent =
    `pull X/Y  ${ f2(ph.pullX) } / ${ f2(ph.pullY) }\n` +
    `friction  ${ f2(ph.frictionX) } / ${ f2(ph.frictionY) }\n` +
    `weight    ${ f2(ph.weight) }\n` +
    `noise     ${ f2(ph.noise) }`;
}

function draw() {
  ctx.clearRect(0, 0, state.canvasW, state.canvasH);
  drawTimeline();
  drawCursor();
  drawDebug();
}

// update
function update() {
  const { pointerIn, realX, realY, virtX, virtY, velX, velY,
    pressing, noiseT, blend, cutAverager } = state;
  if (!pointerIn) return;

  const matKey = state.tracks[ trackAtY(virtY) ]?.material ?? null;
  const ph = getPhysics(blend, matKey);

  let newVelX = (velX + (realX - virtX) * ph.pullX / ph.weight) * (1 - ph.frictionX);
  let newVelY = (velY + (realY - virtY) * ph.pullY / ph.weight) * (1 - ph.frictionY);
  let newNoiseT = noiseT;

  if (ph.noise > 0) {
    const noise = applyNoise(newVelX, newVelY, noiseT, ph.noise);
    newVelX = noise.velX;
    newVelY = noise.velY;
    newNoiseT = noise.noiseT;
  }

  const newVirtX = virtX + newVelX;
  const newVirtY = virtY + newVelY;

  let newCutPath = state.cutPath;
  if (pressing && cutAverager) {
    // @ts-ignore
    const averaged = cutAverager({ x: newVirtX, y: newVirtY });
    const last = newCutPath.at(-1);
    if (!last || Points.distance(averaged, last) > 1.5)
      newCutPath = [ ...newCutPath, averaged ];
  }

  saveState({ virtX: newVirtX, virtY: newVirtY, velX: newVelX, velY: newVelY, noiseT: newNoiseT, cutPath: newCutPath });
}

continuously(() => { update(); draw(); }).start();

// pointer events
const isValidPointer = (e: PointerEvent) => e.pointerType === 'mouse' || e.pointerType === 'pen';

function addPointerListener(type: string, handler: (e: PointerEvent) => void) {
  // @ts-ignore
  canvas.addEventListener(type, (e) => { if (isValidPointer(e)) handler(e); });
}

addPointerListener('pointermove', (e) => saveState({ realX: e.offsetX, realY: e.offsetY, pointerIn: true }));

addPointerListener('pointerenter', (e) => saveState({
  realX: e.offsetX, realY: e.offsetY,
  virtX: e.offsetX, virtY: e.offsetY,   // snap virt to real on entry
  velX: 0, velY: 0,
  pointerIn: true,
}));

addPointerListener('pointerdown', (e) => {
  e.preventDefault();
  saveState({
    realX: e.offsetX,
    realY: e.offsetY,
    pressing: true,
    virtInit: true,  // prevent snap: pointerenter may have reset virtInit before this fires
    cutAverager: Points.averager('moving-average-light', {}),
    cutPath: [ { x: state.virtX, y: state.virtY } ],
  });
});

// @ts-ignore
addPointerListener('pointerup', (e) => {
  if (state.pressing) applyCut();
  saveState({ pressing: false, cutPath: [], cutAverager: null });
});

addPointerListener('pointerleave', () => {
  saveState({ pointerIn: false, pressing: false, cutPath: [], cutAverager: null });
});

// @ts-ignore
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

document.getElementById('blend-slider')?.addEventListener('input', (e) => {
  // @ts-ignore
  saveState({ blend: Number(e.target.value) / 100, velX: 0, velY: 0 });
});