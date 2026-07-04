// Removed imports to support global script loading.
// All modules (Player, Enemy, XPGem, EnemyBullet, Spell, particleManager, soundManager, upgrades, config, database, ui) are loaded globally.

// Khai báo Canvas toàn cục và context 2D
canvas = document.getElementById('game-canvas');
ctx = canvas.getContext('2d');

keys = {};
mouse = { x: 0, y: 0, clicked: false };
window.canvas = canvas;
window.ctx = ctx;
window.keys = keys;
window.mouse = mouse;

// Biến điều khiển Camera
let camX = 0;
let camY = 0;

// Biến điều khiển Spawn quái và orbs cục bộ trong game.js
let spawnTimer = 0;
let orbSpawnTimer = 0;

// Object chứa ngữ cảnh trạng thái game toàn cục dùng để chia sẻ giữa các Module
gameCtx = {
  player: null,
  enemies: [],
  playerSpells: [],
  enemyBullets: [],
  xpGems: [],
  elementalOrbs: [],
  healthPickups: [],
  lavaPatches: [],
  obstacles: [],
  resourcePickups: [],
  turretBullets: [],
  caveEntrances: [],
  caveExits: [],
  floatingTexts: [],
  inCave: false,
  lastCaveEntranceX: 0,
  lastCaveEntranceY: 0,
  gameState: 'MENU',
  currentWave: 1,
  waveState: 'BREAK',
  waveTimer: 180 * 60, // 3 minutes for day (10800 frames)
  totalEnemiesInWave: 0,
  enemiesToSpawnInWave: 0,
  waveSpawnTimer: 0,
  waveAnnouncementTimer: 0,
  currentMap: 'forest',
  currentDifficulty: 'normal',
  currentCharacter: 'ignis',
  gameTime: 0,
  bossSpawned: false,
  waveDifficulty: 1.0,
  get camX() { return camX; },
  set camX(val) { camX = val; },
  get camY() { return camY; },
  set camY(val) { camY = val; }
};
window.gameCtx = gameCtx;

// ==========================================
// ASSET MANAGER (TẢI SPRITES TỰ VẼ)
// ==========================================
class AssetManager {
  constructor() {
    this.images = {};
    this.loaded = {};
    
    this.sources = {
      player_ignis: 'assets/player_ignis.png',
      player_marina: 'assets/player_marina.png',
      player_zephyr: 'assets/player_zephyr.png',
      player_tesla: 'assets/player_tesla.png',
      enemy_swarmer: 'assets/enemy_swarmer.png',
      enemy_charger: 'assets/enemy_charger.png',
      enemy_shooter: 'assets/enemy_shooter.png',
      enemy_boss: 'assets/enemy_boss.png',
      xp_gem: 'assets/xp_gem.png',
      health: 'assets/health.png'
    };
    
    this.init();
  }

  init() {
    Object.keys(this.sources).forEach(key => {
      const img = new Image();
      img.src = this.sources[key];
      img.onload = () => {
        this.loaded[key] = true;
      };
      img.onerror = () => {
        this.loaded[key] = false;
      };
      this.images[key] = img;
    });
  }

  isLoaded(key) {
    return !!this.loaded[key];
  }

  get(key) {
    return this.images[key];
  }
}

assetManager = new AssetManager();
window.assetManager = assetManager;

// ==========================================
// LAVA PATCH & HEALTH PICKUP
// ==========================================
class LavaPatch {
  constructor(x, y, radius = 50 + Math.random() * 40) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.pulse += 0.03;
  }

  draw(ctx) {
    ctx.save();
    const currentRad = this.radius + Math.sin(this.pulse) * 4;
    
    const grad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, currentRad);
    grad.addColorStop(0, 'rgba(255, 69, 0, 0.75)');
    grad.addColorStop(0.5, 'rgba(255, 0, 0, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
class HealthPickup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 7;
    this.color = '#ff3366'; // Hồng neon
    this.active = true;
    this.vx = 0;
    this.vy = 0;
    this.speed = 0;
    this.maxSpeed = 12;
    this.pulse = 0;

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
      const healAmount = player.maxHp * 0.20;
      player.hp = Math.min(player.maxHp, player.hp + healAmount);
      
      soundManager.playOrbPickup('water');
      for (let i = 0; i < 15; i++) {
        particleManager.addParticle(
          player.x, 
          player.y, 
          '#00ff7f', // Lục neon
          Math.random() * 3 + 1, 
          Math.random() * 3 + 1, 
          Math.random() * Math.PI * 2, 
          Math.random() * 0.03 + 0.02
        );
      }
      this.active = false;
      this.destroy3D();
    }
    this.pulse += 0.07;
    this.update3D();
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    
    if (assetManager.isLoaded('health')) {
      const drawSize = this.size * 2.5;
      ctx.drawImage(assetManager.get('health'), this.x - drawSize/2, this.y - drawSize/2, drawSize, drawSize);
    } else {
      // Draw neon cross
      const w = 4;
      const h = 12;
      ctx.fillRect(this.x - w / 2, this.y - h / 2, w, h);
      ctx.fillRect(this.x - h / 2, this.y - w / 2, h, w);
    }
    ctx.restore();
  }

  init3D() {
    this.mesh = new THREE.Group();
    
    const mat = new THREE.MeshBasicMaterial({ color: 0xff3366 });
    const boxV = new THREE.Mesh(new THREE.BoxGeometry(4, 12, 4), mat);
    const boxH = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 4), mat);
    
    this.mesh.add(boxV);
    this.mesh.add(boxH);
    
    this.mesh.position.set(this.x, 6, this.y);
    window.scene3D.add(this.mesh);
  }

  update3D() {
    if (this.mesh) {
      this.mesh.position.set(this.x, 6 + Math.sin(this.pulse) * 1.5, this.y);
      this.mesh.rotation.y += 0.03;
    }
  }

  destroy3D() {
    if (this.mesh && window.scene3D) {
      window.scene3D.remove(this.mesh);
    }
  }
}

// ==========================================
// GAME STATE MANAGEMENT (ĐIỀU KHIỂN TRẬN ĐẤU)
// ==========================================
function initGame() {
  gameCtx.player = new Player(ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
  gameCtx.enemies = [];
  gameCtx.playerSpells = [];
  gameCtx.enemyBullets = [];
  gameCtx.xpGems = [];
  gameCtx.elementalOrbs = [];
  gameCtx.healthPickups = [];
  gameCtx.lavaPatches = [];
  
  // Survival & Crafting Arrays Reset
  gameCtx.obstacles = [];
  gameCtx.resourcePickups = [];
  gameCtx.turretBullets = [];
  gameCtx.caveEntrances = [];
  gameCtx.caveExits = [];
  gameCtx.floatingTexts = [];
  gameCtx.inCave = false;
  gameCtx.lastCaveEntranceX = 0;
  gameCtx.lastCaveEntranceY = 0;

  // Khởi tạo 35 cây rừng trong 2 phân vùng (Tây Bắc & Đông Nam)
  for (let i = 0; i < 35; i++) {
    const zone = Math.random() < 0.5 ? 'top_left' : 'bottom_right';
    let tx, ty;
    if (zone === 'top_left') {
      tx = 300 + Math.random() * 600;
      ty = 300 + Math.random() * 600;
    } else {
      tx = 1600 + Math.random() * 600;
      ty = 1600 + Math.random() * 600;
    }
    const check = canPlaceStructureAt(tx, ty, 20);
    if (check.valid) {
      gameCtx.obstacles.push(new Obstacle(tx, ty, 'tree'));
    }
  }

  // Khởi tạo 24 thảo dược (Đỏ, Lam, Vàng) trên bản đồ chính
  const herbTypes = ['herb_red', 'herb_blue', 'herb_yellow'];
  for (let i = 0; i < 24; i++) {
    const zone = Math.random() < 0.5 ? 'top_left' : 'bottom_right';
    let hx, hy;
    if (zone === 'top_left') {
      hx = 300 + Math.random() * 600;
      hy = 300 + Math.random() * 600;
    } else {
      hx = 1600 + Math.random() * 600;
      hy = 1600 + Math.random() * 600;
    }
    const check = canPlaceStructureAt(hx, hy, 12);
    if (check.valid) {
      const htype = herbTypes[Math.floor(Math.random() * herbTypes.length)];
      gameCtx.obstacles.push(new Obstacle(hx, hy, htype));
    }
  }

  // Spawn 3 Cave Entrances in the main map with index assignment (40% chance each, guaranteed at least 1)
  let spawnedIndices = [];
  for (let i = 0; i < 3; i++) {
    if (Math.random() < 0.4) {
      spawnedIndices.push(i);
    }
  }
  if (spawnedIndices.length === 0) {
    spawnedIndices.push(Math.floor(Math.random() * 3));
  }

  spawnedIndices.forEach(i => {
    let cx, cy;
    let tooClose = true;
    while (tooClose) {
      cx = 250 + Math.random() * (ARENA_WIDTH - 500);
      cy = 250 + Math.random() * (ARENA_HEIGHT - 500);
      const distToCenter = Math.hypot(cx - ARENA_WIDTH / 2, cy - ARENA_HEIGHT / 2);
      if (distToCenter > 300) {
        let closeToOther = false;
        for (const ent of gameCtx.caveEntrances) {
          if (Math.hypot(cx - ent.x, cy - ent.y) < 400) {
            closeToOther = true;
            break;
          }
        }
        if (!closeToOther) {
          tooClose = false;
        }
      }
    }
    const ent = new CaveEntrance(cx, cy);
    ent.caveIndex = i; // 0, 1, 2
    gameCtx.caveEntrances.push(ent);
  });

  // Spawn 3 Cave Exits safely
  for (let i = 0; i < 3; i++) {
    const entrance = gameCtx.caveEntrances.find(ent => ent.caveIndex === i);
    const rx = entrance ? entrance.x : ARENA_WIDTH / 2;
    const ry = entrance ? entrance.y : ARENA_HEIGHT / 2;
    gameCtx.caveExits.push(new CaveExit(5500 + i * 1500, 5500, rx, ry));
  }

  // Spawn Minerals for each cave
  // Cave 0 (X: 5000-6000) - Quartz Stone Cave: Mostly Stone
  for (let i = 0; i < 12; i++) {
    const ox = 5120 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 5500, oy - 5500) > 90) {
      const r = Math.random();
      const type = r < 0.65 ? 'ore_stone' : r < 0.90 ? 'ore_iron' : r < 0.98 ? 'ore_gold' : 'ore_diamond';
      gameCtx.obstacles.push(new Obstacle(ox, oy, type));
    }
  }
  for (let i = 0; i < 6; i++) {
    const ox = 5120 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 5500, oy - 5500) > 90) {
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'stalactite'));
    }
  }
  for (let i = 0; i < 4; i++) {
    const ox = 5120 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 5500, oy - 5500) > 90) {
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'cave_torch'));
    }
  }

  // Cave 1 (X: 6500-7500) - Pyrite Iron Cave: Mostly Iron
  for (let i = 0; i < 12; i++) {
    const ox = 6620 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 7000, oy - 5500) > 90) {
      const r = Math.random();
      const type = r < 0.25 ? 'ore_stone' : r < 0.75 ? 'ore_iron' : r < 0.93 ? 'ore_gold' : 'ore_diamond';
      gameCtx.obstacles.push(new Obstacle(ox, oy, type));
    }
  }
  for (let i = 0; i < 6; i++) {
    const ox = 6620 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 7000, oy - 5500) > 90) {
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'stalactite'));
    }
  }
  for (let i = 0; i < 4; i++) {
    const ox = 6620 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 7000, oy - 5500) > 90) {
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'cave_torch'));
    }
  }

  // Cave 2 (X: 8000-9000) - Golden Crystal Cave: Rich mixed Ores
  for (let i = 0; i < 12; i++) {
    const ox = 8120 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 8500, oy - 5500) > 90) {
      const r = Math.random();
      const type = r < 0.10 ? 'ore_stone' : r < 0.30 ? 'ore_iron' : r < 0.75 ? 'ore_gold' : 'ore_diamond';
      const ore = new Obstacle(ox, oy, type);
      ore.maxHp *= 2;
      ore.hp = ore.maxHp;
      ore.rich = true; // flag for double drop
      gameCtx.obstacles.push(ore);
    }
  }
  for (let i = 0; i < 6; i++) {
    const ox = 8120 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 8500, oy - 5500) > 90) {
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'stalactite'));
    }
  }
  for (let i = 0; i < 4; i++) {
    const ox = 8120 + Math.random() * 760;
    const oy = 5120 + Math.random() * 760;
    if (Math.hypot(ox - 8500, oy - 5500) > 90) {
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'cave_torch'));
    }
  }

  if (gameCtx.currentMap === 'volcano') {
    for (let i = 0; i < 18; i++) {
      const px = 150 + Math.random() * (ARENA_WIDTH - 300);
      const py = 150 + Math.random() * (ARENA_HEIGHT - 300);
      if (Math.hypot(px - ARENA_WIDTH / 2, py - ARENA_HEIGHT / 2) > 220) {
        gameCtx.lavaPatches.push(new LavaPatch(px, py));
      }
    }
  }
  
  gameCtx.gameTime = 0;
  spawnTimer = 0;
  orbSpawnTimer = 0;
  gameCtx.waveDifficulty = 1.0;
  gameCtx.bossSpawned = false;

  // Wave System Initialization
  gameCtx.currentWave = 1;
  gameCtx.waveState = 'BREAK';
  gameCtx.waveTimer = 180 * 60; // 3 minutes for day (10800 frames)
  gameCtx.totalEnemiesInWave = 0;
  gameCtx.enemiesToSpawnInWave = 0;
  gameCtx.waveSpawnTimer = 0;
  gameCtx.waveAnnouncementTimer = 0;
  
  particleManager.clear();
  gameCtx.player.updateHUD();
}

function startGame() {
  initGame();
  initSidebarCooldownPanel();
  document.getElementById('start-screen').classList.remove('active');
  document.getElementById('game-over-screen').classList.remove('active');
  gameCtx.gameState = 'PLAYING';
  canvas.style.cursor = 'none';
  const panel = document.getElementById('wave-control-panel');
  if (panel) panel.style.display = 'flex';
  
  // Show gameplay HUD elements
  const hudEl = document.getElementById('hud');
  if (hudEl) hudEl.style.display = '';
  const minimapEl = document.getElementById('minimap-container');
  if (minimapEl) minimapEl.style.display = '';
  const sidebarEl = document.getElementById('cooldown-sidebar');
  if (sidebarEl) sidebarEl.style.display = '';
}

function endGame() {
  gameCtx.gameState = 'GAME_OVER';
  soundManager.playGameOver();
  canvas.style.cursor = 'auto';
  const panel = document.getElementById('wave-control-panel');
  if (panel) panel.style.display = 'none';
  
  const minutes = Math.floor(gameCtx.gameTime / 3600).toString().padStart(2, '0');
  const seconds = Math.floor((gameCtx.gameTime % 3600) / 60).toString().padStart(2, '0');
  
  document.getElementById('summary-time').innerText = `${minutes}:${seconds}`;
  document.getElementById('summary-level').innerText = gameCtx.player.level;
  
  let goldMultiplier = 1.0;
  if (gameCtx.currentDifficulty === 'hard') goldMultiplier = 1.5;
  else if (gameCtx.currentDifficulty === 'hardcore') goldMultiplier = 3.0;

  // Áp dụng hệ số vàng của phòng chơi nhiều người
  let mpGoldMult = 1.0;
  const mpCount = window._selectedPlayerCount || 1;
  if (mpCount === 2) mpGoldMult = 1.5;
  else if (mpCount === 3) mpGoldMult = 2.0;
  else if (mpCount === 4) mpGoldMult = 3.0;

  const finalGoldMultiplier = goldMultiplier * mpGoldMult;
  const goldEarned = Math.round(gameCtx.player.kills * finalGoldMultiplier);
  currentSaveData.gold += goldEarned;
  document.getElementById('summary-kills').innerText = `${goldEarned} 🪙 (x${finalGoldMultiplier.toFixed(1)})`;
  document.getElementById('summary-score').innerText = Math.round(gameCtx.player.score);

  let difficultyUnlockMessage = '';
  const oldMaxNormal = currentSaveData.maxWaveNormal || 1;
  const oldMaxHard = currentSaveData.maxWaveHard || 1;

  if (gameCtx.currentDifficulty === 'normal') {
    currentSaveData.maxWaveNormal = Math.max(oldMaxNormal, gameCtx.currentWave);
    if (oldMaxNormal < 20 && currentSaveData.maxWaveNormal >= 20) {
      difficultyUnlockMessage = '🔓 ĐÃ MỞ KHÓA ĐỘ KHÓ: KHÓ (x1.5 Vàng)!';
    }
  } else if (gameCtx.currentDifficulty === 'hard') {
    currentSaveData.maxWaveHard = Math.max(oldMaxHard, gameCtx.currentWave);
    if (oldMaxHard < 50 && currentSaveData.maxWaveHard >= 50) {
      difficultyUnlockMessage = '🔓 ĐÃ MỞ KHÓA ĐỘ KHÓ: SIÊU KHÓ (x3.0 Vàng)!';
    }
  }
  
  const xpEarned = Math.round(gameCtx.player.score / 20);
  currentSaveData.accountXp += xpEarned;
  
  let levelsGained = 0;
  let goldRewarded = 0;
  let unlockedItemsList = [];
  
  while (currentSaveData.accountLevel < 100 && currentSaveData.accountXp >= currentSaveData.accountLevel * 100) {
    currentSaveData.accountXp -= currentSaveData.accountLevel * 100;
    currentSaveData.accountLevel++;
    levelsGained++;
    
    currentSaveData.gold += 200;
    goldRewarded += 200;
    
    if (currentSaveData.accountLevel === 2) {
      if (!currentSaveData.purchasedAccessories.includes('boots_zephyr')) {
        currentSaveData.purchasedAccessories.push('boots_zephyr');
        unlockedItemsList.push('Giày Zephyr 🥾');
      }
    } else if (currentSaveData.accountLevel === 3) {
      if (!currentSaveData.purchasedAccessories.includes('pendant_magnet')) {
        currentSaveData.purchasedAccessories.push('pendant_magnet');
        unlockedItemsList.push('Dây Chuyền Nam Châm 🧲');
      }
    } else if (currentSaveData.accountLevel === 5) {
      if (!currentSaveData.purchasedAccessories.includes('ring_diamond')) {
        currentSaveData.purchasedAccessories.push('ring_diamond');
        unlockedItemsList.push('Nhẫn Kim Cương 💍');
      }
    }
  }

  if (currentSaveData.accountLevel >= 100) {
    currentSaveData.accountLevel = 100;
    currentSaveData.accountXp = 0;
  }
  
  saveAccountSave();
  
  const oldAccountRows = document.querySelectorAll('.account-summary-row');
  oldAccountRows.forEach(row => row.remove());
  
  const statsSummary = document.querySelector('#game-over-screen .stats-summary');
  if (statsSummary) {
    const expRow = document.createElement('div');
    expRow.className = 'summary-row account-summary-row';
    expRow.style.color = 'var(--neon-cyan)';
    expRow.innerHTML = `<span>Kinh nghiệm tài khoản:</span><span>+${xpEarned} EXP</span>`;
    statsSummary.appendChild(expRow);
    
    const levelRow = document.createElement('div');
    levelRow.className = 'summary-row account-summary-row';
    levelRow.style.color = '#00ff7f';
    if (levelsGained > 0) {
      levelRow.innerHTML = `<span>Cấp độ tài khoản:</span><span style="font-weight:bold; text-shadow:0 0 5px #00ff7f;">LV ${currentSaveData.accountLevel} (LÊN CẤP! 🎉)</span>`;
    } else {
      levelRow.innerHTML = `<span>Cấp độ tài khoản:</span><span>LV ${currentSaveData.accountLevel}</span>`;
    }
    statsSummary.appendChild(levelRow);
    
    if (levelsGained > 0) {
      const rewardRow = document.createElement('div');
      rewardRow.className = 'summary-row account-summary-row';
      rewardRow.style.color = 'var(--neon-yellow)';
      let rewardText = `+${goldRewarded} 🪙`;
      if (unlockedItemsList.length > 0) {
        rewardText += ` & ${unlockedItemsList.join(', ')}`;
      }
      rewardRow.innerHTML = `<span>Thưởng lên cấp:</span><span style="font-weight:bold; text-shadow:0 0 5px var(--neon-yellow);">${rewardText}</span>`;
      statsSummary.appendChild(rewardRow);
    }
    
    if (difficultyUnlockMessage) {
      const unlockRow = document.createElement('div');
      unlockRow.className = 'summary-row account-summary-row';
      unlockRow.style.color = 'var(--neon-magenta)';
      unlockRow.style.fontWeight = 'bold';
      unlockRow.style.textShadow = '0 0 8px var(--neon-magenta)';
      unlockRow.innerHTML = `<span style="width: 100%; text-align: center;">${difficultyUnlockMessage}</span>`;
      statsSummary.appendChild(unlockRow);
    }
  }
  
  updateAccountMenuUI();
  document.getElementById('game-over-screen').classList.add('active');
}

function exitToMenu() {
  gameCtx.gameState = 'MENU';
  document.getElementById('pause-screen').classList.remove('active');
  document.getElementById('game-over-screen').classList.remove('active');
  canvas.style.cursor = 'auto';
  const panel = document.getElementById('wave-control-panel');
  if (panel) panel.style.display = 'none';
  // Go to lobby instead of old menu screen
  enterLobby();
}

// ==========================================
// SẢNH CHỜ 2D (LOBBY ROOM)
// ==========================================
const LOBBY = {
  roomW: 900,
  roomH: 560,
  tileSize: 40,
  player: { x: 450, y: 340, size: 14, vx: 0, vy: 0, speed: 3.5, facing: 'down', animFrame: 0, animTimer: 0, color: '#00f3ff' },
  lobbyTime: 0,

  hotspots: [
    {
      id: 'portal',
      x: 450, y: 100,
      radius: 50,
      label: 'CỔNG CHIẾN ĐẤU',
      hint: '[E] Vào trận',
      color: '#ff0055',
      glowColor: 'rgba(255,0,85,0.4)',
      icon: '⚔️'
    },
    {
      id: 'mirror',
      x: 120, y: 200,
      radius: 38,
      label: 'GƯƠNG CHIẾN BINH',
      hint: '[E] Chọn nhân vật',
      color: '#9d00ff',
      glowColor: 'rgba(157,0,255,0.4)',
      icon: '🪞'
    },
    {
      id: 'merchant',
      x: 780, y: 200,
      radius: 38,
      label: 'THƯƠNG NHÂN',
      hint: '[E] Mở shop',
      color: '#ffe600',
      glowColor: 'rgba(255,230,0,0.4)',
      icon: '🏪'
    },
    {
      id: 'console',
      x: 780, y: 430,
      radius: 38,
      label: 'BẢNG ĐIỀU KHIỂN',
      hint: '[E] Cài đặt',
      color: '#00f3ff',
      glowColor: 'rgba(0,243,255,0.4)',
      icon: '⚙️'
    }
  ],

  nearHotspot: null,
  camX: 0,
  camY: 0,
};

function enterLobby() {
  gameCtx.gameState = 'LOBBY';
  
  if (window.GameInvite) {
    window.GameInvite.exitRoom();
  }

  // Hide all screens
  ['start-screen','login-screen','game-over-screen','pause-screen','level-up-screen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  // Hide gameplay HUD elements in lobby
  const hudEl = document.getElementById('hud');
  if (hudEl) hudEl.style.display = 'none';
  const minimapEl = document.getElementById('minimap-container');
  if (minimapEl) minimapEl.style.display = 'none';
  const sidebarEl = document.getElementById('cooldown-sidebar');
  if (sidebarEl) sidebarEl.style.display = 'none';
  const craftEl = document.getElementById('crafting-overlay');
  if (craftEl) craftEl.style.display = 'none';

  // Show lobby HUD
  const lobbyHud = document.getElementById('lobby-hud');
  if (lobbyHud) {
    lobbyHud.style.display = 'block';
    // Update player info
    const lobbyUser = document.getElementById('lobby-username-display');
    const lobbyLv   = document.getElementById('lobby-menu-level');
    const lobbyGold = document.getElementById('lobby-menu-gold');
    const lobbyMaxWave = document.getElementById('lobby-menu-maxwave');
    const lobbyCharIcon = document.getElementById('lobby-menu-char-icon');
    const lobbyCharName = document.getElementById('lobby-menu-char-name');
    const lobbyAdminBtn = document.getElementById('lobby-admin-btn');
    const sessionUser = safeStorage.getItem('spellfusion_session') || 'Guest';

    if (lobbyUser && currentSaveData) lobbyUser.textContent = sessionUser;
    if (lobbyLv   && currentSaveData) lobbyLv.textContent   = currentSaveData.accountLevel;
    if (lobbyGold && currentSaveData) lobbyGold.textContent = currentSaveData.gold;
    if (lobbyMaxWave && currentSaveData) {
      lobbyMaxWave.textContent = Math.max(currentSaveData.maxWaveNormal || 1, currentSaveData.maxWaveHard || 1);
    }
    
    // Show / Hide Admin Panel based on account type
    if (lobbyAdminBtn) {
      if (sessionUser === 'admin' || sessionUser === 'spelladmin' || sessionUser === 'spelladminn') {
        lobbyAdminBtn.style.display = 'flex';
      } else {
        lobbyAdminBtn.style.display = 'none';
      }
    }
    
    // Character selection sync
    const char = CHARACTERS[gameCtx.currentCharacter] || CHARACTERS['ignis'];
    if (lobbyCharIcon) lobbyCharIcon.textContent = char.icon;
    if (lobbyCharName) lobbyCharName.textContent = char.name;

    // Kiểm tra lời mời kết bạn & hiện badge
    if (window.LobbyFriends) setTimeout(() => window.LobbyFriends.checkBadge(), 500);
    if (window.LobbyInbox) setTimeout(() => window.LobbyInbox.checkBadge(), 500);
  }


  // Ensure gameCtx.player is initialized in lobby
  if (!gameCtx.player) {
    gameCtx.player = new Player(ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
  }

  // Set player avatar color from character
  const charColors = { 
    ignis: '#ff4500', 
    marina: '#00aaff', 
    zephyr: '#00ff88', 
    tesla: '#ffe600',
    gaia: '#4caf50',
    wolf: '#ff003c',
    cobra: '#a020f0',
    monk: '#ff9f43',
    artemis: '#00dbff',
    bloodmage: '#ff003c',
    shadow: '#34495e',
    paladin: '#ffd700'
  };
  LOBBY.player.color = charColors[gameCtx.currentCharacter] || '#00f3ff';

  // Reset player position
  LOBBY.player.x = LOBBY.roomW / 2;
  LOBBY.player.y = LOBBY.roomH * 0.65;
  LOBBY.player.vx = 0;
  LOBBY.player.vy = 0;

  // Re-init sidebar and update HUD
  if (typeof initSidebarCooldownPanel === 'function') initSidebarCooldownPanel();
  if (typeof updateGameHUD === 'function') updateGameHUD();

  canvas.style.cursor = 'none';

  // Tự động hiển thị bảng hướng dẫn cho người chơi mới đăng ký / đăng nhập lần đầu
  if (currentSaveData && !currentSaveData.tutorialShown) {
    currentSaveData.tutorialShown = true;
    if (typeof saveAccountSave === 'function') {
      saveAccountSave();
    }
    setTimeout(() => {
      if (window.LobbyTutorial && typeof window.LobbyTutorial.open === 'function') {
        window.LobbyTutorial.open();
      }
    }, 1200);
  }
}

function updateLobby() {
  if (gameCtx.gameState !== 'LOBBY') return;
  LOBBY.lobbyTime++;

  const lp = LOBBY.player;
  let dx = 0, dy = 0;

  if (keys['w'] || keys['arrowup'])    dy -= 1;
  if (keys['s'] || keys['arrowdown'])  dy += 1;
  if (keys['a'] || keys['arrowleft'])  dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const len = Math.sqrt(dx * dx + dy * dy);
    dx /= len; dy /= len;
    if (dx > 0) lp.facing = 'right';
    else if (dx < 0) lp.facing = 'left';
    else if (dy < 0) lp.facing = 'up';
    else lp.facing = 'down';

    lp.animTimer++;
    if (lp.animTimer % 10 === 0) lp.animFrame = (lp.animFrame + 1) % 4;
  } else {
    lp.animTimer = 0;
  }

  lp.x += dx * lp.speed;
  lp.y += dy * lp.speed;

  // Room bounds (inner walls)
  const wall = 30;
  lp.x = Math.max(wall + lp.size, Math.min(LOBBY.roomW - wall - lp.size, lp.x));
  lp.y = Math.max(wall + lp.size, Math.min(LOBBY.roomH - wall - lp.size, lp.y));

  // Check proximity to hotspots
  LOBBY.nearHotspot = null;
  for (const hs of LOBBY.hotspots) {
    const dist = Math.hypot(lp.x - hs.x, lp.y - hs.y);
    if (dist < hs.radius + 28) {
      LOBBY.nearHotspot = hs;
      break;
    }
  }

  // E key to interact
  if (keys['e'] && LOBBY.nearHotspot) {
    keys['e'] = false; // consume key
    activateLobbyHotspot(LOBBY.nearHotspot.id);
  }
}

function activateLobbyHotspot(id) {
  if (id === 'portal') {
    // Show game setup modal
    const gameSetupModal = document.getElementById('game-setup-modal');
    if (gameSetupModal) {
      setupMapSelection(MAPS);
      setupDifficultySelection();
      updateDifficultyUI();
      gameSetupModal.classList.add('active');
      gameCtx.gameState = 'LOBBY_MODAL';
    }
  } else if (id === 'mirror') {
    const charSelectModal = document.getElementById('char-select-modal');
    if (charSelectModal) {
      charSelectModal.classList.add('active');
      updateAccountMenuUI();
      setupCharacterSelection();
      gameCtx.gameState = 'LOBBY_MODAL';
    }
  } else if (id === 'merchant') {
    const shopModal = document.getElementById('shop-modal');
    if (shopModal) {
      shopModal.classList.add('active');
      renderShopGrid();
      updateAccountMenuUI();
      gameCtx.gameState = 'LOBBY_MODAL';
    }
  } else if (id === 'console') {
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
      settingsModal.classList.add('active');
      activateTab('sound');
      gameCtx.gameState = 'LOBBY_MODAL';
    }
  }
}

function drawLobby() {
  const W = canvas.width;
  const H = canvas.height;
  const rW = LOBBY.roomW;
  const rH = LOBBY.roomH;
  const offX = (W - rW) / 2;
  const offY = (H - rH) / 2;
  const t = LOBBY.lobbyTime;

  // ── Background ───────────────────────────────────────────────────────────
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(offX, offY);

  // ── Floor tiles ──────────────────────────────────────────────────────────
  const ts = LOBBY.tileSize;
  for (let row = 0; row < rH / ts; row++) {
    for (let col = 0; col < rW / ts; col++) {
      const even = (row + col) % 2 === 0;
      ctx.fillStyle = even ? 'rgba(20,22,45,0.95)' : 'rgba(16,18,38,0.95)';
      ctx.fillRect(col * ts, row * ts, ts, ts);
      // subtle grid lines
      ctx.strokeStyle = 'rgba(0,243,255,0.04)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(col * ts, row * ts, ts, ts);
    }
  }

  // ── Walls ────────────────────────────────────────────────────────────────
  const wallThick = 28;
  const wallGrad = ctx.createLinearGradient(0, 0, 0, wallThick);
  wallGrad.addColorStop(0, 'rgba(0,20,60,0.98)');
  wallGrad.addColorStop(1, 'rgba(5,10,30,0.8)');

  // Top wall
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, rW, wallThick);
  // Bottom wall
  const wallGradB = ctx.createLinearGradient(0, rH - wallThick, 0, rH);
  wallGradB.addColorStop(0, 'rgba(5,10,30,0.8)');
  wallGradB.addColorStop(1, 'rgba(0,20,60,0.98)');
  ctx.fillStyle = wallGradB;
  ctx.fillRect(0, rH - wallThick, rW, wallThick);
  // Left wall
  ctx.fillStyle = 'rgba(0,20,60,0.95)';
  ctx.fillRect(0, 0, wallThick, rH);
  // Right wall
  ctx.fillRect(rW - wallThick, 0, wallThick, rH);

  // Wall edge glow lines
  ctx.strokeStyle = `rgba(0,243,255,${0.2 + Math.sin(t * 0.02) * 0.08})`;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(wallThick, wallThick, rW - wallThick * 2, rH - wallThick * 2);

  // ── Decorative corner runes ───────────────────────────────────────────────
  const corners = [[wallThick + 10, wallThick + 10], [rW - wallThick - 10, wallThick + 10], [wallThick + 10, rH - wallThick - 10], [rW - wallThick - 10, rH - wallThick - 10]];
  corners.forEach(([cx2, cy2]) => {
    ctx.save();
    ctx.translate(cx2, cy2);
    ctx.rotate(t * 0.005);
    ctx.strokeStyle = `rgba(0,243,255,${0.15 + Math.sin(t * 0.03) * 0.07})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = 12;
      i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  });

  // ── Ambient light patches ─────────────────────────────────────────────────
  const ambientLights = [
    { x: rW * 0.25, y: rH * 0.3, color: 'rgba(157,0,255,0.06)' },
    { x: rW * 0.75, y: rH * 0.3, color: 'rgba(255,230,0,0.05)' },
    { x: rW * 0.5,  y: rH * 0.6, color: 'rgba(0,243,255,0.04)' },
  ];
  ambientLights.forEach(al => {
    const aGrad = ctx.createRadialGradient(al.x, al.y, 0, al.x, al.y, 130);
    aGrad.addColorStop(0, al.color);
    aGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = aGrad;
    ctx.fillRect(0, 0, rW, rH);
  });

  // ── Hotspots ─────────────────────────────────────────────────────────────
  for (const hs of LOBBY.hotspots) {
    const pulse = Math.sin(t * 0.04 + hs.x) * 0.3 + 0.7;
    const isNear = LOBBY.nearHotspot === hs;

    // Outer glow
    const hsGrad = ctx.createRadialGradient(hs.x, hs.y, 0, hs.x, hs.y, hs.radius * 1.5 * (isNear ? 1.3 : 1));
    hsGrad.addColorStop(0, hs.glowColor);
    hsGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = hsGrad;
    ctx.fillRect(0, 0, rW, rH);

    // Spinning ring
    ctx.save();
    ctx.translate(hs.x, hs.y);
    ctx.rotate(t * (hs.id === 'portal' ? 0.02 : 0.01));
    ctx.strokeStyle = hs.color;
    ctx.lineWidth = isNear ? 3 : 1.5;
    ctx.globalAlpha = pulse * (isNear ? 1 : 0.6);
    ctx.beginPath();
    ctx.arc(0, 0, hs.radius, 0, Math.PI * 2);
    ctx.stroke();
    // Inner dashed ring
    ctx.rotate(-t * 0.04);
    ctx.setLineDash([6, 8]);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(0, 0, hs.radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Portal special: inner warp effect
    if (hs.id === 'portal') {
      for (let ring = 0; ring < 3; ring++) {
        const pr = (hs.radius * 0.5) * (1 - ((t * 0.02 + ring / 3) % 1));
        ctx.save();
        ctx.globalAlpha = (1 - pr / (hs.radius * 0.5)) * 0.5;
        ctx.strokeStyle = hs.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hs.x, hs.y, pr * hs.radius * 0.8 + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Icon
    ctx.save();
    ctx.font = `${isNear ? 28 : 24}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 12;
    ctx.shadowColor = hs.color;
    ctx.fillText(hs.icon, hs.x, hs.y - 4);
    ctx.restore();

    // Label
    ctx.save();
    ctx.font = `bold 11px 'Orbitron', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = hs.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = hs.color;
    ctx.globalAlpha = isNear ? 1 : 0.7;
    ctx.fillText(hs.label, hs.x, hs.y + hs.radius + 14);
    ctx.restore();

    // Interaction hint when near
    if (isNear) {
      ctx.save();
      const hintY = hs.y - hs.radius - 20;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.strokeStyle = hs.color;
      ctx.lineWidth = 1;
      const hintW = 120;
      ctx.beginPath();
      ctx.roundRect(hs.x - hintW / 2, hintY - 13, hintW, 22, 4);
      ctx.fill();
      ctx.stroke();
      ctx.font = `bold 10px 'Orbitron', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(hs.hint, hs.x, hintY);
      ctx.restore();
    }
  }

  // ── Player avatar ─────────────────────────────────────────────────────────
  const lp = LOBBY.player;
  const bobY = Math.sin(t * 0.12) * 2;

  // Shadow
  ctx.save();
  const shadowGrad = ctx.createRadialGradient(lp.x, lp.y + lp.size, 0, lp.x, lp.y + lp.size, lp.size * 1.5);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0.5)');
  shadowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(lp.x, lp.y + lp.size, lp.size * 1.2, lp.size * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(lp.x, lp.y + bobY);

  // Glow aura - draw radial gradient halo correctly
  const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, lp.size * 2.5);
  auraGrad.addColorStop(0, lp.color + '55'); // hex + alpha works in modern browsers
  auraGrad.addColorStop(1, lp.color + '00');
  ctx.fillStyle = auraGrad;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(0, 0, lp.size * 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Shadow glow
  ctx.shadowBlur = 20;
  ctx.shadowColor = lp.color;

  // Body (hexagonal warrior shape)
  ctx.fillStyle = lp.color;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
    const r = lp.size;
    i === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r) : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();

  // Inner core
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(0, 0, lp.size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Direction indicator
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.shadowBlur = 6;
  const dirAngles = { right: 0, left: Math.PI, up: -Math.PI / 2, down: Math.PI / 2 };
  const da = dirAngles[lp.facing] || 0;
  ctx.beginPath();
  ctx.moveTo(Math.cos(da) * lp.size * 0.85, Math.sin(da) * lp.size * 0.85);
  ctx.lineTo(Math.cos(da + 2.3) * lp.size * 0.45, Math.sin(da + 2.3) * lp.size * 0.45);
  ctx.lineTo(Math.cos(da - 2.3) * lp.size * 0.45, Math.sin(da - 2.3) * lp.size * 0.45);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // ── Room title ────────────────────────────────────────────────────────────
  ctx.save();
  ctx.font = `900 18px 'Orbitron', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = `rgba(0,243,255,${0.3 + Math.sin(t * 0.02) * 0.1})`;
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#00f3ff';
  ctx.fillText('SẢNH CHỜ', rW / 2, rH - 14);
  ctx.restore();

  // ── Controls hint ─────────────────────────────────────────────────────────
  ctx.save();
  ctx.font = `10px 'Orbitron', sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(140,160,220,0.5)';
  ctx.fillText('WASD / ↑↓←→ để di chuyển', wallThick + 8, rH - 10);
  ctx.restore();

  ctx.restore(); // end room translate
}

// Wrap the draw function to support LOBBY state
const _origDraw = typeof draw === 'function' ? draw : null;



// ==========================================
// SPAWNER & WAVE SYSTEM (TẠO QUÁI & ĐỢT CHƠI)
// ==========================================
function handleSpawning() {
  if (gameCtx.inCave) return; // Đóng băng thời gian và ngưng đợt quái chính trong hang động
  if (gameCtx.waveState === 'BREAK') {
    const autoSkip = document.getElementById('auto-skip-checkbox') && document.getElementById('auto-skip-checkbox').checked;
    if (autoSkip) {
      gameCtx.waveTimer = 0;
    }
    gameCtx.waveTimer--;
    if (gameCtx.waveTimer <= 0) {
      gameCtx.waveState = 'ACTIVE'; // Đêm bắt đầu!
      
      // Số lượng quái vật ban đêm tăng dần qua các ngày và nhân theo số người chơi
      let monsterMult = 1.0;
      if (window._selectedPlayerCount && window._selectedPlayerCount > 1) {
        monsterMult = 1.0 + (window._selectedPlayerCount - 1) * 0.5; // 2: 1.5, 3: 2.0, 4: 2.5
      }
      gameCtx.totalEnemiesInWave = Math.round((12 + gameCtx.currentWave * 8) * monsterMult);
      gameCtx.enemiesToSpawnInWave = gameCtx.totalEnemiesInWave;
      gameCtx.waveSpawnTimer = 0;
      gameCtx.waveAnnouncementTimer = 150;
      
      let diffMult = 1.0;
      if (gameCtx.currentDifficulty === 'hard') diffMult = 1.4;
      else if (gameCtx.currentDifficulty === 'hardcore') diffMult = 2.2;

      gameCtx.waveDifficulty = (1.0 + (gameCtx.currentWave - 1) * 0.45) * diffMult;
      
      // Boss xuất hiện vào đêm ngày thứ 3, 6, 9...
      if (gameCtx.currentWave % 3 === 0) {
        spawnBoss();
      }
      
      soundManager.playExplosion ? soundManager.playExplosion() : null;
    }
  } else if (gameCtx.waveState === 'ACTIVE') {
    if (gameCtx.enemiesToSpawnInWave > 0) {
      gameCtx.waveSpawnTimer++;
      let spawnInterval = Math.max(15, 75 - gameCtx.currentWave * 4);
      if (gameCtx.currentDifficulty === 'hard') {
        spawnInterval = Math.max(10, Math.round(spawnInterval * 0.8));
      } else if (gameCtx.currentDifficulty === 'hardcore') {
        spawnInterval = Math.max(6, Math.round(spawnInterval * 0.5));
      }

      // Giảm khoảng cách spawn quái nếu nhiều người chơi để quái xuất hiện kịp thời
      if (window._selectedPlayerCount && window._selectedPlayerCount > 1) {
        const spMultiplier = 1 / (1 + (window._selectedPlayerCount - 1) * 0.5);
        spawnInterval = Math.max(6, Math.round(spawnInterval * spMultiplier));
      }

      if (gameCtx.waveSpawnTimer >= spawnInterval) {
        gameCtx.waveSpawnTimer = 0;
        const batchSize = Math.min(gameCtx.enemiesToSpawnInWave, Math.floor(1 + Math.random() * (1 + gameCtx.currentWave / 3)));
        for (let i = 0; i < batchSize; i++) {
          spawnEnemy();
          gameCtx.enemiesToSpawnInWave--;
        }
      }
    }
    
    // Đợt quái đêm bị tiêu diệt hết -> Trở lại Ban Ngày
    if (gameCtx.enemiesToSpawnInWave === 0 && gameCtx.enemies.length === 0) {
      const goldReward = 20 + gameCtx.currentWave * 8;
      currentSaveData.gold += goldReward;
      saveAccountSave();
      
      // Sóng chấn động bình minh
      particleManager.createShockwave(gameCtx.player.x, gameCtx.player.y, '#00ff7f', 200);
      
      const healCount = 1 + (gameCtx.currentWave % 2 === 0 ? 1 : 0);
      for (let i = 0; i < healCount; i++) {
        gameCtx.healthPickups.push(new HealthPickup(
          gameCtx.player.x + (Math.random() * 240 - 120),
          gameCtx.player.y + (Math.random() * 240 - 120)
        ));
      }
      
      // Trở lại Ban Ngày (Morning)
      gameCtx.waveState = 'BREAK';
      gameCtx.waveTimer = 180 * 60; // 3 phút đếm ngược
      gameCtx.currentWave++; // Qua ngày mới!
      
      // Hiển thị chữ nổi báo bình minh
      if (window.FloatingText && gameCtx.floatingTexts) {
        gameCtx.floatingTexts.push(new FloatingText(gameCtx.player.x, gameCtx.player.y - 40, "BÌNH MINH LÊN - NGÀY MỚI BẮT ĐẦU!", '#ffe600'));
      }
    }
  }
}

function spawnEnemy() {
  const viewPadding = 80;
  const side = Math.floor(Math.random() * 4);
  let x, y;

  if (side === 0) {
    x = camX - viewPadding + Math.random() * (canvas.width + viewPadding * 2);
    y = camY - viewPadding;
  } else if (side === 1) {
    x = camX + canvas.width + viewPadding;
    y = camY - viewPadding + Math.random() * (canvas.height + viewPadding * 2);
  } else if (side === 2) {
    x = camX - viewPadding + Math.random() * (canvas.width + viewPadding * 2);
    y = camY + canvas.height + viewPadding;
  } else {
    x = camX - viewPadding;
    y = camY - viewPadding + Math.random() * (canvas.height + viewPadding * 2);
  }

  x = Math.max(20, Math.min(ARENA_WIDTH - 20, x));
  y = Math.max(20, Math.min(ARENA_HEIGHT - 20, y));

  let type = 'swarmer';
  const minutes = gameCtx.gameTime / 3600;

  if (gameCtx.currentMap === 'temple') {
    const rand = Math.random();
    if (minutes > 1.2) {
      if (rand < 0.25) type = 'swarmer';
      else if (rand < 0.5) type = 'charger';
      else type = 'shooter';
    } else {
      if (rand < 0.45) type = 'swarmer';
      else if (rand < 0.7) type = 'charger';
      else type = 'shooter';
    }
  } else {
    if (minutes > 1.2) {
      const rand = Math.random();
      if (rand < 0.45) type = 'swarmer';
      else if (rand < 0.75) type = 'charger';
      else type = 'shooter';
    } else if (minutes > 0.5) {
      type = Math.random() < 0.65 ? 'swarmer' : 'charger';
    }
  }

  gameCtx.enemies.push(new Enemy(x, y, type, gameCtx.waveDifficulty, gameCtx.currentMap));
}

function spawnBoss() {
  const x = Math.max(100, Math.min(ARENA_WIDTH - 100, camX + canvas.width / 2 + (Math.random() * 200 - 100)));
  const y = Math.max(100, Math.min(ARENA_HEIGHT - 100, camY - 100));
  
  gameCtx.enemies.push(new Enemy(x, y, 'boss', gameCtx.waveDifficulty * 1.4, gameCtx.currentMap));
  gameCtx.bossSpawned = true;
  
  particleManager.triggerShake(18);
  soundManager.playExplosion();
}

function updateCollisions() {
  // 1. Va chạm đạn quái vật
  for (let i = gameCtx.enemyBullets.length - 1; i >= 0; i--) {
    const b = gameCtx.enemyBullets[i];
    if (!b.active) continue;

    if (gameCtx.player && gameCtx.player.magmaShieldActive) {
      const shieldDist = Math.hypot(b.x - gameCtx.player.x, b.y - gameCtx.player.y);
      if (shieldDist < 65 + b.size) {
        b.active = false;
        b.destroy3D();
        gameCtx.enemyBullets.splice(i, 1);
        particleManager.addParticle(b.x, b.y, '#ff4500', 2.2, 1.2, Math.random() * Math.PI * 2, 0.08);
        continue;
      }
    }

    // Va chạm đạn với công trình kiên cố
    if (gameCtx.obstacles) {
      let hitObs = false;
      for (const obs of gameCtx.obstacles) {
        if (!obs.active || !obs.solid) continue;
        const odist = Math.hypot(b.x - obs.x, b.y - obs.y);
        if (odist < b.size + obs.size) {
          obs.takeDamage(b.damage, true);
          b.active = false;
          b.destroy3D();
          gameCtx.enemyBullets.splice(i, 1);
          hitObs = true;
          break;
        }
      }
      if (hitObs) continue;
    }

    const dx = gameCtx.player.x - b.x;
    const dy = gameCtx.player.y - b.y;
    const dist = dx * dx + dy * dy;
    const hitDist = gameCtx.player.size + b.size;

    if (dist < hitDist * hitDist) {
      gameCtx.player.takeDamage(b.damage);
      b.active = false;
      b.destroy3D();
      gameCtx.enemyBullets.splice(i, 1);
    }
  }

  // 2. Va chạm quái vật
  for (const e of gameCtx.enemies) {
    if (e.dead) continue;

    // Va chạm quái vật với công trình kiên cố
    if (gameCtx.obstacles) {
      for (const obs of gameCtx.obstacles) {
        if (!obs.active || !obs.solid) continue;
        const edx = e.x - obs.x;
        const edy = e.y - obs.y;
        const edist = Math.hypot(edx, edy);
        if (edist < e.size + obs.size) {
          // Đẩy quái vật ra ngoài công trình
          const overlap = (e.size + obs.size) - edist;
          const pushX = (edx / edist) * overlap;
          const pushY = (edy / edist) * overlap;
          e.x += pushX;
          e.y += pushY;
          
          // Quái vật cắn phá công trình (sát thương chia đều cho 60 FPS)
          obs.takeDamage(e.damage / 60, true);

          // Phản sát thương lôi điện cho rào điện
          if (obs.type === 'electric_fence') {
            e.takeDamage((e.damage * 0.5) / 60); // phản 50% sát thương quái
            e.applyEffect('shock', 30); // giật tê liệt nhẹ nửa giây
            if (Math.random() < 0.1) {
              particleManager.addParticle(e.x, e.y, '#00ffff', 1, 1, Math.random() * Math.PI * 2, 0.1);
            }
          }
        }
      }
    }

    const dx = gameCtx.player.x - e.x;
    const dy = gameCtx.player.y - e.y;
    const dist = dx * dx + dy * dy;
    const hitDist = gameCtx.player.size + e.size;

    if (dist < hitDist * hitDist) {
      gameCtx.player.takeDamage(e.isCharging ? e.damage * 1.5 : e.damage);
      
      if (e.type === 'swarmer') {
        const pushAngle = Math.atan2(e.y - gameCtx.player.y, e.x - gameCtx.player.x);
        e.x += Math.cos(pushAngle) * 8;
        e.y += Math.sin(pushAngle) * 8;
      }
    }
  }

  // 3. Va chạm người chơi với công trình kiên cố
  if (gameCtx.obstacles && gameCtx.player) {
    for (const obs of gameCtx.obstacles) {
      if (!obs.active || !obs.solid) continue;
      
      const pdx = gameCtx.player.x - obs.x;
      const pdy = gameCtx.player.y - obs.y;
      const pdist = Math.hypot(pdx, pdy);
      
      if (obs.isCrafted) {
        // Tạo hiệu ứng hạt lấp lánh nhẹ cùng tông màu công trình khi người chơi đi xuyên qua
        if (pdist < gameCtx.player.size + obs.size) {
          if (Math.random() < 0.12) {
            particleManager.addParticle(
              gameCtx.player.x + (Math.random() * 12 - 6),
              gameCtx.player.y + (Math.random() * 12 - 6),
              obs.color,
              1.2,
              1.2,
              Math.random() * Math.PI * 2,
              0.08
            );
          }
        }
        continue;
      }
      
      if (pdist < gameCtx.player.size + obs.size) {
        // Đẩy người chơi ra ngoài công trình (đối với chướng ngại vật tự nhiên)
        const overlap = (gameCtx.player.size + obs.size) - pdist;
        const pushX = (pdx / pdist) * overlap;
        const pushY = (pdy / pdist) * overlap;
        gameCtx.player.x += pushX;
        gameCtx.player.y += pushY;
      }
    }
  }
}

class FloatingText {
  constructor(x, y, text, color = '#ffffff') {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1;
    this.vy = -1.2;
    this.active = true;
  }

  update() {
    this.y += this.vy;
    this.alpha -= 0.02;
    if (this.alpha <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.font = "bold 13px 'Orbitron', sans-serif";
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
window.FloatingText = FloatingText;

// ==========================================
// LOOP HOẠT HỌA & UPDATE/DRAW
// ==========================================
function update() {
  if (gameCtx.gameState !== 'PLAYING') return;

  gameCtx.gameTime++;
  handleSpawning();
  gameCtx.player.update(keys, mouse, gameCtx.enemies, gameCtx.playerSpells);

  // Cập nhật menu chế tạo theo thời gian thực nếu đang mở
  if (gameCtx.gameTime % 5 === 0) {
    const overlay = document.getElementById('crafting-overlay');
    if (overlay && overlay.style.display === 'flex') {
      if (typeof window.updateCraftingMenu === 'function') {
        window.updateCraftingMenu();
      }
    }
  }

  // Power Drill tool effect: auto mine nearby ores and trees
  if (gameCtx.player.equippedTool === 'power_drill' && gameCtx.gameTime % 15 === 0 && gameCtx.obstacles) {
    for (const obs of gameCtx.obstacles) {
      if (!obs.active || !['ore_stone', 'ore_iron', 'ore_gold', 'ore_diamond', 'tree'].includes(obs.type)) continue;
      const dist = Math.hypot(gameCtx.player.x - obs.x, gameCtx.player.y - obs.y);
      if (dist < 90) {
        obs.takeDamage(60);
        // Visual electric/drill effect
        for (let j = 0; j < 4; j++) {
          particleManager.addParticle(obs.x, obs.y, '#ffffff', 1.5, 2, Math.random() * Math.PI * 2, 0.1);
        }
      }
    }
  }

  if (gameCtx.player.hp <= 0) {
    endGame();
    return;
  }

  const targetCamX = gameCtx.player.x - canvas.width / 2;
  const targetCamY = gameCtx.player.y - canvas.height / 2;
  camX += (targetCamX - camX) * 0.1;
  camY += (targetCamY - camY) * 0.1;

  if (gameCtx.inCave) {
    // Không giới hạn camera trong hang động vô hạn
  } else {
    camX = Math.max(0, Math.min(ARENA_WIDTH - canvas.width, camX));
    camY = Math.max(0, Math.min(ARENA_HEIGHT - canvas.height, camY));
  }



  for (let i = gameCtx.playerSpells.length - 1; i >= 0; i--) {
    const s = gameCtx.playerSpells[i];
    s.update(gameCtx.enemies, ARENA_WIDTH, ARENA_HEIGHT);
    
    // Check collision between spell and mineral ores / trees
    if (s.active && gameCtx.obstacles) {
      s.hitObstacles = s.hitObstacles || new Set();
      for (const obs of gameCtx.obstacles) {
        if (!obs.active || !['ore_stone', 'ore_iron', 'ore_gold', 'ore_diamond', 'tree'].includes(obs.type)) continue;
        
        if (s.hitObstacles.has(obs)) continue;
        
        const dist = Math.hypot(s.x - obs.x, s.y - obs.y);
        const hitDist = s.size + obs.size;
        
        if (dist < hitDist) {
          let dmg = s.damage || 10;
          if (s.player && Math.random() < (s.player.critChance || 0)) {
            dmg *= 2;
          }
          
          obs.takeDamage(dmg);
          s.hitObstacles.add(obs);
          
          const isPersistent = s.type.includes('patch') || s.type.includes('cloud') || s.type.includes('storm') || s.type.includes('shield') || s.type.includes('aura') || s.type.includes('wall') || s.speed === 0 || s.type === 'wolf_z' || s.type === 'wolf_v';
          if (!isPersistent) {
            s.active = false;
            break;
          }
        }
      }
    }

    if (!s.active) {
      s.destroy3D();
      gameCtx.playerSpells.splice(i, 1);
    }
  }

  for (let i = gameCtx.enemyBullets.length - 1; i >= 0; i--) {
    const b = gameCtx.enemyBullets[i];
    b.update();
    if (Math.hypot(b.x - gameCtx.player.x, b.y - gameCtx.player.y) > 1000) {
      b.destroy3D();
      gameCtx.enemyBullets.splice(i, 1);
    }
  }

  for (let i = gameCtx.enemies.length - 1; i >= 0; i--) {
    const e = gameCtx.enemies[i];
    e.update(gameCtx.player, gameCtx.enemyBullets, gameCtx.enemies);
    if (e.dead) {
      gameCtx.player.kills++;
      gameCtx.player.score += e.score;

      gameCtx.xpGems.push(new XPGem(e.x, e.y, e.xpValue));

      if (Math.random() < 0.09) {
        gameCtx.healthPickups.push(new HealthPickup(e.x, e.y));
      }

      // Cơ chế rơi tài nguyên khi quái vật chết
      let dropChance = 0;
      if (e.type === 'swarmer') dropChance = 0.25;
      else if (e.type === 'charger' || e.type === 'shooter') dropChance = 0.5;
      else if (e.type === 'boss') dropChance = 1.0;

      if (Math.random() < dropChance) {
        const isBoss = e.type === 'boss';
        const drillMult = gameCtx.player.equippedTool === 'power_drill' ? 2 : 1;
        if (isBoss) {
          const wAmt = (Math.floor(Math.random() * 4) + 6) * drillMult; // 6-9 gỗ
          const sAmt = (Math.floor(Math.random() * 4) + 6) * drillMult; // 6-9 đá
          const iAmt = (Math.floor(Math.random() * 3) + 4) * drillMult; // 4-6 sắt
          gameCtx.resourcePickups.push(new ResourcePickup(e.x - 15, e.y, 'wood', wAmt));
          gameCtx.resourcePickups.push(new ResourcePickup(e.x, e.y, 'stone', sAmt));
          gameCtx.resourcePickups.push(new ResourcePickup(e.x + 15, e.y, 'iron', iAmt));
        } else {
          let type = 'wood';
          const r = Math.random();
          if (e.type === 'swarmer') {
            type = r < 0.5 ? 'wood' : 'stone';
          } else {
            type = r < 0.4 ? 'wood' : r < 0.8 ? 'stone' : 'iron';
          }
          const amt = (Math.floor(Math.random() * 3) + 1) * drillMult;
          gameCtx.resourcePickups.push(new ResourcePickup(e.x, e.y, type, amt));
        }
      }

      if (e.type === 'boss') {
        gameCtx.bossSpawned = false;
      }
      gameCtx.enemies.splice(i, 1);
    }
  }

  for (let i = gameCtx.xpGems.length - 1; i >= 0; i--) {
    const gem = gameCtx.xpGems[i];
    gem.update(gameCtx.player);
    if (gem.collected) gameCtx.xpGems.splice(i, 1);
  }

  for (let i = gameCtx.healthPickups.length - 1; i >= 0; i--) {
    const pickup = gameCtx.healthPickups[i];
    pickup.update(gameCtx.player);
    if (!pickup.active) gameCtx.healthPickups.splice(i, 1);
  }

  // Cập nhật tài nguyên rơi
  for (let i = gameCtx.resourcePickups.length - 1; i >= 0; i--) {
    const pickup = gameCtx.resourcePickups[i];
    pickup.update(gameCtx.player);
    if (pickup.collected) {
      gameCtx.resourcePickups.splice(i, 1);
    }
  }

  // Cập nhật công trình & quặng
  for (let i = gameCtx.obstacles.length - 1; i >= 0; i--) {
    const obs = gameCtx.obstacles[i];
    obs.update();
    if (!obs.active) {
      gameCtx.obstacles.splice(i, 1);
    }
  }

  // Cập nhật đạn trụ súng
  for (let i = gameCtx.turretBullets.length - 1; i >= 0; i--) {
    const tb = gameCtx.turretBullets[i];
    tb.update(gameCtx.enemies);
    if (!tb.active || Math.hypot(tb.x - gameCtx.player.x, tb.y - gameCtx.player.y) > 1000) {
      tb.destroy3D();
      gameCtx.turretBullets.splice(i, 1);
    }
  }

  // Cập nhật số sát thương bay
  for (let i = gameCtx.floatingTexts.length - 1; i >= 0; i--) {
    const ft = gameCtx.floatingTexts[i];
    ft.update();
    if (!ft.active) {
      gameCtx.floatingTexts.splice(i, 1);
    }
  }

  if (gameCtx.currentMap === 'volcano') {
    for (const patch of gameCtx.lavaPatches) {
      patch.update();
      const dist = Math.hypot(gameCtx.player.x - patch.x, gameCtx.player.y - patch.y);
      if (dist < gameCtx.player.size + patch.radius - 12) {
        gameCtx.player.takeLavaBurn();
      }
    }
  }

  particleManager.update();
  updateCollisions();
  updateGameHUD();
  updateWaveControlPanel();

  if (gameCtx.inCave) {
    // 1. Dọn dẹp vật thể ở quá xa (> 1200px) để tránh rác bộ nhớ
    for (let i = gameCtx.obstacles.length - 1; i >= 0; i--) {
      const obs = gameCtx.obstacles[i];
      if (['ore_stone', 'ore_iron', 'ore_gold', 'ore_diamond', 'rock_pillar', 'stalactite', 'cave_torch'].includes(obs.type)) {
        const dist = Math.hypot(obs.x - gameCtx.player.x, obs.y - gameCtx.player.y);
        if (dist > 1200) {
          obs.active = false;
          obs.destroy3D();
          gameCtx.obstacles.splice(i, 1);
        }
      }
    }
    
    // 2. Tự động tái tạo quặng quanh người chơi (đảm bảo tối đa 12 quặng)
    const localOres = gameCtx.obstacles.filter(obs => obs.active && ['ore_stone', 'ore_iron', 'ore_gold', 'ore_diamond'].includes(obs.type));
    if (localOres.length < 12) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 350 + Math.random() * 450;
      const ox = gameCtx.player.x + Math.cos(angle) * dist;
      const oy = gameCtx.player.y + Math.sin(angle) * dist;
      
      let type = 'ore_stone';
      let rich = false;
      const r = Math.random();
      if (gameCtx.currentCaveIndex === 0) {
        type = r < 0.65 ? 'ore_stone' : r < 0.90 ? 'ore_iron' : r < 0.98 ? 'ore_gold' : 'ore_diamond';
      } else if (gameCtx.currentCaveIndex === 1) {
        type = r < 0.25 ? 'ore_stone' : r < 0.75 ? 'ore_iron' : r < 0.93 ? 'ore_gold' : 'ore_diamond';
      } else {
        type = r < 0.10 ? 'ore_stone' : r < 0.30 ? 'ore_iron' : r < 0.75 ? 'ore_gold' : 'ore_diamond';
        rich = true;
      }
      
      const ore = new Obstacle(ox, oy, type);
      if (rich) {
        ore.maxHp *= 2;
        ore.hp = ore.maxHp;
        ore.rich = true;
      }
      gameCtx.obstacles.push(ore);
    }
    
    // 3. Tự động tái tạo cột đá stalagmites (đảm bảo tối đa 6 cột đá)
    const localPillars = gameCtx.obstacles.filter(obs => obs.active && obs.type === 'rock_pillar');
    if (localPillars.length < 6) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 300 + Math.random() * 500;
      const ox = gameCtx.player.x + Math.cos(angle) * dist;
      const oy = gameCtx.player.y + Math.sin(angle) * dist;
      
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'rock_pillar'));
    }

    // 3b. Tự động tái tạo thạch nhũ stalactites (tối đa 6 thạch nhũ)
    const localStalactites = gameCtx.obstacles.filter(obs => obs.active && obs.type === 'stalactite');
    if (localStalactites.length < 6) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 300 + Math.random() * 500;
      const ox = gameCtx.player.x + Math.cos(angle) * dist;
      const oy = gameCtx.player.y + Math.sin(angle) * dist;
      
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'stalactite'));
    }

    // 3c. Tự động tái tạo đuốc phát sáng (tối đa 4 đuốc)
    const localTorches = gameCtx.obstacles.filter(obs => obs.active && obs.type === 'cave_torch');
    if (localTorches.length < 4) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 300 + Math.random() * 500;
      const ox = gameCtx.player.x + Math.cos(angle) * dist;
      const oy = gameCtx.player.y + Math.sin(angle) * dist;
      
      gameCtx.obstacles.push(new Obstacle(ox, oy, 'cave_torch'));
    }

    // 4. Dọn dẹp quái vật hang động ở quá xa (> 1200px)
    for (let i = gameCtx.enemies.length - 1; i >= 0; i--) {
      const e = gameCtx.enemies[i];
      const dist = Math.hypot(e.x - gameCtx.player.x, e.y - gameCtx.player.y);
      if (dist > 1200) {
        e.dead = true;
        e.destroy3D();
        gameCtx.enemies.splice(i, 1);
      }
    }

    // 5. Tự động tái tạo quái vật quanh người chơi (tối đa 8 quái)
    if (gameCtx.enemies.length < 8) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 450 + Math.random() * 350;
      const ex = gameCtx.player.x + Math.cos(angle) * dist;
      const ey = gameCtx.player.y + Math.sin(angle) * dist;
      
      const types = ['cave_beetle', 'cave_spider', 'cave_bat'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      gameCtx.enemies.push(new Enemy(ex, ey, type, gameCtx.waveDifficulty, gameCtx.currentMap));
    }
  } else {
    // Tự động tái tạo cây rừng trên bản đồ chính (duy trì tối thiểu 35 cây, hồi phục cực nhanh)
    const localTrees = gameCtx.obstacles.filter(obs => obs.active && obs.type === 'tree');
    let treesNeeded = 35 - localTrees.length;
    if (treesNeeded > 0) {
      let spawnedThisFrame = 0;
      for (let attempt = 0; attempt < 25 && spawnedThisFrame < Math.min(3, treesNeeded); attempt++) {
        const zone = Math.random() < 0.5 ? 'top_left' : 'bottom_right';
        let tx, ty;
        if (zone === 'top_left') {
          tx = 300 + Math.random() * 600;
          ty = 300 + Math.random() * 600;
        } else {
          tx = 1600 + Math.random() * 600;
          ty = 1600 + Math.random() * 600;
        }

        const distToPlayer = Math.hypot(tx - gameCtx.player.x, ty - gameCtx.player.y);
        if (distToPlayer > 120) {
          const check = canPlaceStructureAt(tx, ty, 15); // giảm nhẹ bán kính va chạm để dễ mọc cây cạnh nhau
          if (check.valid) {
            gameCtx.obstacles.push(new Obstacle(tx, ty, 'tree'));
            spawnedThisFrame++;
          }
        }
      }
    }

    // Tự động tái tạo thảo dược trên bản đồ chính (duy trì tối thiểu 18 cây thảo dược)
    const localHerbs = gameCtx.obstacles.filter(obs => obs.active && ['herb_red', 'herb_blue', 'herb_yellow'].includes(obs.type));
    let herbsNeeded = 18 - localHerbs.length;
    if (herbsNeeded > 0) {
      let spawnedThisFrame = 0;
      for (let attempt = 0; attempt < 15 && spawnedThisFrame < Math.min(2, herbsNeeded); attempt++) {
        const zone = Math.random() < 0.5 ? 'top_left' : 'bottom_right';
        let hx, hy;
        if (zone === 'top_left') {
          hx = 300 + Math.random() * 600;
          hy = 300 + Math.random() * 600;
        } else {
          hx = 1600 + Math.random() * 600;
          hy = 1600 + Math.random() * 600;
        }

        const distToPlayer = Math.hypot(hx - gameCtx.player.x, hy - gameCtx.player.y);
        if (distToPlayer > 120) {
          const check = canPlaceStructureAt(hx, hy, 10);
          if (check.valid) {
            const htype = ['herb_red', 'herb_blue', 'herb_yellow'][Math.floor(Math.random() * 3)];
            gameCtx.obstacles.push(new Obstacle(hx, hy, htype));
            spawnedThisFrame++;
          }
        }
      }
    }
  }

  if (gameCtx.inCave) {
    // Không giới hạn toạ độ người chơi trong hang động vô hạn
  } else {
    gameCtx.player.x = Math.max(gameCtx.player.size, Math.min(ARENA_WIDTH - gameCtx.player.size, gameCtx.player.x));
    gameCtx.player.y = Math.max(gameCtx.player.size, Math.min(ARENA_HEIGHT - gameCtx.player.size, gameCtx.player.y));
  }
}

function draw() {
  const mapInfo = MAPS[gameCtx.currentMap] || MAPS['forest'];

  // Xóa canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  const shake = particleManager.getShakeOffset();
  ctx.translate(shake.x, shake.y);

  // Vẽ nền bản đồ
  if (gameCtx.inCave) {
    // 2D Vignette radial gradient cave background
    const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7);
    bgGrad.addColorStop(0, '#0a0a14'); // Slightly brighter cave center
    bgGrad.addColorStop(0.6, '#040409');
    bgGrad.addColorStop(1, '#000000'); // Edge darkness
    ctx.fillStyle = bgGrad;
  } else {
    ctx.fillStyle = mapInfo.bgColor || '#050510';
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-camX, -camY);

  // Initialize and Draw Cave Background Floating Particles
  if (gameCtx.inCave && gameCtx.player) {
    if (!gameCtx.caveParticles) gameCtx.caveParticles = [];
    while (gameCtx.caveParticles.length < 50) {
      gameCtx.caveParticles.push({
        x: gameCtx.player.x + (Math.random() - 0.5) * canvas.width * 1.5,
        y: gameCtx.player.y + (Math.random() - 0.5) * canvas.height * 1.5,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.45 + 0.15,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -0.25 - Math.random() * 0.4,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    ctx.save();
    const caveColors = ['#00f3ff', '#9d00ff', '#ffe600'];
    const pColor = caveColors[gameCtx.currentCaveIndex] || '#00f3ff';
    ctx.fillStyle = pColor;
    
    for (const p of gameCtx.caveParticles) {
      p.x += p.speedX;
      p.y += p.speedY;
      
      const dist = Math.hypot(p.x - gameCtx.player.x, p.y - gameCtx.player.y);
      if (dist > 1000) {
        const angle = Math.random() * Math.PI * 2;
        const spawnDist = 600 + Math.random() * 300;
        p.x = gameCtx.player.x + Math.cos(angle) * spawnDist;
        p.y = gameCtx.player.y + Math.sin(angle) * spawnDist;
      }
      
      const pulseAlpha = p.alpha * (0.6 + Math.sin(Date.now() * p.pulseSpeed + p.pulseOffset) * 0.4);
      ctx.globalAlpha = pulseAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Vẽ lưới bản đồ (Neon Grid)
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.07)';
  ctx.lineWidth = 1;
  const gridSize = 80;
  ctx.beginPath();
  const startX = Math.floor(camX / gridSize) * gridSize;
  const endX = camX + canvas.width;
  for (let x = startX; x < endX; x += gridSize) {
    ctx.moveTo(x, camY);
    ctx.lineTo(x, camY + canvas.height);
  }
  const startY = Math.floor(camY / gridSize) * gridSize;
  const endY = camY + canvas.height;
  for (let y = startY; y < endY; y += gridSize) {
    ctx.moveTo(camX, y);
    ctx.lineTo(camX + canvas.width, y);
  }
  ctx.stroke();

  // Vẽ vân quặng phát sáng trên nền đất của hang động
  if (gameCtx.inCave && gameCtx.player) {
    ctx.save();
    const veinColors = ['#00f3ff', '#9d00ff', '#ffe600'];
    const veinColor = veinColors[gameCtx.currentCaveIndex] || '#00f3ff';
    ctx.strokeStyle = veinColor;
    // Breathing pulsed opacity
    ctx.globalAlpha = 0.16 + Math.sin(Date.now() * 0.002) * 0.08;
    ctx.lineWidth = 2.0;
    
    const gridSz = 200;
    const startGX = Math.floor((gameCtx.player.x - 700) / gridSz) * gridSz;
    const endGX = Math.ceil((gameCtx.player.x + 700) / gridSz) * gridSz;
    const startGY = Math.floor((gameCtx.player.y - 700) / gridSz) * gridSz;
    const endGY = Math.ceil((gameCtx.player.y + 700) / gridSz) * gridSz;
    
    for (let gx = startGX; gx < endGX; gx += gridSz) {
      for (let gy = startGY; gy < endGY; gy += gridSz) {
        const seed = Math.sin(gx * 0.05 + gy * 0.12) * 10000;
        const offset = seed - Math.floor(seed);
        
        ctx.beginPath();
        ctx.moveTo(gx + gridSz * 0.2, gy + gridSz * 0.2);
        ctx.lineTo(gx + gridSz * (0.3 + offset * 0.4), gy + gridSz * (0.4 - offset * 0.2));
        ctx.lineTo(gx + gridSz * (0.6 - offset * 0.2), gy + gridSz * (0.5 + offset * 0.3));
        ctx.lineTo(gx + gridSz * 0.8, gy + gridSz * 0.8);
        
        ctx.moveTo(gx + gridSz * (0.3 + offset * 0.4), gy + gridSz * (0.4 - offset * 0.2));
        ctx.lineTo(gx + gridSz * (0.2 + offset * 0.2), gy + gridSz * 0.7);
        
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Vẽ biên giới đấu trường (nếu ở ngoài map chính)
  if (!gameCtx.inCave) {
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
  }

  // Vẽ các vệt dung nham (Volcano map)
  if (!gameCtx.inCave) {
    for (const patch of gameCtx.lavaPatches) {
      patch.draw(ctx);
    }
  }

  // Vẽ ngọc kinh nghiệm XP
  for (const gem of gameCtx.xpGems) {
    gem.draw(ctx);
  }

  // Vẽ bình máu nhặt
  for (const pickup of gameCtx.healthPickups) {
    pickup.draw(ctx);
  }

  // Vẽ tài nguyên rơi
  for (const pickup of gameCtx.resourcePickups) {
    pickup.draw(ctx);
  }

  // Vẽ công trình, bẫy & quặng mỏ
  for (const obs of gameCtx.obstacles) {
    obs.draw(ctx);
  }

  // Vẽ cổng vào/ra hang động
  if (!gameCtx.inCave) {
    for (const portal of gameCtx.caveEntrances) {
      portal.draw(ctx);
    }
  } else {
    for (const portal of gameCtx.caveExits) {
      portal.draw(ctx);
    }
  }

  // Vẽ nhân vật chính
  if (gameCtx.player) {
    gameCtx.player.draw(ctx);
  }

  // Vẽ kẻ địch
  for (const e of gameCtx.enemies) {
    e.draw(ctx, gameCtx.player);
  }

  // Vẽ phép thuật người chơi
  for (const s of gameCtx.playerSpells) {
    s.draw(ctx);
  }

  // Vẽ đạn trụ súng
  for (const tb of gameCtx.turretBullets) {
    tb.draw(ctx);
  }

  // Vẽ đạn kẻ địch
  for (const b of gameCtx.enemyBullets) {
    b.draw(ctx);
  }

  // Vẽ số sát thương nổi
  for (const ft of gameCtx.floatingTexts) {
    ft.draw(ctx);
  }

  // Vẽ hiệu ứng hạt
  particleManager.draw(ctx);

  const enableDarkMask = false;
  if (gameCtx.inCave && enableDarkMask) {
    ctx.save();
    // Vẽ mặt nạ tối che khuất khu vực nhìn thấy của hang động
    ctx.fillStyle = 'rgba(4, 4, 10, 0.88)';
    ctx.fillRect(camX - 50, camY - 50, canvas.width + 100, canvas.height + 100);
    
    // Sử dụng destination-out để cắt các lỗ sáng hình tròn
    ctx.globalCompositeOperation = 'destination-out';
    
    // 1. Vùng sáng của người chơi
    if (gameCtx.player) {
      const p = gameCtx.player;
      const rad = 185 + Math.sin(Date.now() * 0.005) * 8;
      const grad = ctx.createRadialGradient(p.x, p.y, 20, p.x, p.y, rad);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.55)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 2. Vùng sáng từ Đuốc và Quặng phát sáng
    for (const obs of gameCtx.obstacles) {
      if (!obs.active) continue;
      if (obs.x < camX - 100 || obs.x > camX + canvas.width + 100 || obs.y < camY - 100 || obs.y > camY + canvas.height + 100) continue;
      
      let rad = 0;
      let intensity = 1.0;
      if (obs.type === 'cave_torch') {
        rad = 115 + Math.sin(Date.now() * 0.025 + obs.x) * 12;
      } else if (['ore_stone', 'ore_iron', 'ore_gold', 'ore_diamond'].includes(obs.type)) {
        rad = 60;
        intensity = 0.55;
      } else if (obs.type === 'auto_miner') {
        rad = 95 + Math.sin(Date.now() * 0.01) * 6;
        intensity = 0.85;
      }
      
      if (rad > 0) {
        const grad = ctx.createRadialGradient(obs.x, obs.y, 5, obs.x, obs.y, rad);
        grad.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
        grad.addColorStop(0.4, `rgba(255, 255, 255, ${intensity * 0.4})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Vùng sáng từ cổng ra
    for (const exit of gameCtx.caveExits) {
      if (exit.x < camX - 150 || exit.x > camX + canvas.width + 150 || exit.y < camY - 150 || exit.y > camY + canvas.height + 150) continue;
      const rad = 135;
      const grad = ctx.createRadialGradient(exit.x, exit.y, 20, exit.x, exit.y, rad);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(exit.x, exit.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  ctx.restore(); // Kết thúc camera translate

  // Vẽ mũi tên chỉ hướng về giếng trời cổng ra khi ở trong hang động
  if (gameCtx.inCave && gameCtx.player) {
    const exit = gameCtx.caveExits[gameCtx.currentCaveIndex];
    if (exit) {
      const dx = exit.x - gameCtx.player.x;
      const dy = exit.y - gameCtx.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 250) {
        const angle = Math.atan2(dy, dx);
        ctx.save();
        
        const arrowDist = 120;
        const arrowX = canvas.width / 2 + Math.cos(angle) * arrowDist;
        const arrowY = canvas.height / 2 + Math.sin(angle) * arrowDist;
        
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);
        
        ctx.fillStyle = '#00ff7f';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff7f';
        
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-6, -8);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-6, 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    }
  }

  // Vẽ bóng tối ban đêm
  if (gameCtx.gameState === 'PLAYING' && gameCtx.waveState === 'ACTIVE') {
    ctx.save();
    ctx.fillStyle = 'rgba(5, 5, 25, 0.42)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const vign = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * 0.35, canvas.width / 2, canvas.height / 2, canvas.width * 0.85);
    vign.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vign.addColorStop(1, 'rgba(0, 0, 10, 0.82)');
    ctx.fillStyle = vign;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // Vẽ preview công trình tại vị trí chuột khi ở Build Mode
  if (gameCtx.gameState === 'PLAYING' && gameCtx.player && gameCtx.player.activeMode === 'build') {
    const type = gameCtx.player.selectedBuildType;
    let previewSize = 16;
    let previewColor = 'rgba(0, 243, 255, 0.5)';
    if (type === 'barricade') { previewSize = 18; previewColor = 'rgba(0, 255, 127, 0.5)'; }
    else if (type === 'stonewall') { previewSize = 22; previewColor = 'rgba(135, 206, 250, 0.5)'; }
    else if (type === 'ironwall') { previewSize = 24; previewColor = 'rgba(218, 112, 214, 0.5)'; }
    else if (type === 'campfire') { previewSize = 16; previewColor = 'rgba(255, 69, 0, 0.5)'; }
    else if (type === 'spiketrap') { previewSize = 20; previewColor = 'rgba(255, 230, 0, 0.5)'; }
    else if (type === 'turret') { previewSize = 16; previewColor = 'rgba(0, 243, 255, 0.5)'; }
    else if (type === 'flame_turret') { previewSize = 16; previewColor = 'rgba(255, 69, 0, 0.5)'; }
    else if (type === 'tesla_turret') { previewSize = 16; previewColor = 'rgba(204, 0, 255, 0.5)'; }
    else if (type === 'electric_fence') { previewSize = 20; previewColor = 'rgba(0, 255, 255, 0.5)'; }
    else if (type === 'elemental_bomb') { previewSize = 15; previewColor = 'rgba(255, 0, 255, 0.5)'; }
    else if (type === 'auto_miner') { previewSize = 20; previewColor = 'rgba(0, 243, 255, 0.5)'; }
    else if (type === 'alchemy_table') { previewSize = 20; previewColor = 'rgba(204, 51, 255, 0.5)'; }
    
    let isPlaceable = true;
    if (typeof window.canPlaceStructureAt === 'function') {
      isPlaceable = window.canPlaceStructureAt(mouse.x, mouse.y, previewSize).valid;
    }
    if (!isPlaceable) {
      previewColor = 'rgba(255, 0, 85, 0.65)';
    }
    
    ctx.save();
    const mx = mouse.x - camX;
    const my = mouse.y - camY;
    ctx.shadowBlur = 8;
    ctx.shadowColor = previewColor;
    
    ctx.strokeStyle = previewColor;
    ctx.lineWidth = 2;
    ctx.fillStyle = previewColor.replace('0.5', '0.15').replace('0.65', '0.2');
    
    ctx.beginPath();
    ctx.arc(mx, my, previewSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw placement range (circle around player showing build range, say 250px)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(gameCtx.player.x - camX, gameCtx.player.y - camY, 250, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore(); // Kết thúc screen shake

  if (gameCtx.gameState === 'PLAYING') {
    // Vẽ tâm ngắm ở tọa độ chuột trên màn hình
    const rect = canvas.getBoundingClientRect();
    const mouseScreenX = mouse.x - camX;
    const mouseScreenY = mouse.y - camY;
    drawCrosshair(ctx, mouseScreenX, mouseScreenY);
    
    drawMinimap();

    ctx.save();
    ctx.font = "bold 16px 'Orbitron', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#00f3ff";
    ctx.textAlign = "center";
    
    let waveText = "";
    if (gameCtx.waveState === 'BREAK') {
      const minutesLeft = Math.floor(gameCtx.waveTimer / 3600);
      const secondsLeft = Math.floor((gameCtx.waveTimer % 3600) / 60).toString().padStart(2, '0');
      waveText = `SÁNG (NGÀY ${gameCtx.currentWave}): CHUẨN BỊ... ${minutesLeft}:${secondsLeft}`;
      ctx.fillStyle = "#ffe600";
      ctx.shadowColor = "#ffe600";
    } else {
      const remaining = gameCtx.enemies.length + gameCtx.enemiesToSpawnInWave;
      waveText = `ĐÊM (NGÀY ${gameCtx.currentWave}): TIÊU DIỆT QUÁI VẬT! (CÒN LẠI: ${remaining})`;
      ctx.fillStyle = "#ff00f3";
      ctx.shadowColor = "#ff00f3";
    }
    ctx.fillText(waveText, canvas.width / 2, 40);
    ctx.restore();

    if (gameCtx.waveAnnouncementTimer > 0) {
      gameCtx.waveAnnouncementTimer--;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      let alpha = 1.0;
      if (gameCtx.waveAnnouncementTimer < 30) {
        alpha = gameCtx.waveAnnouncementTimer / 30;
      } else if (gameCtx.waveAnnouncementTimer > 120) {
        alpha = (150 - gameCtx.waveAnnouncementTimer) / 30;
      }
      
      ctx.globalAlpha = Math.max(0, Math.min(1.0, alpha));
      ctx.font = "900 50px 'Orbitron', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#ff0055";
      ctx.fillText(`BẮT ĐẦU ĐÊM ${gameCtx.currentWave}`, canvas.width / 2, canvas.height / 2 - 50);
      
      ctx.font = "bold 16px 'Orbitron', sans-serif";
      ctx.fillStyle = "#8fa0dd";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#8fa0dd";
      ctx.fillText("QUÁI VẬT ĐANG ĐẾN... HÃY PHÒNG THỦ!", canvas.width / 2, canvas.height / 2 + 10);
      ctx.restore();
    }
  }
}

function drawMinimap() {
  const mCanvas = document.getElementById('minimap-canvas');
  if (!mCanvas) return;
  const mCtx = mCanvas.getContext('2d');
  mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);

  const cx = mCanvas.width / 2;
  const cy = mCanvas.height / 2;
  const radius = mCanvas.width / 2;

  // In lobby, draw using LOBBY.player
  const p = (gameCtx.gameState === 'LOBBY' || gameCtx.gameState === 'LOBBY_MODAL') ? LOBBY.player : gameCtx.player;
  if (!p) return;

  const mapScale = radius / 800;

  // Fill background with selected map color in lobby
  if (gameCtx.gameState === 'LOBBY' || gameCtx.gameState === 'LOBBY_MODAL') {
    const mapColors = {
      'forest': '#05200c',
      'volcano': '#250505',
      'temple': '#180520',
      'castle': '#051825'
    };
    const mapGridColors = {
      'forest': 'rgba(0, 255, 127, 0.1)',
      'volcano': 'rgba(255, 69, 0, 0.1)',
      'temple': 'rgba(157, 0, 255, 0.1)',
      'castle': 'rgba(0, 191, 255, 0.1)'
    };
    const currentTheme = gameCtx.currentMap || 'forest';
    
    mCtx.save();
    // Clip to circular canvas
    mCtx.beginPath();
    mCtx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
    mCtx.clip();
    
    // Draw map background
    mCtx.fillStyle = mapColors[currentTheme] || '#050510';
    mCtx.fill();
    
    // Draw simple grid representing "map"
    mCtx.strokeStyle = mapGridColors[currentTheme] || 'rgba(0, 243, 255, 0.08)';
    mCtx.lineWidth = 1;
    const gridSpacing = 20;
    mCtx.beginPath();
    for (let x = 0; x < mCanvas.width; x += gridSpacing) {
      mCtx.moveTo(x, 0);
      mCtx.lineTo(x, mCanvas.height);
    }
    for (let y = 0; y < mCanvas.height; y += gridSpacing) {
      mCtx.moveTo(0, y);
      mCtx.lineTo(mCanvas.width, y);
    }
    mCtx.stroke();
    
    mCtx.restore();
  }

  const colors = {
    'ignis': '#ff4500',
    'marina': '#00bfff',
    'zephyr': '#00ff7f',
    'tesla': '#ffff00'
  };
  const playerColor = colors[gameCtx.currentCharacter] || '#ffffff';
  mCtx.save();
  mCtx.shadowBlur = 4;
  mCtx.shadowColor = playerColor;
  mCtx.fillStyle = playerColor;
  mCtx.beginPath();
  mCtx.arc(cx, cy, 3, 0, Math.PI * 2);
  mCtx.fill();
  mCtx.restore();

  if (gameCtx.gameState === 'PLAYING') {
    for (const e of gameCtx.enemies) {
      if (e.dead) continue;
      const dx = e.x - gameCtx.player.x;
      const dy = e.y - gameCtx.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 800) {
        const mx = cx + dx * mapScale;
        const my = cy + dy * mapScale;

        const distFromCenter = Math.hypot(mx - cx, my - cy);
        if (distFromCenter < radius - 3) {
          mCtx.fillStyle = e.color;
          mCtx.beginPath();
          mCtx.arc(mx, my, e.type === 'boss' ? 3.5 : 1.8, 0, Math.PI * 2);
          mCtx.fill();
        }
      }
    }
  }
}

let _fpsLastTime = 0;
let _fpsSamples = [];
function loop(timestamp) {
  // FPS tracking
  if (_fpsLastTime > 0) {
    const delta = timestamp - _fpsLastTime;
    if (delta > 0) {
      _fpsSamples.push(1000 / delta);
      if (_fpsSamples.length > 30) _fpsSamples.shift();
      window._lastFps = _fpsSamples.reduce((a, b) => a + b, 0) / _fpsSamples.length;
    }
  }
  _fpsLastTime = timestamp;

  // Lobby state
  if (gameCtx.gameState === 'LOBBY') {
    updateLobby();
    drawLobby();
    drawMinimap();
    requestAnimationFrame(loop);
    return;
  }

  // While a modal is open over the lobby (LOBBY_MODAL) still draw lobby underneath
  if (gameCtx.gameState === 'LOBBY_MODAL') {
    drawLobby();
    drawMinimap();
    requestAnimationFrame(loop);
    return;
  }

  update();
  draw();
  requestAnimationFrame(loop);
}

// ==========================================
// INITIALIZATION (KHỞI TẠO BỘ ĐIỀU KHIỂN)
// ==========================================
function setupWaveControl() {
  const skipBtn = document.getElementById('skip-wave-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      if (gameCtx.waveState === 'BREAK') {
        gameCtx.waveTimer = 0;
      }
    });
  }
}

function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', handleResize);

startBtn.addEventListener('click', () => {
  // "VÀO SẢNH CHỜ" button goes to lobby
  enterLobby();
});

restartBtn.addEventListener('click', () => {
  startGame();
});

if (gameOverExitBtn) {
  gameOverExitBtn.addEventListener('click', () => {
    exitToMenu(); // now routes through enterLobby()
  });
}

// ── Lobby: play-btn (from portal hotspot game-setup-modal) ──────────────
const playBtn = document.getElementById('play-btn');
if (playBtn && !playBtn.dataset.listenerSet) {
  playBtn.dataset.listenerSet = 'true';
  playBtn.addEventListener('click', () => {
    gameCtx.gameState = 'PLAYING';
    const modal = document.getElementById('game-setup-modal');
    if (modal) modal.classList.remove('active');
    const lobbyHud = document.getElementById('lobby-hud');
    if (lobbyHud) lobbyHud.style.display = 'none';
    startGame();
  });
}

// ── Lobby: close-game-setup-btn → back to lobby ──────────────────────────
const closeGameSetupBtn = document.getElementById('close-game-setup-btn');
if (closeGameSetupBtn && !closeGameSetupBtn.dataset.listenerSet) {
  closeGameSetupBtn.dataset.listenerSet = 'true';
  closeGameSetupBtn.addEventListener('click', () => {
    const modal = document.getElementById('game-setup-modal');
    if (modal) modal.classList.remove('active');
    gameCtx.gameState = 'LOBBY';
  });
}

// ── Lobby: char-select-modal close → back to lobby ───────────────────
// When user finishes character selection, close char-select-modal and return to lobby
const charSelectModalPanel = document.getElementById('char-select-modal');
if (charSelectModalPanel) {
  // Clicking outside the panel card closes char-select-modal in lobby context
  charSelectModalPanel.addEventListener('click', (e) => {
    if (e.target === charSelectModalPanel && gameCtx.gameState === 'LOBBY_MODAL') {
      charSelectModalPanel.classList.remove('active');
      gameCtx.gameState = 'LOBBY';
      // Also update character color
      const charColors = { 
        ignis: '#ff4500', 
        marina: '#00aaff', 
        zephyr: '#00ff88', 
        tesla: '#ffe600',
        gaia: '#4caf50',
        wolf: '#ff003c',
        cobra: '#a020f0',
        monk: '#ff9f43',
        artemis: '#00dbff',
        bloodmage: '#ff003c',
        shadow: '#34495e',
        paladin: '#ffd700'
      };
      LOBBY.player.color = charColors[gameCtx.currentCharacter] || '#00f3ff';
    }
  });
}

const closeCharSelectBtn = document.getElementById('close-char-select-btn');
if (closeCharSelectBtn && !closeCharSelectBtn.dataset.lobbyListenerSet) {
  closeCharSelectBtn.dataset.lobbyListenerSet = 'true';
  closeCharSelectBtn.addEventListener('click', () => {
    if (gameCtx.gameState === 'LOBBY_MODAL') {
      const charSelectModal = document.getElementById('char-select-modal');
      if (charSelectModal) charSelectModal.classList.remove('active');
      gameCtx.gameState = 'LOBBY';
      // Also update character color
      const charColors = { 
        ignis: '#ff4500', 
        marina: '#00aaff', 
        zephyr: '#00ff88', 
        tesla: '#ffe600',
        gaia: '#4caf50',
        wolf: '#ff003c',
        cobra: '#a020f0',
        monk: '#ff9f43',
        artemis: '#00dbff',
        bloodmage: '#ff003c',
        shadow: '#34495e',
        paladin: '#ffd700'
      };
      LOBBY.player.color = charColors[gameCtx.currentCharacter] || '#00f3ff';
    }
  });
}

// ── Lobby: shop close → back to lobby ───────────────────────────────────
const closeShopBtn2 = document.getElementById('close-shop-btn');
if (closeShopBtn2 && !closeShopBtn2.dataset.lobbyListenerSet) {
  closeShopBtn2.dataset.lobbyListenerSet = 'true';
  closeShopBtn2.addEventListener('click', () => {
    if (gameCtx.gameState === 'LOBBY_MODAL') {
      gameCtx.gameState = 'LOBBY';
    }
  });
}

// ── Lobby: settings close → back to lobby ───────────────────────────────
const closeSettingsBtn2 = document.getElementById('close-settings-btn');
if (closeSettingsBtn2 && !closeSettingsBtn2.dataset.lobbyListenerSet) {
  closeSettingsBtn2.dataset.lobbyListenerSet = 'true';
  closeSettingsBtn2.addEventListener('click', () => {
    if (gameCtx.gameState === 'LOBBY_MODAL') {
      gameCtx.gameState = 'LOBBY';
    }
  });
}

// ── Lobby: logout button ─────────────────────────────────────────────────
const lobbyLogoutBtn = document.getElementById('lobby-logout-btn');
if (lobbyLogoutBtn && !lobbyLogoutBtn.dataset.listenerSet) {
  lobbyLogoutBtn.dataset.listenerSet = 'true';
  lobbyLogoutBtn.addEventListener('click', () => {
    const lobbyHud = document.getElementById('lobby-hud');
    if (lobbyHud) lobbyHud.style.display = 'none';
    logout();
    gameCtx.gameState = 'MENU';
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) loginScreen.classList.add('active');
    canvas.style.cursor = 'auto';
  });
}

window.enterLobby = enterLobby;
window.initGame = initGame;
window.startGame = startGame;
window.exitToMenu = exitToMenu;


try {
  handleResize();
  setupInputs();
  setupCrosshairCustomizer();
  setupMapSelection(MAPS);
  setupDifficultySelection();
  setupAuth();
  checkSession();
  initSidebarCooldownPanel();
  setupWaveControl();
  
  // Trỏ chuột hoạt động bình thường trong game 2D
  
  // Khởi động Animation Loop
  requestAnimationFrame(loop);
} catch (err) {
  console.error("Lỗi sập game lúc load file:", err);
  
  // Giao diện báo lỗi khẩn cấp nếu game crash
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100%';
  errorDiv.style.height = '100%';
  errorDiv.style.background = 'rgba(10,10,25,0.95)';
  errorDiv.style.color = '#ff3366';
  errorDiv.style.padding = '30px';
  errorDiv.style.zIndex = '99999';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.style.fontSize = '14px';
  errorDiv.style.lineHeight = '1.6';
  errorDiv.style.whiteSpace = 'pre-wrap';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.boxSizing = 'border-box';
  errorDiv.style.border = '3px solid #ff3366';
  
  errorDiv.innerHTML = '<h1 style="color:#ff3366;margin-top:0;font-size:28px;text-shadow:0 0 10px rgba(255,51,102,0.3);">⚠️ LỖI CHẠY GAME (DETAILED CRASH REPORT)</h1>' +
    '<p style="font-size:16px;color:#fff;background:rgba(255,51,102,0.1);padding:10px;border-radius:4px;"><b>Lỗi chi tiết:</b> ' + err.message + '</p>' +
    '<p style="background:rgba(0,0,0,0.5);padding:15px;border-radius:4px;border:1px solid rgba(255,255,255,0.1);"><b>Stack Trace:</b><br>' + (err.stack ? err.stack : 'N/A') + '</p>' +
    '<button onclick="location.reload()" style="background:#ff3366;color:#fff;border:none;padding:12px 24px;cursor:pointer;font-weight:bold;margin-top:15px;border-radius:4px;box-shadow:0 0 15px rgba(255,51,102,0.4);font-family:\'Orbitron\',sans-serif;letter-spacing:1px;">TẢI LẠI TRANG 🔄</button>';
  document.body.appendChild(errorDiv);
}
