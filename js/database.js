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
  usedCodes: []
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
  } else {
    currentSaveData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    saveAccountSave(username);
  }
  currentAccount = username;
  safeStorage.setItem('spellfusion_session', username);
}

function saveAccountSave(username = currentAccount) {
  if (!username) return;
  try {
    safeStorage.setItem(`spellfusion_save_${username}`, JSON.stringify(currentSaveData));
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
