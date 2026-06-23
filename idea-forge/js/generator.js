/* ==========================================
   IDEAFORGE - CREATIVE DATABASES & GENERATOR
   ========================================== */

const GENRES = [
  "Nhập vai (RPG)",
  "Đi ngang (Platformer)",
  "Đi ải ngẫu nhiên (Roguelike)",
  "Chiến thuật (Strategy)",
  "Câu đố (Puzzle)",
  "Mô phỏng (Simulation)",
  "Đua xe / Tốc độ (Racing)",
  "Thẻ bài / Deckbuilder",
  "Nhịp điệu / Âm nhạc (Rhythm)",
  "Kinh dị (Horror)",
  "Hẹn hò / Visual Novel",
  "Thủ thành (Tower Defense)",
  "Bắn súng góc nhìn thứ nhất (FPS)",
  "Sinh tồn / Survivors",
  "Nuôi thú / Trồng trọt",
  "Chạy vô tận (Endless Runner)"
];

const THEMES = [
  "Không gian viễn tưởng (Sci-fi)",
  "Huyền thoại Cổ tích",
  "Phong cách Hơi nước (Steampunk)",
  "Thế giới Dưới đại dương",
  "Trong giấc mơ của một đứa trẻ",
  "Du hành Thời gian",
  "Thế giới Vi khuẩn / Tế bào",
  "Hậu tận thế (Post-Apocalyptic)",
  "Nấu ăn / Ẩm thực",
  "Bắt ma / Tâm linh",
  "Thuộc địa hóa Sao Hỏa",
  "Thuật giả kim Trung cổ",
  "Bên trong máy vi tính",
  "Tiệm cà phê mèo",
  "Mùa đông vĩnh cửu",
  "Hầm ngục ngập tràn ánh sáng"
];

const MECHANICS = [
  "Đảo ngược trọng lực",
  "Vòng lặp thời gian ngắn",
  "Dịch chuyển tức thời ngắn hạn",
  "Vẽ trực tiếp lên màn hình",
  "Điều khiển bằng âm thanh / giọng nói",
  "Ghép hợp các vật thể (Merge)",
  "Thay đổi kích thước nhân vật",
  "Đi trên tường / Bẻ cong không gian",
  "Sử dụng bóng của chính mình",
  "Định vị bằng tiếng vang (Echolocation)",
  "Vật lý dây thun / Đu dây",
  "Thời gian chỉ trôi khi bạn di chuyển",
  "Cướp đoạt kỹ năng của kẻ thù",
  "Gieo xúc xắc quyết định hành động",
  "Tự chế tạo vũ khí từ linh kiện",
  "Phân thân / Điều khiển nhiều nhân vật"
];

const CONSTRAINTS = [
  "Chỉ sử dụng 1 nút điều khiển",
  "Giới hạn 10 giây mỗi màn",
  "Nhân vật chính không thể nhảy",
  "Không thể trực tiếp tiêu diệt kẻ địch",
  "Máu là tiền tệ (Tiêu máu để nâng cấp)",
  "Chỉ được đi lùi, không thể đi tiến",
  "Màn hình tự xoay 90 độ định kỳ",
  "Tầm nhìn cực kỳ hạn chế (Sương mù)",
  "Không có túi đồ (Chỉ cầm được 1 vật phẩm)",
  "Không có trọng lực (Trôi nổi liên tục)",
  "Mỗi khi chết, bản đồ sẽ thay đổi hoàn toàn",
  "Không được đứng yên quá 3 giây",
  "Chỉ dùng đồ họa 1-bit (Trắng đen)",
  "Âm thanh thu hút quái vật (Im lặng để thắng)",
  "Tất cả hành động phải theo nhịp nhạc",
  "Sức mạnh giảm dần theo thời gian"
];

const STYLES = [
  "Pixel Art 8-bit cổ điển",
  "Vẽ tay bằng bút chì / Phác thảo",
  "Cyberpunk Neon rực rỡ",
  "Voxel 3D hình hộp",
  "Hoạt hình cắt giấy (Papercut)",
  "Đồ họa tối giản (Minimalist Vector)",
  "Tranh thủy mặc / Màu nước",
  "Nét vẽ phấn trên bảng đen",
  "Giao diện dòng lệnh ASCII",
  "Vaporwave thập niên 80",
  "Hoạt hình đất sét (Claymation)",
  "Bản vẽ kỹ thuật xanh (Blueprint)",
  "Tranh kính nhà thờ Gothic",
  "Tranh thêu chữ thập / Vải len",
  "Low-poly 3D hoài cổ",
  "Phong cách truyện tranh phương Tây (Comic)"
];

const WILDCARDS = [
  "Nhân vật chính là kẻ địch, và bạn đang cố gắng thua.",
  "Mọi vật phẩm nhặt được đều làm nhân vật yếu đi.",
  "Bạn chơi cùng lúc 2 trò chơi khác nhau trên cùng màn hình.",
  "Thế giới co lại mỗi khi bạn ghi điểm.",
  "Camera di chuyển liên tục, bạn phải đuổi theo màn hình.",
  "Môi trường là kẻ thù duy nhất, không có quái vật.",
  "Vũ khí duy nhất của bạn là một chiếc khiên phản lực.",
  "Bạn không thể dừng lại, nhân vật tự động chạy liên tục.",
  "Cách duy nhất để gây sát thương là va chạm vật lý đàn hồi.",
  "Mỗi màn chơi được tạo ra dựa trên một bài thơ ngẫu nhiên.",
  "Điểm số là chiều cao của nhân vật. Điểm càng cao càng khó né đòn.",
  "Bạn điều khiển môi trường xung quanh chứ không điều khiển nhân vật chính."
];

const BRAINSTORM_TIPS = [
  "Đầu tiên, hãy tạo ra một MVP (Minimum Viable Product). Đừng lo lắng về đồ họa hay cốt truyện quá sớm.",
  "Kết hợp hai cơ chế dường như không liên quan (như Nấu ăn và Roguelike) thường tạo nên sự đột phá.",
  "Ràng buộc là người bạn tốt nhất của sự sáng tạo. Giới hạn bản thân giúp bạn tìm ra giải pháp thông minh.",
  "Luôn kiểm tra game loop cốt lõi của bạn. Nếu game loop 5 giây đầu tiên không vui, game loop 5 tiếng cũng sẽ không vui.",
  "Game Jam là để thử nghiệm. Đừng ngại thất bại, hãy làm những thứ điên rồ nhất.",
  "Hãy vẽ phác thảo cơ chế lên giấy trước khi bắt tay gõ những dòng code đầu tiên.",
  "Lấy cảm hứng từ những vật dụng xung quanh bạn. Một cục tẩy, cái cốc nước đều có thể làm cơ chế game.",
  "Hãy nghĩ về cách bạn tương tác: Chuột, bàn phím, hay thậm chí là ánh sáng phòng. Đâu là cách độc lạ nhất?",
  "Chơi thử game của bạn với một người khác càng sớm càng tốt để nhận phản hồi trực quan.",
  "Ý tưởng hay nhất là ý tưởng được hiện thực hóa. Một ý tưởng trung bình được code xong tốt hơn ý tưởng thiên tài nằm trên giấy."
];

const PRESET_ROOT_WORDS = [
  "Trọng Lực", "Thời Gian", "Ánh Sáng", "Bóng Tối", "Nước", "Lửa", "Gió", "Âm Thanh", 
  "Ký Ức", "Cái Chết", "Tiền Tệ", "Giấc Mơ", "Kích Thước", "Trí Tuệ Nhân Tạo", "Trọng Lực Ngược",
  "Sự Cô Đơn", "Kết Nối", "Khói Bụi", "Thực Tế Ảo", "Mạng Sống", "Tốc Độ", "Sự Hỗn Loạn"
];

// Helper to get random item
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Main Generator logic
const Generator = {
  // Generate a complete concept
  generateConcept(locks = {}) {
    return {
      genre: locks.genre ? locks.genreVal : getRandomItem(GENRES),
      theme: locks.theme ? locks.themeVal : getRandomItem(THEMES),
      mechanic: locks.mechanic ? locks.mechanicVal : getRandomItem(MECHANICS),
      constraint: locks.constraint ? locks.constraintVal : getRandomItem(CONSTRAINTS),
      style: locks.style ? locks.styleVal : getRandomItem(STYLES),
    };
  },

  // Get a random wildcard
  getWildcard() {
    return getRandomItem(WILDCARDS);
  },

  // Get a random tip
  getTip() {
    return getRandomItem(BRAINSTORM_TIPS);
  },

  // Get a random preset root word
  getRandomRootWord() {
    return getRandomItem(PRESET_ROOT_WORDS);
  },

  // Suggest a game title based on components
  suggestTitle(concept) {
    const prefixes = ["Project", "Neo", "Cyber", "Lost", "Infinite", "Last", "Tiny", "Super", "Retro", "Dark", "Chrono"];
    const suffixes = ["Quest", "Arena", "Knight", "Survivals", "Storm", "Nexus", "Engine", "Forge", "Grid", "Labyrinth", "Odyssey"];
    
    // Choose prefix and suffix
    const p = getRandomItem(prefixes);
    const s = getRandomItem(suffixes);
    
    // Translate some parts to give a themed title
    return `${p} ${s}`;
  }
};

window.Generator = Generator;
