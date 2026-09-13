// QA only: keep production game.js, DOM events, camera and scene geometry.
// Replace only the unavailable GPU renderer with a 2D calibration surface.
// This intentionally reproduces Three's inline sizing semantics, unlike the
// earlier HUD-only fixture. Never loaded by the production index.html.
(() => {
  THREE.WebGLRenderer = class {
    constructor() {
      this.domElement = document.createElement('canvas');
      this.domElement.setAttribute('aria-label', '2D calibration canvas with production camera and controls');
      this.context = this.domElement.getContext('2d');
      this.capabilities = { getMaxAnisotropy: () => 1 };
      this.ratio = 1; this.width = 300; this.height = 150;
    }
    setSize(width, height, updateStyle = true) {
      this.width = width; this.height = height;
      this.domElement.width = Math.floor(width * this.ratio);
      this.domElement.height = Math.floor(height * this.ratio);
      if (updateStyle) {
        this.domElement.style.width = width + 'px';
        this.domElement.style.height = height + 'px';
      }
    }
    setPixelRatio(ratio) { this.ratio = ratio; this.setSize(this.width, this.height, false); }
    render(scene, camera) {
      scene.updateMatrixWorld(true);
      const c = this.context, w = this.width, h = this.height;
      const yaw = camera.rotation.y, pitch = camera.rotation.x;
      Object.assign(this.domElement.dataset, {
        cameraYaw: yaw.toFixed(4), cameraPitch: pitch.toFixed(4),
        cameraAspect: String(camera.aspect), renderWidth: String(w), renderHeight: String(h)
      });
      c.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
      const gradient = c.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#133b36'); gradient.addColorStop(1, '#324225');
      c.fillStyle = gradient; c.fillRect(0, 0, w, h);
      const points = [];
      for (let angle = 0; angle < 360; angle += 15) {
        const a = angle * Math.PI / 180;
        const p = new THREE.Vector3(camera.position.x - Math.sin(a) * 12, 1.62, camera.position.z - Math.cos(a) * 12).project(camera);
        if (p.z <= -1 || p.z >= 1 || Math.abs(p.x) > 1.1) continue;
        const x = (p.x + 1) * w / 2, y = (1 - p.y) * h / 2;
        points.push([x, y]);
        c.strokeStyle = '#87caa7'; c.beginPath(); c.moveTo(x, y - h / 3); c.lineTo(x, y + h / 3); c.stroke();
        c.fillStyle = '#ddffdf'; c.font = '13px monospace'; c.textAlign = 'center'; c.fillText(angle + '°', x, y + 32);
      }
      points.sort((a, b) => a[0] - b[0]);
      if (points.length) {
        c.beginPath(); c.moveTo(points[0][0], points[0][1]);
        points.forEach(p => c.lineTo(p[0], p[1])); c.stroke();
      }
      c.strokeStyle = '#67ff9a'; c.lineWidth = 3; c.strokeRect(2, 2, w - 4, h - 4);
      c.lineWidth = 1; c.strokeRect(w / 2 - 18, h / 2 - 18, 36, 36);
      c.fillStyle = '#dbffec'; c.font = '10px monospace'; c.textAlign = 'center';
      c.fillText('2D INPUT TEST · ' + w + '×' + h + ' · yaw ' + yaw.toFixed(2) + ' / pitch ' + pitch.toFixed(2), w / 2, h - 12);
    }
  };
})();
