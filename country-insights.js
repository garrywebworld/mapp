.search {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.55rem;
  align-items: center;
  padding: 0.4rem;
  border-radius: 999px;
}

.search__icon {
  padding-left: 0.85rem;
  color: var(--cyan);
  font-size: 1.4rem;
}

.search input {
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--text);
  background: transparent;
}

.search input::placeholder {
  color: #7992aa;
}

.search button,
.primary-btn,
.secondary-btn,
.quick-grid button {
  min-height: 2.65rem;
  border-radius: 999px;
  border: 1px solid rgba(118, 229, 255, 0.42);
  padding: 0 1.05rem;
  font-weight: 800;
  background: linear-gradient(135deg, rgba(37, 137, 255, 0.95), rgba(83, 232, 255, 0.8));
  color: #00111d;
  box-shadow: 0 0 24px rgba(45, 197, 255, 0.26);
}

.secondary-btn,
.quick-grid button {
  background: rgba(9, 25, 47, 0.82);
  color: var(--text);
}

.quick-grid button {
  border-radius: 14px;
  text-align: left;
}

.icon-btn,
.dock-close,
.doc-close {
  width: 2.75rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: rgba(8, 21, 39, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.suggestions {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  z-index: 30;
  display: none;
  max-height: 16rem;
  overflow: auto;
  border-radius: 18px;
  padding: 0.45rem;
}

.suggestions.is-open {
  display: block;
}

.suggestions button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border: 0;
  border-radius: 12px;
  padding: 0.78rem 0.9rem;
  color: var(--text);
  background: transparent;
  text-align: left;
}

.suggestions button:hover {
  background: rgba(104, 228, 255, 0.12);
}

.hud,
.coordinates {
  position: absolute;
  z-index: 3;
  padding: 0.7rem 0.9rem;
  border-radius: 14px;
}

.hud {
  display: grid;
  gap: 0.1rem;
}

.hud span,
.coordinates {
  color: var(--muted);
  font-size: 0.76rem;
}

.hud strong {
  font-size: 0.86rem;
}

.hud--left {
  left: 1rem;
  bottom: 1rem;
}

.hud--right {
  right: 1rem;
  bottom: 1rem;
}

.coordinates {
  top: 1rem;
  left: 1rem;
}

.target-ring {
  position: absolute;
  z-index: 4;
  width: 88px;
  aspect-ratio: 1;
  border: 1px solid rgba(105, 237, 255, 0.88);
  border-radius: 50%;
  opacity: 0;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 24px rgba(100, 234, 255, 0.72), inset 0 0 28px rgba(100, 234, 255, 0.22);
  pointer-events: none;
}

.target-ring::before,
.target-ring::after {
  content: "";
  position: absolute;
  inset: 50% auto auto 50%;
  width: 120px;
  height: 1px;
  background: var(--cyan);
  transform: translate(-50%, -50%);
}

.target-ring::after {
  width: 1px;
  height: 120px;
}

.info-dock {
  position: fixed;
  top: 6.7rem;
  right: 1rem;
  z-index: 25;
  width: min(30rem, calc(100vw - 2rem));
  max-height: calc(100vh - 8rem);
  overflow: auto;
  border-radius: 24px;
  padding: 1rem;
  transform: translateX(calc(100% + 2rem));
  transition: transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

.info-dock.is-open {
  transform: translateX(0);
}

.dock-close,
.doc-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 2;
  font-size: 1.5rem;
}

.country-hero {
  display: grid;
  grid-template-columns: 5.4rem minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  padding-right: 2.5rem;
}

.country-hero img {
  width: 5.4rem;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.country-hero h2 {
  margin: 0;
  font-size: 2rem;
}

.country-hero p:last-child {
  margin: 0.35rem 0 0;
  color: var(--muted);
  line-height: 1.45;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin: 1rem 0;
}

.stat-card {
  min-height: 5.2rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 0.78rem;
  background: rgba(2, 10, 22, 0.52);
}

.stat-card span {
  display: block;
  color: var(--muted);
  font-size: 0.75rem;
}

.stat-card strong {
  display: block;
  margin-top: 0.4rem;
  overflow-wrap: anywhere;
}

.panel-actions {
  display: flex;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.detail-sections {
  display: grid;
  gap: 0.72rem;
}

.detail-section {
  border-top: 1px solid var(--line);
  padding-top: 0.72rem;
}

.detail-section h3 {
  margin: 0 0 0.3rem;
  font-size: 0.95rem;
  color: #d9f7ff;
}

.detail-section p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.world-map {
  position: relative;
  min-height: 340px;
  overflow: hidden;
  border-radius: 18px;
  background:
    linear-gradient(rgba(98, 233, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(98, 233, 255, 0.05) 1px, transparent 1px),
    radial-gradient(circle at 42% 50%, rgba(39, 141, 255, 0.28), transparent 18rem),
    #04101f;
  background-size: 42px 42px, 42px 42px, auto, auto;
}

.map-marker {
  position: absolute;
  width: 0.9rem;
  aspect-ratio: 1;
  border: 2px solid var(--cyan);
  border-radius: 50%;
  background: #051526;
  box-shadow: 0 0 18px rgba(100, 234, 255, 0.8);
  transform: translate(-50%, -50%);
}

.map-marker.is-active {
  width: 1.35rem;
  background: var(--cyan);
}

.map-label {
  position: absolute;
  transform: translate(0.65rem, -50%);
  color: #dffbff;
  font-size: 0.72rem;
  white-space: nowrap;
}

.documentary {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: none;
  overflow: auto;
  background: #01040b;
}

.documentary.is-open {
  display: block;
}

.doc-backdrop {
  position: fixed;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(1, 4, 11, 0.9), rgba(1, 4, 11, 0.34)),
    radial-gradient(circle at 65% 35%, rgba(35, 143, 255, 0.36), transparent 24rem);
}

.doc-content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1rem;
  width: min(1120px, calc(100% - 2rem));
  min-height: 100vh;
  margin: 0 auto;
  padding: clamp(4.5rem, 8vw, 7rem) 0 2rem;
  align-content: center;
}

.doc-content h2 {
  margin: 0;
  max-width: 13ch;
  font-size: clamp(2.6rem, 8vw, 7.5rem);
  line-height: 0.88;
}

.doc-content > p:not(.eyebrow) {
  max-width: 48rem;
  color: #c9d9e8;
  font-size: 1.1rem;
  line-height: 1.7;
}

.chapter-frame {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
  min-height: 22rem;
  border: 1px solid var(--line-strong);
  border-radius: 24px;
  overflow: hidden;
  background: rgba(2, 12, 25, 0.72);
}

.chapter-media {
  min-height: 20rem;
  background-size: cover;
  background-position: center;
}

.chapter-copy {
  padding: clamp(1.2rem, 4vw, 2.4rem);
  align-self: center;
}

.chapter-copy span {
  color: var(--cyan);
  font-weight: 900;
}

.chapter-copy h3 {
  margin: 0.4rem 0;
  font-size: clamp(1.6rem, 3vw, 3.2rem);
}

.chapter-copy p {
  color: var(--muted);
  line-height: 1.75;
}

.timeline {
  display: flex;
  gap: 0.55rem;
  overflow-x: auto;
  padding: 0.3rem 0 0.8rem;
}

.timeline button {
  flex: 0 0 10rem;
  min-height: 5rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  color: var(--text);
  background: rgba(8, 22, 42, 0.72);
  text-align: left;
  padding: 0.8rem;
}

.timeline button.is-active {
  border-color: var(--cyan);
  box-shadow: 0 0 20px rgba(100, 234, 255, 0.24);
}

.doc-controls {
  display: flex;
  gap: 0.65rem;
  justify-content: flex-end;
}

@media (max-width: 760px) {
  .info-dock {
    top: auto;
    right: 0.65rem;
    bottom: 0.65rem;
    width: calc(100vw - 1.3rem);
    max-height: 72vh;
  }

  .stat-grid,
  .chapter-frame {
    grid-template-columns: 1fr;
  }

  .panel-actions,
  .doc-controls {
    flex-direction: column;
  }
}
