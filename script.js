/**
 * script.js - Core Omnitrix System
 * Synchronized with official Ben 10 Alien Assets & Hourglass Core SVG Icons.
 */

/* ==========================================================================
   1. DỮ LIỆU GEN ALIEN BEN 10 (ẢNH CHUẨN BEN 10 SPECIES)
   ========================================================================== */
const ALIENS_DATA = [
  { 
    id: 1, 
    name: "Heatblast", 
    species: "Pyronite", 
    image: "https://vignette.wikia.nocookie.net/ben10/images/2/23/Heatblast_OV_Render.png", 
    stats: { power: 8, speed: 6, durability: 7, intelligence: 6, energy: 9 } 
  },
  { 
    id: 2, 
    name: "Four Arms", 
    species: "Tetramand", 
    image: "https://vignette.wikia.nocookie.net/ben10/images/e/e0/Fourarms_ov_pose.png", 
    stats: { power: 10, speed: 5, durability: 9, intelligence: 4, energy: 5 } 
  },
  { 
    id: 3, 
    name: "XLR8", 
    species: "Kineceleran", 
    image: "https://vignette.wikia.nocookie.net/ben10/images/c/c2/XLR8_OV_Render.png", 
    stats: { power: 5, speed: 10, durability: 5, intelligence: 7, energy: 6 } 
  },
  { 
    id: 4, 
    name: "Diamondhead", 
    species: "Petrosapien", 
    image: "https://vignette.wikia.nocookie.net/ben10/images/3/30/Diamondhead_OV_Pose.png", 
    stats: { power: 8, speed: 5, durability: 10, intelligence: 6, energy: 7 } 
  },
  { 
    id: 5, 
    name: "Upgrade", 
    species: "Galvanic Mechamorph", 
    image: "https://vignette.wikia.nocookie.net/ben10/images/8/87/Upgrade_OV_Render.png", 
    stats: { power: 6, speed: 7, durability: 7, intelligence: 9, energy: 9 } 
  },
  { 
    id: 6, 
    name: "Ghostfreak", 
    species: "Ectonurite", 
    image: "https://vignette.wikia.nocookie.net/ben10/images/b/b5/Ghostfreak_OV_Official.png", 
    stats: { power: 6, speed: 7, durability: 6, intelligence: 8, energy: 8 } 
  }
];

/* ==========================================================================
   2. SVG ICONS CHUẨN BIỂU TƯỢNG OMNITRIX / BIOMNITRIX (HÌNH ĐỒNG HỒ CÁT)
   ========================================================================== */
// Icon Đồng Hồ Cát Biomnitrix Đôi / Classic Omnitrix Dial
const OMNITRIX_ICON_SVG = `
  <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="7" fill="rgba(0,0,0,0.45)"/>
    <!-- Hourglass shape inner pattern -->
    <polygon points="18,18 82,18 50,50" fill="currentColor" />
    <polygon points="18,82 82,82 50,50" fill="currentColor" />
    <circle cx="50" cy="50" r="7" fill="#0a0c10" stroke="currentColor" stroke-width="3"/>
  </svg>
`;

const ULTIMATRIX_ICON_SVG = `
  <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="6" stroke-dasharray="8 4"/>
    <polygon points="12,12 88,12 50,48" fill="currentColor" />
    <polygon points="12,88 88,88 50,52" fill="currentColor" />
    <path d="M50 10 L58 32 L50 26 L42 32 Z" fill="currentColor"/>
    <path d="M50 90 L58 68 L50 74 L42 68 Z" fill="currentColor"/>
  </svg>
`;

const CHAQUETRIX_ICON_SVG = `
  <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="7"/>
    <polygon points="22,22 78,22 50,50" fill="currentColor" />
    <polygon points="22,78 78,78 50,50" fill="currentColor" />
    <path d="M50 43 C47 38, 40 40, 40 46 C40 52, 50 58, 50 58 C50 58, 60 52, 60 46 C60 40, 53 38, 50 43 Z" fill="#ff539b" stroke="#ffffff" stroke-width="1.5"/>
  </svg>
`;

/* ==========================================================================
   3. HỆ THỐNG ÂM THANH SCI-FI (WEB AUDIO API)
   ========================================================================== */
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
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
   4. STATE MANAGEMENT & CONFIG
   ========================================================================== */
const state = {
  activeTab: 'biomnitrix',
  slotCount: 2,
  selectedAliens: [null, null],
  activeModalSlotIndex: null,
  bodyProportions: 50,
  mobileActiveView: 'control'
};

const HEADER_CONFIG = {
  biomnitrix: {
    title: 'BIOMNITRIX',
    subtitle: 'USER_ID // Ben Tennyson',
    icon: OMNITRIX_ICON_SVG,
    processText: 'DUNG HỢP ADN',
    processIcon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
  },
  ultimatrix: {
    title: 'ULTIMATRIX',
    subtitle: 'USER_ID // Albedo',
    icon: ULTIMATRIX_ICON_SVG,
    processText: 'KHỞI ĐỘNG TIẾN HÓA',
    processIcon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`
  },
  chaquetrix: {
    title: 'CHAQUETRIX',
    subtitle: 'USER_ID // Haremic',
    icon: CHAQUETRIX_ICON_SVG,
    processText: 'TIẾN HÀNH TRIỆU HỒI HAREM',
    processIcon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  }
};

/* ==========================================================================
   5. DOM ELEMENTS
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
   6. RENDER LOGIC
   ========================================================================== */
function showToast(msg, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.toggle('toast--error', isError);
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}

// Cập nhật Header Logo & Cột Phải Radar Core với Icon Omnitrix Mới
function updateHeaderAndTheme(tabKey) {
  const config = HEADER_CONFIG[tabKey];
  if (!config) return;

  // 1. Cập nhật Logo Góc Trái
  brandIconWrap.innerHTML = config.icon;
  brandTitle.textContent = config.title;
  brandSubtitle.textContent = config.subtitle;

  // 2. Cập nhật Icon ở Trung Tâm Cột Phải (Radar Core)
  const radarIcon = document.getElementById('radarCoreIcon');
  if (radarIcon) {
    radarIcon.innerHTML = config.icon;
  }

  // 3. Cập nhật Theme
  document.body.className = `theme-${tabKey}`;

  // 4. Đồng bộ Tab Active
  tabs.forEach(t => {
    t.classList.toggle('tab-active', t.dataset.tab === tabKey);
  });

  // 5. Cập nhật Nút Thực Thi Action
  btnProcessText.textContent = config.processText;
  btnProcess.querySelector('svg').outerHTML = config.processIcon;
}

function switchTab(tabKey) {
  state.activeTab = tabKey;
  updateHeaderAndTheme(tabKey);

  if (tabKey === 'ultimatrix' || tabKey === 'chaquetrix') {
    state.slotCount = 1;
    state.selectedAliens = [state.selectedAliens[0] || null];
    slotStepper.style.display = 'none';
  } else {
    slotStepper.style.display = 'flex';
    if (state.selectedAliens.length < 2) {
      state.slotCount = 2;
      state.selectedAliens = [state.selectedAliens[0] || null, null];
    }
  }

  renderDNAGrid();
  renderSubPanels();
}

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
   7. EVENT LISTENERS
   ========================================================================== */
btnCycleCore.addEventListener('click', () => {
  const sequence = ['biomnitrix', 'ultimatrix', 'chaquetrix'];
  const currentIndex = sequence.indexOf(state.activeTab);
  const nextTab = sequence[(currentIndex + 1) % sequence.length];
  switchTab(nextTab);
  showToast(`Đã chuyển sang Lõi ${HEADER_CONFIG[nextTab].title}`);
});

tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

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

btnDice.addEventListener('click', () => {
  playDiceRollSound();
  btnDice.classList.remove('btn-dice-shake');
  void btnDice.offsetWidth;
  btnDice.classList.add('btn-dice-shake');

  const shuffled = [...ALIENS_DATA].sort(() => 0.5 - Math.random());
  for (let i = 0; i < state.slotCount; i++) {
    state.selectedAliens[i] = shuffled[i] || null;
  }
  renderDNAGrid();
  showToast("Đã ngẫu nhiên hóa chuỗi gen ADN!");
});

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
    openModal(Number(slot.dataset.index));
  }
});

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

document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.tab') || e.target.closest('.dna-slot')) {
    playSciFiBeep();
  }
});

btnArena.addEventListener('click', () => showToast("Đang kết nối Đấu Trường Vilgax..."));

/* ==========================================================================
   8. INITIALIZATION
   ========================================================================== */
function init() {
  switchTab('biomnitrix');
  if (window.innerWidth <= 768) {
    switchMobileView('control');
  }
}

init();
