export function createAudioController() {
  let context;
  let oscillator;
  let gain;
  let active = false;

  function start() {
    context = context || new AudioContext();
    oscillator = context.createOscillator();
    gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 84;
    gain.gain.value = 0.025;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    active = true;
  }

  function stop() {
    if (!oscillator) return;
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
    oscillator.stop(context.currentTime + 0.38);
    oscillator = null;
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

  return {
    toggle() {
      if (active) stop();
      else start();
      return active;
    },
    ping
  };
}
