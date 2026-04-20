import { continuously, timeout } from '@ixfx/flow.js';
import * as  Numbers from '@ixfx/numbers.js';

const settings = Object.freeze({
  count:        15,
  maxClicks:    7,
  maxLift:      6,
  minLift:      1.2,
  maxScale:     1.12,
  minScale:     1.008,
  springK:      0.18,
  springDamp:   0.62,
  recoveryRate: 0.00004,
});

function makeButtonState() {
  return {
    clicks:   0,
    liftY:    0,
    velY:     0,
    scaleY:   1,
    velS:     0,
    lastTime: performance.now(),
  };
}

const stage = document.getElementById('stage');

const icons = ['🌐','📧','🗓','📸','🎵','💬','🗺','📝','⚙️','🔍','📁','🎨','📊','🎮','🔔'];
const bgColors = [
  '#e9e9e9',
  '#0A84FF',
  '#FF453A',
  '#ffd20a',
  '#FF6B81',
  '#30D158',
  '#e9e9e9',
  '#FFD60A',
  '#e9e9e9',
  '#64D2FF',
  '#FF9F0A',
  '#5E5CE6',
  '#00C7BE',
  '#BF5AF2',
  '#64D2FF',
];

const buttons = Array.from({ length: settings.count }, (_, i) => {
  const el = document.createElement('button');
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
  stage.appendChild(el);

  const s = makeButtonState();
  wireButton(el, s);
  return { el, s };
});

function wireButton(el, s) {
  const unhoverDelay = timeout(() => { s.hovered = false; }, 400);

  const hover = () => { unhoverDelay.cancel(); s.hovered = true; };
  const unhover = (delayed = false) => delayed ? unhoverDelay.start() : (unhoverDelay.cancel(), s.hovered = false);

  el.addEventListener('pointerenter', hover);
  el.addEventListener('pointerdown', hover);
  el.addEventListener('pointerleave', () => unhover(true));
  el.addEventListener('pointerup', () => unhover(true));
  el.addEventListener('pointercancel', () => unhover(false));

  el.addEventListener('click', () => {
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

  for (const { el, s } of buttons) {
    const dt = Math.min(now - s.lastTime, 50);
    s.lastTime = now;

    const e = energyFor(s);

    if (!s.hovered && e < 1) {
      s.clicks = Math.max(0, s.clicks - settings.recoveryRate * dt * settings.maxClicks);
    }

    const maxLift   = Numbers.interpolate(e, settings.minLift, settings.maxLift);
    const maxScale  = Numbers.interpolate(e, settings.minScale, settings.maxScale);
    const stiffness = Numbers.interpolate(e, settings.springK * 0.3, settings.springK);
    const damp      = Numbers.interpolate(e, 0.88, settings.springDamp);

    // spring for Y position
    const targetY = s.hovered ? -maxLift : 0;
    s.velY += (targetY - s.liftY) * stiffness;
    s.velY *= damp;
    s.liftY += s.velY;

    // spring for scale
    const targetS = s.hovered ? maxScale : 1;
    s.velS += (targetS - s.scaleY) * stiffness;
    s.velS *= damp;
    s.scaleY += s.velS;

    el.style.transform = `translateY(${Math.round(s.liftY * 10) / 10}px) scale(${Math.round(s.scaleY * 1000) / 1000})`;

    const shadowA = s.hovered ? Math.round(e * 18) : 0;
    const shadowY = Math.round(-s.liftY * 0.6);
    el.style.boxShadow = shadowA > 0
      ? `0 ${shadowY}px ${Math.round(shadowA * 1.5)}px rgba(0,0,0,${(shadowA / 100).toFixed(2)})`
      : 'none';
  }
}).start();