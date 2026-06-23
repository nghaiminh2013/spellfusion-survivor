// Particle System for Visual Polish & Screen Shake

class Particle {
  constructor(x, y, color, size, speed, angle, decay = 0.02, friction = 0.96) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.size = size;
    this.alpha = 1;
    this.decay = decay;
    this.friction = friction;

    if (window.scene3D) {
      this.init3D();
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.size * 2;
    ctx.shadowColor = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx.restore();
  }

  init3D() {
    const geo = new THREE.BoxGeometry(this.size, this.size, this.size);
    const mat = new THREE.MeshBasicMaterial({ 
      color: this.color, 
      transparent: true, 
      opacity: this.alpha 
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(this.x, 8 + (Math.random() * 8 - 4), this.y);
    window.scene3D.add(this.mesh);
  }

  update3D() {
    if (this.mesh) {
      this.mesh.position.set(this.x, this.mesh.position.y + (Math.random() * 0.4 - 0.2), this.y);
      this.mesh.material.opacity = Math.max(0, this.alpha);
    }
  }

  destroy3D() {
    if (this.mesh && window.scene3D) {
      window.scene3D.remove(this.mesh);
    }
  }
}

class ParticleManager {
  constructor() {
    this.particles = [];
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
  }

  addParticle(x, y, color, size, speed, angle, decay, friction) {
    if (this.particles.length >= (window.maxParticles || 1000)) {
      const oldest = this.particles.shift();
      if (oldest) oldest.destroy3D();
    }
    this.particles.push(new Particle(x, y, color, size, speed, angle, decay, friction));
  }

  // Nổ Neon cơ bản
  createExplosion(x, y, color, count = 20, maxSpeed = 6) {
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 3 + 1;
      const speed = Math.random() * maxSpeed + 1;
      const angle = Math.random() * Math.PI * 2;
      const decay = Math.random() * 0.015 + 0.015;
      this.addParticle(x, y, color, size, speed, angle, decay, 0.95);
    }
  }

  // Hạt Lửa (Đỏ cam vàng)
  createFireParticles(x, y, count = 8) {
    const colors = ['#ff4500', '#ff8c00', '#ffcc00'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 3 + 1;
      const speed = Math.random() * 3 + 1;
      const angle = Math.random() * Math.PI * 2;
      const decay = Math.random() * 0.03 + 0.02;
      this.addParticle(x, y, color, size, speed, angle, decay, 0.96);
    }
  }

  // Hạt Băng/Nước (Xanh dương, xanh nhạt, trắng)
  createWaterParticles(x, y, count = 8) {
    const colors = ['#00bfff', '#87cefa', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 2.5 + 1;
      const speed = Math.random() * 2 + 0.5;
      const angle = Math.random() * Math.PI * 2;
      const decay = Math.random() * 0.02 + 0.015;
      this.addParticle(x, y, color, size, speed, angle, decay, 0.97);
    }
  }

  // Hạt Sét (Vàng chói, trắng)
  createLightningParticles(x, y, count = 6) {
    const colors = ['#ffff00', '#ffffff', '#ffea00'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 2 + 1;
      const speed = Math.random() * 5 + 2; // Sét bắn rất nhanh
      const angle = Math.random() * Math.PI * 2;
      const decay = Math.random() * 0.04 + 0.03;
      this.addParticle(x, y, color, size, speed, angle, decay, 0.94);
    }
  }

  // Hạt Gió (Xanh lá, lục nhạt)
  createWindParticles(x, y, count = 6) {
    const colors = ['#00ff7f', '#adff2f', '#7fffd4'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 2 + 1.5;
      const speed = Math.random() * 3 + 1.5;
      const angle = Math.random() * Math.PI * 2;
      const decay = Math.random() * 0.03 + 0.02;
      this.addParticle(x, y, color, size, speed, angle, decay, 0.95);
    }
  }

  // Hiệu ứng hào quang cho người chơi dựa theo ngọc
  createPlayerTrail(x, y, elements = []) {
    if (elements.length === 0) return;
    const colors = {
      'fire': '#ff4500',
      'water': '#00bfff',
      'lightning': '#ffff00',
      'wind': '#00ff7f',
      'wood': '#2e8b57',
      'magma': '#ff3300'
    };
    
    // Chọn ngẫu nhiên màu từ ngọc đang có
    const randomEl = elements[Math.floor(Math.random() * elements.length)];
    const color = colors[randomEl] || '#ffffff';
    
    const size = Math.random() * 2 + 1;
    const speed = Math.random() * 0.5 + 0.2;
    const angle = Math.random() * Math.PI * 2;
    const decay = Math.random() * 0.04 + 0.03;
    this.addParticle(x, y, color, size, speed, angle, decay, 0.98);
  }

  // Sóng chấn động khi nổ combo
  createShockwave(x, y, color, radius = 40) {
    const segments = 24;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const speed = 4;
      const size = 2;
      const decay = 0.03;
      this.addParticle(
        x + Math.cos(angle) * (radius * 0.2), 
        y + Math.sin(angle) * (radius * 0.2), 
        color, 
        size, 
        speed, 
        angle, 
        decay, 
        0.94
      );
    }
  }

  triggerShake(intensity) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  update() {
    if (this.shakeIntensity > 0.1) {
      this.shakeIntensity *= this.shakeDecay;
    } else {
      this.shakeIntensity = 0;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      p.update3D();
      if (p.alpha <= 0) {
        p.destroy3D();
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      p.draw(ctx);
    }
  }

  getShakeOffset() {
    if (this.shakeIntensity === 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shakeIntensity,
      y: (Math.random() - 0.5) * this.shakeIntensity
    };
  }

  clear() {
    for (const p of this.particles) {
      p.destroy3D();
    }
    this.particles = [];
    this.shakeIntensity = 0;
  }
}

const particleManager = new ParticleManager();
