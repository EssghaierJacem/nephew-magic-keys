import { startGame, clearBgCanvas } from './game.js';
import { LANDING_CATS } from './cats.js';

function buildLanding() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div id="landing">
      <div class="landing-card">

        <div class="cat-hero">
          <div class="cat-float cat-float--1">${LANDING_CATS[0]}</div>
          <div class="cat-float cat-float--2">${LANDING_CATS[1]}</div>
          <div class="cat-float cat-float--3">${LANDING_CATS[2]}</div>
        </div>

        <h1>Magic Cat Keyboard</h1>
        <p class="landing-sub">Press keys. Make cats. Paint rainbows.</p>

        <div class="tip-list">
          <div class="tip-item">
            <div class="tip-dot"></div>
            Tap or press any key — a cat appears
          </div>
          <div class="tip-item">
            <div class="tip-dot"></div>
            Drag your finger or mouse — rainbow trail
          </div>
          <div class="tip-item">
            <div class="tip-dot"></div>
            Hold a key — colour bursts around cursor
          </div>
          <div class="tip-item">
            <div class="tip-dot"></div>
            Space bar — confetti explosion!
          </div>
        </div>

        <button id="play-btn" class="play-btn">Play Around!</button>

      </div>
    </div>
  `;

  document.getElementById('play-btn').addEventListener('click', launchGame);
}

function launchGame() {
  const app = document.getElementById('app');
  const landing = document.getElementById('landing');

  landing.classList.add('fade-out');

  landing.addEventListener('transitionend', () => {
    landing.remove();

    const tipBar = document.createElement('div');
    tipBar.id = 'tip-bar';
    tipBar.innerHTML = `
      <span>tap / keys → cats</span>
      <span>drag → rainbow</span>
      <span>space → confetti</span>
      <button id="clear-btn" title="Wipe canvas">🗑 clear</button>
    `;
    app.appendChild(tipBar);

    document.getElementById('clear-btn').addEventListener('click', clearBgCanvas);

    startGame(app);
  }, { once: true });
}

buildLanding();
