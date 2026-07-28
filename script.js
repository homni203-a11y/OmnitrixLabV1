/**
 * script.js - Core Omnitrix System
 * Senior Full-stack Architecture: State Management, Clean DOM Manipulation, Micro-interactions & Audio Engine.
 */

/* ==========================================================================
   1. MÔ PHỎNG DỮ LIỆU GEN ALIEN & FUSION ALGORITHM
   ========================================================================== */
const ALIENS_DATA = [
  { id: 1, name: "Heatblast", species: "Pyronite", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", stats: { power: 8, speed: 6, durability: 7, intelligence: 6, energy: 9 } },
  { id: 2, name: "Four Arms", species: "Tetramand", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png", stats: { power: 10, speed: 5, durability: 9, intelligence: 4, energy: 5 } },
  { id: 3, name: "XLR8", species: "Kineceleran", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", stats: { power: 5, speed: 10, durability: 5, intelligence: 7, energy: 6 } },
  { id: 4, name: "Diamondhead", species: "Petrosapien", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png", stats: { power: 8, speed: 5, durability: 10, intelligence: 6, energy: 7 } },
  { id: 5, name: "Upgrade", species: "Galvanic Mechamorph", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png", stats: { power: 6, speed: 7, durability: 7, intelligence: 9, energy: 9 } },
  { id: 6, name: "Ghostfreak", species: "Ectonurite", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png", stats: { power: 6, speed: 7, durability: 6, intelligence: 8, energy: 8 } }
];

/* ==========================================================================
   2. HỆ THỐNG ÂM THANH SCI-FI (WEB AUDIO API)
   ========================================================================== */
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSciFiBeep() {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(580, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    console.warn("Audio Context Error:", e);
  }
}

function playDiceRollSound() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300 + Math.random() * 500, now + i * 0.05);
      gain.gain.setValueAtTime(0.08, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.04);
    }
  } catch (e) {
    console.warn("Dice Sound Error:", e);
  }
}

/* ==========================================================================
   3. STATE MANAGEMENT
   ========================================================================== */
const state = {
  activeTab: 'biomnitrix', // 'biomnitrix' | 'ultimatrix' | 'chaquetrix'
  slotCount: 2,           // 2-5 (Chỉ áp dụng cho Biomnitrix)
  selectedAliens: [null, null],
  activeModalSlotIndex: null,
  bodyProportions: 50,     // Dành riêng cho Chaquetrix
  mobileActiveView: 'control' // 'control' (Cột trái) | 'result' (Cột phải)
};

// Cấu hình Header theo Tab
const HEADER_CONFIG = {
  biomnitrix: {
    title: 'BIOMNITRIX',
    subtitle: 'USER_ID // Ben Tennyson',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 17 22 12"></polyline></svg>`,
    processText: 'DUNG HỢP ADN',
    processIcon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 17 22 12"></polyline></svg>`
  },
  ultimatrix: {
    title: 'ULTIMATRIX',
    subtitle: 'USER_ID // Albedo',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    processText: 'KHỞI ĐỘNG TIẾN HÓA',
    processIcon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`
  },
  chaquetrix: {
    title: 'CHAQUETRIX',
    subtitle: 'USER_ID // Haremic',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    processText: 'TIẾN HÀNH TRIỆU HỒI HAREM',
    processIcon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  }
};

/* ==========================================================================
   4. DOM ELEMENTS
   ========================================================================== */
const brandIconWrap = document.getElementById('brandIconWrap');
const brandTitle = document.getElementById('brandTitle');
const brandSubtitle = document.getElementById('brandSubtitle');
const btnCycleCore = document.getElementById('btnCycleCore');

const tabs = document.querySelectorAll('.tab');
const slotStepper = document.getElementById('slotStepper');
const slotCountDisplay = document.getElementById('slotCountDisplay');
const btnSlotMinus = document.getElementById('btnSlotMinus');
const btnSlotPlus = document.getElementById('btnSlotPlus');
const btnDice = document.getElementById('btnDice');
const dnaGrid = document.getElementById('dnaGrid');
const subpanelContainer = document.getElementById('subpanelContainer');

const btnProcess = document.getElementById('btnProcess');
const btnProcessIcon = document.getElementById('btnProcessIcon');
const btnProcessText = document.getElementById('btnProcessText');

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalGrid = document.getElementById('modalGrid');
const btnModalClose = document.getElementById('btnModalClose');

const fusionResult = document.getElementById('fusionResult');
const toast = document.getElementById('toast');

const leftSidebar = document.getElementById('leftSidebar');
const rightPanel = document.getElementById('rightPanel');
const navBtnControl = document.getElementById('navBtnControl');
const navBtnResult = document.getElementById('navBtnResult');
const btnArena = document.getElementById('btnArena');
const btnCollection = document.getElementById('btnCollection');

let toastTimer = null;

/* ==========================================================================
   5. RENDER & UI LOGIC
   ========================================================================== */
function showToast(msg, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.toggle('toast--error', isError);
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}

// MODULE 2: Cập nhật Header & Theme Engine
function updateHeaderAndTheme(tabKey) {
  const config = HEADER_CONFIG[tabKey];
  if (!config) return;

  // Cập nhật DOM Header Góc Trái
  brandIconWrap.innerHTML = config.icon;
  brandTitle.textContent = config.title;
  brandSubtitle.textContent = config.subtitle;

  // Cập nhật Theme Body
  document.body.className = `theme-${tabKey}`;

  // Đồng bộ Active trạng thái Tab trên Cột Trái
  tabs.forEach(t => {
    const active = t.dataset.tab === tabKey;
    t.classList.toggle('tab-active', active);
  });

  // Cập nhật Nút Action dưới cùng
  btnProcessText.textContent = config.processText;
  btnProcess.querySelector('svg').outerHTML = config.processIcon;

  // Cập nhật Radar Center Icon
  const radarIcon = document.getElementById('radarCoreIcon');
  if (radarIcon) radarIcon.innerHTML = config.icon;
}

// SWITCH TAB CORE LOGIC
function switchTab(tabKey) {
  state.activeTab = tabKey;
  updateHeaderAndTheme(tabKey);

  if (tabKey === 'ultimatrix' || tabKey === 'chaquetrix') {
    // Khóa cứng ở 1 ô ADN
    state.slotCount = 1;
    state.selectedAliens = [state.selectedAliens[0] || null];
    slotStepper.style.display = 'none';
  } else {
    // Biomnitrix: Mở lại Stepper
    slotStepper.style.display = 'flex';
    if (state.selectedAliens.length < 2) {
      state.slotCount = 2;
      state.selectedAliens = [state.selectedAliens[0] || null, null];
    }
  }

  renderDNAGrid();
  renderSubPanels();
}

// RENDER ADN SLOTS
function renderDNAGrid() {
  dnaGrid.innerHTML = '';
  for (let i = 0; i < state.slotCount; i++) {
    const alien = state.selectedAliens[i];
    const slotEl = document.createElement('div');
    slotEl.className = `dna-slot ${alien ? 'dna-slot--filled' : ''}`;
    slotEl.dataset.index = i;

    if (alien) {
      slotEl.innerHTML = `
        <div class="slot-filled-header">
          <span class="slot-alien-name">${alien.name}</span>
          <button type="button" class="slot-remove-btn" data-index="${i}">&times;</button>
        </div>
        <div class="slot-alien-image-wrap">
          <img class="slot-alien-image" src="${alien.image}" alt="${alien.name}" />
        </div>
      `;
    } else {
      slotEl.innerHTML = `
        <span class="slot-label">ADN ${i + 1}</span>
        <div class="slot-empty-center">
          <span class="slot-empty-arrow">↑</span>
          <span class="slot-empty-text">NẠP MÃ GEN</span>
        </div>
      `;
    }
    dnaGrid.appendChild(slotEl);
  }

  slotCountDisplay.textContent = state.slotCount;
  btnSlotMinus.disabled = state.slotCount <= 2;
  btnSlotPlus.disabled = state.slotCount >= 5;
}

// MODULE 4: RENDER MENU PHỤ DÀNH RIÊNG CHO TỪNG TAB
function renderSubPanels() {
  subpanelContainer.innerHTML = '';

  if (state.activeTab === 'ultimatrix') {
    subpanelContainer.innerHTML = `
      <div class="subpanel-card">
        <div class="subpanel-card-title">✦ THÔNG SỐ TIẾN HÓA ULTIMATE</div>
        <div class="subpanel-grid">
          <div class="subpanel-item">
            <span class="subpanel-item-icon">⚡</span>
            <span class="subpanel-item-label">Năng Lượng</span>
            <span class="subpanel-item-val">100%</span>
          </div>
          <div class="subpanel-item">
            <span class="subpanel-item-icon">🧬</span>
            <span class="subpanel-item-label">Tuyến Gen</span>
            <span class="subpanel-item-val">SUPREME</span>
          </div>
          <div class="subpanel-item">
            <span class="subpanel-item-icon">💥</span>
            <span class="subpanel-item-label">Xung Lực</span>
            <span class="subpanel-item-val">x3.5</span>
          </div>
        </div>
      </div>
    `;
  } else if (state.activeTab === 'chaquetrix') {
    subpanelContainer.innerHTML = `
      <div class="subpanel-card">
        <div class="subpanel-card-title">✦ TÙY CHỈNH TRIỆU HỒI HAREM</div>
        <div class="range-group">
          <div class="range-header">
            <span>Tỉ Lệ Cơ Thể (Body Proportions)</span>
            <strong id="proportionVal">${state.bodyProportions}%</strong>
          </div>
          <input type="range" class="range-slider" id="proportionSlider" min="0" max="100" value="${state.bodyProportions}">
        </div>
      </div>
    `;

    const slider = document.getElementById('proportionSlider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        state.bodyProportions = e.target.value;
        document.getElementById('proportionVal').textContent = `${state.bodyProportions}%`;
      });
    }
  }
}

/* ==========================================================================
   6. EVENT HANDLERS & INTERACTIONS
   ========================================================================== */

// MODULE 2: Nút "ĐỔI LÕI VŨ TRỤ" (Vòng lặp Cycle Loop)
btnCycleCore.addEventListener('click', () => {
  const sequence = ['biomnitrix', 'ultimatrix', 'chaquetrix'];
  const currentIndex = sequence.indexOf(state.activeTab);
  const nextTab = sequence[(currentIndex + 1) % sequence.length];
  switchTab(nextTab);
  showToast(`Đã chuyển sang Lõi ${HEADER_CONFIG[nextTab].title}`);
});

// Chuyển Tab khi Click trực tiếp
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchTab(tab.dataset.tab);
  });
});

// Tăng / Giảm ô ADN (Biomnitrix)
btnSlotPlus.addEventListener('click', () => {
  if (state.slotCount < 5) {
    state.slotCount++;
    state.selectedAliens.push(null);
    renderDNAGrid();
  }
});

btnSlotMinus.addEventListener('click', () => {
  if (state.slotCount > 2) {
    state.slotCount--;
    state.selectedAliens.pop();
    renderDNAGrid();
  }
});

// MODULE 3: Nút Xúc Xắc (Randomizer) + Rung Lắc + Audio
btnDice.addEventListener('click', () => {
  playDiceRollSound();

  // Animation rung lắc khung nút
  btnDice.classList.remove('btn-dice-shake');
  void btnDice.offsetWidth; // Force Reflow
  btnDice.classList.add('btn-dice-shake');

  // Logic Chọn Ngẫu Nhiên không trùng lặp
  const shuffled = [...ALIENS_DATA].sort(() => 0.5 - Math.random());
  for (let i = 0; i < state.slotCount; i++) {
    state.selectedAliens[i] = shuffled[i] || null;
  }
  renderDNAGrid();
  showToast("Đã ngẫu nhiên hóa chuỗi gen ADN!");
});

// Click vào ô ADN để Mở Modal Nạp Gen hoặc Xóa
dnaGrid.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.slot-remove-btn');
  if (removeBtn) {
    e.stopPropagation();
    const idx = Number(removeBtn.dataset.index);
    state.selectedAliens[idx] = null;
    renderDNAGrid();
    return;
  }

  const slot = e.target.closest('.dna-slot');
  if (slot) {
    const idx = Number(slot.dataset.index);
    openModal(idx);
  }
});

// MODAL SYSTEM
function openModal(slotIndex = null) {
  state.activeModalSlotIndex = slotIndex;
  modalTitle.textContent = slotIndex !== null ? `NẠP MÃ GEN — ADN ${slotIndex + 1}` : "BỘ SƯU TẬP ALIEN";

  const takenIds = new Set(state.selectedAliens.filter(Boolean).map(a => a.id));

  modalGrid.innerHTML = ALIENS_DATA.map(alien => {
    const isTaken = slotIndex !== null && takenIds.has(alien.id);
    return `
      <div class="modal-item ${isTaken ? 'modal-item--disabled' : ''}" data-id="${alien.id}">
        <img src="${alien.image}" alt="${alien.name}" />
        <span>${alien.name}</span>
        <small>${alien.species}</small>
      </div>
    `;
  }).join('');

  modalOverlay.hidden = false;
}

modalGrid.addEventListener('click', (e) => {
  const item = e.target.closest('.modal-item');
  if (!item || item.classList.contains('modal-item--disabled')) return;

  const id = Number(item.dataset.id);
  const alien = ALIENS_DATA.find(a => a.id === id);

  if (state.activeModalSlotIndex !== null) {
    state.selectedAliens[state.activeModalSlotIndex] = alien;
    renderDNAGrid();
    modalOverlay.hidden = true;
    showToast(`Đã nạp gen ${alien.name}!`);
  } else {
    showToast(`${alien.name} — Sức mạnh: ${alien.stats.power} | Tốc độ: ${alien.stats.speed}`);
  }
});

btnModalClose.addEventListener('click', () => modalOverlay.hidden = true);
btnCollection.addEventListener('click', () => openModal(null));

// PROCESS ACTION BUTTON (Dung Hợp / Tiến Hóa / Triệu Hồi)
btnProcess.addEventListener('click', () => {
  const selected = state.selectedAliens.filter(Boolean);

  if (state.activeTab === 'biomnitrix') {
    if (selected.length < 2) {
      showToast("Cần tối thiểu 2 mã gen để dung hợp Biomnitrix!", true);
      return;
    }
    const fusedName = selected.map(a => a.name.slice(0, Math.ceil(a.name.length / 2))).join('');
    fusionResult.innerHTML = `
      <h3>DUNG HỢP THÀNH CÔNG: ${fusedName}</h3>
      <p>Chủng loài dung hợp đa hợp giữa ${selected.map(a => a.name).join(' + ')}.</p>
      <div class="fusion-stats">
        <span class="fusion-stat-chip">SỨC MẠNH: 9.5</span>
        <span class="fusion-stat-chip">TỐC ĐỘ: 8.8</span>
        <span class="fusion-stat-chip">KHÁNG CỰ: 9.0</span>
      </div>
    `;
  } else if (state.activeTab === 'ultimatrix') {
    if (selected.length < 1) {
      showToast("Vui lòng chọn 1 Alien để kích hoạt Tiến Hóa!", true);
      return;
    }
    fusionResult.innerHTML = `
      <h3>ULTIMATE ${selected[0].name.toUpperCase()}</h3>
      <p>Đã hoàn tất mô phỏng môi trường chiến tranh 1 triệu năm.</p>
      <div class="fusion-stats">
        <span class="fusion-stat-chip">TIẾN HÓA CẤP: MAX</span>
        <span class="fusion-stat-chip">SỨC MẠNH x3.5</span>
      </div>
    `;
  } else {
    if (selected.length < 1) {
      showToast("Vui lòng chọn 1 Alien để triệu hồi!", true);
      return;
    }
    fusionResult.innerHTML = `
      <h3>TRIỆU HỒI HAREM: ${selected[0].name}</h3>
      <p>Tỉ lệ cơ thể đã điều chỉnh: ${state.bodyProportions}%. Trạng thái thân thiện: 100%.</p>
    `;
  }

  fusionResult.hidden = false;
  if (window.innerWidth <= 768) {
    switchMobileView('result');
  }
  showToast("Thao tác hoàn tất thành công!");
});

// MODULE 1: MOBILE BOTTOM NAV LOGIC (Đổi Cột Trái / Cột Phải)
function switchMobileView(view) {
  state.mobileActiveView = view;
  if (view === 'control') {
    leftSidebar.classList.add('mobile-visible');
    rightPanel.classList.remove('mobile-visible');
    navBtnControl.classList.add('active');
    navBtnResult.classList.remove('active');
  } else {
    leftSidebar.classList.remove('mobile-visible');
    rightPanel.classList.add('mobile-visible');
    navBtnControl.classList.remove('active');
    navBtnResult.classList.add('active');
  }
}

navBtnControl.addEventListener('click', () => switchMobileView('control'));
navBtnResult.addEventListener('click', () => switchMobileView('result'));

// Sound Beep Toàn Cục
document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.tab') || e.target.closest('.dna-slot')) {
    playSciFiBeep();
  }
});

btnArena.addEventListener('click', () => showToast("Đang kết nối Đấu Trường Villtrum..."));

/* ==========================================================================
   7. INITIALIZATION
   ========================================================================== */
function init() {
  switchTab('biomnitrix');
  if (window.innerWidth <= 768) {
    switchMobileView('control');
  }
}

init();
