class XPGem {
  constructor(x, y, value = 1) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.color = value >= 10 ? '#ffe600' : value >= 5 ? '#9d00ff' : '#00f3ff';
    this.size = value >= 10 ? 6 : value >= 5 ? 5 : 4;
    this.vx = 0;
    this.vy = 0;
    this.speed = 0;
    this.maxSpeed = 14;
    this.collected = false;

    if (window.scene3D) {
      this.init3D();
    }
  }

  update(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < player.magnetRadius) {
      this.speed = Math.min(this.maxSpeed, this.speed + 0.6);
      this.vx = (dx / dist) * this.speed;
      this.vy = (dy / dist) * this.speed;
      this.x += this.vx;
      this.y += this.vy;
    } else {
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.x += this.vx;
      this.y += this.vy;
    }

    if (dist < player.size + this.size) {
      player.gainXP(this.value);
      this.collected = true;
      this.destroy3D();
    }
    this.update3D();
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowBlur = this.size * 3;
    ctx.shadowColor = this.color;
    
    if (assetManager.isLoaded('xp_gem')) {
      const drawSize = this.size * 2.8;
      ctx.drawImage(assetManager.get('xp_gem'), this.x - drawSize / 2, this.y - drawSize / 2, drawSize, drawSize);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x + this.size, this.y);
      ctx.lineTo(this.x, this.y + this.size);
      ctx.lineTo(this.x - this.size, this.y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  init3D() {
    const geo = new THREE.OctahedronGeometry(this.size * 0.7, 0);
    const mat = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(this.x, 6, this.y);
    window.scene3D.add(this.mesh);
  }

  update3D() {
    if (this.mesh) {
      this.mesh.position.set(this.x, 6 + Math.sin(Date.now() * 0.006 + this.x) * 1.5, this.y);
      this.mesh.rotation.y += 0.04;
    }
  }

  destroy3D() {
    if (this.mesh && window.scene3D) {
      window.scene3D.remove(this.mesh);
    }
  }
}

class ResourcePickup {
  constructor(x, y, type = 'wood', amount = 1) {
    this.x = x;
    this.y = y;
    this.type = type; // 'wood', 'stone', 'iron', 'gold_ore', 'diamond_ore'
    this.amount = amount;
    this.color = type === 'wood' ? '#00ff7f' : type === 'stone' ? '#87cefa' : type === 'iron' ? '#da70d6' : type === 'gold_ore' ? '#ffd700' : '#00ffff';
    this.size = type === 'wood' ? 5 : type === 'stone' ? 5.5 : type === 'iron' ? 6 : type === 'gold_ore' ? 6 : 6.5;
    this.vx = (Math.random() * 2 - 1) * 1.5;
    this.vy = (Math.random() * 2 - 1) * 1.5;
    this.speed = 0;
    this.maxSpeed = 14;
    this.collected = false;

    if (window.scene3D) {
      this.init3D();
    }
  }

  update(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < player.magnetRadius) {
      this.speed = Math.min(this.maxSpeed, this.speed + 0.65);
      this.vx = (dx / dist) * this.speed;
      this.vy = (dy / dist) * this.speed;
      this.x += this.vx;
      this.y += this.vy;
    } else {
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.x += this.vx;
      this.y += this.vy;
    }

    if (dist < player.size + this.size) {
      if (this.type === 'wood') {
        player.wood = (player.wood || 0) + this.amount;
      } else if (this.type === 'stone') {
        player.stone = (player.stone || 0) + this.amount;
      } else if (this.type === 'iron') {
        player.iron = (player.iron || 0) + this.amount;
      } else if (this.type === 'gold_ore') {
        player.gold_ore = (player.gold_ore || 0) + this.amount;
      } else if (this.type === 'diamond_ore') {
        player.diamond_ore = (player.diamond_ore || 0) + this.amount;
      }
      this.collected = true;
      soundManager.playOrbPickup(this.type === 'wood' ? 'wood' : this.type === 'stone' ? 'wind' : 'lightning');
      
      // Floating indicator when picking up
      let displayName = 'Gỗ';
      if (this.type === 'stone') displayName = 'Đá';
      else if (this.type === 'iron') displayName = 'Sắt';
      else if (this.type === 'gold_ore') displayName = 'Vàng';
      else if (this.type === 'diamond_ore') displayName = 'K.Cương';
      
      if (window.FloatingText && gameCtx.floatingTexts) {
        gameCtx.floatingTexts.push(new FloatingText(this.x, this.y - 12, `+${this.amount} ${displayName}`, this.color));
      }
      
      this.destroy3D();
    }
    this.update3D();
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowBlur = this.size * 3;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    
    if (this.type === 'wood') {
      // Wood log shape
      ctx.translate(this.x, this.y);
      ctx.rotate(0.3);
      ctx.fillRect(-this.size * 1.4, -this.size * 0.5, this.size * 2.8, this.size);
    } else if (this.type === 'stone') {
      // Hexagonal stone
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const rx = this.x + Math.cos(angle) * this.size;
        const ry = this.y + Math.sin(angle) * this.size;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'iron') {
      // Diamond iron ingot
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size * 1.3);
      ctx.lineTo(this.x + this.size * 0.9, this.y);
      ctx.lineTo(this.x, this.y + this.size * 1.3);
      ctx.lineTo(this.x - this.size * 0.9, this.y);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'gold_ore') {
      // Golden nugget (jagged circle)
      ctx.beginPath();
      const points = 7;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const r = this.size * (0.8 + Math.sin(i * 1.7) * 0.15);
        const rx = this.x + Math.cos(angle) * r;
        const ry = this.y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'diamond_ore') {
      // Shiny diamond crystal shape (star/double-cone)
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size * 1.3);
      ctx.lineTo(this.x + this.size * 0.75, this.y);
      ctx.lineTo(this.x, this.y + this.size * 1.3);
      ctx.lineTo(this.x - this.size * 0.75, this.y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  init3D() {
    const geo = this.type === 'wood' 
      ? new THREE.CylinderGeometry(this.size * 0.4, this.size * 0.4, this.size * 2, 8)
      : new THREE.DodecahedronGeometry(this.size * 0.7);
    const mat = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(this.x, 6, this.y);
    window.scene3D.add(this.mesh);
  }

  update3D() {
    if (this.mesh) {
      this.mesh.position.set(this.x, 6 + Math.sin(Date.now() * 0.006 + this.x) * 1.5, this.y);
      this.mesh.rotation.y += 0.04;
    }
  }

  destroy3D() {
    if (this.mesh && window.scene3D) {
      window.scene3D.remove(this.mesh);
    }
  }
}

class TurretBullet {
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

  update(enemies) {
    this.x += this.vx;
    this.y += this.vy;
    
    // Check collision with enemies
    for (const e of enemies) {
      if (e.dead) continue;
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < e.size + this.size) {
        e.takeDamage(this.damage);
        this.active = false;
        this.destroy3D();
        break;
      }
    }
    this.update3D();
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.size * 3;
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

class CaveEntrance {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 35;
    this.color = '#9d00ff'; // Neon purple portal
  }

  draw(ctx) {
    ctx.save();
    
    // Check distance to player
    const dist = Math.hypot(gameCtx.player.x - this.x, gameCtx.player.y - this.y);
    ctx.translate(this.x, this.y);
    
    // 1. Draw jagged rock arch (vector rock shapes)
    ctx.strokeStyle = '#222224';
    ctx.lineWidth = 2;
    
    const numRocks = 8;
    for (let i = 0; i < numRocks; i++) {
      ctx.save();
      const angle = Math.PI + (i / (numRocks - 1)) * Math.PI; // semi circle arch over top
      ctx.translate(Math.cos(angle) * 32, Math.sin(angle) * 22);
      ctx.rotate(angle + Math.PI / 2 + (i % 2 === 0 ? 0.2 : -0.2));
      
      ctx.fillStyle = i % 2 === 0 ? '#4a4a4d' : '#333336';
      ctx.beginPath();
      ctx.moveTo(-12, -8);
      ctx.lineTo(10, -12);
      ctx.lineTo(15, 10);
      ctx.lineTo(-8, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    
    // 2. Draw dark interior void (ellipse)
    ctx.fillStyle = '#06060c';
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 3. Draw neon purple magic swirl core
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    
    const angleOffset = Date.now() * 0.0035;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const startAngle = angleOffset + (i / 3) * Math.PI * 2;
      for (let theta = 0; theta < Math.PI; theta += 0.1) {
        const currentAngle = startAngle + theta;
        const radius = (1 - (theta / Math.PI)) * 18 + 4;
        const sx = Math.cos(currentAngle) * radius;
        const sy = Math.sin(currentAngle) * radius * 0.7;
        if (theta === 0) {
          ctx.moveTo(sx, sy);
        } else {
          ctx.lineTo(sx, sy);
        }
      }
    }
    ctx.stroke();
    ctx.restore();

    // 4. Draw prompt if player is near
    if (dist < 75) {
      ctx.font = "bold 10px 'Orbitron', sans-serif";
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-55, -this.size - 25, 110, 18, 4);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText("VÀO HANG [E]", 0, -this.size - 13);
    }
    
    ctx.restore();
  }
}

class CaveExit {
  constructor(x, y, returnX, returnY) {
    this.x = x;
    this.y = y;
    this.size = 35;
    this.color = '#00ff7f'; // neon green exit
    this.returnX = returnX;
    this.returnY = returnY;
  }

  draw(ctx) {
    ctx.save();
    const dist = Math.hypot(gameCtx.player.x - this.x, gameCtx.player.y - this.y);
    ctx.translate(this.x, this.y);
    
    // 1. Draw light pool on ground (ellipse base)
    const baseGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, this.size * 1.5);
    baseGrad.addColorStop(0, 'rgba(255, 255, 220, 0.6)');
    baseGrad.addColorStop(0.4, 'rgba(255, 230, 150, 0.3)');
    baseGrad.addColorStop(1, 'rgba(255, 230, 150, 0)');
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 1.5, this.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 2. Draw vertical shaft of sunlight (gradient cone pointing upwards)
    const shaftHeight = 400;
    const coneGrad = ctx.createLinearGradient(0, 0, 0, -shaftHeight);
    coneGrad.addColorStop(0, 'rgba(255, 255, 220, 0.45)');
    coneGrad.addColorStop(0.6, 'rgba(255, 230, 150, 0.2)');
    coneGrad.addColorStop(1, 'rgba(255, 230, 150, 0.05)');
    ctx.fillStyle = coneGrad;
    
    ctx.beginPath();
    ctx.moveTo(-this.size * 1.5, 0);
    ctx.lineTo(-this.size * 0.5, -shaftHeight);
    ctx.lineTo(this.size * 0.5, -shaftHeight);
    ctx.lineTo(this.size * 1.5, 0);
    ctx.closePath();
    ctx.fill();
    
    // 3. Draw neon dust particles rising up within the shaft
    if (!this.particles) {
      this.particles = [];
      for (let i = 0; i < 20; i++) {
        this.particles.push({
          x: (Math.random() - 0.5) * this.size * 2,
          y: -Math.random() * shaftHeight,
          speed: Math.random() * 0.8 + 0.4,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.6 + 0.4
        });
      }
    }
    
    ctx.fillStyle = 'rgba(255, 255, 200, 0.7)';
    this.particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < -shaftHeight) {
        p.y = 0;
        p.x = (Math.random() - 0.5) * this.size * 2;
      }
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffe600';
      ctx.globalAlpha = p.alpha * (1 - Math.abs(p.y) / shaftHeight);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    
    // 4. Draw prompt if player is near
    if (dist < 75) {
      ctx.font = "bold 10px 'Orbitron', sans-serif";
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-55, -this.size - 25, 110, 18, 4);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText("RA NGOÀI [E]", 0, -this.size - 13);
    }
    
    ctx.restore();
  }
}

class Obstacle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = true;
    this.isCrafted = !['ore_stone', 'ore_iron', 'rock_pillar', 'ore_gold', 'ore_diamond'].includes(type);
    
    // Default properties based on type
    if (type === 'barricade') {
      this.maxHp = 150;
      this.hp = this.maxHp;
      this.size = 18;
      this.color = '#00ff7f';
      this.solid = true;
    } else if (type === 'stonewall') {
      this.maxHp = 400;
      this.hp = this.maxHp;
      this.size = 22;
      this.color = '#87cefa';
      this.solid = true;
    } else if (type === 'ironwall') {
      this.maxHp = 1000;
      this.hp = this.maxHp;
      this.size = 24;
      this.color = '#da70d6';
      this.solid = true;
    } else if (type === 'campfire') {
      this.maxHp = 200;
      this.hp = this.maxHp;
      this.size = 16;
      this.color = '#ff4500';
      this.solid = true;
      this.healTimer = 0;
      this.burnTimer = 0;
    } else if (type === 'spiketrap') {
      this.maxHp = 120;
      this.hp = this.maxHp;
      this.size = 20;
      this.color = '#ffe600';
      this.solid = false;
    } else if (type === 'turret') {
      this.maxHp = 250;
      this.hp = this.maxHp;
      this.size = 16;
      this.color = '#00f3ff';
      this.solid = true;
      this.shootTimer = 0;
      this.shootCooldown = 40; // 0.67 seconds
    } else if (type === 'ore_stone') {
      this.maxHp = 100;
      this.hp = this.maxHp;
      this.size = 18;
      this.color = '#87cefa';
      this.solid = true;
    } else if (type === 'ore_iron') {
      this.maxHp = 150;
      this.hp = this.maxHp;
      this.size = 18;
      this.color = '#da70d6';
      this.solid = true;
    } else if (type === 'rock_pillar') {
      this.maxHp = 9999999;
      this.hp = this.maxHp;
      this.size = 20;
      this.color = '#5a5a5d'; // dark gray
      this.solid = true;
    } else if (type === 'ore_gold') {
      this.maxHp = 200;
      this.hp = this.maxHp;
      this.size = 18;
      this.color = '#ffd700'; // Vàng neon
      this.solid = true;
    } else if (type === 'ore_diamond') {
      this.maxHp = 300;
      this.hp = this.maxHp;
      this.size = 18;
      this.color = '#00ffff'; // Lam neon
      this.solid = true;
    } else if (type === 'crafting_table_2') {
      this.maxHp = 500;
      this.hp = this.maxHp;
      this.size = 20;
      this.color = '#ffa500'; // Cam vàng neon
      this.solid = true;
    } else if (type === 'flame_turret') {
      this.maxHp = 350;
      this.hp = this.maxHp;
      this.size = 16;
      this.color = '#ff4500'; // Đỏ cam
      this.solid = true;
      this.shootTimer = 0;
      this.shootCooldown = 25; // nhanh hơn turret thường
    } else if (type === 'tesla_turret') {
      this.maxHp = 350;
      this.hp = this.maxHp;
      this.size = 16;
      this.color = '#cc00ff'; // Tím điện
      this.solid = true;
      this.shootTimer = 0;
      this.shootCooldown = 50; // giật lan, cd lâu hơn chút
    } else if (type === 'electric_fence') {
      this.maxHp = 800;
      this.hp = this.maxHp;
      this.size = 20;
      this.color = '#00ffff'; // Điện lam
      this.solid = true;
    } else if (type === 'elemental_bomb') {
      this.maxHp = 1;
      this.hp = this.maxHp;
      this.size = 15;
      this.color = '#ff00ff'; // Hồng neon
      this.solid = false;
    }

    if (window.scene3D) {
      this.init3D();
    }
  }

  takeDamage(amount, isMonster = false) {
    if (!this.active) return;
    if (this.type === 'rock_pillar') return; // indestructible
    
    // Check if mining
    const isOre = this.type === 'ore_stone' || this.type === 'ore_iron' || this.type === 'ore_gold' || this.type === 'ore_diamond';
    if (isOre && isMonster) return; // Ores cannot take damage from monsters/enemy bullets!
    
    if (window.gameCheats && window.gameCheats.oneHitKill && !isOre) {
      amount = this.hp;
    }
    
    this.hp -= amount;
    
    if (isOre) {
      // Drop resources on taking damage (e.g. 25% chance per hit)
      if (Math.random() < 0.25) {
        let dropType = 'stone';
        if (this.type === 'ore_iron') dropType = 'iron';
        else if (this.type === 'ore_gold') dropType = 'gold_ore';
        else if (this.type === 'ore_diamond') dropType = 'diamond_ore';

        const amount = this.rich ? 2 : 1;
        gameCtx.resourcePickups.push(new ResourcePickup(
          this.x + (Math.random() * 20 - 10),
          this.y + (Math.random() * 20 - 10),
          dropType,
          amount
        ));
      }
    }

    // Damage indicator
    if (window.FloatingText && gameCtx.floatingTexts && window.gameSettings && window.gameSettings.damageNumbers) {
      gameCtx.floatingTexts.push(new FloatingText(this.x, this.y - this.size - 5, Math.round(amount).toString(), '#ffaa66'));
    }

    if (this.hp <= 0) {
      this.active = false;
      this.destroy3D();
      
      if (isOre) {
        // Drop lots of resources on destruction
        let dropType = 'stone';
        if (this.type === 'ore_iron') dropType = 'iron';
        else if (this.type === 'ore_gold') dropType = 'gold_ore';
        else if (this.type === 'ore_diamond') dropType = 'diamond_ore';

        const mult = this.rich ? 2 : 1;
        const count = (Math.floor(Math.random() * 3) + 3) * mult; // 3-5 drops * multiplier
        for (let i = 0; i < count; i++) {
          gameCtx.resourcePickups.push(new ResourcePickup(
            this.x + (Math.random() * 30 - 15),
            this.y + (Math.random() * 30 - 15),
            dropType,
            Math.floor(Math.random() * 2) + 1
          ));
        }
      }
      
      // Explosion particles
      for (let i = 0; i < 15; i++) {
        particleManager.addParticle(this.x, this.y, this.color, Math.random() * 3 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
      }
      if (soundManager.playExplosion) {
        soundManager.playExplosion();
      }
    }
  }

  update() {
    if (!this.active) return;

    // Special behaviors
    if (this.type === 'campfire') {
      // Heal player
      const dx = gameCtx.player.x - this.x;
      const dy = gameCtx.player.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < this.size + gameCtx.player.size + 40) {
        this.healTimer++;
        if (this.healTimer >= 30) {
          this.healTimer = 0;
          gameCtx.player.hp = Math.min(gameCtx.player.maxHp, gameCtx.player.hp + 2);
          particleManager.addParticle(gameCtx.player.x, gameCtx.player.y, '#00ff7f', 1.8, 1, -Math.PI / 2, 0.06);
        }
      }

      // Burn enemies
      this.burnTimer++;
      if (this.burnTimer >= 15) {
        this.burnTimer = 0;
        for (const e of gameCtx.enemies) {
          if (e.dead) continue;
          const edx = e.x - this.x;
          const edy = e.y - this.y;
          const edist = Math.hypot(edx, edy);
          if (edist < this.size + e.size + 50) {
            e.hp -= 4;
            if (e.hp <= 0) e.dead = true;
            if (e.effects) e.effects.burn = Math.max(e.effects.burn || 0, 120);
            particleManager.addParticle(e.x, e.y, '#ff4500', 2, 1.2, Math.random() * Math.PI * 2, 0.08);
          }
        }
      }
    } else if (this.type === 'spiketrap') {
      // Slow and damage enemies passing over
      for (const e of gameCtx.enemies) {
        if (e.dead) continue;
        const dx = e.x - this.x;
        const dy = e.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.size + e.size) {
          if (e.effects) {
            e.effects.trap = Math.max(e.effects.trap || 0, 30); // apply trap slow
          }
          e.hp -= 0.3; // continuous damage
          if (e.hp <= 0) e.dead = true;
          
          this.takeDamage(0.25); // wear & tear
          if (!this.active) break;
        }
      }
    } else if (this.type === 'turret') {
      this.shootTimer++;
      if (this.shootTimer >= this.shootCooldown) {
        // Target nearest enemy
        let nearestEnemy = null;
        let minDist = 300; // range limit
        
        for (const e of gameCtx.enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.x, e.y - this.y);
          if (dist < minDist) {
            minDist = dist;
            nearestEnemy = e;
          }
        }

        if (nearestEnemy) {
          this.shootTimer = 0;
          const angle = Math.atan2(nearestEnemy.y - this.y, nearestEnemy.x - this.x);
          
          // Spawn turret bullet
          gameCtx.turretBullets.push(new TurretBullet(
            this.x,
            this.y,
            angle,
            8.0, // bullet speed
            12, // bullet damage
            '#00f3ff' // bullet color
          ));

          // Firing particle effect
          for (let i = 0; i < 3; i++) {
            particleManager.addParticle(
              this.x + Math.cos(angle) * this.size,
              this.y + Math.sin(angle) * this.size,
              '#00f3ff',
              2.0,
              2.5,
              angle + (Math.random() * 0.4 - 0.2),
              0.08
            );
          }
          if (soundManager.playSpell) {
            soundManager.playSpell('water_water'); // play similar sound
          }
        }
      }
    } else if (this.type === 'flame_turret') {
      this.shootTimer++;
      if (this.shootTimer >= this.shootCooldown) {
        let nearestEnemy = null;
        let minDist = 220; // Tầm ngắn hơn turret thường
        for (const e of gameCtx.enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.x, e.y - this.y);
          if (dist < minDist) {
            minDist = dist;
            nearestEnemy = e;
          }
        }
        if (nearestEnemy) {
          this.shootTimer = 0;
          const angle = Math.atan2(nearestEnemy.y - this.y, nearestEnemy.x - this.x);
          // Gây sát thương hình nón phun lửa diện rộng
          for (const e of gameCtx.enemies) {
            if (e.dead) continue;
            const edist = Math.hypot(e.x - this.x, e.y - this.y);
            if (edist < 220) {
              const eangle = Math.atan2(e.y - this.y, e.x - this.x);
              let diff = Math.abs(eangle - angle);
              if (diff > Math.PI) diff = Math.PI * 2 - diff;
              if (diff < 0.45) { // Góc phun lửa ~50 độ
                e.takeDamage(15);
                e.applyEffect('burn', 120); // Thiêu đốt 2 giây
              }
            }
          }
          // Hiệu ứng lửa phun
          for (let i = 0; i < 8; i++) {
            const fa = angle + (Math.random() * 0.4 - 0.2);
            const fspd = 3 + Math.random() * 4;
            particleManager.addParticle(
              this.x + Math.cos(angle) * this.size,
              this.y + Math.sin(angle) * this.size,
              '#ff4500',
              2.5,
              3.0,
              fa,
              0.05
            );
          }
          if (soundManager.playSpell) {
            soundManager.playSpell('fire_fire');
          }
        }
      }
    } else if (this.type === 'tesla_turret') {
      this.shootTimer++;
      if (this.shootTimer >= this.shootCooldown) {
        let nearestEnemy = null;
        let minDist = 280;
        for (const e of gameCtx.enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.x, e.y - this.y);
          if (dist < minDist) {
            minDist = dist;
            nearestEnemy = e;
          }
        }
        if (nearestEnemy) {
          this.shootTimer = 0;
          // Chain lightning logic
          const targets = [nearestEnemy];
          let current = nearestEnemy;
          for (let chain = 0; chain < 3; chain++) { // chain to 3 more (total 4)
            let nextTarget = null;
            let nextMinDist = 120;
            for (const e of gameCtx.enemies) {
              if (e.dead || targets.includes(e)) continue;
              const dist = Math.hypot(e.x - current.x, e.y - current.y);
              if (dist < nextMinDist) {
                nextMinDist = dist;
                nextTarget = e;
              }
            }
            if (nextTarget) {
              targets.push(nextTarget);
              current = nextTarget;
            } else {
              break;
            }
          }
          // Deal damage, apply shock, and draw lightning particles
          targets.forEach((e, idx) => {
            e.takeDamage(22);
            e.applyEffect('shock', 40); // shock effect
            
            // Draw electric beam from previous target to current
            const prev = idx === 0 ? this : targets[idx - 1];
            for (let i = 0; i < 6; i++) {
              const px = prev.x + (e.x - prev.x) * (i / 6) + (Math.random() * 12 - 6);
              const py = prev.y + (e.y - prev.y) * (i / 6) + (Math.random() * 12 - 6);
              particleManager.addParticle(px, py, '#00ffff', 1.5, 1.5, Math.random() * Math.PI * 2, 0.1);
            }
          });
          if (soundManager.playSpell) {
            soundManager.playSpell('lightning_lightning');
          }
        }
      }
    } else if (this.type === 'elemental_bomb') {
      // Check if any enemy is very close
      let trigger = false;
      for (const e of gameCtx.enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < this.size + e.size + 10) {
          trigger = true;
          break;
        }
      }
      if (trigger) {
        // Explode!
        for (const e of gameCtx.enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.x, e.y - this.y);
          if (dist < 150) {
            e.takeDamage(150);
            e.applyEffect('freeze_solid', 90); // Đóng băng cứng quái vật 1.5 giây
            e.applyEffect('burn', 180); // Thiêu đốt 3 giây
            e.applyEffect('shock', 60); // Giật điện tê liệt 1 giây
          }
        }
        // Explosive visual effects
        particleManager.createShockwave(this.x, this.y, '#ff00ff', 150);
        for (let i = 0; i < 40; i++) {
          const color = Math.random() < 0.33 ? '#00ffff' : Math.random() < 0.5 ? '#ff4500' : '#ff00ff';
          particleManager.addParticle(
            this.x,
            this.y,
            color,
            Math.random() * 4 + 2,
            Math.random() * 3 + 2,
            Math.random() * Math.PI * 2,
            0.04
          );
        }
        if (soundManager.playExplosion) {
          soundManager.playExplosion();
        }
        this.active = false;
        this.destroy3D();
      }
    }

    if (window.scene3D) {
      this.update3D();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.2;
    
    if (this.type === 'barricade') {
      // Wood cross fence
      ctx.beginPath();
      ctx.moveTo(this.x - this.size, this.y - this.size);
      ctx.lineTo(this.x + this.size, this.y + this.size);
      ctx.moveTo(this.x - this.size, this.y + this.size);
      ctx.lineTo(this.x + this.size, this.y - this.size);
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(0, 255, 127, 0.2)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === 'stonewall') {
      // Octagonal brick wall
      ctx.fillStyle = 'rgba(135, 206, 250, 0.15)';
      ctx.beginPath();
      ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(this.x - this.size, this.y);
      ctx.lineTo(this.x + this.size, this.y);
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x, this.y + this.size);
      ctx.strokeStyle = 'rgba(135, 206, 250, 0.5)';
      ctx.stroke();
    } else if (this.type === 'ironwall') {
      // Double border iron block
      ctx.fillStyle = 'rgba(218, 112, 214, 0.2)';
      ctx.beginPath();
      ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(this.x - this.size + 4, this.y - this.size + 4, this.size * 2 - 8, this.size * 2 - 8);
      ctx.strokeStyle = 'rgba(218, 112, 214, 0.5)';
      ctx.stroke();
    } else if (this.type === 'campfire') {
      // Campfire base & flame
      ctx.strokeStyle = '#8b4513';
      ctx.beginPath();
      ctx.moveTo(this.x - this.size, this.y + this.size * 0.5);
      ctx.lineTo(this.x + this.size, this.y + this.size * 0.5);
      ctx.moveTo(this.x - this.size * 0.5, this.y - this.size * 0.5);
      ctx.lineTo(this.x + this.size * 0.5, this.y + this.size * 0.5);
      ctx.stroke();
      
      const pulse = 1 + Math.sin(Date.now() * 0.015) * 0.18;
      ctx.fillStyle = '#ff4500';
      ctx.beginPath();
      ctx.arc(this.x, this.y - 2, this.size * 0.65 * pulse, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(this.x, this.y - 2, this.size * 0.35 * pulse, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'spiketrap') {
      // Grid of spikes
      ctx.fillStyle = 'rgba(255, 230, 0, 0.05)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffe600';
      const spikeCount = 5;
      for (let i = 0; i < spikeCount; i++) {
        const angle = (i / spikeCount) * Math.PI * 2;
        const sx = this.x + Math.cos(angle) * (this.size * 0.65);
        const sy = this.y + Math.sin(angle) * (this.size * 0.65);
        ctx.beginPath();
        ctx.moveTo(sx, sy - 5);
        ctx.lineTo(sx + 3, sy + 3);
        ctx.lineTo(sx - 3, sy + 3);
        ctx.closePath();
        ctx.fill();
      }
    } else if (this.type === 'turret') {
      // Turret base & gun barrel
      ctx.fillStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Rotate gun barrel to nearest enemy
      let targetAngle = 0;
      let nearestEnemy = null;
      let minDist = 300;
      for (const e of gameCtx.enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          nearestEnemy = e;
        }
      }
      if (nearestEnemy) {
        targetAngle = Math.atan2(nearestEnemy.y - this.y, nearestEnemy.x - this.x);
      } else {
        targetAngle = Date.now() * 0.001; // idle rotation
      }

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(targetAngle);
      
      // Gun barrel
      ctx.fillStyle = '#00f3ff';
      ctx.fillRect(0, -3, this.size * 1.5, 6);
      ctx.strokeRect(0, -3, this.size * 1.5, 6);
      
      // Central core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    } else if (this.type === 'ore_stone' || this.type === 'ore_iron' || this.type === 'ore_gold' || this.type === 'ore_diamond') {
      // Faceted crystal rock
      let fillCol = 'rgba(135,206,250,0.2)'; // stone
      if (this.type === 'ore_iron') fillCol = 'rgba(218,112,214,0.2)';
      else if (this.type === 'ore_gold') fillCol = 'rgba(255,215,0,0.2)';
      else if (this.type === 'ore_diamond') fillCol = 'rgba(0,255,255,0.2)';

      ctx.fillStyle = fillCol;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x + this.size * 0.8, this.y - this.size * 0.4);
      ctx.lineTo(this.x + this.size, this.y + this.size * 0.4);
      ctx.lineTo(this.x + this.size * 0.4, this.y + this.size);
      ctx.lineTo(this.x - this.size * 0.4, this.y + this.size);
      ctx.lineTo(this.x - this.size, this.y + this.size * 0.4);
      ctx.lineTo(this.x - this.size * 0.8, this.y - this.size * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x, this.y + this.size * 0.4);
      ctx.lineTo(this.x - this.size, this.y + this.size * 0.4);
      ctx.moveTo(this.x, this.y + this.size * 0.4);
      ctx.lineTo(this.x + this.size, this.y + this.size * 0.4);
      ctx.stroke();
    } else if (this.type === 'crafting_table_2') {
      // Modern hexagonal table with golden core
      ctx.fillStyle = 'rgba(255, 140, 0, 0.15)';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const rx = this.x + Math.cos(angle) * this.size;
        const ry = this.y + Math.sin(angle) * this.size;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden core logo/rune
      ctx.strokeStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'flame_turret') {
      ctx.fillStyle = 'rgba(255, 69, 0, 0.15)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      let targetAngle = 0;
      let nearestEnemy = null;
      let minDist = 220;
      for (const e of gameCtx.enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          nearestEnemy = e;
        }
      }
      if (nearestEnemy) {
        targetAngle = Math.atan2(nearestEnemy.y - this.y, nearestEnemy.x - this.x);
      } else {
        targetAngle = Date.now() * 0.001;
      }
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(targetAngle);
      
      // Double barrels for flame
      ctx.fillStyle = '#ff4500';
      ctx.fillRect(0, -5, this.size * 1.4, 3);
      ctx.fillRect(0, 2, this.size * 1.4, 3);
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (this.type === 'tesla_turret') {
      // Triangular base
      ctx.fillStyle = 'rgba(204, 0, 255, 0.15)';
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
        const rx = this.x + Math.cos(angle) * this.size;
        const ry = this.y + Math.sin(angle) * this.size;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Tesla coil on top (multiple rings and a center ball)
      const time = Date.now() * 0.02;
      const pulse = 1.0 + Math.sin(time) * 0.12;
      ctx.strokeStyle = '#cc00ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.45 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00ffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.22, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'electric_fence') {
      // Electrified square fence
      ctx.fillStyle = 'rgba(0, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
      ctx.fill();
      ctx.stroke();
      
      // Inner electric arcs/cracks
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x - this.size + 4, this.y - this.size + (Math.random() * 8 - 4) + this.size);
      ctx.lineTo(this.x - this.size + 8, this.y - 3);
      ctx.lineTo(this.x + 2, this.y + 4);
      ctx.lineTo(this.x + this.size - 4, this.y - this.size + (Math.random() * 8 - 4) + this.size);
      ctx.stroke();
    } else if (this.type === 'elemental_bomb') {
      const pulse = 1.0 + Math.sin(Date.now() * 0.02) * 0.25;
      ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'rock_pillar') {
      // Draw stalagmite rock pillar (pointed shard polygon)
      ctx.fillStyle = 'rgba(90, 90, 93, 0.35)';
      ctx.strokeStyle = '#5a5a5d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(this.x - this.size, this.y + this.size * 0.7);
      ctx.lineTo(this.x - this.size * 0.4, this.y - this.size);
      ctx.lineTo(this.x + this.size * 0.4, this.y - this.size * 1.2);
      ctx.lineTo(this.x + this.size, this.y + this.size * 0.7);
      ctx.lineTo(this.x + this.size * 0.5, this.y + this.size * 0.9);
      ctx.lineTo(this.x - this.size * 0.5, this.y + this.size * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(this.x - this.size * 0.4, this.y - this.size);
      ctx.lineTo(this.x, this.y + this.size * 0.9);
      ctx.lineTo(this.x + this.size * 0.4, this.y - this.size * 1.2);
      ctx.stroke();
    }

    // Health bar
    if (this.hp < this.maxHp && !['ore_stone', 'ore_iron', 'ore_gold', 'ore_diamond'].includes(this.type)) {
      const barW = this.size * 2;
      const barH = 3;
      const bx = this.x - barW / 2;
      const by = this.y - this.size - 8;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(bx, by, barW, barH);
      
      ctx.fillStyle = this.color;
      ctx.fillRect(bx, by, barW * (this.hp / this.maxHp), barH);
    }
    
    ctx.restore();
  }

  init3D() {
    this.mesh = new THREE.Group();
    let mat = new THREE.MeshBasicMaterial({ color: this.color });
    let geom;
    if (this.type === 'barricade') geom = new THREE.BoxGeometry(this.size * 1.5, 4, this.size * 1.5);
    else if (this.type === 'stonewall') geom = new THREE.BoxGeometry(this.size * 1.8, this.size * 1.5, this.size * 1.8);
    else if (this.type === 'ironwall') geom = new THREE.BoxGeometry(this.size * 2.0, this.size * 1.8, this.size * 2.0);
    else if (this.type === 'campfire') geom = new THREE.ConeGeometry(this.size * 0.8, this.size * 1.2, 8);
    else if (this.type === 'spiketrap') geom = new THREE.PlaneGeometry(this.size * 1.8, this.size * 1.8);
    else if (this.type === 'turret' || this.type === 'flame_turret') geom = new THREE.CylinderGeometry(this.size * 0.8, this.size * 0.8, this.size * 1.2, 8);
    else if (this.type === 'tesla_turret') geom = new THREE.ConeGeometry(this.size * 0.8, this.size * 1.5, 4);
    else if (this.type === 'electric_fence') geom = new THREE.BoxGeometry(this.size * 1.8, this.size * 1.2, this.size * 1.8);
    else if (this.type === 'elemental_bomb') geom = new THREE.SphereGeometry(this.size * 0.7, 8, 8);
    else if (this.type === 'crafting_table_2') geom = new THREE.CylinderGeometry(this.size * 0.9, this.size * 0.9, this.size * 0.8, 6);
    else if (this.type === 'ore_stone' || this.type === 'ore_iron' || this.type === 'rock_pillar' || this.type === 'ore_gold' || this.type === 'ore_diamond') geom = new THREE.DodecahedronGeometry(this.size * 0.9);
    
    const mainMesh = new THREE.Mesh(geom, mat);
    if (this.type === 'spiketrap') {
      mainMesh.rotation.x = -Math.PI / 2;
      mainMesh.position.y = 1;
    } else {
      mainMesh.position.y = this.size / 2;
    }
    this.mesh.add(mainMesh);
    this.mesh.position.set(this.x, 0, this.y);
    window.scene3D.add(this.mesh);
  }

  update3D() {
    if (this.mesh && this.type === 'campfire') {
      const pulse = 1.0 + Math.sin(Date.now() * 0.015) * 0.1;
      this.mesh.scale.set(pulse, pulse, pulse);
    }
  }

  destroy3D() {
    if (this.mesh && window.scene3D) {
      window.scene3D.remove(this.mesh);
    }
  }
}

window.ResourcePickup = ResourcePickup;
window.TurretBullet = TurretBullet;
window.CaveEntrance = CaveEntrance;
window.CaveExit = CaveExit;
window.Obstacle = Obstacle;

class Enemy {
  constructor(x, y, type = 'swarmer', multiplier = 1, currentMap = 'forest') {
    this.id = Math.random().toString(36).substring(2, 9);
    this.x = x;
    this.y = y;
    this.type = type;
    this.dead = false;

    this.effects = {
      burn: 0,
      freeze: 0,
      freeze_solid: 0,
      shock: 0,
      trap: 0,
      dizzy: 0,
      curse: 0
    };

    switch (type) {
      case 'charger':
        this.maxHp = Math.round(35 * multiplier);
        this.hp = this.maxHp;
        this.speed = Math.min(3.2, 1.3 * (1.0 + (multiplier - 1) * 0.08));
        this.damage = Math.round(18 * (1.0 + (multiplier - 1) * 0.25));
        this.size = 14;
        this.color = '#ff0055';
        this.score = 50;
        this.xpValue = 5;
        this.chargeTimer = 0;
        this.isCharging = false;
        this.chargeAngle = 0;
        break;
      
      case 'shooter':
        this.maxHp = Math.round(25 * multiplier);
        this.hp = this.maxHp;
        this.speed = Math.min(3.5, 1.6 * (1.0 + (multiplier - 1) * 0.08));
        this.damage = Math.round(12 * (1.0 + (multiplier - 1) * 0.25));
        this.size = 12;
        this.color = '#ffe600';
        this.score = 75;
        this.xpValue = 6;
        this.shootCooldown = Math.max(45, 160 - multiplier * 12);
        this.shootTimer = Math.random() * 60;
        break;

      case 'boss':
        this.maxHp = Math.round(600 * multiplier);
        this.hp = this.maxHp;
        this.speed = Math.min(2.0, 0.7 * (1.0 + (multiplier - 1) * 0.05));
        this.damage = Math.round(30 * (1.0 + (multiplier - 1) * 0.35));
        this.size = 30;
        this.color = '#9d00ff';
        this.score = 1000;
        this.xpValue = 100;
        this.shootTimer = 0;
        this.attackPhase = 0;
        this.phaseTimer = 0;
        break;

      case 'cave_beetle':
        this.maxHp = Math.round(50 * multiplier);
        this.hp = this.maxHp;
        this.speed = 1.0;
        this.damage = Math.round(15 * (1.0 + (multiplier - 1) * 0.25));
        this.size = 12;
        this.color = '#87cefa'; // Neon lam
        this.score = 60;
        this.xpValue = 6;
        break;

      case 'cave_spider':
        this.maxHp = Math.round(30 * multiplier);
        this.hp = this.maxHp;
        this.speed = 2.4;
        this.damage = Math.round(10 * (1.0 + (multiplier - 1) * 0.25));
        this.size = 10;
        this.color = '#da70d6'; // Neon tím
        this.score = 60;
        this.xpValue = 6;
        break;

      case 'cave_bat':
        this.maxHp = Math.round(35 * multiplier);
        this.hp = this.maxHp;
        this.speed = 2.0;
        this.damage = Math.round(12 * (1.0 + (multiplier - 1) * 0.25));
        this.size = 9;
        this.color = '#ffe600'; // Neon vàng
        this.score = 80;
        this.xpValue = 8;
        this.shootCooldown = 120;
        this.shootTimer = Math.random() * 60;
        break;

      case 'swarmer':
      default:
        let hpMult = 1.0;
        let color = '#00ffaa';
        if (currentMap === 'castle') {
          hpMult = 1.5;
          color = '#00bfff'; // Xanh băng
        }
        this.maxHp = Math.round(12 * multiplier * hpMult);
        this.hp = this.maxHp;
        const baseSpeed = 2.0 + Math.random() * 0.4;
        this.speed = Math.min(4.8, baseSpeed * (1.0 + (multiplier - 1) * 0.08));
        this.damage = Math.round(8 * (1.0 + (multiplier - 1) * 0.25));
        this.size = 8;
        this.color = color;
        this.score = 10;
        this.xpValue = 1;
        break;
    }
    if (window.scene3D) {
      this.init3D();
    }
  }

  applyEffect(effectName, duration) {
    this.effects[effectName] = Math.max(this.effects[effectName], duration);
  }

  getActualSpeed() {
    if (this.effects.freeze_solid > 0 || this.effects.shock > 0 || this.effects.dizzy > 0) {
      return 0; // Đóng băng, điện giật, choáng đều đứng im
    }
    let speedMult = 1.0;
    if (this.effects.trap > 0) {
      speedMult *= 0.15;
    } else if (this.effects.freeze > 0) {
      speedMult *= 0.5;
    }
    return this.speed * speedMult;
  }

  update(player, enemyBullets, enemies) {
    if (this.dead) return;
    this.updateEffects();

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const actualSpeed = this.getActualSpeed();

    if (actualSpeed > 0) {
      switch (this.type) {
        case 'charger':
          this.updateCharger(dx, dy, dist, actualSpeed);
          break;

        case 'shooter':
          this.updateShooter(dx, dy, dist, enemyBullets, actualSpeed);
          break;

        case 'boss':
          this.updateBoss(dx, dy, dist, enemyBullets, actualSpeed);
          break;

        case 'cave_bat':
          if (dist > 0) {
            this.x += (dx / dist) * actualSpeed;
            this.y += (dy / dist) * actualSpeed;
          }
          this.shootTimer++;
          if (this.shootTimer >= this.shootCooldown) {
            this.shootTimer = 0;
            const angle = Math.atan2(dy, dx);
            if (enemyBullets) {
              enemyBullets.push(new EnemyBullet(this.x, this.y, angle, 4.0, this.damage, this.color));
            }
          }
          break;

        case 'cave_beetle':
        case 'cave_spider':
        case 'swarmer':
        default:
          if (dist > 0) {
            this.x += (dx / dist) * actualSpeed;
            this.y += (dy / dist) * actualSpeed;
          }
          break;
      }
    }

    for (const other of enemies) {
      if (other === this || other.type === 'boss') continue;
      const odx = other.x - this.x;
      const ody = other.y - this.y;
      const odist = Math.sqrt(odx * odx + ody * ody);
      const minDist = this.size + other.size;
      if (odist < minDist && odist > 0) {
        const pushForce = 0.4;
        this.x -= (odx / odist) * pushForce;
        this.y -= (ody / odist) * pushForce;
      }
    }
    this.update3D(gameCtx.gameTime);
  }

  updateEffects() {
    if (this.effects.burn > 0) {
      this.effects.burn--;
      if (this.effects.burn % 6 === 0) {
        this.hp -= 6;
        particleManager.addParticle(this.x, this.y, '#ff4500', 1.5, 0.8, Math.random() * Math.PI * 2, 0.08);
        if (this.hp <= 0) {
          this.die();
        }
      }
    }

    if (this.effects.freeze > 0) this.effects.freeze--;
    if (this.effects.freeze_solid > 0) this.effects.freeze_solid--;
    if (this.effects.shock > 0) this.effects.shock--;
    if (this.effects.trap > 0) this.effects.trap--;
    if (this.effects.dizzy > 0) this.effects.dizzy--;
    if (this.effects.curse > 0) this.effects.curse--;
  }

  updateCharger(dx, dy, dist, actualSpeed) {
    this.chargeTimer++;
    if (this.chargeTimer < 120) {
      this.isCharging = false;
      if (dist > 0) {
        this.x += (dx / dist) * actualSpeed;
        this.y += (dy / dist) * actualSpeed;
      }
    } else if (this.chargeTimer < 175) {
      this.chargeAngle = Math.atan2(dy, dx);
      if (dist > 0) {
        this.x += (dx / dist) * (actualSpeed * 0.15);
        this.y += (dy / dist) * (actualSpeed * 0.15);
      }
    } else if (this.chargeTimer < 205) {
      this.isCharging = true;
      const chargeSpeed = 7.5 * (actualSpeed / this.speed);
      this.x += Math.cos(this.chargeAngle) * chargeSpeed;
      this.y += Math.sin(this.chargeAngle) * chargeSpeed;

      if (Math.random() < 0.35) {
        particleManager.addParticle(this.x, this.y, this.color, 2, 0.5, this.chargeAngle + Math.PI, 0.05);
      }
    } else {
      this.chargeTimer = 0;
      this.isCharging = false;
    }
  }

  updateShooter(dx, dy, dist, enemyBullets, actualSpeed) {
    this.shootTimer++;
    const idealDist = 260;
    if (dist > idealDist + 20) {
      this.x += (dx / dist) * actualSpeed;
      this.y += (dy / dist) * actualSpeed;
    } else if (dist < idealDist - 20) {
      this.x -= (dx / dist) * (actualSpeed * 0.8);
      this.y -= (dy / dist) * (actualSpeed * 0.8);
    } else {
      const strafeAngle = Math.atan2(dy, dx) + Math.PI / 2;
      this.x += Math.cos(strafeAngle) * (actualSpeed * 0.5);
      this.y += Math.sin(strafeAngle) * (actualSpeed * 0.5);
    }

    if (this.shootTimer >= this.shootCooldown) {
      this.shootTimer = 0;
      const angle = Math.atan2(dy, dx);
      enemyBullets.push(new EnemyBullet(this.x, this.y, angle, 4.2, this.damage, this.color));
    }
  }

  updateBoss(dx, dy, dist, enemyBullets, actualSpeed) {
    this.phaseTimer++;
    this.shootTimer++;

    if (dist > 0) {
      this.x += (dx / dist) * actualSpeed;
      this.y += (dy / dist) * actualSpeed;
    }

    if (this.phaseTimer >= 400) {
      this.phaseTimer = 0;
      this.attackPhase = (this.attackPhase + 1) % 3;
    }

    if (this.attackPhase === 0) {
      if (this.shootTimer >= 110) {
        this.shootTimer = 0;
        const count = 16;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          enemyBullets.push(new EnemyBullet(this.x, this.y, angle, 3.2, this.damage, this.color, 5));
        }
      }
    } else if (this.attackPhase === 1) {
      if (this.shootTimer >= 22) {
        this.shootTimer = 0;
        const angle = Math.atan2(dy, dx) + (Math.random() * 0.25 - 0.125);
        enemyBullets.push(new EnemyBullet(this.x, this.y, angle, 5.5, this.damage, '#00ffff', 4));
      }
    } else {
      if (this.shootTimer >= 8) {
        this.shootTimer = 0;
        const spiralAngle = (this.phaseTimer * 0.08);
        enemyBullets.push(new EnemyBullet(this.x, this.y, spiralAngle, 3.8, this.damage, '#ff0055', 4));
        enemyBullets.push(new EnemyBullet(this.x, this.y, spiralAngle + Math.PI, 3.8, this.damage, '#ff0055', 4));
      }
    }
  }

  takeDamage(amount) {
    if (this.dead) return;
    
    let finalAmount = amount;
    // Kiểm tra khuếch đại sát thương từ Hắc Ám Kết Giới (umbra_x)
    for (const spell of gameCtx.playerSpells || []) {
      if (spell.active && spell.type === 'umbra_x') {
        const dist = Math.hypot(this.x - spell.x, this.y - spell.y);
        if (dist < spell.size) {
          finalAmount *= 1.30;
          break;
        }
      }
    }

    this.hp -= finalAmount;
    
    // Lifesteal của Umbra khi hóa Hắc thần
    const player = gameCtx.player;
    if (player && player.characterKey === 'umbra' && player.umbraTransformActive) {
      player.hp = Math.min(player.maxHp, player.hp + finalAmount * 0.30);
      if (Math.random() < 0.20) {
        particleManager.addParticle(player.x, player.y, '#32cd32', 2, 1.2, -Math.PI / 2, 0.05);
      }
    }

    particleManager.addParticle(
      this.x, 
      this.y, 
      '#ffffff', 
      2, 
      Math.random() * 2 + 1, 
      Math.random() * Math.PI * 2, 
      0.08
    );

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.dead = true;
    this.destroy3D();
    soundManager.playExplosion();
    const explosionCount = this.type === 'boss' ? 70 : this.type === 'charger' ? 20 : 12;
    particleManager.createExplosion(this.x, this.y, this.color, explosionCount);
    particleManager.triggerShake(this.type === 'boss' ? 20 : this.type === 'charger' ? 8 : 2);

    // Cơ chế cuồng sát của Lycan khi hóa sói: Giết quái tăng thêm thời gian hóa hình
    const player = gameCtx.player;
    if (player && player.characterKey === 'wolf' && player.lycanTransformActive) {
      const addedFrames = this.type === 'boss' ? 120 : (this.type === 'charger' || this.type === 'shooter') ? 12 : 4;
      const maxDur = 480 + (player.spellLevels[3] - 1) * 120;
      player.lycanTransformTimer = Math.min(maxDur, player.lycanTransformTimer + addedFrames);
      
      if (Math.random() < 0.35) {
        particleManager.addParticle(this.x, this.y, '#ff003c', 2.0, 3.5, Math.atan2(player.y - this.y, player.x - this.x), 0.05);
      }
    }

    // Xử lý nổ nguyền rủa của Umbra
    if (this.effects.curse > 0) {
      const player = gameCtx.player;
      const lvl = (player && player.spellLevels[0]) || 1; // umbra_z là slot index 0
      const dmg = 90 * (1.0 + (lvl - 1) * 0.25) * (player ? player.damageModifier : 1.0);
      const explosionRadius = 90;

      soundManager.playHit();
      particleManager.createShockwave(this.x, this.y, '#9d00ff', explosionRadius);
      particleManager.createExplosion(this.x, this.y, '#4b0082', 12, 3.5);

      for (const enemy of gameCtx.enemies) {
        if (enemy === this || enemy.dead) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < explosionRadius + enemy.size) {
          enemy.takeDamage(dmg);
          // Lây lan lời nguyền: 40% khả năng lây lan lời nguyền sang các quái bị nổ trúng
          if (Math.random() < 0.40) {
            enemy.applyEffect('curse', 150);
          }
        }
      }
    }
  }

  draw(ctx, player) {
    if (this.dead) return;
    ctx.save();
    
    let drawColor = this.color;
    if (this.effects.freeze_solid > 0) {
      drawColor = '#87cefa';
    } else if (this.effects.shock > 0) {
      drawColor = '#ffffff';
    } else if (this.effects.burn > 0 && Math.random() < 0.4) {
      drawColor = '#ff4500';
    }

    ctx.shadowBlur = this.size * 2.5;
    ctx.shadowColor = drawColor;
    ctx.fillStyle = drawColor;
    ctx.strokeStyle = drawColor;

    switch (this.type) {
      case 'charger':
        if (assetManager.isLoaded('enemy_charger')) {
          ctx.translate(this.x, this.y);
          if (this.chargeTimer >= 120 && this.chargeTimer < 175) {
            const pulse = 1 + Math.sin(Date.now() * 0.06) * 0.15;
            ctx.scale(pulse, pulse);
          }
          const heading = Math.atan2(player.y - this.y, player.x - this.x);
          ctx.rotate(heading);
          const drawSize = this.size * 2.6;
          ctx.drawImage(assetManager.get('enemy_charger'), -drawSize/2, -drawSize/2, drawSize, drawSize);
        } else {
          ctx.translate(this.x, this.y);
          if (this.chargeTimer >= 120 && this.chargeTimer < 175) {
            const pulse = 1 + Math.sin(Date.now() * 0.06) * 0.15;
            ctx.scale(pulse, pulse);
            ctx.fillStyle = '#ffffff';
          }
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const px = Math.cos(angle) * this.size;
            const py = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
        break;

      case 'shooter':
        if (assetManager.isLoaded('enemy_shooter')) {
          ctx.translate(this.x, this.y);
          ctx.rotate(Date.now() * 0.001);
          const drawSize = this.size * 2.6;
          ctx.drawImage(assetManager.get('enemy_shooter'), -drawSize/2, -drawSize/2, drawSize, drawSize);
        } else {
          ctx.translate(this.x, this.y);
          ctx.rotate(Date.now() * 0.001);
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r = i % 2 === 0 ? this.size : this.size * 0.5;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
        break;

      case 'boss':
        if (assetManager.isLoaded('enemy_boss')) {
          ctx.translate(this.x, this.y);
          ctx.rotate(Date.now() * 0.0004);
          const drawSize = this.size * 2.6;
          ctx.drawImage(assetManager.get('enemy_boss'), -drawSize/2, -drawSize/2, drawSize, drawSize);
          ctx.restore();
          ctx.save();
          const hbW = 60;
          const hbH = 4;
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(this.x - hbW/2, this.y - this.size - 12, hbW, hbH);
          ctx.fillStyle = '#ff0055';
          ctx.fillRect(this.x - hbW/2, this.y - this.size - 12, hbW * (this.hp / this.maxHp), hbH);
        } else {
          ctx.translate(this.x, this.y);
          ctx.rotate(Date.now() * 0.0004);
          
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const px = Math.cos(angle) * this.size;
            const py = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          const pulseCore = this.size * 0.6 + Math.sin(Date.now() * 0.006) * 2;
          ctx.fillStyle = drawColor;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
            const px = Math.cos(angle) * pulseCore;
            const py = Math.sin(angle) * pulseCore;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();

          ctx.restore();
          ctx.save();
          const hbW = 60;
          const hbH = 4;
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(this.x - hbW/2, this.y - this.size - 12, hbW, hbH);
          ctx.fillStyle = '#ff0055';
          ctx.fillRect(this.x - hbW/2, this.y - this.size - 12, hbW * (this.hp / this.maxHp), hbH);
        }
        break;

      case 'cave_beetle':
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(player.y - this.y, player.x - this.x));
        // Beetle shell (oval)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.3, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        // Beetle pincers
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(this.size * 1.1, -this.size * 0.4);
        ctx.quadraticCurveTo(this.size * 1.7, -this.size * 0.7, this.size * 1.5, -this.size * 0.1);
        ctx.moveTo(this.size * 1.1, this.size * 0.4);
        ctx.quadraticCurveTo(this.size * 1.7, this.size * 0.7, this.size * 1.5, this.size * 0.1);
        ctx.stroke();
        break;

      case 'cave_spider':
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(player.y - this.y, player.x - this.x));
        // Spider body
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        // Spider head (white glow eye area)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.size * 0.7, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Spider legs
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 1.8;
        for (let i = 0; i < 4; i++) {
          const a1 = -Math.PI / 3 - i * 0.2;
          const a2 = Math.PI / 3 + i * 0.2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a1) * this.size * 1.8, Math.sin(a1) * this.size * 1.8);
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a2) * this.size * 1.8, Math.sin(a2) * this.size * 1.8);
          ctx.stroke();
        }
        break;

      case 'cave_bat':
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(player.y - this.y, player.x - this.x));
        // Bat body
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        // Flapping wings
        const flapVal = Math.sin(Date.now() * 0.02) * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.size * 0.4, -this.size * 1.7 * flapVal);
        ctx.lineTo(this.size * 0.3, -this.size * 0.5);
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.size * 0.4, this.size * 1.7 * flapVal);
        ctx.lineTo(this.size * 0.3, this.size * 0.5);
        ctx.closePath();
        ctx.fill();
        break;

      case 'swarmer':
      default:
        if (assetManager.isLoaded('enemy_swarmer')) {
          ctx.translate(this.x, this.y);
          const heading = Math.atan2(player.y - this.y, player.x - this.x);
          ctx.rotate(heading);
          const drawSize = this.size * 2.8;
          ctx.drawImage(assetManager.get('enemy_swarmer'), -drawSize/2, -drawSize/2, drawSize, drawSize);
        } else {
          ctx.translate(this.x, this.y);
          const heading = Math.atan2(player.y - this.y, player.x - this.x);
          ctx.rotate(heading);
          ctx.beginPath();
          ctx.moveTo(this.size * 1.5, 0);
          ctx.lineTo(-this.size, -this.size * 0.7);
          ctx.lineTo(-this.size, this.size * 0.7);
          ctx.closePath();
          ctx.fill();
        }
        break;
    }

    // Hiệu ứng trạng thái đông cứng / điện giật chồng lên ảnh
    if (this.effects.freeze_solid > 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(135, 206, 250, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (this.effects.shock > 0 && Math.random() < 0.5) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    // Vẽ thanh máu phía trên đầu quái thường khi bị mất máu
    if (this.type !== 'boss' && this.hp < this.maxHp && this.hp > 0 && !this.dead) {
      ctx.save();
      const hbW = this.size * 2;
      const hbH = 3;
      const hbx = this.x - this.size;
      const hby = this.y - this.size - 8;
      
      // Nền đen
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(hbx, hby, hbW, hbH);
      
      // Thanh HP hồng magenta neon
      ctx.fillStyle = '#ff0055';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ff0055';
      ctx.fillRect(hbx, hby, hbW * (this.hp / this.maxHp), hbH);
      ctx.restore();
    }
  }

  init3D() {
    if (this.meshGroup && window.scene3D) {
      window.scene3D.remove(this.meshGroup);
    }
    this.meshGroup = new THREE.Group();
    
    const baseColor = new THREE.Color(this.color);
    const material = new THREE.MeshStandardMaterial({ 
      color: baseColor, 
      roughness: 0.5, 
      metalness: 0.2 
    });

    this.partsGroup = new THREE.Group();
    this.meshGroup.add(this.partsGroup);

    if (this.type === 'swarmer') {
      const bodyGeo = new THREE.BoxGeometry(8, 8, 8);
      this.body = new THREE.Mesh(bodyGeo, material);
      this.body.position.y = 4;
      this.body.castShadow = true;
      this.body.receiveShadow = true;
      this.partsGroup.add(this.body);

      const spikeGeo = new THREE.ConeGeometry(1.5, 5, 4);
      const spikeMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
      for (let i = 0; i < 4; i++) {
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(
          (i % 2 === 0 ? 1 : -1) * 4,
          6,
          (i < 2 ? 1 : -1) * 4
        );
        spike.rotation.z = (i % 2 === 0 ? -1 : 1) * Math.PI / 4;
        this.body.add(spike);
      }
    } 
    else if (this.type === 'charger') {
      const bodyGeo = new THREE.BoxGeometry(14, 14, 22);
      this.body = new THREE.Mesh(bodyGeo, material);
      this.body.position.y = 8;
      this.body.castShadow = true;
      this.body.receiveShadow = true;
      this.partsGroup.add(this.body);

      const hornGeo = new THREE.ConeGeometry(2, 8, 4);
      const hornMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      const leftHorn = new THREE.Mesh(hornGeo, hornMat);
      leftHorn.position.set(-5, 4, 10);
      leftHorn.rotation.x = Math.PI / 3;
      leftHorn.rotation.y = -Math.PI / 12;
      this.body.add(leftHorn);

      const rightHorn = new THREE.Mesh(hornGeo, hornMat);
      rightHorn.position.set(5, 4, 10);
      rightHorn.rotation.x = Math.PI / 3;
      rightHorn.rotation.y = Math.PI / 12;
      this.body.add(rightHorn);

      const legGeo = new THREE.BoxGeometry(3, 7, 3);
      this.leftLeg1 = new THREE.Mesh(legGeo, material);
      this.leftLeg1.position.set(-6, -6, 6);
      this.body.add(this.leftLeg1);

      this.rightLeg1 = new THREE.Mesh(legGeo, material);
      this.rightLeg1.position.set(6, -6, 6);
      this.body.add(this.rightLeg1);

      this.leftLeg2 = new THREE.Mesh(legGeo, material);
      this.leftLeg2.position.set(-6, -6, -6);
      this.body.add(this.leftLeg2);

      this.rightLeg2 = new THREE.Mesh(legGeo, material);
      this.rightLeg2.position.set(6, -6, -6);
      this.body.add(this.rightLeg2);
    } 
    else if (this.type === 'shooter') {
      const bodyGeo = new THREE.OctahedronGeometry(10, 1);
      this.body = new THREE.Mesh(bodyGeo, material);
      this.body.position.y = 15;
      this.body.castShadow = true;
      this.body.receiveShadow = true;
      this.partsGroup.add(this.body);

      const torusGeo = new THREE.TorusGeometry(14, 1.2, 8, 24);
      const torusMat = new THREE.MeshBasicMaterial({ color: baseColor });
      this.ring = new THREE.Mesh(torusGeo, torusMat);
      this.ring.rotation.x = Math.PI / 2;
      this.body.add(this.ring);
    } 
    else if (this.type === 'boss') {
      const bodyGeo = new THREE.BoxGeometry(32, 32, 32);
      this.body = new THREE.Mesh(bodyGeo, material);
      this.body.position.y = 22;
      this.body.castShadow = true;
      this.body.receiveShadow = true;
      this.partsGroup.add(this.body);

      const eyeGeo = new THREE.BoxGeometry(6, 2, 2);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-10, 6, 16.1);
      this.body.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(10, 6, 16.1);
      this.body.add(rightEye);

      const crownGeo = new THREE.ConeGeometry(3, 10, 4);
      const crownMat = new THREE.MeshStandardMaterial({ color: 0xffe600, roughness: 0.2 });
      for (let i = 0; i < 5; i++) {
        const spike = new THREE.Mesh(crownGeo, crownMat);
        spike.position.set((i - 2) * 8, 18, 0);
        this.body.add(spike);
      }
    }

    this.meshGroup.position.set(this.x, 0, this.y);
    window.scene3D.add(this.meshGroup);
  }

  update3D(gameTime) {
    if (!this.meshGroup) {
      if (window.scene3D) this.init3D();
      return;
    }

    this.meshGroup.position.set(this.x, 0, this.y);

    let angle = 0;
    if (gameCtx.player) {
      angle = Math.atan2(gameCtx.player.y - this.y, gameCtx.player.x - this.x);
    }
    
    if (this.type === 'charger' && this.isCharging) {
      angle = this.chargeAngle;
    }
    this.partsGroup.rotation.y = -angle - Math.PI / 2;

    let stateColor = this.color;
    if (this.effects.freeze_solid > 0) {
      stateColor = '#87cefa';
    } else if (this.effects.shock > 0) {
      stateColor = '#ffffff';
    } else if (this.effects.burn > 0 && Math.random() < 0.4) {
      stateColor = '#ff4500';
    }
    
    const targetColor = new THREE.Color(stateColor);
    if (this.body && this.body.material) {
      this.body.material.color.copy(targetColor);
    }

    const speed = this.getActualSpeed();
    const isMoving = speed > 0.1;

    if (this.type === 'swarmer' && this.body) {
      if (isMoving) {
        this.body.rotation.z = Math.sin(gameTime * 0.45) * 0.2;
        this.body.position.y = 4 + Math.abs(Math.sin(gameTime * 0.25)) * 3;
      } else {
        this.body.rotation.z = 0;
        this.body.position.y = 4;
      }
    } 
    else if (this.type === 'charger' && this.body) {
      if (this.isCharging) {
        const walkCycle = gameTime * 0.5;
        this.leftLeg1.rotation.x = Math.sin(walkCycle) * 0.9;
        this.rightLeg1.rotation.x = -Math.sin(walkCycle) * 0.9;
        this.leftLeg2.rotation.x = -Math.sin(walkCycle) * 0.9;
        this.rightLeg2.rotation.x = Math.sin(walkCycle) * 0.9;
        this.body.position.y = 8 + Math.abs(Math.sin(walkCycle)) * 2;
      } else if (isMoving) {
        const walkCycle = gameTime * 0.18;
        this.leftLeg1.rotation.x = Math.sin(walkCycle) * 0.5;
        this.rightLeg1.rotation.x = -Math.sin(walkCycle) * 0.5;
        this.leftLeg2.rotation.x = -Math.sin(walkCycle) * 0.5;
        this.rightLeg2.rotation.x = Math.sin(walkCycle) * 0.5;
        this.body.position.y = 8 + Math.abs(Math.sin(walkCycle)) * 1;
      } else {
        this.leftLeg1.rotation.x = 0;
        this.rightLeg1.rotation.x = 0;
        this.leftLeg2.rotation.x = 0;
        this.rightLeg2.rotation.x = 0;
        this.body.position.y = 8;
      }
      
      if (this.chargeTimer >= 120 && this.chargeTimer < 175) {
        const pulse = 1.0 + Math.sin(gameTime * 0.6) * 0.15;
        this.body.scale.set(pulse, pulse, pulse);
      } else {
        this.body.scale.set(1, 1, 1);
      }
    } 
    else if (this.type === 'shooter' && this.body) {
      this.body.position.y = 15 + Math.sin(gameTime * 0.08) * 3;
      if (this.ring) {
        this.ring.rotation.z += 0.05;
      }
    } 
    else if (this.type === 'boss' && this.body) {
      this.body.position.y = 22 + Math.sin(gameTime * 0.04) * 2;
      this.body.rotation.y = gameTime * 0.005;
    }
  }

  destroy3D() {
    if (this.meshGroup && window.scene3D) {
      window.scene3D.remove(this.meshGroup);
    }
  }
}
