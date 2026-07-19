export function createStarfield(canvas) {
  const context = canvas.getContext("2d");
  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random() * 0.9 + 0.1,
    speed: Math.random() * 0.18 + 0.04
  }));

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function render() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "rgba(255,255,255,0.9)";
    for (const star of stars) {
      star.y += star.speed / 1000;
      if (star.y > 1) {
        star.y = 0;
        star.x = Math.random();
      }
      const size = star.z * 1.8;
      context.globalAlpha = 0.22 + star.z * 0.72;
      context.beginPath();
      context.arc(star.x * window.innerWidth, star.y * window.innerHeight, size, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  render();
}
