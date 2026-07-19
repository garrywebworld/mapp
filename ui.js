<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Earth Documentary Explorer logo">
  <defs>
    <radialGradient id="globeFill" cx="38%" cy="34%" r="70%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="18%" stop-color="#8df1ff" />
      <stop offset="46%" stop-color="#1c82ff" />
      <stop offset="78%" stop-color="#073768" />
      <stop offset="100%" stop-color="#010711" />
    </radialGradient>
    <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8df7ff" />
      <stop offset="100%" stop-color="#1c82ff" />
    </linearGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2.2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <circle cx="32" cy="32" r="26" fill="url(#globeFill)" filter="url(#glow)" />

  <g stroke="rgba(6,20,40,0.55)" stroke-width="0.9" fill="none">
    <ellipse cx="32" cy="32" rx="26" ry="9" />
    <ellipse cx="32" cy="32" rx="26" ry="17.5" />
    <path d="M 12 20 A 26 26 0 0 0 12 44" />
    <path d="M 22 8.5 A 26 26 0 0 0 22 55.5" />
    <path d="M 42 8.5 A 26 26 0 0 0 42 55.5" />
    <path d="M 52 20 A 26 26 0 0 1 52 44" />
    <line x1="6" y1="32" x2="58" y2="32" />
  </g>

  <g transform="rotate(-18 32 32)">
    <ellipse cx="32" cy="32" rx="30" ry="11" fill="none" stroke="url(#ringStroke)" stroke-width="1.6" opacity="0.85" filter="url(#glow)" />
    <circle cx="61.2" cy="32" r="2.1" fill="#eafeff" filter="url(#glow)" />
  </g>
</svg>
