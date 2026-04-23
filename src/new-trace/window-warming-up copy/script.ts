import { continuously } from "@ixfx/flow";
import * as Numbers from "@ixfx/numbers";

const cornerCursors = { tl: `nwse-resize`, tr: `nesw-resize`, bl: `nesw-resize`, br: `nwse-resize` };


const settings = Object.freeze({
  canvas: document.getElementById(`canvas`) as HTMLCanvasElement,
  debug: document.getElementById(`debug`) as HTMLElement,
  ctx: (document.getElementById(`canvas`) as HTMLCanvasElement)!.getContext(`2d`)!,
  minSize: 30,
  maxSize: 800,
  handleHit: 14,
  engageGain: 0.0001,
  engageDecay: 0.00001,
  pullCold: 0.04,
  pullWarm: 0.95,
  frictionCold: 0.78,
  frictionWarm: 0.10,
  weight: 12,
});

const state = {
  DPR: window.devicePixelRatio || 1,
  cssW: 0,
  cssH: 0,
  ax: 80,
  ay: 80,
  virtW: 160,
  virtH: 160,
  velW: 0,
  velH: 0,
  targetW: 160,
  targetH: 160,
  resizing: false,
  activeCorner: null as string | null,
  anchorX: 0,
  anchorY: 0,
  moving: false,
  moveDx: 0,
  moveDy: 0,
  lastPx: 0,
  lastPy: 0,
  engagement: 0,
  lastTime: performance.now(),
  lastEvent: null as PointerEvent | null,
  initialized: false,
};

function resizeCanvas() {
  const { canvas, ctx } = settings;
  state.DPR = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));

  canvas.width = Math.floor(cssW * state.DPR);
  canvas.height = Math.floor(cssH * state.DPR);
  canvas.style.width = `${ cssW }px`;
  canvas.style.height = `${ cssH }px`;

  // @ts-ignore
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // @ts-ignore
  ctx.scale(state.DPR, state.DPR);
  state.cssW = cssW;
  state.cssH = cssH;

  if (!state.initialized) {
    const s = Math.min(cssW, cssH) * 0.35;
    state.virtW = s;
    state.virtH = s;
    state.targetW = s;
    state.targetH = s;
    state.ax = cssW * 0.2;
    state.ay = cssH * 0.15;
    state.initialized = true;
  }
}

window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();

function cornerPositions() {
  const { ax, ay, virtW, virtH } = state;
  return {
    tl: { x: ax, y: ay },
    tr: { x: ax + virtW, y: ay },
    bl: { x: ax, y: ay + virtH },
    br: { x: ax + virtW, y: ay + virtH },
  };
}

function hitCorner(px: number, py: number) {
  const corners = cornerPositions();
  for (const [ name, pos ] of Object.entries(corners)) {
    const dx = px - pos.x;
    const dy = py - pos.y;
    if (Math.sqrt(dx * dx + dy * dy) <= settings.handleHit) return name;
  }
  return null;
}

function hitBody(px: number, py: number) {
  return (
    px >= state.ax && px <= state.ax + state.virtW &&
    py >= state.ay && py <= state.ay + state.virtH
  );
}


function updateCursor(px: number, py: number) {
  const { canvas } = settings;
  if (state.resizing) {
    canvas.style.cursor = cornerCursors[ state.activeCorner ];
  } else if (state.moving) {
    canvas.style.cursor = `grabbing`;
  } else {
    const corner = hitCorner(px, py);
    if (corner) canvas.style.cursor = cornerCursors[ corner ];
    else if (hitBody(px, py)) canvas.style.cursor = `grab`;
    else canvas.style.cursor = `default`;
  }
}

settings.canvas.addEventListener(`pointerdown`, (e) => {
  const x = e.offsetX,
    y = e.offsetY;
  const corner = hitCorner(x, y);
  if (corner) {
    state.resizing = true;
    state.activeCorner = corner;
    state.lastPx = x;
    state.lastPy = y;
    // anchor is the opposite corner — it stays fixed while we drag
    state.anchorX = corner.includes(`r`) ? state.ax : state.ax + state.virtW;
    state.anchorY = corner.includes(`b`) ? state.ay : state.ay + state.virtH;
    settings.canvas.setPointerCapture(e.pointerId);
  } else if (hitBody(x, y)) {
    state.moving = true;
    state.moveDx = x - state.ax;
    state.moveDy = y - state.ay;
    settings.canvas.setPointerCapture(e.pointerId);
  }
});

settings.canvas.addEventListener(`pointermove`, (e) => {
  const { minSize, maxSize } = settings;
  const x = e.offsetX,
    y = e.offsetY;
  state.lastEvent = e;
  updateCursor(x, y);

  if (state.resizing) {
    const dx = x - state.lastPx;
    const dy = y - state.lastPy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    state.engagement = Numbers.clamp(state.engagement + dist * settings.engageGain, 0, 1);
    state.lastPx = x;
    state.lastPy = y;

    const { activeCorner, anchorX, anchorY } = state;
    if (!activeCorner) return;
    if (activeCorner.includes(`l`)) {
      state.targetW = Numbers.clamp(anchorX - x, minSize, maxSize);
    } else {
      state.targetW = Numbers.clamp(x - anchorX, minSize, maxSize);
    }
    if (activeCorner.includes(`t`)) {
      state.targetH = Numbers.clamp(anchorY - y, minSize, maxSize);
    } else {
      state.targetH = Numbers.clamp(y - anchorY, minSize, maxSize);
    }
  } else if (state.moving) {
    state.ax = Numbers.clamp(x - state.moveDx, 0, state.cssW - state.virtW);
    state.ay = Numbers.clamp(y - state.moveDy, 0, state.cssH - state.virtH);
  }
});

settings.canvas.addEventListener(`pointerup`, () => {
  state.resizing = false;
  state.moving = false;
});

settings.canvas.addEventListener(`pointercancel`, () => {
  state.resizing = false;
  state.moving = false;
});

const loop = continuously(() => {
  const { frictionCold, frictionWarm, pullCold, pullWarm, weight, minSize, maxSize } = settings;
  const now = performance.now();
  const deltaMs = now - state.lastTime;
  state.lastTime = now;

  state.engagement = Numbers.clamp(state.engagement - settings.engageDecay * deltaMs, 0, 1);

  const friction = Numbers.interpolate(state.engagement, frictionCold, frictionWarm);
  const pull = Numbers.interpolate(state.engagement, pullCold, pullWarm);

  const forceW = (state.targetW - state.virtW) * pull;
  const forceH = (state.targetH - state.virtH) * pull;
  state.velW += forceW / weight;
  state.velH += forceH / weight;
  state.velW *= (1 - friction);
  state.velH *= (1 - friction);
  state.virtW += state.velW;
  state.virtH += state.velH;

  state.virtW = Numbers.clamp(state.virtW, minSize - 20, maxSize + 20);
  state.virtH = Numbers.clamp(state.virtH, minSize - 20, maxSize + 20);

  if (state.resizing && state.activeCorner) {
    if (state.activeCorner.includes(`l`)) state.ax = state.anchorX - state.virtW;
    if (state.activeCorner.includes(`t`)) state.ay = state.anchorY - state.virtH;
  }

  draw();
  updateDebug();
});

loop.start();

const labelText = `Grab a corner of the window and start resizing it. A window you've just opened feels stiff and cold,the more you work with it, the warmer and more yielding it becomes.`;

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(` `);
  let line = ``;
  for (const word of words) {
    const test = line ? `${ line } ${ word }` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

function draw() {
  const { ctx } = settings;
  if (!ctx) return;
  ctx.clearRect(0, 0, state.cssW, state.cssH);
  const { ax, ay, virtW, virtH } = state;

  ctx.save();
  ctx.font = `14px "Overpass Mono", monospace`;
  ctx.fillStyle = `rgba(255, 255, 255, 0.7)`;
  wrapText(ctx, labelText, 12, 28, 500, 22);
  ctx.restore();

  const titleH = 28;
  const radius = 10;

  ctx.save();
  ctx.shadowColor = `rgba(0,0,0,0.22)`;
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;
  ctx.beginPath();
  ctx.roundRect(ax, ay, virtW, virtH, radius);
  ctx.fillStyle = `#f2f2f2`;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(ax, ay, virtW, virtH, radius);
  ctx.clip();

  ctx.fillStyle = `#f5f5f5`;
  ctx.fillRect(ax, ay, virtW, virtH);

  ctx.fillStyle = `#e0e0e0`;
  ctx.fillRect(ax, ay, virtW, titleH);

  ctx.beginPath();
  ctx.moveTo(ax, ay + titleH);
  ctx.lineTo(ax + virtW, ay + titleH);
  ctx.strokeStyle = `#c8c8c8`;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  const dotR = 6;
  const dotY = ay + titleH / 2;
  const dotStartX = ax + 14;
  const dotGap = 20;
  const dotColors = [ `#FF6159`, `#FFBD2E`, `#28C941` ];
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(dotStartX + i * dotGap, dotY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = dotColors[ i ];
    ctx.fill();
  }

  ctx.restore();

  ctx.beginPath();
  ctx.roundRect(ax, ay, virtW, virtH, radius);
  ctx.strokeStyle = `rgba(0,0,0,0.12)`;
  ctx.lineWidth = 1;
  ctx.stroke();

}

function updateDebug() {
  const eng = (state.engagement * 100).toFixed(1);
  const fr = Numbers.interpolate(state.engagement, settings.frictionCold, settings.frictionWarm).toFixed(3);
  const pull = Numbers.interpolate(state.engagement, settings.pullCold, settings.pullWarm).toFixed(3);
  const type = state.lastEvent?.pointerType ?? `—`;

  settings.debug.textContent =
    `type: ${ type }   |   engagement: ${ eng }%   |   friction: ${ fr }   |   pull: ${ pull }`;
}