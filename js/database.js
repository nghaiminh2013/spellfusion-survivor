const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return this._fallback[key] || null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      this._fallback[key] = value;
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete this._fallback[key];
    }
  },
  _fallback: {}
};

const DEFAULT_SAVE_DATA = {
  gold: 0,
  accountLevel: 1,
  accountXp: 0,
  unlockedWizards: ['ignis', 'marina', 'zephyr', 'tesla'],
  purchasedAccessories: [],
  equippedAccessories: {},
  maxWaveNormal: 1,
  maxWaveHard: 1,
  usedCodes: [],
  wizardUpgrades: {},
  spellUpgrades: {},
  currentCharacter: 'ignis'
};

let currentAccount = null;
let currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));

let cachedAccounts = {};

function getDeviceId() {
  let deviceId = safeStorage.getItem('spellfusion_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    safeStorage.setItem('spellfusion_device_id', deviceId);
  }
  return deviceId;
}

function getAccounts() {
  try {
    const data = safeStorage.getItem('spellfusion_accounts');
    const local = data ? JSON.parse(data) : {};
    return { ...cachedAccounts, ...local };
  } catch (e) {
    return cachedAccounts;
  }
}

function saveAccounts(accounts) {
  cachedAccounts = accounts;
  try {
    safeStorage.setItem('spellfusion_accounts', JSON.stringify(accounts));
    // Asynchronously update cloud list of accounts for this device
    const deviceId = getDeviceId();
    dbSet(`dev_${deviceId}_accs`, JSON.stringify(accounts))
      .catch(err => console.error("Lỗi đồng bộ danh sách tài khoản lên Cloud:", err));
  } catch (e) {
    console.error("Lỗi lưu danh sách tài khoản:", e);
  }
}

async function syncAccountsWithCloud() {
  try {
    const deviceId = getDeviceId();
    const cloudAccsStr = await dbGet(`dev_${deviceId}_accs`);
    let cloudAccs = {};
    if (cloudAccsStr) {
      try {
        cloudAccs = typeof cloudAccsStr === 'string' ? JSON.parse(cloudAccsStr) : cloudAccsStr;
      } catch (e) {
        console.error("Lỗi parse accounts từ cloud:", e);
      }
    }
    
    // Merge cloud accounts with local accounts
    const localAccounts = getAccounts();
    const merged = { ...cloudAccs, ...localAccounts };
    
    // Save merged list to cache and local storage
    cachedAccounts = merged;
    safeStorage.setItem('spellfusion_accounts', JSON.stringify(merged));
    
    // Push back to cloud to keep in sync
    await dbSet(`dev_${deviceId}_accs`, JSON.stringify(merged));
  } catch (e) {
    console.error("Lỗi đồng bộ tài khoản với Cloud:", e);
  }
}

function setDeviceId(newId) {
  if (newId && newId.startsWith('dev_')) {
    safeStorage.setItem('spellfusion_device_id', newId.trim());
    return true;
  }
  return false;
}

// Expose to window
window.syncAccountsWithCloud = syncAccountsWithCloud;
window.getDeviceId = getDeviceId;
window.setDeviceId = setDeviceId;

function loadAccountSave(username) {
  const saveData = safeStorage.getItem(`spellfusion_save_${username}`);
  let parsedData = null;
  
  if (saveData) {
    try {
      parsedData = JSON.parse(saveData);
    } catch (e) {
      console.error("Lỗi parse dữ liệu tài khoản:", e);
    }
  }

  if (parsedData && typeof parsedData === 'object') {
    currentSaveData = parsedData;
    currentSaveData.unlockedWizards = currentSaveData.unlockedWizards || ['ignis', 'marina', 'zephyr', 'tesla'];
    currentSaveData.purchasedAccessories = currentSaveData.purchasedAccessories || [];
    currentSaveData.equippedAccessories = currentSaveData.equippedAccessories || {};
    currentSaveData.gold = currentSaveData.gold !== undefined ? currentSaveData.gold : 0;
    currentSaveData.accountLevel = currentSaveData.accountLevel || 1;
    currentSaveData.accountXp = currentSaveData.accountXp || 0;
    currentSaveData.maxWaveNormal = currentSaveData.maxWaveNormal || 1;
    currentSaveData.maxWaveHard = currentSaveData.maxWaveHard || 1;
    currentSaveData.wizardUpgrades = currentSaveData.wizardUpgrades || {};
    currentSaveData.spellUpgrades = currentSaveData.spellUpgrades || {};
    currentSaveData.currentCharacter = currentSaveData.currentCharacter || 'ignis';
  } else {
    currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    saveAccountSave(username);
  }
  currentAccount = username;
  safeStorage.setItem('spellfusion_session', username);

  // Also sync the gameCtx character selection if initialized
  if (typeof gameCtx !== 'undefined' && gameCtx) {
    gameCtx.currentCharacter = currentSaveData.currentCharacter;
  }

  // Auto sync on load if not guest to ensure cloud is up to date with local
  if (username !== 'guest') {
    const accounts = getAccounts();
    const password = accounts[username];
    if (password) {
      dbSet(`usr_${username}_pw`, password)
        .catch(err => console.error("Lỗi đồng bộ mật khẩu khi tải:", err));
    }
    saveCloudSave(username, currentSaveData)
      .catch(err => console.error("Lỗi đồng bộ save khi tải:", err));
  }
}

const DB_APP_KEY = 'jcwh9ew5';

async function dbGet(key) {
  try {
    const res = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${DB_APP_KEY}/${key}`);
    if (!res.ok) return null;
    let text = await res.text();
    if (text === null || text === undefined) return null;
    text = text.trim();
    if (text === '""' || text === '' || text === 'null' || text === '"null"') return null;
    
    try {
      let parsed = JSON.parse(text);
      if (typeof parsed === 'string') {
        parsed = parsed.trim();
        if (parsed.startsWith('"') && parsed.endsWith('"')) {
          parsed = parsed.substring(1, parsed.length - 1);
        }
      }
      return parsed;
    } catch (e) {
      let clean = text;
      if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.substring(1, clean.length - 1);
      }
      return clean;
    }
  } catch (e) {
    console.error("DB GET Error:", e);
    return null;
  }
}

function compressSaveData(data) {
  try {
    return JSON.stringify({
      g: data.gold,
      al: data.accountLevel,
      ax: data.accountXp,
      uw: data.unlockedWizards,
      pa: data.purchasedAccessories,
      ea: data.equippedAccessories,
      mwn: data.maxWaveNormal,
      mwh: data.maxWaveHard,
      uc: data.usedCodes,
      wu: data.wizardUpgrades,
      su: data.spellUpgrades,
      cc: data.currentCharacter || 'ignis'
    });
  } catch (e) {
    console.error("Lỗi nén save:", e);
    return JSON.stringify(data);
  }
}

function decompressSaveData(jsonStr) {
  if (!jsonStr) return null;
  try {
    // Làm sạch chuỗi trước khi parse
    let cleanStr = jsonStr.trim();
    if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
      // Trong trường hợp nó bị double-quoted string
      try {
        cleanStr = JSON.parse(cleanStr);
      } catch (e) {
        cleanStr = cleanStr.substring(1, cleanStr.length - 1);
      }
    }
    
    const parsed = JSON.parse(cleanStr);
    if (parsed && (parsed.g !== undefined || parsed.uw !== undefined)) {
      return {
        gold: parsed.g !== undefined ? parsed.g : 0,
        accountLevel: parsed.al || 1,
        accountXp: parsed.ax || 0,
        unlockedWizards: parsed.uw || ['ignis', 'marina', 'zephyr', 'tesla'],
        purchasedAccessories: parsed.pa || [],
        equippedAccessories: parsed.ea || {},
        maxWaveNormal: parsed.mwn || 1,
        maxWaveHard: parsed.mwh || 1,
        usedCodes: parsed.uc || [],
        wizardUpgrades: parsed.wu || {},
        spellUpgrades: parsed.su || {},
        currentCharacter: parsed.cc || 'ignis'
      };
    }
    return parsed;
  } catch (e) {
    console.error("Lỗi giải nén save:", e);
    // Trả về mặc định nếu hỏng
    return null;
  }
}

function safeBtoa(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (e) {
    console.error("safeBtoa error:", e);
    return '';
  }
}

function safeAtob(str) {
  if (!str) return '';
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    console.error("safeAtob error:", e);
    return '';
  }
}

async function saveCloudSave(username, data) {
  if (!username || username === 'guest') return false;
  try {
    const promises = [
      dbSet(`usr_${username}_sv_gold`, String(data.gold)),
      dbSet(`usr_${username}_sv_level`, safeBtoa(JSON.stringify({ al: data.accountLevel, ax: data.accountXp }))),
      dbSet(`usr_${username}_sv_wizards`, safeBtoa(JSON.stringify(data.unlockedWizards))),
      dbSet(`usr_${username}_sv_accs`, safeBtoa(JSON.stringify({ pa: data.purchasedAccessories, ea: data.equippedAccessories }))),
      dbSet(`usr_${username}_sv_waves`, safeBtoa(JSON.stringify({ mwn: data.maxWaveNormal, mwh: data.maxWaveHard }))),
      dbSet(`usr_${username}_sv_upgrades`, safeBtoa(JSON.stringify({ wu: data.wizardUpgrades, su: data.spellUpgrades }))),
      dbSet(`usr_${username}_sv_codes`, safeBtoa(JSON.stringify(data.usedCodes))),
      dbSet(`usr_${username}_sv_char`, data.currentCharacter || 'ignis')
    ];
    const results = await Promise.all(promises);
    return results.every(r => r === true);
  } catch (e) {
    console.error("Lỗi đồng bộ save game lên Cloud:", e);
    return false;
  }
}

async function loadCloudSave(username) {
  try {
    const keys = ['gold', 'level', 'wizards', 'accs', 'waves', 'upgrades', 'codes', 'char'];
    const promises = keys.map(k => dbGet(`usr_${username}_sv_${k}`));
    const results = await Promise.all(promises);
    
    // Check if at least one key has data
    const hasData = results.some(r => r !== null && r !== undefined);
    if (!hasData) {
      // Fallback to old single key
      const oldSaveStr = await dbGet(`usr_${username}_sv`);
      if (oldSaveStr) {
        return decompressSaveData(oldSaveStr);
      }
      return null;
    }
    
    const [goldVal, levelVal, wizardsVal, accsVal, wavesVal, upgradesVal, codesVal, charVal] = results;
    
    const data = {
      gold: goldVal !== null ? Number(goldVal) : 0,
      accountLevel: 1,
      accountXp: 0,
      unlockedWizards: ['ignis', 'marina', 'zephyr', 'tesla'],
      purchasedAccessories: [],
      equippedAccessories: {},
      maxWaveNormal: 1,
      maxWaveHard: 1,
      usedCodes: [],
      wizardUpgrades: {},
      spellUpgrades: {},
      currentCharacter: charVal || 'ignis'
    };
    
    if (levelVal) {
      try {
        const decoded = safeAtob(levelVal);
        if (decoded) {
          const parsed = JSON.parse(decoded);
          data.accountLevel = parsed.al || 1;
          data.accountXp = parsed.ax || 0;
        }
      } catch (e) {}
    }
    
    if (wizardsVal) {
      try {
        const decoded = safeAtob(wizardsVal);
        if (decoded) {
          data.unlockedWizards = JSON.parse(decoded);
        }
      } catch (e) {}
    }
    
    if (accsVal) {
      try {
        const decoded = safeAtob(accsVal);
        if (decoded) {
          const parsed = JSON.parse(decoded);
          data.purchasedAccessories = parsed.pa || [];
          data.equippedAccessories = parsed.ea || {};
        }
      } catch (e) {}
    }
    
    if (wavesVal) {
      try {
        const decoded = safeAtob(wavesVal);
        if (decoded) {
          const parsed = JSON.parse(decoded);
          data.maxWaveNormal = parsed.mwn || 1;
          data.maxWaveHard = parsed.mwh || 1;
        }
      } catch (e) {}
    }
    
    if (upgradesVal) {
      try {
        const decoded = safeAtob(upgradesVal);
        if (decoded) {
          const parsed = JSON.parse(decoded);
          data.wizardUpgrades = parsed.wu || {};
          data.spellUpgrades = parsed.su || {};
        }
      } catch (e) {}
    }
    
    if (codesVal) {
      try {
        const decoded = safeAtob(codesVal);
        if (decoded) {
          data.usedCodes = JSON.parse(decoded);
        }
      } catch (e) {}
    }
    
    return data;
  } catch (e) {
    console.error("Lỗi tải save game từ Cloud:", e);
    return null;
  }
}

async function dbSet(key, value) {
  try {
    const encodedValue = encodeURIComponent(value);
    const apiUrl = `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${DB_APP_KEY}/${key}/${encodedValue}`;
    const res = await fetch(apiUrl, { method: 'POST' });
    return res.ok;
  } catch (e) {
    console.error("DB SET Fetch Error:", e);
    return false;
  }
}

async function registerUserInGlobalList(username) {
  if (!username || username === 'guest') return;
  try {
    let users = [];
    const rawList = await dbGet('spellfusion_user_list');
    if (rawList) {
      try {
        const decoded = safeAtob(rawList);
        users = JSON.parse(decoded || rawList);
      } catch (e) {
        try {
          users = JSON.parse(rawList);
        } catch (err) {
          users = String(rawList).split(',').map(u => u.trim()).filter(Boolean);
        }
      }
    }
    if (!Array.isArray(users)) users = [];
    if (!users.includes(username)) {
      users.push(username);
      await dbSet('spellfusion_user_list', safeBtoa(JSON.stringify(users)));
    }
  } catch(e) {
    console.error("Lỗi đăng ký danh sách người dùng toàn cục:", e);
  }
}

async function onlineLogin(username, password) {
  try {
    // 1. Kiểm tra tài khoản bị Ban
    const isBanned = await dbGet(`usr_${username}_banned`);
    if (isBanned === 'true' || isBanned === true) {
      return { success: false, message: 'Tài khoản của bạn đã bị khóa bởi Ban Quản Trị! 🚫' };
    }

    const cloudPassword = await dbGet(`usr_${username}_pw`);
    
    // Case 1: Account does not exist in the cloud -> Auto Register!
    if (cloudPassword === null || cloudPassword === undefined) {
      // Validate credentials
      if (username.length < 3) {
        return { success: false, message: 'Tên tài khoản mới phải từ 3 ký tự trở lên!' };
      }
      const usernameRegex = /^[a-z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return { success: false, message: 'Tên tài khoản không được chứa dấu, khoảng trắng hoặc ký tự đặc biệt!' };
      }
      if (password.length < 4) {
        return { success: false, message: 'Mật khẩu mới phải từ 4 ký tự trở lên!' };
      }

      // Set the password in the cloud
      const pwSet = await dbSet(`usr_${username}_pw`, password);
      if (!pwSet) {
        return { success: false, message: 'Lỗi tạo mật khẩu trên Cloud!' };
      }
      
      // Look for existing local save data to migrate to the cloud
      const localSaveDataStr = safeStorage.getItem(`spellfusion_save_${username}`);
      let localSave = null;
      if (localSaveDataStr) {
        try {
          localSave = JSON.parse(localSaveDataStr);
        } catch (e) {
          console.error("Lỗi parse dữ liệu cục bộ:", e);
        }
      }
      
      if (localSave && typeof localSave === 'object') {
        currentSaveData = localSave;
      } else {
        currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
      }
      
      // Upload save data to the cloud
      await saveCloudSave(username, currentSaveData);
      
      // Save locally
      const localAccounts = getAccounts();
      localAccounts[username] = password;
      saveAccounts(localAccounts);
      safeStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(currentSaveData));
      
      currentAccount = username;
      safeStorage.setItem('spellfusion_session', username);
      
      // Sync character selection
      if (typeof gameCtx !== 'undefined' && gameCtx) {
        gameCtx.currentCharacter = currentSaveData.currentCharacter || 'ignis';
      }
      
      // Đồng bộ vào user directory toàn cục
      await registerUserInGlobalList(username);

      return { success: true, message: 'Đăng ký & Đăng nhập mới thành công! 🎉' };
    }
    
    // Case 2: Account exists in the cloud -> Verify Password
    const cleanCloudPw = String(cloudPassword).trim().replace(/^"|"$/g, '');
    const cleanInputPw = String(password).trim();
    if (cleanCloudPw !== cleanInputPw) {
      return { success: false, message: 'Sai mật khẩu!' };
    }
    
    // Load cloud save data
    const parsedSave = await loadCloudSave(username);
    
    const localAccounts = getAccounts();
    localAccounts[username] = password;
    saveAccounts(localAccounts);
    
    if (parsedSave) {
      currentSaveData = parsedSave;
      safeStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(currentSaveData));
    } else {
      // In case password exists but save doesn't, create new
      currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
      safeStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(currentSaveData));
      await saveCloudSave(username, currentSaveData);
    }
    
    currentAccount = username;
    safeStorage.setItem('spellfusion_session', username);

    // Sync character selection
    if (typeof gameCtx !== 'undefined' && gameCtx) {
      gameCtx.currentCharacter = currentSaveData.currentCharacter || 'ignis';
    }

    // Đồng bộ vào user directory toàn cục
    await registerUserInGlobalList(username);

    return { success: true, message: 'Đăng nhập thành công! 🎉' };
  } catch (err) {
    console.error("Online Login Error:", err);
    return { success: false, message: `Lỗi kết nối máy chủ Cloud: ${err.message}` };
  }
}

async function onlineRegister(username, password) {
  const existingPassword = await dbGet(`usr_${username}_pw`);
  if (existingPassword !== null && existingPassword !== undefined) {
    return { success: false, message: 'Tài khoản đã tồn tại!' };
  }
  
  const pwSet = await dbSet(`usr_${username}_pw`, password);
  if (!pwSet) {
    return { success: false, message: 'Lỗi đăng ký trên máy chủ Cloud!' };
  }
  
  currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
  await saveCloudSave(username, currentSaveData);
  
  const localAccounts = getAccounts();
  localAccounts[username] = password;
  saveAccounts(localAccounts);
  safeStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(currentSaveData));
  
  currentAccount = username;
  safeStorage.setItem('spellfusion_session', username);

  // Sync character selection
  if (typeof gameCtx !== 'undefined' && gameCtx) {
    gameCtx.currentCharacter = currentSaveData.currentCharacter || 'ignis';
  }

  // Đồng bộ vào user directory toàn cục
  await registerUserInGlobalList(username);

  return { success: true };
}

window.onlineLogin = onlineLogin;
window.onlineRegister = onlineRegister;

function saveAccountSave(username = currentAccount) {
  if (!username) return;
  try {
    safeStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(currentSaveData));
    
    // Auto cloud sync in background if not guest
    if (username !== 'guest') {
      saveCloudSave(username, currentSaveData)
        .catch(err => console.error("Lỗi đồng bộ Cloud:", err));
      
      const accounts = getAccounts();
      const password = accounts[username];
      if (password) {
        dbSet(`usr_${username}_pw`, password)
          .catch(err => console.error("Lỗi đồng bộ mật khẩu:", err));
      }
    }
  } catch (e) {
    console.error("Lỗi ghi dữ liệu tài khoản:", e);
  }
}

// Helper setter để cập nhật session hoặc thay đổi gold từ bên ngoài nếu cần
function setGold(amount) {
  currentSaveData.gold = amount;
  saveAccountSave();
}

function addGold(amount) {
  currentSaveData.gold += amount;
  saveAccountSave();
}

function logout() {
  currentAccount = null;
  currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
  safeStorage.removeItem('spellfusion_session');
}

function exportAllAccountsData() {
  const exportData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('spellfusion_')) {
      exportData[key] = localStorage.getItem(key);
    }
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(exportData))));
}

function importAllAccountsData(base64Data) {
  try {
    const jsonStr = decodeURIComponent(escape(atob(base64Data.trim())));
    const exportData = JSON.parse(jsonStr);
    
    // Validate that it contains spellfusion keys
    const keys = Object.keys(exportData);
    const hasSpellfusion = keys.some(k => k.startsWith('spellfusion_'));
    if (!hasSpellfusion || keys.length === 0) return false;

    for (const key in exportData) {
      if (key.startsWith('spellfusion_')) {
        localStorage.setItem(key, exportData[key]);
      }
    }
    return true;
  } catch (e) {
    console.error("Lỗi nhập dữ liệu:", e);
    return false;
  }
}

window.exportAllAccountsData = exportAllAccountsData;
window.importAllAccountsData = importAllAccountsData;

// ============================================================
// HỆ THỐNG KẾT BẠN (FRIEND SYSTEM)
// ============================================================

// Lấy danh sách bạn bè của 1 user từ cloud
async function getFriendList(username) {
  const raw = await dbGet(`usr_${username}_friends`);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch(e) { return []; }
}

// Lấy danh sách lời mời KẾT BẠN đang chờ (gửi đến user này)
async function getFriendRequests(username) {
  const raw = await dbGet(`usr_${username}_freq`);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch(e) { return []; }
}

// Gửi lời mời kết bạn
async function sendFriendRequest(fromUser, toUser) {
  if (!fromUser || !toUser || fromUser === toUser) return { success: false, msg: 'Không hợp lệ!' };

  // Kiểm tra tài khoản tồn tại
  const targetPw = await dbGet(`usr_${toUser}_pw`);
  if (!targetPw) return { success: false, msg: 'Không tìm thấy người chơi!' };

  // Kiểm tra đã là bạn chưa
  const myFriends = await getFriendList(fromUser);
  if (myFriends.includes(toUser)) return { success: false, msg: 'Đã là bạn bè rồi!' };

  // Kiểm tra đã gửi lời mời chưa
  const theirRequests = await getFriendRequests(toUser);
  if (theirRequests.includes(fromUser)) return { success: false, msg: 'Đã gửi lời mời rồi!' };

  // Thêm fromUser vào danh sách lời mời của toUser
  theirRequests.push(fromUser);
  await dbSet(`usr_${toUser}_freq`, JSON.stringify(theirRequests));
  return { success: true, msg: `Đã gửi lời mời kết bạn tới ${toUser}! ✅` };
}

// Chấp nhận lời mời kết bạn
async function acceptFriendRequest(myUser, fromUser) {
  // Thêm nhau vào danh sách bạn
  const myFriends = await getFriendList(myUser);
  const theirFriends = await getFriendList(fromUser);

  if (!myFriends.includes(fromUser)) myFriends.push(fromUser);
  if (!theirFriends.includes(myUser)) theirFriends.push(myUser);

  await dbSet(`usr_${myUser}_friends`, JSON.stringify(myFriends));
  await dbSet(`usr_${fromUser}_friends`, JSON.stringify(theirFriends));

  // Xóa khỏi danh sách lời mời
  const myRequests = await getFriendRequests(myUser);
  const updated = myRequests.filter(u => u !== fromUser);
  await dbSet(`usr_${myUser}_freq`, JSON.stringify(updated));

  return { success: true };
}

// Từ chối lời mời kết bạn
async function rejectFriendRequest(myUser, fromUser) {
  const myRequests = await getFriendRequests(myUser);
  const updated = myRequests.filter(u => u !== fromUser);
  await dbSet(`usr_${myUser}_freq`, JSON.stringify(updated));
  return { success: true };
}

// Xóa bạn bè
async function removeFriend(myUser, friendUser) {
  const myFriends = await getFriendList(myUser);
  const theirFriends = await getFriendList(friendUser);

  const myUpdated = myFriends.filter(u => u !== friendUser);
  const theirUpdated = theirFriends.filter(u => u !== myUser);

  await dbSet(`usr_${myUser}_friends`, JSON.stringify(myUpdated));
  await dbSet(`usr_${friendUser}_friends`, JSON.stringify(theirUpdated));
  return { success: true };
}

// Tìm kiếm người chơi (kiểm tra tài khoản có tồn tại không)
async function searchPlayer(username) {
  if (!username || username.length < 2) return { found: false, error: false };
  try {
    const pw = await dbGet(`usr_${username}_pw`);
    if (pw) return { found: true, username };
    return { found: false, error: false };
  } catch(e) {
    return { found: false, error: true };
  }
}

// Expose currentAccount ra window để LobbyFriends đọc được
Object.defineProperty(window, 'currentAccount', {
  get: () => currentAccount,
  configurable: true
});

// Expose currentSaveData ra window
Object.defineProperty(window, 'currentSaveData', {
  get: () => currentSaveData,
  set: (val) => { currentSaveData = val; },
  configurable: true
});

window.sendFriendRequest = sendFriendRequest;
window.acceptFriendRequest = acceptFriendRequest;
window.rejectFriendRequest = rejectFriendRequest;
window.removeFriend = removeFriend;
window.searchPlayer = searchPlayer;
window.getFriendList = getFriendList;
window.getFriendRequests = getFriendRequests;
window.loadCloudSave = loadCloudSave;
window.saveCloudSave = saveCloudSave;
window.safeBtoa = safeBtoa;
window.safeAtob = safeAtob;
