class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 14;
    this.angle = -Math.PI / 2;

    this.vx = 0;
    this.vy = 0;
    this.friction = 0.86;

    this.level = 1;
    this.xp = 0;
    this.xpNeeded = 10;
    this.kills = 0;
    this.score = 0;

    // Load character-specific stats
    const char = CHARACTERS[gameCtx.currentCharacter] || CHARACTERS['ignis'];
    this.characterKey = gameCtx.currentCharacter;
    this.name = char.name;

    const wizardUpgrades = currentSaveData.wizardUpgrades || {};
    const charUpgrades = wizardUpgrades[this.characterKey] || { hp: 0, damage: 0, speed: 0 };
    const lvlHp = charUpgrades.hp || 0;
    const lvlDmg = charUpgrades.damage || 0;
    const lvlSpd = charUpgrades.speed || 0;

    this.maxHp = char.stats.maxHp + lvlHp * 10;
    this.speed = char.stats.speed + lvlSpd * 0.15;
    this.damageModifier = char.stats.damageModifier + lvlDmg * 0.10;
    this.cooldownModifier = char.stats.cooldownModifier;
    this.magnetRadius = char.stats.magnetRadius;
    this.critChance = char.stats.critChance;
    this.spellRangeModifier = char.stats.spellRangeModifier || 1.0;
    this.doubleCastChance = char.stats.doubleCastChance || 0.0;

    // Áp dụng thuộc tính gia tăng từ bảo vật được trang bị
    const equipped = currentSaveData.equippedAccessories || {};
    if (equipped.stat === 'boots_zephyr') {
      this.speed += 0.45;
    }
    if (equipped.stat === 'pendant_magnet') {
      this.magnetRadius += 45;
    }
    if (equipped.stat === 'ring_diamond') {
      this.damageModifier += 0.20;
    }
    if (equipped.stat === 'shield_paladin') {
      this.maxHp += 25;
    }
    if (equipped.stat === 'hourglass_time') {
      this.cooldownModifier = Math.max(0.2, this.cooldownModifier - 0.12);
    }
    if (equipped.stat === 'clover_luck') {
      this.critChance += 0.08;
    }

    this.hp = this.maxHp;
    this.hunger = 100;
    this.wood = 100;
    this.stone = 100;
    this.iron = 100;
    this.gold_ore = 50;
    this.diamond_ore = 50;
    this.equippedGun = null;
    this.equippedTool = null;
    this.dashCooldown = 0;
    this.dashTimer = 0;
    this.dashAngle = 0;

    this.spells = [...char.spells]; // array of 4 spell keys
    this.spellLevels = [1, 0, 0, 0]; // Z, X, C, V levels (0 means locked)
    this.spellCooldowns = [0, 0, 0, 0]; // Z, X, C, V cooldowns

    if (char.startElement === 'fire') this.basicAttackType = 'basic_fire';
    else if (char.startElement === 'water') this.basicAttackType = 'basic_water';
    else if (char.startElement === 'wind') this.basicAttackType = 'basic_wind';
    else if (char.startElement === 'lightning') this.basicAttackType = 'basic_lightning';
    else if (char.startElement === 'ice') this.basicAttackType = 'basic_ice';
    else if (char.startElement === 'magma') this.basicAttackType = 'basic_magma';
    else if (char.startElement === 'creation') this.basicAttackType = 'basic_creation';
    else if (char.startElement === 'wolf') this.basicAttackType = 'basic_wolf';
    else if (char.startElement === 'gaia') this.basicAttackType = 'basic_gaia';
    else if (char.startElement === 'umbra') this.basicAttackType = 'basic_umbra';
    else this.basicAttackType = 'basic_fire';

    this.basicAttackTimer = 0;

    // Upgrades mapping
    this.upgrades = {};
    this.spellSizeModifier = 1.0;
    this.wispCount = 0;
    this.wispShootTimer = 0;

    this.isInvulnerable = false;
    this.invulnTimer = 0;
    this.invulnDuration = 35;

    this.burnTimer = 0; // Trạng thái cháy do dẫm dung nham
    this.rage = 0;
    this.maxRage = 100;
    this.lycanTransformActive = false;
    this.lycanTransformTimer = 0;

    // Spell charging and sequences
    this.dragonBreathQueue = 0;
    this.dragonBreathTimer = 0;
    this.spellCharges = [0, 0, 0, 0];
    this.isChargingSpell = [false, false, false, false];
    
    // Marina Shield properties
    this.waterShieldOrbs = 0;
    this.waterShieldTimer = 0;

    // Gaia Shield properties
    this.gaiaShieldOrbs = 0;

    // Umbra transform properties
    this.umbraTransformActive = false;
    this.umbraTransformTimer = 0;

    // Zephyr Wind Wings properties
    this.windWingsActive = false;
    this.windWingsTimer = 0;
    this.windWingsSpawnTimer = 0;

    this.teslaOverloadActive = false;
    this.teslaOverloadTimer = 0;

    this.lastSpellCastFrame = 0; // Tracks the last frame a spell was cast for Global Cooldown (GCD)
    if (window.scene3D) {
      this.init3D();
    }
  }

  gainXP(amount) {
    this.xp += amount;
    if (this.xp >= this.xpNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.xp -= this.xpNeeded;
    this.level++;
    this.xpNeeded = Math.round(this.level * 8 + 5);
    
    // Tự động mở khóa các chiêu thức theo cấp độ: Lv 2 mở X, Lv 3 mở C, Lv 4 mở V
    if (this.level === 2 && this.spellLevels[1] === 0) {
      this.spellLevels[1] = 1;
      this.updateHUD();
    } else if (this.level === 3 && this.spellLevels[2] === 0) {
      this.spellLevels[2] = 1;
      this.updateHUD();
    } else if (this.level === 4 && this.spellLevels[3] === 0) {
      this.spellLevels[3] = 1;
      this.updateHUD();
    }
    
    soundManager.playLevelUp();
    particleManager.createShockwave(this.x, this.y, '#ffff00', 55);

    const event = new CustomEvent('player-levelup');
    window.dispatchEvent(event);
  }

  takeDamage(amount) {
    if (this.isInvulnerable) return;

    if (this.waterShieldOrbs > 0) {
      this.waterShieldOrbs--;
      soundManager.playHit();
      particleManager.createWaterParticles(this.x, this.y, 10);
      
      // Reflect 50 damage to the nearest enemy
      let nearest = null;
      let minDist = Infinity;
      for (const e of gameCtx.enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = e;
        }
      }
      if (nearest) {
        nearest.takeDamage(50);
        particleManager.createWaterParticles(nearest.x, nearest.y, 6);
      }
      return; // Block damage
    }

    let dmg = amount;
    if (this.characterKey === 'wolf' && this.lycanTransformActive) {
      dmg *= 0.3; // Giảm 70% sát thương nhận vào từ mọi nguồn
    }

    this.hp = Math.max(0, this.hp - dmg);
    this.isInvulnerable = true;
    this.invulnTimer = 0;
    
    soundManager.playHit();
    particleManager.createExplosion(this.x, this.y, '#ff4500', 12, 4);
    particleManager.triggerShake(10);

    if (this.characterKey === 'wolf') {
      this.gainRage(6.0); // Nhận sát thương tăng +6.0 nộ
    }
  }

  gainRage(amount) {
    if (this.characterKey !== 'wolf') return;
    if (this.lycanTransformActive) return; // Không tăng nộ khi hóa sói
    this.rage = Math.min(this.maxRage, this.rage + amount);
    this.updateHUD();
  }

  takeLavaBurn() {
    if (gameCtx.gameTime % 10 === 0) {
      this.hp = Math.max(0, this.hp - 1.5);
      soundManager.playHit();
      particleManager.addParticle(this.x, this.y, '#ff4500', Math.random() * 2 + 1, Math.random() * 2.5 + 1, Math.random() * Math.PI * 2, 0.08);
    }
    this.burnTimer = 120;
  }

  update(keys, mouse, enemies, playerSpells) {
    const equipped = currentSaveData.equippedAccessories || {};

    if (this.isInvulnerable) {
      this.invulnTimer++;
      if (this.invulnTimer >= this.invulnDuration) {
        this.isInvulnerable = false;
      }
    }

    if (this.burnTimer > 0) {
      this.burnTimer--;
      if (this.burnTimer % 15 === 0) {
        this.hp = Math.max(0, this.hp - 1.2);
        particleManager.addParticle(
          this.x + (Math.random() * 10 - 5), 
          this.y + (Math.random() * 10 - 5), 
          '#ff8c00', 
          Math.random() * 1.5 + 1, 
          Math.random() * 1.2, 
          -Math.PI / 2 + (Math.random() * 0.4 - 0.2), 
          0.04
        );
      }
    }

    // Marina Passive: heal 0.35 HP every second (60 frames)
    if (this.characterKey === 'marina' && this.hp < this.maxHp) {
      if (gameCtx.gameTime % 60 === 0) {
        this.hp = Math.min(this.maxHp, this.hp + 0.35);
      }
    }

    // Bùa Phượng Hoàng: hồi 0.2 HP mỗi giây
    if (equipped.stat === 'amulet_phoenix' && this.hp < this.maxHp) {
      if (gameCtx.gameTime % 60 === 0) {
        this.hp = Math.min(this.maxHp, this.hp + 0.2);
      }
    }

    // Zephyr Wind Wings timer update
    if (this.windWingsActive) {
      this.windWingsTimer--;
      if (this.windWingsTimer <= 0) {
        this.windWingsActive = false;
      }
    }

    // Tesla Overload timer update
    if (this.teslaOverloadActive) {
      this.teslaOverloadTimer--;
      if (this.teslaOverloadTimer <= 0) {
        this.teslaOverloadActive = false;
      }
    }

    // Lycan Transform timer update & decay
    if (this.lycanTransformActive) {
      this.lycanTransformTimer--;
      const maxDur = 480 + (this.spellLevels[3] - 1) * 120;
      this.rage = Math.max(0, (this.lycanTransformTimer / maxDur) * 100);
      if (this.lycanTransformTimer <= 0) {
        this.lycanTransformActive = false;
        this.rage = 0;
        this.updateHUD();
      }
    }

    // Recalculate damageModifier dynamically based on character base, upgrades, and transformation
    const baseDamageMod = (CHARACTERS[this.characterKey] || CHARACTERS['ignis']).stats.damageModifier;
    let targetDamageMod = baseDamageMod + (this.upgrades.damage || 0) * 0.15;
    if (equipped.stat === 'ring_diamond') {
      targetDamageMod += 0.20;
    }
    if (this.characterKey === 'wolf' && this.lycanTransformActive) {
      targetDamageMod *= 2.2; // +120% sát thương khi hóa sói
    }
    if (this.characterKey === 'umbra' && this.umbraTransformActive) {
      targetDamageMod *= 1.8; // +80% sát thương khi hóa hắc thần
    }
    this.damageModifier = targetDamageMod;

    // Umbra Transform timer update & decay
    if (this.umbraTransformActive) {
      this.umbraTransformTimer--;
      if (this.umbraTransformTimer <= 0) {
        this.umbraTransformActive = false;
        this.updateHUD();
      }
    }

    // Gaia Shield Collision Check
    if (this.gaiaShieldOrbs > 0) {
      for (const e of enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < this.size + e.size + 18) {
          this.gaiaShieldOrbs--;
          let dmg = 120 * (1.0 + (this.spellLevels[2] - 1) * 0.25) * this.damageModifier;
          if (Math.random() < this.critChance) dmg *= 2;
          e.takeDamage(dmg);
          
          const pushAngle = Math.atan2(e.y - this.y, e.x - this.x);
          e.x += Math.cos(pushAngle) * 55;
          e.y += Math.sin(pushAngle) * 55;
          
          soundManager.playHit();
          particleManager.createExplosion(e.x, e.y, '#8b5a2b', 12, 4);
          
          if (this.gaiaShieldOrbs <= 0) break;
        }
      }
    }

    // Tesla Overload crit recalculation
    let targetCrit = (CHARACTERS[this.characterKey] || CHARACTERS['ignis']).stats.critChance + (this.upgrades.crit || 0) * 0.08;
    if (this.teslaOverloadActive) {
      targetCrit += 0.50;
    }
    this.critChance = targetCrit;

    let dx = 0;
    let dy = 0;
    if (keys['w'] || keys['arrowup']) dy -= 1;
    if (keys['s'] || keys['arrowdown']) dy += 1;
    if (keys['a'] || keys['arrowleft']) dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    let currentSpeed = this.speed;
    if (this.windWingsActive) {
      currentSpeed *= 1.4;
    }
    if (this.characterKey === 'wolf' && this.lycanTransformActive) {
      currentSpeed *= 1.65;
    }
    if (this.characterKey === 'umbra' && this.umbraTransformActive) {
      currentSpeed *= 1.55; // +55% tốc chạy khi hóa hắc thần
    }

    this.vx += dx * (currentSpeed * 0.12);
    this.vy += dy * (currentSpeed * 0.12);

    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;

    if (Math.hypot(this.vx, this.vy) > 0.4) {
      const char = CHARACTERS[this.characterKey] || CHARACTERS['ignis'];
      particleManager.createPlayerTrail(this.x, this.y, [char.startElement]);
    }

    // Zephyr Wind Wings auto shoot small tornadoes
    if (this.windWingsActive && (dx !== 0 || dy !== 0)) {
      this.windWingsSpawnTimer--;
      if (this.windWingsSpawnTimer <= 0) {
        const lvl = this.spellLevels[3] || 1;
        const spawnInterval = Math.max(6, 15 - (lvl - 1) * 3);
        this.windWingsSpawnTimer = spawnInterval;
        let targetEnemy = null;
        let minDist = Infinity;
        for (const e of enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.x, e.y - this.y);
          if (dist < minDist) {
            minDist = dist;
            targetEnemy = e;
          }
        }
        const tx = targetEnemy ? targetEnemy.x : this.x + Math.cos(this.angle) * 100;
        const ty = targetEnemy ? targetEnemy.y : this.y + Math.sin(this.angle) * 100;
        playerSpells.push(new Spell(this.x, this.y, tx, ty, 'zephyr_v_small', this));
        soundManager.playSpell('wind_wind');
      }
    }

    this.angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);

    // Reduce basic attack timer
    if (this.basicAttackTimer > 0) {
      this.basicAttackTimer--;
    }

    // Pet behaviors: shooting & healing
    if (equipped.pet) {
      this.petAngle = (this.petAngle || 0) + 0.055;
      const bob = Math.sin(Date.now() * 0.005) * 4;
      this.petX = this.x + Math.cos(this.petAngle) * 32;
      this.petY = this.y + Math.sin(this.petAngle) * 32 + bob;
      
      this.petActionTimer = (this.petActionTimer || 0) + 1;
      if (equipped.pet === 'pet_dragon' && this.petActionTimer % 90 === 0 && enemies.length > 0) {
        let nearest = null;
        let minDist = Infinity;
        for (const e of enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.petX, e.y - this.petY);
          if (dist < minDist) {
            minDist = dist;
            nearest = e;
          }
        }
        if (nearest && minDist < 350) {
          playerSpells.push(new Spell(this.petX, this.petY, nearest.x, nearest.y, 'pet_dragon_projectile', this));
        }
      }
      else if (equipped.pet === 'pet_slime' && this.petActionTimer % 90 === 0 && enemies.length > 0) {
        let nearest = null;
        let minDist = Infinity;
        for (const e of enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.petX, e.y - this.petY);
          if (dist < minDist) {
            minDist = dist;
            nearest = e;
          }
        }
        if (nearest && minDist < 350) {
          playerSpells.push(new Spell(this.petX, this.petY, nearest.x, nearest.y, 'pet_slime_projectile', this));
        }
      }
      else if (equipped.pet === 'pet_fairy' && this.petActionTimer % 300 === 0 && this.hp < this.maxHp) {
        this.hp = Math.min(this.maxHp, this.hp + 3);
        for (let i = 0; i < 6; i++) {
          const angle = Math.random() * Math.PI * 2;
          particleManager.addParticle(this.x, this.y, '#ffe600', Math.random()*2+1, 1, angle, 0.05);
        }
      }
    }

    // Reduce spell cooldown timers
    for (let i = 0; i < 4; i++) {
      if (this.spellCooldowns[i] > 0) {
        this.spellCooldowns[i]--;
      }
    }

    // Ignis Z Dragon Breath burst sequence firing
    if (this.dragonBreathQueue > 0) {
      this.dragonBreathTimer--;
      if (this.dragonBreathTimer <= 0) {
        this.dragonBreathQueue--;
        this.dragonBreathTimer = 4; // 4 frame interval
        playerSpells.push(new Spell(this.x, this.y, mouse.x, mouse.y, 'ignis_z', this));
      }
    }

    // Marina Shield timer update
    if (this.waterShieldOrbs > 0) {
      this.waterShieldTimer--;
      if (this.waterShieldTimer <= 0) {
        this.waterShieldOrbs = 0;
      }
    }

    // Basic Attack: holding Left Click shoots towards mouse (or fires equipped gun)
    if (mouse.clicked && this.basicAttackTimer <= 0) {
      if (this.equippedGun) {
        this.fireEquippedGun(playerSpells, mouse.x, mouse.y);
        let gunCD = 15;
        if (this.equippedGun === 'rifle') gunCD = 7;
        else if (this.equippedGun === 'shotgun') gunCD = 35;
        this.basicAttackTimer = Math.max(2, gunCD * this.cooldownModifier);
      } else {
        this.castBasicAttack(playerSpells, mouse.x, mouse.y);
        const baseCD = SPELL_RECIPES[this.basicAttackType].cd || 20;
        this.basicAttackTimer = Math.max(4, baseCD * this.cooldownModifier);
      }
    }

    // Z, X, C, V Cast: Z is index 0, X is 1, C is 2, V is 3
    const spellKeys = ['z', 'x', 'c', 'v'];
    const currentlyChargingIndex = this.isChargingSpell.indexOf(true);
    const hasGCDActive = (gameCtx.gameTime - (this.lastSpellCastFrame || 0) < 35);
    let spellActionTaken = false;

    for (let i = 0; i < 4; i++) {
      const key = spellKeys[i];
      const spellKey = this.spells[i];
      const isHoldToCharge = (this.characterKey === 'ignis' && (spellKey === 'ignis_x' || spellKey === 'ignis_v'));

      if (isHoldToCharge) {
        // If another spell is already charging, ignore this hold-to-charge spell
        if (currentlyChargingIndex !== -1 && currentlyChargingIndex !== i) {
          continue;
        }

        // Hold to charge logic
        // We can only start charging if no GCD is active
        const canStartCharge = this.isChargingSpell[i] || !hasGCDActive;

        if (keys[key] && this.spellLevels[i] > 0 && this.spellCooldowns[i] <= 0 && !spellActionTaken && canStartCharge) {
          if (!this.isChargingSpell[i]) {
            this.isChargingSpell[i] = true;
            this.spellCharges[i] = 0;
          }
          this.spellCharges[i] = Math.min(60, this.spellCharges[i] + 1);
          spellActionTaken = true;

          // Spawn particle effects for charging
          if (Math.random() < 0.35) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 32 + Math.random() * 18;
            const px = this.x + Math.cos(angle) * dist;
            const py = this.y + Math.sin(angle) * dist;
            const pAngle = Math.atan2(this.y - py, this.x - px);
            const pColor = spellKey === 'ignis_x' ? '#ff4500' : '#ffff00';
            particleManager.addParticle(px, py, pColor, Math.random() * 2 + 1, 1.5, pAngle, 0.04, 0.96);
          }
        } else {
          // Key released or not pressed
          if (this.isChargingSpell[i]) {
            this.castChargedSpell(playerSpells, mouse.x, mouse.y, i, this.spellCharges[i]);
            this.spellCooldowns[i] = getActualSpellCD(this, i);
            this.isChargingSpell[i] = false;
            this.spellCharges[i] = 0;
            this.lastSpellCastFrame = gameCtx.gameTime; // Trigger GCD on release
            spellActionTaken = true;
          }
        }
      } else {
        // Normal instant-cast spells
        // If a spell is currently charging, we cannot cast instant spells
        if (currentlyChargingIndex !== -1) {
          continue;
        }

        // We can only cast if no GCD is active
        let canCast = true;
        if (this.characterKey === 'wolf' && i === 3) {
          canCast = (this.rage >= 100 && !this.lycanTransformActive);
        } else {
          canCast = (this.spellCooldowns[i] <= 0);
        }

        if (keys[key] && this.spellLevels[i] > 0 && canCast && !spellActionTaken && !hasGCDActive) {
          this.castIndividualSpell(playerSpells, mouse.x, mouse.y, i);
          if (this.characterKey === 'wolf' && i === 3) {
            this.spellCooldowns[i] = 0;
          } else {
            this.spellCooldowns[i] = getActualSpellCD(this, i);
          }
          this.lastSpellCastFrame = gameCtx.gameTime; // Trigger GCD
          spellActionTaken = true;
        }
      }
    }

    // Cơ chế bắn phép tự động của Hỏa Tinh Hộ Mệnh
    if (this.wispCount > 0 && enemies.length > 0) {
      this.wispShootTimer++;
      if (this.wispShootTimer >= 45) {
        this.wispShootTimer = 0;
        this.fireWisps(playerSpells, enemies);
      }
    }
    this.update3D(gameCtx.gameTime);
  }

  fireWisps(playerSpells, enemies) {
    const orbitRadius = 40;
    const speed = Date.now() * 0.003;
    const char = CHARACTERS[this.characterKey] || CHARACTERS['ignis'];
    const wispSpell = char.startElement; 
    
    for (let i = 0; i < this.wispCount; i++) {
      const angle = speed + (i / this.wispCount) * Math.PI * 2;
      const wx = this.x + Math.cos(angle) * orbitRadius;
      const wy = this.y + Math.sin(angle) * orbitRadius;

      let nearest = null;
      let minDist = Infinity;
      for (const e of enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - wx, e.y - wy);
        if (dist < minDist) {
          minDist = dist;
          nearest = e;
        }
      }

      if (nearest) {
        playerSpells.push(new Spell(wx, wy, nearest.x, nearest.y, wispSpell, this));
      }
    }
  }

  castBasicAttack(playerSpells, targetX, targetY) {
    soundManager.playSpell('none');
    
    const targetAngle = this.angle;
    const colors = {
      'basic_fire': '#ff4500',
      'basic_water': '#00bfff',
      'basic_wind': '#00ff7f',
      'basic_lightning': '#ffff00',
      'basic_ice': '#8fa0dd',
      'basic_magma': '#ff3300',
      'basic_creation': '#ffe600',
      'basic_wolf': '#ff003c',
      'claw_melee': '#ff3300',
      'basic_gaia': '#8b5a2b',
      'basic_umbra': '#9d00ff',
      'umbra_v_projectile': '#ff0055'
    };
    
    let attackType = this.basicAttackType;
    if (this.characterKey === 'wolf' && this.lycanTransformActive) {
      attackType = 'claw_melee';
    }
    if (this.characterKey === 'umbra' && this.umbraTransformActive) {
      attackType = 'umbra_v_projectile';
    }

    const color = colors[attackType] || '#ffffff';
    for (let i = 0; i < 4; i++) {
      const sprayAngle = targetAngle + (Math.random() * 0.4 - 0.2);
      const speed = Math.random() * 3 + 2;
      const size = Math.random() * 2 + 1;
      const decay = Math.random() * 0.05 + 0.03;
      particleManager.addParticle(
        this.x + Math.cos(targetAngle) * this.size * 1.5,
        this.y + Math.sin(targetAngle) * this.size * 1.5,
        color,
        size,
        speed,
        sprayAngle,
        decay,
        0.92
      );
    }

    if (attackType === 'basic_creation') {
      // Rework: Genesis bắn 3 tia tinh tú cùng lúc bay uốn lượn, tự động homing mạnh mẽ
      for (let i = -1; i <= 1; i++) {
        const spreadAngle = targetAngle + i * 0.22;
        const tx = this.x + Math.cos(spreadAngle) * 100;
        const ty = this.y + Math.sin(spreadAngle) * 100;
        const s = new Spell(this.x, this.y, tx, ty, 'basic_creation', this);
        s.waveOffset = i * Math.PI / 2; // Tạo lệch pha để các đạn uốn lượn sóng so le
        playerSpells.push(s);
      }
    } else {
      playerSpells.push(new Spell(this.x, this.y, targetX, targetY, attackType, this));
    }

    if (this.teslaOverloadActive) {
      let nearest = null;
      let minDist = Infinity;
      for (const e of gameCtx.enemies) {
        if (e.dead) continue;
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = e;
        }
      }
      if (nearest) {
        playerSpells.push(new Spell(this.x, this.y, nearest.x, nearest.y, 'tesla_v_chain', this));
      }
    }
  }

  fireEquippedGun(playerSpells, targetX, targetY) {
    if (!this.equippedGun) return;
    
    const targetAngle = this.angle;
    
    if (this.equippedGun === 'handgun') {
      soundManager.playSpell('none');
      playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'gun_handgun', this));
      
      // Flash effect
      particleManager.addParticle(
        this.x + Math.cos(targetAngle) * this.size * 1.5,
        this.y + Math.sin(targetAngle) * this.size * 1.5,
        '#00f3ff',
        3, 4, targetAngle + (Math.random() * 0.2 - 0.1), 0.1
      );
    } else if (this.equippedGun === 'rifle') {
      soundManager.playSpell('none');
      playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'gun_rifle', this));
      
      // Flash effect
      particleManager.addParticle(
        this.x + Math.cos(targetAngle) * this.size * 1.5,
        this.y + Math.sin(targetAngle) * this.size * 1.5,
        '#ff4500',
        2.5, 5, targetAngle + (Math.random() * 0.3 - 0.15), 0.12
      );
    } else if (this.equippedGun === 'shotgun') {
      soundManager.playSpell('none');
      // Fire 5 pellets in a spread
      const spread = 0.15; // angle spread
      for (let i = -2; i <= 2; i++) {
        const angleOffset = i * spread;
        const tx = this.x + Math.cos(targetAngle + angleOffset) * 100;
        const ty = this.y + Math.sin(targetAngle + angleOffset) * 100;
        playerSpells.push(new Spell(this.x, this.y, tx, ty, 'gun_shotgun', this));
      }
      
      // Big flash
      for (let i = 0; i < 8; i++) {
        particleManager.addParticle(
          this.x + Math.cos(targetAngle) * this.size * 1.5,
          this.y + Math.sin(targetAngle) * this.size * 1.5,
          '#ffe600',
          3, 3 + Math.random() * 3, targetAngle + (Math.random() * 0.6 - 0.3), 0.08
        );
      }
      particleManager.triggerShake(4);
    }
  }

  castChargedSpell(playerSpells, targetX, targetY, spellIndex, chargeAmount) {
    const spellKey = this.spells[spellIndex];
    soundManager.playSpell(spellKey);

    if (spellKey === 'ignis_x') {
      particleManager.triggerShake(5);
      const chargeRatio = chargeAmount / 60; // 0 to 1
      const s = new Spell(this.x, this.y, targetX, targetY, 'ignis_x', this);
      s.chargeRatio = chargeRatio;
      s.size = (10 + chargeRatio * 20) * (this.spellSizeModifier || 1.0);
      s.damage = 60 * (1.0 + chargeRatio * 0.5); // extra damage for full charge
      playerSpells.push(s);
    } else if (spellKey === 'ignis_v') {
      particleManager.triggerShake(10);
      const chargeRatio = chargeAmount / 60; // 0 to 1
      const s = new Spell(this.x, this.y, targetX, targetY, 'ignis_v', this);
      s.chargeRatio = chargeRatio;
      playerSpells.push(s);
    }
  }

  castIndividualSpell(playerSpells, targetX, targetY, spellIndex) {
    const spellKey = this.spells[spellIndex];
    soundManager.playSpell(spellKey);

    if (spellKey === 'fire_lightning' || spellKey === 'fire_explosion' || spellKey === 'magma_magma' || spellKey === 'ignis_c') {
      particleManager.triggerShake(5);
    }

    const targetAngle = this.angle;
    const colors = {
      'fire': '#ff4500',
      'water': '#00bfff',
      'lightning': '#ffff00',
      'wind': '#00ff7f',
      'wood': '#2e8b57',
      'magma': '#ff3300',
      'gaia': '#8b5a2b',
      'umbra': '#9d00ff',
      'none': '#ffffff'
    };
    
    let color = '#ffffff';
    if (spellKey.startsWith('fire') || spellKey.startsWith('ignis_')) color = colors['fire'];
    else if (spellKey.startsWith('water') || spellKey.startsWith('ice') || spellKey.startsWith('marina_')) color = colors['water'];
    else if (spellKey.startsWith('lightning')) color = colors['lightning'];
    else if (spellKey.startsWith('wind')) color = colors['wind'];
    else if (spellKey.startsWith('magma')) color = colors['magma'];
    else if (spellKey.startsWith('wood')) color = colors['wood'];
    else if (spellKey.startsWith('gaia_')) color = colors['gaia'];
    else if (spellKey.startsWith('umbra_')) color = colors['umbra'];

    for (let i = 0; i < 6; i++) {
      const sprayAngle = targetAngle + (Math.random() * 0.5 - 0.25);
      const speed = Math.random() * 4 + 2;
      const size = Math.random() * 2 + 1;
      const decay = Math.random() * 0.04 + 0.03;
      particleManager.addParticle(
        this.x + Math.cos(targetAngle) * this.size * 1.5,
        this.y + Math.sin(targetAngle) * this.size * 1.5,
        color,
        size,
        speed,
        sprayAngle,
        decay,
        0.92
      );
    }

    const createSpellInstance = () => {
      if (spellKey === 'ignis_z') {
        this.dragonBreathQueue = 4;
        this.dragonBreathTimer = 0;
      }
      else if (spellKey === 'marina_v') {
        const lvl = this.spellLevels[spellIndex];
        const extraSecs = (lvl - 1) * 2;
        this.waterShieldOrbs = 6;
        this.waterShieldTimer = 600 + extraSecs * 60; // 10s base + 2s per level above 1
        
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          particleManager.addParticle(this.x, this.y, '#00bfff', Math.random() * 3 + 2, Math.random() * 3 + 1, angle, 0.03);
        }
      }
      else if (spellKey === 'marina_c') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'marina_c', this));
      }
      else if (spellKey === 'water_water') {
        const shardCount = 8;
        for (let i = 0; i < shardCount; i++) {
          const angle = (i / shardCount) * Math.PI * 2;
          const tx = this.x + Math.cos(angle) * 100;
          const ty = this.y + Math.sin(angle) * 100;
          playerSpells.push(new Spell(this.x, this.y, tx, ty, 'water_water', this));
        }
      } 
      else if (spellKey === 'water') {
        const spread = 0.2;
        for (let i = -1; i <= 1; i++) {
          const angleOffset = i * spread;
          const tx = this.x + Math.cos(this.angle + angleOffset) * 100;
          const ty = this.y + Math.sin(this.angle + angleOffset) * 100;
          playerSpells.push(new Spell(this.x, this.y, tx, ty, 'water', this));
        }
      }
      else if (spellKey === 'fire_water') {
        const spread = 0.15;
        for (let i = -2; i <= 2; i++) {
          const angleOffset = i * spread;
          const tx = this.x + Math.cos(this.angle + angleOffset) * 100;
          const ty = this.y + Math.sin(this.angle + angleOffset) * 100;
          playerSpells.push(new Spell(this.x, this.y, tx, ty, 'fire_water', this));
        }
      }
      else if (spellKey === 'wood_wood') {
        let targets = [...gameCtx.enemies].filter(e => !e.dead && Math.hypot(e.x - this.x, e.y - this.y) < 400);
        targets.sort((a, b) => Math.hypot(a.x - this.x, a.y - this.y) - Math.hypot(b.x - this.x, b.y - this.y));
        const count = Math.min(3, targets.length);
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            playerSpells.push(new Spell(this.x, this.y, targets[i].x, targets[i].y, 'wood_wood', this));
          }
        } else {
          playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'wood_wood', this));
        }
      }
      else if (spellKey === 'wind_wood') {
        const spread = 0.15;
        for (let i = -2; i <= 2; i++) {
          const angleOffset = i * spread;
          const tx = this.x + Math.cos(this.angle + angleOffset) * 100;
          const ty = this.y + Math.sin(this.angle + angleOffset) * 100;
          playerSpells.push(new Spell(this.x, this.y, tx, ty, 'wind_wood', this));
        }
      }
      else if (spellKey === 'water_wood') {
        const spread = 0.15;
        for (let i = -1; i <= 1; i++) {
          const angleOffset = i * spread;
          const tx = this.x + Math.cos(this.angle + angleOffset) * 100;
          const ty = this.y + Math.sin(this.angle + angleOffset) * 100;
          playerSpells.push(new Spell(this.x, this.y, tx, ty, 'water_wood', this));
        }
      }
      else if (spellKey === 'fire_magma') {
        const spread = 0.1;
        for (let i = -1; i <= 1; i++) {
          const angleOffset = i * spread;
          const tx = this.x + Math.cos(this.angle + angleOffset) * 100;
          const ty = this.y + Math.sin(this.angle + angleOffset) * 100;
          playerSpells.push(new Spell(this.x, this.y, tx, ty, 'fire_magma', this));
        }
      }
      else if (spellKey === 'zephyr_z') {
        const spread = 0.18;
        for (let i = -1; i <= 1; i++) {
          const angleOffset = i * spread;
          const tx = this.x + Math.cos(this.angle + angleOffset) * 100;
          const ty = this.y + Math.sin(this.angle + angleOffset) * 100;
          playerSpells.push(new Spell(this.x, this.y, tx, ty, 'zephyr_z', this));
        }
      }
      else if (spellKey === 'zephyr_x') {
        const originalX = this.x;
        const originalY = this.y;
        const dashAngle = Math.atan2(targetY - this.y, targetX - this.x);
        this.vx += Math.cos(dashAngle) * 22;
        this.vy += Math.sin(dashAngle) * 22;
        this.isInvulnerable = true;
        this.invulnTimer = Math.max(0, this.invulnDuration - 15);
        playerSpells.push(new Spell(originalX, originalY, originalX, originalY, 'zephyr_x', this));
      }
      else if (spellKey === 'zephyr_c') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'zephyr_c', this));
      }
      else if (spellKey === 'zephyr_v') {
        const lvl = this.spellLevels[spellIndex];
        this.windWingsActive = true;
        this.windWingsTimer = 480 + (lvl - 1) * 120; // 8s + 2s per level above 1
        this.windWingsSpawnTimer = 0;
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          particleManager.addParticle(this.x, this.y, '#00ff7f', Math.random() * 3 + 2, Math.random() * 3 + 1, angle, 0.03);
        }
      }
      else if (spellKey === 'tesla_z') {
        let nearest = null;
        let minDist = Infinity;
        for (const e of gameCtx.enemies) {
          if (e.dead) continue;
          const dist = Math.hypot(e.x - this.x, e.y - this.y);
          if (dist < minDist) {
            minDist = dist;
            nearest = e;
          }
        }
        const tx = nearest ? nearest.x : targetX;
        const ty = nearest ? nearest.y : targetY;
        playerSpells.push(new Spell(this.x, this.y, tx, ty, 'tesla_z', this));
      }
      else if (spellKey === 'tesla_x') {
        playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'tesla_x', this));
      }
      else if (spellKey === 'tesla_c') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'tesla_c', this));
      }
      else if (spellKey === 'tesla_v') {
        const lvl = this.spellLevels[spellIndex];
        this.teslaOverloadActive = true;
        this.teslaOverloadTimer = 360 + (lvl - 1) * 120; // 6s + 2s per level above 1
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          particleManager.addParticle(this.x, this.y, '#ffff00', Math.random() * 3 + 2, Math.random() * 3 + 1, angle, 0.03);
        }
      }
      else if (spellKey === 'frost_z') {
        const spread = 0.18;
        for (let j = -2; j <= 2; j++) {
          const angle = this.angle + j * spread;
          const s = new Spell(this.x, this.y, this.x + Math.cos(angle) * 100, this.y + Math.sin(angle) * 100, 'frost_z', this);
          playerSpells.push(s);
        }
      }
      else if (spellKey === 'frost_x') {
        playerSpells.push(new Spell(this.x, this.y, this.x, this.y, 'frost_x', this));
      }
      else if (spellKey === 'frost_c') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'frost_c', this));
      }
      else if (spellKey === 'frost_v') {
        playerSpells.push(new Spell(this.x, this.y, this.x, this.y, 'frost_v', this));
      }
      else if (spellKey === 'magma_z') {
        playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'magma_z', this));
      }
      else if (spellKey === 'magma_x') {
        this.magmaShieldActive = true;
        this.magmaShieldTimer = 360 + (this.spellLevels[spellIndex] - 1) * 60;
        playerSpells.push(new Spell(this.x, this.y, this.x, this.y, 'magma_x', this));
      }
      else if (spellKey === 'magma_c') {
        for (let j = 0; j < 3; j++) {
          setTimeout(() => {
            if (gameCtx.gameState === 'PLAYING') {
              const offsetX = (j === 0) ? 0 : (Math.random() * 60 - 30);
              const offsetY = (j === 0) ? 0 : (Math.random() * 60 - 30);
              const px = targetX + offsetX;
              const py = targetY + offsetY;
              playerSpells.push(new Spell(px, py, px, py, 'magma_c', this));
            }
          }, j * 200);
        }
      }
      else if (spellKey === 'magma_v') {
        const lvl = this.spellLevels[spellIndex];
        const meteorCount = 6 + (lvl - 1) * 2;
        for (let j = 0; j < meteorCount; j++) {
          setTimeout(() => {
            if (gameCtx.gameState === 'PLAYING') {
              const tx = targetX + (Math.random() * 100 - 50);
              const ty = targetY + (Math.random() * 100 - 50);
              const spawnX = tx - 60;
              const spawnY = ty - 220;
              const s = new Spell(spawnX, spawnY, tx, ty, 'magma_v', this);
              playerSpells.push(s);
            }
          }, j * 120);
        }
      }
      else if (spellKey === 'wolf_z') {
        const lvl = this.spellLevels[0] || 1;
        let count = 4;
        if (lvl >= 5) count = 6;
        else if (lvl >= 3) count = 5;
        
        for (let j = 0; j < count; j++) {
          const angle = this.angle + (j - (count - 1) / 2) * 0.4;
          const wx = this.x + Math.cos(angle) * 30;
          const wy = this.y + Math.sin(angle) * 30;
          playerSpells.push(new Spell(wx, wy, wx, wy, 'wolf_z', this));
        }
      }
      else if (spellKey === 'wolf_x') {
        playerSpells.push(new Spell(this.x, this.y, this.x, this.y, 'wolf_x', this));
        soundManager.playExplosion();
      }
      else if (spellKey === 'wolf_c') {
        const leapAngle = Math.atan2(targetY - this.y, targetX - this.x);
        const leapDist = Math.min(220, Math.hypot(targetX - this.x, targetY - this.y));
        const destX = this.x + Math.cos(leapAngle) * leapDist;
        const destY = this.y + Math.sin(leapAngle) * leapDist;
        const s = new Spell(this.x, this.y, destX, destY, 'wolf_c', this);
        s.destX = destX;
        s.destY = destY;
        s.angle = leapAngle;
        this.isInvulnerable = true;
        this.invulnTimer = this.invulnDuration - 20;
        playerSpells.push(s);
      }
      else if (spellKey === 'wolf_v') {
        this.lycanTransformActive = true;
        this.lycanTransformTimer = 480 + (this.spellLevels[spellIndex] - 1) * 120;
        
        // Vụ nổ Triệu Hồi Hủy Diệt khi biến hình sói
        soundManager.playExplosion();
        particleManager.triggerShake(20);
        particleManager.createShockwave(this.x, this.y, '#ff003c', 160);
        for (let i = 0; i < 35; i++) {
          const angle = Math.random() * Math.PI * 2;
          particleManager.addParticle(this.x, this.y, '#ff003c', Math.random()*5+2.5, Math.random()*6+2, angle, 0.02);
        }
        
        // Gây sát thương và hất văng quái xung quanh
        for (const enemy of gameCtx.enemies) {
          if (enemy.dead) continue;
          const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
          if (dist < 160 + enemy.size) {
            enemy.takeDamage(200);
            const pushAngle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
            enemy.x += Math.cos(pushAngle) * 90;
            enemy.y += Math.sin(pushAngle) * 90;
            particleManager.createExplosion(enemy.x, enemy.y, '#ff003c', 6, 2);
          }
        }
        
        playerSpells.push(new Spell(this.x, this.y, this.x, this.y, 'wolf_v', this));
      }
      else if (spellKey === 'creation_z') {
        playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'creation_z', this));
      }
      else if (spellKey === 'creation_x') {
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        for (let j = -1; j <= 1; j++) {
          const offset = j * 0.25;
          const tx = this.x + Math.cos(angle + offset) * 100;
          const ty = this.y + Math.sin(angle + offset) * 100;
          playerSpells.push(new Spell(this.x, this.y, tx, ty, 'creation_x', this));
        }
      }
      else if (spellKey === 'creation_c') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'creation_c', this));
      }
      else if (spellKey === 'creation_v') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'creation_v', this));
      }
      else if (spellKey === 'gaia_z') {
        playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'gaia_z', this));
      }
      else if (spellKey === 'gaia_x') {
        playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'gaia_x', this));
      }
      else if (spellKey === 'gaia_c') {
        this.gaiaShieldOrbs = 3;
      }
      else if (spellKey === 'gaia_v') {
        playerSpells.push(new Spell(this.x, this.y, this.x, this.y, 'gaia_v', this));
      }
      else if (spellKey === 'umbra_z') {
        playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'umbra_z', this));
      }
      else if (spellKey === 'umbra_x') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'umbra_x', this));
      }
      else if (spellKey === 'umbra_c') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'umbra_c', this));
      }
      else if (spellKey === 'umbra_v') {
        this.umbraTransformActive = true;
        this.umbraTransformTimer = 480 + (this.spellLevels[spellIndex] - 1) * 120;
        
        soundManager.playExplosion();
        particleManager.triggerShake(15);
        particleManager.createShockwave(this.x, this.y, '#9d00ff', 140);
        for (let j = 0; j < 25; j++) {
          const angle = Math.random() * Math.PI * 2;
          particleManager.addParticle(this.x, this.y, '#9d00ff', Math.random()*4+2, Math.random()*5+2, angle, 0.03);
        }
      }
      else if (spellKey === 'chronos_z') {
        playerSpells.push(new Spell(this.x, this.y, targetX, targetY, 'chronos_z', this));
      }
      else if (spellKey === 'chronos_x') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'chronos_x', this));
      }
      else if (spellKey === 'chronos_c') {
        playerSpells.push(new Spell(targetX, targetY, targetX, targetY, 'chronos_c', this));
      }
      else if (spellKey === 'chronos_v') {
        const lvl = this.spellLevels[spellIndex];
        this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.35);
        
        soundManager.playExplosion();
        particleManager.triggerShake(20);
        particleManager.createShockwave(this.x, this.y, '#ffe600', 300);
        
        for (const enemy of gameCtx.enemies) {
          if (enemy.dead) continue;
          enemy.applyEffect('freeze_solid', 180 + (lvl - 1) * 60);
          particleManager.createExplosion(enemy.x, enemy.y, '#00f3ff', 3, 1.0);
        }
        
        for (let j = 0; j < 30; j++) {
          const angle = Math.random() * Math.PI * 2;
          particleManager.addParticle(this.x, this.y, '#ffe600', Math.random()*4+2, Math.random()*5+1, angle, 0.03);
        }
      }
      else {
        if (spellKey === 'wind_wind') {
          const spread = 0.28;
          for (let i = 0; i < 3; i++) {
            const angleOffset = (i - 1) * spread;
            const tx = this.x + Math.cos(this.angle + angleOffset) * 100;
            const ty = this.y + Math.sin(this.angle + angleOffset) * 100;
            playerSpells.push(new Spell(this.x, this.y, tx, ty, 'wind_wind', this));
          }
        }
        else {
          playerSpells.push(new Spell(this.x, this.y, targetX, targetY, spellKey, this));
        }
      }
    };

    createSpellInstance();

    if (Math.random() < (this.doubleCastChance || 0)) {
      setTimeout(() => {
        if (gameCtx.gameState === 'PLAYING') {
          createSpellInstance();
        }
      }, 80);
    }
  }

  updateHUD() {
    const keyChars = ['Z', 'X', 'C', 'V'];
    for (let i = 0; i < 4; i++) {
      const slotEl = document.getElementById(`spell-slot-${i + 1}`);
      const cdOverlay = document.getElementById(`spell-cd-${i + 1}`);
      if (!slotEl) continue;

      const spellKey = this.spells[i];
      const lvl = this.spellLevels[i];
      const recipe = SPELL_RECIPES[spellKey] || SPELL_RECIPES['none'];

      if (lvl === 0) {
        slotEl.className = 'spell-hud-slot empty';
        slotEl.querySelector('.spell-hud-lvl').textContent = '';
        slotEl.querySelector('.spell-hud-icon').textContent = '🔒';
        slotEl.querySelector('.spell-hud-name').textContent = 'KHOÁ';
        if (cdOverlay) cdOverlay.style.height = '0%';
      } else {
        slotEl.className = 'spell-hud-slot active';
        slotEl.querySelector('.spell-hud-lvl').textContent = `Lvl ${lvl}`;
        
        let icon = '🔮';
        if (spellKey.includes('fire') || spellKey.startsWith('ignis_')) icon = '🔥';
        else if (spellKey.includes('water') || spellKey.includes('ice') || spellKey.startsWith('marina_')) icon = '💧';
        else if (spellKey.includes('lightning') || spellKey.includes('orb')) icon = '⚡';
        else if (spellKey.includes('wind') || spellKey.includes('blade')) icon = '🍃';
        else if (spellKey.includes('magma')) icon = '🌋';
        else if (spellKey.includes('wood')) icon = '🌲';
        else if (spellKey.includes('wolf')) icon = '🐺';
        else if (spellKey.includes('creation')) icon = '🌌';

        slotEl.querySelector('.spell-hud-icon').textContent = icon;

        if (this.characterKey === 'wolf' && i === 3) {
          if (this.lycanTransformActive) {
            const secondsLeft = (this.lycanTransformTimer / 60).toFixed(1);
            slotEl.querySelector('.spell-hud-name').textContent = `HÓA SÓI (${secondsLeft}s)`;
            if (cdOverlay) {
              const pct = (this.rage / this.maxRage) * 100;
              cdOverlay.style.height = `${100 - pct}%`;
            }
            slotEl.classList.remove('ready-blink');
          } else {
            const ragePct = Math.round((this.rage / this.maxRage) * 100);
            slotEl.querySelector('.spell-hud-name').textContent = `NỘ: ${ragePct}%`;
            if (cdOverlay) {
              cdOverlay.style.height = `${100 - ragePct}%`;
            }
            if (ragePct >= 100) {
              slotEl.classList.add('ready-blink');
            } else {
              slotEl.classList.remove('ready-blink');
            }
          }
        } else {
          slotEl.querySelector('.spell-hud-name').textContent = recipe.name;
          const baseCD = getActualSpellCD(this, i);
          const cdRemaining = this.spellCooldowns[i];
          const pctRemaining = (cdRemaining / baseCD) * 100;
          if (cdOverlay) {
            cdOverlay.style.height = `${pctRemaining}%`;
          }
          slotEl.classList.remove('ready-blink');
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      const rowEl = document.getElementById(`sidebar-row-${i + 1}`);
      const nameEl = document.getElementById(`sidebar-name-${i + 1}`);
      const progressInner = document.getElementById(`sidebar-progress-${i + 1}`);
      const textEl = document.getElementById(`sidebar-text-${i + 1}`);
      const cdTextEl = document.getElementById(`sidebar-cd-text-${i + 1}`);
      if (!rowEl) continue;

      const spellKey = this.spells[i];
      const lvl = this.spellLevels[i];
      const recipe = SPELL_RECIPES[spellKey] || SPELL_RECIPES['none'];

      if (lvl === 0) {
        rowEl.className = 'sidebar-spell-row';
        if (nameEl) nameEl.textContent = 'KHOÁ';
        if (progressInner) progressInner.style.width = '0%';
        if (textEl) textEl.textContent = '🔒';
        if (cdTextEl) {
          cdTextEl.textContent = '';
          cdTextEl.style.display = 'none';
        }
      } else {
        rowEl.className = 'sidebar-spell-row active';
        if (this.characterKey === 'wolf' && i === 3) {
          if (this.lycanTransformActive) {
            const secondsLeft = (this.lycanTransformTimer / 60).toFixed(1);
            if (nameEl) nameEl.textContent = `HÓA SÓI (${secondsLeft}s)`;
            if (progressInner) progressInner.style.width = `${100 - (this.rage / this.maxRage)*100}%`;
            if (textEl) textEl.textContent = `${secondsLeft}s`;
            if (cdTextEl) {
              cdTextEl.textContent = `${secondsLeft}s`;
              cdTextEl.style.display = 'inline';
            }
          } else {
            const ragePct = Math.round((this.rage / this.maxRage) * 100);
            if (nameEl) nameEl.textContent = `NỘ SÓI: ${ragePct}%`;
            if (progressInner) progressInner.style.width = `${100 - ragePct}%`;
            if (textEl) textEl.textContent = ragePct >= 100 ? 'SẴN SÀNG' : `${ragePct}%`;
            if (cdTextEl) {
              cdTextEl.textContent = `${ragePct}%`;
              cdTextEl.style.display = 'inline';
            }
          }
        } else {
          if (nameEl) nameEl.textContent = recipe.name;

          const baseCD = getActualSpellCD(this, i);
          const cdRemaining = this.spellCooldowns[i];
          
          if (cdRemaining > 0) {
            const pctCooldownLeft = (cdRemaining / baseCD) * 100;
            if (progressInner) progressInner.style.width = `${pctCooldownLeft}%`;
            const secondsLeft = (cdRemaining / 60).toFixed(1);
            if (textEl) textEl.textContent = `${secondsLeft}s`;
            if (cdTextEl) {
              cdTextEl.textContent = `${secondsLeft}s`;
              cdTextEl.style.display = 'inline';
            }
          } else {
            if (progressInner) progressInner.style.width = '0%';
            if (textEl) textEl.textContent = 'SẴN SÀNG';
            if (cdTextEl) {
              cdTextEl.textContent = '';
              cdTextEl.style.display = 'none';
            }
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    const isFlashing = this.isInvulnerable && Math.floor(Date.now() / 50) % 2 === 0;
    ctx.shadowBlur = 18;
    
    const auraColors = {
      'ignis': '#ff4500',
      'marina': '#00bfff',
      'zephyr': '#00ff7f',
      'tesla': '#ffff00',
      'frost': '#87cefa',
      'magma': '#ff3300',
      'creation': '#ffe600',
      'wolf': '#ff003c',
      'gaia': '#8b5a2b',
      'umbra': '#9d00ff'
    };
    const auraColor = auraColors[this.characterKey] || '#ffffff';
    
    ctx.strokeStyle = auraColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 1.6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    const range = getSpellMaxRange(this.basicAttackType, this);
    ctx.strokeStyle = auraColor + '22';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(this.x, this.y, range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    if (this.windWingsActive) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ff7f';
      ctx.fillStyle = 'rgba(0, 255, 127, 0.4)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      
      // Draw left wing
      ctx.beginPath();
      ctx.moveTo(-5, -5);
      ctx.quadraticCurveTo(-25, -20, -35, -5);
      ctx.quadraticCurveTo(-20, 5, -5, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw right wing
      ctx.beginPath();
      ctx.moveTo(-5, 5);
      ctx.quadraticCurveTo(-25, 20, -35, 5);
      ctx.quadraticCurveTo(-20, -5, -5, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.restore();
    }

    if (this.teslaOverloadActive) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffff00';
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = this.size * (1.2 + Math.random() * 0.5);
        const sx = this.x + Math.cos(angle) * radius;
        const sy = this.y + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (Math.random() * 12 - 6), sy + (Math.random() * 12 - 6));
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // 1. Draw base wizard body
    ctx.shadowBlur = this.size * 2.5;
    ctx.shadowColor = isFlashing ? '#ffffff' : auraColor;
    
    if (this.characterKey === 'wolf' && this.lycanTransformActive) {
      ctx.fillStyle = isFlashing ? '#ffffff' : '#1a0005';
      ctx.strokeStyle = isFlashing ? '#ffffff' : '#ff003c';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isFlashing ? '#ffffff' : '#ff003c';
      ctx.beginPath();
      ctx.moveTo(-15, -12);
      ctx.lineTo(-24, -26);
      ctx.lineTo(-6, -20);
      ctx.moveTo(-15, 12);
      ctx.lineTo(-24, 26);
      ctx.lineTo(-6, 20);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(10, -6, 2.5, 0, Math.PI*2);
      ctx.arc(10, 6, 2.5, 0, Math.PI*2);
      ctx.fill();
    } else if (this.characterKey === 'umbra' && this.umbraTransformActive) {
      // Hắc thần
      ctx.fillStyle = isFlashing ? '#ffffff' : '#000000';
      ctx.strokeStyle = isFlashing ? '#ffffff' : '#9d00ff';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isFlashing ? '#ffffff' : 'rgba(157, 0, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-15, -12);
      ctx.quadraticCurveTo(-30, -30, -5, -20);
      ctx.moveTo(-15, 12);
      ctx.quadraticCurveTo(-30, 30, -5, 20);
      ctx.fill();

      ctx.fillStyle = '#ff003c';
      ctx.beginPath();
      ctx.arc(10, -5, 2.5, 0, Math.PI*2);
      ctx.arc(10, 5, 2.5, 0, Math.PI*2);
      ctx.fill();
    } else {
      const bodyColors = {
        'ignis': '#3d0c02',
        'marina': '#021e3d',
        'zephyr': '#02381b',
        'tesla': '#1e023d',
        'frost': '#0f3147',
        'magma': '#1a120c',
        'creation': '#130224',
        'wolf': '#181b1d',
        'gaia': '#2d1f10',
        'umbra': '#0f001f'
      };
      const bodyColor = bodyColors[this.characterKey] || '#0d0d26';
      ctx.fillStyle = isFlashing ? '#ffffff' : bodyColor;
      ctx.strokeStyle = isFlashing ? '#ffffff' : auraColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (this.characterKey === 'ignis') {
        ctx.fillStyle = isFlashing ? '#ffffff' : '#ff4500';
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(-5, -21);
        ctx.lineTo(0, -12);
        ctx.lineTo(5, -21);
        ctx.lineTo(10, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } 
      else if (this.characterKey === 'marina') {
        ctx.fillStyle = isFlashing ? '#ffffff' : '#00bfff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.quadraticCurveTo(-10, -12, -18, 0);
        ctx.quadraticCurveTo(-10, 12, 10, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      else if (this.characterKey === 'zephyr') {
        ctx.fillStyle = isFlashing ? '#ffffff' : '#2e8b57';
        ctx.strokeStyle = '#00ff7f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.quadraticCurveTo(-10, -14, -14, -8);
        ctx.quadraticCurveTo(-8, 0, -14, 8);
        ctx.quadraticCurveTo(-10, 14, 6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      else if (this.characterKey === 'tesla') {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(4, -8);
        ctx.lineTo(12, -16);
        ctx.lineTo(6, -8);
        ctx.moveTo(4, 8);
        ctx.lineTo(12, 16);
        ctx.lineTo(6, 8);
        ctx.stroke();
      }
      else if (this.characterKey === 'frost') {
        ctx.fillStyle = isFlashing ? '#ffffff' : '#87cefa';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-8, -this.size);
        ctx.lineTo(-4, -this.size - 8);
        ctx.lineTo(0, -this.size - 3);
        ctx.lineTo(4, -this.size - 8);
        ctx.lineTo(8, -this.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      else if (this.characterKey === 'magma') {
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.arc(-4, -4, 3, 0, Math.PI * 2);
        ctx.arc(3, 4, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = isFlashing ? '#ffffff' : '#2c3e50';
        ctx.strokeStyle = '#ff3300';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      else if (this.characterKey === 'creation') {
        ctx.fillStyle = isFlashing ? '#ffffff' : '#1f003a';
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-8, -6);
        ctx.lineTo(-24, -20);
        ctx.lineTo(0, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      else if (this.characterKey === 'wolf') {
        ctx.fillStyle = isFlashing ? '#ffffff' : '#1a252f';
        ctx.beginPath();
        ctx.moveTo(8, -6);
        ctx.lineTo(16, 0);
        ctx.lineTo(8, 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = isFlashing ? '#ffffff' : '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(-6, -this.size);
        ctx.lineTo(-12, -this.size - 6);
        ctx.lineTo(0, -this.size + 2);
        ctx.moveTo(-6, this.size);
        ctx.lineTo(-12, this.size + 6);
        ctx.lineTo(0, this.size - 2);
        ctx.fill();
      }
      else if (this.characterKey === 'gaia') {
        ctx.fillStyle = '#228b22';
        ctx.beginPath();
        ctx.moveTo(-10, -8);
        ctx.quadraticCurveTo(-18, -15, -6, -12);
        ctx.moveTo(-10, 8);
        ctx.quadraticCurveTo(-18, 15, -6, 12);
        ctx.fill();
        
        ctx.fillStyle = isFlashing ? '#ffffff' : '#8b5a2b';
        ctx.strokeStyle = '#5c3a21';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      else if (this.characterKey === 'umbra') {
        ctx.fillStyle = '#4b0082';
        ctx.beginPath();
        ctx.moveTo(-8, -10);
        ctx.lineTo(-18, -18);
        ctx.lineTo(-4, -12);
        ctx.moveTo(-8, 10);
        ctx.lineTo(-18, 18);
        ctx.lineTo(-4, 12);
        ctx.fill();
        
        ctx.fillStyle = isFlashing ? '#ffffff' : '#0f001f';
        ctx.strokeStyle = '#9d00ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Direction arrow
    ctx.fillStyle = isFlashing ? '#ffffff' : '#141440';
    ctx.strokeStyle = isFlashing ? '#ffffff' : auraColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(this.size * 1.5, 0); 
    ctx.lineTo(-this.size * 0.6, -this.size * 0.8);
    ctx.lineTo(-this.size * 0.6, this.size * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = auraColor;
    ctx.beginPath();
    ctx.arc(this.size * 1.5, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw equipped guns or tools in hand
    if (this.equippedGun) {
      ctx.save();
      if (this.equippedGun === 'handgun') {
        ctx.fillStyle = '#00f3ff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.fillRect(this.size * 0.6, 5, 14, 4); // barrel
        ctx.fillRect(this.size * 0.6, 7, 3, 6);  // grip
      } else if (this.equippedGun === 'rifle') {
        ctx.fillStyle = '#ff4500';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.fillRect(this.size * 0.5, 5, 22, 5); // barrel
        ctx.fillRect(this.size * 0.5 + 4, 10, 3, 6); // grip
        ctx.fillStyle = '#9d00ff';
        ctx.fillRect(this.size * 0.5 + 14, 8, 4, 3); // scope
      } else if (this.equippedGun === 'shotgun') {
        ctx.fillStyle = '#ffe600';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.fillRect(this.size * 0.4, 4, 18, 7); // body
        ctx.fillStyle = '#ff4500';
        ctx.fillRect(this.size * 0.4 + 18, 5, 6, 4); // double barrels
      }
      ctx.restore();
    }
    if (this.equippedTool) {
      ctx.save();
      if (this.equippedTool === 'power_drill') {
        ctx.fillStyle = '#ff8c00';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.fillRect(this.size * 0.5, 5, 12, 10); // drill body
        ctx.fillStyle = '#ffe600';
        ctx.beginPath();
        const drillTime = Date.now() * 0.05;
        const bitLength = 12 + Math.sin(drillTime) * 2;
        ctx.moveTo(this.size * 0.5 + 12, 7);
        ctx.lineTo(this.size * 0.5 + 12 + bitLength, 10);
        ctx.lineTo(this.size * 0.5 + 12, 13);
        ctx.closePath();
        ctx.fill();
      } else if (this.equippedTool === 'magnet_glove') {
        ctx.fillStyle = '#ff00ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff00ff';
        ctx.beginPath();
        ctx.arc(this.size * 0.6, 8, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.size * 0.6, 8, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Draw equipped accessories (Cosmetics)
    const equipped = currentSaveData.equippedAccessories || {};
    if (equipped.cosmetic === 'crown') {
      ctx.fillStyle = '#ffe600';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-8, -this.size - 2);
      ctx.lineTo(-4, -this.size - 10);
      ctx.lineTo(0, -this.size - 4);
      ctx.lineTo(4, -this.size - 10);
      ctx.lineTo(8, -this.size - 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff003c';
      ctx.beginPath();
      ctx.arc(0, -this.size - 5, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    if (equipped.cosmetic === 'wings') {
      ctx.save();
      const flap = Math.sin(Date.now() * 0.008) * 0.2;
      ctx.rotate(flap);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.moveTo(-5, -5);
      ctx.bezierCurveTo(-25, -25, -30, -5, -5, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-5, 5);
      ctx.bezierCurveTo(-25, 25, -30, 5, -5, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    if (equipped.cosmetic === 'aura') {
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f3ff';
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 2.0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (equipped.cosmetic === 'demon_horns') {
      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.moveTo(this.size - 2, -6);
      ctx.quadraticCurveTo(this.size + 8, -12, this.size + 4, -4);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(this.size - 2, 6);
      ctx.quadraticCurveTo(this.size + 8, 12, this.size + 4, 4);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // 3. Draw Pets (bobbing in world coordinates)
    if (equipped.pet) {
      const bob = Math.sin(Date.now() * 0.005) * 4;
      const petAngle = Date.now() * 0.002;
      const petX = this.x + Math.cos(petAngle) * 32;
      const petY = this.y + Math.sin(petAngle) * 32 + bob;
      
      ctx.save();
      ctx.translate(petX, petY);
      ctx.shadowBlur = 8;
      
      if (equipped.pet === 'pet_dragon') {
        ctx.shadowColor = '#ff4500';
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff8c00';
        ctx.beginPath();
        ctx.arc(-4, 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(6, -10);
        ctx.lineTo(-4, -6);
        ctx.closePath();
        ctx.fill();
      } 
      else if (equipped.pet === 'pet_slime') {
        ctx.shadowColor = '#00bfff';
        ctx.fillStyle = 'rgba(0, 191, 255, 0.75)';
        ctx.beginPath();
        ctx.arc(0, 0, 6.5, 0, Math.PI);
        ctx.lineTo(-6.5, -2);
        ctx.quadraticCurveTo(0, -7, 6.5, -2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-2.5, -2, 1.5, 0, Math.PI*2);
        ctx.arc(2.5, -2, 1.5, 0, Math.PI*2);
        ctx.fill();
      } 
      else if (equipped.pet === 'pet_fairy') {
        ctx.shadowColor = '#ffff00';
        ctx.fillStyle = '#ffe600';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(-4, -2, 4, 2, -Math.PI/6, 0, Math.PI*2);
        ctx.ellipse(4, -2, 4, 2, Math.PI/6, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (this.waterShieldOrbs > 0) {
      ctx.save();
      const orbitRadius = this.size + 15;
      const spinSpeed = Date.now() * 0.002;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00bfff';
      ctx.fillStyle = 'rgba(0, 191, 255, 0.75)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let i = 0; i < this.waterShieldOrbs; i++) {
        const angle = spinSpeed + (i / this.waterShieldOrbs) * Math.PI * 2;
        const ox = this.x + Math.cos(angle) * orbitRadius;
        const oy = this.y + Math.sin(angle) * orbitRadius;

        ctx.beginPath();
        ctx.arc(ox, oy, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ox - 1.8, oy - 1.8, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0, 191, 255, 0.75)';
      }
      ctx.restore();
    }

    if (this.gaiaShieldOrbs > 0) {
      ctx.save();
      const orbitRadius = this.size + 18;
      const spinSpeed = Date.now() * 0.0015;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#8b5a2b';
      ctx.fillStyle = '#8b5a2b';
      ctx.strokeStyle = '#5c3a21';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < this.gaiaShieldOrbs; i++) {
        const angle = spinSpeed + (i / this.gaiaShieldOrbs) * Math.PI * 2;
        const ox = this.x + Math.cos(angle) * orbitRadius;
        const oy = this.y + Math.sin(angle) * orbitRadius;

        ctx.beginPath();
        ctx.arc(ox, oy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    if (this.wispCount > 0) {
      ctx.save();
      const orbitRadius = 40;
      const spinSpeed = Date.now() * 0.003;
      
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff8c00';
      ctx.fillStyle = '#ff8c00';

      for (let i = 0; i < this.wispCount; i++) {
        const angle = spinSpeed + (i / this.wispCount) * Math.PI * 2;
        const wx = this.x + Math.cos(angle) * orbitRadius;
        const wy = this.y + Math.sin(angle) * orbitRadius;

        ctx.beginPath();
        ctx.arc(wx, wy, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(wx, wy, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff8c00';
      }
      ctx.restore();
    }

    const baseCD = Math.max(4, (SPELL_RECIPES[this.basicAttackType].cd || 20) * this.cooldownModifier);
    if (this.basicAttackTimer > 0) {
      ctx.save();
      const barW = 32;
      const barH = 4;
      const bx = this.x - barW / 2;
      const by = this.y - this.size - 14;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(bx, by, barW, barH);

      const pct = Math.min(1.0, (baseCD - this.basicAttackTimer) / baseCD);
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#00f3ff';
      ctx.fillRect(bx, by, barW * pct, barH);
      ctx.restore();
    }

    if (this.characterKey === 'wolf') {
      ctx.save();
      const barW = 36;
      const barH = 5;
      const bx = this.x - barW / 2;
      const by = this.y + this.size + 8;

      ctx.fillStyle = 'rgba(40, 20, 20, 0.7)';
      ctx.fillRect(bx, by, barW, barH);

      const ragePct = Math.min(1.0, this.rage / this.maxRage);
      ctx.fillStyle = this.lycanTransformActive ? '#ff003c' : '#e65c00';
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.lycanTransformActive ? '#ff003c' : '#e65c00';
      ctx.fillRect(bx, by, barW * ragePct, barH);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(bx, by, barW, barH);
      ctx.restore();
    }

    if (this.burnTimer > 0 && Math.random() < 0.45) {
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff4500';
      ctx.fillStyle = '#ff8c00';
      ctx.beginPath();
      ctx.arc(this.x + (Math.random() * 16 - 8), this.y - (Math.random() * 14), Math.random() * 3 + 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  init3D() {
    if (this.meshGroup && window.scene3D) {
      window.scene3D.remove(this.meshGroup);
    }
    this.meshGroup = new THREE.Group();
    this.leftWingMesh = null;
    this.rightWingMesh = null;
    
    const auraColors = {
      'ignis': 0xff4500,
      'marina': 0x00bfff,
      'zephyr': 0x00ff7f,
      'tesla': 0xffff00,
      'frost': 0x87cefa,
      'magma': 0xff3300,
      'creation': 0xffe600,
      'wolf': 0xff003c,
      'gaia': 0x8b5a2b,
      'umbra': 0x9d00ff,
      'chronos': 0xffe600
    };
    const colorVal = auraColors[this.characterKey] || 0xffffff;
    
    // Aura ring on ground
    const ringGeo = new THREE.RingGeometry(this.size * 1.4, this.size * 1.6, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: colorVal, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    this.auraRing = new THREE.Mesh(ringGeo, ringMat);
    this.auraRing.rotation.x = -Math.PI / 2;
    this.auraRing.position.y = 0.1;
    this.meshGroup.add(this.auraRing);

    // Group for character body parts
    this.characterGroup = new THREE.Group();
    this.meshGroup.add(this.characterGroup);

    // Torso (Robe)
    const torsoGeo = new THREE.BoxGeometry(16, 20, 10);
    const torsoMat = new THREE.MeshStandardMaterial({ color: colorVal, roughness: 0.7 });
    this.torso = new THREE.Mesh(torsoGeo, torsoMat);
    this.torso.position.y = 18;
    this.torso.castShadow = true;
    this.torso.receiveShadow = true;
    this.characterGroup.add(this.torso);

    // Head
    const headGeo = new THREE.BoxGeometry(12, 12, 12);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.8 });
    this.head = new THREE.Mesh(headGeo, headMat);
    this.head.position.set(0, 15, 0);
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    this.torso.add(this.head);

    // Wizard Hat (Cone + Rim)
    this.hatGroup = new THREE.Group();
    this.hatGroup.position.set(0, 6, 0);
    
    const hatRimGeo = new THREE.CylinderGeometry(10, 10, 1, 16);
    const hatRimMat = new THREE.MeshStandardMaterial({ color: colorVal, roughness: 0.7 });
    const hatRim = new THREE.Mesh(hatRimGeo, hatRimMat);
    this.hatGroup.add(hatRim);
    
    const hatConeGeo = new THREE.ConeGeometry(6, 12, 16);
    const hatConeMat = new THREE.MeshStandardMaterial({ color: colorVal, roughness: 0.7 });
    const hatCone = new THREE.Mesh(hatConeGeo, hatConeMat);
    hatCone.position.y = 6;
    this.hatGroup.add(hatCone);
    
    this.head.add(this.hatGroup);

    // Legs
    const legGeo = new THREE.BoxGeometry(5, 10, 5);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.9 });
    
    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-4, -14, 0);
    this.leftLeg.castShadow = true;
    this.leftLeg.receiveShadow = true;
    this.torso.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(4, -14, 0);
    this.rightLeg.castShadow = true;
    this.rightLeg.receiveShadow = true;
    this.torso.add(this.rightLeg);

    // Arms
    const armGeo = new THREE.BoxGeometry(4, 16, 4);
    const armMat = new THREE.MeshStandardMaterial({ color: colorVal, roughness: 0.7 });
    
    this.leftArm = new THREE.Mesh(armGeo, armMat);
    this.leftArm.position.set(-10, 2, 0);
    this.leftArm.castShadow = true;
    this.leftArm.receiveShadow = true;
    this.torso.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeo, armMat);
    this.rightArm.position.set(10, 2, 0);
    this.rightArm.castShadow = true;
    this.rightArm.receiveShadow = true;
    this.torso.add(this.rightArm);

    // Staff / Weapon
    this.staffGroup = new THREE.Group();
    this.staffGroup.position.set(0, -6, 4);
    this.staffGroup.rotation.x = Math.PI / 3;
    
    const staffShaftGeo = new THREE.CylinderGeometry(1.2, 1.2, 32, 8);
    const staffShaftMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
    const staffShaft = new THREE.Mesh(staffShaftGeo, staffShaftMat);
    this.staffGroup.add(staffShaft);
    
    const staffGemGeo = new THREE.SphereGeometry(3, 8, 8);
    const staffGemMat = new THREE.MeshBasicMaterial({ color: colorVal });
    this.staffGem = new THREE.Mesh(staffGemGeo, staffGemMat);
    this.staffGem.position.y = 17;
    this.staffGroup.add(this.staffGem);
    
    this.rightArm.add(this.staffGroup);

    this.meshGroup.position.set(this.x, 0, this.y);
    window.scene3D.add(this.meshGroup);
  }

  update3D(gameTime) {
    if (!this.meshGroup || (window.scene3D && !window.scene3D.children.includes(this.meshGroup))) {
      if (window.scene3D) this.init3D();
      return;
    }
    
    // Đảm bảo toạ độ không bị NaN
    if (isNaN(this.x) || isNaN(this.y)) {
      this.x = 1250; // ARENA_WIDTH / 2
      this.y = 1250; // ARENA_HEIGHT / 2
      this.vx = 0;
      this.vy = 0;
      console.warn("Player coordinates reset from NaN in update3D!");
    }
    if (isNaN(this.angle)) {
      this.angle = 0;
    }

    this.meshGroup.position.set(this.x, 0, this.y);
    this.characterGroup.rotation.y = -this.angle - Math.PI / 2;
    
    const speedSq = this.vx * this.vx + this.vy * this.vy;
    const isWalking = speedSq > 0.16;
    
    if (isWalking) {
      const walkSpeed = 0.22;
      const angle = Math.sin(gameTime * walkSpeed) * 0.6;
      this.leftLeg.rotation.x = angle;
      this.rightLeg.rotation.x = -angle;
      this.leftArm.rotation.x = -angle;
      this.rightArm.rotation.x = angle;
    } else {
      const breathe = Math.sin(gameTime * 0.05) * 0.05;
      this.torso.position.y = 18 + breathe * 20;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.x = 0;
    }
    
    const isFlashing = this.isInvulnerable && Math.floor(Date.now() / 80) % 2 === 0;
    
    if (this.characterKey === 'wolf' && this.lycanTransformActive) {
      this.characterGroup.scale.set(1.9, 1.9, 1.9);
      if (this.hatGroup) this.hatGroup.visible = false;
      if (this.staffGroup) this.staffGroup.visible = false;
      
      const bodyColor = isFlashing ? 0xffffff : 0x1a0005;
      const accentColor = isFlashing ? 0xffffff : 0xff003c;
      
      this.torso.material.color.setHex(bodyColor);
      this.head.material.color.setHex(accentColor);
      this.leftLeg.material.color.setHex(bodyColor);
      this.rightLeg.material.color.setHex(bodyColor);
      this.leftArm.material.color.setHex(bodyColor);
      this.rightArm.material.color.setHex(bodyColor);
      
      this.auraRing.scale.set(1.9, 1.9, 1.9);
      this.auraRing.material.color.setHex(0xff003c);
    } else if (this.characterKey === 'umbra' && this.umbraTransformActive) {
      this.characterGroup.scale.set(1.5, 1.5, 1.5);
      if (this.hatGroup) this.hatGroup.visible = true;
      if (this.staffGroup) this.staffGroup.visible = true;
      
      const bodyColor = isFlashing ? 0xffffff : 0x000000;
      const accentColor = isFlashing ? 0xffffff : 0x9d00ff;
      
      this.torso.material.color.setHex(bodyColor);
      this.head.material.color.setHex(0xffdbac);
      this.leftLeg.material.color.setHex(bodyColor);
      this.rightLeg.material.color.setHex(bodyColor);
      this.leftArm.material.color.setHex(bodyColor);
      this.rightArm.material.color.setHex(bodyColor);
      
      if (this.staffGem) this.staffGem.material.color.setHex(accentColor);
      
      this.auraRing.scale.set(1.5, 1.5, 1.5);
      this.auraRing.material.color.setHex(0x9d00ff);
    } else {
      this.characterGroup.scale.set(1.0, 1.0, 1.0);
      if (this.hatGroup) this.hatGroup.visible = true;
      if (this.staffGroup) this.staffGroup.visible = true;
      
      const auraColors = {
        'ignis': 0xff4500,
        'marina': 0x00bfff,
        'zephyr': 0x00ff7f,
        'tesla': 0xffff00,
        'frost': 0x87cefa,
        'magma': 0xff3300,
        'creation': 0xffe600,
        'wolf': 0xff003c,
        'gaia': 0x8b5a2b,
        'umbra': 0x9d00ff,
        'chronos': 0xffe600
      };
      const themeColor = auraColors[this.characterKey] || 0xffffff;
      
      const bodyColor = isFlashing ? 0xffffff : themeColor;
      this.torso.material.color.setHex(bodyColor);
      this.head.material.color.setHex(0xffdbac);
      this.leftLeg.material.color.setHex(0x111122);
      this.rightLeg.material.color.setHex(0x111122);
      this.leftArm.material.color.setHex(bodyColor);
      this.rightArm.material.color.setHex(bodyColor);
      
      if (this.staffGem) this.staffGem.material.color.setHex(themeColor);
      
      this.auraRing.scale.set(1.0, 1.0, 1.0);
      this.auraRing.material.color.setHex(themeColor);
    }
    
    if (this.windWingsActive) {
      if (!this.leftWingMesh) {
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.quadraticCurveTo(-20, -15, -30, -5);
        wingShape.quadraticCurveTo(-15, 5, 0, 0);
        
        const wingGeo = new THREE.ShapeGeometry(wingShape);
        const wingMat = new THREE.MeshStandardMaterial({ 
          color: 0x00ff7f, 
          transparent: true, 
          opacity: 0.6, 
          side: THREE.DoubleSide 
        });
        
        this.leftWingMesh = new THREE.Mesh(wingGeo, wingMat);
        this.leftWingMesh.position.set(-6, 20, -2);
        this.leftWingMesh.rotation.y = Math.PI / 6;
        this.characterGroup.add(this.leftWingMesh);
        
        this.rightWingMesh = this.leftWingMesh.clone();
        this.rightWingMesh.position.set(6, 20, -2);
        this.rightWingMesh.rotation.y = -Math.PI / 6;
        this.rightWingMesh.scale.x = -1;
        this.characterGroup.add(this.rightWingMesh);
      }
      this.leftWingMesh.visible = true;
      this.rightWingMesh.visible = true;
      
      const flap = Math.sin(gameTime * 0.3) * 0.15;
      this.leftWingMesh.rotation.y = Math.PI / 6 + flap;
      this.rightWingMesh.rotation.y = -Math.PI / 6 - flap;
    } else {
      if (this.leftWingMesh) this.leftWingMesh.visible = false;
      if (this.rightWingMesh) this.rightWingMesh.visible = false;
    }
  }

  destroy3D() {
    if (this.meshGroup && window.scene3D) {
      window.scene3D.remove(this.meshGroup);
    }
  }
}

