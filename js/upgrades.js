// Removed imports to support global script loading.
// SPELL_RECIPES is loaded globally.
const UPGRADES = [
  {
    id: 'cooldown',
    name: 'Tốc Độ Bắn ⚡',
    desc: 'Giảm 10% thời gian chờ, tăng tốc độ bắn phép liên tục.',
    icon: '⚡',
    rarity: 'common',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.cooldown = (player.upgrades.cooldown || 0) + 1;
      player.cooldownModifier *= 0.90;
    }
  },
  {
    id: 'damage',
    name: 'Sát Thương Phép 💥',
    desc: 'Tăng thêm 15% uy lực sát thương cho tất cả các loại chiêu thức.',
    icon: '💥',
    rarity: 'common',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.damage = (player.upgrades.damage || 0) + 1;
      player.damageModifier += 0.15;
    }
  },
  {
    id: 'speed',
    name: 'Giày Chạy Nhanh 🥾',
    desc: 'Tăng nhẹ tốc độ độ chạy giúp di chuyển linh hoạt né quái.',
    icon: '🥾',
    rarity: 'common',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.speed = (player.upgrades.speed || 0) + 1;
      player.speed += 0.25;
    }
  },
  {
    id: 'magnet',
    name: 'Nhẫn Nam Châm 🧲',
    desc: 'Mở rộng thêm phạm vi hút ngọc kinh nghiệm và ngọc nguyên tố.',
    icon: '🧲',
    rarity: 'common',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.magnet = (player.upgrades.magnet || 0) + 1;
      player.magnetRadius += 15;
    }
  },
  {
    id: 'maxhp',
    name: 'Sinh Mệnh Khỏe Mạnh 🛡️',
    desc: 'Tăng thêm 15 máu tối đa và hồi lại 15 máu ngay lập tức.',
    icon: '🛡️',
    rarity: 'rare',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.maxhp = (player.upgrades.maxhp || 0) + 1;
      player.maxHp += 15;
      player.hp += 15;
    }
  },
  {
    id: 'heal',
    name: 'Bình Máu Thánh 🧪',
    desc: 'Hồi phục ngay lập tức 50 máu (Có thể chọn nhiều lần vô hạn).',
    icon: '🧪',
    rarity: 'common',
    maxLevel: 99,
    effect: (player) => {
      player.upgrades.heal = (player.upgrades.heal || 0) + 1;
      player.hp = Math.min(player.maxHp, player.hp + 50);
    }
  },
  {
    id: 'size',
    name: 'Gương Phóng Đại 🔮',
    desc: 'Tăng 10% kích thước đạn và vùng ảnh hưởng phép thuật.',
    icon: '🔮',
    rarity: 'common',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.size = (player.upgrades.size || 0) + 1;
      player.spellSizeModifier += 0.10;
    }
  },
  {
    id: 'range',
    name: 'Kính Viễn Vọng 👁️',
    desc: 'Tăng thêm 15% tầm bay xa của các viên đạn phép thuật.',
    icon: '👁️',
    rarity: 'common',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.range = (player.upgrades.range || 0) + 1;
      player.spellRangeModifier = (player.spellRangeModifier || 1.0) + 0.15;
    }
  },
  {
    id: 'doublecast',
    name: 'Song Hành Phép ♊',
    desc: 'Tăng 8% cơ hội tự động bắn thêm 1 chiêu giống hệt miễn phí.',
    icon: '♊',
    rarity: 'rare',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.doublecast = (player.upgrades.doublecast || 0) + 1;
      player.doubleCastChance += 0.08;
    }
  },
  {
    id: 'crit',
    name: 'Chí Mạng Phép 🎯',
    desc: 'Tăng 8% tỷ lệ đòn đánh phép trúng đích gây gấp đôi sát thương.',
    icon: '🎯',
    rarity: 'rare',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.crit = (player.upgrades.crit || 0) + 1;
      player.critChance += 0.08;
    }
  },
  {
    id: 'wisp',
    name: 'Hỏa Tinh Hộ Mệnh 🧚',
    desc: 'Gọi thêm 1 đốm lửa ma thuật bay quanh tự động bắn quái.',
    icon: '🧚',
    rarity: 'rare',
    maxLevel: 10,
    effect: (player) => {
      player.upgrades.wisp = (player.upgrades.wisp || 0) + 1;
      player.wispCount = player.upgrades.wisp;
    }
  },
  {
    id: 'miner_efficiency',
    name: 'Hiệu Suất Máy Đào 💎',
    desc: 'Tăng 20% tốc độ khai thác tài nguyên của tất cả Máy Đào.',
    icon: '💎',
    rarity: 'rare',
    maxLevel: 5,
    effect: (player) => {
      player.upgrades.miner_efficiency = (player.upgrades.miner_efficiency || 0) + 1;
      player.minerEfficiencyModifier = 1 + player.upgrades.miner_efficiency * 0.20;
    }
  }
];

function getRandomUpgrades(player, count = 3) {
  const available = UPGRADES.filter(upg => {
    const currentLvl = player.upgrades[upg.id] || 0;
    return currentLvl < upg.maxLevel;
  });

  const spellUpgrades = [];
  const keyChars = ['Z', 'X', 'C', 'V'];
  player.spells.forEach((spellKey, index) => {
    const lvl = player.spellLevels[index];
    const maxLvl = (spellKey === 'ignis_z') ? 6 : 5;
    if (lvl > 0 && lvl < maxLvl) {
      const recipe = SPELL_RECIPES[spellKey] || SPELL_RECIPES['none'];
      let customDesc = `Gia tăng uy lực của ma pháp (Cấp ${lvl + 1}/${maxLvl}).`;
      
      if (spellKey === 'ignis_z') {
        const hasCDReduction = (lvl < 4);
        customDesc = `Tăng thêm 10% sát thương hiện có${hasCDReduction ? ' và giảm 0.1 giây hồi chiêu' : ''} (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'ignis_x') {
        customDesc = `Tăng bán kính phát nổ diện rộng thêm 20% (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'ignis_c') {
        customDesc = `Mở rộng diện tích nổ thêm 20% và tăng 10% sát thương (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'ignis_v') {
        customDesc = `Tăng 20% độ rộng tia lửa hủy diệt và tăng 10% sát thương (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'marina_z') {
        customDesc = `Tăng 30% diện tích phát nổ của bong bóng nước (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'marina_x') {
        customDesc = `Tăng 30% tốc độ di chuyển của vây cá mập dí quái (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'marina_c') {
        customDesc = `Tăng thêm 20% sát thương xoáy nước hút quái (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'marina_v') {
        customDesc = `Tăng thời gian tồn tại khiên thêm 2 giây và giảm 1 giây hồi chiêu (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'zephyr_z') {
        customDesc = `Tăng thêm 10% sát thương và 10% kích thước của lưỡi gió (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'zephyr_x') {
        customDesc = `Mở rộng 20% phạm vi hút của phân thân gió (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'zephyr_c') {
        customDesc = `Tăng thời gian tồn tại thêm 20% và tăng 10% sát thương của bão (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'zephyr_v') {
        customDesc = `Kéo dài thời gian bay thêm 2 giây và tự động tạo lốc xoáy nhanh hơn 3 frame (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'tesla_z') {
        customDesc = `Truyền thêm 1 mục tiêu và tăng 10% sát thương của xích lôi (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'tesla_x') {
        customDesc = `Bắn thêm 1 tia sét mỗi nhịp và phóng thêm 2 mảnh đạn khi nổ (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'tesla_c') {
        customDesc = `Mở rộng diện tích mây giông 20% và tăng 10% sát thương sét giật (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'tesla_v') {
        customDesc = `Kéo dài thời gian quá tải thêm 2 giây và tăng 15% sát thương tia sét lan truyền (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'frost_z') {
        customDesc = `Bắn thêm 1 băng tiễn và tăng 15% sát thương băng tiễn (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'frost_x') {
        customDesc = `Tăng bán kính băng phong trận thêm 20% và tăng 15% sát thương (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'frost_c') {
        customDesc = `Tăng 20% sát thương nổ trụ băng và phóng thêm 2 mảnh băng nhỏ (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'frost_v') {
        customDesc = `Tăng thời gian bão tuyết thêm 1 giây và tăng 10% sát thương mỗi nhịp (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'magma_z') {
        customDesc = `Tăng 15% sát thương và 10% tốc độ liên hoàn đấm của bàn tay dung nham (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'magma_x') {
        customDesc = `Tăng 20% sát thương giáp dung nham và kéo dài thời gian khiên thêm 1 giây (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'magma_c') {
        customDesc = `Tăng 20% sát thương địa ngục phun trào và mở rộng bán kính cột nham thạch 10% (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'magma_v') {
        customDesc = `Tăng 20% sát thương rơi thiên thạch và tăng số lượng thiên thạch thêm 2 quả (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'wolf_z') {
        const nextLvl = lvl + 1;
        if (nextLvl === 3) {
          customDesc = `Tăng 15% sát thương và tăng số đệ triệu hồi lên 6 sói (Cấp ${nextLvl}/${maxLvl}).`;
        } else if (nextLvl === 5) {
          customDesc = `Tăng 15% sát thương và tiến hóa thành 8 sói lửa cắn gây cháy quái (Cấp ${nextLvl}/${maxLvl}).`;
        } else {
          customDesc = `Tăng 15% sát thương cắn xé của sói con đồng hành (Cấp ${nextLvl}/${maxLvl}).`;
        }
      } else if (spellKey === 'wolf_x') {
        const nextLvl = lvl + 1;
        if (nextLvl === 5) {
          customDesc = `Tăng 20% bán kính (lên tới 540px), 15% sát thương và triệt tiêu đạn quái trong tầm dội (Cấp ${nextLvl}/${maxLvl}).`;
        } else {
          customDesc = `Tăng 20% bán kính gầm thét siêu rộng và tăng 15% sát thương (Cấp ${nextLvl}/${maxLvl}).`;
        }
      } else if (spellKey === 'wolf_c') {
        const nextLvl = lvl + 1;
        if (nextLvl === 5) {
          customDesc = `Tăng 25% sát thương vồ nện đất và tạo thêm 3 đường nứt địa chấn nham thạch làm choáng (Cấp ${nextLvl}/${maxLvl}).`;
        } else {
          customDesc = `Tăng 25% sát thương vồ nện dã thú diện rộng (Cấp ${nextLvl}/${maxLvl}).`;
        }
      } else if (spellKey === 'wolf_v') {
        customDesc = `Tăng 25% Sinh lực tối đa dạng Sói (đạt tới 250% HP người). Dạng sói nhận 15% hút máu cận chiến để hồi máu sói (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'creation_z') {
        customDesc = `Tăng 20% bán kính hút của hố đen và tăng 20% sát thương nổ sụp đổ (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'creation_x') {
        customDesc = `Tăng 15% sát thương của đĩa sao vũ trụ xoay tròn (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'creation_c') {
        customDesc = `Tăng 15% sát thương và tăng 10% kích thước trận đồ tinh tú (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'creation_v') {
        customDesc = `Tăng 25% sát thương tinh vân sụp đổ và mở rộng tầm hút đạn 10% (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'gaia_z') {
        customDesc = `Tăng 20% sát thương địa chấn và tăng 0.5 giây thời gian gây choáng quái (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'gaia_x') {
        customDesc = `Tăng 20% sát thương dây gai và kéo dài thời gian trói chân quái thêm 0.5 giây (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'gaia_c') {
        customDesc = `Tăng thêm 1 hòn đá bay quanh và tăng 15% sát thương va chạm đá hộ vệ (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'gaia_v') {
        customDesc = `Tăng 20% sát thương động đất và kéo dài thời gian động đất thêm 1 giây (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'umbra_z') {
        customDesc = `Tăng 20% sát thương hắc cầu xuyên thấu và tăng 25% sát thương nổ lây lan (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'umbra_x') {
        customDesc = `Tăng thêm 10% sát thương suy yếu quái nhận thêm và hồi máu tăng 1.5 lần (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'umbra_c') {
        customDesc = `Tăng 20% sát thương mưa băng hoại và kéo dài cơn mưa thêm 1.5 giây (Cấp ${lvl + 1}/${maxLvl}).`;
      } else if (spellKey === 'umbra_v') {
        customDesc = `Tăng thời gian duy trì hóa Hắc thần thêm 2 giây và tăng 15% sát thương hắc tiễn (Cấp ${lvl + 1}/${maxLvl}).`;
      }

      spellUpgrades.push({
        id: `spell_${index}`,
        name: `Nâng Cấp: ${recipe.name}`,
        desc: customDesc,
        icon: keyChars[index],
        rarity: 'common',
        maxLevel: maxLvl,
        effect: (p) => {
          p.spellLevels[index]++;
          p.updateHUD();
        }
      });
    }
  });

  const allAvailable = [...available, ...spellUpgrades];

  const weightedList = [];
  for (const upg of allAvailable) {
    let weight = 75;
    if (upg.rarity === 'rare') weight = 25;

    for (let i = 0; i < weight; i++) {
      weightedList.push(upg);
    }
  }

  const selected = [];
  const selectedIds = new Set();
  const actualCount = Math.min(count, allAvailable.length);

  while (selected.length < actualCount && weightedList.length > 0) {
    const randomIndex = Math.floor(Math.random() * weightedList.length);
    const item = weightedList[randomIndex];
    
    if (!selectedIds.has(item.id)) {
      selected.push(item);
      selectedIds.add(item.id);
    }
  }

  return selected;
}


