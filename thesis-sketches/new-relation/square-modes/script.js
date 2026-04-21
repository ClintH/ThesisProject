import { continuously } from "@ixfx/flow.js";
import * as Numbers from "@ixfx/numbers.js";

const settings = {
  size: 120,
  maxSpeed: 8,
  canvas: /** @type {HTMLCanvasElement} */ (document.getElementById(`canvas`)),
  debug: /** @type {HTMLElement} */ (document.getElementById(`debug`)),
  modeDesc: /** @type {HTMLElement} */ (document.getElementById(`mode-desc`)),
  modes: {
    rubber: {
      color: `#e74c3c`,
      desc: `hover: static pull | pressure: stretch & snap | tilt: push angle | barrel: spin deflection`,
      friction: 0.15,
      pull: 0.25,
      weight: 6,
    },
    mud: {
      color: `#8d6e63`,
      desc: `tilt: flows downhill | pressure: gets stuck | no hover effect`,
      friction: 0.55,
      pull: 0.12,
      weight: 28,
    },
    ice: {
      color: `#b3e5fc`,
      desc: `pressure: melts, slippier | tilt: slides | barrel: spins the square`,
      friction: 0.025,
      pull: 0.06,
      weight: 4,
    },
    magnet: {
      color: `#ce93d8`,
      desc: `hover: attract | touch + tilt left: strong attract | touch + tilt right: repel`,
      friction: 0.08,
      pull: 0,
      weight: 8,
    },
  },
};

const ctx = /** @type {CanvasRenderingContext2D} */ (settings.canvas.getContext(`2d`));

const state = {
  dpr: window.devicePixelRatio || 1,
  cssW: 0,
  cssH: 0,
  virtX: 0,
  virtY: 0,
  velX: 0,
  velY: 0,
  targetX: 0,
  targetY: 0,
  dragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  initialized: false,
  rotation: 0,
  pressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerX: -9999,
  pointerY: -9999,
  pointerType: `mouse`,
  mode: `rubber`,
};

function resizeCanvas() {
  state.dpr = window.devicePixelRatio || 1;
  const rect = settings.canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));
  settings.canvas.width = Math.floor(cssW * state.dpr);
  settings.canvas.height = Math.floor(cssH * state.dpr);
  settings.canvas.style.width = `${cssW}px`;
  settings.canvas.style.height = `${cssH}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(state.dpr, state.dpr);
  state.cssW = cssW;
  state.cssH = cssH;
  if (!state.initialized) {
    state.virtX = (cssW - settings.size) / 2;
    state.virtY = (cssH - settings.size) / 2;
    state.targetX = state.virtX;
    state.targetY = state.virtY;
    state.initialized = true;
  }
}
window.addEventListener(`resize`, resizeCanvas);
resizeCanvas();

const squareCenterX = () => state.virtX + settings.size / 2;
const squareCenterY = () => state.virtY + settings.size / 2;

function pointerDist() {
  const dx = state.pointerX - squareCenterX();
  const dy = state.pointerY - squareCenterY();
  return Math.sqrt(dx * dx + dy * dy);
}

function hitBody(px, py) {
  return px >= state.virtX && px <= state.virtX + settings.size &&
         py >= state.virtY && py <= state.virtY + settings.size;
}

function readPointer(e) {
  state.pressure = e.pressure ?? 0;
  state.tiltX = e.tiltX ?? 0;
  state.tiltY = e.tiltY ?? 0;
  state.twist = e.twist ?? 0;
  state.pointerX = e.offsetX;
  state.pointerY = e.offsetY;
  state.pointerType = e.pointerType;
}

settings.canvas.addEventListener(`pointerdown`, (e) => {
  readPointer(e);
  if (hitBody(e.offsetX, e.offsetY)) {
    state.dragging = true;
    state.dragOffsetX = e.offsetX - state.virtX;
    state.dragOffsetY = e.offsetY - state.virtY;
    settings.canvas.setPointerCapture(e.pointerId);
  }
});

settings.canvas.addEventListener(`pointermove`, (e) => {
  readPointer(e);
  if (state.dragging) {
    state.targetX = Numbers.clamp(e.offsetX - state.dragOffsetX, 0, state.cssW - settings.size);
    state.targetY = Numbers.clamp(e.offsetY - state.dragOffsetY, 0, state.cssH - settings.size);
  }
  settings.canvas.style.cursor = `default`;
});

settings.canvas.addEventListener(`pointerup`, () => {
  state.dragging = false;
});
settings.canvas.addEventListener(`pointercancel`, () => {
  state.dragging = false;
});

document.querySelectorAll(`.mode-btn`).forEach(btn => {
  btn.addEventListener(`click`, () => {
    state.mode = /** @type {string} */ ((/** @type {HTMLElement} */ (btn)).dataset.mode ?? `rubber`);
    state.velX = 0;
    state.velY = 0;
    state.rotation = 0;
    document.querySelectorAll(`.mode-btn`).forEach(b => b.classList.remove(`active`));
    btn.classList.add(`active`);
    settings.modeDesc.textContent = settings.modes[state.mode]?.desc ?? ``;
  });
});
settings.modeDesc.textContent = settings.modes[state.mode]?.desc ?? ``;

const loop = continuously(() => {
  applyPhysics();
  draw();
  updateDebug();
});
loop.start();

function applyPhysics() {
  const modeCfg = settings.modes[state.mode];
  const pressure = Numbers.clamp(state.pressure, 0, 1);
  const tiltX = state.tiltX;
  const tiltY = state.tiltY;
  const twist = state.twist;
  const dist = pointerDist();
  const safeDist = Math.max(1, dist);

  const twistNorm = (twist > 180 ? twist - 360 : twist) / 180;

  let friction = modeCfg.friction;
  let pull = modeCfg.pull;
  let weight = modeCfg.weight;
  let extraVelX = 0;
  let extraVelY = 0;

  /*
  Rubber
  */
  if (state.mode === `rubber`) {
    // Pressure increases spring pull and reduces weight for more stretch and snap
    pull = modeCfg.pull + pressure * 0.45;
    weight = Math.max(1, modeCfg.weight - pressure * 4);

    // Hover attracts the square toward the cursor, the closer the pen is the stronger pull
    if (!state.dragging && dist < 260) {
      const hoverStrength = Numbers.scale(dist, 10, 260, 0.035, 0) * (1 - pressure * 0.6);
      const toPointerX = state.pointerX - settings.size / 2 - state.virtX;
      const toPointerY = state.pointerY - settings.size / 2 - state.virtY;
      extraVelX += (toPointerX * hoverStrength) / weight;
      extraVelY += (toPointerY * hoverStrength) / weight;
    }

    // Tilt shifts the drag target sideways
    if (state.dragging && pressure > 0.05) {
      const sthToClamp = state.targetX + tiltX * 0.7;
      const sthToClamp2 = state.targetY + tiltY * 0.7;
      state.targetX = Numbers.clamp(sthToClamp, 0, state.cssW - settings.size);
      state.targetY = Numbers.clamp(sthToClamp2, 0, state.cssH - settings.size);
    }

    // Barrel rotation applies a perpendicular deflection to the movement direction
    const speed = Math.sqrt(state.velX ** 2 + state.velY ** 2);
    if (speed > 0.5 && Math.abs(twistNorm) > 0.05 && pressure > 0.1) {
      const perpX = -state.velY / speed;
      const perpY = state.velX / speed;
      extraVelX += perpX * twistNorm * pressure * 0.8;
      extraVelY += perpY * twistNorm * pressure * 0.8;
    }

  /*
  Mud
  */
  } else if (state.mode === `mud`) {
    // Pressure maxes out friction, kills pull and adds even more weight so the square gets stuck
    friction = Math.min(0.94, modeCfg.friction + pressure * 0.48);
    pull = modeCfg.pull * (1 - pressure * 0.88);
    weight = modeCfg.weight + pressure * 38;

    // Tilt adds velocity in the tilt direction
    extraVelX += tiltX * 0.04 * (1 - pressure * 0.7);
    extraVelY += tiltY * 0.04 * (1 - pressure * 0.7);

  /*
  Ice
   */
  } else if (state.mode === `ice`) {
    // Pressure lowers friction and increases pull making it more slippery 
    friction = Math.max(0.001, modeCfg.friction * (1 - pressure * 0.95));
    pull = modeCfg.pull + pressure * 0.18;

    // Tilt adds velocity in the tilt direction
    extraVelX += tiltX * 0.02;
    extraVelY += tiltY * 0.02;

    // Barrel does a visual spin
    state.rotation = (state.rotation + twistNorm * 2.5) % 360;

    // Hover makes a glide effect, the closer the pen is the stronger the glide
    if (!state.dragging && dist < 180) {
      const hoverStrength = Numbers.scale(dist, 10, 180, 0.012, 0);
      extraVelX += (state.pointerX - settings.size / 2 - state.virtX) * hoverStrength / weight;
      extraVelY += (state.pointerY - settings.size / 2 - state.virtY) * hoverStrength / weight;
    }

  /*
  Magnet
    */
  } else if (state.mode === `magnet`) {
    pull = 0;
    state.targetX = state.virtX;
    state.targetY = state.virtY;

    const fieldRange = 450;
    if (dist < fieldRange) {
      const baseMag = Numbers.scale(dist, 0, fieldRange, 6, 0);
      const fieldMag = pressure < 0.05 ? baseMag : baseMag * 1.8;

      // tiltX left = attract, right = repel
      const fieldSign = pressure < 0.05 ?
        1 :
        (tiltX < -5 ? 1 : (tiltX > 5 ? -1 : Numbers.scale(tiltX, -5, 5, 1, -1)));

      const dirX = (state.pointerX - squareCenterX()) / safeDist;
      const dirY = (state.pointerY - squareCenterY()) / safeDist;

      extraVelX += dirX * fieldMag * fieldSign / weight;
      extraVelY += dirY * fieldMag * fieldSign / weight;
    }
  }

  // Spring toward target
  const springX = (state.targetX - state.virtX) * pull;
  const springY = (state.targetY - state.virtY) * pull;

  state.velX += springX / weight + extraVelX;
  state.velY += springY / weight + extraVelY;
  state.velX *= (1 - friction);
  state.velY *= (1 - friction);

  // Speed cap
  const speed = Math.sqrt(state.velX ** 2 + state.velY ** 2);
  if (speed > settings.maxSpeed) {
    state.velX = (state.velX / speed) * settings.maxSpeed;
    state.velY = (state.velY / speed) * settings.maxSpeed;
  }

  state.virtX = Numbers.clamp(state.virtX + state.velX, 0, state.cssW - settings.size);
  state.virtY = Numbers.clamp(state.virtY + state.velY, 0, state.cssH - settings.size);
}

function draw() {
  ctx.clearRect(0, 0, state.cssW, state.cssH);
  const modeCfg = settings.modes[state.mode];

  const centerX = squareCenterX();
  const centerY = squareCenterY();

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.fillStyle = modeCfg.color;
  ctx.fillRect(-settings.size / 2, -settings.size / 2, settings.size, settings.size);
  ctx.restore();
}

function updateDebug() {
  const pressure = state.pressure.toFixed(2);
  const tiltX = Math.round(state.tiltX);
  const tiltY = Math.round(state.tiltY);
  const twist = Math.round(state.twist);
  const dist = Math.round(pointerDist());
  const velX = state.velX.toFixed(1);
  const velY = state.velY.toFixed(1);
  settings.debug.textContent =
    `${state.pointerType} · pressure: ${pressure} · tilt: ${tiltX}°,${tiltY}° · twist: ${twist}° · dist: ${dist}px · vel: ${velX},${velY}`;
}
