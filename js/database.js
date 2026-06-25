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
  spellUpgrades: {}
};

let currentAccount = null;
let currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));

function getAccounts() {
  try {
    const data = safeStorage.getItem('spellfusion_accounts');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Lỗi đọc danh sách tài khoản:", e);
    return {};
  }
}

function saveAccounts(accounts) {
  try {
    safeStorage.setItem('spellfusion_accounts', JSON.stringify(accounts));
  } catch (e) {
    console.error("Lỗi lưu danh sách tài khoản:", e);
  }
}

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
  } else {
    currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    saveAccountSave(username);
  }
  currentAccount = username;
  safeStorage.setItem('spellfusion_session', username);

  // Auto sync on load if not guest to ensure cloud is up to date with local
  if (username !== 'guest') {
    const accounts = getAccounts();
    const password = accounts[username];
    if (password) {
      dbSet(`usr_${username}_pw`, password)
        .catch(err => console.error("Lỗi đồng bộ mật khẩu khi tải:", err));
    }
    dbSet(`usr_${username}_sv`, JSON.stringify(currentSaveData))
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
      return JSON.parse(text);
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

async function dbSet(key, value) {
  try {
    const encodedValue = encodeURIComponent(value);
    const res = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${DB_APP_KEY}/${key}/${encodedValue}`, {
      method: 'POST'
    });
    return res.ok;
  } catch (e) {
    console.error("DB SET Error:", e);
    return false;
  }
}

async function onlineLogin(username, password) {
  try {
    const cloudPassword = await dbGet(`usr_${username}_pw`);
    
    // Case 1: Account does not exist in the cloud -> Auto Register!
    if (!cloudPassword) {
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
      await dbSet(`usr_${username}_sv`, JSON.stringify(currentSaveData));
      
      // Save locally
      const localAccounts = getAccounts();
      localAccounts[username] = password;
      saveAccounts(localAccounts);
      safeStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(currentSaveData));
      
      currentAccount = username;
      safeStorage.setItem('spellfusion_session', username);
      return { success: true, message: 'Đăng ký & Đăng nhập mới thành công! 🎉' };
    }
    
    // Case 2: Account exists in the cloud -> Verify Password
    if (cloudPassword !== password) {
      return { success: false, message: 'Sai mật khẩu!' };
    }
    
    // Load cloud save data
    const cloudSaveStr = await dbGet(`usr_${username}_sv`);
    let parsedSave = null;
    if (cloudSaveStr) {
      try {
        parsedSave = JSON.parse(cloudSaveStr);
      } catch(e) {
        console.error("Lỗi parse save online:", e);
      }
    }
    
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
      await dbSet(`usr_${username}_sv`, JSON.stringify(currentSaveData));
    }
    
    currentAccount = username;
    safeStorage.setItem('spellfusion_session', username);
    return { success: true, message: 'Đăng nhập thành công! 🎉' };
  } catch (err) {
    console.error("Online Login Error:", err);
    return { success: false, message: `Lỗi kết nối máy chủ Cloud: ${err.message}` };
  }
}

async function onlineRegister(username, password) {
  const existingPassword = await dbGet(`usr_${username}_pw`);
  if (existingPassword) {
    return { success: false, message: 'Tài khoản đã tồn tại!' };
  }
  
  const pwSet = await dbSet(`usr_${username}_pw`, password);
  if (!pwSet) {
    return { success: false, message: 'Lỗi đăng ký trên máy chủ Cloud!' };
  }
  
  currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
  await dbSet(`usr_${username}_sv`, JSON.stringify(currentSaveData));
  
  const localAccounts = getAccounts();
  localAccounts[username] = password;
  saveAccounts(localAccounts);
  safeStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(currentSaveData));
  
  currentAccount = username;
  safeStorage.setItem('spellfusion_session', username);
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
      dbSet(`usr_${username}_sv`, JSON.stringify(currentSaveData))
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
