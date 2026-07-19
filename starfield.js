// All sound in this file is synthesized in the browser with the Web Audio API.
// Nothing is loaded from an external audio file, so there is nothing to host,
// license, or break — the "asset" is the oscillator/noise graph itself.

export function createAudioController() {
  let context;
  let droneA;
  let droneB;
  let droneGain;
  let noiseSource;
  let noiseGain;
  let noiseFilter;
  let lfo;
  let active = false;

  function ensureContext() {
    context = context || new (window.AudioContext || window.webkitAudioContext)();
    return context;
  }

  function buildNoiseBuffer(ctx) {
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function start() {
    const ctx = ensureContext();

    // Twin detuned oscillators create a slow-beating, spacecraft-hum drone.
    droneGain = ctx.createGain();
    droneGain.gain.value = 0.0001;
    droneGain.connect(ctx.destination);

    droneA = ctx.createOscillator();
    droneA.type = "sine";
    droneA.frequency.value = 82;
    droneB = ctx.createOscillator();
    droneB.type = "sine";
    droneB.frequency.value = 86;
    droneA.connect(droneGain);
    droneB.connect(droneGain);
    droneA.start();
    droneB.start();

    // A soft, filtered noise bed suggests distant atmosphere / solar wind.
    noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buildNoiseBuffer(ctx);
    noiseSource.loop = true;
    noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 420;
    noiseFilter.Q.value = 0.7;
    noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.0001;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start();

    // A slow LFO gently sweeps the noise filter so the "atmosphere" breathes.
    lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(noiseFilter.frequency);
    lfo.start();

    droneGain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 1.4);
    noiseGain.gain.exponentialRampToValueAtTime(0.012, ctx.currentTime + 1.8);
    active = true;
  }

  function stop() {
    if (!context) return;
    const now = context.currentTime;
    if (droneGain) droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    if (noiseGain) noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    [droneA, droneB, noiseSource, lfo].forEach((node) => node && node.stop(now + 0.55));
    droneA = droneB = noiseSource = lfo = null;
    active = false;
  }

  function ping(frequency = 420) {
    if (!context) return;
    const tone = context.createOscillator();
    const toneGain = context.createGain();
    tone.type = "triangle";
    tone.frequency.value = frequency;
    toneGain.gain.value = 0.0001;
    tone.connect(toneGain);
    toneGain.connect(context.destination);
    tone.start();
    toneGain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.02);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    tone.stop(context.currentTime + 0.24);
  }

  // A brighter two-note chime for entering documentary/cinematic mode.
  function chime() {
    if (!context) return;
    const notes = [660, 990];
    notes.forEach((freq, index) => {
      const tone = context.createOscillator();
      const toneGain = context.createGain();
      tone.type = "sine";
      tone.frequency.value = freq;
      toneGain.gain.value = 0.0001;
      tone.connect(toneGain);
      toneGain.connect(context.destination);
      const startAt = context.currentTime + index * 0.12;
      tone.start(startAt);
      toneGain.gain.exponentialRampToValueAtTime(0.05, startAt + 0.03);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.5);
      tone.stop(startAt + 0.55);
    });
  }

  // A short, quiet click for UI navigation (timeline, chapter controls).
  function click() {
    if (!context) return;
    const tone = context.createOscillator();
    const toneGain = context.createGain();
    tone.type = "square";
    tone.frequency.value = 220;
    toneGain.gain.value = 0.0001;
    tone.connect(toneGain);
    toneGain.connect(context.destination);
    tone.start();
    toneGain.gain.exponentialRampToValueAtTime(0.02, context.currentTime + 0.01);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.09);
    tone.stop(context.currentTime + 0.1);
  }

  return {
    toggle() {
      if (active) stop();
      else start();
      return active;
    },
    isActive: () => active,
    ping,
    chime,
    click
  };
}
