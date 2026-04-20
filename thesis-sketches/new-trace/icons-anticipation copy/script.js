import { continuously, timeout } from '@ixfx/flow.js';
import * as Numbers from '@ixfx/numbers.js';

const settings = Object.freeze({
  count: 15,
  maxClicks: 5,
  maxLift: 15,
  minLift: 1.2,
  maxScale: 1.12,
  minScale: 1.008,
  springK: 0.18,
  springDamp: 0.62,
  recoveryRate: 0.00002,
  neighborInfluence: 0.5,
});

let state = {
  hoveredIndex: -1,
  greyscaleActive: true,
};

const toggleBtn = /** @type {HTMLButtonElement} */ (document.getElementById(`greyscale-toggle`));
toggleBtn.addEventListener(`click`, () => {
  state.greyscaleActive = !state.greyscaleActive;
  toggleBtn.textContent = `greyscale: ${state.greyscaleActive ? `on` : `off`}`;
  toggleBtn.classList.toggle(`active`, state.greyscaleActive);
});

function makeButtonState() {
  return {
    clicks: 0,
    liftY: 0,
    velY: 0,
    scaleY: 1,
    velS: 0,
    lastTime: performance.now(),
  };
}

const stage = /** @type {HTMLElement} */ document.getElementById(`stage`);

const icons = [ `🌐`, `📧`, `🗓`, `📸`, `🎵`, `💬`, `🗺`, `📝`, `⚙️`, `🔍`, `📁`, `🎨`, `📊`, `🎮`, `🔔` ];
const bgColors = [
  `#e9e9e9`, `#0A84FF`, `#FF453A`, `#ffd20a`, `#FF6B81`, `#30D158`, `#e9e9e9`, `#FFD60A`, `#e9e9e9`, `#64D2FF`, `#FF9F0A`, `#5E5CE6`, `#00C7BE`, `#BF5AF2`, `#64D2FF`,
];

const buttons = Array.from({ length: settings.count }, (_, i) => {
  const el = document.createElement(`button`);
  el.style.cssText = `
    width:54px; height:54px; border-radius:14px;
    border:none; background:${bgColors[i % bgColors.length]};
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    user-select:none; outline:none; touch-action:manipulation;
    transform-origin:center bottom; will-change:transform;
    font-size:30px; line-height:1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
  `;
  el.textContent = icons[i % icons.length];
  // @ts-ignore
  stage.appendChild(el);

  const s = makeButtonState();
  wireButton(el, s, i);
  return { el, s };
});

function wireButton(el, s, index) {
  const unhoverDelay = timeout(() => {
    if (state.hoveredIndex === index) state.hoveredIndex = -1;
  }, 400);

  const hover = () => {
    unhoverDelay.cancel(); state.hoveredIndex = index;
  };
  const unhover = (delayed = false) => delayed ?
    unhoverDelay.start() :
    (unhoverDelay.cancel(), state.hoveredIndex === index && (state.hoveredIndex = -1));

  el.addEventListener(`pointerenter`, hover);
  el.addEventListener(`pointerdown`, hover);
  el.addEventListener(`pointerleave`, () => unhover(true));
  el.addEventListener(`pointerup`, () => unhover(true));
  el.addEventListener(`pointercancel`, () => unhover(false));

  el.addEventListener(`click`, () => {
    s.clicks = Numbers.clamp(s.clicks + 1, 0, settings.maxClicks);
    const e = energyFor(s);
    s.velY += 3 * (0.3 + e * 0.7);
  });
}

function energyFor(s) {
  return Math.max(0, 1 - s.clicks / settings.maxClicks);
}

continuously(() => {
  const now = performance.now();

  for (let i = 0; i < buttons.length; i++) {
    const { el, s } = buttons[i];
    const dt = Math.min(now - s.lastTime, 50);
    s.lastTime = now;

    const e = energyFor(s);

    const dist = state.hoveredIndex < 0 ? Infinity : Math.abs(i - state.hoveredIndex);
    const influence = dist === 0 ? 1 : dist === 1 ? settings.neighborInfluence : 0;
    const isHovered = dist === 0;

    if (!isHovered && e < 1) {
      s.clicks = Math.max(0, s.clicks - settings.recoveryRate * dt * settings.maxClicks);
    }

    const maxLift = Numbers.interpolate(e, settings.minLift, settings.maxLift);
    const maxScale = Numbers.interpolate(e, settings.minScale, settings.maxScale);
    const stiffness = Numbers.interpolate(e, settings.springK * 0.3, settings.springK);
    const damp = Numbers.interpolate(e, 0.88, settings.springDamp);

    // normalise to 60 fps so the spring behaves the same at any frame rate
    const t = dt / 16.667;

    // spring for Y position
    const targetY = -maxLift * influence;
    s.velY += (targetY - s.liftY) * stiffness * t;
    s.velY *= damp ** t;
    s.liftY += s.velY * t;

    // spring for scale
    const targetS = 1 + (maxScale - 1) * influence;
    s.velS += (targetS - s.scaleY) * stiffness * t;
    s.velS *= damp ** t;
    s.scaleY += s.velS * t;

    el.style.transform = `translateY(${s.liftY.toFixed(2)}px) scale(${s.scaleY.toFixed(4)})`;
    el.style.filter = state.greyscaleActive ? `grayscale(${(1 - e).toFixed(3)})` : ``;

    const shadowA = isHovered ? Math.round(e * 18) : 0;
    const shadowY = Math.round(-s.liftY * 0.6);
    el.style.boxShadow = shadowA > 0 ?
      `0 ${shadowY}px ${Math.round(shadowA * 1.5)}px rgba(0,0,0,${(shadowA / 100).toFixed(2)})` :
      `none`;
  }
}).start();