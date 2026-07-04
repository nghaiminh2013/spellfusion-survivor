function getSpellIndexAndCharKey(spellType) {
  if (spellType.startsWith('ignis_')) {
    const key = 'ignis';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('marina_')) {
    const key = 'marina';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('zephyr_')) {
    const key = 'zephyr';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('tesla_')) {
    const key = 'tesla';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('frost_')) {
    const key = 'frost';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('magma_')) {
    const key = 'magma';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('wolf_')) {
    const key = 'wolf';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('creation_')) {
    const key = 'creation';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('gaia_')) {
    const key = 'gaia';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('umbra_')) {
    const key = 'umbra';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  if (spellType.startsWith('venom_')) {
    const key = 'venom';
    if (spellType.includes('_z')) return { charKey: key, index: 0 };
    if (spellType.includes('_x')) return { charKey: key, index: 1 };
    if (spellType.includes('_c')) return { charKey: key, index: 2 };
    if (spellType.includes('_v')) return { charKey: key, index: 3 };
  }
  return null;
}

class Spell {
  constructor(x, y, targetX, targetY, type, player) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.player = player;
    this.active = true;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.vx = dist > 0 ? (dx / dist) : 1;
    this.vy = dist > 0 ? (dy / dist) : 0;
    this.angle = Math.atan2(dy, dx);

    this.life = 0;
    this.hitEnemies = new Set();
    this.path = []; // Lưu vết cho phép rễ cây mọc
    
    this.initSpell();
    if (window.scene3D) {
      this.init3D();
    }
  }

  initSpell() {
    this.isExplosive = false; // Mặc định không nổ

    switch (this.type) {
      // Đánh thường nguyên tố (Chuột Trái)
      case 'basic_fire':
        this.speed = 10;
        this.size = 5;
        this.damage = 10;
        this.maxLife = 40;
        this.color = '#ff4500';
        break;
      case 'basic_water':
        this.speed = 9;
        this.size = 5.5;
        this.damage = 9;
        this.maxLife = 45;
        this.color = '#00bfff';
        break;
      case 'basic_wind':
        this.speed = 11;
        this.size = 4.5;
        this.damage = 8;
        this.maxLife = 35;
        this.color = '#00ff7f';
        break;
      case 'basic_lightning':
        this.speed = 12;
        this.size = 4;
        this.damage = 11;
        this.maxLife = 30;
        this.color = '#ffff00';
        break;

      case 'gun_handgun':
        this.speed = 16;
        this.size = 2.5;
        this.damage = 18;
        this.maxLife = 35;
        this.color = '#00f3ff';
        break;
      case 'gun_rifle':
        this.speed = 20;
        this.size = 2.2;
        this.damage = 25;
        this.maxLife = 35;
        this.color = '#ff4500';
        break;
      case 'gun_shotgun':
        this.speed = 14;
        this.size = 3.2;
        this.damage = 15;
        this.maxLife = 22;
        this.color = '#ffe600';
        break;

      // Custom Ignis Spells
      case 'ignis_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          this.speed = 12;
          this.size = 5.5;
          this.damage = 50 * Math.pow(1.10, lvl - 1);
          this.maxLife = 40;
          this.color = '#ff4500';
        }
        break;
      case 'ignis_x':
        this.speed = 9;
        this.size = 8;
        this.damage = 60;
        this.maxLife = 65;
        this.color = '#ff3300';
        this.isExplosive = true;
        break;
      case 'ignis_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          const dmgMult = 1.0 + (lvl - 1) * 0.10;
          this.speed = 10.5;
          this.size = 14;
          this.damage = 60 * dmgMult;
          this.maxLife = 50;
          this.color = '#ff4500';
          this.isExplosive = true;
        }
        break;
      case 'ignis_c_small':
        this.speed = 8;
        this.size = 4.5;
        this.damage = 30;
        this.maxLife = 25;
        this.color = '#ff8c00';
        break;
      case 'ignis_v':
        this.speed = 0;
        this.size = 15;
        this.damage = 200;
        this.maxLife = 30;
        this.color = '#ffff00';
        break;

      // Custom Marina Spells
      case 'marina_z':
        this.speed = 8;
        this.size = 10;
        this.damage = 20;
        this.maxLife = 60;
        this.color = '#00bfff';
        this.isExplosive = true;
        break;
      case 'marina_x':
        this.speed = 6.0;
        this.size = 10;
        this.damage = 70;
        this.maxLife = 180;
        this.color = '#0055aa';
        break;
      case 'marina_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          const dmgMult = 1.0 + (lvl - 1) * 0.20;
          this.speed = 0;
          this.size = 75;
          this.damage = 30 * dmgMult;
          this.maxLife = 180;
          this.color = '#00bfff';
        }
        break;

      // Custom Zephyr Spells
      case 'zephyr_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          const dmgMult = 1.0 + (lvl - 1) * 0.10;
          const sizeMult = 1.0 + (lvl - 1) * 0.10;
          this.speed = 12;
          this.size = 12 * sizeMult;
          this.damage = 30 * dmgMult;
          this.maxLife = 50;
          this.color = '#00ff7f';
          this.isPierceAll = true;
        }
        break;
      case 'zephyr_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          const sizeMult = 1.0 + (lvl - 1) * 0.20;
          this.speed = 0;
          this.size = 35 * sizeMult;
          this.damage = 45;
          this.maxLife = 120;
          this.color = 'rgba(0, 255, 127, 0.2)';
        }
        break;
      case 'zephyr_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          const durMult = 1.0 + (lvl - 1) * 0.20;
          const dmgMult = 1.0 + (lvl - 1) * 0.10;
          this.speed = 1.5;
          this.size = 55;
          this.damage = 8 * dmgMult;
          this.maxLife = Math.round(240 * durMult);
          this.color = 'rgba(127, 255, 212, 0.35)';
        }
        break;
      case 'zephyr_v_small':
        this.speed = 8.5;
        this.size = 10;
        this.damage = 25;
        this.maxLife = 45;
        this.color = '#00ff7f';
        break;

      // Custom Tesla Spells
      case 'tesla_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          const dmgMult = 1.0 + (lvl - 1) * 0.10;
          this.damage = 35 * dmgMult;
          this.maxLife = 10;
          this.color = '#ffff00';
          this.chainTargets = [];
          this.hasChained = false;
        }
        break;
      case 'tesla_x':
        this.speed = 3.5;
        this.size = 18;
        this.damage = 15;
        this.maxLife = 120;
        this.color = '#ffff33';
        this.shootTick = 0;
        break;
      case 'tesla_x_shard':
        this.speed = 9;
        this.size = 4.5;
        this.damage = 20;
        this.maxLife = 25;
        this.color = '#ffffff';
        break;
      case 'tesla_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          const sizeMult = 1.0 + (lvl - 1) * 0.20;
          const dmgMult = 1.0 + (lvl - 1) * 0.10;
          this.speed = 0;
          this.size = 80 * sizeMult;
          this.damage = 50 * dmgMult;
          this.maxLife = 240;
          this.color = 'rgba(255, 255, 0, 0.1)';
          this.zapTick = 0;
        }
        break;
      case 'tesla_v_chain':
        this.damage = 20;
        this.maxLife = 10;
        this.color = '#ffff55';
        this.chainTargets = [];
        this.hasChained = false;
        break;

      // Phép thuần mới
      case 'fire_explosion':
        this.speed = 8;
        this.size = 24;
        this.damage = 95;
        this.maxLife = 110;
        this.color = '#ff4500';
        this.isExplosive = true;
        break;
      case 'water_ice':
        this.speed = 15;
        this.size = 8;
        this.damage = 45;
        this.maxLife = 60;
        this.color = '#00ffff';
        this.pierceCount = 6;
        break;
      case 'wind_blade':
        this.speed = 14;
        this.size = 20;
        this.damage = 35;
        this.maxLife = 85;
        this.color = '#00ff7f';
        this.isPierceAll = true;
        break;
      case 'lightning_orb':
        this.speed = 4;
        this.size = 22;
        this.damage = 28;
        this.maxLife = 130;
        this.color = '#ffff00';
        this.shootTick = 0;
        break;
      case 'fire_fire':
        this.speed = 15;
        this.size = 7;
        this.damage = 26;
        this.maxLife = 35;
        this.color = '#ff4500';
        break;

      case 'water_water':
        this.speed = 9;
        this.size = 10;
        this.damage = 38;
        this.maxLife = 80;
        this.color = '#00bfff';
        break;

      case 'lightning_lightning':
        this.damage = 42;
        this.maxLife = 10;
        this.color = '#ffff00';
        this.chainTargets = [];
        this.hasChained = false;
        break;

      case 'wind_wind':
        this.speed = 6.5;
        this.size = 22;
        this.damage = 22;
        this.maxLife = 130;
        this.color = '#00ff7f';
        const skewAngle = this.angle + (Math.random() * 0.4 - 0.2);
        this.vx = Math.cos(skewAngle);
        this.vy = Math.sin(skewAngle);
        break;

      case 'fire_water':
        this.speed = 7 + Math.random() * 4;
        this.size = 10;
        this.damage = 14;
        this.maxLife = 20;
        this.color = '#ff8c00';
        const spreadAngle = this.angle + (Math.random() * 0.6 - 0.3);
        this.vx = Math.cos(spreadAngle);
        this.vy = Math.sin(spreadAngle);
        break;

      case 'fire_lightning':
        this.speed = 5;
        this.size = 20;
        this.damage = 45;
        this.maxLife = 100;
        this.color = '#ffff00';
        this.isExplosive = true;
        break;

      case 'fire_wind':
        this.speed = 3;
        this.size = 25;
        this.damage = 8;
        this.maxLife = 150;
        this.color = '#ff4500';
        break;

      case 'water_lightning':
        this.speed = 6;
        this.size = 14;
        this.damage = 15;
        this.maxLife = 160;
        this.color = '#00ffff';
        break;

      case 'water_wind':
        this.size = 14;
        this.maxRadius = 240;
        this.damage = 55;
        this.maxLife = 30;
        this.color = '#87cefa';
        break;

      case 'lightning_wind':
        this.damage = 115;
        this.maxLife = 15;
        this.color = '#ffff00';
        break;

      case 'water':
        this.speed = 12;
        this.size = 9;
        this.damage = 25;
        this.maxLife = 65;
        this.color = '#00bfff';
        break;

      case 'wind':
        this.speed = 13;
        this.size = 9;
        this.damage = 22;
        this.maxLife = 70;
        this.color = '#00ff7f';
        break;

      case 'lightning':
        this.speed = 15;
        this.size = 7;
        this.damage = 26;
        this.maxLife = 50;
        this.color = '#ffff00';
        break;

      case 'wood':
        this.speed = 11;
        this.size = 7;
        this.damage = 13;
        this.maxLife = 50;
        this.color = '#2e8b57';
        break;

      case 'wood_wood':
        this.speed = 4.5;
        this.size = 12;
        this.damage = 32;
        this.maxLife = 80;
        this.color = '#2e8b57';
        break;

      case 'wind_wood':
        this.speed = 12;
        this.size = 8;
        this.damage = 15;
        this.maxLife = 45;
        this.color = '#7cfc00';
        break;

      case 'water_wood':
        this.speed = 10;
        this.size = 8;
        this.damage = 17;
        this.maxLife = 60;
        this.color = '#5f9ea0';
        break;

      case 'lightning_wood':
        this.speed = 11;
        this.size = 8;
        this.damage = 22;
        this.maxLife = 55;
        this.color = '#adff2f';
        break;

      case 'magma':
        this.speed = 8;
        this.size = 10;
        this.damage = 15;
        this.maxLife = 70;
        this.color = '#d35400';
        this.isExplosive = true;
        break;

      case 'magma_magma':
        this.speed = 4;
        this.size = 22;
        this.damage = 50;
        this.maxLife = 90;
        this.color = '#c0392b';
        this.isExplosive = true;
        break;

      case 'fire_magma':
        this.speed = 9;
        this.size = 11;
        this.damage = 22;
        this.maxLife = 55;
        this.color = '#e67e22';
        this.isExplosive = true;
        break;

      case 'water_magma':
        this.speed = 7;
        this.size = 12;
        this.damage = 14;
        this.maxLife = 40;
        this.color = '#a0522d';
        this.isExplosive = true;
        break;

      case 'lightning_magma':
        this.speed = 6;
        this.size = 14;
        this.damage = 24;
        this.maxLife = 75;
        this.color = '#ff8c00';
        this.isExplosive = true;
        break;

      case 'magma_wind':
        this.speed = 5;
        this.size = 24;
        this.damage = 8;
        this.maxLife = 100;
        this.color = '#708090';
        break;

      // Frost Spells
      case 'frost_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          this.speed = 13;
          this.size = 6;
          this.damage = 75 * (1.0 + (lvl - 1) * 0.15);
          this.maxLife = 45;
          this.color = '#87cefa';
          this.isPierceAll = true;
        }
        break;
      case 'frost_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          this.speed = 0;
          this.size = 10;
          this.maxRadius = 110 * (1.0 + (lvl - 1) * 0.20);
          this.damage = 120 * (1.0 + (lvl - 1) * 0.15);
          this.maxLife = 30;
          this.color = '#e0ffff';
        }
        break;
      case 'frost_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          this.speed = 0;
          this.size = 15;
          this.damage = 18 * (1.0 + (lvl - 1) * 0.10); // tick slow dmg
          this.maxLife = 180;
          this.color = '#afeeee';
          this.shatterDamage = 240 * (1.0 + (lvl - 1) * 0.20);
        }
        break;
      case 'frost_c_shard':
        this.speed = 10;
        this.size = 4;
        this.damage = 35;
        this.maxLife = 25;
        this.color = '#ffffff';
        break;
      case 'frost_v':
        {
          const lvl = this.player.spellLevels[3] || 1;
          this.speed = 0;
          this.size = 280;
          this.damage = 22 * (1.0 + (lvl - 1) * 0.10); // periodic tick dmg
          this.maxLife = 360 + (lvl - 1) * 60; // duration increases
          this.color = 'rgba(175, 238, 238, 0.15)';
        }
        break;

      // Magma Spells
      case 'magma_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          this.speed = 0; // Arm follows player
          this.size = 16; // Fist size
          this.damage = 30 * (1.0 + (lvl - 1) * 0.15); // 30 base dmg scaled by lvl
          this.maxLife = 120; // Lasts 2 seconds
          this.color = '#ff4500';
          this.isExplosive = false;
          this.extend = 40;
        }
        break;
      case 'magma_patch':
        this.speed = 0;
        this.size = 60;
        this.damage = 25;
        this.maxLife = 300;
        this.color = 'rgba(255, 69, 0, 0.6)';
        break;
      case 'magma_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          this.speed = 0;
          this.size = 65;
          this.damage = 45 * (1.0 + (lvl - 1) * 0.20); // Tăng mạnh sát thương giáp nham thạch
          this.maxLife = 360 + (lvl - 1) * 60;
          this.color = '#ff4500';
        }
        break;
      case 'magma_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          this.speed = 0;
          this.size = 110; // Bán kính cột phun trào khổng lồ
          this.damage = 180 * (1.0 + (lvl - 1) * 0.20); // Sát thương phun trào cực lớn
          this.maxLife = 35;
          this.color = '#ff3300';
          this.isExplosive = false;
        }
        break;
      case 'magma_v':
        {
          const lvl = this.player.spellLevels[3] || 1;
          this.speed = 8;
          this.size = 20;
          this.damage = 100 * (1.0 + (lvl - 1) * 0.20);
          this.maxLife = 60;
          this.color = '#ff4500';
          this.isExplosive = true;
        }
        break;

      // Lycan Spells
      case 'basic_wolf':
        this.speed = 9;
        this.size = 20;
        this.damage = 90; // Tăng damage từ 65 lên 90
        this.maxLife = 16;
        this.color = '#ff003c';
        this.isPierceAll = true;
        break;
      case 'claw_melee':
        this.speed = 10;
        this.size = 60; // Tăng size từ 42 lên 60 để cào rộng hơn
        this.damage = 180; // Tăng damage từ 135 lên 180
        this.maxLife = 12;
        this.color = '#ff3300';
        this.isPierceAll = true;
        break;
      case 'wolf_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          this.speed = 5;
          this.size = 10;
          this.damage = 85 * (1.0 + (lvl - 1) * 0.15); // Tăng damage từ 60 lên 85
          this.maxLife = 900;
          this.color = lvl >= 5 ? '#ff3300' : '#a9a9a9';
          this.attackCooldown = 0;
        }
        break;
      case 'wolf_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          this.speed = 0;
          this.size = 10;
          this.maxRadius = 300 * (1.0 + (lvl - 1) * 0.20); // Tăng maxRadius từ 160 lên 300 (siêu rộng)
          this.damage = 320 * (1.0 + (lvl - 1) * 0.15); // Tăng damage từ 200 lên 320
          this.maxLife = 20;
          this.color = 'rgba(255, 0, 60, 0.15)';
        }
        break;
      case 'wolf_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          this.speed = 15;
          this.size = 35;
          this.damage = 650 * (1.0 + (lvl - 1) * 0.25); // Tăng damage từ 450 lên 650
          this.maxLife = 40;
          this.color = '#ff003c';
        }
        break;
      case 'wolf_c_crack':
        this.speed = 10;
        this.size = 18;
        this.damage = this.player.damageModifier * 110;
        this.maxLife = 35;
        this.color = '#ff3300';
        this.isPierceAll = true;
        break;
      case 'wolf_v':
        {
          const lvl = this.player.spellLevels[3] || 1;
          this.speed = 0;
          this.size = 0;
          this.damage = 0;
          this.maxLife = 480 + (lvl - 1) * 120;
          this.color = '#ff003c';
        }
        break;

      // Genesis Spells
      case 'creation_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          this.speed = 0;
          this.size = 120 * (1.0 + (lvl - 1) * 0.20);
          this.damage = 40 * (1.0 + (lvl - 1) * 0.20);
          this.maxLife = 100;
          this.color = '#ffe600';
          this.explodeDmg = 180 * (1.0 + (lvl - 1) * 0.20);
        }
        break;
      case 'creation_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          this.speed = 5;
          this.size = 22;
          this.damage = 70 * (1.0 + (lvl - 1) * 0.15);
          this.maxLife = 180;
          this.color = '#ffe600';
          this.shootTick = 0;
        }
        break;
      case 'creation_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          this.speed = 0;
          this.size = 200;
          this.damage = 42 * (1.0 + (lvl - 1) * 0.15);
          this.maxLife = 300;
          this.color = 'rgba(255, 230, 0, 0.08)';
          this.zapTick = 0;
        }
        break;
      case 'creation_v':
        {
          const lvl = this.player.spellLevels[3] || 1;
          this.speed = 0;
          this.size = 280; // Tăng bán kính tinh vân lên 280px
          this.damage = 420 * (1.0 + (lvl - 1) * 0.25);
          this.maxLife = 360; // Tồn tại 6 giây
          this.color = 'rgba(255, 0, 243, 0.08)';
          this.absorbTick = 0;
        }
        break;
      case 'basic_ice':
        this.speed = 12;
        this.size = 5.0;
        this.damage = 20;
        this.maxLife = 40;
        this.color = '#8fa0dd';
        break;
      case 'basic_magma':
        this.speed = 10;
        this.size = 7.0;
        this.damage = 24;
        this.maxLife = 45;
        this.color = '#ff3300';
        this.isExplosive = true;
        break;
      case 'basic_creation':
        this.speed = 11;
        this.size = 5.0;
        this.damage = 26;
        this.maxLife = 45;
        this.color = '#ffe600';
        break;
      case 'pet_dragon_projectile':
        this.speed = 9;
        this.size = 4;
        this.damage = 15;
        this.maxLife = 40;
        this.color = '#ff4500';
        break;
      case 'pet_slime_projectile':
        this.speed = 8;
        this.size = 4.5;
        this.damage = 10;
        this.maxLife = 40;
        this.color = '#00bfff';
        break;

      // Gaia (Đại Địa Pháp Sư) Spells
      case 'basic_gaia':
        this.speed = 7.5;
        this.size = 11;
        this.damage = 45; // Tăng từ 32 lên 45
        this.maxLife = 55;
        this.color = '#8b5a2b';
        break;
      case 'gaia_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          this.speed = 10;
          this.size = 15;
          this.damage = 180 * (1.0 + (lvl - 1) * 0.20); // Tăng từ 130 lên 180
          this.maxLife = 40;
          this.color = '#8b5a2b';
          this.isPierceAll = true;
        }
        break;
      case 'gaia_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          this.speed = 0;
          this.size = 100 * (1.0 + (lvl - 1) * 0.10);
          this.damage = 20 * (1.0 + (lvl - 1) * 0.20); // Tăng từ 12 lên 20
          this.maxLife = 180 + (lvl - 1) * 30;
          this.color = '#228b22';
        }
        break;
      case 'gaia_v':
        {
          const lvl = this.player.spellLevels[3] || 1;
          this.speed = 0;
          this.size = 200 * (1.0 + (lvl - 1) * 0.10);
          this.damage = 35 * (1.0 + (lvl - 1) * 0.20); // Tăng từ 18 lên 35
          this.maxLife = 420 + (lvl - 1) * 60; // Tăng từ 300 lên 420 (7s)
          this.color = 'rgba(139, 90, 43, 0.15)';
        }
        break;

      // Chronos (Thời Không Pháp Sư) Spells
      case 'basic_chronos':
        this.speed = 10;
        this.size = 5.5;
        this.damage = 25;
        this.maxLife = 40;
        this.color = '#00f3ff';
        break;
      case 'chronos_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          this.speed = 8;
          this.size = 12;
          this.damage = 150 * (1.0 + (lvl - 1) * 0.20);
          this.maxLife = 90;
          this.explodeTimer = 72; // Nổ sau 1.2 giây (72 frames ở 60fps)
          this.color = '#ffe600';
        }
        break;
      case 'chronos_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          this.speed = 0;
          this.size = 110 * (1.0 + (lvl - 1) * 0.10);
          this.damage = 15 * (1.0 + (lvl - 1) * 0.20);
          this.maxLife = 260;
          this.color = 'rgba(0, 243, 255, 0.12)';
        }
        break;
      case 'chronos_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          this.speed = 0;
          this.size = 10;
          this.maxRadius = 180 * (1.0 + (lvl - 1) * 0.15);
          this.damage = 480 * (1.0 + (lvl - 1) * 0.25);
          this.maxLife = 90;
          this.color = '#ff3366';
        }
        break;

      // Umbra (Hắc Ám Pháp Sư) Spells
      case 'basic_umbra':
        this.speed = 8.5;
        this.size = 6.0;
        this.damage = 32; // Tăng từ 22 lên 32
        this.maxLife = 65;
        this.color = '#9d00ff';
        break;
      case 'umbra_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          this.speed = 10;
          this.size = 9;
          this.damage = 120 * (1.0 + (lvl - 1) * 0.20); // Tăng từ 85 lên 120
          this.maxLife = 50;
          this.color = '#4b0082';
          this.isPierceAll = true;
        }
        break;
      case 'umbra_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          this.speed = 0;
          this.size = 110 * (1.0 + (lvl - 1) * 0.10);
          this.damage = 22 * (1.0 + (lvl - 1) * 0.20); // Tăng từ 12 lên 22
          this.maxLife = 240;
          this.color = 'rgba(75, 0, 130, 0.12)';
        }
        break;
      case 'umbra_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          this.speed = 0;
          this.size = 150 * (1.0 + (lvl - 1) * 0.10);
          this.damage = 26 * (1.0 + (lvl - 1) * 0.20); // Tăng từ 16 lên 26
          this.maxLife = 300 + (lvl - 1) * 90;
          this.color = 'rgba(157, 0, 255, 0.1)';
        }
        break;
      case 'umbra_v_projectile':
        this.speed = 13.5;
        this.size = 6.5;
        this.damage = 75;
        this.maxLife = 45;
        this.color = '#ff0055';
        this.isPierceAll = true;
        break;

      case 'basic_venom':
        this.speed = 10;
        this.size = 5.5;
        this.damage = 22; // Tăng từ 11 lên 22
        this.maxLife = 40;
        this.color = '#32cd32';
        break;
      case 'venom_z':
        {
          const lvl = this.player.spellLevels[0] || 1;
          const dmgMult = 1.0 + (lvl - 1) * 0.15;
          this.speed = 11;
          this.size = 7;
          this.damage = 70 * dmgMult; // Tăng từ 45 lên 70
          this.maxLife = 45;
          this.color = '#00ff00';
          this.isExplosive = true;
        }
        break;
      case 'venom_x':
        {
          const lvl = this.player.spellLevels[1] || 1;
          this.speed = 8.5;
          this.size = 8;
          this.damage = 28; // Tăng từ 15 lên 28
          this.maxLife = 50;
          this.color = '#228b22';
          this.isExplosive = true;
        }
        break;
      case 'venom_c':
        {
          const lvl = this.player.spellLevels[2] || 1;
          const dmgMult = 1.0 + (lvl - 1) * 0.10;
          this.speed = 4.5;
          this.size = 12;
          this.damage = 80 * dmgMult; // Tăng từ 50 lên 80
          this.maxLife = 120;
          this.color = '#7fff00';
          this.path = [];
          this.isPierceAll = true;
        }
        break;
      case 'venom_v':
        {
          const lvl = this.player.spellLevels[3] || 1;
          const sizeMult = 1.0 + (lvl - 1) * 0.20;
          this.speed = 0;
          this.size = 100 * sizeMult;
          this.damage = 30; // Tăng từ 16 lên 30
          this.maxLife = 360;
          this.color = 'rgba(0, 250, 154, 0.08)';
          this.cloudTick = 0;
        }
        break;
      case 'venom_patch':
        this.speed = 0;
        this.size = this.size || 45;
        this.damage = this.damage || 8;
        this.maxLife = this.maxLife || 180;
        this.color = 'rgba(50, 205, 50, 0.12)';
        this.patchTick = 0;
        break;

      default:
        this.speed = 10;
        this.size = 5;
        this.damage = 10;
        this.maxLife = 60;
        this.color = '#ffffff';
    }

    // Áp dụng nâng cấp từ Pháp Sư
    this.damage *= this.player.damageModifier;
    if (this.player) {
      const mapping = getSpellIndexAndCharKey(this.type);
      if (mapping) {
        const spellUpgrades = currentSaveData.spellUpgrades || {};
        const charSpellUpgrades = spellUpgrades[mapping.charKey] || [0, 0, 0, 0];
        const permLvl = charSpellUpgrades[mapping.index] || 0;
        if (permLvl > 0 && this.damage) {
          this.damage *= (1 + permLvl * 0.15);
        }
      }
    }
    this.size *= (this.player.spellSizeModifier || 1.0);
    if (this.maxLife) {
      this.maxLife = Math.round(this.maxLife * (this.player.spellRangeModifier || 1.0));
    }
    if (this.maxRadius) {
      this.maxRadius *= (this.player.spellSizeModifier || 1.0);
    }

    // Áp dụng gia tăng chỉ số theo cấp độ phép thuật (Z, X, C, V)
    const spellIdx = this.player.spells.indexOf(this.type);
    if (spellIdx !== -1) {
      const isCustomSpell = this.type.startsWith('ignis_') || this.type.startsWith('marina_') || this.type.startsWith('zephyr_') || this.type.startsWith('tesla_') || this.type.startsWith('gaia_') || this.type.startsWith('umbra_') || this.type.startsWith('venom_') || this.type.startsWith('chronos_');
      if (!isCustomSpell) {
        const spellLvl = this.player.spellLevels[spellIdx] || 1;
        const lvlMultiplier = 1.0 + (spellLvl - 1) * 0.20; // +20% sát thương mỗi cấp trên 1
        const lvlSizeMultiplier = 1.0 + (spellLvl - 1) * 0.10; // +10% kích thước mỗi cấp trên 1
        this.damage *= lvlMultiplier;
        this.size *= lvlSizeMultiplier;
        if (this.maxRadius) {
          this.maxRadius *= lvlSizeMultiplier;
        }
      }
    }
  }

  performChainLightning(enemies) {
    if (this.hasChained) return;
    this.hasChained = true;

    let current = this.player;
    const maxChain = 5;
    let candidates = [...enemies];

    for (let i = 0; i < maxChain; i++) {
      if (candidates.length === 0) break;

      candidates.sort((a, b) => {
        const da = Math.hypot(a.x - current.x, a.y - current.y);
        const db = Math.hypot(b.x - current.x, b.y - current.y);
        return da - db;
      });

      const nearest = candidates[0];
      const dist = Math.hypot(nearest.x - current.x, nearest.y - current.y);

      if (i > 0 && dist > 250) break;

      this.chainTargets.push(nearest);
      
      // Sát thương sét lan nhận crit ma pháp
      let dmg = this.damage;
      if (Math.random() < (this.player.critChance || 0)) {
        dmg *= 2;
        particleManager.addParticle(nearest.x, nearest.y, '#ffffff', 4, 3, Math.random() * Math.PI * 2, 0.05);
      }
      
      nearest.takeDamage(dmg);
      nearest.applyEffect('shock', 60);

      particleManager.createLightningParticles(nearest.x, nearest.y, 6);

      current = nearest;
      candidates.shift();
    }

    if (this.chainTargets.length > 0) {
      soundManager.playSpell('lightning_lightning');
      particleManager.triggerShake(5);
    }
  }

  performTeslaChain(enemies, maxChain = 6, maxRange = 250, nextEffect = 'shock', nextDuration = 40) {
    if (this.hasChained) return;
    this.hasChained = true;

    let current = this.player;
    this.chainTargets = [];
    let candidates = [...enemies].filter(e => !e.dead);

    for (let i = 0; i < maxChain; i++) {
      if (candidates.length === 0) break;

      candidates.sort((a, b) => {
        const da = Math.hypot(a.x - current.x, a.y - current.y);
        const db = Math.hypot(b.x - current.x, b.y - current.y);
        return da - db;
      });

      const nearest = candidates[0];
      const dist = Math.hypot(nearest.x - current.x, nearest.y - current.y);

      if (i > 0 && dist > maxRange) break;

      this.chainTargets.push(nearest);
      
      let dmg = this.damage;
      if (Math.random() < (this.player.critChance || 0)) {
        dmg *= 2;
        particleManager.addParticle(nearest.x, nearest.y, '#ffffff', 4, 3, Math.random() * Math.PI * 2, 0.05);
      }
      
      nearest.takeDamage(dmg);
      nearest.applyEffect(nextEffect, nextDuration);

      particleManager.createLightningParticles(nearest.x, nearest.y, 5);

      current = nearest;
      candidates.shift();
    }

    if (this.chainTargets.length > 0) {
      soundManager.playSpell('lightning_lightning');
    }
  }

  update(enemies, width, height) {
    this.life++;
    if (this.life >= this.maxLife) {
      this.active = false;
      if (this.type === 'fire_lightning' && this.isExplosive) {
        this.explodeSpell(enemies);
      }
      if (this.type === 'fire_explosion' && this.isExplosive) {
        this.explodeFireExplosion(enemies);
      }
      if ((this.type === 'magma' || this.type === 'magma_magma' || this.type === 'fire_magma' || this.type === 'water_magma' || this.type === 'lightning_magma') && this.isExplosive) {
        this.explodeMagmaSpell(enemies);
      }
      if (this.type === 'ignis_x' && this.isExplosive) {
        this.explodeIgnisX(enemies);
      }
      if (this.type === 'ignis_c' && this.isExplosive) {
        this.explodeIgnisC(enemies);
      }
      if (this.type === 'marina_z' && this.isExplosive) {
        this.explodeMarinaZ(enemies);
      }
      if (this.type === 'zephyr_x') {
        this.explodeZephyrX(enemies);
      }
      if (this.type === 'tesla_x') {
        this.explodeTeslaX(enemies);
      }
      if (this.type === 'magma_z' && this.isExplosive) {
        this.explodeMagmaZ(enemies);
      }
      if (this.type === 'magma_v' && this.isExplosive) {
        this.explodeMagmaV(enemies);
      }
      if (this.type === 'venom_z' && this.isExplosive) {
        this.explodeVenomZ(enemies);
      }
      if (this.type === 'venom_x' && this.isExplosive) {
        this.explodeVenomX(enemies);
      }
      return;
    }

    if (this.type === 'venom_c') {
      this.waveTime = (this.waveTime || 0) + 0.15;
      const wave = Math.sin(this.waveTime) * 3.5;
      const perpX = -this.vy * wave;
      const perpY = this.vx * wave;
      
      this.x += this.vx * this.speed + perpX;
      this.y += this.vy * this.speed + perpY;
      
      if (gameCtx.gameTime % 4 === 0) {
        particleManager.addParticle(this.x, this.y, '#7fff00', 2, 0.5, this.angle + Math.PI, 0.05);
      }
      
      for (const enemy of enemies) {
        if (enemy.dead || this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          enemy.applyEffect('slow', 120);
          this.hitEnemies.add(enemy.id);
        }
      }
    }
    else if (this.type === 'venom_v') {
      this.x = this.player.x;
      this.y = this.player.y;
      
      this.cloudTick = (this.cloudTick || 0) + 1;
      if (this.cloudTick % 30 === 0) {
        soundManager.playHit();
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage * (1.0 + (this.player.spellLevels[3] - 1) * 0.20) * this.player.damageModifier;
            if (Math.random() < this.player.critChance) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('slow', 60);
          }
        }
      }
      if (Math.random() < 0.4) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * this.size;
        const px = this.x + Math.cos(angle) * dist;
        const py = this.y + Math.sin(angle) * dist;
        particleManager.addParticle(px, py, '#00fa9a', Math.random()*4+2, 0.3, Math.random()*Math.PI*2, 0.03);
      }
    }
    else if (this.type === 'venom_patch') {
      this.patchTick = (this.patchTick || 0) + 1;
      if (this.patchTick % 30 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage * this.player.damageModifier;
            if (Math.random() < this.player.critChance) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('slow', 60);
          }
        }
      }
      if (Math.random() < 0.15) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * this.size;
        const px = this.x + Math.cos(angle) * dist;
        const py = this.y + Math.sin(angle) * dist;
        particleManager.addParticle(px, py, '#32cd32', 2, 0.8, -Math.PI / 2, 0.04);
      }
    }
    else if (this.type === 'gaia_z') {
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;
      this.path.push({ x: this.x, y: this.y, life: 30 });

      for (const enemy of enemies) {
        if (enemy.dead || this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          const lvl = this.player.spellLevels[0] || 1;
          const stunDur = 108 + (lvl - 1) * 30;
          enemy.applyEffect('dizzy', stunDur);
          this.hitEnemies.add(enemy.id);
          particleManager.createExplosion(enemy.x, enemy.y, '#8b5a2b', 4, 1.8);
        }
      }
      if (this.life % 4 === 0) {
        particleManager.createExplosion(this.x, this.y, '#8b5a2b', 2, 1.2);
      }
    }
    else if (this.type === 'gaia_x') {
      if (this.life % 15 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            const lvl = this.player.spellLevels[1] || 1;
            const trapDur = 180 + (lvl - 1) * 30;
            enemy.applyEffect('trap', trapDur);
            if (Math.random() < 0.3) {
              particleManager.addParticle(enemy.x, enemy.y, '#228b22', 1.5, 0.8, Math.random() * Math.PI * 2, 0.05);
            }
          }
        }
      }
      if (Math.random() < 0.25) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * this.size;
        particleManager.addParticle(this.x + Math.cos(angle) * rad, this.y + Math.sin(angle) * rad, '#228b22', Math.random() * 2 + 1, 0.4, angle, 0.05);
      }
    }
    else if (this.type === 'gaia_v') {
      if (this.life % 10 === 0) {
        soundManager.playHit();
        particleManager.triggerShake(3.5);
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('slow', 60);
            particleManager.createExplosion(enemy.x, enemy.y, '#8b5a2b', 2, 1.0);
          }
        }
      }
      if (Math.random() < 0.45) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * this.size;
        particleManager.addParticle(this.x + Math.cos(angle) * rad, this.y + Math.sin(angle) * rad, '#5c3a21', Math.random() * 3 + 1.5, 0.5, angle, 0.04);
      }
    }
    else if (this.type === 'basic_chronos') {
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;
      if (this.life % 4 === 0) {
        particleManager.addParticle(this.x, this.y, '#ffe600', 1.8, 0.4, this.angle + Math.PI, 0.06);
      }
      for (const enemy of enemies) {
        if (enemy.dead || this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          enemy.applyEffect('freeze', 90);
          this.hitEnemies.add(enemy.id);
          this.active = false;
          particleManager.createExplosion(this.x, this.y, '#ffe600', 4, 1.0);
          break;
        }
      }
    }
    else if (this.type === 'chronos_z') {
      const ratio = Math.max(0, (this.maxLife - this.life) / this.maxLife);
      this.x += this.vx * this.speed * ratio;
      this.y += this.vy * this.speed * ratio;
      
      if (this.life % 3 === 0) {
        particleManager.addParticle(this.x, this.y, '#ffe600', 2, 0.6, Math.random()*Math.PI*2, 0.05);
      }

      if (this.life >= this.explodeTimer) {
        soundManager.playExplosion();
        particleManager.createShockwave(this.x, this.y, '#ffe600', 90);
        particleManager.createExplosion(this.x, this.y, '#ffffff', 14, 2.5);
        
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < 90 + enemy.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('slow', 180);
          }
        }
        this.active = false;
      }
    }
    else if (this.type === 'chronos_x') {
      if (this.life % 12 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('freeze_solid', 24);
          }
        }
      }
      if (Math.random() < 0.4) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * this.size;
        particleManager.addParticle(this.x + Math.cos(angle) * rad, this.y + Math.sin(angle) * rad, '#00f3ff', Math.random()*2.2+1, 0.3, angle + Math.PI/2, 0.04);
      }
    }
    else if (this.type === 'chronos_c') {
      if (this.life % 2 === 0 && this.life < 80) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 50;
        const px = this.x + Math.cos(angle) * dist;
        const py = this.y + Math.sin(angle) * dist;
        particleManager.addParticle(px, py, '#ff3366', 1.8, 2.5, angle + Math.PI, 0.05);
      }

      if (this.life >= 90) {
        soundManager.playExplosion();
        particleManager.createShockwave(this.x, this.y, this.maxRadius);
        particleManager.createExplosion(this.x, this.y, '#ffffff', 25, 4.0);
        particleManager.triggerShake(14);

        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.maxRadius + enemy.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('dizzy', 120);
          }
        }
        this.active = false;
      }
    }
    else if (this.type === 'basic_umbra') {
      let target = null;
      let minDist = 450;
      for (const e of enemies) {
        if (e.dead) continue;
        const d = Math.hypot(e.x - this.x, e.y - this.y);
        if (d < minDist) {
          minDist = d;
          target = e;
        }
      }
      if (target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          const targetVx = dx / dist;
          const targetVy = dy / dist;
          this.vx = this.vx * 0.84 + targetVx * 0.16;
          this.vy = this.vy * 0.84 + targetVy * 0.16;
          const len = Math.hypot(this.vx, this.vy);
          if (len > 0) {
            this.vx /= len;
            this.vy /= len;
          }
          this.angle = Math.atan2(this.vy, this.vx);
        }
      }
      this.waveTime = (this.waveTime || 0) + 0.25;
      const wave = Math.sin(this.waveTime) * 2.5;
      const perpX = -this.vy * wave;
      const perpY = this.vx * wave;
      this.x += this.vx * this.speed + perpX;
      this.y += this.vy * this.speed + perpY;
    }
    else if (this.type === 'umbra_z') {
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;
      if (this.life % 3 === 0) {
        particleManager.addParticle(this.x, this.y, '#9d00ff', 2, 0.5, this.angle + Math.PI, 0.05);
      }

      for (const enemy of enemies) {
        if (enemy.dead || this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          enemy.applyEffect('curse', 180);
          this.hitEnemies.add(enemy.id);
          particleManager.createExplosion(enemy.x, enemy.y, '#4b0082', 3, 1.2);
        }
      }
    }
    else if (this.type === 'umbra_x') {
      if (this.life % 20 === 0) {
        let totalHPHelped = 0;
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            const lvl = this.player.spellLevels[1] || 1;
            totalHPHelped += (0.8 + (lvl - 1) * 0.25);
            particleManager.addParticle(enemy.x, enemy.y, '#9d00ff', 1.5, 0.8, Math.random() * Math.PI * 2, 0.05);
          }
        }
        if (totalHPHelped > 0) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + totalHPHelped);
          particleManager.addParticle(this.player.x, this.player.y, '#32cd32', 3, 2, -Math.PI / 2, 0.04);
        }
      }
      if (Math.random() < 0.35) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * this.size;
        particleManager.addParticle(this.x + Math.cos(angle) * rad, this.y + Math.sin(angle) * rad, '#4b0082', Math.random() * 2 + 1, 0.4, angle, 0.04);
      }
    }
    else if (this.type === 'umbra_c') {
      if (this.life % 15 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('burn', 120);
            if (Math.random() < 0.2) {
              particleManager.addParticle(enemy.x, enemy.y, '#9d00ff', 1.5, 0.8, Math.random() * Math.PI * 2, 0.06);
            }
          }
        }
      }
      if (Math.random() < 0.6) {
        const rx = this.x + (Math.random() * this.size * 2 - this.size);
        const ry = this.y - (Math.random() * 40 + 60);
        particleManager.addParticle(rx, ry, '#ba55d3', 2, 4.5, Math.PI / 2 + 0.15, 0.08);
      }
    }
    else if (this.type === 'umbra_v_projectile') {
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;
      if (this.life % 2 === 0) {
        particleManager.addParticle(this.x, this.y, '#ff0055', 2.2, 0.6, this.angle + Math.PI, 0.06);
      }
      for (const enemy of enemies) {
        if (enemy.dead || this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          this.hitEnemies.add(enemy.id);
          particleManager.createExplosion(enemy.x, enemy.y, '#ff0055', 3, 1.2);
        }
      }
    }

    else if (this.type === 'ignis_v') {
      if (this.life === 1) {
        const lvl = this.player.spellLevels[3] || 1;
        const dmgMultiplier = 1.0 + (lvl - 1) * 0.10;
        let beamWidth = 22 * (1.0 + (lvl - 1) * 0.20) * (this.chargeRatio || 0.1); 
        beamWidth = Math.max(8, beamWidth);
        this.beamWidth = beamWidth;

        soundManager.playExplosion();
        particleManager.triggerShake(12);

        const dx = this.vx;
        const dy = this.vy;

        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const ex = enemy.x - this.x;
          const ey = enemy.y - this.y;
          const proj = ex * dx + ey * dy;

          if (proj >= 0) {
            const cx = this.x + proj * dx;
            const cy = this.y + proj * dy;
            const dist = Math.hypot(enemy.x - cx, enemy.y - cy);

            if (dist < enemy.size + beamWidth) {
              let dmg = 200 * dmgMultiplier;
              if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
              enemy.takeDamage(dmg);
              enemy.applyEffect('burn', 300);
              particleManager.createFireParticles(enemy.x, enemy.y, 4);
            }
          }
        }
      }
    }
    else if (this.type === 'frost_x') {
      this.size = (this.life / this.maxLife) * this.maxRadius;
      for (const enemy of enemies) {
        if (enemy.dead || this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          enemy.applyEffect('freeze_solid', 180);
          this.hitEnemies.add(enemy.id);
          particleManager.createWaterParticles(enemy.x, enemy.y, 4);
        }
      }
      if (this.life % 2 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const px = this.x + Math.cos(angle) * this.size;
        const py = this.y + Math.sin(angle) * this.size;
        particleManager.addParticle(px, py, '#e0ffff', Math.random()*2+1, 0.5, angle, 0.05);
      }
    }
    else if (this.type === 'frost_c') {
      if (this.life % 30 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < 120) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('slow', 90);
            particleManager.addParticle(enemy.x, enemy.y, '#afeeee', 2, 1, Math.random()*Math.PI*2, 0.05);
          }
        }
      }
      if (this.life >= this.maxLife - 1) {
        soundManager.playExplosion();
        particleManager.triggerShake(6);
        particleManager.createShockwave(this.x, this.y, '#afeeee', 150);
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < 150) {
            let dmg = this.shatterDamage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('freeze_solid', 60);
          }
        }
        const shardCount = 12;
        for (let i = 0; i < shardCount; i++) {
          const angle = (i / shardCount) * Math.PI * 2;
          const tx = this.x + Math.cos(angle) * 100;
          const ty = this.y + Math.sin(angle) * 100;
          gameCtx.playerSpells.push(new Spell(this.x, this.y, tx, ty, 'frost_c_shard', this.player));
        }
      }
    }
    else if (this.type === 'frost_v') {
      this.x = this.player.x;
      this.y = this.player.y;
      if (this.life % 20 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('slow', 100);
            if (Math.random() < 0.45) {
              enemy.applyEffect('freeze_solid', 60);
            }
            particleManager.addParticle(enemy.x, enemy.y, '#ffffff', 1.5, 0.5, Math.random()*Math.PI*2, 0.05);
          }
        }
      }
      if (Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * this.size;
        const px = this.x + Math.cos(angle) * dist;
        const py = this.y + Math.sin(angle) * dist;
        particleManager.addParticle(px, py, '#ffffff', Math.random()*2+1, 0.3, Math.PI/2, 0.02);
      }
    }
    else if (this.type === 'magma_z') {
      this.x = this.player.x;
      this.y = this.player.y;
      this.angle = this.player.angle; // Hướng đấm bám theo hướng xoay của chuột
      this.extend = 40 + Math.sin(this.life * 0.4) * 70; // Co giãn từ 40px đến 110px

      if (this.life % 10 === 0) {
        soundManager.playHit();
        const punchX = this.x + Math.cos(this.angle) * this.extend;
        const punchY = this.y + Math.sin(this.angle) * this.extend;
        
        particleManager.createFireParticles(punchX, punchY, 4);
        particleManager.triggerShake(2.0);

        const dmgRadius = 55;
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - punchX, enemy.y - punchY);
          if (dist < dmgRadius + enemy.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('burn', 120);

            // Đẩy lùi quái theo hướng đấm
            enemy.x += Math.cos(this.angle) * 20;
            enemy.y += Math.sin(this.angle) * 20;
          }
        }
      }
    }
    else if (this.type === 'magma_patch') {
      if (this.life % 15 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('burn', 120);
            particleManager.addParticle(enemy.x, enemy.y, '#ff4500', 1.5, 1, Math.random()*Math.PI*2, 0.05);
          }
        }
      }
    }
    else if (this.type === 'magma_x') {
      this.x = this.player.x;
      this.y = this.player.y;
      this.player.magmaShieldActive = true;
      this.player.magmaShieldTimer = 2;
      if (this.life % 10 === 0) { // Gây đam mỗi 10 frames
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('burn', 120);
            particleManager.createFireParticles(enemy.x, enemy.y, 2);
          }
        }
      }
      if (Math.random() < 0.25) {
        const angle = Math.random() * Math.PI * 2;
        const dist = this.player.size + Math.random() * 8;
        particleManager.addParticle(this.x + Math.cos(angle)*dist, this.y + Math.sin(angle)*dist, '#ff3300', Math.random()*2+1, 0.5, angle, 0.05);
      }
      if (this.life >= this.maxLife - 1) {
        this.player.magmaShieldActive = false;
      }
    }
    else if (this.type === 'magma_c') {
      if (this.life === 1) {
        soundManager.playExplosion();
        particleManager.triggerShake(15);
        particleManager.createShockwave(this.x, this.y, '#ff4500', this.size);
        particleManager.createFireParticles(this.x, this.y, 18);

        // Gây sát thương nổ diện rộng cực mạnh
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size + enemy.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('burn', 240); // Bỏng nặng trong 4 giây

            // Đẩy lùi mạnh quái ra xa
            const pushAngle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
            enemy.x += Math.cos(pushAngle) * 35;
            enemy.y += Math.sin(pushAngle) * 35;
          }
        }

        // Spawn bãi dung nham khổng lồ tại tâm vụ nổ
        const patch = new Spell(this.x, this.y, this.x, this.y, 'magma_patch', this.player);
        patch.size = 85; 
        patch.damage = 35; 
        gameCtx.playerSpells.push(patch);

        // Bắn ra 8 quả cầu nham thạch phụ bay tán loạn ra xung quanh
        const shardCount = 8;
        for (let i = 0; i < shardCount; i++) {
          const angle = (i / shardCount) * Math.PI * 2 + Math.random() * 0.4 - 0.2;
          const dist = 160;
          const tx = this.x + Math.cos(angle) * dist;
          const ty = this.y + Math.sin(angle) * dist;
          const f = new Spell(this.x, this.y, tx, ty, 'magma', this.player);
          f.damage = this.damage * 0.35;
          f.speed = 6.5 + Math.random() * 3.5;
          f.maxLife = 30;
          gameCtx.playerSpells.push(f);
        }
      }
    }
    else if (this.type === 'wolf_z') {
      if (this.attackCooldown === undefined) this.attackCooldown = 0;
      if (this.attackCooldown > 0) this.attackCooldown--;

      let target = null;
      let minDist = Infinity;
      for (const e of enemies) {
        if (e.dead) continue;
        const d = Math.hypot(e.x - this.x, e.y - this.y);
        if (d < minDist) {
          minDist = d;
          target = e;
        }
      }
      const speed = 6.5;
      if (target && minDist < 360) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        this.vx = dx / minDist;
        this.vy = dy / minDist;
        this.x += this.vx * speed;
        this.y += this.vy * speed;
        this.angle = Math.atan2(dy, dx);
        if (minDist < this.size + target.size + 8) {
          if (this.attackCooldown <= 0) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            target.takeDamage(dmg);
            this.player.gainRage(4.0); // Đệ sói cắn hồi nộ cho Lycan (tăng lên 4.0)
            
            const lvl = this.player.spellLevels[0] || 1;
            if (lvl >= 5) {
              if (Math.random() < 0.3) {
                target.applyEffect('burn', 120); // 30% gây cháy 2 giây ở cấp 5
              }
              particleManager.createFireParticles(target.x, target.y, 3);
            } else {
              particleManager.createExplosion(target.x, target.y, '#ff003c', 4, 2);
            }
            
            soundManager.playHit();
            this.attackCooldown = 8; // Hồi chiêu cắn 8 frame (~0.13s)
          }
        }
      } else {
        const followDist = 45;
        const angleOffset = (this.life * 0.02) + (this.vx > 0 ? Math.PI : 0);
        const tx = this.player.x + Math.cos(angleOffset) * followDist;
        const ty = this.player.y + Math.sin(angleOffset) * followDist;
        const dx = tx - this.x;
        const dy = ty - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          this.vx = dx / dist;
          this.vy = dy / dist;
          this.x += this.vx * speed;
          this.y += this.vy * speed;
          this.angle = Math.atan2(dy, dx);
        }
      }
    }
    else if (this.type === 'wolf_x') {
      this.size = (this.life / this.maxLife) * this.maxRadius;
      
      const lvl = this.player.spellLevels[1] || 1; // wolf_x là index 1
      if (lvl >= 5) {
        // Triệt tiêu đạn quái trong tầm dội của sóng âm dã thú
        for (let i = gameCtx.enemyBullets.length - 1; i >= 0; i--) {
          const bullet = gameCtx.enemyBullets[i];
          const dist = Math.hypot(bullet.x - this.x, bullet.y - this.y);
          if (dist < this.size) {
            gameCtx.enemyBullets.splice(i, 1);
            particleManager.addParticle(bullet.x, bullet.y, '#ff003c', 1.5, 0.6, Math.random() * Math.PI * 2, 0.08);
          }
        }
      }

      for (const enemy of enemies) {
        if (enemy.dead || this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          const pushAngle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
          enemy.x += Math.cos(pushAngle) * 150; // Đẩy quái cực xa (buffed!)
          enemy.y += Math.sin(pushAngle) * 150;
          enemy.applyEffect('dizzy', 210); // Gây choáng 3.5s
          this.hitEnemies.add(enemy.id);
          particleManager.createWindParticles(enemy.x, enemy.y, 4);
        }
      }
      if (Math.random() < 0.4) {
        const angle = Math.random() * Math.PI * 2;
        const px = this.x + Math.cos(angle) * this.size;
        const py = this.y + Math.sin(angle) * this.size;
        particleManager.addParticle(px, py, '#ff003c', Math.random()*3+1.5, 1, angle, 0.05);
      }
    }
    else if (this.type === 'wolf_c') {
      const ratio = this.life / this.maxLife;
      if (ratio < 0.95) {
        this.player.x = this.x + (this.destX - this.x) * ratio;
        this.player.y = this.y + (this.destY - this.y) * ratio;
        particleManager.addParticle(this.player.x, this.player.y, '#ff003c', Math.random()*3+2, 1, Math.random()*Math.PI*2, 0.05);
      }
      if (this.life === 1) {
        for (const enemy of enemies) {
          if (enemy.dead || enemy.type === 'boss') continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < 220) {
            enemy.x = this.x + Math.cos(this.angle) * 30;
            enemy.y = this.y + Math.sin(this.angle) * 30;
          }
        }
      }
      if (this.life >= this.maxLife - 1) {
        soundManager.playExplosion();
        particleManager.triggerShake(18);
        const slamRadius = 240; // Tăng từ 160 lên 240
        particleManager.createShockwave(this.destX, this.destY, '#ff003c', slamRadius);
        particleManager.createFireParticles(this.destX, this.destY, 15);
        this.player.x = this.destX;
        this.player.y = this.destY;
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.destX, enemy.y - this.destY);
          if (dist < slamRadius + enemy.size) {
            let dmg = this.damage;
            if (enemy.type === 'boss') {
              dmg = enemy.hp * 0.70; // Rút thẳng 70% HP hiện tại của Boss (buffed!)
            }
            enemy.takeDamage(dmg);
            particleManager.createExplosion(enemy.x, enemy.y, '#ff003c', 8, 4);
          }
        }

        // Cường hóa cấp 5: Tạo 3 đường nứt lửa địa chấn
        const lvl = this.player.spellLevels[2] || 1;
        if (lvl >= 5) {
          const baseAngle = this.angle;
          const spread = 0.35;
          for (let i = -1; i <= 1; i++) {
            const angle = baseAngle + i * spread;
            const tx = this.destX + Math.cos(angle) * 110;
            const ty = this.destY + Math.sin(angle) * 110;
            const crack = new Spell(this.destX, this.destY, tx, ty, 'wolf_c_crack', this.player);
            gameCtx.playerSpells.push(crack);
          }
        }
      }
    }
    else if (this.type === 'wolf_c_crack') {
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;
      this.path.push({ x: this.x, y: this.y });

      for (const enemy of enemies) {
        if (enemy.dead || this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          enemy.applyEffect('dizzy', 120); // Gây choáng 2 giây
          this.hitEnemies.add(enemy.id);
          particleManager.createFireParticles(enemy.x, enemy.y, 4);
        }
      }
      if (this.life % 4 === 0) {
        particleManager.createFireParticles(this.x, this.y, 2);
      }
    }
    else if (this.type === 'wolf_v') {
      this.x = this.player.x;
      this.y = this.player.y;
      this.player.lycanTransformActive = true;
      this.player.rage = (this.player.wolfHp / this.player.maxWolfHp) * 100;
      if (this.player.wolfHp <= 0) {
        this.active = false;
        this.player.lycanTransformActive = false;
        this.player.rage = 0;
      } else {
        this.life = 0; // Giữ spell luôn hoạt động cho đến khi hết máu sói
      }
    }
    else if (this.type === 'creation_z') {
      const pullRadius = this.size;
      for (const enemy of enemies) {
        if (enemy.dead || enemy.type === 'boss') continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < pullRadius) {
          const pullAngle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
          const pullForce = 3.5 * (1.0 - dist / pullRadius);
          enemy.x += Math.cos(pullAngle) * pullForce;
          enemy.y += Math.sin(pullAngle) * pullForce;
        }
      }
      
      if (this.life % 10 === 0) {
        particleManager.createLightningParticles(this.x, this.y, 4);
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < pullRadius) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('shock', 25);
            particleManager.addParticle(enemy.x, enemy.y, '#ffe600', 1.5, 1.2, Math.random()*Math.PI*2, 0.05);
          }
        }
      }
      
      if (Math.random() < 0.6) {
        const angle = Math.random() * Math.PI * 2;
        const dist = pullRadius * (0.6 + Math.random() * 0.4);
        const px = this.x + Math.cos(angle) * dist;
        const py = this.y + Math.sin(angle) * dist;
        const speed = 2.5;
        particleManager.addParticle(px, py, '#ffe600', Math.random()*2+1.0, speed, angle + Math.PI, 0.04);
      }

      if (this.life >= this.maxLife - 1) {
        soundManager.playExplosion();
        particleManager.triggerShake(8);
        particleManager.createShockwave(this.x, this.y, '#ffe600', pullRadius);
        particleManager.createExplosion(this.x, this.y, '#ffe600', 25, 4);
        
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < pullRadius + enemy.size) {
            let dmg = this.explodeDmg;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('shock', 90);
            
            const pushAngle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
            enemy.x += Math.cos(pushAngle) * 35;
            enemy.y += Math.sin(pushAngle) * 35;
          }
        }
      }
    }
    else if (this.type === 'creation_x') {
      let target = null;
      let minDist = Infinity;
      for (const e of enemies) {
        if (e.dead) continue;
        const d = Math.hypot(e.x - this.x, e.y - this.y);
        if (d < minDist) {
          minDist = d;
          target = e;
        }
      }
      if (target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        this.vx = dx / minDist;
        this.vy = dy / minDist;
      }
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;
      this.shootTick = (this.shootTick || 0) + 1;
      for (const enemy of enemies) {
        if (enemy.dead) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          if (this.shootTick % 10 === 0) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            particleManager.addParticle(enemy.x, enemy.y, '#ffe600', 2, 1, Math.random()*Math.PI*2, 0.05);
          }
        }
      }
    }
    else if (this.type === 'creation_c') {
      this.zapTick = (this.zapTick || 0) + 1;
      if (this.zapTick % 10 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('shock', 40);
            particleManager.addParticle(enemy.x, enemy.y, '#ffe600', 1.5, 1.5, Math.random()*Math.PI*2, 0.05);
          }
        }
      }
      if (Math.random() < 0.4) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * this.size;
        particleManager.addParticle(this.x + Math.cos(angle)*rad, this.y + Math.sin(angle)*rad, '#ffe600', 2, 0.5, angle + Math.PI/2, 0.03);
      }
    }
    else if (this.type === 'creation_v') {
      // Tinh vân bám theo tâm người chơi
      this.x = this.player.x;
      this.y = this.player.y;

      this.absorbTick = (this.absorbTick || 0) + 1;
      const lvl = this.player.spellLevels[3] || 1;

      // 1. Phản đạn quái thành đạn tinh vân tự dí bắn trả
      for (let i = gameCtx.enemyBullets.length - 1; i >= 0; i--) {
        const b = gameCtx.enemyBullets[i];
        const dist = Math.hypot(b.x - this.x, b.y - this.y);
        if (dist < this.size) {
          // Xóa đạn quái
          gameCtx.enemyBullets.splice(i, 1);
          particleManager.addParticle(b.x, b.y, '#ff00f3', 2.0, 1.2, Math.random()*Math.PI*2, 0.08);

          // Tìm quái gần nhất để phản đòn bắn trả
          let targetEnemy = null;
          let minDist = Infinity;
          for (const e of enemies) {
            if (e.dead) continue;
            const ed = Math.hypot(e.x - b.x, e.y - b.y);
            if (ed < minDist) {
              minDist = ed;
              targetEnemy = e;
            }
          }
          if (targetEnemy && minDist < 500) {
            // Bắn ra đạn basic_creation phản công uốn lượn có sát thương và màu riêng biệt
            const reflected = new Spell(b.x, b.y, targetEnemy.x, targetEnemy.y, 'basic_creation', this.player);
            reflected.damage = 50 * (1.0 + (lvl - 1) * 0.20);
            reflected.speed = 13;
            reflected.color = '#ff00f3'; // Màu hồng neon tinh vân phản đạn
            gameCtx.playerSpells.push(reflected);
          }
        }
      }

      // 2. Giật điện định kỳ và làm chậm mạnh quái vật trong vùng tinh vân
      if (this.absorbTick % 10 === 0) {
        const tickDmg = 35 * (1.0 + (lvl - 1) * 0.15);
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size) {
            let dmg = tickDmg;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('slow', 45); // Làm chậm quái vật 45%
            enemy.applyEffect('shock', 25);
            particleManager.addParticle(enemy.x, enemy.y, '#ff00f3', 1.5, 1.0, Math.random()*Math.PI*2, 0.06);
          }
        }
      }

      // 3. Hiệu ứng hạt tinh vân xoay tròn nhạt bên trong
      if (Math.random() < 0.55) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * this.size;
        const px = this.x + Math.cos(angle) * rad;
        const py = this.y + Math.sin(angle) * rad;
        const swirlAngle = angle + Math.PI / 2 + 0.15;
        particleManager.addParticle(px, py, '#ff00f3', Math.random()*2.5+1.0, 1.6, swirlAngle, 0.03, 0.98);
      }

      // 4. Vụ nổ tinh vân cuối cùng sụp đổ nổ tung diện rộng
      if (this.life >= this.maxLife - 1) {
        soundManager.playExplosion();
        particleManager.triggerShake(16);
        particleManager.createShockwave(this.x, this.y, '#ff00f3', this.size);
        particleManager.createExplosion(this.x, this.y, '#ffe600', 35, 5);
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size + enemy.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('freeze_solid', 180); // Đóng băng cứng quái vật 3 giây
          }
        }
      }
    }
    else if (this.type === 'marina_x') {
      let target = null;
      if (this.targetEnemyId) {
        target = enemies.find(e => e.id === this.targetEnemyId && !e.dead);
      }
      if (!target) {
        let minDist = Infinity;
        for (const e of enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.x, e.y - this.y);
          if (dist < minDist) {
            minDist = dist;
            target = e;
          }
        }
        if (target) this.targetEnemyId = target.id;
      }

      if (target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          const lvl = this.player.spellLevels[1] || 1;
          const speedMultiplier = 1.0 + (lvl - 1) * 0.30;
          const currentSpeed = this.speed * speedMultiplier;

          this.vx = dx / dist;
          this.vy = dy / dist;
          this.angle = Math.atan2(dy, dx);
          
          this.x += this.vx * currentSpeed;
          this.y += this.vy * currentSpeed;
        }

        const touchDist = this.size + target.size;
        if (dist < touchDist) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          target.takeDamage(dmg);
          
          soundManager.playHit();
          particleManager.createWaterParticles(this.x, this.y, 15);
          particleManager.createShockwave(this.x, this.y, '#00bfff', 40);
          
          this.active = false;
          return;
        }
      } else {
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
      }

      if (this.life % 2 === 0) {
        particleManager.addParticle(this.x, this.y, '#0099ff', 2.5, 0.5, this.angle + Math.PI, 0.05);
      }
    }
    else if (this.type === 'marina_c') {
      const lvl = this.player.spellLevels[2] || 1;
      const dmgMultiplier = 1.0 + (lvl - 1) * 0.20;

      if (this.life % 15 === 0) {
        const tickDmg = (this.damage / (this.maxLife / 15)) * dmgMultiplier;
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size + enemy.size) {
            let dmg = tickDmg;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            particleManager.addParticle(enemy.x, enemy.y, '#00bfff', 1.5, 1, Math.random() * Math.PI * 2, 0.05);
          }
        }
      }

      for (const enemy of enemies) {
        if (enemy.dead || enemy.type === 'boss') continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + 40) {
          const pullAngle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
          const pullForce = 2.2 * (1.0 - dist / (this.size + 40));
          enemy.x += Math.cos(pullAngle) * pullForce;
          enemy.y += Math.sin(pullAngle) * pullForce;
        }
      }

      if (Math.random() < 0.4) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * this.size;
        const px = this.x + Math.cos(angle) * rad;
        const py = this.y + Math.sin(angle) * rad;
        const swirlAngle = angle + Math.PI / 2 + 0.2;
        particleManager.addParticle(px, py, '#00bfff', Math.random() * 2 + 1, 1.5, swirlAngle, 0.03, 0.98);
      }

      if (this.life >= this.maxLife - 1) {
        soundManager.playHit();
        particleManager.createShockwave(this.x, this.y, '#ffffff', this.size);
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size + 20) {
            const pushAngle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
            const pushForce = 12 * (1.0 - dist / (this.size + 20));
            enemy.x += Math.cos(pushAngle) * pushForce;
            enemy.y += Math.sin(pushAngle) * pushForce;
            enemy.applyEffect('dizzy', 240);
          }
        }
      }
    }
    else if (this.type === 'zephyr_x') {
      const lvl = this.player.spellLevels[1] || 1;
      const pullRadius = 180 * (1.0 + (lvl - 1) * 0.20);
      for (const enemy of enemies) {
        if (enemy.dead || enemy.type === 'boss') continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < pullRadius) {
          const pullAngle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
          const pullForce = 2.4 * (1.0 - dist / pullRadius);
          enemy.x += Math.cos(pullAngle) * pullForce;
          enemy.y += Math.sin(pullAngle) * pullForce;
        }
      }
      if (Math.random() < 0.25) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * this.size;
        particleManager.addParticle(this.x + Math.cos(angle) * dist, this.y + Math.sin(angle) * dist, '#00ff7f', 2, 1, angle + Math.PI/2, 0.04);
      }
    }
    else if (this.type === 'zephyr_c') {
      let target = null;
      let minDist = Infinity;
      for (const e of enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          target = e;
        }
      }
      if (target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          this.vx = dx / dist;
          this.vy = dy / dist;
        }
      }
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;

      for (const enemy of enemies) {
        if (enemy.dead || enemy.type === 'boss') continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + 40) {
          const pullAngle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
          const pullForce = 2.0 * (1.0 - dist / (this.size + 40));
          enemy.x += Math.cos(pullAngle) * pullForce;
          enemy.y += Math.sin(pullAngle) * pullForce;
        }
      }

      if (this.life % 15 === 0) {
        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < this.size + enemy.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            particleManager.createWindParticles(enemy.x, enemy.y, 1);
          }
        }
      }

      if (Math.random() < 0.4) {
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.random() * this.size;
        particleManager.addParticle(this.x + Math.cos(angle)*rad, this.y + Math.sin(angle)*rad, '#adff2f', 2, 1.2, angle + Math.PI/2, 0.04);
      }
    }
    else if (this.type === 'tesla_z') {
      const lvl = this.player.spellLevels[0] || 1;
      this.performTeslaChain(enemies, 6 + (lvl - 1), 250, 'shock', 60);
    }
    else if (this.type === 'tesla_v_chain') {
      this.performTeslaChain(enemies, 4, 200, 'shock', 40);
    }
    else if (this.type === 'tesla_x') {
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;

      this.shootTick = (this.shootTick || 0) + 1;
      if (this.shootTick % 12 === 0) {
        const lvl = this.player.spellLevels[1] || 1;
        const zapCount = 3 + (lvl - 1);
        let nearby = enemies.filter(e => !e.dead && Math.hypot(e.x - this.x, e.y - this.y) < 160);
        nearby.sort((a, b) => Math.hypot(a.x - this.x, a.y - this.y) - Math.hypot(b.x - this.x, b.y - this.y));
        const targets = nearby.slice(0, zapCount);
        this.zapTargets = targets;
        for (const enemy of targets) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          enemy.applyEffect('shock', 30);
          particleManager.createLightningParticles(enemy.x, enemy.y, 2);
        }
      } else {
        if (this.shootTick % 12 > 2) {
          this.zapTargets = [];
        }
      }

      if (Math.random() < 0.3) {
        particleManager.createLightningParticles(this.x, this.y, 1);
      }
    }
    else if (this.type === 'tesla_c') {
      this.zapTick = (this.zapTick || 0) + 1;
      if (this.zapTick % 10 === 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * this.size;
        const strikeX = this.x + Math.cos(angle) * dist;
        const strikeY = this.y + Math.sin(angle) * dist;
        
        this.lastStrike = { x: strikeX, y: strikeY, timer: 4 };

        soundManager.playSpell('lightning_lightning');
        particleManager.createLightningParticles(strikeX, strikeY, 5);

        for (const enemy of enemies) {
          if (enemy.dead) continue;
          const d = Math.hypot(enemy.x - strikeX, enemy.y - strikeY);
          if (d < 45 + enemy.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
            enemy.takeDamage(dmg);
            enemy.applyEffect('shock', 50);
          }
        }
      }
      if (this.lastStrike && this.lastStrike.timer > 0) {
        this.lastStrike.timer--;
      }
    }

    if (this.type === 'lightning_orb') {
      this.shootTick = (this.shootTick || 0) + 1;
      if (this.shootTick % 10 === 0) {
        this.zapTargets = enemies.filter(e => !e.dead && Math.hypot(e.x - this.x, e.y - this.y) < 150);
        for (const enemy of this.zapTargets) {
          let dmg = this.damage * 0.4;
          if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
          enemy.takeDamage(dmg);
          enemy.applyEffect('shock', 25);
          particleManager.createLightningParticles(enemy.x, enemy.y, 2);
        }
      }
    }

    if (this.type === 'lightning_lightning') {
      this.performChainLightning(enemies);
    } 
    else if (this.type === 'water_wind') {
      this.x = this.player.x;
      this.y = this.player.y;
      this.size = (this.life / this.maxLife) * this.maxRadius;

      // Bắn ra các gai tuyết phân mảnh tung tóe ra xung quanh Pháp sư
      if (this.life % 3 === 0 && this.life < 25) {
        const angle = Math.random() * Math.PI * 2;
        const sx = this.x + Math.cos(angle) * this.size;
        const sy = this.y + Math.sin(angle) * this.size;
        
        const shard = new Spell(sx, sy, sx + Math.cos(angle) * 100, sy + Math.sin(angle) * 100, 'water', this.player);
        shard.speed = 9;
        shard.damage = this.damage * 0.45;
        shard.size = 4.5;
        shard.maxLife = 30;
        gameCtx.playerSpells.push(shard);
      }

      for (const enemy of enemies) {
        if (this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < this.size + enemy.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) {
            dmg *= 2;
            particleManager.addParticle(enemy.x, enemy.y, '#ffffff', 4, 3, Math.random()*Math.PI*2, 0.05);
          }
          enemy.takeDamage(dmg);
          enemy.applyEffect('freeze_solid', 120);
          this.hitEnemies.add(enemy.id);
          particleManager.createWaterParticles(enemy.x, enemy.y, 8);
        }
      }
    } 
    else if (this.type === 'lightning_wind') {
      if (this.life === 1) {
        soundManager.playExplosion();
        particleManager.triggerShake(7);
        for (const enemy of enemies) {
          if (Math.hypot(enemy.x - this.x, enemy.y - this.y) < 60 + enemy.size) {
            let dmg = this.damage;
            if (Math.random() < (this.player.critChance || 0)) {
              dmg *= 2;
              particleManager.addParticle(enemy.x, enemy.y, '#ffffff', 4, 3, Math.random()*Math.PI*2, 0.05);
            }
            enemy.takeDamage(dmg);
            enemy.applyEffect('shock', 80);
            particleManager.createLightningParticles(enemy.x, enemy.y, 10);
          }
        }
      }
    }
    else if (this.type === 'wood_wood') {
      this.path.push({ x: this.x, y: this.y });
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;

      if (Math.random() < 0.25) {
        particleManager.addParticle(this.x, this.y, '#2e8b57', 2, 0.5, this.angle + Math.PI, 0.03);
      }

      for (const enemy of enemies) {
        if (this.hitEnemies.has(enemy.id)) continue;
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        if (dist < enemy.size + this.size) {
          let dmg = this.damage;
          if (Math.random() < (this.player.critChance || 0)) {
            dmg *= 2;
          }
          enemy.takeDamage(dmg);
          enemy.applyEffect('trap', 180); // Trói chân 3 giây
          this.hitEnemies.add(enemy.id);

          for (let i = 0; i < 5; i++) {
            particleManager.addParticle(enemy.x, enemy.y, '#00ff7f', Math.random()*2+1, Math.random()*2, Math.random()*Math.PI*2, 0.04);
          }
        }
      }
    }
    else if (this.type === 'basic_creation') {
      let target = null;
      let minDist = 450; // Tăng tầm tìm mục tiêu của homing
      for (const e of enemies) {
        if (e.dead) continue;
        const d = Math.hypot(e.x - this.x, e.y - this.y);
        if (d < minDist) {
          minDist = d;
          target = e;
        }
      }
      if (target) {
        const tx = target.x - this.x;
        const ty = target.y - this.y;
        const dist = Math.hypot(tx, ty);
        if (dist > 0) {
          const targetVx = tx / dist;
          const targetVy = ty / dist;
          // Homing mạnh mẽ hơn
          this.vx = this.vx * 0.84 + targetVx * 0.16;
          this.vy = this.vy * 0.84 + targetVy * 0.16;
          const len = Math.hypot(this.vx, this.vy);
          if (len > 0) {
            this.vx /= len;
            this.vy /= len;
          }
          this.angle = Math.atan2(this.vy, this.vx);
        }
      }
      
      // Tạo chuyển động sóng uốn lượn lộng lẫy khi bay
      this.waveTime = (this.waveTime || 0) + 0.25;
      const wave = Math.sin(this.waveTime + (this.waveOffset || 0)) * 2.8;
      const perpX = -this.vy * wave;
      const perpY = this.vx * wave;

      this.x += this.vx * this.speed + perpX;
      this.y += this.vy * this.speed + perpY;
    }
    else {
      this.x += this.vx * this.speed;
      this.y += this.vy * this.speed;

      if (this.type === 'fire_fire') {
        particleManager.createFireParticles(this.x, this.y, 2);
      } else if (this.type === 'fire_water') {
        particleManager.addParticle(this.x, this.y, '#e0eee0', Math.random()*5+3, 1, this.angle + Math.PI + (Math.random()*0.4-0.2), 0.05, 0.95);
      } else if (this.type === 'water_water' || this.type === 'water') {
        if (Math.random() < 0.25) {
          particleManager.addParticle(this.x, this.y, '#ffffff', 1.5, 0.4, Math.random()*Math.PI*2, 0.05);
        }
      } else if (this.type === 'wood') {
        if (Math.random() < 0.2) {
          particleManager.addParticle(this.x, this.y, '#2e8b57', Math.random()*2+1, 0.3, this.angle + Math.PI, 0.05);
        }
      } else if (this.type === 'wind_wood') {
        if (Math.random() < 0.25) {
          particleManager.addParticle(this.x, this.y, '#7cfc00', Math.random()*2+1, 0.5, this.angle + Math.PI, 0.04);
        }
      } else if (this.type === 'water_wood') {
        if (Math.random() < 0.25) {
          particleManager.addParticle(this.x, this.y, '#5f9ea0', Math.random()*2+1, 0.4, this.angle + Math.PI, 0.04);
        }
      } else if (this.type === 'lightning_wood') {
        if (Math.random() < 0.3) {
          particleManager.createLightningParticles(this.x, this.y, 1);
        }
      } else if (this.type === 'magma_wind') {
        particleManager.addParticle(this.x, this.y, '#708090', Math.random()*8+4, 1.2, this.angle + Math.PI + (Math.random()*0.6-0.3), 0.02, 0.95);
        for (const enemy of enemies) {
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < 120) {
            enemy.x += this.vx * 2.0;
            enemy.y += this.vy * 2.0;
            enemy.applyEffect('freeze', 30);
          }
        }
      } else if (this.type === 'lightning_magma') {
        if (Math.random() < 0.2) {
          particleManager.createLightningParticles(this.x, this.y, 1);
        }
      } else if (this.type === 'fire_wind') {
        particleManager.createFireParticles(this.x, this.y, 3);
        particleManager.createWindParticles(this.x, this.y, 1);
        
        for (const enemy of enemies) {
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < 150) {
            const pullAngle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
            enemy.x += Math.cos(pullAngle) * 2.5;
            enemy.y += Math.sin(pullAngle) * 2.5;
          }
        }
      } else if (this.type === 'water_lightning') {
        if (Math.random() < 0.4) {
          particleManager.createLightningParticles(this.x, this.y, 1);
        }
      }

      const isBypassCollision = (
        this.type === 'marina_c' ||
        this.type === 'ignis_v' ||
        this.type === 'zephyr_x' ||
        this.type === 'zephyr_c' ||
        this.type === 'tesla_z' ||
        this.type === 'tesla_c' ||
        this.type === 'tesla_v_chain' ||
        this.type === 'frost_x' ||
        this.type === 'frost_c' ||
        this.type === 'frost_v' ||
        this.type === 'magma_patch' ||
        this.type === 'magma_x' ||
        this.type === 'wolf_x' ||
        this.type === 'wolf_v' ||
        this.type === 'wolf_c' ||
        this.type === 'creation_c' ||
        this.type === 'creation_v' ||
        this.type === 'gaia_x' ||
        this.type === 'gaia_v' ||
        this.type === 'umbra_x' ||
        this.type === 'umbra_c' ||
        this.type === 'venom_v' ||
        this.type === 'venom_patch'
      );
      if (!isBypassCollision) {
        // Obstacle collision for spells
        if (gameCtx.obstacles) {
          for (const obs of gameCtx.obstacles) {
            if (!obs.active) continue;
            if (obs.type !== 'ore_stone' && obs.type !== 'ore_iron' && obs.type !== 'ore_gold' && obs.type !== 'ore_diamond' && obs.type !== 'tree') continue;
            
            const dist = Math.hypot(obs.x - this.x, obs.y - this.y);
            if (dist < obs.size + this.size) {
              let dmg = this.damage;
              if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
              obs.takeDamage(dmg);
              
              if (this.type === 'basic_magma' && this.isExplosive) {
                this.explodeBasicMagma(enemies);
              } else if (this.type === 'fire_lightning' && this.isExplosive) {
                this.explodeSpell(enemies);
              } else if ((this.type === 'magma' || this.type === 'magma_magma' || this.type === 'fire_magma' || this.type === 'water_magma' || this.type === 'lightning_magma') && this.isExplosive) {
                this.explodeMagmaSpell(enemies);
              } else if (this.type === 'fire_explosion' && this.isExplosive) {
                this.explodeFireExplosion(enemies);
              } else if (this.type === 'ignis_x' && this.isExplosive) {
                this.explodeIgnisX(enemies);
              } else if (this.type === 'ignis_c' && this.isExplosive) {
                this.explodeIgnisC(enemies);
              } else if (this.type === 'marina_z' && this.isExplosive) {
                this.explodeMarinaZ(enemies);
              } else if (this.type === 'venom_z' && this.isExplosive) {
                this.explodeVenomZ(enemies);
              } else if (this.type === 'venom_x' && this.isExplosive) {
                this.explodeVenomX(enemies);
              }
              
              if (this.type === 'water_ice') {
                this.pierceCount = (this.pierceCount || 2) - 1;
                if (this.pierceCount <= 0) {
                  this.active = false;
                }
              } else if (this.type !== 'fire_wind' && this.type !== 'wind_wind' && this.type !== 'wind_wood' && this.type !== 'wood_wood' && this.type !== 'wind_blade' && this.type !== 'marina_x' && this.type !== 'marina_c' && this.type !== 'ignis_v' && this.type !== 'zephyr_z' && this.type !== 'zephyr_v_small' && this.type !== 'tesla_x' && this.type !== 'frost_z' && this.type !== 'magma_c' && this.type !== 'basic_wolf' && this.type !== 'claw_melee' && this.type !== 'creation_x' && this.type !== 'umbra_z' && this.type !== 'umbra_v_projectile' && this.type !== 'gaia_z' && this.type !== 'venom_c') {
                this.active = false;
              }
              
              soundManager.playHit();
              for (let i = 0; i < 4; i++) {
                particleManager.addParticle(this.x, this.y, obs.color, Math.random() * 2 + 1, Math.random() * 1.5 + 1, Math.random() * Math.PI * 2, 0.06);
              }
              break;
            }
          }
        }

        if (!this.active) return; // If spell died on obstacle, stop

        for (const enemy of enemies) {
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < enemy.size + this.size) {
            
            if (this.type === 'basic_magma' && this.isExplosive) {
              this.explodeBasicMagma(enemies);
              this.active = false;
              return;
            }

            if (this.type === 'fire_lightning' && this.isExplosive) {
              this.explodeSpell(enemies);
              this.active = false;
              return;
            }

            if ((this.type === 'magma' || this.type === 'magma_magma' || this.type === 'fire_magma' || this.type === 'water_magma' || this.type === 'lightning_magma') && this.isExplosive) {
              this.explodeMagmaSpell(enemies);
              this.active = false;
              return;
            }

            if (this.type === 'fire_explosion' && this.isExplosive) {
              this.explodeFireExplosion(enemies);
              this.active = false;
              return;
            }

            if (this.type === 'ignis_x' && this.isExplosive) {
              this.explodeIgnisX(enemies);
              this.active = false;
              return;
            }

            if (this.type === 'ignis_c' && this.isExplosive) {
              this.explodeIgnisC(enemies);
              this.active = false;
              return;
            }

            if (this.type === 'marina_z' && this.isExplosive) {
              this.explodeMarinaZ(enemies);
              this.active = false;
              return;
            }

            if (!this.hitEnemies.has(enemy.id)) {
              let dmg = this.damage;
              if (Math.random() < (this.player.critChance || 0)) {
                dmg *= 2;
                particleManager.addParticle(enemy.x, enemy.y, '#ffffff', 4, 3, Math.random() * Math.PI * 2, 0.05);
              }

              if (this.type !== 'marina_x' && this.type !== 'marina_c' && this.type !== 'ignis_v') {
                enemy.takeDamage(dmg);
              }
              
              if (this.type === 'ignis_z') {
                enemy.applyEffect('burn', 300);
                particleManager.createFireParticles(this.x, this.y, 3);
              } else if (this.type === 'ignis_c_small') {
                enemy.applyEffect('burn', 300);
                particleManager.createFireParticles(this.x, this.y, 2);
              } else if (this.type === 'basic_fire') {
                if (Math.random() < 0.20) enemy.applyEffect('burn', 45);
                particleManager.createFireParticles(this.x, this.y, 2);
              } else if (this.type === 'basic_water') {
                if (Math.random() < 0.20) enemy.applyEffect('freeze', 45);
                particleManager.createWaterParticles(this.x, this.y, 2);
              } else if (this.type === 'basic_wind') {
                enemy.x += this.vx * 8;
                enemy.y += this.vy * 8;
                particleManager.createWindParticles(this.x, this.y, 2);
              } else if (this.type === 'basic_lightning') {
                if (Math.random() < 0.20) enemy.applyEffect('shock', 20);
                particleManager.createLightningParticles(this.x, this.y, 2);
              } else if (this.type === 'water_ice') {
                enemy.applyEffect('freeze', 100);
                particleManager.createWaterParticles(this.x, this.y, 4);
                this.pierceCount = (this.pierceCount || 2) - 1;
                if (this.pierceCount <= 0) {
                  this.active = false;
                }
              } else if (this.type === 'wind_blade') {
                enemy.x += this.vx * 15; // Knockback
                enemy.y += this.vy * 15;
                particleManager.createWindParticles(this.x, this.y, 3);
              } else if (this.type === 'fire_fire') {
                enemy.applyEffect('burn', 90);
                particleManager.createFireParticles(this.x, this.y, 5);
              } else if (this.type === 'fire_water') {
                enemy.applyEffect('burn', 40);
                enemy.x += this.vx * 6;
                enemy.y += this.vy * 6;
              } else if (this.type === 'wind_wind') {
                enemy.x += this.vx * 12;
                enemy.y += this.vy * 12;
                particleManager.createWindParticles(this.x, this.y, 3);
              } else if (this.type === 'water_lightning') {
                enemy.applyEffect('trap', 150);
                particleManager.createLightningParticles(this.x, this.y, 5);
              } else if (this.type === 'wood') {
                enemy.applyEffect('freeze', 90);
                for (let i = 0; i < 3; i++) {
                  particleManager.addParticle(this.x, this.y, '#2e8b57', 1.5, 1, Math.random()*Math.PI*2, 0.05);
                }
              } else if (this.type === 'wind_wood') {
                enemy.applyEffect('freeze', 40);
                for (let i = 0; i < 2; i++) {
                  particleManager.addParticle(this.x, this.y, '#7cfc00', 1.5, 1.2, Math.random()*Math.PI*2, 0.05);
                }
              } else if (this.type === 'water_wood') {
                enemy.applyEffect('freeze', 100);
                enemy.applyEffect('trap', 60);
                particleManager.createWaterParticles(this.x, this.y, 3);
              } else if (this.type === 'lightning_wood') {
                enemy.applyEffect('shock', 40);
                enemy.applyEffect('trap', 100);
                particleManager.createLightningParticles(this.x, this.y, 3);
              } else if (this.type === 'zephyr_z') {
                enemy.x += this.vx * 14;
                enemy.y += this.vy * 14;
                particleManager.createWindParticles(this.x, this.y, 3);
              } else if (this.type === 'zephyr_v_small') {
                enemy.x += this.vx * 6;
                enemy.y += this.vy * 6;
                particleManager.createWindParticles(this.x, this.y, 2);
              } else if (this.type === 'basic_ice') {
                enemy.applyEffect('slow', 120);
                particleManager.createWaterParticles(this.x, this.y, 2);
              } else if (this.type === 'basic_magma') {
                if (Math.random() < 0.25) enemy.applyEffect('burn', 80);
                particleManager.createFireParticles(this.x, this.y, 2);
              } else if (this.type === 'basic_creation') {
                // Tạo vụ nổ tinh vân nhỏ gây sát thương lan (splash) 15 cho quái xung quanh
                soundManager.playHit();
                particleManager.createLightningParticles(this.x, this.y, 3);
                const splashRadius = 45;
                for (const otherEnemy of enemies) {
                  if (otherEnemy === enemy || otherEnemy.dead) continue;
                  const splashDist = Math.hypot(otherEnemy.x - this.x, otherEnemy.y - this.y);
                  if (splashDist < splashRadius + otherEnemy.size) {
                    otherEnemy.takeDamage(15);
                    otherEnemy.applyEffect('shock', 20);
                  }
                }
                if (Math.random() < 0.25) enemy.applyEffect('shock', 30);
                particleManager.addParticle(this.x, this.y, '#ffe600', 2, 0.8, Math.random()*Math.PI*2, 0.05);
              } else if (this.type === 'basic_wolf') {
                particleManager.createExplosion(this.x, this.y, '#ff003c', 4, 2);
                this.player.gainRage(3.0); // Tăng nộ khi cào trúng quái (buffed!)
              } else if (this.type === 'claw_melee') {
                particleManager.createExplosion(this.x, this.y, '#ff3300', 8, 3);
                enemy.applyEffect('burn', 150); // Gây chảy máu 150 frames
                
                // Lifesteal 15% sát thương cận chiến khi hóa hình sói (hồi trực tiếp vào máu sói!)
                const healAmt = dmg * 0.15;
                this.player.wolfHp = Math.min(this.player.maxWolfHp, this.player.wolfHp + healAmt);
                if (Math.random() < 0.3) {
                  particleManager.addParticle(this.player.x, this.player.y, '#32cd32', 1.8, 1.2, -Math.PI / 2, 0.05);
                }
              } else if (this.type === 'frost_c_shard') {
                enemy.applyEffect('freeze', 80);
                particleManager.createWaterParticles(this.x, this.y, 2);
              } else if (this.type === 'frost_z') {
                enemy.applyEffect('slow', 100);
                particleManager.createWaterParticles(this.x, this.y, 3);
              } else if (this.type === 'magma_c') {
                enemy.applyEffect('burn', 150);
                enemy.x += this.vx * 10;
                enemy.y += this.vy * 10;
                particleManager.createFireParticles(this.x, this.y, 4);
              } else if (this.type === 'pet_dragon_projectile') {
                enemy.applyEffect('burn', 60);
                particleManager.createFireParticles(this.x, this.y, 2);
              } else if (this.type === 'pet_slime_projectile') {
                enemy.applyEffect('slow', 60);
                particleManager.createWaterParticles(this.x, this.y, 2);
              } else if (this.type === 'basic_gaia') {
                enemy.x += this.vx * 16;
                enemy.y += this.vy * 16;
                particleManager.createExplosion(this.x, this.y, '#8b5a2b', 5, 1.5);
              } else if (this.type === 'basic_umbra') {
                particleManager.addParticle(this.x, this.y, '#9d00ff', 3, 1, Math.random() * Math.PI * 2, 0.06);
              }

              this.hitEnemies.add(enemy.id);

              if (this.type !== 'fire_wind' && this.type !== 'wind_wind' && this.type !== 'wind_wood' && this.type !== 'wood_wood' && this.type !== 'wind_blade' && this.type !== 'marina_x' && this.type !== 'marina_c' && this.type !== 'ignis_v' && this.type !== 'zephyr_z' && this.type !== 'zephyr_v_small' && this.type !== 'tesla_x' && this.type !== 'frost_z' && this.type !== 'magma_c' && this.type !== 'basic_wolf' && this.type !== 'claw_melee' && this.type !== 'creation_x' && this.type !== 'umbra_z' && this.type !== 'umbra_v_projectile' && this.type !== 'gaia_z') {
                if (this.type === 'water_ice') {
                  if (this.active === false || this.pierceCount <= 0) {
                    this.active = false;
                    break;
                  }
                } else {
                  this.active = false;
                  break;
                }
              }
            }
          }
        }
      }
    }
    this.update3D();
  }

  explodeVenomZ(enemies) {
    this.isExplosive = false;
    soundManager.playHit();
    const radius = 65;
    particleManager.createExplosion(this.x, this.y, '#00ff00', 8, 3);
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < radius + enemy.size) {
        let dmg = this.damage;
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('slow', 90);
      }
    }
    // Spawn lingering poison patch
    const patch = new Spell(this.x, this.y, this.x, this.y, 'venom_patch', this.player);
    patch.damage = 10;
    patch.size = 45;
    patch.maxLife = 120;
    gameCtx.playerSpells.push(patch);
  }

  explodeVenomX(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    const radius = 100;
    particleManager.createExplosion(this.x, this.y, '#32cd32', 15, 4);
    
    // Spawn a large acid patch
    const patch = new Spell(this.x, this.y, this.x, this.y, 'venom_patch', this.player);
    patch.damage = 14;
    patch.size = 90;
    patch.maxLife = 240; // 4 seconds
    gameCtx.playerSpells.push(patch);
  }

  explodeIgnisX(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    
    const charge = this.chargeRatio || 0.1;
    let radius = 55 + charge * 55;
    
    const lvl = this.player.spellLevels[1] || 1; // ignis_x is index 1
    radius *= (1.0 + (lvl - 1) * 0.20); // +20% explosion area (radius) per lvl
    
    particleManager.triggerShake(4 + charge * 6);
    particleManager.createShockwave(this.x, this.y, '#ff4500', radius);
    particleManager.createFireParticles(this.x, this.y, Math.round(6 + charge * 10));
    
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < enemy.size + this.size) {
        let dmg = this.damage; // Direct damage
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', 300);
      } else if (dist < radius + enemy.size) {
        let dmg = 30; // Splash damage
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', 300);
      }
    }
  }

  explodeIgnisC(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    
    const lvl = this.player.spellLevels[2] || 1; // ignis_c is index 2
    const dmgMultiplier = 1.0 + (lvl - 1) * 0.10; // +10% dmg per lvl
    let radius = 70;
    radius *= (1.0 + (lvl - 1) * 0.20); // +20% explosion area (radius) per lvl
    
    particleManager.triggerShake(6);
    particleManager.createShockwave(this.x, this.y, '#ff4500', radius);
    particleManager.createFireParticles(this.x, this.y, 10);
    
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < radius + enemy.size) {
        let dmg = 60 * dmgMultiplier;
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', 300);
      }
    }
    
    const count = 10 + Math.floor(Math.random() * 6); // 10 to 15
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.25 - 0.125);
      const tx = this.x + Math.cos(angle) * 120;
      const ty = this.y + Math.sin(angle) * 120;
      
      const smallSpell = new Spell(this.x, this.y, tx, ty, 'ignis_c_small', this.player);
      smallSpell.damage = 30 * dmgMultiplier;
      smallSpell.speed = 6.5 + Math.random() * 3.5;
      smallSpell.size = 4.0;
      smallSpell.maxLife = 25;
      gameCtx.playerSpells.push(smallSpell);
    }
  }

  explodeMarinaZ(enemies) {
    this.isExplosive = false;
    soundManager.playHit();
    
    const lvl = this.player.spellLevels[0] || 1; // marina_z is index 0
    let radius = 60;
    radius *= (1.0 + (lvl - 1) * 0.30); // +30% area/radius per lvl
    
    particleManager.createWaterParticles(this.x, this.y, 14);
    
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < radius + enemy.size) {
        let dmg = this.damage;
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('freeze', 180); // làm chậm trong 3s
      }
    }
  }

  explodeZephyrX(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    particleManager.triggerShake(5);
    const lvl = this.player.spellLevels[1] || 1; // zephyr_x is index 1
    const blastRadius = 130 * (1.0 + (lvl - 1) * 0.20);
    particleManager.createShockwave(this.x, this.y, '#00ff7f', blastRadius);
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < blastRadius + enemy.size) {
        let dmg = this.damage;
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        const pushAngle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
        enemy.x += Math.cos(pushAngle) * 16;
        enemy.y += Math.sin(pushAngle) * 16;
        particleManager.createWindParticles(enemy.x, enemy.y, 4);
      }
    }
  }

  explodeTeslaX(enemies) {
    soundManager.playExplosion();
    particleManager.triggerShake(5);
    const lvl = this.player.spellLevels[1] || 1; // tesla_x is index 1
    const blastRadius = 95;
    particleManager.createShockwave(this.x, this.y, '#ffff00', blastRadius);
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < blastRadius + enemy.size) {
        let dmg = this.damage * 1.5;
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('shock', 40);
      }
    }
    const shardCount = 8 + (lvl - 1) * 2;
    for (let i = 0; i < shardCount; i++) {
      const angle = (i / shardCount) * Math.PI * 2;
      const tx = this.x + Math.cos(angle) * 100;
      const ty = this.y + Math.sin(angle) * 100;
      const shard = new Spell(this.x, this.y, tx, ty, 'tesla_x_shard', this.player);
      gameCtx.playerSpells.push(shard);
    }
  }

  explodeFireExplosion(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    particleManager.triggerShake(10);
    particleManager.createShockwave(this.x, this.y, '#ff4500', 90);

    for (const enemy of enemies) {
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < 110 + enemy.size) {
        let dmg = this.damage * 1.4;
        if (Math.random() < (this.player.critChance || 0)) {
          dmg *= 2;
        }
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', 120);
        particleManager.createFireParticles(enemy.x, enemy.y, 6);
      }
    }
    
    // Bắn ra 8 tia lửa nhỏ tỏa đều xung quanh
    const shardCount = 8;
    for (let i = 0; i < shardCount; i++) {
      const angle = (i / shardCount) * Math.PI * 2;
      const tx = this.x + Math.cos(angle) * 100;
      const ty = this.y + Math.sin(angle) * 100;
      const f = new Spell(this.x, this.y, tx, ty, 'fire', this.player);
      f.damage = this.damage * 0.35;
      f.speed = 10;
      f.maxLife = 20;
      f.size = 3.5;
      gameCtx.playerSpells.push(f);
    }
  }

  explodeSpell(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    particleManager.triggerShake(12);
    particleManager.createShockwave(this.x, this.y, '#ff4500', 80);

    for (const enemy of enemies) {
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < 100 + enemy.size) {
        let dmg = this.damage * 1.5;
        if (Math.random() < (this.player.critChance || 0)) {
          dmg *= 2;
          particleManager.addParticle(enemy.x, enemy.y, '#ffffff', 5, 3, Math.random()*Math.PI*2, 0.05);
        }
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', 120);
        enemy.applyEffect('shock', 60);
        particleManager.createFireParticles(enemy.x, enemy.y, 6);
        particleManager.createLightningParticles(enemy.x, enemy.y, 4);
      }
    }
  }

  explodeMagmaSpell(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    
    let radius = 50;
    let shake = 4;
    let dmgMult = 1.0;
    let burnDur = 90;
    let color = '#ff4500';
    
    if (this.type === 'magma_magma') {
      radius = 150;
      shake = 15;
      dmgMult = 1.6;
      burnDur = 180;
      color = '#ff3300';
    } else if (this.type === 'fire_magma') {
      radius = 80;
      shake = 7;
      dmgMult = 1.2;
      burnDur = 120;
      color = '#e67e22';
    } else if (this.type === 'water_magma') {
      radius = 70;
      shake = 3;
      dmgMult = 0.8;
      burnDur = 80;
      color = '#a0522d';
    } else if (this.type === 'lightning_magma') {
      radius = 90;
      shake = 8;
      dmgMult = 1.3;
      burnDur = 100;
      color = '#ff8c00';
    }

    particleManager.triggerShake(shake);
    particleManager.createShockwave(this.x, this.y, color, radius);
    
    particleManager.createFireParticles(this.x, this.y, this.type === 'magma_magma' ? 15 : 6);
    if (this.type === 'water_magma') {
      for (let i = 0; i < 10; i++) {
        particleManager.addParticle(this.x, this.y, '#a0522d', Math.random()*4+2, Math.random()*3+1, Math.random()*Math.PI*2, 0.03);
      }
    } else if (this.type === 'lightning_magma') {
      particleManager.createLightningParticles(this.x, this.y, 6);
    }

    for (const enemy of enemies) {
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < radius + enemy.size) {
        let dmg = this.damage * dmgMult;
        if (Math.random() < (this.player.critChance || 0)) {
          dmg *= 2;
          particleManager.addParticle(enemy.x, enemy.y, '#ffffff', 4, 3, Math.random()*Math.PI*2, 0.05);
        }
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', burnDur);
        
        if (this.type === 'water_magma') {
          enemy.applyEffect('freeze', 80);
        } else if (this.type === 'lightning_magma') {
          enemy.applyEffect('shock', 40);
        }
      }
    }
  }

  explodeMagmaZ(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    particleManager.triggerShake(5);
    const radius = 90;
    particleManager.createShockwave(this.x, this.y, '#d35400', radius);
    particleManager.createFireParticles(this.x, this.y, 10);
    
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < radius + enemy.size) {
        let dmg = this.damage;
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', 120);
      }
    }
    
    // Spawn main lava patch
    gameCtx.playerSpells.push(new Spell(this.x, this.y, this.x, this.y, 'magma_patch', this.player));
  }

  explodeMagmaV(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    particleManager.triggerShake(12);
    const radius = 140;
    particleManager.createShockwave(this.x, this.y, '#ff3300', radius);
    particleManager.createFireParticles(this.x, this.y, 16);
    
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < radius + enemy.size) {
        let dmg = this.damage;
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', 240);
      }
    }
    
    // Spawn main lava patch
    gameCtx.playerSpells.push(new Spell(this.x, this.y, this.x, this.y, 'magma_patch', this.player));
    
    // Spawn 4 extra surrounding smaller lava patches
    const count = 4;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random()*0.5;
      const dist = 70 + Math.random()*30;
      const px = this.x + Math.cos(angle) * dist;
      const py = this.y + Math.sin(angle) * dist;
      
      const patch = new Spell(px, py, px, py, 'magma_patch', this.player);
      patch.size = 40;
      gameCtx.playerSpells.push(patch);
    }
  }

  explodeBasicMagma(enemies) {
    this.isExplosive = false;
    soundManager.playExplosion();
    particleManager.triggerShake(3);
    const radius = 45;
    particleManager.createShockwave(this.x, this.y, '#ff4500', radius);
    particleManager.createFireParticles(this.x, this.y, 4);
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
      if (dist < radius + enemy.size) {
        let dmg = this.damage;
        if (Math.random() < (this.player.critChance || 0)) dmg *= 2;
        enemy.takeDamage(dmg);
        enemy.applyEffect('burn', 80);
      }
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();

    // Hiệu ứng nhạt dần ở cuối tầm bắn (last 25% of life)
    const lifeRatio = this.life / this.maxLife;
    let alpha = 1.0;
    if (lifeRatio > 0.75) {
      alpha = 1.0 - (lifeRatio - 0.75) / 0.25;
    }
    ctx.globalAlpha = Math.max(0, Math.min(1.0, alpha));
    
    if (this.type === 'basic_fire') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff4500';
      ctx.fillStyle = '#ff4500';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'basic_venom') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#32cd32';
      ctx.fillStyle = '#32cd32';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'venom_z') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ff00';
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2, -2, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'venom_x') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.life * 0.08);
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#228b22';
      ctx.fillStyle = '#1e5a1e';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      
      ctx.fillRect(-2, -this.size - 2, 4, 4);
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'venom_c') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#7fff00';
      ctx.fillStyle = '#7fff00';
      
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.size, 0);
      ctx.lineTo(this.size + 6, -2);
      ctx.moveTo(this.size, 0);
      ctx.lineTo(this.size + 6, 2);
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'venom_v') {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 250, 154, 0.25)';
      ctx.lineWidth = 4;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'venom_patch') {
      ctx.save();
      ctx.strokeStyle = 'rgba(50, 205, 50, 0.2)';
      ctx.lineWidth = 2;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'basic_ice') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#8fa0dd';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#8fa0dd';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    else if (this.type === 'basic_magma') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff3300';
      ctx.fillStyle = '#ff3300';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'basic_creation') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Date.now() * 0.015);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffe600';
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size, -Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.size/2.5), -Math.sin((54 + i * 72) * Math.PI / 180) * (this.size/2.5));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'basic_wolf') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff003c';
      ctx.strokeStyle = '#ff003c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.8);
      ctx.quadraticCurveTo(this.size, -this.size * 0.4, this.size * 1.4, -this.size * 0.8);
      ctx.moveTo(-this.size * 0.3, 0);
      ctx.quadraticCurveTo(this.size * 0.8, 0, this.size * 1.3, 0);
      ctx.moveTo(0, this.size * 0.8);
      ctx.quadraticCurveTo(this.size, this.size * 0.4, this.size * 1.4, this.size * 0.8);
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'claw_melee') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff3300';
      ctx.strokeStyle = '#ff3300';
      ctx.lineWidth = 3.5;
      const lifeRatio = this.life / this.maxLife;
      const arcAngle = Math.PI * 0.7;
      const startArc = -arcAngle / 2 + lifeRatio * arcAngle;
      const endArc = startArc + 0.3;
      for (let i = -1; i <= 1; i++) {
        const radius = this.size * (1.0 + i * 0.15);
        ctx.beginPath();
        ctx.arc(0, 0, radius, startArc, endArc);
        ctx.stroke();
      }
      ctx.restore();
    }
    else if (this.type === 'frost_z') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#87cefa';
      ctx.strokeStyle = '#87cefa';
      ctx.fillStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(8, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(0, -5);
      ctx.lineTo(2, 0);
      ctx.lineTo(0, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'frost_x') {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#e0ffff';
      ctx.strokeStyle = 'rgba(224, 255, 255, 0.7)';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'rgba(224, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'frost_c') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.life * 0.005);
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#afeeee';
      ctx.fillStyle = 'rgba(175, 238, 238, 0.8)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.6);
      ctx.lineTo(this.size * 0.8, -this.size * 0.6);
      ctx.lineTo(this.size * 0.8, this.size * 0.6);
      ctx.lineTo(0, this.size * 1.6);
      ctx.lineTo(-this.size * 0.8, this.size * 0.6);
      ctx.lineTo(-this.size * 0.8, -this.size * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'frost_c_shard') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(4, -2.5);
      ctx.lineTo(6, 0);
      ctx.lineTo(4, 2.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'frost_v') {
      ctx.save();
      ctx.strokeStyle = 'rgba(135, 206, 250, 0.3)';
      ctx.lineWidth = 3;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'magma_z') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      const extend = this.extend || 40;
      
      // Draw arm
      ctx.strokeStyle = '#ff4500';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff3300';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(extend, 0);
      ctx.stroke();
      
      // Draw cracked lava arm lines
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(extend * 0.25, -2);
      ctx.lineTo(extend * 0.5, 2);
      ctx.lineTo(extend * 0.75, -2);
      ctx.stroke();
      
      // Draw fist palm
      ctx.fillStyle = '#8b2500';
      ctx.strokeStyle = '#ff3300';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(extend, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw knuckles
      ctx.fillStyle = '#ff4500';
      for (let i = 0; i < 4; i++) {
        const fy = -12 + i * 8;
        const fx = extend + 8;
        ctx.beginPath();
        ctx.arc(fx, fy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      // Draw thumb
      ctx.beginPath();
      ctx.arc(extend - 4, -14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.restore();
    }
    else if (this.type === 'magma_patch') {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff4500';
      ctx.fillStyle = 'rgba(211, 84, 0, 0.4)';
      ctx.strokeStyle = 'rgba(255, 69, 0, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      const pulse = Math.sin(this.life * 0.05) * 3;
      ctx.fillStyle = 'rgba(255, 69, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(5, this.size * 0.65 + pulse), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'magma_x') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff4500';
      ctx.strokeStyle = 'rgba(255, 69, 0, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'magma_c') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff3300';
      
      const progress = this.life / this.maxLife;
      const currentRadius = this.size * Math.sin(progress * Math.PI);
      
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, '#ffe600');
      grad.addColorStop(0.6, '#ff4500');
      grad.addColorStop(1.0, 'rgba(139, 37, 0, 0.1)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ff3300';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, currentRadius * 0.8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    }
    else if (this.type === 'magma_v') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ff4500';
      ctx.fillStyle = '#ff3300';
      ctx.beginPath();
      ctx.moveTo(-18, -this.size*0.7);
      ctx.lineTo(12, 0);
      ctx.lineTo(-18, this.size*0.7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'wolf_z') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#a9a9a9';
      ctx.fillStyle = '#4f4f4f';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff003c';
      ctx.beginPath();
      ctx.arc(this.size * 0.4, -this.size * 0.3, 1.5, 0, Math.PI * 2);
      ctx.arc(this.size * 0.4, this.size * 0.3, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'wolf_x') {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff003c';
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.7)';
      ctx.lineWidth = 3.5;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'wolf_c') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ff003c';
      ctx.fillStyle = '#ff003c';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'basic_wolf' || this.type === 'claw_melee') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      ctx.shadowBlur = 18;
      ctx.shadowColor = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.type === 'claw_melee' ? 3.5 : 2.5;
      
      const lifeRatio = this.life / this.maxLife;
      const alpha = 1 - lifeRatio;
      ctx.strokeStyle = this.type === 'claw_melee' ? `rgba(255, 51, 0, ${alpha})` : `rgba(255, 0, 60, ${alpha})`;
      
      // Vẽ 3 vệt chém cào song song dạng vòng cung
      const radius = this.size * 1.2;
      const clawOffsets = [-0.2, 0, 0.2]; // Góc lệch của 3 vuốt
      
      clawOffsets.forEach(offset => {
        ctx.beginPath();
        ctx.arc(0, 0, radius, offset - 0.45, offset + 0.45);
        ctx.stroke();
      });
      
      ctx.restore();
    }
    else if (this.type === 'wolf_v') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff003c';
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.player.size * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'creation_z') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#ffe600';
      
      const angle = this.life * 0.08;
      
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.45)';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const r = this.size * (0.85 - i * 0.15);
        ctx.arc(0, 0, r, angle + i * Math.PI / 1.5, angle + i * Math.PI / 1.5 + Math.PI * 0.85);
        ctx.stroke();
      }
      
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.45);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(0.5, '#130224');
      grad.addColorStop(0.85, '#ffe600');
      grad.addColorStop(1.0, 'rgba(255, 230, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    else if (this.type === 'creation_x') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.life * 0.15);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffe600';
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.6, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'creation_c') {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.2)';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.1)';
      ctx.beginPath();
      ctx.strokeRect(this.x - this.size, this.y - this.size, this.size*2, this.size*2);
      ctx.restore();
    }
    else if (this.type === 'creation_v') {
      ctx.save();
      
      const pulse = Math.sin(Date.now() * 0.003) * 12;
      const currentRadius = this.size + pulse;

      // 1. Vẽ vòng tinh vân mờ ngoài cùng phát sáng
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#ff00f3';
      ctx.strokeStyle = 'rgba(255, 0, 243, 0.35)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Vẽ lõi tinh vân xoáy
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, currentRadius);
      grad.addColorStop(0, 'rgba(19, 2, 36, 0.25)');
      grad.addColorStop(0.5, 'rgba(255, 0, 243, 0.06)');
      grad.addColorStop(0.85, 'rgba(255, 230, 0, 0.03)');
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // 3. Vẽ các dải bụi tinh vân xoay tròn nhạt bên trong
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius * 0.75, Date.now() * 0.001, Date.now() * 0.001 + Math.PI * 1.3);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 243, 255, 0.12)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius * 0.5, -Date.now() * 0.0012, -Date.now() * 0.0012 + Math.PI * 1.3);
      ctx.stroke();

      ctx.restore();
    }
    else if (this.type === 'pet_dragon_projectile') {
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff4500';
      ctx.fillStyle = '#ff4500';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'pet_slime_projectile') {
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00bfff';
      ctx.fillStyle = '#00bfff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'basic_water') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00bfff';
      ctx.fillStyle = '#00bfff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'basic_wind') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Date.now() * 0.01);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff7f';
      ctx.strokeStyle = '#00ff7f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'basic_lightning') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffff00';
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x - 4, this.y - 4);
      ctx.lineTo(this.x, this.y);
      ctx.lineTo(this.x + 4, this.y + 4);
      ctx.stroke();
    }
    else if (this.type === 'fire_explosion') {
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = '#ff4500';
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (this.type === 'water_ice') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-10, -5);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-10, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'wind_blade') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Date.now() * 0.035);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ff7f';
      ctx.fillStyle = 'rgba(0, 255, 127, 0.25)';
      ctx.strokeStyle = '#00ff7f';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.arc(0, 0, this.size, -Math.PI / 2, Math.PI / 2);
      ctx.arc(0, 0, this.size * 0.6, Math.PI / 2, -Math.PI / 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'lightning_orb') {
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffff00';
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      if (this.zapTargets && this.zapTargets.length > 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffff00';
        
        for (const t of this.zapTargets) {
          if (t.dead) continue;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          
          const steps = 3;
          const dx = (t.x - this.x) / steps;
          const dy = (t.y - this.y) / steps;
          
          for (let j = 1; j < steps; j++) {
            const px = this.x + dx * j + (Math.random() * 14 - 7);
            const py = this.y + dy * j + (Math.random() * 14 - 7);
            ctx.lineTo(px, py);
          }
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    else if (this.type === 'water_water' || this.type === 'water') {
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size);
      ctx.lineTo(this.x + this.size * 0.7, this.y + this.size * 0.5);
      ctx.lineTo(this.x - this.size * 0.7, this.y + this.size * 0.5);
      ctx.closePath();
      ctx.fill();
    } 
    else if (this.type === 'wood_wood') {
      // Nhánh cây dây leo ma thuật phát sáng neon dày
      ctx.strokeStyle = '#1b4d3e'; 
      ctx.lineWidth = 9 * (this.player.spellSizeModifier || 1.0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff7f';
      ctx.beginPath();
      ctx.moveTo(this.player.x, this.player.y);
      for (const pt of this.path) {
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Lõi năng lượng mộc neon mảnh bên trong
      ctx.strokeStyle = '#00ffaa';
      ctx.lineWidth = 3 * (this.player.spellSizeModifier || 1.0);
      ctx.stroke();

      // Vẽ lá hình elip chĩa đều sang hai bên dây leo
      ctx.fillStyle = '#228b22';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#00ff7f';
      for (let i = 4; i < this.path.length - 2; i += 6) {
        const pt = this.path[i];
        const prev = this.path[i - 2] || pt;
        const angle = Math.atan2(pt.y - prev.y, pt.x - prev.x) + Math.PI / 2;
        
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(-6, 0, 4, 7, Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(6, 0, 4, 7, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Hoa sen/đào phát sáng nở ở các khớp dây leo
      ctx.shadowBlur = 6;
      for (let i = 8; i < this.path.length; i += 15) {
        const pt = this.path[i];
        ctx.fillStyle = '#ff69b4'; // Cánh hoa hồng cánh sen
        ctx.shadowColor = '#ff69b4';
        
        const petSize = 4.5;
        ctx.beginPath();
        ctx.arc(pt.x - petSize, pt.y, petSize, 0, Math.PI * 2);
        ctx.arc(pt.x + petSize, pt.y, petSize, 0, Math.PI * 2);
        ctx.arc(pt.x, pt.y - petSize, petSize, 0, Math.PI * 2);
        ctx.arc(pt.x, pt.y + petSize, petSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffd700'; // Nhụy vàng nhạt
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bông hoa lớn xoay ở đầu ngọn dây leo đang tiến tới
      if (this.path.length > 0) {
        const tip = this.path[this.path.length - 1];
        ctx.save();
        ctx.translate(tip.x, tip.y);
        ctx.rotate(Date.now() * 0.005);
        
        ctx.fillStyle = '#ff1493';
        ctx.shadowColor = '#ff1493';
        ctx.shadowBlur = 12;
        const petSize = 6.5;
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(Math.cos(angle) * 5, Math.sin(angle) * 5, petSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    else if (this.type === 'magma_magma') {
      ctx.shadowBlur = this.size * 2.2;
      ctx.shadowColor = '#ff3300';
      ctx.fillStyle = '#3a0808'; // Màu đá đen cháy
      ctx.strokeStyle = '#ff4500'; // Vết rạn nứt
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Vẽ nứt nẻ nham thạch bên trong quả cầu
      ctx.beginPath();
      ctx.moveTo(this.x - this.size * 0.5, this.y);
      ctx.lineTo(this.x + this.size * 0.5, this.y);
      ctx.moveTo(this.x, this.y - this.size * 0.5);
      ctx.lineTo(this.x, this.y + this.size * 0.5);
      ctx.stroke();
    } 
    else if (this.type === 'lightning_lightning') {
      if (this.chainTargets.length === 0) {
        ctx.restore();
        return;
      }
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath();

      let currentX = this.player.x;
      let currentY = this.player.y;

      ctx.moveTo(currentX, currentY);

      for (const target of this.chainTargets) {
        const steps = 3;
        const dx = (target.x - currentX) / steps;
        const dy = (target.y - currentY) / steps;

        for (let j = 1; j < steps; j++) {
          const px = currentX + dx * j + (Math.random() * 20 - 10);
          const py = currentY + dy * j + (Math.random() * 20 - 10);
          ctx.lineTo(px, py);
        }
        ctx.lineTo(target.x, target.y);
        currentX = target.x;
        currentY = target.y;
      }
      ctx.stroke();
    } 
    else if (this.type === 'water_wind') {
      ctx.strokeStyle = `rgba(135, 206, 250, ${1 - this.life / this.maxLife})`;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#87cefa';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
    }
    else if (this.type === 'lightning_wind') {
      const alpha = 1 - this.life / this.maxLife;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 8;
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath();
      ctx.moveTo(this.x - 30, this.y - 600);
      ctx.lineTo(this.x + 10, this.y - 300);
      ctx.lineTo(this.x - 15, this.y - 150);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 0, ${alpha * 0.4})`;
      ctx.lineWidth = 25;
      ctx.stroke();
    }
    else if (this.type === 'wood') {
      ctx.save();
      ctx.shadowBlur = this.size * 2.5;
      ctx.shadowColor = '#00ff7f';
      ctx.fillStyle = '#2e8b57';
      
      // Vẽ lõi hạt mầm
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Vẽ hai lá nhỏ chồi lên ở phía sau chuyển động
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Math.PI);
      ctx.fillStyle = '#00ff7f';
      ctx.beginPath();
      ctx.ellipse(-this.size, -2, 2.5, 5, Math.PI/4, 0, Math.PI*2);
      ctx.ellipse(-this.size, 2, 2.5, 5, -Math.PI/4, 0, Math.PI*2);
      ctx.fill();
      
      ctx.restore();
    }
    else if (this.type === 'wind_wood') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Date.now() * 0.02); // Xoay lá thật nhanh
      
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#7cfc00';
      ctx.fillStyle = '#7cfc00';
      
      // Vẽ hình chiếc lá mỏng sắc như dao
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.quadraticCurveTo(0, -6, 12, 0);
      ctx.quadraticCurveTo(0, 6, -12, 0);
      ctx.closePath();
      ctx.fill();
      
      // Sợi gân lá màu trắng mảnh
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(8, 0);
      ctx.stroke();
      
      ctx.restore();
    }
    else if (this.type === 'water_wood') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#5f9ea0';
      
      // Vẽ thân cành liễu gỗ
      ctx.strokeStyle = '#4682b4';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.stroke();
      
      // Lá liễu bằng băng nhọn
      ctx.fillStyle = '#e0ffff';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(4, -8);
      ctx.lineTo(8, 0);
      ctx.lineTo(4, 8);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(-2, -6);
      ctx.lineTo(1, 0);
      ctx.lineTo(-2, 6);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
    else if (this.type === 'lightning_wood') {
      ctx.save();
      ctx.shadowBlur = this.size * 2.5;
      ctx.shadowColor = '#adff2f';
      ctx.fillStyle = '#adff2f';
      
      // Lõi lá sấm sét
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.7, this.size * 1.3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Hai tia sét xẹt chớp nhỏ hai bên lá
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-this.size, -this.size);
      ctx.lineTo(-this.size * 0.3, -this.size * 1.5 + Math.random() * 4);
      ctx.lineTo(0, -this.size);
      
      ctx.moveTo(this.size, this.size);
      ctx.lineTo(this.size * 0.3, this.size * 1.5 + Math.random() * 4);
      ctx.lineTo(0, this.size);
      ctx.stroke();
      
      ctx.restore();
    }
    else if (this.type === 'ignis_z') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff4500';
      
      // Orange flame tail
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath();
      ctx.moveTo(this.size * 1.5, 0);
      ctx.quadraticCurveTo(0, -this.size * 0.9, -this.size * 1.5, 0);
      ctx.quadraticCurveTo(0, this.size * 0.9, this.size * 1.5, 0);
      ctx.fill();
      
      // Yellow core
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(this.size * 0.2, 0, this.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    else if (this.type === 'ignis_c_small') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Date.now() * 0.01);
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff8c00';
      
      ctx.fillStyle = '#ff3d00';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    else if (this.type === 'ignis_x') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Date.now() * 0.004);
      
      const pulse = 1.0 + Math.sin(Date.now() * 0.015) * 0.1;
      const r = this.size * pulse;
      
      ctx.shadowBlur = r * 1.5;
      ctx.shadowColor = '#ff3300';
      
      const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#ffea00');
      grad.addColorStop(0.7, '#ff5722');
      grad.addColorStop(1.0, 'rgba(255, 69, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 235, 59, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.6, 0, Math.PI, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.4, Math.PI, Math.PI * 2, false);
      ctx.stroke();
      
      ctx.restore();
    }
    else if (this.type === 'ignis_c') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Date.now() * -0.002);
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#d84315';
      
      const grad = ctx.createRadialGradient(0, 0, this.size * 0.2, 0, 0, this.size);
      grad.addColorStop(0, '#ffe082');
      grad.addColorStop(0.4, '#ff6f00');
      grad.addColorStop(0.9, '#3e2723');
      grad.addColorStop(1.0, '#212121');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ffb300';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * this.size * 0.85, Math.sin(a) * this.size * 0.85);
      }
      ctx.stroke();
      
      ctx.restore();
    }
    else if (this.type === 'ignis_v') {
      ctx.save();
      const progress = this.life / this.maxLife;
      const alpha = Math.max(0, 1.0 - progress);
      const width = (this.beamWidth || 15) * (1.0 - progress * 0.5);
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff3300';
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      
      ctx.strokeStyle = 'rgba(255, 69, 0, ' + alpha + ')';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * 2000, this.y + this.vy * 2000);
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(255, 255, 230, ' + alpha + ')';
      ctx.lineWidth = width * 0.4;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * 2000, this.y + this.vy * 2000);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255, 234, 0, ' + alpha + ')';
      for (let i = 0; i < 15; i++) {
        const dist = Math.random() * 800;
        const px = this.x + this.vx * dist + (Math.random() * width - width / 2);
        const py = this.y + this.vy * dist + (Math.random() * width - width / 2);
        ctx.beginPath();
        ctx.arc(px, py, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    else if (this.type === 'marina_z') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00bfff';
      
      ctx.strokeStyle = '#e0f7fa';
      ctx.lineWidth = 1.5;
      
      const grad = ctx.createRadialGradient(-this.size * 0.2, -this.size * 0.2, this.size * 0.1, 0, 0, this.size);
      grad.addColorStop(0, 'rgba(224, 247, 250, 0.4)');
      grad.addColorStop(0.7, 'rgba(0, 191, 255, 0.15)');
      grad.addColorStop(1.0, 'rgba(0, 150, 136, 0.35)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-this.size * 0.3, -this.size * 0.3, this.size * 0.22, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    else if (this.type === 'marina_x') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#006097';
      
      ctx.strokeStyle = 'rgba(0, 191, 255, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-this.size * 1.2, 0, this.size * 0.6, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      
      ctx.fillStyle = '#0055aa';
      ctx.beginPath();
      ctx.moveTo(-this.size * 1.3, this.size * 0.3);
      ctx.quadraticCurveTo(this.size * 0.2, this.size * 0.7, this.size * 1.2, 0);
      ctx.quadraticCurveTo(0, -this.size * 1.1, -this.size * 0.9, -this.size * 0.3);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(-this.size * 1.5, -this.size * 0.2, 2.2, 0, Math.PI * 2);
      ctx.arc(-this.size * 1.7, this.size * 0.2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    else if (this.type === 'marina_c') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Date.now() * 0.006);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00bfff';
      
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 3; i++) {
        const r = this.size * (0.4 + i * 0.3);
        const alpha = 0.2 + i * 0.25;
        ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 1.5);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#ffffff';
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * Math.PI * 2 + Date.now() * 0.002;
        const dist = this.size * (0.35 + (j % 3) * 0.25);
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    else if (this.type === 'zephyr_z' || this.type === 'zephyr_v_small') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle + Date.now() * 0.02);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ff7f';
      ctx.fillStyle = 'rgba(0, 255, 127, 0.3)';
      ctx.strokeStyle = '#00ff7f';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(-this.size * 1.5, 0);
      ctx.quadraticCurveTo(0, -this.size * 0.7, this.size * 1.5, 0);
      ctx.quadraticCurveTo(0, this.size * 0.7, -this.size * 1.5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-this.size * 1.2, 0);
      ctx.lineTo(this.size * 1.2, 0);
      ctx.stroke();
      
      ctx.restore();
    }
    else if (this.type === 'zephyr_x') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Date.now() * 0.008);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ff7f';
      ctx.lineWidth = 2;
      
      const pulse = 1.0 + Math.sin(Date.now() * 0.01) * 0.1;
      const r = this.size * pulse;
      
      for (let i = 0; i < 3; i++) {
        const rad = r * (0.4 + i * 0.3);
        const alpha = 0.15 + i * 0.15;
        ctx.strokeStyle = `rgba(0, 255, 127, ${alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 1.6);
        ctx.stroke();
      }
      
      ctx.fillStyle = '#ffffff';
      for (let j = 0; j < 6; j++) {
        const angle = (j / 6) * Math.PI * 2 + Date.now() * 0.003;
        const px = Math.cos(angle) * r * 0.7;
        const py = Math.sin(angle) * r * 0.7;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    else if (this.type === 'zephyr_c') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(-Date.now() * 0.005);
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#7fffd4';
      
      const pulse = 1.0 + Math.sin(Date.now() * 0.015) * 0.12;
      const r = this.size * pulse;

      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        const rad = r * (0.35 + i * 0.22);
        const alpha = 0.1 + i * 0.2;
        ctx.strokeStyle = `rgba(127, 255, 212, ${alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 1.7);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0, 255, 127, 0.05)';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
    else if (this.type === 'tesla_z' || this.type === 'tesla_v_chain') {
      if (this.chainTargets && this.chainTargets.length > 0) {
        ctx.save();
        ctx.strokeStyle = this.type === 'tesla_v_chain' ? '#ffff55' : '#ffff00';
        ctx.lineWidth = this.type === 'tesla_v_chain' ? 2 : 3.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffff00';
        ctx.beginPath();

        let currentX = this.player.x;
        let currentY = this.player.y;

        ctx.moveTo(currentX, currentY);

        for (const target of this.chainTargets) {
          const steps = 3;
          const dx = (target.x - currentX) / steps;
          const dy = (target.y - currentY) / steps;

          for (let j = 1; j < steps; j++) {
            const px = currentX + dx * j + (Math.random() * 20 - 10);
            const py = currentY + dy * j + (Math.random() * 20 - 10);
            ctx.lineTo(px, py);
          }
          ctx.lineTo(target.x, target.y);
          currentX = target.x;
          currentY = target.y;
        }
        ctx.stroke();
        ctx.restore();
      }
    }
    else if (this.type === 'tesla_x') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Date.now() * 0.004);
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#ffff00';
      
      const r = this.size;
      const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.1);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#ffff33');
      grad.addColorStop(1.0, 'rgba(255, 255, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();

      if (this.zapTargets && this.zapTargets.length > 0) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffff00';
        
        for (const t of this.zapTargets) {
          if (t.dead) continue;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          
          const steps = 3;
          const dx = (t.x - this.x) / steps;
          const dy = (t.y - this.y) / steps;
          
          for (let j = 1; j < steps; j++) {
            const px = this.x + dx * j + (Math.random() * 12 - 6);
            const py = this.y + dy * j + (Math.random() * 12 - 6);
            ctx.lineTo(px, py);
          }
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        }
        ctx.restore();
      }
    }
    else if (this.type === 'tesla_x_shard') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffaa';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.moveTo(this.size * 2, 0);
      ctx.lineTo(-this.size, -this.size * 0.5);
      ctx.lineTo(-this.size * 0.3, 0);
      ctx.lineTo(-this.size, this.size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else if (this.type === 'tesla_c') {
      ctx.save();
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#4a00e0';
      ctx.strokeStyle = 'rgba(74, 0, 224, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(74, 0, 224, 0.04)';
      ctx.fill();

      ctx.fillStyle = 'rgba(25, 25, 112, 0.08)';
      for (let i = 0; i < 4; i++) {
        const cx = this.x + Math.sin(Date.now() * 0.001 + i) * (this.size * 0.3);
        const cy = this.y + Math.cos(Date.now() * 0.0012 + i) * (this.size * 0.3);
        ctx.beginPath();
        ctx.arc(cx, cy, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      if (this.lastStrike && this.lastStrike.timer > 0) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffff00';
        
        ctx.beginPath();
        let curX = this.lastStrike.x;
        let curY = this.lastStrike.y - 120;
        ctx.moveTo(curX, curY);

        const steps = 4;
        const dx = (this.lastStrike.x - curX) / steps;
        const dy = (this.lastStrike.y - curY) / steps;

        for (let j = 1; j < steps; j++) {
          const px = curX + dx * j + (Math.random() * 24 - 12);
          const py = curY + dy * j + (Math.random() * 10 - 5);
          ctx.lineTo(px, py);
        }
        ctx.lineTo(this.lastStrike.x, this.lastStrike.y);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.4)';
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.restore();
      }
    }
    else if (this.type === 'gaia_z') {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#8b5a2b';
      ctx.fillStyle = '#8b5a2b';
      ctx.strokeStyle = '#5c3a21';
      ctx.lineWidth = 1.5;

      for (let i = 0; i < this.path.length; i++) {
        const pt = this.path[i];
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(-7, 6);
        ctx.lineTo(7, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
    else if (this.type === 'wolf_c_crack') {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff3300';
      ctx.fillStyle = '#ff3300';
      ctx.strokeStyle = '#990000';
      ctx.lineWidth = 1.8;

      for (let i = 0; i < this.path.length; i++) {
        const pt = this.path[i];
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(-8, 7);
        ctx.lineTo(8, 7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
    else if (this.type === 'gaia_x') {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#228b22';
      ctx.strokeStyle = '#1d631d';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(34, 139, 34, 0.06)';
      ctx.fill();

      const branchCount = 6;
      for (let i = 0; i < branchCount; i++) {
        const angle = (i / branchCount) * Math.PI * 2 + (this.life * 0.002);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const cx1 = this.x + Math.cos(angle) * (this.size * 0.4) + Math.sin(angle * 3) * 12;
        const cy1 = this.y + Math.sin(angle) * (this.size * 0.4) + Math.cos(angle * 3) * 12;
        const tx = this.x + Math.cos(angle) * this.size;
        const ty = this.y + Math.sin(angle) * this.size;
        ctx.quadraticCurveTo(cx1, cy1, tx, ty);
        ctx.stroke();

        ctx.fillStyle = '#ff0055';
        const gx = this.x + Math.cos(angle) * (this.size * 0.7);
        const gy = this.y + Math.sin(angle) * (this.size * 0.7);
        ctx.beginPath();
        ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    else if (this.type === 'gaia_v') {
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#8b5a2b';
      ctx.strokeStyle = 'rgba(139, 90, 43, 0.55)';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(139, 90, 43, 0.08)';
      ctx.fill();

      ctx.strokeStyle = '#5c3a21';
      ctx.lineWidth = 2;
      const crackCount = 8;
      for (let i = 0; i < crackCount; i++) {
        const angle = (i / crackCount) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        let curX = this.x;
        let curY = this.y;
        const segmentCount = 3;
        for (let j = 1; j <= segmentCount; j++) {
          const segDist = (this.size / segmentCount) * j;
          const segAngle = angle + (Math.sin(j + this.life * 0.05) * 0.25);
          const targetX = this.x + Math.cos(segAngle) * segDist;
          const targetY = this.y + Math.sin(segAngle) * segDist;
          ctx.lineTo(targetX, targetY);
          curX = targetX;
          curY = targetY;
        }
        ctx.stroke();
      }
      ctx.restore();
    }
    else if (this.type === 'basic_gaia') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#8b5a2b';
      ctx.fillStyle = '#8b5a2b';
      ctx.strokeStyle = '#5c3a21';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#4a2f1c';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.6, -this.size * 0.2);
      ctx.lineTo(this.size * 0.5, this.size * 0.3);
      ctx.moveTo(-this.size * 0.2, this.size * 0.6);
      ctx.lineTo(this.size * 0.4, -this.size * 0.4);
      ctx.stroke();

      ctx.restore();
    }
    else if (this.type === 'basic_umbra') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#9d00ff';
      ctx.fillStyle = '#0f001f';
      ctx.strokeStyle = '#9d00ff';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-1.2, -1.2, this.size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
    else if (this.type === 'umbra_z') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#9d00ff';
      ctx.fillStyle = '#05000a';
      ctx.strokeStyle = '#4b0082';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#9d00ff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.65, Date.now() * 0.004, Date.now() * 0.004 + Math.PI);
      ctx.stroke();

      ctx.restore();
    }
    else if (this.type === 'umbra_x') {
      ctx.save();
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#9d00ff';
      ctx.strokeStyle = 'rgba(157, 0, 255, 0.4)';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(15, 0, 31, 0.65)';
      ctx.fill();

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Date.now() * 0.002);
      ctx.strokeStyle = '#4b0082';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const rad = this.size * (0.3 + i * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 1.5);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
    }
    else if (this.type === 'umbra_c') {
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#4b0082';
      ctx.strokeStyle = 'rgba(75, 0, 130, 0.35)';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(75, 0, 130, 0.08)';
      ctx.fill();

      ctx.fillStyle = 'rgba(157, 0, 255, 0.04)';
      for (let i = 0; i < 3; i++) {
        const cx = this.x + Math.sin(Date.now() * 0.001 + i) * 20;
        const cy = this.y - 12 + Math.cos(Date.now() * 0.0008 + i) * 10;
        ctx.beginPath();
        ctx.arc(cx, cy, this.size * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    else if (this.type === 'umbra_v_projectile') {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#ff0055';
      ctx.fillStyle = '#0f001f';
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(this.size * 2.5, 0);
      ctx.lineTo(-this.size * 1.2, -this.size * 0.95);
      ctx.lineTo(-this.size * 0.4, 0);
      ctx.lineTo(-this.size * 1.2, this.size * 0.95);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    else {
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  init3D() {
    this.mesh = new THREE.Group();
    
    const size = this.size || 5;
    const colorVal = this.color || '#ffffff';
    const matColor = new THREE.Color(colorVal);

    if (this.type === 'wolf_z') {
      this.wolfGroup = new THREE.Group();
      
      const torsoGeo = new THREE.BoxGeometry(6, 6, 12);
      const torsoMat = new THREE.MeshStandardMaterial({ color: 0x4f4f4f, roughness: 0.8 });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      torso.position.y = 5;
      torso.castShadow = true;
      this.wolfGroup.add(torso);
      this.torso = torso;

      const headGeo = new THREE.BoxGeometry(5, 5, 5);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x4f4f4f, roughness: 0.8 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(0, 4, 6);
      this.wolfGroup.add(head);
      this.head = head;

      const snoutGeo = new THREE.BoxGeometry(2, 2.2, 3);
      const snoutMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
      const snout = new THREE.Mesh(snoutGeo, snoutMat);
      snout.position.set(0, -1, 3);
      head.add(snout);

      const earGeo = new THREE.BoxGeometry(1.2, 2, 1.2);
      const leftEar = new THREE.Mesh(earGeo, torsoMat);
      leftEar.position.set(-1.8, 3, -1);
      head.add(leftEar);
      const rightEar = leftEar.clone();
      rightEar.position.set(1.8, 3, -1);
      head.add(rightEar);

      const eyeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const lvl = this.player.spellLevels[0] || 1;
      const eyeMat = new THREE.MeshBasicMaterial({ color: lvl >= 5 ? 0xff0000 : 0xffffff });
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-1.8, 1, 2.2);
      head.add(leftEye);
      const rightEye = leftEye.clone();
      rightEye.position.set(1.8, 1, 2.2);
      head.add(rightEye);

      const legGeo = new THREE.BoxGeometry(1.8, 5, 1.8);
      this.legLF = new THREE.Mesh(legGeo, torsoMat);
      this.legLF.position.set(-2, -3.5, 4.5);
      torso.add(this.legLF);

      this.legRF = new THREE.Mesh(legGeo, torsoMat);
      this.legRF.position.set(2, -3.5, 4.5);
      torso.add(this.legRF);

      this.legLB = new THREE.Mesh(legGeo, torsoMat);
      this.legLB.position.set(-2, -3.5, -4.5);
      torso.add(this.legLB);

      this.legRB = new THREE.Mesh(legGeo, torsoMat);
      this.legRB.position.set(2, -3.5, -4.5);
      torso.add(this.legRB);

      const tailGeo = new THREE.BoxGeometry(1.5, 1.5, 5);
      const tail = new THREE.Mesh(tailGeo, torsoMat);
      tail.position.set(0, 1.5, -7);
      tail.rotation.x = -Math.PI / 6;
      torso.add(tail);

      this.mesh.add(this.wolfGroup);
      
    } else if (this.type.includes('fire') || this.type.includes('magma') || this.type === 'ignis_z' || this.type === 'ignis_x' || this.type === 'ignis_c' || this.type === 'ignis_c_small' || this.type === 'pet_dragon_projectile') {
      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: matColor });
      const sphere = new THREE.Mesh(geo, mat);
      this.mesh.add(sphere);
      this.sphereMesh = sphere;
      
    } else if (this.type.includes('water') || this.type.includes('ice') || this.type.includes('slime') || this.type === 'marina_z' || this.type === 'marina_x' || this.type === 'marina_c') {
      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshStandardMaterial({ color: matColor, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.8 });
      const sphere = new THREE.Mesh(geo, mat);
      this.mesh.add(sphere);
      
    } else if (this.type.includes('wind') || this.type.includes('zephyr')) {
      const torusGeo = new THREE.TorusGeometry(size, size * 0.25, 8, 16);
      const mat = new THREE.MeshBasicMaterial({ color: matColor });
      const torus = new THREE.Mesh(torusGeo, mat);
      torus.rotation.x = Math.PI / 2;
      this.mesh.add(torus);
      this.torusMesh = torus;
      
    } else if (this.type.includes('lightning') || this.type.includes('tesla')) {
      const geo = new THREE.CylinderGeometry(size * 0.2, size * 0.2, size * 2, 8);
      const mat = new THREE.MeshBasicMaterial({ color: matColor });
      const cyl = new THREE.Mesh(geo, mat);
      cyl.rotation.z = Math.PI / 2;
      this.mesh.add(cyl);
      
    } else if (this.type.includes('frost') || this.type.includes('shard')) {
      const geo = new THREE.OctahedronGeometry(size, 0);
      const mat = new THREE.MeshStandardMaterial({ color: matColor, roughness: 0.1 });
      const oct = new THREE.Mesh(geo, mat);
      this.mesh.add(oct);
      
    } else if (this.type.includes('wood') || this.type.includes('gaia')) {
      const geo = new THREE.BoxGeometry(size * 1.5, size * 1.5, size * 1.5);
      const mat = new THREE.MeshStandardMaterial({ color: matColor, roughness: 0.8 });
      const box = new THREE.Mesh(geo, mat);
      this.mesh.add(box);
      
    } else if (this.type.includes('umbra')) {
      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: matColor });
      const sphere = new THREE.Mesh(geo, mat);
      this.mesh.add(sphere);
      
    } else if (this.type.includes('chronos')) {
      const geo = new THREE.SphereGeometry(size, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: matColor });
      const sphere = new THREE.Mesh(geo, mat);
      this.mesh.add(sphere);
      
    } else {
      const geo = new THREE.SphereGeometry(size || 4, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: matColor });
      const sphere = new THREE.Mesh(geo, mat);
      this.mesh.add(sphere);
    }
    
    let yPos = 12;
    if (this.type === 'magma_patch' || this.type === 'umbra_x' || this.type === 'gaia_v' || this.type === 'frost_v') {
      yPos = 0.5;
    }
    this.mesh.position.set(this.x, yPos, this.y);
    window.scene3D.add(this.mesh);
  }

  update3D() {
    if (!this.mesh) return;

    let yPos = 12;
    if (this.type === 'magma_patch' || this.type === 'umbra_x' || this.type === 'gaia_v' || this.type === 'frost_v') {
      yPos = 0.5;
    }
    this.mesh.position.set(this.x, yPos, this.y);

    if (this.type === 'wolf_z') {
      this.wolfGroup.rotation.y = -this.angle - Math.PI / 2;
      const swing = Math.sin(this.life * 0.4) * 0.7;
      if (this.legLF) {
        this.legLF.rotation.x = swing;
        this.legRF.rotation.x = -swing;
        this.legLB.rotation.x = -swing;
        this.legRB.rotation.x = swing;
      }
      if (this.head) {
        this.head.rotation.x = Math.sin(this.life * 0.2) * 0.15;
      }
    } 
    else if (this.torusMesh) {
      this.torusMesh.rotation.z += 0.05;
    } 
    else if (this.sphereMesh) {
      const pulse = 1.0 + Math.sin(this.life * 0.2) * 0.1;
      this.sphereMesh.scale.set(pulse, pulse, pulse);
    }
  }

  destroy3D() {
    if (this.mesh && window.scene3D) {
      window.scene3D.remove(this.mesh);
    }
  }
}
