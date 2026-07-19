import { clamp, latLonToVector3 } from "./utils.js";

export class GlobeExplorer {
  constructor(canvas, ring, coordinates) {
    this.canvas = canvas;
    this.ring = ring;
    this.coordinates = coordinates;
    this.rotationSpeed = 0.0018;
    this.zoom = 5.2;
    this.target = { lat: 20.5937, lon: 78.9629 };
    this.isTilted = false;
    this.drag = { active: false, x: 0, y: 0 };
    this.useThree = Boolean(window.THREE);
    this.init();
  }

  init() {
    if (this.useThree) this.initThree();
    else this.initCanvasFallback();
    this.bindControls();
  }

  initThree() {
    const THREE = window.THREE;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.camera.position.z = this.zoom;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const earthGeometry = new THREE.SphereGeometry(2, 96, 96);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e73d8,
      shininess: 42,
      emissive: 0x03132a,
      specular: 0x6feeff
    });
    this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
    this.scene.add(this.earth);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.035, 96, 96),
      new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.14, depthWrite: false })
    );
    this.clouds = clouds;
    this.scene.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.12, 96, 96),
      new THREE.MeshBasicMaterial({ color: 0x66eaff, transparent: true, opacity: 0.12, side: THREE.BackSide })
    );
    this.scene.add(atmosphere);

    const land = new THREE.Group();
    const material = new THREE.MeshLambertMaterial({ color: 0x0d382d, transparent: true, opacity: 0.88 });
    [
      [-100, 45, 0.8, 0.45],
      [-60, -15, 0.55, 0.9],
      [15, 5, 0.78, 1.0],
      [80, 35, 0.95, 0.7],
      [135, -25, 0.45, 0.35],
      [25, 55, 0.48, 0.3]
    ].forEach(([lon, lat, sx, sy]) => {
      const patch = new THREE.Mesh(new THREE.SphereGeometry(2.006, 24, 12, 0, Math.PI * sx, 0, Math.PI * sy), material);
      patch.rotation.y = (-lon * Math.PI) / 180;
      patch.rotation.x = (lat * Math.PI) / 340;
      land.add(patch);
    });
    this.earth.add(land);

    this.marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x6ff7ff })
    );
    this.scene.add(this.marker);

    this.scene.add(new THREE.AmbientLight(0x8bbdff, 0.7));
    const sun = new THREE.DirectionalLight(0xffffff, 2.1);
    sun.position.set(5, 3, 4);
    this.scene.add(sun);
    const night = new THREE.DirectionalLight(0x0b46a1, 0.7);
    night.position.set(-5, -2, -4);
    this.scene.add(night);

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.animate();
    this.focusOn(20.5937, 78.9629, false);
  }

  initCanvasFallback() {
    this.context = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.animateFallback();
  }

  bindControls() {
    this.canvas.addEventListener("pointerdown", (event) => {
      this.drag = { active: true, x: event.clientX, y: event.clientY };
      this.canvas.setPointerCapture(event.pointerId);
    });
    this.canvas.addEventListener("pointermove", (event) => {
      if (!this.drag.active || !this.earth) return;
      const dx = event.clientX - this.drag.x;
      const dy = event.clientY - this.drag.y;
      this.earth.rotation.y += dx * 0.006;
      this.earth.rotation.x = clamp(this.earth.rotation.x + dy * 0.003, -0.8, 0.8);
      this.drag.x = event.clientX;
      this.drag.y = event.clientY;
    });
    this.canvas.addEventListener("pointerup", () => {
      this.drag.active = false;
    });
    this.canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      this.zoom = clamp(this.zoom + event.deltaY * 0.002, 3.2, 7.5);
      if (this.camera) this.camera.position.z = this.zoom;
    }, { passive: false });
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    if (this.renderer) {
      this.renderer.setSize(rect.width, rect.height, false);
      this.camera.aspect = rect.width / rect.height;
      this.camera.updateProjectionMatrix();
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.drag.active) this.earth.rotation.y += this.rotationSpeed;
    this.clouds.rotation.y += this.rotationSpeed * 1.45;
    this.clouds.rotation.x += this.rotationSpeed * 0.14;
    this.marker.rotation.y += 0.04;
    this.renderer.render(this.scene, this.camera);
    this.updateRing();
  }

  animateFallback() {
    requestAnimationFrame(() => this.animateFallback());
    const ctx = this.context;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const r = Math.min(w, h) * 0.33;
    ctx.clearRect(0, 0, w, h);
    const gradient = ctx.createRadialGradient(w * 0.44, h * 0.42, r * 0.1, w * 0.5, h * 0.5, r);
    gradient.addColorStop(0, "#8df7ff");
    gradient.addColorStop(0.28, "#1c82ff");
    gradient.addColorStop(0.72, "#073768");
    gradient.addColorStop(1, "#010711");
    ctx.shadowColor = "rgba(100,234,255,0.8)";
    ctx.shadowBlur = 42;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(9,60,45,0.72)";
    ctx.beginPath();
    ctx.ellipse(w * 0.44, h * 0.47, r * 0.42, r * 0.2, -0.4, 0, Math.PI * 2);
    ctx.ellipse(w * 0.57, h * 0.54, r * 0.34, r * 0.18, 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  focusOn(lat, lon, animated = true) {
    this.target = { lat, lon };
    this.coordinates.textContent = `Lat ${lat.toFixed(2)} / Lon ${lon.toFixed(2)}`;
    if (!this.useThree) return;
    const vector = latLonToVector3(lat, lon, 2.12);
    this.marker.position.set(vector.x, vector.y, vector.z);
    const targetRotationY = ((lon + 90) * Math.PI) / 180;
    const targetRotationX = (-lat * Math.PI) / 360;
    if (animated && window.gsap) {
      window.gsap.to(this.earth.rotation, { y: targetRotationY, x: targetRotationX, duration: 1.9, ease: "power3.inOut" });
      window.gsap.to(this.camera.position, { z: 3.55, duration: 1.2, yoyo: true, repeat: 1, ease: "power2.inOut" });
    } else {
      this.earth.rotation.y = targetRotationY;
      this.earth.rotation.x = targetRotationX;
    }
  }

  updateRing() {
    if (!this.marker || !this.camera) return;
    const projected = this.marker.position.clone().project(this.camera);
    const rect = this.canvas.getBoundingClientRect();
    const x = (projected.x * 0.5 + 0.5) * rect.width;
    const y = (-projected.y * 0.5 + 0.5) * rect.height;
    this.ring.style.left = `${x}px`;
    this.ring.style.top = `${y}px`;
    this.ring.style.opacity = projected.z < 1 ? "1" : "0";
  }

  toggleTilt() {
    this.isTilted = !this.isTilted;
    if (this.camera && window.gsap) {
      window.gsap.to(this.camera.rotation, { x: this.isTilted ? -0.18 : 0, duration: 0.75, ease: "power2.out" });
    }
    return this.isTilted;
  }
}
