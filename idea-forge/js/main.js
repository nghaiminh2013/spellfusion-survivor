/* ==========================================
   IDEAFORGE - MAIN INTERACTIVE CONTROLLER
   ========================================== */

// Global App State
const AppState = {
  currentScreen: 'screen-dashboard',
  
  // Mixer State
  mixer: {
    locks: {
      genre: false,
      theme: false,
      mechanic: false,
      constraint: false,
      style: false
    },
    currentConcept: null,
    currentWildcard: null,
    rating: 3,
    isSpinning: false
  },
  
  // Marathon Game State
  marathon: {
    isPlaying: false,
    duration: 60, // seconds
    timeLeft: 60,
    score: 0,
    wordCount: 0,
    combo: 1,
    maxCombo: 1,
    comboProgress: 100, // 0 to 100
    enteredWords: new Set(),
    lastWord: '',
    difficulty: 'easy', // easy or hard
    rootWord: '',
    timerInterval: null,
    comboInterval: null,
    graph: null
  }
};

// Start application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Local Storage & Board stats
  IdeaBoard.load();
  IdeaBoard.updateStats();

  // Load initial random tip
  cycleDashboardTip();

  // Attach Event Listeners
  setupNavigation();
  setupMixerEventListeners();
  setupMarathonEventListeners();
  setupBoardEventListeners();
  
  // Render initial board grid
  IdeaBoard.render('ideas-grid');

  // Audio system warm up on first click anywhere
  document.body.addEventListener('click', () => {
    if (window.SFX) window.SFX.init();
  }, { once: true });
});

/* ==========================================
   1. NAVIGATION & SCREEN TRANSITIONS
   ========================================== */
function setupNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetScreen = btn.getAttribute('data-target');
      switchScreen(targetScreen);
    });
  });
}

function switchScreen(screenId) {
  if (AppState.mixer.isSpinning || AppState.marathon.isPlaying) {
    if (AppState.marathon.isPlaying) {
      if (!confirm("Trận đấu Marathon đang diễn ra! Bạn có chắc chắn muốn bỏ dở để chuyển màn hình không?")) {
        return;
      }
      abortMarathon();
    } else {
      return; // Prevent switching while spinning slot machine
    }
  }

  // Play click audio
  if (window.SFX) window.SFX.playClick();

  // UI Active class management
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-target') === screenId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const currentActive = document.querySelector('.screen.active');
  const targetActive = document.getElementById(screenId);

  if (currentActive && currentActive.id !== screenId) {
    currentActive.classList.remove('active');
    setTimeout(() => {
      targetActive.classList.add('active');
      AppState.currentScreen = screenId;
      onScreenOpened(screenId);
    }, 150); // Match CSS transition timing
  } else if (!currentActive) {
    targetActive.classList.add('active');
    AppState.currentScreen = screenId;
    onScreenOpened(screenId);
  }
}

function onScreenOpened(screenId) {
  if (screenId === 'screen-board') {
    // Refresh board
    const currentTag = document.querySelector('.tag-filter-btn.active').getAttribute('data-tag');
    const searchVal = document.getElementById('board-search').value;
    const sortVal = document.getElementById('board-sort-by').value;
    IdeaBoard.render('ideas-grid', currentTag, searchVal, sortVal);
  } else if (screenId === 'screen-dashboard') {
    IdeaBoard.updateStats();
    // Refresh dashboard high score if exists
    const storedHighScore = localStorage.getItem('ideaforge_marathon_highscore');
    document.getElementById('stat-high-score').textContent = storedHighScore ? storedHighScore : 0;
  }
}

// Cycle tips on dashboard
function cycleDashboardTip() {
  const tipEl = document.getElementById('dashboard-tip');
  if (tipEl) {
    tipEl.textContent = `"${Generator.getTip()}"`;
  }
}
document.getElementById('next-tip-btn').addEventListener('click', () => {
  cycleDashboardTip();
  if (window.SFX) window.SFX.playClick();
});


/* ==========================================
   2. REACTOR MIXER COMPONENT LOGIC
   ========================================== */
function setupMixerEventListeners() {
  // Lock Buttons toggles
  const keys = ['genre', 'theme', 'mechanic', 'constraint', 'style'];
  keys.forEach(key => {
    const btn = document.getElementById(`lock-${key}`);
    btn.addEventListener('click', () => {
      AppState.mixer.locks[key] = !AppState.mixer.locks[key];
      const column = document.getElementById(`slot-${key}`);
      
      if (AppState.mixer.locks[key]) {
        column.classList.add('locked');
        btn.textContent = '🔒';
      } else {
        column.classList.remove('locked');
        btn.textContent = '🔓';
      }

      if (window.SFX) window.SFX.playLock(AppState.mixer.locks[key]);
    });
  });

  // Unlock All button
  document.getElementById('btn-unlock-all').addEventListener('click', () => {
    keys.forEach(key => {
      AppState.mixer.locks[key] = false;
      document.getElementById(`slot-${key}`).classList.remove('locked');
      document.getElementById(`lock-${key}`).textContent = '🔓';
    });
    if (window.SFX) window.SFX.playLock(false);
  });

  // Spin button click
  document.getElementById('btn-spin').addEventListener('click', spinReactor);

  // Wildcard button click
  document.getElementById('btn-wildcard').addEventListener('click', addWildcard);

  // Rating Stars selection logic
  document.querySelectorAll('#forge-rating .star').forEach(star => {
    star.addEventListener('click', (e) => {
      const val = parseInt(e.target.getAttribute('data-value'));
      setMixerRating(val);
      if (window.SFX) window.SFX.playClick();
    });
  });

  // Save Idea logic
  document.getElementById('btn-save-idea').addEventListener('click', saveForgedIdea);
}

function setMixerRating(val) {
  AppState.mixer.rating = val;
  document.querySelectorAll('#forge-rating .star').forEach(star => {
    const starVal = parseInt(star.getAttribute('data-value'));
    if (starVal <= val) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

function addWildcard() {
  if (AppState.mixer.isSpinning) return;
  
  const wCard = Generator.getWildcard();
  AppState.mixer.currentWildcard = wCard;
  
  const wRow = document.getElementById('wildcard-row');
  const wSpan = document.getElementById('comp-wildcard');
  wRow.style.display = 'block';
  wSpan.textContent = wCard;
  
  if (window.SFX) window.SFX.playSuccessChime();
}

function spinReactor() {
  if (AppState.mixer.isSpinning) return;

  AppState.mixer.isSpinning = true;
  AppState.mixer.currentWildcard = null;
  document.getElementById('wildcard-row').style.display = 'none';

  // Play charge-up SFX
  if (window.SFX) {
    window.SFX.playReactorCharge();
    window.SFX.playSteamExhaust();
  }

  // Update UI indicators
  const indicator = document.getElementById('reactor-indicator');
  const tempEl = document.getElementById('reactor-temp');
  indicator.className = 'reactor-light charging';
  tempEl.textContent = '120°C';

  // Disable button
  const spinBtn = document.getElementById('btn-spin');
  spinBtn.disabled = true;
  spinBtn.textContent = 'DANG ĐÚC Ý TƯỞNG...';

  // Generate target concept
  // Extract locked values
  const locksConfig = {};
  const keys = ['genre', 'theme', 'mechanic', 'constraint', 'style'];
  keys.forEach(k => {
    locksConfig[k] = AppState.mixer.locks[k];
    if (locksConfig[k]) {
      // Find what is currently inside that slot
      const curItem = document.querySelector(`#strip-${k} .slot-item`);
      locksConfig[k + 'Val'] = curItem ? curItem.textContent : '';
    }
  });

  const finalConcept = Generator.generateConcept(locksConfig);
  AppState.mixer.currentConcept = finalConcept;

  // Spin slots animation
  let animationFinished = 0;

  keys.forEach((key, colIndex) => {
    const strip = document.getElementById(`strip-${key}`);
    
    if (AppState.mixer.locks[key]) {
      animationFinished++;
      return; // Skip animation for locked columns
    }

    // Build temporary list of elements for rolling simulation
    const databaseMap = {
      genre: GENRES,
      theme: THEMES,
      mechanic: MECHANICS,
      constraint: CONSTRAINTS,
      style: STYLES
    };
    const dataset = databaseMap[key];
    
    // Choose 12 random intermediate words, ending with final target
    const rollWords = [];
    for (let i = 0; i < 11; i++) {
      rollWords.push(Generator.getRandomItem(dataset));
    }
    rollWords.push(finalConcept[key]); // Final target is the last one

    // Inject into HTML strip
    strip.innerHTML = '';
    rollWords.forEach(word => {
      const div = document.createElement('div');
      div.className = 'slot-item';
      div.textContent = word;
      strip.appendChild(div);
    });

    // Reset strip transform position (instantly jump to top)
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0px)';

    // Trigger reflow
    strip.offsetHeight;

    // Apply animation translation (move up to show target item at index 11)
    const targetTranslateY = -120 * 11; // 120px height per slot item
    const duration = 1500 + colIndex * 250; // Staggered stop times
    
    strip.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.8, 0.2, 1)`;
    strip.style.transform = `translateY(${targetTranslateY}px)`;

    // Play ticking sound while rolling
    let ticks = 0;
    const maxTicks = 12;
    const tickInterval = setInterval(() => {
      if (ticks >= maxTicks) {
        clearInterval(tickInterval);
      } else {
        if (window.SFX) window.SFX.playTick();
        ticks++;
      }
    }, duration / maxTicks);

    // Stop event
    setTimeout(() => {
      // Finalize item in DOM (set strip to just target node for stability)
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0px)';
      strip.innerHTML = `<div class="slot-item">${finalConcept[key]}</div>`;
      
      animationFinished++;
      if (animationFinished === 5) {
        onReactorFinishedSpinning();
      }
    }, duration + 50);
  });
}

function onReactorFinishedSpinning() {
  AppState.mixer.isSpinning = false;
  
  // Update indicators
  const indicator = document.getElementById('reactor-indicator');
  const tempEl = document.getElementById('reactor-temp');
  indicator.className = 'reactor-light';
  tempEl.textContent = '48°C';

  // Enable button
  const spinBtn = document.getElementById('btn-spin');
  spinBtn.disabled = false;
  spinBtn.textContent = 'KÍCH HOẠT LÒ PHẢN ỨNG';

  // Play success sound
  if (window.SFX) {
    window.SFX.playSuccessChime();
    window.SFX.playSteamExhaust();
  }

  // Update Right side card preview fields
  const concept = AppState.mixer.currentConcept;
  document.getElementById('comp-genre').textContent = concept.genre;
  document.getElementById('comp-theme').textContent = concept.theme;
  document.getElementById('comp-mechanic').textContent = concept.mechanic;
  document.getElementById('comp-constraint').textContent = concept.constraint;
  document.getElementById('comp-style').textContent = concept.style;

  // Set card preview active glow
  const cardResult = document.getElementById('idea-card-result');
  cardResult.classList.add('active-glow');
  setTimeout(() => cardResult.classList.remove('active-glow'), 1000);

  // Auto suggest title
  const suggestedTitle = Generator.suggestTitle(concept);
  document.getElementById('forge-title').value = suggestedTitle;
  document.getElementById('preview-title').textContent = suggestedTitle;

  // Bind title update
  document.getElementById('forge-title').addEventListener('input', (e) => {
    document.getElementById('preview-title').textContent = e.target.value || 'Tên Game Chưa Đặt';
  });

  // Enable inputs & reset rating
  document.getElementById('forge-notes').value = '';
  setMixerRating(3);
}

function saveForgedIdea() {
  if (AppState.mixer.isSpinning) return;
  if (!AppState.mixer.currentConcept) {
    alert("Hãy kích hoạt quay lò phản ứng trước khi lưu!");
    return;
  }

  const title = document.getElementById('forge-title').value.trim();
  const notes = document.getElementById('forge-notes').value.trim();
  const tag = document.getElementById('forge-tag').value;
  const rating = AppState.mixer.rating;

  if (title === '') {
    alert("Vui lòng đặt tên cho dự án game của bạn!");
    return;
  }

  // Construct complete data packet
  const ideaData = {
    title: title,
    genre: AppState.mixer.currentConcept.genre,
    theme: AppState.mixer.currentConcept.theme,
    mechanic: AppState.mixer.currentConcept.mechanic,
    constraint: AppState.mixer.currentConcept.constraint,
    style: AppState.mixer.currentConcept.style,
    wildcard: AppState.mixer.currentWildcard,
    notes: notes,
    tag: tag,
    rating: rating
  };

  // Save to Local Storage
  IdeaBoard.add(ideaData);
  
  if (window.SFX) window.SFX.playSuccessChime();

  // Reset Mixer
  document.getElementById('comp-genre').textContent = '-';
  document.getElementById('comp-theme').textContent = '-';
  document.getElementById('comp-mechanic').textContent = '-';
  document.getElementById('comp-constraint').textContent = '-';
  document.getElementById('comp-style').textContent = '-';
  document.getElementById('wildcard-row').style.display = 'none';
  document.getElementById('forge-title').value = '';
  document.getElementById('forge-notes').value = '';
  AppState.mixer.currentConcept = null;
  AppState.mixer.currentWildcard = null;

  // Transit to Board page to view result
  switchScreen('screen-board');
}


/* ==========================================
   3. MINDMAP MARATHON COMPONENT LOGIC
   ========================================== */
function setupMarathonEventListeners() {
  // Preset Root word randomizer
  document.getElementById('btn-random-root').addEventListener('click', () => {
    const word = Generator.getRandomRootWord();
    document.getElementById('marathon-root-keyword').value = word;
    if (window.SFX) window.SFX.playClick();
  });

  // Time preset buttons
  document.querySelectorAll('.time-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.time-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.marathon.duration = parseInt(btn.getAttribute('data-time'));
      if (window.SFX) window.SFX.playClick();
    });
  });

  // Start Marathon
  document.getElementById('btn-start-marathon').addEventListener('click', startMarathonGame);

  // Recenter Mindmap Canvas
  document.getElementById('btn-recenter-canvas').addEventListener('click', () => {
    if (AppState.marathon.graph) {
      AppState.marathon.graph.recenter();
      if (window.SFX) window.SFX.playClick();
    }
  });

  // Input form submission
  document.getElementById('marathon-input-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitMarathonWord();
  });

  // Abort game
  document.getElementById('btn-abort-marathon').addEventListener('click', () => {
    if (confirm("Bạn có chắc chắn muốn bỏ dở trận đấu này không? Điểm số hiện tại sẽ bị hủy.")) {
      abortMarathon();
    }
  });

  // Retry (on result page)
  document.getElementById('btn-marathon-retry').addEventListener('click', () => {
    document.getElementById('marathon-result-panel').style.display = 'none';
    document.getElementById('marathon-setup-panel').style.display = 'block';
    if (window.SFX) window.SFX.playClick();
  });

  // Save Core (on result page)
  document.getElementById('btn-save-marathon-idea').addEventListener('click', saveMarathonCoreToBoard);
}

function startMarathonGame() {
  const rootInput = document.getElementById('marathon-root-keyword').value.trim();
  if (rootInput === '') {
    alert("Vui lòng nhập từ khóa chủ đề!");
    return;
  }

  // Get difficulty
  const diffEl = document.querySelector('input[name="marathon-diff"]:checked');
  AppState.marathon.difficulty = diffEl ? diffEl.value : 'easy';
  AppState.marathon.rootWord = rootInput;

  // Reset stats
  AppState.marathon.isPlaying = true;
  AppState.marathon.timeLeft = AppState.marathon.duration;
  AppState.marathon.score = 0;
  AppState.marathon.wordCount = 0;
  AppState.marathon.combo = 1;
  AppState.marathon.maxCombo = 1;
  AppState.marathon.comboProgress = 100;
  AppState.marathon.enteredWords.clear();
  AppState.marathon.lastWord = rootInput.toLowerCase();
  AppState.marathon.enteredWords.add(AppState.marathon.lastWord);

  // Update HUD values
  updateMarathonHUD();

  // Show/Hide Panels
  document.getElementById('marathon-setup-panel').style.display = 'none';
  document.getElementById('marathon-game-panel').style.display = 'grid';
  
  // Set theme name in UI
  document.getElementById('current-marathon-theme').textContent = rootInput.toUpperCase();

  // Set rule hint text based on difficulty
  const hintEl = document.getElementById('marathon-rule-hint');
  if (AppState.marathon.difficulty === 'hard') {
    const lastChar = AppState.marathon.lastWord.slice(-1).toUpperCase();
    hintEl.textContent = `Chế độ KHÓ! Hãy gõ một từ liên quan đến chủ đề và phải bắt đầu bằng chữ cái: "${lastChar}"`;
  } else {
    hintEl.textContent = "Hãy gõ bất kỳ cơ chế, tính năng hoặc ý tưởng nào liên quan tới chủ đề gốc.";
  }

  // Reset entries logs
  const logEl = document.getElementById('marathon-entries-log');
  logEl.innerHTML = `<li class="system-entry">Vòng đấu bắt đầu! Hãy gõ từ đầu tiên...</li>`;

  // Focus input
  const inputEl = document.getElementById('marathon-input-field');
  inputEl.value = '';
  inputEl.focus();

  // Start Canvas Mindmap Graph
  AppState.marathon.graph = new MindmapGraph('mindmap-canvas');
  AppState.marathon.graph.setRoot(rootInput, '#ff007f'); // Root is magenta
  AppState.marathon.graph.startLoop();

  // Play Audio charge
  if (window.SFX) {
    window.SFX.playReactorCharge();
    window.SFX.playSteamExhaust();
  }

  // Start Interval timers
  startMarathonTimers();
}

function startMarathonTimers() {
  // 1. Time ticking countdown
  AppState.marathon.timerInterval = setInterval(() => {
    AppState.marathon.timeLeft--;
    
    // Update Clock HUD
    const mins = Math.floor(AppState.marathon.timeLeft / 60);
    const secs = AppState.marathon.timeLeft % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('marathon-timer').textContent = timeStr;

    // Warning chime on last 10 seconds
    if (AppState.marathon.timeLeft <= 10 && AppState.marathon.timeLeft > 0) {
      if (window.SFX) window.SFX.playTimerWarning();
    }

    if (AppState.marathon.timeLeft <= 0) {
      endMarathonGame();
    }
  }, 1000);

  // 2. Combo decay timer (updates every 50ms)
  const decayTimeLimit = 5000; // 5 seconds
  let timeElapsedSinceLastInput = 0;
  
  AppState.marathon.comboInterval = setInterval(() => {
    timeElapsedSinceLastInput += 50;
    
    // Decrease combo progress bar width
    AppState.marathon.comboProgress = Math.max(0, 100 - (timeElapsedSinceLastInput / decayTimeLimit) * 100);
    document.getElementById('marathon-combo-bar').style.width = `${AppState.marathon.comboProgress}%`;

    if (timeElapsedSinceLastInput >= decayTimeLimit) {
      // Reset combo
      if (AppState.marathon.combo > 1) {
        AppState.marathon.combo = 1;
        document.getElementById('marathon-combo').textContent = 'x1';
        if (window.SFX) window.SFX.playComboBreak();
        
        const logEl = document.getElementById('marathon-entries-log');
        logEl.insertAdjacentHTML('afterbegin', `<li class="system-entry" style="color: var(--color-red);">Mất chuỗi Combo! Gõ nhanh để bắt đầu lại.</li>`);
      }
      timeElapsedSinceLastInput = 0;
    }
  }, 50);

  // Helper reset callback when word is submitted
  AppState.marathon.resetDecayClock = () => {
    timeElapsedSinceLastInput = 0;
    AppState.marathon.comboProgress = 100;
  };
}

function updateMarathonHUD() {
  document.getElementById('marathon-score').textContent = AppState.marathon.score.toString().padStart(4, '0');
  document.getElementById('marathon-count').textContent = AppState.marathon.wordCount;
  document.getElementById('marathon-combo').textContent = `x${AppState.marathon.combo}`;
  
  // Set high score on dashboard if this exceeds it
  const currentHighScore = parseInt(localStorage.getItem('ideaforge_marathon_highscore')) || 0;
  if (AppState.marathon.score > currentHighScore) {
    localStorage.setItem('ideaforge_marathon_highscore', AppState.marathon.score);
  }
}

function submitMarathonWord() {
  const inputEl = document.getElementById('marathon-input-field');
  const word = inputEl.value.trim();
  if (word === '') return;

  const wLower = word.toLowerCase();

  // Validate duplicated words
  if (AppState.marathon.enteredWords.has(wLower)) {
    alert("Từ khóa này đã được gõ trước đó rồi!");
    inputEl.focus();
    return;
  }

  // Validate Hard difficulty rules
  if (AppState.marathon.difficulty === 'hard') {
    const requiredChar = AppState.marathon.lastWord.slice(-1).toLowerCase();
    const firstChar = wLower.charAt(0);
    
    if (firstChar !== requiredChar) {
      alert(`Từ khóa không hợp lệ! Từ phải bắt đầu bằng ký tự: "${requiredChar.toUpperCase()}"`);
      inputEl.focus();
      return;
    }
  }

  // Add word to active registries
  AppState.marathon.enteredWords.add(wLower);
  AppState.marathon.wordCount++;

  // Calculate scores
  const baseScore = Math.max(10, word.length * 5);
  const addScore = baseScore * AppState.marathon.combo;
  AppState.marathon.score += addScore;

  // Increment combos
  if (AppState.marathon.combo < 10) {
    AppState.marathon.combo++;
  }
  if (AppState.marathon.combo > AppState.marathon.maxCombo) {
    AppState.marathon.maxCombo = AppState.marathon.combo;
  }

  // Reset combo decay clock
  if (AppState.marathon.resetDecayClock) {
    AppState.marathon.resetDecayClock();
  }

  // Update UI HUD
  updateMarathonHUD();

  // Inject to Canvas 2D Mindmap
  // Random color based on length/combo
  const neonColors = ['#00f0ff', '#ff007f', '#8b5cf6', '#f59e0b', '#10b981'];
  const nodeColor = Generator.getRandomItem(neonColors);
  
  // Connect to last word node if hard mode, otherwise connect to root
  const parentId = AppState.marathon.difficulty === 'hard' ? AppState.marathon.lastNodeId : 'root';
  const newNode = AppState.marathon.graph.addNode(word, parentId, nodeColor);
  
  AppState.marathon.lastNodeId = newNode.id;
  AppState.marathon.lastWord = wLower; // Save for next letter validation

  // Insert entry log row
  const logEl = document.getElementById('marathon-entries-log');
  
  // Remove starting placeholder
  const systemPlaceholder = logEl.querySelector('.system-entry');
  if (systemPlaceholder && AppState.marathon.wordCount === 1) {
    systemPlaceholder.remove();
  }

  const logRow = `
    <li>
      <span class="entry-word">${word}</span>
      <span class="entry-score">+${addScore} (Combo x${AppState.marathon.combo - 1})</span>
    </li>
  `;
  logEl.insertAdjacentHTML('afterbegin', logRow);

  // Play audio triggers
  if (window.SFX) {
    if (AppState.marathon.combo > 5) {
      window.SFX.playComboSuccess();
    } else {
      window.SFX.playClick();
    }
  }

  // Set rule hint for Hard difficulty
  const hintEl = document.getElementById('marathon-rule-hint');
  if (AppState.marathon.difficulty === 'hard') {
    const nextChar = wLower.slice(-1).toUpperCase();
    hintEl.textContent = `Chế độ KHÓ! Hãy gõ một từ mới bắt đầu bằng chữ cái: "${nextChar}"`;
  }

  // Clear input
  inputEl.value = '';
  inputEl.focus();
}

function abortMarathon() {
  clearMarathonIntervals();
  AppState.marathon.isPlaying = false;
  
  if (AppState.marathon.graph) {
    AppState.marathon.graph.stopLoop();
    AppState.marathon.graph = null;
  }

  // Back to setup panel
  document.getElementById('marathon-game-panel').style.display = 'none';
  document.getElementById('marathon-setup-panel').style.display = 'block';
}

function clearMarathonIntervals() {
  if (AppState.marathon.timerInterval) {
    clearInterval(AppState.marathon.timerInterval);
    AppState.marathon.timerInterval = null;
  }
  if (AppState.marathon.comboInterval) {
    clearInterval(AppState.marathon.comboInterval);
    AppState.marathon.comboInterval = null;
  }
}

function endMarathonGame() {
  clearMarathonIntervals();
  AppState.marathon.isPlaying = false;
  
  // Stop physics engine loop
  if (AppState.marathon.graph) {
    AppState.marathon.graph.stopLoop();
  }

  // Play Fanfare
  if (window.SFX) window.SFX.playGameOverFanfare();

  // Transit panels
  document.getElementById('marathon-game-panel').style.display = 'none';
  document.getElementById('marathon-result-panel').style.display = 'flex';

  // Calculate Rank Title
  const finalScore = AppState.marathon.score;
  let rank = 'CREATIVE SPARK';
  let rankColor = '#8fa0dd';
  
  if (finalScore >= 100 && finalScore < 350) {
    rank = 'CONCEPT ARCHITECT';
    rankColor = '#10b981';
  } else if (finalScore >= 350 && finalScore < 800) {
    rank = 'MIND STORMER';
    rankColor = '#00f0ff';
  } else if (finalScore >= 800 && finalScore < 1500) {
    rank = 'GALAXY BRAIN';
    rankColor = '#ff007f';
  } else if (finalScore >= 1500) {
    rank = 'GOD OF CREATION';
    rankColor = '#f59e0b';
  }

  const rankEl = document.getElementById('result-rank-title');
  rankEl.textContent = rank;
  rankEl.style.color = rankColor;

  // Set scores stats
  document.getElementById('res-score').textContent = finalScore;
  document.getElementById('res-ideas-count').textContent = AppState.marathon.wordCount;
  document.getElementById('res-max-combo').textContent = `x${AppState.marathon.maxCombo}`;

  // Populate words cloud
  const cloud = document.getElementById('res-words-cloud');
  cloud.innerHTML = '';
  
  AppState.marathon.enteredWords.forEach(w => {
    // Exclude root
    if (w === AppState.marathon.rootWord.toLowerCase()) return;
    
    const span = document.createElement('span');
    span.className = 'result-tag';
    span.textContent = w.toUpperCase();
    cloud.appendChild(span);
  });
}

function saveMarathonCoreToBoard() {
  if (AppState.marathon.wordCount === 0) {
    alert("Bạn chưa nhập từ nào, không thể lưu cốt lõi!");
    return;
  }

  // Compose idea notes based on entered concepts
  const root = AppState.marathon.rootWord;
  const wordList = Array.from(AppState.marathon.enteredWords)
    .map(w => w.toUpperCase())
    .filter(w => w !== root.toUpperCase());
    
  const title = `Project ${root}`;
  const notes = `Dự án game Jam được ấp ủ từ chế độ Marathon đấu trí với chủ đề cốt lõi là "${root}".\n\nHệ sinh thái ý tưởng thiết kế bao gồm:\n- ${wordList.join('\n- ')}\n\nHướng phát triển đề xuất: Xây dựng một gameplay xung quanh cốt lõi "${root}" kết hợp với các cơ chế vệ tinh trên.`;

  const ideaData = {
    title: title,
    genre: 'Chưa phân loại',
    theme: root,
    mechanic: wordList.slice(0, 3).join(', ') || 'Nhiều cơ chế liên kết',
    constraint: AppState.marathon.difficulty === 'hard' ? 'Ghép chữ liên tục (Word association)' : 'Không giới hạn',
    style: 'Sơ đồ Mindmap 2D',
    wildcard: null,
    notes: notes,
    tag: 'Game Jam',
    rating: Math.min(5, Math.ceil(AppState.marathon.score / 250) + 1)
  };

  IdeaBoard.add(ideaData);
  
  if (window.SFX) window.SFX.playSuccessChime();
  
  alert("Cốt lõi Marathon đã được lưu vào Xưởng ý tưởng thành công!");
  
  // Transit to Board screen
  document.getElementById('marathon-result-panel').style.display = 'none';
  document.getElementById('marathon-setup-panel').style.display = 'block';
  switchScreen('screen-board');
}


/* ==========================================
   4. IDEA BOARD (WORKSHOP) LOGIC
   ========================================== */
function setupBoardEventListeners() {
  // Search Bar Keyup filter
  const searchEl = document.getElementById('board-search');
  searchEl.addEventListener('input', triggerBoardRefresh);

  // Sorting selection trigger
  const sortEl = document.getElementById('board-sort-by');
  sortEl.addEventListener('change', triggerBoardRefresh);

  // Tag filter buttons click
  document.querySelectorAll('#board-filter-tags .tag-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#board-filter-tags .tag-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      triggerBoardRefresh();
      if (window.SFX) window.SFX.playClick();
    });
  });

  // Export buttons
  document.getElementById('btn-export-json').addEventListener('click', () => IdeaBoard.exportJSON());
  document.getElementById('btn-export-markdown').addEventListener('click', () => IdeaBoard.exportMarkdown());

  // Modal open
  document.getElementById('btn-create-manual-idea').addEventListener('click', openManualModal);
  
  // Modal buttons close / cancel
  document.getElementById('btn-close-modal').addEventListener('click', closeManualModal);
  document.getElementById('btn-cancel-modal').addEventListener('click', closeManualModal);

  // Modal save manual idea
  document.getElementById('btn-save-manual').addEventListener('click', saveManualIdea);
}

function triggerBoardRefresh() {
  const currentTag = document.querySelector('.tag-filter-btn.active').getAttribute('data-tag');
  const searchVal = document.getElementById('board-search').value;
  const sortVal = document.getElementById('board-sort-by').value;
  
  IdeaBoard.render('ideas-grid', currentTag, searchVal, sortVal);
}

// Modal functions
function openManualModal() {
  document.getElementById('manual-idea-modal').classList.add('active');
  
  // Clear fields
  document.getElementById('manual-title').value = '';
  document.getElementById('manual-genre').value = '';
  document.getElementById('manual-theme').value = '';
  document.getElementById('manual-mechanics').value = '';
  document.getElementById('manual-style').value = '';
  document.getElementById('manual-notes').value = '';
  document.getElementById('manual-tag').value = 'Game Jam';
  document.getElementById('manual-rating').value = 3;

  if (window.SFX) window.SFX.playClick();
}

function closeManualModal() {
  document.getElementById('manual-idea-modal').classList.remove('active');
  if (window.SFX) window.SFX.playClick();
}

function saveManualIdea() {
  const title = document.getElementById('manual-title').value.trim();
  if (title === '') {
    alert("Vui lòng nhập tên ý tưởng game!");
    return;
  }

  const manualData = {
    title: title,
    genre: document.getElementById('manual-genre').value.trim() || '-',
    theme: document.getElementById('manual-theme').value.trim() || '-',
    mechanic: document.getElementById('manual-mechanics').value.trim() || '-',
    constraint: '-',
    style: document.getElementById('manual-style').value.trim() || '-',
    notes: document.getElementById('manual-notes').value.trim(),
    tag: document.getElementById('manual-tag').value,
    rating: parseInt(document.getElementById('manual-rating').value) || 3
  };

  IdeaBoard.add(manualData);
  closeManualModal();
  
  if (window.SFX) window.SFX.playSuccessChime();

  // Refresh board
  triggerBoardRefresh();
}
