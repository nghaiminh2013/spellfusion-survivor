/**
 * ==========================================================================
 * SPELLFUSION SURVIVOR - GM ADMIN PANEL ENGINE
 * Tích hợp công cụ chỉnh sửa thuộc tính, cheats và quản trị Cloud Database (Ban Account, Giftcodes)
 * ==========================================================================
 */

window.gameCheats = {
  godMode: false,
  oneHitKill: false,
  noCooldown: false,
  speedMultiplier: 1.0
};

window.LobbyAdmin = (() => {
  let isAuthenticated = false;
  let currentTab = 'cheats';
  let inspectedUser = null; // Username being inspected in cloud manager

  function open() {
    // Tự động phê duyệt đăng nhập nếu tên tài khoản là 'admin'
    if (window.currentAccount === 'admin') {
      isAuthenticated = true;
    }

    if (isAuthenticated) {
      document.getElementById('admin-panel').style.display = 'flex';
      switchTab('cheats');
      loadUserList();
      loadGiftCodesList();
    } else {
      document.getElementById('admin-auth-panel').style.display = 'flex';
      document.getElementById('admin-auth-pass').value = '';
      document.getElementById('admin-auth-msg').textContent = '';
      document.getElementById('admin-auth-pass').focus();
    }
  }

  function close() {
    document.getElementById('admin-panel').style.display = 'none';
  }

  function closeAuth() {
    document.getElementById('admin-auth-panel').style.display = 'none';
  }

  function submitAuth() {
    const passInput = document.getElementById('admin-auth-pass');
    const msgEl = document.getElementById('admin-auth-msg');
    
    // Mật khẩu GM mặc định
    if (passInput.value === 'taolabi123') {
      isAuthenticated = true;
      closeAuth();
      open();
    } else {
      msgEl.textContent = 'Mật khẩu GM không chính xác! ❌';
      passInput.value = '';
      passInput.focus();
    }
  }

  function switchTab(tabId) {
    currentTab = tabId;
    
    // Deactivate all tabs
    const contents = document.querySelectorAll('.admin-tab-content');
    contents.forEach(c => c.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.admin-tab-btn');
    buttons.forEach(b => b.classList.remove('active'));
    
    // Activate current tab
    document.getElementById(`admin-tab-${tabId}`).classList.add('active');
    
    // Highlight button (Need to query via ID if button has ID)
    const btn = document.getElementById(`admin-btn-${tabId}`);
    if (btn) btn.classList.add('active');
  }

  // ==========================================
  // TAB 1: CHEATS & HACKS
  // ==========================================
  function toggleCheat(cheatKey, isChecked) {
    if (window.gameCheats.hasOwnProperty(cheatKey)) {
      window.gameCheats[cheatKey] = isChecked;
      showToastNotification(`ĐÃ ${isChecked ? 'BẬT' : 'TẮT'} CHEAT`, `Trạng thái ${cheatKey} đã được thay đổi.`, isChecked ? '#00ff66' : '#ff3366');
    }
  }

  function setSpeedHack(val) {
    window.gameCheats.speedMultiplier = parseFloat(val);
    showToastNotification('TỐC ĐỘ DI CHUYỂN', `Đặt hệ số tốc độ chạy thành x${val}.`, '#00ff66');
  }

  function spawnResources() {
    if (window.gameCtx && window.gameCtx.player) {
      const p = window.gameCtx.player;
      p.wood = (p.wood || 0) + 100;
      p.stone = (p.stone || 0) + 100;
      p.iron = (p.iron || 0) + 100;
      p.gold_ore = (p.gold_ore || 0) + 100;
      p.diamond_ore = (p.diamond_ore || 0) + 100;
      
      showToastNotification('NHẬN VẬT LIỆU', 'Đã cộng thêm +100 cho toàn bộ nguyên liệu gỗ, đá, sắt, vàng và kim cương! 🪵💎', '#00ff66');
      if (window.updatePlayerStatsHUD) window.updatePlayerStatsHUD();
    } else {
      showToastNotification('THẤT BẠI', 'Bạn phải vào trận chiến để kích hoạt tính năng này!', '#ff3366');
    }
  }

  function skipWave() {
    if (window.gameCtx && window.gameCtx.gameState === 'PLAYING') {
      window.gameCtx.enemiesToSpawnInWave = 0;
      window.gameCtx.enemies = []; // Clear all active enemies
      showToastNotification('GM SKIP WAVE', 'Đã xóa toàn bộ quái vật và hoàn thành đợt hiện tại!', '#00ff66');
    } else {
      showToastNotification('THẤT BẠI', 'Bạn phải vào trận chiến mới có thể skip wave!', '#ff3366');
    }
  }

  // ==========================================
  // TAB 2: ACCOUNT EDITOR
  // ==========================================
  function updateGold() {
    const input = document.getElementById('admin-edit-gold');
    const value = parseInt(input.value);
    if (isNaN(value) || value < 0) {
      alert('Vui lòng nhập số vàng hợp lệ!');
      return;
    }
    if (window.currentSaveData) {
      window.currentSaveData.gold = value;
      window.saveAccountSave();
      if (window.updateAccountMenuUI) window.updateAccountMenuUI();
      showToastNotification('CẬP NHẬT VÀNG', `Đã đổi số vàng tài khoản thành ${value.toLocaleString()} 🪙`, '#00ff66');
      input.value = '';
    }
  }

  function updateLevel() {
    const input = document.getElementById('admin-edit-level');
    const value = parseInt(input.value);
    if (isNaN(value) || value <= 0) {
      alert('Vui lòng nhập cấp độ hợp lệ!');
      return;
    }
    if (window.currentSaveData) {
      window.currentSaveData.accountLevel = value;
      window.saveAccountSave();
      if (window.updateAccountMenuUI) window.updateAccountMenuUI();
      showToastNotification('CẬP NHẬT CẤP ĐỘ', `Đã đổi cấp độ tài khoản thành Level ${value} 👤`, '#00ff66');
      input.value = '';
    }
  }

  function unlockAllWizards() {
    if (window.currentSaveData) {
      window.currentSaveData.unlockedWizards = ['ignis', 'marina', 'zephyr', 'tesla'];
      window.saveAccountSave();
      if (window.updateAccountMenuUI) window.updateAccountMenuUI();
      showToastNotification('PHÁP SƯ', 'Đã mở khóa thành công toàn bộ Pháp Sư! 🧙‍♂️', '#00ff66');
    }
  }

  function unlockAllAccessories() {
    if (window.currentSaveData && window.ACCESSORIES) {
      const ids = window.ACCESSORIES.map(a => a.id);
      window.currentSaveData.purchasedAccessories = ids;
      window.saveAccountSave();
      if (window.updateAccountMenuUI) window.updateAccountMenuUI();
      showToastNotification('PHỤ KIỆN', 'Đã mở khóa thành công toàn bộ Trang bị/Phụ kiện! 👑', '#00ff66');
    }
  }

  // ==========================================
  // TAB 3: CLOUD DATABASE & BAN ACCOUNT
  // ==========================================
  async function searchUser() {
    const input = document.getElementById('admin-search-user');
    const username = input.value.trim().toLowerCase();
    const resultBox = document.getElementById('admin-search-result');
    
    if (!username) {
      alert('Vui lòng nhập tên tài khoản cần tra cứu!');
      return;
    }

    resultBox.style.display = 'none';
    inspectedUser = null;

    try {
      const pw = await window.dbGet(`usr_${username}_pw`);
      if (pw === null || pw === undefined) {
        alert('Tài khoản không tồn tại trên Cloud!');
        return;
      }

      const decomp = window.loadCloudSave ? await window.loadCloudSave(username) : null;
      const isBanned = await window.dbGet(`usr_${username}_banned`);

      inspectedUser = {
        name: username,
        password: pw,
        banned: isBanned === 'true' || isBanned === true,
        saveData: decomp || { gold: 0, accountLevel: 1 }
      };

      // Cập nhật UI kết quả
      document.getElementById('admin-res-name').textContent = inspectedUser.name;
      document.getElementById('admin-res-pw').textContent = inspectedUser.password;
      document.getElementById('admin-res-gold').textContent = inspectedUser.saveData.gold.toLocaleString() + ' 🪙';
      document.getElementById('admin-res-level').textContent = 'LV ' + inspectedUser.saveData.accountLevel;
      
      const banBtn = document.getElementById('admin-ban-user-btn');
      if (inspectedUser.banned) {
        banBtn.textContent = 'UNBAN ACC';
        banBtn.className = 'admin-btn'; // Green color style
      } else {
        banBtn.textContent = 'BAN ACC';
        banBtn.className = 'admin-btn danger';
      }

      resultBox.style.display = 'flex';
    } catch(e) {
      alert('Lỗi tra cứu: ' + e.message);
    }
  }

  async function toggleBanUser() {
    if (!inspectedUser) return;
    const target = inspectedUser.name;
    const nextBanStatus = !inspectedUser.banned;

    try {
      if (nextBanStatus) {
        // Ban: Ghi cờ banned lên cloud
        await window.dbSet(`usr_${target}_banned`, 'true');
        showToastNotification('BAN TÀI KHOẢN', `Đã khóa vĩnh viễn tài khoản: ${target} 🚫`, '#ff3366');
      } else {
        // Unban: Gỡ bỏ cờ banned
        await window.dbSet(`usr_${target}_banned`, 'false');
        showToastNotification('GỠ BAN', `Đã mở khóa lại tài khoản: ${target} 🟢`, '#00ff66');
      }

      // Tải lại dữ liệu tra cứu và danh sách
      await searchUser();
      await loadUserList();
    } catch(e) {
      alert('Lỗi khi thực hiện Ban/Unban: ' + e.message);
    }
  }

  async function addGoldToUser() {
    if (!inspectedUser) return;
    const target = inspectedUser.name;

    try {
      let decomp = window.loadCloudSave ? await window.loadCloudSave(target) : null;
      if (!decomp) decomp = { gold: 0 };
      
      decomp.gold = (decomp.gold || 0) + 50000;
      
      // Lưu lại lên Cloud sử dụng saveCloudSave
      if (window.saveCloudSave) {
        await window.saveCloudSave(target, decomp);
      }
      
      showToastNotification('TẶNG VÀNG CLOUD', `Đã cộng thêm +50,000 vàng vào tài khoản ${target} trên Cloud Database! 🎁`, '#00ff66');
      
      // Tải lại kết quả tra cứu
      await searchUser();
    } catch(e) {
      alert('Lỗi cộng vàng Cloud: ' + e.message);
    }
  }

  async function setUserGold() {
    if (!inspectedUser) return;
    const target = inspectedUser.name;
    const input = document.getElementById('admin-set-user-gold');
    const value = parseInt(input.value);

    if (isNaN(value) || value < 0) {
      alert('Vui lòng nhập số vàng hợp lệ!');
      return;
    }

    try {
      let decomp = window.loadCloudSave ? await window.loadCloudSave(target) : null;
      if (!decomp) decomp = { gold: 0 };
      
      decomp.gold = value;
      
      if (window.saveCloudSave) {
        await window.saveCloudSave(target, decomp);
      }
      
      showToastNotification('CẬP NHẬT VÀNG', `Đã đặt số vàng của tài khoản ${target} thành ${value.toLocaleString()} 🪙`, '#00ff66');
      input.value = '';
      await searchUser();
    } catch(e) {
      alert('Lỗi đặt vàng: ' + e.message);
    }
  }

  async function setUserLevel() {
    if (!inspectedUser) return;
    const target = inspectedUser.name;
    const input = document.getElementById('admin-set-user-level');
    const value = parseInt(input.value);

    if (isNaN(value) || value <= 0) {
      alert('Vui lòng nhập cấp độ hợp lệ!');
      return;
    }

    try {
      let decomp = window.loadCloudSave ? await window.loadCloudSave(target) : null;
      if (!decomp) decomp = { gold: 0, accountLevel: 1, accountXp: 0 };
      
      decomp.accountLevel = value;
      decomp.accountXp = 0; // Reset XP to 0 when setting level
      
      if (window.saveCloudSave) {
        await window.saveCloudSave(target, decomp);
      }
      
      showToastNotification('CẬP NHẬT CẤP ĐỘ', `Đã đặt cấp độ của tài khoản ${target} thành Level ${value} 👤`, '#00ff66');
      input.value = '';
      await searchUser();
    } catch(e) {
      alert('Lỗi đặt cấp độ: ' + e.message);
    }
  }

  async function inspectUser(username) {
    document.getElementById('admin-search-user').value = username;
    await searchUser();
  }

  async function loadUserList() {
    const container = document.getElementById('admin-user-list-container');
    if (!container) return;
    
    try {
      const raw = await window.dbGet('spellfusion_user_list');
      let users = [];
      if (raw) {
        try {
          const decoded = window.safeAtob ? window.safeAtob(raw) : '';
          users = JSON.parse(decoded || raw);
        } catch (e) {
          try {
            users = JSON.parse(raw);
          } catch(err) {
            users = String(raw).split(',').map(u => u.trim()).filter(Boolean);
          }
        }
      }
      if (!Array.isArray(users)) users = [];

      if (users.length === 0) {
        container.innerHTML = '<span style="font-size:0.68rem; color:#8fa0dd; text-align:center; padding:15px;">Chưa có tài khoản nào đăng ký.</span>';
        return;
      }

      // Sắp xếp tên tài khoản alphabetically
      users.sort();

      // Lấy danh sách cờ Ban cho toàn bộ user song song để tăng tốc độ
      const rows = await Promise.all(users.map(async (u) => {
        const isBanned = await window.dbGet(`usr_${u}_banned`);
        const banned = isBanned === 'true' || isBanned === true;
        return { name: u, banned };
      }));

      container.innerHTML = rows.map(r => `
        <div class="admin-user-row">
          <span class="admin-user-name">${r.name}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="admin-user-status ${r.banned ? 'banned' : ''}">${r.banned ? '🚫 Banned' : '🟢 Active'}</span>
            <button class="admin-btn" style="padding:2px 6px; font-size:0.62rem;" onclick="window.LobbyAdmin.inspectUser('${r.name}')">CHI TIẾT</button>
          </div>
        </div>
      `).join('');
    } catch(e) {
      container.innerHTML = `<span style="font-size:0.68rem; color:#ff3366; text-align:center; padding:15px;">Lỗi tải danh sách: ${e.message}</span>`;
    }
  }

  // ==========================================
  // TAB 4: GIFT CODES GENERATOR
  // ==========================================
  async function loadGiftCodesList() {
    const listEl = document.getElementById('admin-active-codes-list');
    if (!listEl) return;
    
    try {
      const raw = await window.dbGet('spellfusion_global_giftcodes');
      let codes = [];
      if (raw) {
        try {
          const decoded = window.safeAtob ? window.safeAtob(raw) : '';
          codes = JSON.parse(decoded || raw);
        } catch(e) {
          try { codes = JSON.parse(raw); } catch(err) { codes = []; }
        }
      }
      if (!Array.isArray(codes)) codes = [];

      if (codes.length === 0) {
        listEl.innerHTML = '<span style="font-size:0.68rem; color:#8fa0dd; text-align:center; padding:10px;">Chưa có Giftcode tự chế nào được phát hành.</span>';
        return;
      }

      listEl.innerHTML = codes.map((c, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 8px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03); border-radius:6px; font-size:0.7rem;">
          <div style="display:flex; flex-direction:column; gap:2px;">
            <div><strong style="color:#00ff66; font-family:Orbitron;">${c.code}</strong> -> <span style="color:#ffd700; font-weight:bold;">+${c.gold.toLocaleString()} Vàng</span></div>
            <div style="font-size:0.6rem; color:#a8b2db;">${c.desc}</div>
          </div>
          <button class="admin-btn danger" style="padding:2px 6px; font-size:0.62rem;" onclick="window.LobbyAdmin.deleteGiftCode(${idx})">XÓA</button>
        </div>
      `).join('');
    } catch(e) {
      listEl.innerHTML = `<span style="font-size:0.68rem; color:#ff3366; text-align:center; padding:10px;">Lỗi: ${e.message}</span>`;
    }
  }

  async function createGiftCode() {
    const codeInput = document.getElementById('admin-gift-code');
    const goldInput = document.getElementById('admin-gift-gold');
    const descInput = document.getElementById('admin-gift-desc');

    const code = codeInput.value.trim().toUpperCase();
    const gold = parseInt(goldInput.value);
    const desc = descInput.value.trim() || 'Quà tặng may mắn từ Admin!';

    if (!code) {
      alert('Vui lòng nhập tên mã code!');
      return;
    }
    if (isNaN(gold) || gold <= 0) {
      alert('Vui lòng nhập số vàng thưởng hợp lệ!');
      return;
    }

    try {
      const raw = await window.dbGet('spellfusion_global_giftcodes');
      let codes = [];
      if (raw) {
        try {
          const decoded = window.safeAtob ? window.safeAtob(raw) : '';
          codes = JSON.parse(decoded || raw);
        } catch(e) {
          try { codes = JSON.parse(raw); } catch(err) { codes = []; }
        }
      }
      if (!Array.isArray(codes)) codes = [];

      // Kiểm tra trùng code
      if (codes.some(c => c.code === code)) {
        alert('Mã Gift Code này đã tồn tại trên Cloud!');
        return;
      }

      codes.push({ code, gold, desc });
      const valStr = window.safeBtoa ? window.safeBtoa(JSON.stringify(codes)) : JSON.stringify(codes);
      await window.dbSet('spellfusion_global_giftcodes', valStr);
      
      showToastNotification('PHÁT HÀNH GIFTCODE', `Đã tạo thành công Gift Code toàn cục: ${code}! 🎉`, '#00ff66');
      
      // Clear inputs
      codeInput.value = '';
      goldInput.value = '';
      descInput.value = '';
      
      // Reload danh sách
      await loadGiftCodesList();
    } catch(e) {
      alert('Lỗi tạo Giftcode: ' + e.message);
    }
  }

  async function deleteGiftCode(index) {
    if (!confirm('Bạn có chắc chắn muốn xóa mã code này khỏi server?')) return;
    
    try {
      const raw = await window.dbGet('spellfusion_global_giftcodes');
      let codes = [];
      if (raw) {
        try {
          const decoded = window.safeAtob ? window.safeAtob(raw) : '';
          codes = JSON.parse(decoded || raw);
        } catch(e) {
          try { codes = JSON.parse(raw); } catch(err) { codes = []; }
        }
      }
      if (!Array.isArray(codes)) codes = [];

      const removed = codes[index];
      codes.splice(index, 1);
      
      const valStr = window.safeBtoa ? window.safeBtoa(JSON.stringify(codes)) : JSON.stringify(codes);
      await window.dbSet('spellfusion_global_giftcodes', valStr);
      showToastNotification('XÓA GIFTCODE', `Đã xóa mã Gift Code: ${removed.code} khỏi hệ thống.`, '#ff3366');
      
      await loadGiftCodesList();
    } catch(e) {
      alert('Lỗi xóa Giftcode: ' + e.message);
    }
  }

  // ==========================================
  // UTILITIES
  // ==========================================
  function showToastNotification(title, message, color = '#00ff66') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.style.borderLeft = `3px solid ${color}`;
    toast.style.zIndex = '10001';

    toast.innerHTML = `
      <span class="material-symbols-outlined toast-icon" style="color: ${color};">shield</span>
      <div class="toast-content">
        <span class="toast-title" style="color: ${color}; font-family: 'Orbitron'; font-size: 0.75rem;">${title}</span>
        <span class="toast-message" style="font-size: 0.7rem; color: #a8b2db;">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fadeOut');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
  }

  return {
    open,
    close,
    closeAuth,
    submitAuth,
    switchTab,
    toggleCheat,
    setSpeedHack,
    spawnResources,
    skipWave,
    updateGold,
    updateLevel,
    unlockAllWizards,
    unlockAllAccessories,
    searchUser,
    toggleBanUser,
    addGoldToUser,
    setUserGold,
    setUserLevel,
    inspectUser,
    createGiftCode,
    deleteGiftCode
  };
})();
