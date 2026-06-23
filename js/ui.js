// Removed imports to support global script loading.
// CHARACTERS, SPELL_RECIPES, getActualSpellCD, database functions, particleManager, and soundManager are loaded globally.
// initGame, startGame, and exitToMenu are defined globally in game.js.

// Global variables (gameCtx, keys, mouse, canvas, ctx) are accessed directly as they are declared in config.js.
// getRandomUpgrades is loaded globally.

const ACCESSORIES = [
  // COSMETIC
  {
    id: 'crown',
    category: 'cosmetic',
    name: 'Vương Miện Hoàng Gia 👑',
    desc: 'Vương miện hoàng gia lấp lánh nâng tầm đẳng cấp.',
    rarity: 'rare',
    cost: 500
  },
  {
    id: 'wings',
    category: 'cosmetic',
    name: 'Cánh Thiên Thần 🪽',
    desc: 'Đôi cánh thiên thần vỗ nhẹ mỗi khi di chuyển.',
    rarity: 'epic',
    cost: 1200
  },
  {
    id: 'aura',
    category: 'cosmetic',
    name: 'Hào Quang Tinh Hệ 🌌',
    desc: 'Hào quang vũ trụ tỏa sáng lấp lánh bao quanh pháp sư.',
    rarity: 'legendary',
    cost: 2500
  },
  {
    id: 'demon_horns',
    category: 'cosmetic',
    name: 'Sừng Ác Ma 😈',
    desc: 'Cặp sừng ác ma rực đỏ đầy quyền lực.',
    rarity: 'mythical',
    cost: 5000
  },
  
  // PET
  {
    id: 'pet_slime',
    category: 'pet',
    name: 'Bong Bóng Nước Slime 🫧',
    desc: 'Slime bong bóng đi cùng tự động bắn bóng làm chậm quái.',
    rarity: 'rare',
    cost: 800
  },
  {
    id: 'pet_fairy',
    category: 'pet',
    name: 'Tiên Nữ Hộ Mệnh 🧚',
    desc: 'Tiên nữ nhỏ đi cùng tự động hồi phục 3 máu mỗi 5 giây.',
    rarity: 'epic',
    cost: 1800
  },
  {
    id: 'pet_dragon',
    category: 'pet',
    name: 'Rồng Lửa Nhỏ 🐉',
    desc: 'Rồng lửa hộ vệ bay quanh tự động bắn hỏa cầu gây 15 sát thương.',
    rarity: 'legendary',
    cost: 4000
  },

  // STAT BOOSTS
  {
    id: 'boots_zephyr',
    category: 'stat',
    name: 'Giày Thần Gió Zephyr 🥾',
    desc: 'Tăng vĩnh viễn +0.45 tốc độ di chuyển.',
    rarity: 'rare',
    cost: 1200,
    freeAtLevel: 2
  },
  {
    id: 'pendant_magnet',
    category: 'stat',
    name: 'Dây Chuyền Nam Châm 🧲',
    desc: 'Tăng vĩnh viễn +45 bán kính hút ngọc.',
    rarity: 'epic',
    cost: 1600,
    freeAtLevel: 3
  },
  {
    id: 'ring_diamond',
    category: 'stat',
    name: 'Nhẫn Kim Cương Đỏ 💍',
    desc: 'Tăng vĩnh viễn +20% sát thương cho tất cả chiêu thức.',
    rarity: 'legendary',
    cost: 3200,
    freeAtLevel: 5
  },
  {
    id: 'shield_paladin',
    category: 'stat',
    name: 'Khiên Hộ Vệ Paladin 🛡️',
    desc: 'Tăng vĩnh viễn +25 máu tối đa.',
    rarity: 'rare',
    cost: 1000
  },
  {
    id: 'amulet_phoenix',
    category: 'stat',
    name: 'Bùa Phượng Hoàng 🐦',
    desc: 'Hồi phục vĩnh viễn +0.2 HP mỗi giây.',
    rarity: 'epic',
    cost: 2000
  },
  {
    id: 'hourglass_time',
    category: 'stat',
    name: 'Đồng Hồ Cát Thời Gian ⏳',
    desc: 'Giảm vĩnh viễn 12% thời gian hồi chiêu.',
    rarity: 'legendary',
    cost: 3000
  },
  {
    id: 'clover_luck',
    category: 'stat',
    name: 'Cỏ Bốn Lá May Mắn 🍀',
    desc: 'Tăng vĩnh viễn +8% tỷ lệ chí mạng ma pháp.',
    rarity: 'rare',
    cost: 1500
  }
];

const crosshairSettings = {
  type: 'cross',
  color: '#00f3ff',
  size: 14,
  gap: 4,
  thickness: 2,
  opacity: 1.0,
  dot: false,
  dotSize: 3,
  outline: false,
  outlineThickness: 1,
  glow: true
};

// Extended game display/gameplay settings
window.gameSettings = {
  // Sound
  musicVolume: 40,
  sfxVolume: 70,
  autoMute: true,
  // Display
  damageNumbers: true,
  enemyHpBar: 'damaged',
  screenShake: true,
  screenShakeIntensity: 100,
  minimapOpacity: 80,
  hudScale: 1,
  showFps: false,
  bloodScreen: true,
  vignette: true,
  // Gameplay
  autoPause: true,
  cameraSmoothing: 10,
  language: 'vi',
  dashKey: 'space',
  showSpawnZone: false,
  autoFire: true,
  showEnemyName: false,
  // Performance
  fpsLimit: 60,
  shadowQuality: 'high',
  enableBlur: true,
  enemyGlow: true,
};

// Load saved settings from localStorage immediately
try {
  const savedCrosshair = localStorage.getItem('spellfusion_settings_crosshair');
  if (savedCrosshair) {
    Object.assign(crosshairSettings, JSON.parse(savedCrosshair));
  }
  const savedGameSettings = localStorage.getItem('spellfusion_settings_game');
  if (savedGameSettings) {
    Object.assign(window.gameSettings, JSON.parse(savedGameSettings));
  }
  const savedVolume = localStorage.getItem('spellfusion_settings_volume');
  if (savedVolume !== null) {
    window.gameVolume = parseInt(savedVolume);
  }
  const savedParticles = localStorage.getItem('spellfusion_settings_particles');
  if (savedParticles !== null) {
    window.maxParticles = parseInt(savedParticles);
  } else {
    window.maxParticles = 1000;
  }
} catch (e) {
  console.error("Failed to load settings from localStorage:", e);
}

let currentShopTab = 'cosmetic';

// Cache các DOM element
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const levelUpScreen = document.getElementById('level-up-screen');
const upgradeChoices = document.getElementById('upgrade-choices');
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');
const gameOverExitBtn = document.getElementById('game-over-exit-btn');

const hudLevel = document.getElementById('hud-level');
const hudXpBar = document.getElementById('hud-xp-bar');
const hudHealthBar = document.getElementById('hud-health-bar');
const hudKills = document.getElementById('hud-kills');
const hudScore = document.getElementById('hud-score');
const hudTimer = document.getElementById('hud-timer');

const summaryTime = document.getElementById('summary-time');
const summaryLevel = document.getElementById('summary-level');
const summaryKills = document.getElementById('summary-kills');
const summaryScore = document.getElementById('summary-score');

function updateDifficultyUI() {
  const hardBtn = document.getElementById('diff-hard-btn');
  const hardcoreBtn = document.getElementById('diff-hardcore-btn');
  if (!hardBtn || !hardcoreBtn) return;

  const maxWaveNormal = currentSaveData.maxWaveNormal || 1;
  const maxWaveHard = currentSaveData.maxWaveHard || 1;

  if (maxWaveNormal >= 20) {
    hardBtn.classList.remove('locked');
    hardBtn.disabled = false;
    hardBtn.innerHTML = 'KHÓ (x1.5 🪙)';
    hardBtn.style.cursor = 'pointer';
  } else {
    hardBtn.classList.add('locked');
    hardBtn.disabled = true;
    hardBtn.innerHTML = `KHÓ 🔒 (Đạt đợt 20)`;
    hardBtn.style.cursor = 'not-allowed';
  }

  if (maxWaveHard >= 50) {
    hardcoreBtn.classList.remove('locked');
    hardcoreBtn.disabled = false;
    hardcoreBtn.innerHTML = 'SIÊU KHÓ (x3 🪙)';
    hardcoreBtn.style.cursor = 'pointer';
  } else {
    hardcoreBtn.classList.add('locked');
    hardcoreBtn.disabled = true;
    hardcoreBtn.innerHTML = `SIÊU KHÓ 🔒 (Đạt đợt 50)`;
    hardcoreBtn.style.cursor = 'not-allowed';
  }

  document.querySelectorAll('.diff-btn').forEach(btn => {
    if (btn.getAttribute('data-diff') === gameCtx.currentDifficulty) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

function setupDifficultySelection() {
  const diffBtns = document.querySelectorAll('.diff-btn');
  diffBtns.forEach(btn => {
    if (btn.dataset.listenerSet) return;
    btn.dataset.listenerSet = "true";

    btn.addEventListener('click', () => {
      if (btn.classList.contains('locked') || btn.disabled) return;
      gameCtx.currentDifficulty = btn.getAttribute('data-diff');
      updateDifficultyUI();
    });
  });
}

function updateAccountMenuUI() {
  if (!currentSaveData) return;
  const usernameDisplay = document.getElementById('username-display');
  const menuLevel = document.getElementById('menu-level');
  const menuXpBar = document.getElementById('menu-xp-bar');
  const menuXpText = document.getElementById('menu-xp-text');
  const menuGold = document.getElementById('menu-gold');
  const shopGoldDisplay = document.getElementById('shop-gold-display');
  
  if (usernameDisplay) usernameDisplay.textContent = safeStorage.getItem('spellfusion_session') || 'guest';
  if (menuLevel) menuLevel.textContent = `LV ${currentSaveData.accountLevel}`;
  
  const xpNeeded = currentSaveData.accountLevel * 100;
  const xpPct = Math.min(100, (currentSaveData.accountXp / xpNeeded) * 100);
  if (menuXpBar) menuXpBar.style.width = `${xpPct}%`;
  if (menuXpText) menuXpText.textContent = `${currentSaveData.accountXp} / ${xpNeeded} EXP`;
  
  if (menuGold) menuGold.textContent = `${currentSaveData.gold} 🪙`;
  if (shopGoldDisplay) shopGoldDisplay.textContent = currentSaveData.gold;
  
  const char = CHARACTERS[gameCtx.currentCharacter] || CHARACTERS['ignis'];
  const activeCharCardIcon = document.getElementById('active-char-card-icon');
  const activeCharCardName = document.getElementById('active-char-card-name');
  const activeCharCardTitle = document.getElementById('active-char-card-title');
  const activeCharCard = document.getElementById('active-character-card');
  
  if (activeCharCardIcon) activeCharCardIcon.textContent = char.icon;
  if (activeCharCardName) {
    activeCharCardName.textContent = char.name;
    const rarities = {
      common: '#8fa0dd',
      rare: '#00ff7f',
      epic: '#9d00ff',
      legendary: '#ffe600',
      mythical: '#ff003c'
    };
    const glowColor = rarities[char.rarity] || '#ffffff';
    activeCharCardName.style.textShadow = `0 0 8px ${glowColor}`;
    if (activeCharCard) {
      activeCharCard.style.borderColor = glowColor;
      activeCharCard.style.boxShadow = `0 0 12px ${glowColor}33, inset 0 0 10px rgba(0,0,0,0.5)`;
    }
  }
  if (activeCharCardTitle) activeCharCardTitle.textContent = char.title;
  updateDifficultyUI();
}

function setupAuth() {
  const loginScreen = document.getElementById('login-screen');
  const startScreen = document.getElementById('start-screen');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');
  const registerUsernameInput = document.getElementById('register-username');
  const registerPasswordInput = document.getElementById('register-password');
  
  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');
  
  const goToRegister = document.getElementById('go-to-register');
  const goToLogin = document.getElementById('go-to-login');
  
  const loginFormContainer = document.getElementById('login-form-container');
  const registerFormContainer = document.getElementById('register-form-container');

  if (goToRegister) {
    goToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginFormContainer) loginFormContainer.style.display = 'none';
      if (registerFormContainer) registerFormContainer.style.display = 'block';
      if (loginMessage) loginMessage.textContent = '';
    });
  }

  if (goToLogin) {
    goToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerFormContainer) registerFormContainer.style.display = 'none';
      if (loginFormContainer) loginFormContainer.style.display = 'block';
      if (registerMessage) registerMessage.textContent = '';
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const username = loginUsernameInput ? loginUsernameInput.value.trim().toLowerCase() : '';
      const password = loginPasswordInput ? loginPasswordInput.value : '';
      
      if (!username || !password) {
        if (loginMessage) loginMessage.textContent = 'Vui lòng điền đầy đủ thông tin!';
        return;
      }
      
      const accounts = getAccounts();
      if (!accounts[username]) {
        if (loginMessage) loginMessage.textContent = 'Tài khoản không tồn tại!';
        return;
      }
      
      if (accounts[username] !== password) {
        if (loginMessage) loginMessage.textContent = 'Sai mật khẩu!';
        return;
      }
      
      loadAccountSave(username);
      if (loginScreen) loginScreen.classList.remove('active');
      updateAccountMenuUI();
      setupCharacterSelection();
      setupShop();
      if (typeof enterLobby === 'function') enterLobby();
    });
  }

  const guestLoginBtn = document.getElementById('guest-login-btn');
  if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', () => {
      const username = 'guest';
      const accounts = getAccounts();
      if (!accounts[username]) {
        accounts[username] = 'guest123';
        saveAccounts(accounts);
        localStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(DEFAULT_SAVE_DATA));
      }
      loadAccountSave(username);
      if (loginScreen) loginScreen.classList.remove('active');
      updateAccountMenuUI();
      setupCharacterSelection();
      setupShop();
      if (typeof enterLobby === 'function') enterLobby();
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      const username = registerUsernameInput ? registerUsernameInput.value.trim().toLowerCase() : '';
      const password = registerPasswordInput ? registerPasswordInput.value : '';
      
      if (!username || !password) {
        if (registerMessage) registerMessage.textContent = 'Vui lòng điền đầy đủ thông tin!';
        return;
      }
      if (username.length < 3) {
        if (registerMessage) registerMessage.textContent = 'Tên tài khoản tối thiểu 3 ký tự!';
        return;
      }
      const usernameRegex = /^[a-z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        if (registerMessage) registerMessage.textContent = 'Tên không được chứa dấu, khoảng trắng hoặc ký tự đặc biệt!';
        return;
      }
      if (password.length < 4) {
        if (registerMessage) registerMessage.textContent = 'Mật khẩu tối thiểu 4 ký tự!';
        return;
      }
      
      const accounts = getAccounts();
      if (accounts[username]) {
        if (registerMessage) registerMessage.textContent = 'Tài khoản đã tồn tại!';
        return;
      }
      
      accounts[username] = password;
      saveAccounts(accounts);
      
      localStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(DEFAULT_SAVE_DATA));
      
      if (registerMessage) {
        registerMessage.style.color = '#00ff7f';
        registerMessage.textContent = 'Đăng ký thành công! Hãy đăng nhập.';
      }
      setTimeout(() => {
        if (registerFormContainer) registerFormContainer.style.display = 'none';
        if (loginFormContainer) loginFormContainer.style.display = 'block';
        if (registerMessage) {
          registerMessage.style.color = 'var(--neon-magenta)';
          registerMessage.textContent = '';
        }
        if (loginUsernameInput) loginUsernameInput.value = username;
      }, 1000);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      if (startScreen) startScreen.classList.remove('active');
      if (loginScreen) loginScreen.classList.add('active');
      if (loginUsernameInput) loginUsernameInput.value = '';
      if (loginPasswordInput) loginPasswordInput.value = '';
      if (loginMessage) loginMessage.textContent = '';
    });
  }
}

function checkSession() {
  const sessionUser = safeStorage.getItem('spellfusion_session');
  const loginScreen = document.getElementById('login-screen');
  const startScreen = document.getElementById('start-screen');
  
  if (sessionUser) {
    const accounts = getAccounts();
    if (accounts[sessionUser]) {
      loadAccountSave(sessionUser);
      if (loginScreen) loginScreen.classList.remove('active');
      updateAccountMenuUI();
      setupCharacterSelection();
      setupShop();
      // Enter lobby directly
      if (typeof enterLobby === 'function') enterLobby();
      return;
    }
  }
  
  if (loginScreen) loginScreen.classList.add('active');
  if (startScreen) startScreen.classList.remove('active');
}

function setupShop() {
  const shopToggleBtn = document.getElementById('shop-toggle-btn');
  const shopModal = document.getElementById('shop-modal');
  const closeShopBtn = document.getElementById('close-shop-btn');
  const tabBtns = document.querySelectorAll('.shop-tab-btn');
  
  if (shopToggleBtn && shopModal) {
    if (!shopToggleBtn.dataset.listenerSet) {
      shopToggleBtn.dataset.listenerSet = "true";
      shopToggleBtn.addEventListener('click', () => {
        shopModal.classList.add('active');
        renderShopGrid();
        updateAccountMenuUI();
      });
    }
  }
  
  if (closeShopBtn && shopModal) {
    if (!closeShopBtn.dataset.listenerSet) {
      closeShopBtn.dataset.listenerSet = "true";
      closeShopBtn.addEventListener('click', () => {
        shopModal.classList.remove('active');
        updateAccountMenuUI();
      });
    }
  }
  
  tabBtns.forEach(btn => {
    if (!btn.dataset.listenerSet) {
      btn.dataset.listenerSet = "true";
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.style.color = '#8fa0dd';
        });
        btn.classList.add('active');
        btn.style.color = 'var(--neon-cyan)';
        currentShopTab = btn.getAttribute('data-tab');
        renderShopGrid();
      });
    }
  });

  window.buyAccessory = (id) => {
    const acc = ACCESSORIES.find(a => a.id === id);
    if (!acc) return;
    
    if (currentSaveData.gold < acc.cost) {
      alert('Không đủ tiền vàng!');
      return;
    }
    
    currentSaveData.gold -= acc.cost;
    currentSaveData.purchasedAccessories.push(id);
    saveAccountSave();
    renderShopGrid();
    updateAccountMenuUI();
  };
  
  window.equipAccessory = (id) => {
    const acc = ACCESSORIES.find(a => a.id === id);
    if (!acc) return;
    
    const purchasedList = currentSaveData.purchasedAccessories || [];
    if (!purchasedList.includes(id)) {
      return;
    }
    
    const category = acc.category;
    currentSaveData.equippedAccessories = currentSaveData.equippedAccessories || {};
    if (currentSaveData.equippedAccessories[category] === id) {
      delete currentSaveData.equippedAccessories[category];
    } else {
      currentSaveData.equippedAccessories[category] = id;
    }
    
    saveAccountSave();
    renderShopGrid();
    updateAccountMenuUI();
  };
}

function renderShopGrid() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  const items = ACCESSORIES.filter(a => a.category === currentShopTab);
  
  items.forEach(acc => {
    const purchasedList = currentSaveData.purchasedAccessories || [];
    const equippedMap = currentSaveData.equippedAccessories || {};
    const isPurchased = purchasedList.includes(acc.id);
    const isEquipped = equippedMap[acc.category] === acc.id;
    
    const card = document.createElement('div');
    card.className = `shop-item-card rarity-${acc.rarity}`;
    
    let icon = '🔮';
    if (acc.id === 'crown') icon = '👑';
    else if (acc.id === 'wings') icon = '🪽';
    else if (acc.id === 'aura') icon = '🌌';
    else if (acc.id === 'demon_horns') icon = '😈';
    else if (acc.id === 'pet_slime') icon = '🫧';
    else if (acc.id === 'pet_fairy') icon = '🧚';
    else if (acc.id === 'pet_dragon') icon = '🐉';
    else if (acc.id === 'boots_zephyr') icon = '🥾';
    else if (acc.id === 'pendant_magnet') icon = '🧲';
    else if (acc.id === 'ring_diamond') icon = '💍';
    else if (acc.id === 'shield_paladin') icon = '🛡️';
    else if (acc.id === 'amulet_phoenix') icon = '🐦';
    else if (acc.id === 'hourglass_time') icon = '⏳';
    else if (acc.id === 'clover_luck') icon = '🍀';

    let actionBtnHtml = '';
    if (isPurchased) {
      actionBtnHtml = `<button class="btn btn-equip ${isEquipped ? 'equipped' : ''}" onclick="window.equipAccessory('${acc.id}')">${isEquipped ? 'THÁO ❌' : 'TRANG BỊ 🛡️'}</button>`;
    } else {
      actionBtnHtml = `<button class="btn btn-buy" onclick="window.buyAccessory('${acc.id}')">MUA: ${acc.cost} 🪙</button>`;
    }
    
    const rarityTexts = {
      common: 'Thường',
      rare: 'Hiếm',
      epic: 'Sử Thi',
      legendary: 'Truyền Thuyết',
      mythical: 'Thần Thoại'
    };
    
    card.innerHTML = `
      <div class="item-rarity-badge">${rarityTexts[acc.rarity].toUpperCase()}</div>
      <div class="item-icon-wrapper" style="font-size: 2.5rem; text-align: center; margin: 0.6rem 0;">${icon}</div>
      <div class="item-name">${acc.name}</div>
      <div class="item-desc" style="font-size: 0.72rem; color: #a8b2db; min-height: 2.2rem; line-height: 1.2; margin-bottom: 0.6rem;">${acc.desc}</div>
      ${actionBtnHtml}
    `;
    
    grid.appendChild(card);
  });
}

function togglePause() {
  const pauseScreen = document.getElementById('pause-screen');
  if (!pauseScreen) return;

  if (gameCtx.gameState === 'PLAYING') {
    gameCtx.gameState = 'PAUSED';
    pauseScreen.classList.add('active');
    canvas.style.cursor = 'auto';
  } else if (gameCtx.gameState === 'PAUSED') {
    gameCtx.gameState = 'PLAYING';
    pauseScreen.classList.remove('active');
    canvas.style.cursor = 'none';
  }
}

function setupInputs() {
  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    
    if (e.key === 'Escape' || e.key === 'Esc') {
      togglePause();
    }

    if (e.key === 'b' || e.key === 'B') {
      if (gameCtx.gameState === 'PLAYING') {
        const overlay = document.getElementById('crafting-overlay');
        if (overlay) {
          if (overlay.style.display === 'none') {
            overlay.style.display = 'flex';
            updateCraftingMenu();
          } else {
            overlay.style.display = 'none';
            const selected = overlay.querySelector('.craft-item.selected');
            if (selected) {
              selected.classList.remove('selected');
              selected.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
              selected.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
          }
        }
      }
    }

    if (e.key === 'e' || e.key === 'E') {
      if (gameCtx.gameState === 'PLAYING') {
        handleInteraction();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left + gameCtx.camX;
    mouse.y = e.clientY - rect.top + gameCtx.camY;
  });

  window.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      // Nhấp chuột trái để đặt công trình khi đang chọn công thức
      const overlay = document.getElementById('crafting-overlay');
      if (overlay && overlay.style.display !== 'none' && gameCtx.gameState === 'PLAYING') {
        const selected = overlay.querySelector('.craft-item.selected');
        if (selected) {
          const rect = overlay.getBoundingClientRect();
          const insideOverlay = (
            e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom
          );
          
          if (!insideOverlay) {
            const type = selected.getAttribute('data-type');
            tryPlaceStructure(type);
            e.preventDefault();
            e.stopPropagation();
            return;
          }
        }
      }
      mouse.clicked = true;
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) mouse.clicked = false;
  });

  window.addEventListener('player-levelup', () => {
    showLevelUpScreen();
  });

  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      togglePause();
    });
  }

  const exitBtn = document.getElementById('exit-btn');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      exitToMenu();
    });
  }

  // Khởi động lắng nghe chọn thẻ chế tạo
  setupCrafting();
}

function drawCrosshair(ctx, x, y, settings = crosshairSettings) {
  ctx.save();
  ctx.globalAlpha = settings.opacity !== undefined ? settings.opacity : 1.0;
  
  const size = settings.size;
  const gap = settings.gap;
  const thickness = settings.thickness;
  const color = settings.color;
  
  // Helper to draw the cross lines
  const drawCrossLines = (context, w) => {
    context.beginPath();
    context.moveTo(x - size, y);
    context.lineTo(x - gap, y);
    context.moveTo(x + gap, y);
    context.lineTo(x + size, y);
    context.moveTo(x, y - size);
    context.lineTo(x, y - gap);
    context.moveTo(x, y + gap);
    context.lineTo(x, y + size);
    context.lineWidth = w;
    context.stroke();
  };

  const drawCircleLine = (context, w) => {
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.lineWidth = w;
    context.stroke();
  };

  const drawSquareLine = (context, w) => {
    context.lineWidth = w;
    context.strokeRect(x - size / 2, y - size / 2, size, size);
  };

  // 1. Draw outline if enabled
  if (settings.outline) {
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.shadowBlur = 0; // No glow for outline
    const outlineW = thickness + (settings.outlineThickness || 1) * 2;

    switch (settings.type) {
      case 'cross':
        drawCrossLines(ctx, outlineW);
        break;
      case 'circle':
        drawCircleLine(ctx, outlineW);
        break;
      case 'square':
        drawSquareLine(ctx, outlineW);
        break;
    }
    
    // Draw outline for center dot if dot is enabled
    if (settings.dot) {
      ctx.beginPath();
      ctx.arc(x, y, (settings.dotSize || 3) + (settings.outlineThickness || 1), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Draw active colored crosshair
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.shadowBlur = 6;
  ctx.shadowColor = color;

  switch (settings.type) {
    case 'cross':
      drawCrossLines(ctx, thickness);
      break;

    case 'dot':
      ctx.beginPath();
      ctx.arc(x, y, size / 4, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'circle':
      drawCircleLine(ctx, thickness);
      break;

    case 'square':
      drawSquareLine(ctx, thickness);
      break;
  }

  // 3. Draw active colored dot if enabled and not already drawn as main type
  if (settings.dot && settings.type !== 'dot') {
    ctx.beginPath();
    ctx.arc(x, y, settings.dotSize || 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function updateSettingsCrosshairPreview() {
  const previewCanvas = document.getElementById('settings-crosshair-preview-canvas');
  if (!previewCanvas) return;
  const pCtx = previewCanvas.getContext('2d');
  pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  drawCrosshair(pCtx, previewCanvas.width / 2, previewCanvas.height / 2);
}
// Alias for legacy calls
function updateCrosshairPreview() { updateSettingsCrosshairPreview(); }

// Global tab switcher (called from game.js for lobby interactions)
function activateTab(panelName) {
  document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-panel') === panelName;
    btn.style.borderColor = isActive ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.15)';
    btn.style.color = isActive ? 'var(--neon-cyan)' : '#8fa0dd';
    btn.style.background = isActive ? 'rgba(0,243,255,0.08)' : 'none';
  });
  document.querySelectorAll('.settings-panel').forEach(p => { p.style.display = 'none'; });
  const target = document.getElementById(`panel-${panelName}`);
  if (target) target.style.display = 'flex';
}
window.activateTab = activateTab;

function setupCrosshairCustomizer() {
  const globalSettingsBtn = document.getElementById('global-settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-btn');

  // ── Wire tab buttons (uses global activateTab) ───────────────────────────
  document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.getAttribute('data-panel'));
      // Update diagnostics when perf tab is activated
      if (btn.getAttribute('data-panel') === 'perf') updateDiagnostics();
    });
  });

  // ── Grab all input elements ──────────────────────────────────────────────
  // Sound
  const volumeInput    = document.getElementById('settings-volume');
  const volumeVal      = document.getElementById('volume-val');
  const musicVolInput  = document.getElementById('settings-music-volume');
  const musicVolVal    = document.getElementById('music-vol-val');
  const sfxVolInput    = document.getElementById('settings-sfx-volume');
  const sfxVolVal      = document.getElementById('sfx-vol-val');
  const muteCheckbox   = document.getElementById('settings-mute');
  const autoMuteCheck  = document.getElementById('settings-auto-mute');

  // Crosshair
  const typeSelect         = document.getElementById('settings-crosshair-type');
  const colorSelect        = document.getElementById('settings-crosshair-color');
  const customColorInput   = document.getElementById('settings-crosshair-custom-color');
  const sizeInput          = document.getElementById('settings-crosshair-size');
  const gapInput           = document.getElementById('settings-crosshair-gap');
  const thicknessInput     = document.getElementById('settings-crosshair-thickness');
  const opacityInput       = document.getElementById('settings-crosshair-opacity');
  const dotCheckbox        = document.getElementById('settings-crosshair-dot');
  const dotSizeInput       = document.getElementById('settings-crosshair-dot-size');
  const outlineCheckbox    = document.getElementById('settings-crosshair-outline');
  const outlineThickInput  = document.getElementById('settings-crosshair-outline-thick');
  const glowCheckbox       = document.getElementById('settings-crosshair-glow');
  const sizeVal            = document.getElementById('settings-size-val');
  const gapVal             = document.getElementById('settings-gap-val');
  const thicknessVal       = document.getElementById('settings-thickness-val');
  const opacityVal         = document.getElementById('settings-opacity-val');
  const dotSizeVal         = document.getElementById('settings-dot-size-val');
  const outlineThickVal    = document.getElementById('settings-outline-thick-val');

  // Display
  const damageNumbersCheck   = document.getElementById('settings-damage-numbers');
  const enemyHpBarSelect     = document.getElementById('settings-enemy-hp-bar');
  const screenShakeCheck     = document.getElementById('settings-screenshake');
  const shakeIntensityInput  = document.getElementById('settings-screenshake-intensity');
  const shakeIntensityVal    = document.getElementById('settings-shake-val');
  const minimapOpacityInput  = document.getElementById('settings-minimap-opacity');
  const minimapOpacityVal    = document.getElementById('settings-minimap-val');
  const hudScaleSelect       = document.getElementById('settings-hud-scale');
  const showFpsCheck         = document.getElementById('settings-show-fps');
  const bloodScreenCheck     = document.getElementById('settings-blood-screen');
  const vignetteCheck        = document.getElementById('settings-vignette');

  // Gameplay
  const autoPauseCheck       = document.getElementById('settings-auto-pause');
  const cameraSmoothInput    = document.getElementById('settings-camera-smoothing');
  const cameraSmoothVal      = document.getElementById('settings-cam-val');
  const languageSelect       = document.getElementById('settings-language');
  const dashKeySelect        = document.getElementById('settings-dash-key');
  const showSpawnZoneCheck   = document.getElementById('settings-show-spawn-zone');
  const autoFireCheck        = document.getElementById('settings-auto-fire');
  const showEnemyNameCheck   = document.getElementById('settings-show-enemy-name');

  // Performance
  const particlesSelect      = document.getElementById('settings-particles');
  const fpsLimitSelect       = document.getElementById('settings-fps-limit');
  const shadowQualitySelect  = document.getElementById('settings-shadow-quality');
  const enableBlurCheck      = document.getElementById('settings-enable-blur');
  const enemyGlowCheck       = document.getElementById('settings-enemy-glow');
  const resetBtn             = document.getElementById('settings-reset-btn');

  // ── Diagnostics update ───────────────────────────────────────────────────
  function updateDiagnostics() {
    const diagFps       = document.getElementById('diag-fps');
    const diagParticles = document.getElementById('diag-particles');
    const diagEnemies   = document.getElementById('diag-enemies');
    if (diagFps) diagFps.textContent = window._lastFps ? Math.round(window._lastFps) + ' fps' : '--';
    if (diagParticles) diagParticles.textContent = (window.particleManager && window.particleManager.particles) ? window.particleManager.particles.length : '--';
    if (diagEnemies) diagEnemies.textContent = (gameCtx && gameCtx.enemies) ? gameCtx.enemies.length : '--';
  }

  // ── Load saved values into UI ────────────────────────────────────────────
  function loadUI() {
    const gs = window.gameSettings;
    const cs = crosshairSettings;

    // Sound
    if (volumeInput)   { volumeInput.value = window.gameVolume || 50; if (volumeVal) volumeVal.textContent = volumeInput.value + '%'; }
    if (musicVolInput) { musicVolInput.value = gs.musicVolume; if (musicVolVal) musicVolVal.textContent = gs.musicVolume + '%'; }
    if (sfxVolInput)   { sfxVolInput.value = gs.sfxVolume; if (sfxVolVal) sfxVolVal.textContent = gs.sfxVolume + '%'; }
    const isMuted = localStorage.getItem('spellfusion_settings_muted') === 'true';
    if (muteCheckbox)  muteCheckbox.checked = isMuted;
    if (autoMuteCheck) autoMuteCheck.checked = gs.autoMute;
    if (isMuted) soundManager.mute(); else soundManager.unmute();

    // Crosshair
    if (typeSelect) typeSelect.value = cs.type;
    if (colorSelect) {
      const knownColors = ['#00f3ff','#ff0055','#00ff7f','#ffe600','#ff9000','#cc00ff','#ffffff'];
      colorSelect.value = knownColors.includes(cs.color) ? cs.color : 'custom';
    }
    if (customColorInput) customColorInput.value = cs.color;
    if (sizeInput)       { sizeInput.value = cs.size; if (sizeVal) sizeVal.textContent = cs.size + 'px'; }
    if (gapInput)        { gapInput.value = cs.gap; if (gapVal) gapVal.textContent = cs.gap + 'px'; }
    if (thicknessInput)  { thicknessInput.value = cs.thickness; if (thicknessVal) thicknessVal.textContent = cs.thickness + 'px'; }
    if (opacityInput)    { opacityInput.value = Math.round(cs.opacity * 100); if (opacityVal) opacityVal.textContent = Math.round(cs.opacity * 100) + '%'; }
    if (dotCheckbox)     dotCheckbox.checked = !!cs.dot;
    if (dotSizeInput)    { dotSizeInput.value = cs.dotSize || 3; if (dotSizeVal) dotSizeVal.textContent = (cs.dotSize || 3) + 'px'; }
    if (outlineCheckbox) outlineCheckbox.checked = !!cs.outline;
    if (outlineThickInput) { outlineThickInput.value = cs.outlineThickness || 1; if (outlineThickVal) outlineThickVal.textContent = (cs.outlineThickness || 1) + 'px'; }
    if (glowCheckbox)    glowCheckbox.checked = cs.glow !== false;

    // Display
    if (damageNumbersCheck)  damageNumbersCheck.checked = gs.damageNumbers;
    if (enemyHpBarSelect)    enemyHpBarSelect.value = gs.enemyHpBar;
    if (screenShakeCheck)    screenShakeCheck.checked = gs.screenShake;
    if (shakeIntensityInput) { shakeIntensityInput.value = gs.screenShakeIntensity; if (shakeIntensityVal) shakeIntensityVal.textContent = gs.screenShakeIntensity + '%'; }
    if (minimapOpacityInput) { minimapOpacityInput.value = gs.minimapOpacity; if (minimapOpacityVal) minimapOpacityVal.textContent = gs.minimapOpacity + '%'; }
    if (hudScaleSelect)      hudScaleSelect.value = gs.hudScale;
    if (showFpsCheck)        showFpsCheck.checked = gs.showFps;
    if (bloodScreenCheck)    bloodScreenCheck.checked = gs.bloodScreen;
    if (vignetteCheck)       vignetteCheck.checked = gs.vignette;

    // Gameplay
    if (autoPauseCheck)     autoPauseCheck.checked = gs.autoPause;
    if (cameraSmoothInput)  { cameraSmoothInput.value = gs.cameraSmoothing; if (cameraSmoothVal) cameraSmoothVal.textContent = gs.cameraSmoothing; }
    if (languageSelect)     languageSelect.value = gs.language;
    if (dashKeySelect)      dashKeySelect.value = gs.dashKey;
    if (showSpawnZoneCheck) showSpawnZoneCheck.checked = gs.showSpawnZone;
    if (autoFireCheck)      autoFireCheck.checked = gs.autoFire;
    if (showEnemyNameCheck) showEnemyNameCheck.checked = gs.showEnemyName;

    // Performance
    if (particlesSelect)     particlesSelect.value = window.maxParticles || 1000;
    if (fpsLimitSelect)      fpsLimitSelect.value = gs.fpsLimit;
    if (shadowQualitySelect) shadowQualitySelect.value = gs.shadowQuality;
    if (enableBlurCheck)     enableBlurCheck.checked = gs.enableBlur;
    if (enemyGlowCheck)      enemyGlowCheck.checked = gs.enemyGlow;
  }

  // ── Apply settings to game systems ──────────────────────────────────────
  function applyGameSettings() {
    const gs = window.gameSettings;
    // Apply minimap opacity via CSS variable
    document.documentElement.style.setProperty('--minimap-opacity', gs.minimapOpacity / 100);
    // Apply HUD scale
    const hud = document.getElementById('hud-container');
    if (hud) hud.style.fontSize = gs.hudScale + 'em';
    // FPS limit
    window.fpsLimit = gs.fpsLimit > 0 ? gs.fpsLimit : Infinity;
    // Screen shake intensity multiplier
    window.screenShakeMultiplier = gs.screenShake ? gs.screenShakeIntensity / 100 : 0;
  }

  // ── Save all settings to localStorage ────────────────────────────────────
  function saveAll() {
    localStorage.setItem('spellfusion_settings_crosshair', JSON.stringify(crosshairSettings));
    localStorage.setItem('spellfusion_settings_game', JSON.stringify(window.gameSettings));
    localStorage.setItem('spellfusion_settings_volume', window.gameVolume || 50);
    localStorage.setItem('spellfusion_settings_muted', muteCheckbox ? muteCheckbox.checked : false);
    localStorage.setItem('spellfusion_settings_particles', window.maxParticles || 1000);
    applyGameSettings();
  }

  // ── Toggle settings modal ────────────────────────────────────────────────
  if (globalSettingsBtn && settingsModal) {
    globalSettingsBtn.addEventListener('click', () => {
      if (gameCtx.gameState === 'PLAYING') togglePause();
      settingsModal.classList.add('active');
      activateTab('sound');
      loadUI();
      updateSettingsCrosshairPreview();
    });
  }

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.remove('active');
      saveAll();
    });
  }

  // ── Sound listeners ──────────────────────────────────────────────────────
  if (volumeInput) volumeInput.addEventListener('input', e => {
    const vol = parseInt(e.target.value);
    if (volumeVal) volumeVal.textContent = vol + '%';
    window.gameVolume = vol;
    soundManager.setVolume(vol);
  });
  if (musicVolInput) musicVolInput.addEventListener('input', e => {
    window.gameSettings.musicVolume = parseInt(e.target.value);
    if (musicVolVal) musicVolVal.textContent = e.target.value + '%';
  });
  if (sfxVolInput) sfxVolInput.addEventListener('input', e => {
    window.gameSettings.sfxVolume = parseInt(e.target.value);
    if (sfxVolVal) sfxVolVal.textContent = e.target.value + '%';
  });
  if (muteCheckbox) muteCheckbox.addEventListener('change', e => {
    e.target.checked ? soundManager.mute() : soundManager.unmute();
  });
  if (autoMuteCheck) autoMuteCheck.addEventListener('change', e => {
    window.gameSettings.autoMute = e.target.checked;
  });

  // ── Crosshair listeners ──────────────────────────────────────────────────
  if (typeSelect) typeSelect.addEventListener('change', e => { crosshairSettings.type = e.target.value; updateSettingsCrosshairPreview(); });
  if (colorSelect) colorSelect.addEventListener('change', e => {
    if (e.target.value !== 'custom') {
      crosshairSettings.color = e.target.value;
      if (customColorInput) customColorInput.value = e.target.value;
    }
    updateSettingsCrosshairPreview();
  });
  if (customColorInput) customColorInput.addEventListener('input', e => {
    crosshairSettings.color = e.target.value;
    if (colorSelect) colorSelect.value = 'custom';
    updateSettingsCrosshairPreview();
  });
  if (sizeInput) sizeInput.addEventListener('input', e => { crosshairSettings.size = parseInt(e.target.value); if (sizeVal) sizeVal.textContent = e.target.value + 'px'; updateSettingsCrosshairPreview(); });
  if (gapInput) gapInput.addEventListener('input', e => { crosshairSettings.gap = parseInt(e.target.value); if (gapVal) gapVal.textContent = e.target.value + 'px'; updateSettingsCrosshairPreview(); });
  if (thicknessInput) thicknessInput.addEventListener('input', e => { crosshairSettings.thickness = parseInt(e.target.value); if (thicknessVal) thicknessVal.textContent = e.target.value + 'px'; updateSettingsCrosshairPreview(); });
  if (opacityInput) opacityInput.addEventListener('input', e => { crosshairSettings.opacity = parseInt(e.target.value) / 100; if (opacityVal) opacityVal.textContent = e.target.value + '%'; updateSettingsCrosshairPreview(); });
  if (dotCheckbox) dotCheckbox.addEventListener('change', e => { crosshairSettings.dot = e.target.checked; updateSettingsCrosshairPreview(); });
  if (dotSizeInput) dotSizeInput.addEventListener('input', e => { crosshairSettings.dotSize = parseInt(e.target.value); if (dotSizeVal) dotSizeVal.textContent = e.target.value + 'px'; updateSettingsCrosshairPreview(); });
  if (outlineCheckbox) outlineCheckbox.addEventListener('change', e => { crosshairSettings.outline = e.target.checked; updateSettingsCrosshairPreview(); });
  if (outlineThickInput) outlineThickInput.addEventListener('input', e => { crosshairSettings.outlineThickness = parseInt(e.target.value); if (outlineThickVal) outlineThickVal.textContent = e.target.value + 'px'; updateSettingsCrosshairPreview(); });
  if (glowCheckbox) glowCheckbox.addEventListener('change', e => { crosshairSettings.glow = e.target.checked; updateSettingsCrosshairPreview(); });

  // ── Display listeners ────────────────────────────────────────────────────
  if (damageNumbersCheck)  damageNumbersCheck.addEventListener('change',  e => { window.gameSettings.damageNumbers = e.target.checked; });
  if (enemyHpBarSelect)    enemyHpBarSelect.addEventListener('change',    e => { window.gameSettings.enemyHpBar = e.target.value; });
  if (screenShakeCheck)    screenShakeCheck.addEventListener('change',    e => { window.gameSettings.screenShake = e.target.checked; window.screenShakeMultiplier = e.target.checked ? window.gameSettings.screenShakeIntensity / 100 : 0; });
  if (shakeIntensityInput) shakeIntensityInput.addEventListener('input',  e => { window.gameSettings.screenShakeIntensity = parseInt(e.target.value); if (shakeIntensityVal) shakeIntensityVal.textContent = e.target.value + '%'; if (window.gameSettings.screenShake) window.screenShakeMultiplier = parseInt(e.target.value) / 100; });
  if (minimapOpacityInput) minimapOpacityInput.addEventListener('input',  e => { window.gameSettings.minimapOpacity = parseInt(e.target.value); if (minimapOpacityVal) minimapOpacityVal.textContent = e.target.value + '%'; document.documentElement.style.setProperty('--minimap-opacity', parseInt(e.target.value) / 100); });
  if (hudScaleSelect)      hudScaleSelect.addEventListener('change',      e => { window.gameSettings.hudScale = parseFloat(e.target.value); const hud = document.getElementById('hud-container'); if (hud) hud.style.fontSize = e.target.value + 'em'; });
  if (showFpsCheck)        showFpsCheck.addEventListener('change',        e => { window.gameSettings.showFps = e.target.checked; });
  if (bloodScreenCheck)    bloodScreenCheck.addEventListener('change',    e => { window.gameSettings.bloodScreen = e.target.checked; });
  if (vignetteCheck)       vignetteCheck.addEventListener('change',       e => { window.gameSettings.vignette = e.target.checked; });

  // ── Gameplay listeners ───────────────────────────────────────────────────
  if (autoPauseCheck)     autoPauseCheck.addEventListener('change',    e => { window.gameSettings.autoPause = e.target.checked; });
  if (cameraSmoothInput)  cameraSmoothInput.addEventListener('input',  e => { window.gameSettings.cameraSmoothing = parseInt(e.target.value); if (cameraSmoothVal) cameraSmoothVal.textContent = e.target.value; });
  if (languageSelect)     languageSelect.addEventListener('change',    e => { window.gameSettings.language = e.target.value; });
  if (dashKeySelect)      dashKeySelect.addEventListener('change',     e => { window.gameSettings.dashKey = e.target.value; });
  if (showSpawnZoneCheck) showSpawnZoneCheck.addEventListener('change',e => { window.gameSettings.showSpawnZone = e.target.checked; });
  if (autoFireCheck)      autoFireCheck.addEventListener('change',     e => { window.gameSettings.autoFire = e.target.checked; });
  if (showEnemyNameCheck) showEnemyNameCheck.addEventListener('change',e => { window.gameSettings.showEnemyName = e.target.checked; });

  // ── Performance listeners ────────────────────────────────────────────────
  if (particlesSelect)     particlesSelect.addEventListener('change',    e => { window.maxParticles = parseInt(e.target.value); });
  if (fpsLimitSelect)      fpsLimitSelect.addEventListener('change',     e => { window.gameSettings.fpsLimit = parseInt(e.target.value); window.fpsLimit = parseInt(e.target.value) > 0 ? parseInt(e.target.value) : Infinity; });
  if (shadowQualitySelect) shadowQualitySelect.addEventListener('change',e => { window.gameSettings.shadowQuality = e.target.value; });
  if (enableBlurCheck)     enableBlurCheck.addEventListener('change',    e => { window.gameSettings.enableBlur = e.target.checked; document.documentElement.style.setProperty('--panel-blur', e.target.checked ? 'blur(24px)' : 'blur(0px)'); });
  if (enemyGlowCheck)      enemyGlowCheck.addEventListener('change',     e => { window.gameSettings.enemyGlow = e.target.checked; });

  // ── Reset button ─────────────────────────────────────────────────────────
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Đặt lại tất cả cài đặt về mặc định?')) return;
      Object.assign(crosshairSettings, { type: 'cross', color: '#00f3ff', size: 14, gap: 4, thickness: 2, opacity: 1.0, dot: false, dotSize: 3, outline: false, outlineThickness: 1, glow: true });
      Object.assign(window.gameSettings, { musicVolume: 40, sfxVolume: 70, autoMute: true, damageNumbers: true, enemyHpBar: 'damaged', screenShake: true, screenShakeIntensity: 100, minimapOpacity: 80, hudScale: 1, showFps: false, bloodScreen: true, vignette: true, autoPause: true, cameraSmoothing: 10, language: 'vi', dashKey: 'space', showSpawnZone: false, autoFire: true, showEnemyName: false, fpsLimit: 60, shadowQuality: 'high', enableBlur: true, enemyGlow: true });
      window.gameVolume = 50;
      window.maxParticles = 1000;
      loadUI();
      saveAll();
      updateSettingsCrosshairPreview();
      resetBtn.textContent = 'ĐÃ ĐẶT LẠI!';
      setTimeout(() => { resetBtn.textContent = 'ĐẶT LẠI CÀI ĐẶT GỐC'; }, 1500);
    });
  }

  // Apply settings on startup
  applyGameSettings();
  loadUI();
  updateSettingsCrosshairPreview();
}



function setupMapSelection(MAPS) {
  const container = document.getElementById('map-selection');
  if (!container) return;

  container.innerHTML = '';
  Object.keys(MAPS).forEach(key => {
    const map = MAPS[key];
    const card = document.createElement('div');
    card.className = `map-card map-${key} ${gameCtx.currentMap === key ? 'selected' : ''}`;
    
    card.innerHTML = `
      <div class="map-icon">${getMapIcon(key)}</div>
      <div class="map-name">${map.name}</div>
      <div class="map-desc">${map.desc}</div>
    `;
    
    card.addEventListener('click', () => {
      document.querySelectorAll('.map-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      gameCtx.currentMap = key;
    });
    
    container.appendChild(card);
  });
}

function getMapIcon(key) {
  const icons = {
    'forest': '🌲',
    'volcano': '🌋',
    'temple': '⚡',
    'castle': '❄️'
  };
  return icons[key] || '🗺️';
}

function initSidebarCooldownPanel() {
  const sidebar = document.getElementById('cooldown-sidebar');
  if (!sidebar) return;
  sidebar.innerHTML = '';
  
  const char = CHARACTERS[gameCtx.currentCharacter];
  char.spells.forEach((spellKey, index) => {
    const recipe = SPELL_RECIPES[spellKey] || SPELL_RECIPES['none'];
    const row = document.createElement('div');
    row.className = 'sidebar-spell-row';
    row.id = `sidebar-row-${index + 1}`;
    row.innerHTML = `
      <div class="sidebar-spell-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden;">
          <span class="sidebar-key">${['Z', 'X', 'C', 'V'][index]}</span>
          <span class="sidebar-name" id="sidebar-name-${index + 1}">KHOÁ</span>
        </div>
        <span class="sidebar-cd-text" id="sidebar-cd-text-${index + 1}" style="font-family: 'Orbitron', sans-serif; font-size: 0.7rem; color: var(--neon-magenta); font-weight: 700; text-shadow: 0 0 4px var(--neon-magenta);"></span>
      </div>
      <div class="sidebar-progress-bar-outer">
        <div class="sidebar-progress-bar-inner" id="sidebar-progress-${index + 1}" style="width: 0%;"></div>
        <span class="sidebar-progress-text" id="sidebar-text-${index + 1}">🔒</span>
      </div>
    `;
    sidebar.appendChild(row);
  });
}

function updateCharacterDetails(key) {
  const detailsContainer = document.getElementById('character-details');
  if (!detailsContainer) return;
  
  const char = CHARACTERS[key];
  const isUnlocked = currentSaveData.unlockedWizards.includes(key);
  
  let purchaseSectionHtml = '';
  if (isUnlocked) {
    purchaseSectionHtml = `<div style="font-family: 'Orbitron', sans-serif; font-size: 0.8rem; font-weight: bold; color: #00ff7f; text-shadow: 0 0 5px #00ff7f;">ĐÃ SỞ HỮU ✅</div>`;
  } else {
    purchaseSectionHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <span style="font-family: 'Orbitron', sans-serif; font-size: 0.82rem; font-weight: bold; color: var(--neon-yellow);">GIÁ KHÓA: ${char.cost} 🪙</span>
        <button class="btn" style="padding: 0.35rem 1rem; font-size: 0.75rem; border-color: var(--neon-yellow); background: rgba(255,230,0,0.1);" onclick="window.unlockWizard('${key}')">MỞ KHÓA 🔓</button>
      </div>
    `;
  }
  
  const rarityColors = {
    common: '#8fa0dd',
    rare: '#00ff7f',
    epic: '#9d00ff',
    legendary: '#ffe600',
    mythical: '#ff003c'
  };
  const rarityColor = rarityColors[char.rarity] || '#ffffff';
  
  const statsHtml = `
    <div class="char-details-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; font-size: 0.72rem; color: #b0c0f0; margin-top: 0.6rem; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 0.6rem;">
      <div>Máu tối đa: <strong>${char.stats.maxHp}</strong></div>
      <div>Tốc chạy: <strong>${char.stats.speed}</strong></div>
      <div>Sát thương: <strong>x${char.stats.damageModifier}</strong></div>
      <div>Hồi chiêu: <strong>x${char.stats.cooldownModifier}</strong></div>
      <div>Chí mạng: <strong>${Math.round(char.stats.critChance * 100)}%</strong></div>
    </div>
  `;

  detailsContainer.innerHTML = `
    <div class="char-details-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid ${rarityColor}55; padding-bottom: 0.5rem; margin-bottom: 0.6rem;">
      <div>
        <span class="char-details-name" style="font-family: 'Orbitron', sans-serif; font-size: 1.25rem; font-weight: 900; color: #fff; text-shadow: 0 0 8px ${rarityColor};">${char.name}</span>
        <span class="char-details-title" style="font-size: 0.8rem; color: #a8b2db; margin-left: 0.5rem;">${char.title}</span>
      </div>
      <div>${purchaseSectionHtml}</div>
    </div>
    <div class="char-details-desc" style="font-size: 0.78rem; color: #a8b2db; line-height: 1.35;">${char.desc}</div>
    ${statsHtml}
  `;
}

function setupCharacterSelection() {
  const container = document.getElementById('character-selection');
  const activeCharCard = document.getElementById('active-character-card');
  const charSelectModal = document.getElementById('char-select-modal');
  const closeCharSelectBtn = document.getElementById('close-char-select-btn');
  
  if (activeCharCard && charSelectModal) {
    if (!activeCharCard.dataset.listenerSet) {
      activeCharCard.dataset.listenerSet = "true";
      activeCharCard.addEventListener('click', () => {
        charSelectModal.classList.add('active');
        setupCharacterSelection();
      });
    }
  }
  
  if (closeCharSelectBtn && charSelectModal) {
    if (!closeCharSelectBtn.dataset.listenerSet) {
      closeCharSelectBtn.dataset.listenerSet = "true";
      closeCharSelectBtn.addEventListener('click', () => {
        charSelectModal.classList.remove('active');
        updateAccountMenuUI();
      });
    }
  }
  
  if (!container) return;

  container.innerHTML = '';
  
  window.unlockWizard = (key) => {
    const char = CHARACTERS[key];
    if (!char) return;
    
    if (currentSaveData.gold < char.cost) {
      alert('Không đủ tiền vàng!');
      return;
    }
    
    currentSaveData.gold -= char.cost;
    currentSaveData.unlockedWizards.push(key);
    saveAccountSave();
    setupCharacterSelection();
    updateCharacterDetails(key);
    updateAccountMenuUI();
  };

  Object.keys(CHARACTERS).forEach(key => {
    const char = CHARACTERS[key];
    const unlockedList = currentSaveData.unlockedWizards || ['ignis', 'marina', 'zephyr', 'tesla'];
    const isUnlocked = unlockedList.includes(key);
    
    const card = document.createElement('div');
    card.className = `char-card char-${key} ${gameCtx.currentCharacter === key ? 'selected' : ''} ${isUnlocked ? '' : 'locked'}`;
    card.title = char.name;
    
    card.innerHTML = `
      <div class="char-icon">${char.icon}</div>
      ${isUnlocked ? '' : '<div class="lock-overlay" style="position: absolute; bottom: 1px; right: 1px; font-size: 0.68rem; background: rgba(0,0,0,0.75); border-radius: 4px; padding: 0.05rem 0.2rem;">🔒</div>'}
    `;
    
    card.addEventListener('click', () => {
      if (isUnlocked) {
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        gameCtx.currentCharacter = key;
        
        // Re-create the player so stats and spells update in lobby
        gameCtx.player = new Player(ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
        
        // Update lobby avatar color
        const charColors = { ignis:'#ff4500', marina:'#00aaff', zephyr:'#00ff88', tesla:'#ffe600' };
        if (window.LOBBY && LOBBY.player) {
          LOBBY.player.color = charColors[key] || '#00f3ff';
        }
        
        initSidebarCooldownPanel();
        updateGameHUD();
      }
      updateCharacterDetails(key);
    });
    
    container.appendChild(card);
  });

  updateCharacterDetails(gameCtx.currentCharacter);
}

function updateGameHUD() {
  if (!gameCtx.player) return;
  
  hudLevel.innerText = gameCtx.player.level;
  hudKills.innerText = gameCtx.player.kills;
  hudScore.innerText = Math.round(gameCtx.player.score);
  
  const minutes = Math.floor(gameCtx.gameTime / 3600).toString().padStart(2, '0');
  const seconds = Math.floor((gameCtx.gameTime % 3600) / 60).toString().padStart(2, '0');
  hudTimer.innerText = `${minutes}:${seconds}`;

  const xpPct = Math.min(100, (gameCtx.player.xp / gameCtx.player.xpNeeded) * 100);
  hudXpBar.style.width = `${xpPct}%`;

  const hpPct = Math.max(0, (gameCtx.player.hp / gameCtx.player.maxHp) * 100);
  hudHealthBar.style.width = `${hpPct}%`;

  // Cập nhật tài nguyên HUD
  if (document.getElementById('hud-wood')) document.getElementById('hud-wood').innerText = gameCtx.player.wood || 0;
  if (document.getElementById('hud-stone')) document.getElementById('hud-stone').innerText = gameCtx.player.stone || 0;
  if (document.getElementById('hud-iron')) document.getElementById('hud-iron').innerText = gameCtx.player.iron || 0;

  // Cập nhật thanh đói bụng nếu có (Hunger)
  const hungerInner = document.getElementById('hud-hunger-bar');
  if (hungerInner) {
    const hungerPct = Math.max(0, gameCtx.player.hunger || 0);
    hungerInner.style.width = `${hungerPct}%`;
  }

  gameCtx.player.updateHUD();
}

function showLevelUpScreen() {
  gameCtx.gameState = 'LEVEL_UP';
  levelUpScreen.classList.add('active');
  canvas.style.cursor = 'auto';
  
  const upgrades = getRandomUpgrades(gameCtx.player, 3);
  upgradeChoices.innerHTML = '';

  upgrades.forEach(upg => {
    const currentLvl = gameCtx.player.upgrades[upg.id] || 0;
    const nextLvl = currentLvl + 1;
    const levelText = upg.maxLevel === 99 ? 'Hồi phục' : `Cấp ${nextLvl}/${upg.maxLevel}`;

    const card = document.createElement('div');
    card.className = `upgrade-card ${upg.rarity}`;
    card.innerHTML = `
      <div class="upgrade-rarity">${upg.rarity === 'rare' ? 'HIẾM 🌟' : 'THƯỜNG'}</div>
      <div class="upgrade-icon-wrapper">${upg.icon}</div>
      <div class="upgrade-name">${upg.name} (${levelText})</div>
      <div class="upgrade-desc">${upg.desc}</div>
    `;
    
    card.addEventListener('click', () => {
      upg.effect(gameCtx.player);
      levelUpScreen.classList.remove('active');
      gameCtx.gameState = 'PLAYING';
      canvas.style.cursor = 'none';
      updateGameHUD();
    });
    
    upgradeChoices.appendChild(card);
  });
}

function updateWaveControlPanel() {
  const panel = document.getElementById('wave-control-panel');
  const skipBtn = document.getElementById('skip-wave-btn');
  if (!panel || !skipBtn) return;

  if (gameCtx.gameState === 'PLAYING') {
    panel.style.display = 'flex';
    skipBtn.disabled = false;
    skipBtn.style.opacity = '1';
    
    if (gameCtx.waveState === 'BREAK') {
      skipBtn.textContent = 'BỎ QUA CHỜ ➔';
      skipBtn.style.borderColor = 'var(--neon-cyan)';
      skipBtn.style.background = 'rgba(0, 243, 255, 0.15)';
      skipBtn.style.boxShadow = '0 0 8px rgba(0, 243, 255, 0.3)';
    } else {
      skipBtn.textContent = 'GỌI ĐỢT KẾ ⚔️';
      skipBtn.style.borderColor = 'var(--neon-magenta)';
      skipBtn.style.background = 'rgba(255, 0, 85, 0.15)';
      skipBtn.style.boxShadow = '0 0 8px rgba(255, 0, 85, 0.3)';
    }
  } else {
    panel.style.display = 'none';
  }
}

function setupGiftcode() {
  const claimBtn = document.getElementById('giftcode-claim-btn');
  const input = document.getElementById('giftcode-input');
  const message = document.getElementById('giftcode-message');

  if (!claimBtn || !input || !message) return;

  const CODES = {
    'HELLOAIGEMINI': { gold: 500, desc: 'Quà chào mừng từ Google Gemini! 🪙' },
    'FREEWIZARD': { gold: 1000, desc: 'Hỗ trợ mở khóa Pháp Sư mới! 🪙' },
    'VIP999': { gold: 1500, desc: 'Code VIP cho chiến binh kỳ cựu! 🪙' },
    'ANTIGRAVITY': { gold: 2000, desc: 'Mã tối thượng của AI Antigravity! 🪙' },
    'MAMABOYYYYY': { gold: 999999, desc: 'Quyền lực tối cao của Admin! 👑' }
  };

  claimBtn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    if (!code) {
      message.style.color = 'var(--neon-magenta)';
      message.textContent = 'Vui lòng nhập mã code!';
      return;
    }

    if (!currentSaveData) {
      message.style.color = 'var(--neon-magenta)';
      message.textContent = 'Hãy đăng nhập trước khi nhận code!';
      return;
    }

    const reward = CODES[code];
    if (!reward) {
      message.style.color = 'var(--neon-magenta)';
      message.textContent = 'Giftcode không tồn tại!';
      return;
    }

    currentSaveData.usedCodes = currentSaveData.usedCodes || [];
    if (currentSaveData.usedCodes.includes(code)) {
      message.style.color = 'var(--neon-magenta)';
      message.textContent = 'Mã code này đã được sử dụng!';
      return;
    }

    // Nhận thưởng
    currentSaveData.gold += reward.gold;
    currentSaveData.usedCodes.push(code);
    saveAccountSave();

    // Thông báo thành công
    message.style.color = '#00ff7f';
    message.textContent = `+${reward.gold.toLocaleString()} 🪙 (${reward.desc})`;
    input.value = '';

    // Cập nhật UI
    updateAccountMenuUI();
    
    // Tự động xóa thông báo sau 4 giây
    setTimeout(() => {
      message.textContent = '';
    }, 4000);
  });
}

// Gọi setupGiftcode sau khi DOM đã sẵn sàng
setTimeout(setupGiftcode, 100);

// ==========================================
// SURVIVAL & CRAFTING SYSTEM HELPERS
// ==========================================
const CRAFT_RECIPES = {
  barricade: { wood: 10, stone: 0, iron: 0 },
  stonewall: { wood: 0, stone: 15, iron: 0 },
  ironwall: { wood: 0, stone: 0, iron: 15 },
  campfire: { wood: 15, stone: 5, iron: 0 },
  spiketrap: { wood: 5, stone: 10, iron: 0 },
  turret: { wood: 0, stone: 15, iron: 10 }
};
window.CRAFT_RECIPES = CRAFT_RECIPES;

function handleInteraction() {
  if (!gameCtx.player || gameCtx.gameState !== 'PLAYING') return;

  const p = gameCtx.player;
  if (!gameCtx.inCave) {
    // Look for nearest CaveEntrance
    let nearestEntrance = null;
    let minDist = Infinity;
    for (const ent of gameCtx.caveEntrances) {
      const dist = Math.hypot(p.x - ent.x, p.y - ent.y);
      if (dist < minDist) {
        minDist = dist;
        nearestEntrance = ent;
      }
    }
    
    if (nearestEntrance && minDist < 60) {
      // Teleport to cave
      gameCtx.lastCaveEntranceX = nearestEntrance.x;
      gameCtx.lastCaveEntranceY = nearestEntrance.y;
      gameCtx.currentCaveIndex = nearestEntrance.caveIndex || 0;
      gameCtx.inCave = true;
      gameCtx.caveMonsterSpawnTimer = 0; // reset spawn timer
      
      // Portal effect at old position
      for (let i = 0; i < 20; i++) {
        particleManager.addParticle(p.x, p.y, '#9d00ff', Math.random() * 3 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
      }
      
      // Teleport to correct cave center
      const targetCenterX = 5500 + gameCtx.currentCaveIndex * 1500;
      p.x = targetCenterX;
      p.y = 5600;
      
      // Portal effect at new position
      for (let i = 0; i < 20; i++) {
        particleManager.addParticle(p.x, p.y, '#9d00ff', Math.random() * 3 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
      }
      
      if (soundManager.playSpell) {
        soundManager.playSpell('wind_wind');
      }

      // Pre-spawn guard monsters in the cave
      if (typeof spawnCaveMonsters === 'function') {
        spawnCaveMonsters();
      }
      
      const caveNames = [
        "HANG ĐÁ THẠCH ANH (QUARTZ)",
        "HANG SẮT HỎA TIỄN (PYRITE)",
        "HANG TINH THỂ HOÀNG KIM (GOLDEN)"
      ];
      const caveName = caveNames[gameCtx.currentCaveIndex] || "HANG ĐỘNG KHAI THÁC";
      
      if (window.FloatingText && gameCtx.floatingTexts) {
        gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, "ĐÃ VÀO " + caveName, '#9d00ff'));
      }
    }
  } else {
    // Look for nearest CaveExit
    let nearestExit = null;
    let minDist = Infinity;
    for (const ex of gameCtx.caveExits) {
      const dist = Math.hypot(p.x - ex.x, p.y - ex.y);
      if (dist < minDist) {
        minDist = dist;
        nearestExit = ex;
      }
    }
    
    if (nearestExit && minDist < 60) {
      // Teleport back to main map
      gameCtx.inCave = false;
      
      // Portal effect at old position
      for (let i = 0; i < 20; i++) {
        particleManager.addParticle(p.x, p.y, '#00ff7f', Math.random() * 3 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
      }
      
      // Return to saved coordinates, or center of main map if not set
      p.x = gameCtx.lastCaveEntranceX || (ARENA_WIDTH / 2);
      p.y = gameCtx.lastCaveEntranceY || (ARENA_HEIGHT / 2);
      
      // Portal effect at new position
      for (let i = 0; i < 20; i++) {
        particleManager.addParticle(p.x, p.y, '#00ff7f', Math.random() * 3 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
      }
      
      if (soundManager.playSpell) {
        soundManager.playSpell('wind_wind');
      }
      
      if (window.FloatingText && gameCtx.floatingTexts) {
        gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, "ĐÃ TRỞ LẠI BẢN ĐỒ CHÍNH", '#00ff7f'));
      }
    }
  }
}
window.handleInteraction = handleInteraction;

function tryPlaceStructure(type) {
  if (!gameCtx.player || gameCtx.gameState !== 'PLAYING') return;
  
  const recipe = CRAFT_RECIPES[type];
  if (!recipe) return;
  
  const p = gameCtx.player;
  const wood = p.wood || 0;
  const stone = p.stone || 0;
  const iron = p.iron || 0;
  
  if (wood < recipe.wood || stone < recipe.stone || iron < recipe.iron) {
    if (window.FloatingText && gameCtx.floatingTexts) {
      gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, "KHÔNG ĐỦ TÀI NGUYÊN!", "#ff0055"));
    }
    return;
  }
  
  // Khấu trừ tài nguyên
  p.wood = wood - recipe.wood;
  p.stone = stone - recipe.stone;
  p.iron = iron - recipe.iron;
  
  // Đặt công trình tại vị trí chuột
  const wx = mouse.x;
  const wy = mouse.y;
  
  const newObs = new Obstacle(wx, wy, type);
  gameCtx.obstacles.push(newObs);
  
  // Tạo hiệu ứng hạt và âm thanh
  if (soundManager.playSpell) {
    soundManager.playSpell('earth_earth');
  }
  
  for (let i = 0; i < 12; i++) {
    particleManager.addParticle(wx, wy, newObs.color, Math.random() * 2.5 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
  }
  
  // Ẩn menu chế tạo và xóa trạng thái chọn
  const overlay = document.getElementById('crafting-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    const selected = overlay.querySelector('.craft-item.selected');
    if (selected) {
      selected.classList.remove('selected');
      selected.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
      selected.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
  }
  
  // Cập nhật lại giao diện HUD
  updateGameHUD();
}
window.tryPlaceStructure = tryPlaceStructure;

function updateCraftingMenu() {
  const overlay = document.getElementById('crafting-overlay');
  if (!overlay || !gameCtx.player) return;
  
  const p = gameCtx.player;
  const wood = p.wood || 0;
  const stone = p.stone || 0;
  const iron = p.iron || 0;
  
  const items = overlay.querySelectorAll('.craft-item');
  items.forEach(item => {
    const type = item.getAttribute('data-type');
    const recipe = CRAFT_RECIPES[type];
    if (!recipe) return;
    
    const canAfford = wood >= recipe.wood && stone >= recipe.stone && iron >= recipe.iron;
    if (canAfford) {
      item.style.opacity = '1';
      item.style.cursor = 'pointer';
    } else {
      item.style.opacity = '0.4';
      item.style.cursor = 'not-allowed';
      if (item.classList.contains('selected')) {
        item.classList.remove('selected');
        item.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
        item.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    }
  });
}
window.updateCraftingMenu = updateCraftingMenu;

function setupCrafting() {
  const overlay = document.getElementById('crafting-overlay');
  if (!overlay) return;
  const items = overlay.querySelectorAll('.craft-item');
  items.forEach(item => {
    item.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    item.addEventListener('click', (e) => {
      const type = item.getAttribute('data-type');
      const recipe = CRAFT_RECIPES[type];
      if (!recipe || !gameCtx.player) return;
      
      const p = gameCtx.player;
      const wood = p.wood || 0;
      const stone = p.stone || 0;
      const iron = p.iron || 0;
      
      if (wood < recipe.wood || stone < recipe.stone || iron < recipe.iron) {
        e.stopPropagation();
        return;
      }

      const isSelected = item.classList.contains('selected');
      items.forEach(i => {
        i.classList.remove('selected');
        i.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
        i.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });
      
      if (!isSelected) {
        item.classList.add('selected');
        item.style.backgroundColor = 'rgba(0, 243, 255, 0.08)';
        item.style.borderColor = 'var(--neon-cyan)';
      }
      e.stopPropagation();
    });
  });
}
window.setupCrafting = setupCrafting;
