import { continuously } from "@ixfx/flow.js";
import { clamp, interpolate } from '@ixfx/numbers.js';
import { Easings } from "@ixfx/modulation.js";
import { Forces } from "@ixfx/modulation.js";

    // ─── SETTINGS ────────────────────────────────────────────
  const settings = {
      text:           "The quick brown fox jumps over the lazy dog",
      fontsize:       48,
      fontFamily:     "serif",
      lineHeight:     1.4,
      springStrength: 0.18,
      snapStrength:   0.4,
      edgeRadius:     28,
      edgeDamping:    0.38,
      freeDamping:    0.88,
      highlightColor: "rgba(80, 140, 255, 0.35)",
      textColor:      "#111",
      cursorColor:    "#3366ff",
  };

    // ─── STATE ───────────────────────────────────────────────
    const state = {
      dpr:         1,
      cssW:        0,
      cssH:        0,
      cursorX:     0,
      velocity:    0,
      targetX:     0,
      selectStart: null,
      dragging:    false,
      pointerType: "",
      words:       [],
    };

    // ─── CANVAS ──────────────────────────────────────────────
    const canvas = document.getElementById("canvas");
    const ctx    = canvas.getContext("2d");
    const debug  = document.getElementById("debug");

    // ─── LAYOUT ──────────────────────────────────────────────
    function layoutWords() {
      const { text, fontsize, fontFamily, lineHeight } = settings;
      ctx.font = `${fontsize}px ${fontFamily}`;
      const padding    = fontsize;
      const maxWidth   = state.cssW - padding * 2;
      const spaceWidth = ctx.measureText(" ").width;
      const lineH      = fontsize * lineHeight;

      state.words = [];
      let x = padding, y = padding + fontsize;

      for (const word of text.split(" ")) {
        const w = ctx.measureText(word).width;
        if (x + w > padding + maxWidth && x !== padding) {
          x  = padding;
          y += lineH;
        }
        state.words.push({ word, x, y, width: w, height: fontsize });
        x += w + spaceWidth;
      }
    }

    // ─── RESIZE ──────────────────────────────────────────────
    function resize() {
      state.dpr  = window.devicePixelRatio || 1;
      state.cssW = window.innerWidth;
      state.cssH = window.innerHeight - (debug.offsetHeight || 28);

      canvas.width        = Math.floor(state.cssW * state.dpr);
      canvas.height       = Math.floor(state.cssH * state.dpr);
      canvas.style.width  = state.cssW + "px";
      canvas.style.height = state.cssH + "px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(state.dpr, state.dpr);
      layoutWords();
    }

    // ─── HELPERS ─────────────────────────────────────────────

    function nearestBoundary(lx) {
      let best = null, bestDist = Infinity;
      for (const w of state.words) {
        for (const bx of [w.x, w.x + w.width]) {
          const d = Math.abs(lx - bx);
          if (d < bestDist) { bestDist = d; best = bx; }
        }
      }
      return { boundary: best, dist: bestDist };
    }

    // ─── POINTER ─────────────────────────────────────────────
    canvas.addEventListener("pointerdown", e => {
      canvas.setPointerCapture(e.pointerId);
      state.dragging    = true;
      state.targetX     = e.offsetX;
      state.cursorX     = e.offsetX;
      state.velocity    = 0;
      state.selectStart = e.offsetX;
      state.pointerType = e.pointerType || "mouse";
    });

    canvas.addEventListener("pointermove", e => {
      state.pointerType = e.pointerType || "mouse";
      if (state.dragging) state.targetX = e.offsetX;
      updateDebug();
    });

    canvas.addEventListener("pointerup",     stopDrag);
    canvas.addEventListener("pointercancel", stopDrag);

    function stopDrag() {
      state.dragging    = false;
      state.selectStart = null;
    }

    // ─── DEBUG ───────────────────────────────────────────────
    function updateDebug() {
      const { dist } = nearestBoundary(state.cursorX);
      debug.textContent =
        `cursorX ${Math.round(state.cursorX)}  ·  ` +
        `targetX ${Math.round(state.targetX)}  ·  ` +
        `vel ${state.velocity.toFixed(2)}  ·  ` +
        `edge ${Math.round(dist)}px  ·  ` +
        `type ${state.pointerType}`;
    }

    // ─── DRAW ────────────────────────────────────────────────
    function draw() {
      const { cssW, cssH, words, cursorX, selectStart, dragging } = state;
      const { fontsize, fontFamily, highlightColor, textColor, cursorColor,
              springStrength, snapStrength, edgeRadius } = settings;

      if (dragging) {
        const { boundary, dist } = nearestBoundary(state.cursorX);
        const t       = clamp(dist / edgeRadius, 0, 1);
        const smooth  = Easings.Named.smoothstep(t);

        // interpolate (ixfx) blends damping: near edge = edgeDamping, free = freeDamping
        const damping   = interpolate(smooth, settings.edgeDamping, settings.freeDamping);
        const snapForce = (1 - smooth) * (boundary - state.cursorX) * snapStrength;

        state.velocity += (state.targetX - state.cursorX) * springStrength;
        state.velocity += snapForce;
        state.velocity *= damping;
        state.cursorX  = clamp(state.cursorX + state.velocity, 0, cssW);
      }

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = `${fontsize}px ${fontFamily}`;

      // Highlight
      if (dragging && selectStart !== null) {
        const selL  = Math.min(selectStart, cursorX);
        const selR  = Math.max(selectStart, cursorX);
        const lines = [...new Set(words.map(w => w.y))];

        ctx.fillStyle = highlightColor;
        for (const lineY of lines) {
          const lineWords = words.filter(w => w.y === lineY);
          const lineL     = lineWords[0].x;
          const lineR     = lineWords.at(-1).x + lineWords.at(-1).width;
          const overlapL  = Math.max(selL, lineL);
          const overlapR  = Math.min(selR, lineR);
          if (overlapR > overlapL) {
            ctx.fillRect(overlapL, lineY - fontsize * 0.85, overlapR - overlapL, fontsize * 1.1);
          }
        }
      }

      // Words
      ctx.fillStyle    = textColor;
      ctx.textBaseline = "alphabetic";
      for (const w of words) ctx.fillText(w.word, w.x, w.y);

      // Cursor
      if (dragging && words.length > 0) {
        const nearest = words.reduce((best, w) =>
          Math.abs(w.x + w.width / 2 - cursorX) <
          Math.abs(best.x + best.width / 2 - cursorX) ? w : best
        , words[0]);

        ctx.strokeStyle = cursorColor;
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.moveTo(cursorX, nearest.y - nearest.height * 0.85);
        ctx.lineTo(cursorX, nearest.y + nearest.height * 0.25);
        ctx.stroke();
      }
    }

    // ─── INIT ────────────────────────────────────────────────
    window.addEventListener("resize", resize);
    resize();

    continuously(draw).start();