/* ==========================================
   IDEAFORGE - WORKSHOP BOARD & LOCAL STORAGE
   ========================================== */

const IdeaBoard = {
  ideas: [],

  // Load ideas from LocalStorage
  load() {
    try {
      const stored = localStorage.getItem('ideaforge_saved_ideas');
      this.ideas = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load ideas from local storage", e);
      this.ideas = [];
    }
  },

  // Save ideas array to LocalStorage
  save() {
    try {
      localStorage.setItem('ideaforge_saved_ideas', JSON.stringify(this.ideas));
      this.updateStats();
    } catch (e) {
      console.error("Failed to save ideas to local storage", e);
    }
  },

  // Add a new idea
  add(idea) {
    const newIdea = {
      id: 'idea_' + Date.now(),
      title: idea.title || 'Dự Án Chưa Đặt Tên',
      genre: idea.genre || '-',
      theme: idea.theme || '-',
      mechanic: idea.mechanic || '-',
      constraint: idea.constraint || '-',
      style: idea.style || '-',
      wildcard: idea.wildcard || null,
      notes: idea.notes || '',
      tag: idea.tag || 'Game Jam',
      rating: parseInt(idea.rating) || 3,
      createdAt: new Date().toISOString()
    };
    
    this.ideas.unshift(newIdea); // Add to beginning
    this.save();
    return newIdea;
  },

  // Delete an idea
  delete(id) {
    this.ideas = this.ideas.filter(idea => idea.id !== id);
    this.save();
  },

  // Update an existing idea notes/rating/tag/title
  update(id, updatedFields) {
    const index = this.ideas.findIndex(idea => idea.id === id);
    if (index !== -1) {
      this.ideas[index] = { ...this.ideas[index], ...updatedFields };
      this.save();
      return this.ideas[index];
    }
    return null;
  },

  // Update statistics shown on Dashboard
  updateStats() {
    const totalIdeasEl = document.getElementById('stat-total-ideas');
    if (totalIdeasEl) {
      totalIdeasEl.textContent = this.ideas.length;
    }
    
    // Update Rank based on total ideas
    const rankEl = document.getElementById('stat-rank');
    if (rankEl) {
      const count = this.ideas.length;
      let rankName = 'TẬP SỰ';
      if (count >= 5 && count < 10) rankName = 'THỢ RÈN TẬP SỰ';
      else if (count >= 10 && count < 20) rankName = 'KỸ SƯ SÁNG TẠO';
      else if (count >= 20 && count < 40) rankName = 'BẬC THẦY GAME JAM';
      else if (count >= 40) rankName = 'ĐẤNG SÁNG THẾ Ý TƯỞNG';
      rankEl.textContent = rankName;
    }
  },

  // Render cards grid with search, filter, and sort
  render(containerId, filterTag = 'all', searchQuery = '', sortBy = 'newest') {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    this.load();

    // 1. Filter by tag
    let filtered = this.ideas;
    if (filterTag !== 'all') {
      filtered = filtered.filter(idea => idea.tag.toLowerCase().includes(filterTag.toLowerCase()) || filterTag.toLowerCase().includes(idea.tag.toLowerCase()));
    }

    // 2. Filter by search query (title, notes, or components)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(idea => 
        idea.title.toLowerCase().includes(query) || 
        idea.notes.toLowerCase().includes(query) ||
        idea.genre.toLowerCase().includes(query) ||
        idea.theme.toLowerCase().includes(query) ||
        idea.mechanic.toLowerCase().includes(query) ||
        idea.constraint.toLowerCase().includes(query)
      );
    }

    // 3. Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // 4. Clear grid
    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-ideas-message">
          <div class="alert-icon">⚡</div>
          <h3>Không tìm thấy ý tưởng phù hợp!</h3>
          <p>Hãy thử đổi từ khóa tìm kiếm hoặc nhãn lọc phân loại.</p>
        </div>
      `;
      return;
    }

    // 5. Render cards
    filtered.forEach(idea => {
      const card = document.createElement('div');
      card.className = 'idea-board-card';
      card.id = `card-${idea.id}`;

      // Star string creator
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += i <= idea.rating ? '★' : '☆';
      }

      const formattedDate = new Date(idea.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      card.innerHTML = `
        <div class="card-header">
          <div class="card-title" contenteditable="true" data-field="title" data-id="${idea.id}">${idea.title}</div>
          <div class="card-actions">
            <button class="action-btn" onclick="toggleExpandCard('${idea.id}')" title="Mở rộng/Thu gọn">↕️</button>
            <button class="action-btn" onclick="deleteIdeaCard('${idea.id}')" title="Xóa ý tưởng" style="filter: hue-rotate(120deg);">🗑️</button>
          </div>
        </div>
        
        <div class="card-components">
          <div class="card-comp-item"><strong>Thể loại:</strong> <span>${idea.genre}</span></div>
          <div class="card-comp-item"><strong>Chủ đề:</strong> <span>${idea.theme}</span></div>
          <div class="card-comp-item"><strong>Cơ chế:</strong> <span>${idea.mechanic}</span></div>
          <div class="card-comp-item"><strong>Ràng buộc:</strong> <span>${idea.constraint}</span></div>
          <div class="card-comp-item"><strong>Mỹ thuật:</strong> <span>${idea.style}</span></div>
          ${idea.wildcard ? `<div class="card-comp-item" style="color: #ff007f; width: 100%;"><strong>Biến số:</strong> <span>${idea.wildcard}</span></div>` : ''}
        </div>

        <div class="card-notes" contenteditable="true" data-field="notes" data-id="${idea.id}" placeholder="Thêm mô tả cách chơi của bạn ở đây...">${idea.notes || 'Click vào đây để nhập ghi chú thiết kế game...'}</div>

        <div class="card-footer">
          <span class="card-rating-display" title="Mức độ khả thi">${stars}</span>
          <span class="card-tag-display">${idea.tag}</span>
        </div>
      `;

      // Set up inline editing events
      const titleEl = card.querySelector('[data-field="title"]');
      titleEl.addEventListener('blur', (e) => {
        const newTitle = e.target.innerText.trim();
        if (newTitle !== '') {
          this.update(idea.id, { title: newTitle });
        } else {
          e.target.innerText = idea.title;
        }
      });

      const notesEl = card.querySelector('[data-field="notes"]');
      notesEl.addEventListener('focus', (e) => {
        if (e.target.innerText === 'Click vào đây để nhập ghi chú thiết kế game...') {
          e.target.innerText = '';
        }
      });
      notesEl.addEventListener('blur', (e) => {
        const newNotes = e.target.innerText.trim();
        this.update(idea.id, { notes: newNotes });
        if (newNotes === '') {
          e.target.innerText = 'Click vào đây để nhập ghi chú thiết kế game...';
        }
      });

      grid.appendChild(card);
    });
  },

  // Export all saved ideas to JSON
  exportJSON() {
    this.load();
    if (this.ideas.length === 0) {
      alert("Chưa có ý tưởng nào để xuất!");
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.ideas, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", `ideaforge_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    if (window.SFX) window.SFX.playSuccessChime();
  },

  // Export all saved ideas to Markdown format
  exportMarkdown() {
    this.load();
    if (this.ideas.length === 0) {
      alert("Chưa có ý tưởng nào để xuất!");
      return;
    }

    let md = `# THƯ VIỆN Ý TƯỞNG GAME JAM - IDEAFORGE\n\n`;
    md += `Tài liệu được xuất bản tự động vào ngày ${new Date().toLocaleDateString('vi-VN')} lúc ${new Date().toLocaleTimeString('vi-VN')}.\n\n`;
    md += `*Tổng số dự án: ${this.ideas.length}*\n\n---\n\n`;

    this.ideas.forEach((idea, index) => {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += i <= idea.rating ? '★' : '☆';
      }

      md += `## ${index + 1}. ${idea.title}\n\n`;
      md += `- **Phân loại**: ${idea.tag}\n`;
      md += `- **Độ khả thi / Đánh giá**: ${stars}\n`;
      md += `- **Ngày tạo**: ${new Date(idea.createdAt).toLocaleString('vi-VN')}\n\n`;
      
      md += `### 🛠️ Bộ Thông Số Kỹ Thuật (Specs)\n\n`;
      md += `| Thành phần | Chi tiết cấu thành |\n`;
      md += `| :--- | :--- |\n`;
      md += `| **Thể loại** | ${idea.genre} |\n`;
      md += `| **Chủ đề** | ${idea.theme} |\n`;
      md += `| **Cơ chế** | ${idea.mechanic} |\n`;
      md += `| **Ràng buộc** | ${idea.constraint} |\n`;
      md += `| **Mỹ thuật** | ${idea.style} |\n`;
      if (idea.wildcard) {
        md += `| **Biến số phụ** | *${idea.wildcard}* |\n`;
      }
      md += `\n`;

      md += `### ✍️ Mô Tả Ý Tưởng & Cách Chơi\n\n`;
      md += `${idea.notes || '*Chưa có mô tả chi tiết. Hãy viết thêm trong Xưởng ý tưởng!*'}\n\n`;
      md += `\n---\n\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", `ideaforge_docs_${Date.now()}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (window.SFX) window.SFX.playSuccessChime();
  }
};

// Global handlers mapped to windows for inline HTML calls
window.toggleExpandCard = function(id) {
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.toggle('expanded');
    if (window.SFX) window.SFX.playClick();
  }
};

window.deleteIdeaCard = function(id) {
  if (confirm("Bạn có chắc chắn muốn xóa ý tưởng game này khỏi xưởng không?")) {
    IdeaBoard.delete(id);
    // Reload UI state
    const currentTag = document.querySelector('.tag-filter-btn.active').getAttribute('data-tag');
    const searchVal = document.getElementById('board-search').value;
    const sortVal = document.getElementById('board-sort-by').value;
    IdeaBoard.render('ideas-grid', currentTag, searchVal, sortVal);
    
    if (window.SFX) window.SFX.playLock(true); // Low sound for delete
  }
};

window.IdeaBoard = IdeaBoard;
