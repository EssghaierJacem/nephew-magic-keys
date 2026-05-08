# Magic Cat Keyboard 🐾

An interactive sensory toy built for kids. Every key press or screen tap spawns an animated cat with physics. Drag a finger or mouse to paint permanent rainbow trails across the canvas.

Originally made for my nephew — works great on phones, tablets, and desktops.

---

## Features

- **Cat animations** — 5 cat emojis spawn at random positions, grow, float upward, and fade out
- **Synthesized audio** — meows on letter keys, boings on number keys, purrs on Space/Enter; no internet required
- **Cuckoo clock** (`cuckoo_clock.mp3`) mixed in randomly at 7 different pitches via Howler
- **Rainbow paint** — drag the mouse or hold any key to leave permanent colour trails on the canvas
- **Confetti burst** — Space bar scatters a full-screen burst of coloured dots
- **Touch-first** — `touchStarted` / `touchMoved` handlers make it fully playable on mobile
- **Performance-safe** — audio throttled to ~12 sounds/sec, sprites capped at 15, no per-frame canvas blit

---

## Tech stack

|                       |                                           |
| --------------------- | ----------------------------------------- |
| Bundler               | [Vite 5](https://vitejs.dev)              |
| Canvas / animation    | [p5.js](https://p5js.org) (instance mode) |
| Audio (file playback) | [Howler.js](https://howlerjs.com)         |
| Audio (synthesis)     | Web Audio API — no files needed           |
| Deployment            | [Vercel](https://vercel.com)              |

---

## Getting started

```bash
git clone https://github.com/EssghaierJacem/nephew-magic-keys.git
cd nephew-magic-keys
npm install
npm run dev
# → http://localhost:5173
```

---

## Project structure

```
nephew-magic-keys/
├── index.html
├── vercel.json
├── public/
│   └── sounds/
│       └── cuckoo_clock.mp3   ← add more .mp3 files here
└── src/
    ├── main.js          ← landing page + game transition
    ├── game.js          ← p5 sketch, two-canvas paint system
    ├── synth.js         ← Web Audio synth + Howler integration
    ├── cats.js          ← SVG cat illustrations (landing)
    ├── config.js        ← tunable constants (cat count, colours)
    └── styles/
        └── main.css
```

---

## Adding more sounds

Drop any `.mp3` into `public/sounds/`. In `src/synth.js`, load it with Howler and call it inside `triggerSound`:

```js
const _boop = new Howl({ src: ["/sounds/boop.mp3"], volume: 0.5 });

// inside triggerSound(), add a case:
if (k === "b") {
  const id = _boop.play();
  _boop.rate(0.8 + Math.random() * 0.8, id); // randomise pitch
  return;
}
```

Free CC0 sound packs: [freesound.org](https://freesound.org) → filter by CC0 licence.

**One-click** — import the repo at [vercel.com/new](https://vercel.com/new). Vite is auto-detected; output directory is `dist`.

**CLI**

```bash
npx vercel
```

`vercel.json` is already configured with the correct build command and output directory.

---

## Build

```bash
npm run build
npm run preview
```

---

## License

MIT — do whatever you want with it.
