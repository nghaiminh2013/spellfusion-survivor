// Khai báo các biến toàn cục cho game
let gameCtx = null;
let canvas = null;
let ctx = null;
let keys = {};
let mouse = { x: 0, y: 0, clicked: false };
let assetManager = null;

// Cấu hình Arena
const ARENA_WIDTH = 2500;
const ARENA_HEIGHT = 2500;

// ==========================================
// CHARACTERS CONSTANT DEFINITIONS
// ==========================================
const CHARACTERS = {
  'ignis': {
    name: 'Ignis',
    title: 'Chiến Binh Lửa',
    desc: 'Sát thương cực lớn, thiên hướng tấn công thiêu rụi kẻ địch.',
    icon: '🔥',
    startElement: 'fire',
    spells: ['ignis_z', 'ignis_x', 'ignis_c', 'ignis_v'],
    rarity: 'common',
    cost: 0,
    stats: {
      maxHp: 90,
      speed: 3.4,
      damageModifier: 1.25,
      cooldownModifier: 1.0,
      magnetRadius: 85,
      critChance: 0.10
    }
  },
  'marina': {
    name: 'Marina',
    title: 'Chiến Binh Nước',
    desc: 'Sinh tồn bền bỉ, có khả năng tự hồi phục sinh mệnh theo thời gian.',
    icon: '💧',
    startElement: 'water',
    spells: ['marina_z', 'marina_x', 'marina_c', 'marina_v'],
    rarity: 'common',
    cost: 0,
    stats: {
      maxHp: 120,
      speed: 3.1,
      damageModifier: 0.95,
      cooldownModifier: 1.0,
      magnetRadius: 125,
      critChance: 0.0
    }
  },
  'zephyr': {
    name: 'Zephyr',
    title: 'Chiến Binh Gió',
    desc: 'Tốc độ di chuyển nhanh, hồi chiêu nhanh và cơ động bậc nhất.',
    icon: '🍃',
    startElement: 'wind',
    spells: ['zephyr_z', 'zephyr_x', 'zephyr_c', 'zephyr_v'],
    rarity: 'common',
    cost: 0,
    stats: {
      maxHp: 80,
      speed: 4.1,
      damageModifier: 0.85,
      cooldownModifier: 0.70,
      magnetRadius: 85,
      critChance: 0.10
    }
  },
  'tesla': {
    name: 'Tesla',
    title: 'Chiến Binh Sét',
    desc: 'Tỷ lệ chí mạng cao, các chiêu thức giật xích sét lan truyền diện rộng.',
    icon: '⚡',
    startElement: 'lightning',
    spells: ['tesla_z', 'tesla_x', 'tesla_c', 'tesla_v'],
    rarity: 'common',
    cost: 0,
    stats: {
      maxHp: 85,
      speed: 3.6,
      damageModifier: 1.0,
      cooldownModifier: 0.90,
      magnetRadius: 85,
      critChance: 0.20
    }
  },
  'frost': {
    name: 'Frost',
    title: 'Chiến Binh Băng',
    desc: 'Khống chế diện rộng cực mạnh, đóng băng cứng kẻ địch bất động và bắn băng tiễn xuyên thấu.',
    icon: '❄️',
    startElement: 'frost',
    spells: ['frost_z', 'frost_x', 'frost_c', 'frost_v'],
    rarity: 'epic',
    cost: 2000,
    stats: {
      maxHp: 110,
      speed: 3.3,
      damageModifier: 1.45,
      cooldownModifier: 0.85,
      magnetRadius: 85,
      critChance: 0.10
    }
  },
  'magma': {
    name: 'Vulcan',
    title: 'Chiến Binh Dung Nham',
    desc: 'Sức mạnh hủy diệt từ núi lửa. Đấm tay dung nham đẩy lùi, khiên đá tiêu hủy đạn và gọi mưa thiên thạch bão lửa.',
    icon: '🌋',
    startElement: 'magma',
    spells: ['magma_z', 'magma_x', 'magma_c', 'magma_v'],
    rarity: 'epic',
    cost: 5000,
    stats: {
      maxHp: 130,
      speed: 3.2,
      damageModifier: 1.55,
      cooldownModifier: 0.85,
      magnetRadius: 90,
      critChance: 0.12
    }
  },
  'creation': {
    name: 'Genesis',
    title: 'Chiến Binh Tinh Tú',
    desc: 'Sức mạnh tinh tú thần thánh. Bắn 3 tia uốn lượn nổ lan, triệu hồi Nebula di động hút đạn, phản kích và đóng băng diện rộng.',
    icon: '🌌',
    startElement: 'creation',
    spells: ['creation_z', 'creation_x', 'creation_c', 'creation_v'],
    rarity: 'legendary',
    cost: 25000,
    stats: {
      maxHp: 140,
      speed: 3.8,
      damageModifier: 1.60,
      cooldownModifier: 0.80,
      magnetRadius: 95,
      doubleCastChance: 0.15,
      critChance: 0.18
    }
  },
  'wolf': {
    name: 'Lycan',
    title: 'Chiến Binh Sói',
    desc: 'Chiến binh cận chiến dã thú, gọi đệ sói, vồ đập nện boss và hóa sói lửa hủy diệt bản đồ.',
    icon: '🐺',
    startElement: 'wolf',
    spells: ['wolf_z', 'wolf_x', 'wolf_c', 'wolf_v'],
    rarity: 'mythical',
    cost: 30000,
    stats: {
      maxHp: 200,
      speed: 4.4,
      damageModifier: 2.0,
      cooldownModifier: 0.80,
      magnetRadius: 100,
      critChance: 0.25
    }
  },
  'gaia': {
    name: 'Gaia',
    title: 'Chiến Binh Đất',
    desc: 'Sức mạnh cổ xưa của rừng già và lòng đất. Triệu hồi gai đá làm choáng, dây leo gai trói quái, vòng đá hộ vệ va đập nổ và gây động đất diện rộng cực mạnh.',
    icon: '⛰️',
    startElement: 'gaia',
    spells: ['gaia_z', 'gaia_x', 'gaia_c', 'gaia_v'],
    rarity: 'epic',
    cost: 10000,
    stats: {
      maxHp: 160,
      speed: 3.3,
      damageModifier: 1.35,
      cooldownModifier: 0.90,
      magnetRadius: 90,
      critChance: 0.10
    }
  },
  'umbra': {
    name: 'Umbra',
    title: 'Chiến Binh Hắc Ám',
    desc: 'Bậc thầy nguyền rủa hắc ám và điều khiển hư vô. Bắn hắc cầu nguyền rủa nổ lan truyền, kết giới hắc ám hút máu hồi HP, gọi mưa ăn mòn hủy diệt và hóa hắc thần lifesteal.',
    icon: '🔮',
    startElement: 'umbra',
    spells: ['umbra_z', 'umbra_x', 'umbra_c', 'umbra_v'],
    rarity: 'legendary',
    cost: 15000,
    stats: {
      maxHp: 120,
      speed: 3.7,
      damageModifier: 1.50,
      cooldownModifier: 0.85,
      magnetRadius: 95,
      critChance: 0.15
    }
  },
  'chronos': {
    name: 'Chronos',
    title: 'Chiến Binh Thời Không',
    desc: 'Bậc thầy thao túng thời gian và không gian. Tấn công bằng quả cầu thời gian nổ chậm, tạo kết giới ngưng đọng làm chậm quái cực mạnh và tua ngược thời gian để cứu sinh mệnh.',
    icon: '⏳',
    startElement: 'chronos',
    spells: ['chronos_z', 'chronos_x', 'chronos_c', 'chronos_v'],
    rarity: 'legendary',
    cost: 22000,
    stats: {
      maxHp: 110,
      speed: 3.9,
      damageModifier: 1.40,
      cooldownModifier: 0.80,
      magnetRadius: 90,
      critChance: 0.15
    }
  },
  'venom': {
    name: 'Venom',
    title: 'Chiến Binh Độc Dược',
    desc: 'Chuyên gia sử dụng độc dược nguy hiểm làm chậm và bào mòn sinh lực quái vật trên diện rộng.',
    icon: '🧪',
    startElement: 'venom',
    spells: ['venom_z', 'venom_x', 'venom_c', 'venom_v'],
    rarity: 'epic',
    cost: 18000,
    stats: {
      maxHp: 100,
      speed: 3.5,
      damageModifier: 1.20,
      cooldownModifier: 0.80,
      magnetRadius: 90,
      critChance: 0.15
    }
  }
};

// ==========================================
// SPELL RECIPES DEFINITIONS
// ==========================================
const SPELL_RECIPES = {
  // Đánh thường nguyên tố
  'basic_fire': { name: 'Tia Lửa Thường', desc: 'Bắn hỏa cầu nhỏ thiêu đốt quái', cd: 20 },
  'basic_water': { name: 'Bong Bóng Nước', desc: 'Bắn bóng nước làm chậm quái', cd: 20 },
  'basic_wind': { name: 'Dao Gió Thường', desc: 'Bắn lưỡi gió nhỏ đẩy lùi quái', cd: 20 },
  'basic_lightning': { name: 'Tia Điện Thường', desc: 'Bắn tia điện nhỏ gây tê liệt quái', cd: 20 },
  'basic_ice': { name: 'Tia Băng Thường', desc: 'Bắn tia băng nhỏ làm chậm quái', cd: 20 },
  'basic_creation': { name: 'Tia Sáng Vũ Trụ 🌌', desc: 'Bắn 3 tia tinh tú uốn lượn, tự dí quái và nổ lan gây choáng nhẹ', cd: 20 },
  'basic_magma': { name: 'Tia Dung Nham Thường', desc: 'Bắn tia dung nham nhỏ gây bỏng quái', cd: 20 },
  'basic_wolf': { name: 'Vuốt Sói Thường', desc: 'Cào cận chiến dã thú tầm gần', cd: 20 },
  'claw_melee': { name: 'Vuốt Sói Cận Chiến', desc: 'Cào cận chiến sát thương diện rộng tầm gần', cd: 20 },

  // Phép đặc trưng của Ignis
  'ignis_z': { name: 'Hơi Thở Của Rồng 🐲', desc: 'Bắn chuỗi 4 viên đạn lửa thẳng tắp', cd: 30 },
  'ignis_x': { name: 'Hỏa Cầu Tích Tụ ☄️', desc: 'Đè nút để tích tụ, thả để bắn hỏa cầu khổng lồ', cd: 180 },
  'ignis_c': { name: 'Nổ Chia Rẽ 💥', desc: 'Bắn hỏa cầu to nổ vỡ ra 10-15 hỏa cầu nhỏ', cd: 240 },
  'ignis_v': { name: 'Tia Lửa Hủy Diệt ⚡', desc: 'Đè nút tích tụ, thả ra quét sạch map', cd: 540 },
  'fire_fire': { name: 'Tia Lửa Rồng', desc: 'Phun tia lửa liên tục đốt quái', cd: 7 },
  'magma': { name: 'Đạn Nham Thạch', desc: 'Bắn đá nham thạch nổ diện rộng nhỏ', cd: 24 },
  'magma_magma': { name: 'Thiên Thạch Rơi', desc: 'Cầu dung nham khổng lồ nổ hủy diệt', cd: 60 },
  'fire_explosion': { name: 'Hỏa Cầu Bùng Nổ', desc: 'Siêu hỏa cầu nổ diện rộng tỏa tia lửa phụ', cd: 70 },

  // Phép đặc trưng của Marina
  'marina_z': { name: 'Bong Bóng Nước 🫧', desc: 'Bắn bong bóng nổ làm chậm quái 30%', cd: 90 },
  'marina_x': { name: 'Cá Mập Săn Mồi 🦈', desc: 'Vây cá dí quái, trồi lên cắn sát thương lớn', cd: 240 },
  'marina_c': { name: 'Xoáy Nước Cuốn 🌪️', desc: 'Tạo xoáy nước hút và gây sát thương quái', cd: 300 },
  'marina_v': { name: 'Khiên Trú Ẩn 🛡️', desc: 'Tạo 6 cầu nước xoay quanh chặn sát thương & phản đòn', cd: 900 },
  'water': { name: 'Bóng Băng Tỏa', desc: 'Bắn 3 mảnh băng bay tỏa hình cánh quạt', cd: 20 },
  'water_water': { name: 'Mưa Băng Bùng Nổ', desc: 'Bắn vòng gai băng tỏa ra 8 hướng', cd: 40 },
  'water_wind': { name: 'Bão Tuyết Phân Mảnh', desc: 'Sóng băng bùng nổ bắn gai tuyết ra mọi hướng', cd: 80 },
  'water_ice': { name: 'Băng Tiễn Nhọn', desc: 'Mũi tên băng xuyên thấu làm chậm quái', cd: 40 },

  // Phép đặc trưng của Zephyr
  'zephyr_z': { name: 'Dao Gió Bão 🍃', desc: 'Bắn 3 lưỡi gió xuyên thấu đẩy lùi quái', cd: 60 },
  'zephyr_x': { name: 'Lướt Gió Phân Thân 🌀', desc: 'Lướt né đòn, để lại phân thân gió hút quái nổ tung', cd: 270 },
  'zephyr_c': { name: 'Mắt Bão Hút Quái 🌪️', desc: 'Triệu hồi cơn lốc khổng lồ di chuyển dồn quái vào tâm', cd: 360 },
  'zephyr_v': { name: 'Phong Thần Hộ Thể 🪽', desc: 'Mọc cánh gió tăng tốc chạy, di chuyển tự động tạo lốc xoáy', cd: 720 },

  // Phép đặc trưng của Tesla
  'tesla_z': { name: 'Xích Lôi Giật Điện ⚡', desc: 'Bắn tia sét giật truyền điện lan truyền 6 quái vật', cd: 72 },
  'tesla_x': { name: 'Cầu Điện Từ Pulsar 🔋', desc: 'Cầu điện phóng sét liên tục, phát nổ bắn tia chớp tỏa tròn', cd: 240 },
  'tesla_c': { name: 'Lôi Phạt Thiên Kiếp ⛈️', desc: 'Triệu hồi mây giông giật sét liên tiếp gây choáng quái', cd: 330 },
  'tesla_v': { name: 'Quá Tải Lôi Thần 🔋', desc: 'Trạng thái quá tải tăng 50% chí mạng, đòn đánh kích hoạt sét lan', cd: 840 },

  // Phép đặc trưng của Frost (Băng Pháp Sư)
  'frost_z': { name: 'Băng Tiễn Liên Hoàn 🏹', desc: 'Bắn liên tục 3 mũi tên băng xuyên thấu kẻ địch', cd: 36 },
  'frost_x': { name: 'Băng Phong Trận ❄️', desc: 'Phát nổ vòng tròn hơi lạnh cực sâu đóng băng cứng quái', cd: 120 },
  'frost_c': { name: 'Trụ Băng Vĩnh Cửu 🏔️', desc: 'Triệu hồi trụ băng làm chậm quái và vỡ vụn bắn mảnh vụn', cd: 180 },
  'frost_v': { name: 'Bão Tuyết Hủy Diệt 🌨️', desc: 'Trận bão tuyết hoành tráng làm chậm và đóng băng cứng quái diện rộng', cd: 480 },

  // Phép đặc trưng của Vulcan (Dung Nham Pháp Sư)
  'magma_z': { name: 'Bàn Tay Dung Nham 🥊', desc: 'Triệu hồi cánh tay dung nham co giãn liên tục đấm 12 phát đẩy lùi quái', cd: 240 },
  'magma_x': { name: 'Giáp Dung Nham 🛡️', desc: 'Bọc cơ thể bằng đá nóng chảy tăng giáp và phóng tia lửa thiêu quái', cd: 480 },
  'magma_c': { name: 'Khe Nứt Địa Ngục ⛓️', desc: 'Tạo vết rạn nứt dung nham dài đẩy lùi và thiêu quái trên đường thẳng', cd: 300 },
  'magma_v': { name: 'Thiên Thạch Phun Trào ☄️', desc: 'Gọi mưa thiên thạch nham thạch rơi xung quanh tạo nhiều bãi dung nham lớn', cd: 900 },

  // Phép đặc trưng của Lycan (Sói Pháp Sư)
  'wolf_z': { name: 'Triệu Hồi Đồng Bọn 🐺', desc: 'Gọi 4 sói con đồng hành chạy cắn xé quái vật lân cận', cd: 80 },
  'wolf_x': { name: 'Khè Hơi Dã Thú 🌬️', desc: 'Gầm thét khè hơi khiến toàn bộ quái xung quanh văng cực xa', cd: 120 },
  'wolf_c': { name: 'Hút & Vồ Đập Đất 🐾', desc: 'Hút quái trước mặt rồi vồ nhảy nện chết quái thường, rút 1/3 HP boss', cd: 360 },
  'wolf_v': { name: 'Hóa Hình Sói 👹', desc: 'Biến sói khổng lồ tăng tốc chạy, giảm sát thương nhận, tăng sát thương phép & tầm đánh', cd: 600 },

  // Phép đặc trưng của Genesis (Sáng Thế Pháp Sư)
  'creation_z': { name: 'Khối Hộp Sáng Thế ⬜', desc: 'Khối năng lượng sáng thế nổ và co rút hút quái vào tâm', cd: 48 },
  'creation_x': { name: 'Đĩa Sao Thao Túng 💿', desc: 'Bắn đĩa sao bay chậm xoáy liên hoàn dí theo quái gần nhất', cd: 150 },
  'creation_c': { name: 'Trận Đồ Tinh Tú 🌌', desc: 'Trận đồ tinh vân xoáy bắn tia sao liên tục làm choáng quái', cd: 240 },
  'creation_v': { name: 'Tinh Vân Sụp Đổ 🌀', desc: 'Nebula bám theo, giật điện làm chậm, hút đạn quái phản công & sụp đổ đóng băng 3 giây', cd: 600 },
  
  // Phép đặc trưng của Gaia (Đại Địa Pháp Sư)
  'basic_gaia': { name: 'Thạch Cầu Thường', desc: 'Bắn tảng đá nhỏ lăn gây sát thương đè bẹp quái', cd: 20 },
  'gaia_z': { name: 'Địa Chấn Lan Truyền ⛰️', desc: 'Tạo đường nứt đá gai nhọn làm choáng quái vật', cd: 180 },
  'gaia_x': { name: 'Dây Leo Cổ Thụ 🌿', desc: 'Triệu hồi dây gai trói quái vật lân cận', cd: 240 },
  'gaia_c': { name: 'Vòng Đá Hộ Vệ 🪨', desc: 'Tạo 3 hòn đá bay quanh người va đập nổ tung quái', cd: 300 },
  'gaia_v': { name: 'Đại Địa Nứt Vỡ 🌋', desc: 'Đập đất tạo trận động đất cực lớn gây sát thương liên tiếp và làm chậm 80%', cd: 600 },

  // Phép đặc trưng của Umbra (Hắc Ám Pháp Sư)
  'basic_umbra': { name: 'Ám Cầu Thường', desc: 'Bắn ám cầu bay uốn lượn hút sinh lực quái', cd: 20 },
  'umbra_z': { name: 'Hắc Cầu Nguyền Rủa 🌑', desc: 'Bắn ám cầu xuyên thấu nguyền rủa, quái chết phát nổ lây lan', cd: 150 },
  'umbra_x': { name: 'Hắc Ám Kết Giới 🕸️', desc: 'Tạo vùng suy yếu quái nhận thêm 30% sát thương và hồi máu cho ta', cd: 300 },
  'umbra_c': { name: 'Mưa Băng Hoại 🌧️', desc: 'Cơn mưa ăn mòn gây sát thương thiêu đốt hắc ám diện rộng cực lâu', cd: 270 },
  'umbra_v': { name: 'Hắc Thần Hiện Thân 👑', desc: 'Tăng 50% tốc chạy, nhận 30% hút máu (Lifesteal) và đòn đánh bắn ra hắc tiễn xuyên thấu', cd: 900 },
  
  // Phép đặc trưng của Chronos (Thời Không Pháp Sư)
  'basic_chronos': { name: 'Đạn Thời Gian', desc: 'Bắn đạn thời không gây sát thương và làm chậm quái', cd: 20 },
  'chronos_z': { name: 'Hạt Cầu Thời Không ⏳', desc: 'Bắn ra hạt cầu năng lượng thời gian nổ chậm sau 1.2 giây', cd: 120 },
  'chronos_x': { name: 'Ngưng Đọng Kết Giới 🌀', desc: 'Tạo kết giới ngưng đọng làm chậm 80% quái vật lọt vào và gây sát thương', cd: 260 },
  'chronos_c': { name: 'Bom Không Gian 💣', desc: 'Thả quả bom không gian khổng lồ nổ diện rộng cực mạnh', cd: 320 },
  'chronos_v': { name: 'Tua Ngược Thời Gian 🔄', desc: 'Hồi ngay 35% máu và làm đóng băng toàn bộ quái vật trên bản đồ trong 3 giây', cd: 750 },

  // Phép cũ thừa kế
  'fire_lightning': { name: 'Quả Cầu Plasma', desc: 'Cầu điện nổ diện rộng cực mạnh', cd: 60 },
  'fire_water': { name: 'Hơi Nước Scald', desc: 'Phun 5 tia hơi nước nóng lan rộng', cd: 9 },
  'fire_wind': { name: 'Lốc Xoáy Lửa', desc: 'Lốc lửa hút quái vào trung tâm', cd: 40 },
  'lightning_water': { name: 'Bong Bóng Điện', desc: 'Bong bóng khóa chân quái và giật điện', cd: 30 },
  'water_lightning': { name: 'Bong Bóng Điện Lôi', desc: 'Bong bóng khóa chân quái và giật điện', cd: 30 },
  'wood': { name: 'Mầm Sống', desc: 'Bắn hạt mầm làm chậm quái', cd: 20 },
  'wood_wood': { name: 'Cổ Thụ Trỗi Dây', desc: 'Mọc rễ cây bò trói quái', cd: 50 },
  'water_wood': { name: 'Cành Liễu Băng', desc: 'Bắn chùm gai băng gỗ tỏa 3 hướng', cd: 30 },
  'lightning_wood': { name: 'Sét Thần Mộc', desc: 'Tia sét giật truyền điện', cd: 35 },
  'fire_magma': { name: 'Thác Dung Nham', desc: 'Bắn 3 quả cầu nham thạch nổ liên hoàn', cd: 35 },
  'water_magma': { name: 'Hơi Bùn Nóng', desc: 'Phun bùn sôi nổ làm chậm quái', cd: 30 },
  'lightning_magma': { name: 'Nham Thạch Điện', desc: 'Cầu nham thạch phóng điện', cd: 45 },
  'magma_wind': { name: 'Bão Tro Bụi', desc: 'Tro bụi núi lửa đẩy lùi quái', cd: 35 },
  
  // Phép đặc trưng của Venom (Chiến Binh Độc Dược)
  'basic_venom': { name: 'Tia Độc', desc: 'Bắn tia độc nhỏ gây sát thương và làm chậm nhẹ', cd: 20 },
  'venom_z': { name: 'Quả Cầu Độc', desc: 'Bắn cầu độc phát nổ tạo vũng độc dưới đất', cd: 90 },
  'venom_x': { name: 'Bình Axit', desc: 'Ném bình axit tạo bãi độc lớn ăn mòn và làm chậm quái', cd: 240 },
  'venom_c': { name: 'Rắn Độc', desc: 'Triệu hồi rắn độc xuyên thấu mọi kẻ địch', cd: 300 },
  'venom_v': { name: 'Sương Độc', desc: 'Tỏa khí độc làm suy yếu và rút HP quái cực mạnh', cd: 600 },

  'gun_handgun': { name: 'Súng Lục Neon', desc: 'Bắn tia đạn neon nhanh và mạnh', cd: 15 },
  'gun_rifle': { name: 'Súng Liên Thanh', desc: 'Bắn liên tục tia đạn tầm trung', cd: 7 },
  'gun_shotgun': { name: 'Súng Săn Neon', desc: 'Bắn chùm 5 tia đạn tỏa rộng', cd: 35 },
  'none': { name: 'Ma Pháp Sơ Cấp', desc: 'Bắn đạn ma pháp trắng cơ bản', cd: 25 }
};

// ==========================================
// SPELL DATA & RANGE CALCULATOR
// ==========================================
function getSpellMaxRange(spellKey, player) {
  const recipes = {
    'gun_handgun': { speed: 16, maxLife: 35 },
    'gun_rifle': { speed: 20, maxLife: 35 },
    'gun_shotgun': { speed: 14, maxLife: 22 },
    'ignis_z': { speed: 12, maxLife: 40 },
    'ignis_x': { speed: 8, maxLife: 80 },
    'ignis_c': { speed: 10, maxLife: 60 },
    'ignis_v': { speed: 0, maxLife: 30 },
    'marina_z': { speed: 8, maxLife: 50 },
    'marina_x': { speed: 6, maxLife: 100 },
    'marina_c': { speed: 0, maxRadius: 80 },
    'marina_v': { speed: 0, maxLife: 600 },
    'zephyr_z': { speed: 12, maxLife: 50 },
    'zephyr_x': { speed: 0, maxLife: 120 },
    'zephyr_c': { speed: 1.5, maxLife: 240 },
    'zephyr_v': { speed: 0, maxLife: 480 },
    'tesla_z': { speed: 15, maxLife: 30 },
    'tesla_x': { speed: 3.5, maxLife: 120 },
    'tesla_c': { speed: 0, maxRadius: 130 },
    'tesla_v': { speed: 0, maxLife: 360 },
    'basic_fire': { speed: 10, maxLife: 40 },
    'basic_water': { speed: 9, maxLife: 45 },
    'basic_wind': { speed: 11, maxLife: 35 },
    'basic_lightning': { speed: 12, maxLife: 30 },
    'basic_ice': { speed: 12, maxLife: 40 },
    'basic_creation': { speed: 11, maxLife: 45 },
    'claw_melee': { speed: 6, maxLife: 8 },
    'frost_z': { speed: 13, maxLife: 45 },
    'frost_x': { speed: 0, maxRadius: 110 },
    'frost_c': { speed: 10, maxLife: 30 },
    'frost_v': { speed: 0, maxRadius: 280 },
    'magma_z': { speed: 9, maxLife: 50 },
    'magma_x': { speed: 0, maxRadius: 80 },
    'magma_c': { speed: 12, maxLife: 40 },
    'magma_v': { speed: 8, maxLife: 60 },
    'wolf_z': { speed: 8, maxLife: 45 },
    'wolf_x': { speed: 0, maxRadius: 120 },
    'wolf_c': { speed: 15, maxLife: 40 },
    'wolf_v': { speed: 0, maxLife: 480 },
    'creation_z': { speed: 12, maxLife: 40 },
    'creation_x': { speed: 5, maxLife: 150 },
    'creation_c': { speed: 0, maxRadius: 180 },
    'creation_v': { speed: 0, maxRadius: 200 },
    'fire_fire': { speed: 14, maxLife: 25 },
    'water_water': { speed: 7.5, maxLife: 70 },
    'lightning_lightning': { speed: 12, maxLife: 20 },
    'wind_wind': { speed: 6.5, maxLife: 130 },
    'fire_water': { speed: 9, maxLife: 20 },
    'fire_lightning': { speed: 5, maxLife: 100 },
    'fire_wind': { speed: 3, maxLife: 150 },
    'water_lightning': { speed: 6, maxLife: 160 },
    'water_wind': { speed: 0, maxLife: 30, maxRadius: 160 },
    'lightning_wind': { speed: 0, maxLife: 15, maxRadius: 60 },
    'water': { speed: 9.5, maxLife: 65 },
    'lightning': { speed: 12, maxLife: 22 },
    'wind': { speed: 9, maxLife: 55 },
    'wood': { speed: 11, maxLife: 50 },
    'wood_wood': { speed: 4.5, maxLife: 80 },
    'wind_wood': { speed: 12, maxLife: 45 },
    'water_wood': { speed: 10, maxLife: 60 },
    'lightning_wood': { speed: 11, maxLife: 55 },
    'magma': { speed: 8, maxLife: 70 },
    'magma_magma': { speed: 4, maxLife: 90 },
    'fire_magma': { speed: 9, maxLife: 55 },
    'water_magma': { speed: 7, maxLife: 40 },
    'lightning_magma': { speed: 6, maxLife: 75 },
    'magma_wind': { speed: 5, maxLife: 100 },
    'fire_explosion': { speed: 5, maxLife: 110 },
    'water_ice': { speed: 12, maxLife: 50 },
    'wind_blade': { speed: 9.5, maxLife: 65 },
    'lightning_orb': { speed: 3.2, maxLife: 130 },
    'chronos_z': { speed: 8, maxLife: 90 },
    'chronos_x': { speed: 0, maxRadius: 100 },
    'chronos_c': { speed: 0, maxRadius: 180 },
    'chronos_v': { speed: 0, maxLife: 180 },
    'basic_chronos': { speed: 10, maxLife: 40 },
    'none': { speed: 10, maxLife: 60 }
  };
  const data = recipes[spellKey] || recipes['none'];
  const baseRange = data.maxRadius ? data.maxRadius : (data.speed * data.maxLife);
  const rangeUpgradeMod = player.spellRangeModifier || 1.0;
  return baseRange * rangeUpgradeMod;
}

// ==========================================
// SPELL COOLDOWN CALCULATOR
// ==========================================
function getActualSpellCD(player, spellIndex) {
  const spellKey = player.spells[spellIndex];
  const lvl = player.spellLevels[spellIndex] || 1;
  let baseCD = SPELL_RECIPES[spellKey].cd || 30;

  if (player.characterKey === 'ignis' && spellIndex === 0) { // Ignis Z
    const reductionCount = Math.min(3, lvl - 1);
    baseCD = 30 - reductionCount * 6; // 0.5s down to 0.2s
  } else if (player.characterKey === 'marina' && spellIndex === 3) { // Marina V
    baseCD = 900 - (lvl - 1) * 60; // 15s down to 11s (4 upgrades)
  } else if (player.characterKey === 'frost') {
    const reductions = [4, 15, 20, 60];
    baseCD = Math.max(12, baseCD - (lvl - 1) * (reductions[spellIndex] || 5));
  } else if (player.characterKey === 'magma') {
    const reductions = [5, 15, 20, 60];
    baseCD = Math.max(12, baseCD - (lvl - 1) * (reductions[spellIndex] || 5));
  } else if (player.characterKey === 'creation') {
    const reductions = [6, 15, 30, 60];
    baseCD = Math.max(12, baseCD - (lvl - 1) * (reductions[spellIndex] || 5));
  } else if (player.characterKey === 'wolf') {
    const reductions = [20, 15, 45, 60];
    baseCD = Math.max(12, baseCD - (lvl - 1) * (reductions[spellIndex] || 5));
  } else if (player.characterKey === 'chronos') {
    const reductions = [20, 30, 45, 60];
    baseCD = Math.max(12, baseCD - (lvl - 1) * (reductions[spellIndex] || 5));
  } else if (player.characterKey === 'venom') {
    const reductions = [12, 30, 45, 60];
    baseCD = Math.max(12, baseCD - (lvl - 1) * (reductions[spellIndex] || 5));
  }

  let cd = baseCD * player.cooldownModifier;

  // Áp dụng giảm hồi chiêu từ nâng cấp chiêu thức vĩnh viễn ở sảnh chờ (-8% mỗi cấp)
  const wizardKey = player.characterKey || 'ignis';
  const spellUpgrades = currentSaveData.spellUpgrades || {};
  const charSpellUpgrades = spellUpgrades[wizardKey] || [0, 0, 0, 0];
  const permLvl = charSpellUpgrades[spellIndex] || 0;
  cd *= (1 - permLvl * 0.08);

  return Math.max(5, cd);
}

// Cấu hình Bản đồ (MAPS)
const MAPS = {
  'forest': {
    name: 'Rừng Nguyên Sinh',
    desc: 'Bản đồ rừng sâu thanh bình, quái xuất hiện ở mức độ cơ bản.',
    bgColor: '#0a1d12',
    gridColor: 'rgba(0, 255, 127, 0.05)',
    borderColor: '#00ff7f',
    glowColor: 'rgba(0, 255, 127, 0.3)'
  },
  'volcano': {
    name: 'Núi Lửa Nham Thạch',
    desc: 'Dung nham nóng bỏng, cẩn thận dẫm phải những bãi magma rực cháy.',
    bgColor: '#1c0502',
    gridColor: 'rgba(255, 69, 0, 0.05)',
    borderColor: '#ff4500',
    glowColor: 'rgba(255, 69, 0, 0.3)'
  },
  'temple': {
    name: 'Đền Thờ Tinh Hệ',
    desc: 'Nơi tập trung tàn tích sấm sét. Tốc độ spawn quái nhanh hơn.',
    bgColor: '#0b0c16',
    gridColor: 'rgba(0, 243, 255, 0.05)',
    borderColor: '#00f3ff',
    glowColor: 'rgba(0, 243, 255, 0.3)'
  },
  'castle': {
    name: 'Lâu Đài Băng Giá',
    desc: 'Lâu đài tuyết phủ vĩnh cửu. Quái trâu hơn và có khả năng chống chịu cao.',
    bgColor: '#091522',
    gridColor: 'rgba(135, 206, 250, 0.05)',
    borderColor: '#87cefa',
    glowColor: 'rgba(135, 206, 250, 0.3)'
  },
  'desert': {
    name: 'Sa Mạc Tử Thần',
    desc: 'Vùng hoang mạc lộng gió bão cát rực cháy, cọ sát tăng sát thương và quái nhanh hơn.',
    bgColor: '#2a1a08',
    gridColor: 'rgba(255, 180, 0, 0.04)',
    borderColor: '#d4af37',
    glowColor: 'rgba(255, 180, 0, 0.25)'
  }
};

