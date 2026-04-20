import { continuously } from "https://unpkg.com/ixfx/dist/flow.js";
 
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
const debug  = document.getElementById('debug');
 
// ─── ZONES ────────────────────────────────────────────────
const zones = {
  sticky: {
    label: 'Sticky',
    desc:  'heading — resistant',
    color: '#2a2a2a',
    apply(delta, _offset) { return delta * 0.2; },
  },
  slippery: {
    label: 'Slippery',
    desc:  'body — fast',
    color: '#222',
    apply(delta, _offset) { return delta * 3.5; },
  },
  magnetic: {
    label: 'Magnetic',
    desc:  'highlight — snapping',
    color: '#252218',
    apply(delta, offset) {
      const SNAP    = 1;           // will be set per-block below
      const nearest = Math.round(offset / 80) * 80;
      const pull    = (nearest - offset) * 0.25;
      return delta * 0.9 + pull;
    },
  },
};
 
// ─── DOCUMENT CONTENT ─────────────────────────────────────
// Each block has: type, text, and a derived pixel height.
// Zone is inferred from type.
const DOC_PADDING   = 40;   // left/right padding inside doc
const LINE_H        = 22;   // px per line of body text
const BLOCK_GAP     = 14;
 
const rawBlocks = [
  { type: 'h1',   text: 'Heading 1' },
  { type: 'body', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
  { type: 'h2',   text: 'Heading 2' },
  { type: 'body', text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet consectetur adipisci velit.' },
  { type: 'body', text: 'Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure reprehenderit.' },
  { type: 'h2',   text: 'Heading 3' },
  { type: 'body', text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.' },
  { type: 'h2',   text: 'Heading 4' },
  { type: 'body', text: 'Temporibus autem quibusdam et aut officiis debitis rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur.' },
  { type: 'body', text: 'Aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis.' },
  { type: 'h2',   text: 'Heading 5' },
  { type: 'body', text: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.' },
];
 
// ─── ZONE → TYPE MAP ──────────────────────────────────────
function zoneForType(type) {
  if (type === 'h1' || type === 'h2') return zones.sticky;
  if (type === 'body')           return zones.slippery;
}
 
// ─── LAYOUT ───────────────────────────────────────────────
// We'll compute block heights and y positions after we know the canvas width.
// Store layout as array of { block, zone, y, h }
let layout = [];
let CONTENT_TOTAL_H = 0;
 
function buildLayout(docW) {
  const textW = docW - DOC_PADDING * 2;
  layout = [];
  let y = 24;
 
  for (const block of rawBlocks) {
    let h;
    if (block.type === 'h1') {
      h = 36;
    } else if (block.type === 'h2') {
      h = 28;
    } else {
      // Estimate line count from char width
      const charsPerLine = Math.floor(textW / 7.5);
      const lines = Math.ceil(block.text.length / charsPerLine);
      h = lines * LINE_H + 16;
    }
 
    layout.push({
      block,
      zone: zoneForType(block.type),
      y,
      h,
    });
 
    y += h + BLOCK_GAP;
  }
 
  CONTENT_TOTAL_H = y + 40;
}
 
// ─── STATE ────────────────────────────────────────────────
let DPR          = window.devicePixelRatio || 1;
let cssWidth     = 0;
let cssHeight    = 0;
const DOC_W      = 580;   // fixed document width
 
let contentOffset = 0;
let isScrolling   = false;
let lastY         = null;
let activeZone    = zones.slippery;
let activeBlock   = null;
let stylusX       = 0;
let stylusY       = 0;
 
// ─── RESIZE ───────────────────────────────────────────────
function resizeCanvas() {
  DPR = window.devicePixelRatio || 1;
  cssWidth  = Math.min(window.innerWidth  - 40, 700);
  cssHeight = Math.min(window.innerHeight - 100, 820);
  canvas.width         = Math.floor(cssWidth  * DPR);
  canvas.height        = Math.floor(cssHeight * DPR);
  canvas.style.width   = `${cssWidth}px`;
  canvas.style.height  = `${cssHeight}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(DPR, DPR);
  buildLayout(Math.min(DOC_W, cssWidth - 40));
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
 
// ─── POINTER ──────────────────────────────────────────────
canvas.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'touch') return;
  isScrolling = true;
  lastY = e.offsetY;
  canvas.setPointerCapture(e.pointerId);
});
 
canvas.addEventListener('pointermove', (e) => {
  stylusX = e.offsetX;
  stylusY = e.offsetY;
 
  // Find which layout block the stylus is currently over (screen coords)
  const docLeft = (cssWidth - Math.min(DOC_W, cssWidth - 40)) / 2;
  const docTop  = 0;
 
  // Map screen Y to document Y
  const docY = stylusY + contentOffset - docTop;
 
  activeBlock = null;
  for (const item of layout) {
    if (docY >= item.y && docY < item.y + item.h) {
      activeBlock = item;
      activeZone  = item.zone;
      break;
    }
  }
 
  if (isScrolling && lastY !== null) {
    const delta    = e.offsetY - lastY;
    lastY          = e.offsetY;
    const dContent = activeZone.apply(-delta, contentOffset); // negative: drag up = scroll down
    contentOffset  = clampOffset(contentOffset + dContent);
  }
 
  updateDebug(e);
});
 
canvas.addEventListener('pointerup',     stopScroll);
canvas.addEventListener('pointercancel', stopScroll);
function stopScroll() { isScrolling = false; lastY = null; }
 
function clampOffset(v) {
  return Math.max(0, Math.min(CONTENT_TOTAL_H - cssHeight, v));
}
 
// ─── COLOURS ──────────────────────────────────────────────
const C = {
  docBg:      '#fafaf8',
  pageBg:     '#1a1a1a',
  h1:         '#111',
  h2:         '#222',
  body:       '#333',
  highlight:  '#1a1600',
  highlightBg:'rgba(255, 210, 60, 0.22)',
  highlightBorder: 'rgba(200, 160, 0, 0.5)',
  stickyBg:   'rgba(0,0,0,0.03)',
  activeGlow: 'rgba(100,160,255,0.12)',
  zoneLabelNormal:  '#aaa',
  zoneLabelActive:  '#eee',
  trackLine:  '#333',
  trackDot:   '#eee',
  contentDot: '#f0b429',
};
 
// ─── DRAW ─────────────────────────────────────────────────
const docW = () => Math.min(DOC_W, cssWidth - 40);
const docX = () => (cssWidth - docW()) / 2;
 
continuously(() => {
 
  // Magnetic: continuous snap pull
  if (activeBlock && activeBlock.zone === zones.magnetic) {
    const snapY   = activeBlock.y + activeBlock.h / 2 - cssHeight / 2;
    contentOffset = clampOffset(contentOffset + (snapY - contentOffset) * 0.04);
  }
 
  ctx.clearRect(0, 0, cssWidth, cssHeight);
 
  const dw = docW();
  const dx = docX();
 
  // ── Page background ──────────────────────────────────
  ctx.fillStyle = C.pageBg;
  ctx.fillRect(0, 0, cssWidth, cssHeight);
 
  // ── Document shadow ──────────────────────────────────
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(dx + 3, 3, dw, cssHeight);
 
  // ── Document surface ─────────────────────────────────
  ctx.fillStyle = C.docBg;
  ctx.fillRect(dx, 0, dw, cssHeight);
 
  // ── Clip to doc ──────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, 0, dw, cssHeight);
  ctx.clip();
 
  const textW = dw - DOC_PADDING * 2;
  const tx    = dx + DOC_PADDING;
 
  for (const item of layout) {
    const { block, zone, y, h } = item;
    const screenY = y - contentOffset;
 
    if (screenY + h < 0)        continue;
    if (screenY > cssHeight)    break;
 
    const isActive = item === activeBlock;
 
    // Zone background tint
    if (zone === zones.sticky) {
      ctx.fillStyle = C.stickyBg;
      ctx.fillRect(dx, screenY, dw, h);
    }
    if (zone === zones.magnetic) {
      ctx.fillStyle = C.highlightBg;
      ctx.fillRect(dx, screenY, dw, h);
      ctx.fillStyle = C.highlightBorder;
      ctx.fillRect(dx, screenY, 3, h);
    }
    if (isActive) {
      ctx.fillStyle = C.activeGlow;
      ctx.fillRect(dx, screenY, dw, h);
    }
 
    // Text
    ctx.textAlign = 'left';
 
    if (block.type === 'h1') {
      ctx.font      = `500 20px 'Georgia', serif`;
      ctx.fillStyle = C.h1;
      ctx.fillText(block.text, tx, screenY + 26);
 
      // underline
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(tx, screenY + h - 2);
      ctx.lineTo(tx + textW, screenY + h - 2);
      ctx.stroke();
 
    } else if (block.type === 'h2') {
      ctx.font      = `500 14px 'Georgia', serif`;
      ctx.fillStyle = C.h2;
      ctx.fillText(block.text, tx, screenY + 20);
 
    } else {
      // Wrapped body / highlight text
      const color = block.type === 'highlight' ? C.highlight : C.body;
      ctx.font      = `12px 'Georgia', serif`;
      ctx.fillStyle = color;
      wrapText(ctx, block.text, tx, screenY + LINE_H, textW, LINE_H);
    }
 
    // Zone label (right edge, faint)
    ctx.font      = `10px 'Courier New', monospace`;
    ctx.fillStyle = isActive ? C.zoneLabelActive : C.zoneLabelNormal;
    ctx.textAlign = 'right';
    ctx.fillText(zone.label.toLowerCase(), dx + dw - 8, screenY + 14);
  }
 
  ctx.restore();
 
  // ── Right-side track visualization ──────────────────
  const trackX  = dx + dw + 20;
  const trackH  = cssHeight;
 
  // Track line
  ctx.strokeStyle = C.trackLine;
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(trackX, 0);
  ctx.lineTo(trackX, trackH);
  ctx.stroke();
 
  // Content position dot (yellow — where in the doc we are)
  const maxOffset    = Math.max(1, CONTENT_TOTAL_H - cssHeight);
  const contentDotY  = (contentOffset / maxOffset) * (trackH - 20) + 10;
  ctx.fillStyle = C.contentDot;
  ctx.beginPath();
  ctx.arc(trackX, contentDotY, 4, 0, Math.PI * 2);
  ctx.fill();
 
  // Stylus dot (white — where stylus is on screen)
  ctx.fillStyle = C.trackDot;
  ctx.beginPath();
  ctx.arc(trackX, stylusY, 4, 0, Math.PI * 2);
  ctx.fill();
 
  // Labels
  ctx.font      = `9px 'Courier New', monospace`;
  ctx.fillStyle = '#555';
  ctx.textAlign = 'left';
  ctx.fillText('S', trackX + 8, stylusY + 3);
  ctx.fillStyle = '#8a6e00';
  ctx.fillText('C', trackX + 8, contentDotY + 3);
 
  // Crosshair line on doc
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth   = 1;
  ctx.setLineDash([3, 8]);
  ctx.beginPath();
  ctx.moveTo(dx, stylusY);
  ctx.lineTo(dx + dw, stylusY);
  ctx.stroke();
  ctx.setLineDash([]);
 
}).start();
 
// ─── TEXT WRAP ────────────────────────────────────────────
function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
}
 
// ─── DEBUG ────────────────────────────────────────────────
function updateDebug(e) {
  const z = activeBlock ? activeBlock.zone.label : '—';
  const t = activeBlock ? activeBlock.block.type : '—';
  debug.textContent =
    `type: ${e.pointerType}  |  ` +
    `y: ${Math.round(e.offsetY)}  |  ` +
    `pressure: ${e.pressure.toFixed(3)}  |  ` +
    `content-type: ${t}  |  ` +
    `zone: ${z}  |  ` +
    `offset: ${Math.round(contentOffset)}`;
}