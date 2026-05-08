import p5 from 'p5';
import { CATS, MAX_CATS, BG_COLOR } from './config.js';
import { initAudio, loadSounds, triggerSound } from './synth.js';

// ─── Permanent paint layer (native Canvas 2D) ─────────────────────────────────
// Written to only when the user actively paints — never blitted per frame.
// The p5 fg-canvas sits on top and calls p.clear() each frame (cheap GPU op).

let bgCanvas = null;
let bgCtx = null;

function setupBgCanvas(container) {
  bgCanvas = document.createElement('canvas');
  bgCanvas.id = 'bg-canvas';
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  bgCtx = bgCanvas.getContext('2d');
  bgCtx.fillStyle = BG_COLOR;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
  container.prepend(bgCanvas);
}

function paintDots(x, y, px, py, maxR, hue) {
  const dist = Math.hypot(x - px, y - py);
  const steps = Math.max(1, Math.ceil(dist / 8));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ix = px + (x - px) * t + (Math.random() - 0.5) * 10;
    const iy = py + (y - py) * t + (Math.random() - 0.5) * 10;
    const h = (hue + t * 45) % 360;
    bgCtx.fillStyle = `hsla(${h},88%,65%,0.82)`;
    bgCtx.beginPath();
    bgCtx.arc(ix, iy, maxR * (0.3 + Math.random() * 0.7) / 2, 0, Math.PI * 2);
    bgCtx.fill();
  }
}

export function clearBgCanvas() {
  if (!bgCtx) return;
  bgCtx.fillStyle = BG_COLOR;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
}

// ─── Cat sprite ───────────────────────────────────────────────────────────────
class Cat {
  constructor(x, y, emoji, p) {
    this.x = x;     this.y = y;
    this.emoji = emoji;
    this.size = 12;
    this.target = p.random(50, 105);
    this.alpha = 255;
    this.grownUp = false;
    this.vx = p.random(-2, 2);
    this.vy = p.random(-2.5, -0.5);
    this.spin = p.random(-0.2, 0.2);
    this.angle = 0;
    this.p = p;
  }

  tick() {
    if (!this.grownUp) {
      this.size += (this.target - this.size) * 0.13;
      if (this.target - this.size < 1) this.grownUp = true;
    } else {
      this.alpha -= 5;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
    this.angle += this.spin;
  }

  render() {
    const p = this.p;
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.angle);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(this.size);
    p.drawingContext.globalAlpha = Math.max(0, this.alpha / 255);
    p.text(this.emoji, 0, 0);
    p.drawingContext.globalAlpha = 1;
    p.pop();
  }

  dead() { return this.alpha <= 0; }
}

// ─── p5 sketch (foreground — transparent, cleared each frame) ─────────────────
export function startGame(container) {
  setupBgCanvas(container);
  loadSounds();

  new p5((p) => {
    let hue = 0;
    const cats = [];
    const heldKeys = new Set();
    let lastCatAt = 0;       // spawn rate-limiter
    let lastPaintAt = 0;     // held-key paint throttle

    function spawnCat(x, y) {
      const now = performance.now();
      if (cats.length >= MAX_CATS || now - lastCatAt < 100) return;
      lastCatAt = now;
      cats.push(new Cat(x, y, p.random(CATS), p));
    }

    p.setup = () => {
      const cnv = p.createCanvas(window.innerWidth, window.innerHeight);
      cnv.parent(container);
      cnv.elt.id = 'fg-canvas';
      p.clear();
    };

    p.draw = () => {
      p.clear();

      if (p.mouseIsPressed) {
        paintDots(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY, 28, hue);
      }

      // Held-key scatter — throttled to avoid flooding even without sound mashing
      if (heldKeys.size > 0) {
        const now = performance.now();
        if (now - lastPaintAt > 50) {
          lastPaintAt = now;
          const s = 60;
          paintDots(
            p.mouseX + p.random(-s, s),
            p.mouseY + p.random(-s, s),
            p.mouseX, p.mouseY, 16, hue,
          );
        }
      }

      hue = (hue + 1.6) % 360;

      for (let i = cats.length - 1; i >= 0; i--) {
        cats[i].tick();
        cats[i].render();
        if (cats[i].dead()) cats.splice(i, 1);
      }
    };

    // ── Keyboard ──────────────────────────────────────────────────────────────
    p.keyPressed = () => {
      initAudio();
      heldKeys.add(p.key);
      triggerSound(p.key);
      spawnCat(p.random(60, p.width - 60), p.random(60, p.height - 60));

      if (p.key === ' ') fireConfetti(hue);
      return false;
    };

    p.keyReleased = () => {
      heldKeys.delete(p.key);
      return false;
    };

    // ── Touch (mobile) ────────────────────────────────────────────────────────
    p.touchStarted = () => {
      initAudio();
      for (const t of p.touches) {
        triggerSound(p.random(['a', 'e', 'i', 'o', '1', '2', '3']));
        spawnCat(t.x, t.y);
      }
      return false;
    };

    p.touchMoved = () => {
      for (const t of p.touches) {
        paintDots(t.x, t.y, t.x, t.y, 28, hue);
      }
      return false;
    };

    // ── Confetti burst (Space / double-tap) ───────────────────────────────────
    function fireConfetti(h) {
      for (let i = 0; i < 32; i++) {
        bgCtx.fillStyle = `hsla(${(h + i * 11) % 360},90%,65%,0.68)`;
        bgCtx.beginPath();
        bgCtx.arc(
          Math.random() * bgCanvas.width,
          Math.random() * bgCanvas.height,
          5 + Math.random() * 20, 0, Math.PI * 2,
        );
        bgCtx.fill();
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      bgCanvas.width = p.windowWidth;
      bgCanvas.height = p.windowHeight;
      bgCtx.fillStyle = BG_COLOR;
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    };
  });
}
