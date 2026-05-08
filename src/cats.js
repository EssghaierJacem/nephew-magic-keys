// SVG cat factory — used on the landing page illustration
function makeCat(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 96">
    <path d="${c.tail}" stroke="${c.dark}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="40" cy="74" rx="20" ry="15" fill="${c.body}"/>
    <circle cx="40" cy="36" r="22" fill="${c.body}"/>
    <path d="M20,20 L14,4 L30,18Z" fill="${c.body}"/>
    <path d="M22,19 L17,8 L28,17Z" fill="${c.ear}"/>
    <path d="M60,20 L66,4 L50,18Z" fill="${c.body}"/>
    <path d="M58,19 L63,8 L52,17Z" fill="${c.ear}"/>
    <ellipse cx="31" cy="33" rx="5" ry="6" fill="${c.pupil}"/>
    <ellipse cx="49" cy="33" rx="5" ry="6" fill="${c.pupil}"/>
    <circle cx="33" cy="30" r="2" fill="white"/>
    <circle cx="51" cy="30" r="2" fill="white"/>
    <path d="M38,41 L40,44 L42,41Z" fill="#fda4af"/>
    ${c.mouth}
    <line x1="6" y1="37" x2="30" y2="38.5" stroke="${c.whisker}" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="6" y1="42" x2="30" y2="41" stroke="${c.whisker}" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="50" y1="38.5" x2="74" y2="37" stroke="${c.whisker}" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="50" y1="41" x2="74" y2="42" stroke="${c.whisker}" stroke-width="1.3" stroke-linecap="round"/>
  </svg>`;
}

const smile = (color) =>
  `<path d="M40,44 Q35,48 31,46" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
  `<path d="M40,44 Q45,48 49,46" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;

const bigSmile = (color) =>
  `<path d="M40,44 Q34,50 29,47" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
  `<path d="M40,44 Q46,50 51,47" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;

const openMouth = (color) =>
  `<ellipse cx="40" cy="48" rx="4" ry="4.5" fill="${color}" opacity="0.55"/>`;

export const LANDING_CATS = [
  makeCat({
    body: '#f472b6', ear: '#fce7f3', dark: '#9d174d',
    pupil: '#1e1b4b', whisker: '#fbcfe8',
    tail: 'M59,72 Q72,58 67,44 Q64,33 70,25',
    mouth: smile('#9d174d'),
  }),
  makeCat({
    body: '#a78bfa', ear: '#ede9fe', dark: '#5b21b6',
    pupil: '#1e1b4b', whisker: '#c4b5fd',
    tail: 'M59,72 Q74,60 68,46 Q65,35 72,27',
    mouth: bigSmile('#5b21b6'),
  }),
  makeCat({
    body: '#2dd4bf', ear: '#ccfbf1', dark: '#0f766e',
    pupil: '#1e1b4b', whisker: '#99f6e4',
    tail: 'M21,72 Q8,58 13,44 Q16,33 10,25',
    mouth: openMouth('#0f766e'),
  }),
];
