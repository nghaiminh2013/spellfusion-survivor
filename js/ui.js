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
  },
  {
    id: 'glove_mining',
    category: 'stat',
    name: 'Găng Tay Khai Thác 🥊',
    desc: 'Tăng +35% tốc độ khai thác gỗ/đá/quặng bằng tay.',
    rarity: 'rare',
    cost: 1800
  },
  {
    id: 'thorn_armor',
    category: 'stat',
    name: 'Giáp Gai Thép 🦔',
    desc: 'Phản lại 20% sát thương cận chiến mà quái vật gây ra.',
    rarity: 'epic',
    cost: 2500
  }
];

window.ACCESSORIES = ACCESSORIES;

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
  window.gameSettings.keyBindings = window.gameSettings.keyBindings || {
    spell1: 'z',
    spell2: 'x',
    spell3: 'c',
    spell4: 'v',
    buildMenu: 'b',
    interact: 'e',
    modeSpell: '1',
    modeBuild: '2',
    modeGun: '3',
    dash: 'q'
  };
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
      if (window.GameInvite && window.GameInvite.isHost()) {
        window.GameInvite.updateCloudRoom();
      }
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
  
  const lobbyUser = document.getElementById('lobby-username-display');
  const lobbyLv   = document.getElementById('lobby-menu-level');
  const lobbyGold = document.getElementById('lobby-menu-gold');
  const lobbyMaxWave = document.getElementById('lobby-menu-maxwave');
  const lobbyCharIcon = document.getElementById('lobby-menu-char-icon');
  const lobbyCharName = document.getElementById('lobby-menu-char-name');
  const lobbyAdminBtn = document.getElementById('lobby-admin-btn');
  const sessionUser = safeStorage.getItem('spellfusion_session') || 'guest';

  if (usernameDisplay) usernameDisplay.textContent = sessionUser;
  if (menuLevel) menuLevel.textContent = `LV ${currentSaveData.accountLevel}`;
  
  if (lobbyUser) lobbyUser.textContent = sessionUser;
  if (lobbyLv)   lobbyLv.textContent   = currentSaveData.accountLevel;
  if (lobbyGold) lobbyGold.textContent = currentSaveData.gold;
  if (lobbyMaxWave) {
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
  
  if (lobbyCharIcon) lobbyCharIcon.textContent = char.icon;
  if (lobbyCharName) lobbyCharName.textContent = char.name;
  
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

function renderSavedAccounts() {
  const container = document.getElementById('saved-accounts-container');
  const list = document.getElementById('saved-accounts-list');
  if (!container || !list) return;
  
  const accounts = getAccounts();
  const usernames = Object.keys(accounts).filter(u => u !== 'guest');
  
  if (usernames.length === 0) {
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  list.innerHTML = '';
  
  usernames.forEach(username => {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'space-between';
    item.style.background = 'rgba(255, 255, 255, 0.03)';
    item.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    item.style.borderRadius = '6px';
    item.style.padding = '0.5rem 0.7rem';
    item.style.cursor = 'pointer';
    item.style.transition = 'all 0.2s';
    item.style.marginBottom = '0.4rem';
    
    item.onmouseenter = () => {
      item.style.background = 'rgba(0, 243, 255, 0.06)';
      item.style.borderColor = 'rgba(0, 243, 255, 0.25)';
    };
    item.onmouseleave = () => {
      item.style.background = 'rgba(255, 255, 255, 0.03)';
      item.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    };
    
    const nameSpan = document.createElement('span');
    nameSpan.style.color = '#fff';
    nameSpan.style.fontSize = '0.85rem';
    nameSpan.style.fontWeight = '500';
    nameSpan.style.textShadow = '0 0 4px rgba(255,255,255,0.2)';
    nameSpan.style.flexGrow = '1';
    nameSpan.textContent = username;
    
    nameSpan.onclick = () => {
      const uInput = document.getElementById('login-username');
      const pInput = document.getElementById('login-password');
      if (uInput) uInput.value = username;
      if (pInput) pInput.value = accounts[username];
      
      const loginBtn = document.getElementById('login-btn');
      if (loginBtn) loginBtn.click();
    };
    
    const deleteBtn = document.createElement('span');
    deleteBtn.style.color = 'var(--neon-magenta)';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '0.7rem';
    deleteBtn.style.padding = '2px 6px';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.background = 'rgba(255, 0, 85, 0.08)';
    deleteBtn.style.border = '1px solid rgba(255, 0, 85, 0.15)';
    deleteBtn.style.transition = 'all 0.15s';
    deleteBtn.textContent = 'XÓA BỘ NHỚ';
    
    deleteBtn.onmouseenter = () => {
      deleteBtn.style.background = 'rgba(255, 0, 85, 0.2)';
    };
    deleteBtn.onmouseleave = () => {
      deleteBtn.style.background = 'rgba(255, 0, 85, 0.08)';
    };
    
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Bạn có chắc chắn muốn xóa tài khoản '${username}' khỏi bộ nhớ thiết bị này?`)) {
        const localAccounts = getAccounts();
        delete localAccounts[username];
        saveAccounts(localAccounts);
        localStorage.removeItem(`spellfusion_save_${username}`);
        
        const sessionUser = localStorage.getItem('spellfusion_session');
        if (sessionUser === username) {
          localStorage.removeItem('spellfusion_session');
        }
        renderSavedAccounts();
      }
    };
    
    item.appendChild(nameSpan);
    item.appendChild(deleteBtn);
    list.appendChild(item);
  });

  // Update Sync Code display
  const displayEl = document.getElementById('display-sync-code');
  if (displayEl && window.getDeviceId) {
    const currentId = window.getDeviceId();
    displayEl.textContent = currentId;
    
    // Unbind previous onclick to prevent multiple listeners
    displayEl.onclick = null;
    displayEl.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(currentId).then(() => {
        const oldText = displayEl.textContent;
        displayEl.textContent = "ĐÃ SAO CHÉP! ✓";
        displayEl.style.color = "#00ff7f";
        setTimeout(() => {
          displayEl.textContent = oldText;
          displayEl.style.color = "var(--neon-cyan)";
        }, 1500);
      }).catch(err => {
        console.error("Failed to copy Device ID:", err);
      });
    };
  }
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
    loginBtn.addEventListener('click', async () => {
      const username = loginUsernameInput ? loginUsernameInput.value.trim().toLowerCase() : '';
      const password = loginPasswordInput ? loginPasswordInput.value : '';
      
      if (!username || !password) {
        if (loginMessage) loginMessage.textContent = 'Vui lòng điền đầy đủ thông tin!';
        return;
      }
      
      if (loginMessage) {
        loginMessage.style.color = 'var(--neon-cyan)';
        loginMessage.textContent = 'Đang đăng nhập Cloud... ⌛';
      }
      
      // Perform online login check
      const res = await onlineLogin(username, password);
      
      if (!res.success) {
        // Fallback to local login if offline or API error
        const accounts = getAccounts();
        if (accounts[username] && accounts[username] === password) {
          if (loginMessage) {
            loginMessage.style.color = 'var(--neon-yellow)';
            loginMessage.textContent = 'Đăng nhập Ngoại Tuyến (Offline)!';
          }
          loadAccountSave(username);
          setTimeout(() => {
            if (loginScreen) loginScreen.classList.remove('active');
            updateAccountMenuUI();
            setupCharacterSelection();
            setupShop();
            if (typeof enterLobby === 'function') enterLobby();
          }, 1000);
          return;
        }
        
        if (loginMessage) {
          loginMessage.style.color = 'var(--neon-magenta)';
          loginMessage.textContent = res.message;
        }
        return;
      }
      
      if (loginMessage) {
        loginMessage.style.color = '#00ff7f';
        loginMessage.textContent = res.message || 'Đăng nhập thành công! 🎉';
      }
      renderSavedAccounts();
      
      setTimeout(() => {
        if (loginScreen) loginScreen.classList.remove('active');
        updateAccountMenuUI();
        setupCharacterSelection();
        setupShop();
        if (typeof enterLobby === 'function') enterLobby();
      }, 800);
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
    registerBtn.addEventListener('click', async () => {
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
      
      if (registerMessage) {
        registerMessage.style.color = 'var(--neon-cyan)';
        registerMessage.textContent = 'Đang đăng ký Cloud... ⌛';
      }
      
      // Perform online registration
      const res = await onlineRegister(username, password);
      
      if (!res.success) {
        if (registerMessage) {
          registerMessage.style.color = 'var(--neon-magenta)';
          registerMessage.textContent = res.message;
        }
        return;
      }
      
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
      renderSavedAccounts();
    });
  }
  renderSavedAccounts();
  if (window.syncAccountsWithCloud) {
    window.syncAccountsWithCloud().then(() => renderSavedAccounts());
  }
}

async function checkSession() {
  const sessionUser = safeStorage.getItem('spellfusion_session');
  const loginScreen = document.getElementById('login-screen');
  const startScreen = document.getElementById('start-screen');
  
  if (sessionUser) {
    // Check if banned
    if (sessionUser !== 'guest' && window.dbGet) {
      try {
        const isBanned = await window.dbGet(`usr_${sessionUser}_banned`);
        if (isBanned === 'true' || isBanned === true) {
          alert('Tài khoản của bạn đã bị khóa bởi Ban Quản Trị! 🚫');
          logout();
          if (loginScreen) {
            loginScreen.classList.add('active');
            renderSavedAccounts();
          }
          if (startScreen) startScreen.classList.remove('active');
          return;
        }
      } catch (e) {
        console.error("Lỗi kiểm tra trạng thái ban:", e);
      }
    }

    const accounts = getAccounts();
    if (accounts[sessionUser]) {
      // Sync cloud save to local first to ensure device progress consistency
      if (sessionUser !== 'guest' && window.loadCloudSave) {
        try {
          const parsedSave = await window.loadCloudSave(sessionUser);
          if (parsedSave) {
            currentSaveData = parsedSave;
            safeStorage.setItem(`spellfusion_save_${sessionUser}`, JSON.stringify(currentSaveData));
          }
        } catch (e) {
          console.error("Lỗi đồng bộ tự động khi kiểm tra session:", e);
        }
      }
      
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
  
  if (loginScreen) {
    loginScreen.classList.add('active');
    renderSavedAccounts();
    if (window.syncAccountsWithCloud) {
      window.syncAccountsWithCloud().then(() => renderSavedAccounts());
    }
  }
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
    else if (acc.id === 'glove_mining') icon = '🥊';
    else if (acc.id === 'thorn_armor') icon = '🦔';

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
    // 1. Key rebind handling
    if (window.activeRebindAction) {
      let pressedKey = e.key.toLowerCase();
      if (e.code === 'Space') pressedKey = 'space';
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') pressedKey = 'shift';
      
      if (pressedKey !== 'escape') {
        window.gameSettings.keyBindings[window.activeRebindAction] = pressedKey;
        localStorage.setItem('spellfusion_settings_game', JSON.stringify(window.gameSettings));
        window.activeRebindAction = null;
        if (typeof window.renderControlsList === 'function') {
          window.renderControlsList();
        }
      } else {
        window.activeRebindAction = null;
        if (typeof window.renderControlsList === 'function') {
          window.renderControlsList();
        }
      }
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const keyLower = e.key.toLowerCase();
    keys[keyLower] = true;
    if (e.code === 'Space') keys[' '] = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys['shift'] = true;
    
    if (e.key === 'Escape' || e.key === 'Esc') {
      togglePause();
      return;
    }

    const p = gameCtx.player;
    if (!p) return;

    const kb = window.gameSettings.keyBindings;
    const keyBuildMenu = kb.buildMenu || 'b';
    const keyInteract = kb.interact || 'e';
    const keyModeSpell = kb.modeSpell || '1';
    const keyModeBuild = kb.modeBuild || '2';
    const keyModeGun = kb.modeGun || '3';

    // Toggle build menu
    if (keyLower === keyBuildMenu) {
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

    // Toggle Interact
    if (keyLower === keyInteract) {
      if (gameCtx.gameState === 'PLAYING') {
        handleInteraction();
      }
    }

    // Mode switches
    if (keyLower === keyModeSpell) {
      if (gameCtx.gameState === 'PLAYING') {
        p.activeMode = 'spell';
        if (typeof window.updateBuildHUD === 'function') window.updateBuildHUD();
      }
    }
    if (keyLower === keyModeBuild) {
      if (gameCtx.gameState === 'PLAYING') {
        p.activeMode = 'build';
        if (typeof window.updateBuildHUD === 'function') window.updateBuildHUD();
      }
    }
    if (keyLower === keyModeGun) {
      if (gameCtx.gameState === 'PLAYING') {
        if (p.equippedGun) {
          p.activeMode = 'gun';
          if (typeof window.updateBuildHUD === 'function') window.updateBuildHUD();
        } else {
          const bKey = (kb.buildMenu || 'b').toUpperCase();
          if (window.FloatingText && gameCtx.floatingTexts) {
            gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, `CHƯA CÓ SÚNG! HÃY CHẾ TẠO [${bKey}]`, "#ff0055"));
          }
        }
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    const keyLower = e.key.toLowerCase();
    keys[keyLower] = false;
    if (e.code === 'Space') keys[' '] = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys['shift'] = false;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left + gameCtx.camX;
    mouse.y = e.clientY - rect.top + gameCtx.camY;
  });

  window.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      // Bỏ qua click chuột khi nhấn vào các phần tử giao diện HTML
      if (e.target.closest('#build-hud') || e.target.closest('#crafting-overlay') || e.target.closest('#alchemy-overlay') || e.target.closest('#settings-modal') || e.target.closest('#character-mirror-panel') || e.target.closest('#game-hud') || e.target.closest('.modal') || e.target.closest('#shop-overlay') || e.target.closest('#lobby-menu') || e.target.closest('.ui-container') || e.target.closest('#hud-container')) {
        return;
      }
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

  const saveExitBtn = document.getElementById('save-exit-btn');
  if (saveExitBtn) {
    saveExitBtn.addEventListener('click', () => {
      if (typeof serializeGameRun === 'function') {
        const runData = serializeGameRun();
        if (runData) {
          const username = currentAccount || 'guest';
          const slotId = window.activeSaveSlot || 1;
          localStorage.setItem(`spellfusion_run_save_${username}_slot_${slotId}`, JSON.stringify(runData));
        }
      }
      if (typeof togglePause === 'function') togglePause();
      if (typeof exitToMenu === 'function') exitToMenu();
    });
  }

  const exitNoSaveBtn = document.getElementById('exit-no-save-btn');
  if (exitNoSaveBtn) {
    exitNoSaveBtn.addEventListener('click', () => {
      if (typeof togglePause === 'function') togglePause();
      if (typeof exitToMenu === 'function') exitToMenu();
    });
  }

  // Mouse wheel scrolling to change structure selection in Build Mode
  window.addEventListener('wheel', (e) => {
    if (gameCtx.player && gameCtx.player.activeMode === 'build') {
      const types = Object.keys(BUILD_ITEMS_DATA);
      let index = types.indexOf(gameCtx.player.selectedBuildType);
      if (e.deltaY > 0) {
        index = (index + 1) % types.length;
      } else {
        index = (index - 1 + types.length) % types.length;
      }
      gameCtx.player.selectedBuildType = types[index];
      if (typeof window.updateBuildHUD === 'function') window.updateBuildHUD();
    }
  });

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
      if (btn.getAttribute('data-panel') === 'controls') renderControlsList();
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

window.activeRebindAction = null;
const CONTROL_NAMES = {
  spell1: "Thi triển Chiêu Z",
  spell2: "Thi triển Chiêu X",
  spell3: "Thi triển Chiêu C",
  spell4: "Thi triển Chiêu V",
  buildMenu: "Mở Menu Chế Tạo (B)",
  interact: "Tương tác nhặt/Cổng (E)",
  modeSpell: "Chế độ Phép thuật (Phím 1)",
  modeBuild: "Chế độ Xây dựng (Phím 2)",
  modeGun: "Chế độ Súng (Phím 3)",
  dash: "Phím Lướt Nhanh (Q/Space)"
};

function renderControlsList() {
  const container = document.getElementById('controls-list-container');
  if (!container) return;
  container.innerHTML = '';

  const kb = window.gameSettings.keyBindings;
  Object.keys(CONTROL_NAMES).forEach(action => {
    const actionName = CONTROL_NAMES[action];
    const keyVal = kb[action] || '';
    const isRebinding = window.activeRebindAction === action;

    const row = document.createElement('div');
    row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; font-size: 0.76rem; border-bottom: 1px dashed rgba(255,255,255,0.06); padding: 0.5rem 0.2rem;';
    
    const label = document.createElement('span');
    label.style.color = '#a8b2db';
    label.textContent = actionName;

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.cssText = `
      padding: 0.2rem 0.5rem;
      font-size: 0.68rem;
      font-family: 'Orbitron', sans-serif;
      font-weight: bold;
      border-color: ${isRebinding ? 'var(--neon-magenta)' : 'var(--neon-cyan)'};
      background: ${isRebinding ? 'rgba(255, 0, 85, 0.1)' : 'rgba(0, 243, 255, 0.05)'};
      color: ${isRebinding ? 'var(--neon-magenta)' : 'var(--neon-cyan)'};
      min-width: 90px;
      text-align: center;
      cursor: pointer;
    `;
    btn.textContent = isRebinding ? 'Ấn phím...' : keyVal.toUpperCase();

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.activeRebindAction = action;
      renderControlsList();
    });

    row.appendChild(label);
    row.appendChild(btn);
    container.appendChild(row);
  });
}
window.renderControlsList = renderControlsList;

const BUILD_ITEMS_DATA = {
  barricade: { name: "RÀO GỖ", icon: "🚧" },
  stonewall: { name: "TƯỜNG ĐÁ", icon: "🧱" },
  ironwall: { name: "TƯỜNG SẮT", icon: "⛓️" },
  campfire: { name: "LỬA TRẠI", icon: "🔥" },
  spiketrap: { name: "BẪY GAI", icon: "⚙️" },
  turret: { name: "TRỤ SÚNG", icon: "🛡️" },
  crafting_table_2: { name: "BÀN C.TẠO 2", icon: "🛠️" },
  flame_turret: { name: "TRỤ LỬA", icon: "🌋" },
  tesla_turret: { name: "TRỤ SÉT", icon: "⚡" },
  electric_fence: { name: "RÀO ĐIỆN", icon: "🔌" },
  elemental_bomb: { name: "BOM N.TỐ", icon: "💣" },
  auto_miner: { name: "MÁY ĐÀO", icon: "💎" },
  alchemy_table: { name: "MÁY THUỐC", icon: "⚗️" }
};

function updateBuildHUD() {
  const buildHud = document.getElementById('build-hud');
  if (!buildHud || !gameCtx.player) return;

  const p = gameCtx.player;
  if (p.activeMode !== 'build') {
    buildHud.style.display = 'none';
    const elementHud = document.getElementById('element-hud');
    if (elementHud) elementHud.style.display = 'flex';
    return;
  }

  buildHud.style.display = 'flex';
  const elementHud = document.getElementById('element-hud');
  if (elementHud) elementHud.style.display = 'none';

  buildHud.innerHTML = '';
  Object.keys(BUILD_ITEMS_DATA).forEach(type => {
    const data = BUILD_ITEMS_DATA[type];
    const qty = p.structureInventory[type] || 0;
    const isSelected = p.selectedBuildType === type;

    const slot = document.createElement('div');
    slot.className = `build-hud-slot ${isSelected ? 'selected' : ''}`;
    slot.style.cssText = `
      width: 48px;
      height: 48px;
      border: 1.5px solid ${isSelected ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)'};
      border-radius: 8px;
      background: ${isSelected ? 'rgba(0, 243, 255, 0.12)' : 'rgba(255,255,255,0.02)'};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      opacity: ${qty > 0 ? 1.0 : 0.4};
      transition: all 0.15s;
      box-shadow: ${isSelected ? '0 0 10px rgba(0, 243, 255, 0.4)' : 'none'};
    `;

    slot.innerHTML = `
      <span style="font-size: 1.25rem;">${data.icon}</span>
      <span style="position: absolute; bottom: 2px; right: 4px; font-family: 'Orbitron', sans-serif; font-size: 0.65rem; font-weight: bold; color: ${qty > 0 ? '#00ff7f' : '#fff'};">${qty}</span>
    `;

    slot.addEventListener('mousedown', (e) => {
      p.selectedBuildType = type;
      updateBuildHUD();
      e.stopPropagation();
    });

    buildHud.appendChild(slot);
  });
}
window.updateBuildHUD = updateBuildHUD;
window.BUILD_ITEMS_DATA = BUILD_ITEMS_DATA;

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
      if (window.GameInvite && window.GameInvite.isHost()) {
        window.GameInvite.updateCloudRoom();
      }
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

window.upgradeWizardStat = (wizardKey, statType) => {
  const char = CHARACTERS[wizardKey];
  if (!char) return;
  
  currentSaveData.wizardUpgrades = currentSaveData.wizardUpgrades || {};
  currentSaveData.wizardUpgrades[wizardKey] = currentSaveData.wizardUpgrades[wizardKey] || { hp: 0, damage: 0, speed: 0, energy: 0 };
  
  const currentLvl = currentSaveData.wizardUpgrades[wizardKey][statType] || 0;
  if (currentLvl >= 5) {
    alert('Đã đạt cấp độ tối đa!');
    return;
  }
  
  let cost = 0;
  if (statType === 'hp') cost = 500 * (currentLvl + 1);
  else if (statType === 'damage') cost = 600 * (currentLvl + 1);
  else if (statType === 'speed') cost = 400 * (currentLvl + 1);
  else if (statType === 'energy') cost = 300 * (currentLvl + 1);
  
  if (currentSaveData.gold < cost) {
    alert('Không đủ tiền vàng!');
    return;
  }
  
  currentSaveData.gold -= cost;
  currentSaveData.wizardUpgrades[wizardKey][statType] = currentLvl + 1;
  saveAccountSave();
  
  // Re-create the player so stats update in lobby
  gameCtx.player = new Player(ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
  
  updateCharacterDetails(wizardKey);
  updateAccountMenuUI();
};

window.upgradeWizardSpell = (wizardKey, spellIndex) => {
  const char = CHARACTERS[wizardKey];
  if (!char) return;
  
  currentSaveData.spellUpgrades = currentSaveData.spellUpgrades || {};
  currentSaveData.spellUpgrades[wizardKey] = currentSaveData.spellUpgrades[wizardKey] || [0, 0, 0, 0];
  
  const currentLvl = currentSaveData.spellUpgrades[wizardKey][spellIndex] || 0;
  if (currentLvl >= 5) {
    alert('Đã đạt cấp độ tối đa!');
    return;
  }
  
  const cost = 800 * (currentLvl + 1);
  if (currentSaveData.gold < cost) {
    alert('Không đủ tiền vàng!');
    return;
  }
  
  currentSaveData.gold -= cost;
  currentSaveData.spellUpgrades[wizardKey][spellIndex] = currentLvl + 1;
  saveAccountSave();
  
  // Re-create the player so stats/spells update in lobby
  gameCtx.player = new Player(ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
  
  updateCharacterDetails(wizardKey);
  updateAccountMenuUI();
};

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
  
  if (!isUnlocked) {
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
    return;
  }

  // ĐÃ SỞ HỮU -> GIAO DIỆN NÂNG CẤP CHI TIẾT
  const wizardUpgrades = currentSaveData.wizardUpgrades || {};
  const charUpgrades = wizardUpgrades[key] || { hp: 0, damage: 0, speed: 0, energy: 0 };
  const lvlHp = charUpgrades.hp || 0;
  const lvlDmg = charUpgrades.damage || 0;
  const lvlSpd = charUpgrades.speed || 0;
  const lvlEnergy = charUpgrades.energy || 0;

  const spellUpgrades = currentSaveData.spellUpgrades || {};
  const charSpellUpgrades = spellUpgrades[key] || [0, 0, 0, 0];

  const currentMaxHp = char.stats.maxHp + lvlHp * 10;
  const currentSpeed = (char.stats.speed + lvlSpd * 0.15).toFixed(2);
  const currentDamage = (char.stats.damageModifier + lvlDmg * 0.10).toFixed(2);
  const currentMaxEnergy = 100 + lvlEnergy * 20;

  const costHp = 500 * (lvlHp + 1);
  const costDmg = 600 * (lvlDmg + 1);
  const costSpd = 400 * (lvlSpd + 1);
  const costEnergy = 300 * (lvlEnergy + 1);

  const btnHp = lvlHp >= 5 ? '<span style="color:var(--neon-cyan); font-weight:bold;">MAX 👑</span>' : `<button class="btn" style="padding: 0.2rem 0.5rem; font-size: 0.68rem; border-color: var(--neon-cyan); background: rgba(0, 243, 255, 0.05);" onclick="window.upgradeWizardStat('${key}', 'hp')">NÂNG: ${costHp} 🪙</button>`;
  const btnDmg = lvlDmg >= 5 ? '<span style="color:var(--neon-cyan); font-weight:bold;">MAX 👑</span>' : `<button class="btn" style="padding: 0.2rem 0.5rem; font-size: 0.68rem; border-color: var(--neon-cyan); background: rgba(0, 243, 255, 0.05);" onclick="window.upgradeWizardStat('${key}', 'damage')">NÂNG: ${costDmg} 🪙</button>`;
  const btnSpd = lvlSpd >= 5 ? '<span style="color:var(--neon-cyan); font-weight:bold;">MAX 👑</span>' : `<button class="btn" style="padding: 0.2rem 0.5rem; font-size: 0.68rem; border-color: var(--neon-cyan); background: rgba(0, 243, 255, 0.05);" onclick="window.upgradeWizardStat('${key}', 'speed')">NÂNG: ${costSpd} 🪙</button>`;
  const btnEnergy = lvlEnergy >= 5 ? '<span style="color:var(--neon-cyan); font-weight:bold;">MAX 👑</span>' : `<button class="btn" style="padding: 0.2rem 0.5rem; font-size: 0.68rem; border-color: var(--neon-cyan); background: rgba(0, 243, 255, 0.05);" onclick="window.upgradeWizardStat('${key}', 'energy')">NÂNG: ${costEnergy} 🪙</button>`;

  const statsUpgradeColHtml = `
    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0.75rem;">
      <h3 style="font-family: 'Orbitron', sans-serif; font-size: 0.82rem; color: var(--neon-cyan); margin-bottom: 0.6rem; border-bottom: 1px dashed rgba(0,243,255,0.2); padding-bottom: 0.3rem;">CHỈ SỐ BẢN THÂN</h3>
      <div style="display: flex; flex-direction: column; gap: 0.6rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem;">
          <div>
            <span style="color:#fff; font-weight:bold;">Sinh Mệnh (HP):</span>
            <span style="color:#00ff7f; margin-left: 0.25rem;">${currentMaxHp} HP</span>
            <div style="font-size: 0.65rem; color: #a8b2db;">Cấp ${lvlHp}/5 (+10 HP/cấp)</div>
          </div>
          <div>${btnHp}</div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem;">
          <div>
            <span style="color:#fff; font-weight:bold;">Sát Thương (Dmg):</span>
            <span style="color:#00ff7f; margin-left: 0.25rem;">x${currentDamage}</span>
            <div style="font-size: 0.65rem; color: #a8b2db;">Cấp ${lvlDmg}/5 (+10% đam/cấp)</div>
          </div>
          <div>${btnDmg}</div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem;">
          <div>
            <span style="color:#fff; font-weight:bold;">Tốc Độ (Speed):</span>
            <span style="color:#00ff7f; margin-left: 0.25rem;">${currentSpeed}</span>
            <div style="font-size: 0.65rem; color: #a8b2db;">Cấp ${lvlSpd}/5 (+0.15 tốc chạy/cấp)</div>
          </div>
          <div>${btnSpd}</div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem;">
          <div>
            <span style="color:#fff; font-weight:bold;">Năng Lượng (Energy):</span>
            <span style="color:#00ff7f; margin-left: 0.25rem;">${currentMaxEnergy} EP</span>
            <div style="font-size: 0.65rem; color: #a8b2db;">Cấp ${lvlEnergy}/5 (+20 EP/cấp, Hồi 2 EP/s)</div>
          </div>
          <div>${btnEnergy}</div>
        </div>
      </div>
    </div>
  `;

  let spellsUpgradeColHtml = `
    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0.75rem;">
      <h3 style="font-family: 'Orbitron', sans-serif; font-size: 0.82rem; color: var(--neon-magenta); margin-bottom: 0.6rem; border-bottom: 1px dashed rgba(255,0,127,0.2); padding-bottom: 0.3rem;">KỸ NĂNG MA PHÁP (Z, X, C, V)</h3>
      <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 185px; overflow-y: auto; padding-right: 0.2rem;">
  `;

  const keyLabels = ['Z', 'X', 'C', 'V'];
  for (let i = 0; i < 4; i++) {
    const spellKey = char.spells[i];
    const recipe = SPELL_RECIPES[spellKey] || { name: 'Kỹ năng', desc: '' };
    const lvl = charSpellUpgrades[i] || 0;
    const costSpell = 800 * (lvl + 1);

    const btnSpell = lvl >= 5 ? '<span style="color:var(--neon-magenta); font-weight:bold;">MAX 👑</span>' : `<button class="btn" style="padding: 0.2rem 0.5rem; font-size: 0.65rem; border-color: var(--neon-magenta); background: rgba(255,0,127,0.05);" onclick="window.upgradeWizardSpell('${key}', ${i})">NÂNG: ${costSpell} 🪙</button>`;

    spellsUpgradeColHtml += `
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.7rem; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 0.35rem;">
        <div style="max-width: 65%;">
          <div style="display: flex; align-items: center; gap: 0.3rem;">
            <span style="background: rgba(255,0,127,0.15); color: var(--neon-magenta); font-weight: bold; border-radius: 3px; padding: 0.02rem 0.2rem; font-size: 0.65rem;">${keyLabels[i]}</span>
            <strong style="color: #fff; font-size: 0.72rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${recipe.name}</strong>
          </div>
          <div style="font-size: 0.62rem; color: #a8b2db; margin-top: 1px;">Cấp ${lvl}/5 (+15% đam, -8% hồi chiêu)</div>
        </div>
        <div>${btnSpell}</div>
      </div>
    `;
  }
  spellsUpgradeColHtml += `
      </div>
    </div>
  `;

  detailsContainer.innerHTML = `
    <div class="char-details-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid ${rarityColor}55; padding-bottom: 0.5rem; margin-bottom: 0.8rem;">
      <div>
        <span class="char-details-name" style="font-family: 'Orbitron', sans-serif; font-size: 1.25rem; font-weight: 900; color: #fff; text-shadow: 0 0 8px ${rarityColor};">${char.name}</span>
        <span class="char-details-title" style="font-size: 0.8rem; color: #a8b2db; margin-left: 0.5rem;">${char.title}</span>
      </div>
      <div>${purchaseSectionHtml}</div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
      ${statsUpgradeColHtml}
      ${spellsUpgradeColHtml}
    </div>
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

  // Sắp xếp các nhân vật theo thứ tự tiền từ bé đến lớn
  const sortedKeys = Object.keys(CHARACTERS).sort((a, b) => {
    return (CHARACTERS[a].cost || 0) - (CHARACTERS[b].cost || 0);
  });

  sortedKeys.forEach(key => {
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
        
        // Save selected character state
        if (typeof currentSaveData !== 'undefined' && currentSaveData) {
          currentSaveData.currentCharacter = key;
          if (typeof saveAccountSave === 'function') {
            saveAccountSave();
          }
        }
        
        // Re-create the player so stats and spells update in lobby
        gameCtx.player = new Player(ARENA_WIDTH / 2, ARENA_HEIGHT / 2);
        
        // Update lobby avatar color
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

  let hpPct;
  if (gameCtx.player.characterKey === 'wolf' && gameCtx.player.lycanTransformActive) {
    hpPct = Math.max(0, (gameCtx.player.wolfHp / gameCtx.player.maxWolfHp) * 100);
    hudHealthBar.style.background = 'linear-gradient(90deg, #ff3300, #ff003c)'; // Đỏ lửa cho sói
    hudHealthBar.style.boxShadow = '0 0 10px rgba(255, 0, 60, 0.6)';
  } else {
    hpPct = Math.max(0, (gameCtx.player.hp / gameCtx.player.maxHp) * 100);
    hudHealthBar.style.background = ''; // Mặc định
    hudHealthBar.style.boxShadow = '';
  }
  hudHealthBar.style.width = `${hpPct}%`;

  // Cập nhật tài nguyên HUD
  if (document.getElementById('hud-wood')) document.getElementById('hud-wood').innerText = gameCtx.player.wood || 0;
  if (document.getElementById('hud-stone')) document.getElementById('hud-stone').innerText = gameCtx.player.stone || 0;
  if (document.getElementById('hud-iron')) document.getElementById('hud-iron').innerText = gameCtx.player.iron || 0;
  if (document.getElementById('hud-gold-ore')) document.getElementById('hud-gold-ore').innerText = gameCtx.player.gold_ore || 0;
  if (document.getElementById('hud-diamond-ore')) document.getElementById('hud-diamond-ore').innerText = gameCtx.player.diamond_ore || 0;
  if (document.getElementById('hud-herb-red')) document.getElementById('hud-herb-red').innerText = gameCtx.player.herb_red || 0;
  if (document.getElementById('hud-herb-blue')) document.getElementById('hud-herb-blue').innerText = gameCtx.player.herb_blue || 0;
  if (document.getElementById('hud-herb-yellow')) document.getElementById('hud-herb-yellow').innerText = gameCtx.player.herb_yellow || 0;
  if (document.getElementById('hud-potion-health')) document.getElementById('hud-potion-health').innerText = gameCtx.player.potion_health || 0;
  if (document.getElementById('hud-potion-energy')) document.getElementById('hud-potion-energy').innerText = gameCtx.player.potion_energy || 0;
  if (document.getElementById('hud-potion-speed')) document.getElementById('hud-potion-speed').innerText = gameCtx.player.potion_speed || 0;

  // Cập nhật thanh đói bụng nếu có (Hunger)
  const hungerInner = document.getElementById('hud-hunger-bar');
  if (hungerInner) {
    const hungerPct = Math.max(0, gameCtx.player.hunger || 0);
    hungerInner.style.width = `${hungerPct}%`;
  }

  // Cập nhật thanh năng lượng (Energy)
  const energyInner = document.getElementById('hud-energy-bar');
  const energyText = document.getElementById('hud-energy-text');
  if (energyInner && gameCtx.player) {
    const epPct = Math.max(0, (gameCtx.player.energy / gameCtx.player.maxEnergy) * 100);
    energyInner.style.width = `${epPct}%`;
    if (energyText) {
      energyText.innerText = `${Math.round(gameCtx.player.energy)}/${gameCtx.player.maxEnergy}`;
    }
  }

  if (typeof window.updateBuildHUD === 'function') {
    window.updateBuildHUD();
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
    
    if (gameCtx.waveState === 'BREAK') {
      skipBtn.style.display = 'block';
      skipBtn.disabled = false;
      skipBtn.style.opacity = '1';
      skipBtn.textContent = 'BỎ QUA CHỜ ➔';
      skipBtn.style.borderColor = 'var(--neon-cyan)';
      skipBtn.style.background = 'rgba(0, 243, 255, 0.15)';
      skipBtn.style.boxShadow = '0 0 8px rgba(0, 243, 255, 0.3)';
    } else {
      skipBtn.style.display = 'none';
    }
  } else {
    panel.style.display = 'none';
  }
}

function setupGiftcode() {
  const CODES = {
    'HELLOAIGEMINI': { gold: 500, desc: 'Quà chào mừng từ Google Gemini! 🪙' },
    'FREEWIZARD': { gold: 1000, desc: 'Hỗ trợ mở khóa Pháp Sư mới! 🪙' },
    'VIP999': { gold: 1500, desc: 'Code VIP cho chiến binh kỳ cựu! 🪙' },
    'ANTIGRAVITY': { gold: 2000, desc: 'Mã tối thượng của AI Antigravity! 🪙' },
    'MAMABOYYYYY': { gold: 999999, desc: 'Quyền lực tối cao của Admin! 👑' },
    'PROPLAYER': { gold: 5000, desc: 'Mã cho cao thủ sinh tồn! ⚡' },
    'CRAFTMASTER': { gold: 3000, desc: 'Bậc thầy chế tạo đã xuất hiện! 🛠️' },
    'DIAMONDGIFT': { gold: 10000, desc: 'Kim cương và vàng đầy túi! 💎' },
    'WALKTHROUGH': { gold: 2500, desc: 'Mã đi xuyên mọi công trình! 🚶' },
    'GOLD50K': { gold: 50000, desc: 'Quà tặng 50k Vàng từ Admin! 🪙' },
    'SPELL50K': { gold: 50000, desc: 'Món quà may mắn 50k Vàng! 🪙' }
  };

  // Tải Gift Code tùy biến từ Cloud Key toàn cục
  async function loadCloudGiftcodes() {
    try {
      const raw = await window.dbGet('spellfusion_global_giftcodes');
      if (raw) {
        let cloudCodes = [];
        try {
          const decoded = window.safeAtob ? window.safeAtob(raw) : '';
          cloudCodes = JSON.parse(decoded || raw);
        } catch (e) {
          try {
            cloudCodes = JSON.parse(raw);
          } catch(err) {
            cloudCodes = raw;
          }
        }
        if (Array.isArray(cloudCodes)) {
          cloudCodes.forEach(item => {
            if (item && item.code) {
              CODES[item.code] = { gold: Number(item.gold) || 0, desc: item.desc || 'Quà tặng từ Admin!' };
            }
          });
        }
      }
    } catch(e) {
      console.error("Lỗi tải giftcode từ Cloud:", e);
    }
  }
  loadCloudGiftcodes();

  const handleClaim = (inputEl, messageEl) => {
    if (!inputEl || !messageEl) return;
    const code = inputEl.value.trim().toUpperCase();
    if (!code) {
      messageEl.style.color = 'var(--neon-magenta)';
      messageEl.textContent = 'Vui lòng nhập mã code!';
      return;
    }

    if (!currentSaveData) {
      messageEl.style.color = 'var(--neon-magenta)';
      messageEl.textContent = 'Hãy đăng nhập trước khi nhận code!';
      return;
    }

    if (code === 'SPELLADMINN') {
      const amountStr = prompt("Nhập số vàng bạn muốn nhận (Admin Code):", "50000");
      if (amountStr === null) return; // Hủy bỏ
      const amount = parseInt(amountStr);
      if (isNaN(amount) || amount <= 0) {
        messageEl.style.color = 'var(--neon-magenta)';
        messageEl.textContent = 'Số vàng nhập vào không hợp lệ!';
        return;
      }
      currentSaveData.gold += amount;
      saveAccountSave();
      messageEl.style.color = '#00ff7f';
      messageEl.textContent = `+${amount.toLocaleString()} 🪙 (Quyền Admin!)`;
      inputEl.value = '';
      updateAccountMenuUI();
      return;
    }

    const reward = CODES[code];
    if (!reward) {
      messageEl.style.color = 'var(--neon-magenta)';
      messageEl.textContent = 'Giftcode không tồn tại!';
      return;
    }

    currentSaveData.usedCodes = currentSaveData.usedCodes || [];
    if (currentSaveData.usedCodes.includes(code)) {
      messageEl.style.color = 'var(--neon-magenta)';
      messageEl.textContent = 'Mã code này đã được sử dụng!';
      return;
    }

    // Nhận thưởng
    currentSaveData.gold += reward.gold;
    currentSaveData.usedCodes.push(code);
    saveAccountSave();

    // Thông báo thành công
    messageEl.style.color = '#00ff7f';
    messageEl.textContent = `+${reward.gold.toLocaleString()} 🪙 (${reward.desc})`;
    inputEl.value = '';

    // Cập nhật UI
    updateAccountMenuUI();
    
    // Tự động xóa thông báo sau 4 giây
    setTimeout(() => {
      messageEl.textContent = '';
    }, 4000);
  };

  // Wire up Main Menu form
  const claimBtn = document.getElementById('giftcode-claim-btn');
  const input = document.getElementById('giftcode-input');
  const message = document.getElementById('giftcode-message');
  if (claimBtn && input && message) {
    claimBtn.addEventListener('click', () => handleClaim(input, message));
  }

  // Wire up Lobby form
  const lobbyClaimBtn = document.getElementById('lobby-giftcode-claim-btn');
  const lobbyInput = document.getElementById('lobby-giftcode-input');
  const lobbyMessage = document.getElementById('lobby-giftcode-message');
  if (lobbyClaimBtn && lobbyInput && lobbyMessage) {
    lobbyClaimBtn.addEventListener('click', () => handleClaim(lobbyInput, lobbyMessage));
  }
}

// Gọi setupGiftcode sau khi DOM đã sẵn sàng
setTimeout(setupGiftcode, 100);

// ==========================================
// SURVIVAL & CRAFTING SYSTEM HELPERS
// ==========================================
const CRAFT_RECIPES = {
  barricade: { wood: 10, stone: 0, iron: 0, gold_ore: 0, diamond_ore: 0 },
  stonewall: { wood: 0, stone: 15, iron: 0, gold_ore: 0, diamond_ore: 0 },
  ironwall: { wood: 0, stone: 0, iron: 15, gold_ore: 0, diamond_ore: 0 },
  campfire: { wood: 15, stone: 5, iron: 0, gold_ore: 0, diamond_ore: 0 },
  spiketrap: { wood: 5, stone: 10, iron: 0, gold_ore: 0, diamond_ore: 0 },
  turret: { wood: 0, stone: 15, iron: 10, gold_ore: 0, diamond_ore: 0 },
  crafting_table_2: { wood: 20, stone: 15, iron: 10, gold_ore: 0, diamond_ore: 0 },
  flame_turret: { wood: 0, stone: 15, iron: 0, gold_ore: 8, diamond_ore: 0 },
  tesla_turret: { wood: 0, stone: 0, iron: 15, gold_ore: 12, diamond_ore: 0 },
  electric_fence: { wood: 0, stone: 0, iron: 20, gold_ore: 0, diamond_ore: 4 },
  elemental_bomb: { wood: 0, stone: 0, iron: 0, gold_ore: 10, diamond_ore: 6 },
  handgun: { wood: 0, stone: 0, iron: 15, gold_ore: 5, diamond_ore: 0 },
  rifle: { wood: 0, stone: 0, iron: 25, gold_ore: 10, diamond_ore: 2 },
  shotgun: { wood: 0, stone: 0, iron: 20, gold_ore: 8, diamond_ore: 4 },
  power_drill: { wood: 15, stone: 0, iron: 15, gold_ore: 6, diamond_ore: 0 },
  magnet_glove: { wood: 0, stone: 0, iron: 10, gold_ore: 5, diamond_ore: 5 },
  auto_miner: { wood: 0, stone: 20, iron: 15, gold_ore: 10, diamond_ore: 2 },
  alchemy_table: { wood: 15, stone: 10, iron: 5, gold_ore: 0, diamond_ore: 0 }
};
window.CRAFT_RECIPES = CRAFT_RECIPES;

function isNearCraftingTable2() {
  if (!gameCtx.player) return false;
  if (gameCtx.player.hasCraftingTable2Unlocked) return true;
  if (!gameCtx.obstacles) return false;
  for (const obs of gameCtx.obstacles) {
    if (obs.active && obs.type === 'crafting_table_2') {
      gameCtx.player.hasCraftingTable2Unlocked = true;
      return true;
    }
  }
  return false;
}
window.isNearCraftingTable2 = isNearCraftingTable2;

function handleInteraction() {
  if (!gameCtx.player || gameCtx.gameState !== 'PLAYING') return;

  const p = gameCtx.player;

  // Check if near an alchemy table first
  let nearestTable = null;
  let minTDist = Infinity;
  if (gameCtx.obstacles) {
    for (const obs of gameCtx.obstacles) {
      if (obs.active && obs.type === 'alchemy_table') {
        const dist = Math.hypot(p.x - obs.x, p.y - obs.y);
        if (dist < minTDist) {
          minTDist = dist;
          nearestTable = obs;
        }
      }
    }
  }

  if (nearestTable && minTDist < 75) {
    const alchemyOverlay = document.getElementById('alchemy-overlay');
    if (alchemyOverlay) {
      if (alchemyOverlay.style.display === 'none') {
        alchemyOverlay.style.display = 'flex';
        const craftOverlay = document.getElementById('crafting-overlay');
        if (craftOverlay) craftOverlay.style.display = 'none';
        updateAlchemyMenu();
      } else {
        alchemyOverlay.style.display = 'none';
      }
    }
    return;
  }

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
    
    if (nearestEntrance && minDist < 75) {
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
      
      // Teleport all summoned wolves to the new position
      if (gameCtx.playerSpells) {
        for (const s of gameCtx.playerSpells) {
          if (s.active && s.type === 'wolf_z') {
            s.x = targetCenterX + (Math.random() * 40 - 20);
            s.y = 5600 + (Math.random() * 40 - 20);
          }
        }
      }
      
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
    
    if (nearestExit && minDist < 75) {
      // Teleport back to main map
      gameCtx.inCave = false;
      
      // Clean up leftover cave monsters
      gameCtx.enemies = gameCtx.enemies.filter(e => e.type !== 'cave_beetle' && e.type !== 'cave_spider' && e.type !== 'cave_bat');

      // Portal effect at old position
      for (let i = 0; i < 20; i++) {
        particleManager.addParticle(p.x, p.y, '#00ff7f', Math.random() * 3 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
      }
      
      // Return to saved coordinates, or center of main map if not set
      p.x = gameCtx.lastCaveEntranceX || (ARENA_WIDTH / 2);
      p.y = gameCtx.lastCaveEntranceY || (ARENA_HEIGHT / 2);
      
      // Teleport all summoned wolves to the new position
      if (gameCtx.playerSpells) {
        for (const s of gameCtx.playerSpells) {
          if (s.active && s.type === 'wolf_z') {
            s.x = p.x + (Math.random() * 40 - 20);
            s.y = p.y + (Math.random() * 40 - 20);
          }
        }
      }

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

function canPlaceStructureAt(x, y, size) {
  if (gameCtx.obstacles) {
    for (const obs of gameCtx.obstacles) {
      if (!obs.active) continue;
      const dist = Math.hypot(x - obs.x, y - obs.y);
      if (dist < size + obs.size) {
        return { valid: false, message: "KHÔNG THỂ ĐẶT CHỒNG LÊN NHAU!" };
      }
    }
  }

  if (gameCtx.player) {
    const dist = Math.hypot(x - gameCtx.player.x, y - gameCtx.player.y);
    if (dist < size + gameCtx.player.size) {
      return { valid: false, message: "KHÔNG THỂ ĐẶT LÊN NGƯỜI CHƠI!" };
    }
  }

  if (!gameCtx.inCave && gameCtx.caveEntrances) {
    for (const ent of gameCtx.caveEntrances) {
      const dist = Math.hypot(x - ent.x, y - ent.y);
      if (dist < size + ent.size) {
        return { valid: false, message: "KHÔNG THỂ ĐẶT LÊN CỔNG HANG!" };
      }
    }
  }

  if (gameCtx.inCave && gameCtx.caveExits) {
    const exit = gameCtx.caveExits[gameCtx.currentCaveIndex];
    if (exit) {
      const dist = Math.hypot(x - exit.x, y - exit.y);
      if (dist < size + exit.size) {
        return { valid: false, message: "KHÔNG THỂ ĐẶT LÊN CỔNG RA!" };
      }
    }
  }

  return { valid: true };
}
window.canPlaceStructureAt = canPlaceStructureAt;

function tryPlaceStructure(type) {
  if (!gameCtx.player || gameCtx.gameState !== 'PLAYING') return;
  
  const recipe = CRAFT_RECIPES[type];
  if (!recipe) return;
  
  const isAdvanced = ['flame_turret', 'tesla_turret', 'electric_fence', 'elemental_bomb', 'handgun', 'rifle', 'shotgun', 'power_drill', 'magnet_glove', 'auto_miner'].includes(type);
  if (isAdvanced && !isNearCraftingTable2()) {
    if (window.FloatingText && gameCtx.floatingTexts) {
      gameCtx.floatingTexts.push(new FloatingText(gameCtx.player.x, gameCtx.player.y - 30, "CẦN ĐỨNG GẦN BÀN CHẾ TẠO 2!", "#ff0055"));
    }
    return;
  }
  
  const p = gameCtx.player;
  const wood = p.wood || 0;
  const stone = p.stone || 0;
  const iron = p.iron || 0;
  const gold_ore = p.gold_ore || 0;
  const diamond_ore = p.diamond_ore || 0;
  
  if (wood < (recipe.wood || 0) || stone < (recipe.stone || 0) || iron < (recipe.iron || 0) || gold_ore < (recipe.gold_ore || 0) || diamond_ore < (recipe.diamond_ore || 0)) {
    if (window.FloatingText && gameCtx.floatingTexts) {
      gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, "KHÔNG ĐỦ TÀI NGUYÊN!", "#ff0055"));
    }
    return;
  }
  
  const isGun = ['handgun', 'rifle', 'shotgun'].includes(type);
  const isTool = ['power_drill', 'magnet_glove'].includes(type);
  
  if (isGun || isTool) {
    // Khấu trừ tài nguyên
    p.wood = wood - (recipe.wood || 0);
    p.stone = stone - (recipe.stone || 0);
    p.iron = iron - (recipe.iron || 0);
    p.gold_ore = gold_ore - (recipe.gold_ore || 0);
    p.diamond_ore = diamond_ore - (recipe.diamond_ore || 0);

    if (isGun) {
      p.equippedGun = type;
      let gunName = 'SÚNG LỤC NEON';
      if (type === 'rifle') gunName = 'SÚNG LIÊN THANH';
      else if (type === 'shotgun') gunName = 'SÚNG SĂN NEON';
      
      if (window.FloatingText && gameCtx.floatingTexts) {
        gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, `ĐÃ TRANG BỊ: ${gunName}!`, "#00f3ff"));
      }
    } else {
      p.equippedTool = type;
      let toolName = 'MÁY KHOAN SIÊU TỐC';
      if (type === 'magnet_glove') {
        toolName = 'GĂNG HÚT MỎ';
        p.magnetRadius += 150;
      }
      
      if (window.FloatingText && gameCtx.floatingTexts) {
        gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, `ĐÃ TRANG BỊ: ${toolName}!`, "#ffe600"));
      }
    }

    if (soundManager.playSpell) {
      soundManager.playSpell('lightning_lightning');
    }
    for (let i = 0; i < 15; i++) {
      particleManager.addParticle(p.x, p.y, isGun ? '#00f3ff' : '#ffe600', Math.random() * 3 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
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
    updateGameHUD();
    return;
  }
  
  // Khấu trừ tài nguyên
  p.wood = wood - (recipe.wood || 0);
  p.stone = stone - (recipe.stone || 0);
  p.iron = iron - (recipe.iron || 0);
  p.gold_ore = gold_ore - (recipe.gold_ore || 0);
  p.diamond_ore = diamond_ore - (recipe.diamond_ore || 0);
  
  // Cộng dồn vào túi đồ chế tạo thay vì đặt ngay
  p.structureInventory[type] = (p.structureInventory[type] || 0) + 1;
  
  if (type === 'crafting_table_2') {
    p.hasCraftingTable2Unlocked = true;
    if (window.FloatingText && gameCtx.floatingTexts) {
      gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 55, "ĐÃ HỢP NHẤT BÀN CHẾ TẠO 2 VÀO NGƯỜI CHƠI!", "#ffe600"));
      gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 75, "CHẾ TẠO NÂNG CAO MỌI NƠI!", "#00ffff"));
    }
  }
  
  const structName = BUILD_ITEMS_DATA[type] ? BUILD_ITEMS_DATA[type].name : type.toUpperCase();
  if (window.FloatingText && gameCtx.floatingTexts) {
    gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, `ĐÃ CHẾ TẠO: +1 ${structName}!`, "#00ff7f"));
  }
  
  // Tạo hiệu ứng hạt và âm thanh
  if (soundManager.playSpell) {
    soundManager.playSpell('earth_earth');
  }
  
  for (let i = 0; i < 12; i++) {
    particleManager.addParticle(p.x, p.y, '#00ff7f', Math.random() * 2.5 + 1, Math.random() * 2 + 1, Math.random() * Math.PI * 2, 0.05);
  }
  
  // Cập nhật lại giao diện HUD & Bảng chế tạo
  updateCraftingMenu();
  updateGameHUD();
  if (typeof window.updateBuildHUD === 'function') window.updateBuildHUD();
}
window.tryPlaceStructure = tryPlaceStructure;

function updateCraftingMenu() {
  const overlay = document.getElementById('crafting-overlay');
  if (!overlay || !gameCtx.player) return;
  
  const p = gameCtx.player;
  const wood = p.wood || 0;
  const stone = p.stone || 0;
  const iron = p.iron || 0;
  const gold_ore = p.gold_ore || 0;
  const diamond_ore = p.diamond_ore || 0;
  
  const nearTable2 = isNearCraftingTable2();
  
  const items = overlay.querySelectorAll('.craft-item');
  items.forEach(item => {
    const type = item.getAttribute('data-type');
    const recipe = CRAFT_RECIPES[type];
    if (!recipe) return;
    
    const isAdvanced = ['flame_turret', 'tesla_turret', 'electric_fence', 'elemental_bomb', 'handgun', 'rifle', 'shotgun', 'power_drill', 'magnet_glove', 'auto_miner'].includes(type);
    const needTable2Warning = isAdvanced && !nearTable2;
    
    const canAfford = wood >= (recipe.wood || 0) && 
                      stone >= (recipe.stone || 0) && 
                      iron >= (recipe.iron || 0) &&
                      gold_ore >= (recipe.gold_ore || 0) &&
                      diamond_ore >= (recipe.diamond_ore || 0);
                      
    const warningEl = item.querySelector('.craft-table-2-warning');
    if (warningEl) {
      warningEl.style.display = needTable2Warning ? 'block' : 'none';
    }
    
    if (canAfford && !needTable2Warning) {
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
      tryPlaceStructure(type);
      e.stopPropagation();
    });
  });
}
window.setupCrafting = setupCrafting;

// setupBackupRestore removed as accounts are now fully synced via Cloud Device ID

window.manualCloudSync = async () => {
  const user = window.currentAccount || localStorage.getItem('spellfusion_session');
  if (!user || user === 'guest') {
    alert("Bạn cần đăng nhập tài khoản Cloud để đồng bộ!");
    return;
  }
  
  const btn = document.getElementById('lobby-cloud-sync-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "ĐANG ĐỒNG BỘ... ⌛";
  }
  
  try {
    if (typeof compressSaveData === 'function' && typeof dbSet === 'function') {
      const success = await dbSet(`usr_${user}_sv`, compressSaveData(currentSaveData));
      if (success) {
        alert("Đồng bộ dữ liệu lên Cloud thành công! 🎉 Giờ bạn có thể đăng nhập trên máy khác để tiếp tục chơi.");
      } else {
        alert("Lỗi đồng bộ dữ liệu lên Cloud. Vui lòng kiểm tra lại kết nối mạng!");
      }
    }
  } catch (e) {
    console.error(e);
    alert("Có lỗi xảy ra khi đồng bộ: " + e.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "ĐỒNG BỘ CLOUD ☁️";
    }
  }
};

window.promptSyncCode = async () => {
  const code = prompt("Nhập mã đồng bộ (Sync Code) của máy khác để tải danh sách tài khoản:");
  if (!code) return;
  
  if (code.trim().startsWith('dev_')) {
    if (window.setDeviceId) {
      window.setDeviceId(code.trim());
      alert("Đã kết nối thiết bị! Đang đồng bộ tài khoản từ Cloud... ⌛");
      if (window.syncAccountsWithCloud) {
        await window.syncAccountsWithCloud();
      }
      if (typeof renderSavedAccounts === 'function') {
        renderSavedAccounts();
      }
    }
  } else {
    alert("Mã đồng bộ không hợp lệ! Mã phải có dạng 'dev_xxxx'.");
  }
};

function updateAlchemyMenu() {
  const overlay = document.getElementById('alchemy-overlay');
  if (!overlay || !gameCtx.player) return;

  const p = gameCtx.player;
  const red = p.herb_red || 0;
  const blue = p.herb_blue || 0;
  const yellow = p.herb_yellow || 0;

  const items = overlay.querySelectorAll('.alchemy-item');
  items.forEach(item => {
    const potionType = item.getAttribute('data-potion');
    let canCraft = false;

    if (potionType === 'potion_health') {
      canCraft = red >= 2;
    } else if (potionType === 'potion_energy') {
      canCraft = blue >= 2;
    } else if (potionType === 'potion_speed') {
      canCraft = red >= 1 && yellow >= 1;
    }

    if (canCraft) {
      item.style.opacity = '1';
      item.style.cursor = 'pointer';
      item.style.borderColor = 'rgba(204,51,255,0.6)';
      item.style.background = 'rgba(204,51,255,0.08)';
    } else {
      item.style.opacity = '0.4';
      item.style.cursor = 'not-allowed';
      item.style.borderColor = 'rgba(255,255,255,0.1)';
      item.style.background = 'rgba(255,255,255,0.02)';
    }
  });
}
window.updateAlchemyMenu = updateAlchemyMenu;

function setupAlchemyEventListeners() {
  const overlay = document.getElementById('alchemy-overlay');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    const item = e.target.closest('.alchemy-item');
    if (!item) return;

    const potionType = item.getAttribute('data-potion');
    const p = gameCtx.player;
    if (!p) return;

    let success = false;
    let costMsg = "";

    if (potionType === 'potion_health') {
      if (p.herb_red >= 2) {
        p.herb_red -= 2;
        p.potion_health = (p.potion_health || 0) + 1;
        success = true;
      } else {
        costMsg = "THIẾU THẢO DƯỢC ĐỎ!";
      }
    } else if (potionType === 'potion_energy') {
      if (p.herb_blue >= 2) {
        p.herb_blue -= 2;
        p.potion_energy = (p.potion_energy || 0) + 1;
        success = true;
      } else {
        costMsg = "THIẾU THẢO DƯỢC LAM!";
      }
    } else if (potionType === 'potion_speed') {
      if (p.herb_red >= 1 && p.herb_yellow >= 1) {
        p.herb_red -= 1;
        p.herb_yellow -= 1;
        p.potion_speed = (p.potion_speed || 0) + 1;
        success = true;
      } else {
        costMsg = "THIẾU THẢO DƯỢC!";
      }
    }

    if (success) {
      if (soundManager.playCraftSuccess) {
        soundManager.playCraftSuccess();
      }
      if (window.FloatingText && gameCtx.floatingTexts) {
        gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, "CHẾ THÀNH CÔNG! 🧪", "#cc66ff"));
      }
      updateAlchemyMenu();
      p.updateHUD();
    } else {
      if (window.FloatingText && gameCtx.floatingTexts) {
        gameCtx.floatingTexts.push(new FloatingText(p.x, p.y - 30, costMsg, "#ff0055"));
      }
    }
  });
}

setTimeout(setupAlchemyEventListeners, 150);

let selectedSaveSlot = 1;
window.selectedSaveSlot = selectedSaveSlot;

function setupSaveSlotsUI() {
  const container = document.getElementById('save-slots-container');
  if (!container) return;

  const username = currentAccount || 'guest';
  const slots = [1, 2, 3];

  slots.forEach(slotId => {
    const slotCard = container.querySelector(`.save-slot-card[data-slot="${slotId}"]`);
    if (!slotCard) return;

    const saveDataStr = localStorage.getItem(`spellfusion_run_save_${username}_slot_${slotId}`);
    const infoEl = slotCard.querySelector('.slot-info');
    const detailsEl = slotCard.querySelector('.slot-details');

    if (saveDataStr) {
      try {
        const saveData = JSON.parse(saveDataStr);
        const charName = CHARACTERS[saveData.player.characterKey]?.name || saveData.player.characterKey;
        const wave = saveData.currentWave || 1;
        const mapName = MAPS[saveData.currentMap]?.name || saveData.currentMap;
        const date = new Date(saveData.timestamp).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        infoEl.innerHTML = `<span style="color:#00ff7f;">Wave ${wave}</span> (${mapName})`;
        detailsEl.innerHTML = `<span style="color:#ffd700;">${charName}</span> - Lv.${saveData.player.level}<br>${date}`;
        detailsEl.style.display = 'block';
        slotCard.style.borderColor = 'rgba(0, 255, 127, 0.4)';
        slotCard.setAttribute('data-has-save', 'true');
      } catch (e) {
        console.error("Error parsing save slot:", e);
        infoEl.textContent = "PHÒNG TRỐNG";
        detailsEl.style.display = 'none';
        slotCard.style.borderColor = 'rgba(255,255,255,0.1)';
        slotCard.removeAttribute('data-has-save');
      }
    } else {
      infoEl.textContent = "PHÒNG TRỐNG";
      detailsEl.style.display = 'none';
      slotCard.style.borderColor = 'rgba(255,255,255,0.1)';
      slotCard.removeAttribute('data-has-save');
    }

    if (!slotCard.dataset.listenerBound) {
      slotCard.dataset.listenerBound = 'true';
      slotCard.addEventListener('click', () => {
        container.querySelectorAll('.save-slot-card').forEach(c => {
          c.classList.remove('selected');
          c.style.background = 'rgba(255, 255, 255, 0.01)';
          const hasSave = c.getAttribute('data-has-save') === 'true';
          c.style.borderColor = hasSave ? 'rgba(0, 255, 127, 0.4)' : 'rgba(255,255,255,0.1)';
        });

        slotCard.classList.add('selected');
        selectedSaveSlot = slotId;
        window.selectedSaveSlot = selectedSaveSlot;
        slotCard.style.background = 'rgba(204, 51, 255, 0.06)';
        slotCard.style.borderColor = 'rgba(204, 51, 255, 0.6)';

        updateResumeButtonUI(slotCard);
      });
    }
  });

  const currentSelectedCard = container.querySelector(`.save-slot-card[data-slot="${selectedSaveSlot}"]`);
  if (currentSelectedCard) {
    currentSelectedCard.click();
  }
}
window.setupSaveSlotsUI = setupSaveSlotsUI;

function updateResumeButtonUI(selectedCard) {
  const resumeBtn = document.getElementById('resume-save-btn');
  if (!resumeBtn) return;

  const hasSave = selectedCard.getAttribute('data-has-save') === 'true';
  if (hasSave) {
    resumeBtn.style.display = 'block';
  } else {
    resumeBtn.style.display = 'none';
  }
}

function setupResumeButtonListener() {
  const resumeBtn = document.getElementById('resume-save-btn');
  if (resumeBtn && !resumeBtn.dataset.listenerBound) {
    resumeBtn.dataset.listenerBound = 'true';
    resumeBtn.addEventListener('click', () => {
      const username = currentAccount || 'guest';
      const slotId = window.selectedSaveSlot || 1;
      const saveDataStr = localStorage.getItem(`spellfusion_run_save_${username}_slot_${slotId}`);
      if (saveDataStr) {
        try {
          const saveData = JSON.parse(saveDataStr);
          window.activeSaveSlot = slotId;
          
          const success = deserializeGameRun(saveData);
          if (success) {
            const modal = document.getElementById('game-setup-modal');
            if (modal) modal.classList.remove('active');
            const lobbyHud = document.getElementById('lobby-hud');
            if (lobbyHud) lobbyHud.style.display = 'none';
            
            if (typeof resumeGameRunLoop === 'function') {
              resumeGameRunLoop();
            }
          }
        } catch (e) {
          alert("Lỗi tải file lưu trận: " + e.message);
        }
      }
    });
  }
}

setTimeout(setupResumeButtonListener, 200);
