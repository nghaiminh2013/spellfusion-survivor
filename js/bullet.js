// EnemyBullet Class dùng trong game

class EnemyBullet {
  constructor(x, y, angle, speed, damage, color, size = 4) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.damage = damage;
    this.color = color;
    this.size = size;
    this.active = true;

    if (window.scene3D) {
      this.init3D();
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.update3D();
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.size * 2.5;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  init3D() {
    const geo = new THREE.SphereGeometry(this.size, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(this.x, 12, this.y);
    window.scene3D.add(this.mesh);
  }

  update3D() {
    if (this.mesh) {
      this.mesh.position.set(this.x, 12, this.y);
    }
  }

  destroy3D() {
    if (this.mesh && window.scene3D) {
      window.scene3D.remove(this.mesh);
    }
  }
}
