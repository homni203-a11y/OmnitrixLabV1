/**
 * LÕI OMNITRIX - CORE JAVASCRIPT
 * Tái cấu trúc chuẩn Modular, xử lý State Management & Component Rendering.
 */

// 1. DATA & STATE
const ALIENS_DATA = [
  { id: 1, name: "Heatblast", species: "Pyronite", image: "https://static.wikia.nocookie.net/ben10/images/2/20/Heatblast_omniverse_official.png" },
  { id: 2, name: "Four Arms", species: "Tetramand", image: "https://static.wikia.nocookie.net/ben10/images/d/d0/Four_arms_os_render.png" },
  { id: 3, name: "XLR8", species: "Kineceleran", image: "https://static.wikia.nocookie.net/ben10/images/5/57/XLR8_OV2.png" },
  { id: 4, name: "Diamondhead", species: "Petrosapien", image: "https://static.wikia.nocookie.net/ben10/images/2/2c/Diamondhead_oficial.png" }
];

const state = {
  playerName: null,        // Quản lý định danh User Google (Module 3)
  activeTab: 'biomnitrix', // biomnitrix | ultimatrix | chaquetrix
  slotCount: 2,
  selectedAliens: [null, null],
  activeModalSlotIndex: null,
  
  // Custom states cho Subpanels
  bioMainSlot: 0,          
  bioStability: 'stable',  
  bioBalance: 50,          
  chaqSegments: 7,         
  chaqActiveSegment: 3,    
  chaqPersonality: 'TOMBOY' 
};

const HEADER_CONFIG = {
  biomnitrix: {
    title: 'BIOMNITRIX',
    defaultChar: 'Ben Tennyson',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 17 22 12"></polyline></svg>`,
    processText: 'DUNG HỢP ADN'
  },
  ultimatrix: {
    title: 'ULTIMATRIX',
    defaultChar: 'Albedo',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    processText: 'KHỞI ĐỘNG TIẾN HÓA'
  },
  chaquetrix: {
    title: 'CHAQUETRIX',
    defaultChar: 'Haremic',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    processText: 'TRIỆU HỒI HAREM'
  }
};

// 2. DOM ELEMENTS
const DOM = {
  brandIconWrap: document.getElementById('brandIconWrap'),
  brandTitle: document.getElementById('brandTitle'),
  brandSubtitle: document.getElementById('brandSubtitle'),
  tabs: document.querySelectorAll('.tab'),
  dnaGrid: document.getElementById('dnaGrid'),
  subpanelContainer: document.getElementById('subpanelContainer'),
  btnProcess: document.getElementById('btnProcess'),
  btnProcessIcon: document.getElementById('btnProcessIcon'),
  btnProcessText: document.getElementById('btnProcessText'),
  radarCoreIcon: document.querySelector('#radarCoreIcon svg'),
  radarCoreStatus: document.getElementById('radarCoreStatus')
};

// 3. CORE LOGIC TABS & RENDERING
function switchTab(tabKey) {
  state.activeTab = tabKey;
  const config = HEADER_CONFIG[tabKey];

  // Update Header & Icon (Module 2)
  DOM.brandIconWrap.innerHTML = config.icon;
  DOM.brandTitle.textContent = config.title;
  updateHeaderSubtitle(); 
  document.body.className = `theme-${tabKey}`;
  DOM.radarCoreIcon.outerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">${config.icon}</svg>`;
  DOM.btnProcessText.textContent = config.processText;
  DOM.btnProcessIcon.outerHTML = `<svg id="btnProcessIcon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">${config.icon}</svg>`;
  
  // MODULE 2: Reset Status
  DOM.radarCoreStatus.textContent = "CHỜ KHỞI ĐỘNG";

  DOM.tabs.forEach(t => t.classList.toggle('tab-active', t.dataset.tab === tabKey));
  
  if (tabKey === 'ultimatrix' || tabKey === 'chaquetrix') {
    state.slotCount = 1;
    state.selectedAliens = [state.selectedAliens[0] || null];
  } else {
    state.slotCount = 2;
    if(state.selectedAliens.length < 2) state.selectedAliens.push(null);
  }

  renderDNAGrid();
  renderDynamicSubPanels();
}

function updateHeaderSubtitle() {
  const config = HEADER_CONFIG[state.activeTab];
  const displayName = state.playerName ? state.playerName : config.defaultChar;
  DOM.brandSubtitle.textContent = `USER_ID // ${displayName}`;
}

// 4. DYNAMIC SUBPANELS (MODULE 4 & 5)
function renderDynamicSubPanels() {
  const container = DOM.subpanelContainer;
  container.innerHTML = '';

  if (state.activeTab === 'biomnitrix') {
    // MODULE 4: Menu Chính/Phụ & Cân bằng & Bất ổn
    const stabilityText = {
      'stable': 'Dung hợp an toàn, giữ vững lý trí.',
      'unstable': 'Đột biến sức mạnh, khó kiểm soát.',
      'chaos': 'Nguy cơ hủy diệt gen diện rộng.'
    };

    container.innerHTML = `
      <div class="subpanel-card">
        <div class="subpanel-card-title">CẤU TRÚC GEN CHÍNH / PHỤ</div>
        <div class="bio-roles">
          <button class="bio-role-btn ${state.bioMainSlot === 0 ? 'active' : ''}" onclick="setBioMainSlot(0)">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
             ${state.bioMainSlot === 0 ? 'CƠ THỂ CHÍNH' : 'GEN PHỤ'} (ADN 1)
          </button>
          <button class="bio-role-btn ${state.bioMainSlot === 1 ? 'active' : ''}" onclick="setBioMainSlot(1)">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>
             ${state.bioMainSlot === 1 ? 'CƠ THỂ CHÍNH' : 'GEN PHỤ'} (ADN 2)
          </button>
        </div>
      </div>
      <div class="subpanel-card">
        <div class="subpanel-card-title">CÂN BẰNG ADN: <span id="bioBalanceVal">${state.bioBalance}%</span></div>
        <input type="range" class="range-slider" min="0" max="100" value="${state.bioBalance}" oninput="updateBioBalance(this.value)">
      </div>
      <div class="subpanel-card">
        <div class="subpanel-card-title">KIỂM SOÁT BẤT ỔN GEN</div>
        <div class="stability-grid">
          <button class="stability-btn ${state.bioStability === 'stable' ? 'active' : ''}" onclick="setBioStability('stable')">ỔN ĐỊNH</button>
          <button class="stability-btn ${state.bioStability === 'unstable' ? 'active' : ''}" onclick="setBioStability('unstable')">BẤT ỔN</button>
          <button class="stability-btn ${state.bioStability === 'chaos' ? 'active' : ''}" onclick="setBioStability('chaos')">HỖN MANG</button>
        </div>
        <p class="stability-desc" id="stabilityDesc">${stabilityText[state.bioStability]}</p>
      </div>
    `;
  } 
  else if (state.activeTab === 'ultimatrix') {
    // MODULE 5: 3 Menu Ultimatrix
    container.innerHTML = `
      <div class="subpanel-card">
        <div class="subpanel-card-title">✦ THÔNG SỐ TIẾN HÓA ULTIMATE</div>
        <div class="subpanel-grid">
          <div class="subpanel-item">
            <svg width="18" height="18" fill="var(--theme-base)" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <span class="subpanel-item-val" style="font-size:9px">Gia Tốc x1000</span>
          </div>
          <div class="subpanel-item">
            <svg width="18" height="18" fill="var(--theme-base)" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm6.72 5.36L12 11.63l-6.72-3.27L12 5.09l6.72 3.27z"/></svg>
            <span class="subpanel-item-val" style="font-size:9px">Hệ Sinh Thái Giả Lập</span>
          </div>
          <div class="subpanel-item">
            <svg width="18" height="18" fill="var(--theme-base)" viewBox="0 0 24 24"><path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/></svg>
            <span class="subpanel-item-val" style="font-size:9px">Cường Hoá Tối Đa</span>
          </div>
        </div>
      </div>
    `;
  }
  else if (state.activeTab === 'chaquetrix') {
    // MODULE 5: Thanh nấc & Grid Tính Cách
    const segmentsHTML = Array.from({length: state.chaqSegments}).map((_, i) => 
      `<div class="chaq-segment ${i === state.chaqActiveSegment ? 'active' : ''}" onclick="setChaqSegment(${i})"></div>`
    ).join('');

    const personalities = ['TOMBOY', 'TSUNDERE', 'YANDERE', 'THANH LỊCH', 'MỊ YÊU', 'MOMMY', 'NHÚT NHÁT', 'GYARU'];
    const pHTML = personalities.map(p => 
      `<div class="chaq-personality ${p === state.chaqPersonality ? 'active' : ''}" onclick="setChaqPersonality('${p}')">${p}</div>`
    ).join('');

    container.innerHTML = `
      <div class="subpanel-card">
        <div class="subpanel-card-title">TỈ LỆ CƠ THỂ <span style="margin-left:auto; color:var(--text-secondary); font-size:9px;">B.THƯỜNG</span></div>
        <div class="chaq-segments">${segmentsHTML}</div>
      </div>
      <div class="subpanel-card">
        <div class="subpanel-card-title">TÍNH CÁCH ĐỒNG HÀNH</div>
        <div class="chaq-personalities">${pHTML}</div>
      </div>
    `;
  }
}

// 5. HELPER CỦA SUBPANEL
window.setBioMainSlot = (slot) => { state.bioMainSlot = slot; renderDynamicSubPanels(); };
window.updateBioBalance = (val) => { state.bioBalance = val; document.getElementById('bioBalanceVal').textContent = val + '%'; };
window.setBioStability = (val) => { state.bioStability = val; renderDynamicSubPanels(); };
window.setChaqSegment = (idx) => { state.chaqActiveSegment = idx; renderDynamicSubPanels(); };
window.setChaqPersonality = (p) => { state.chaqPersonality = p; renderDynamicSubPanels(); };

// 6. RENDER DNA GRID
function renderDNAGrid() {
  DOM.dnaGrid.innerHTML = '';
  for (let i = 0; i < state.slotCount; i++) {
    const alien = state.selectedAliens[i];
    const slotEl = document.createElement('div');
    slotEl.className = `dna-slot`;
    slotEl.dataset.index = i;

    if (alien) {
      slotEl.innerHTML = `
        <div class="slot-filled-header">
          <span class="slot-alien-name">${alien.name}</span>
          <button type="button" class="slot-remove-btn" onclick="removeAlien(${i}, event)">&times;</button>
        </div>
        <div class="slot-alien-image-wrap">
          <img class="slot-alien-image" src="${alien.image}" alt="${alien.name}" />
        </div>
      `;
    } else {
      slotEl.innerHTML = `
        <span class="slot-label">ADN ${i + 1}</span>
        <div class="slot-empty-center" onclick="openModal(${i})">
          <span style="color:var(--text-secondary); font-size:16px;">↑</span>
          <span class="slot-empty-text">NẠP MÃ GEN</span>
        </div>
      `;
    }
    DOM.dnaGrid.appendChild(slotEl);
  }
}

window.removeAlien = (idx, e) => {
  e.stopPropagation();
  state.selectedAliens[idx] = null;
  renderDNAGrid();
};

window.openModal = (idx) => {
  state.activeModalSlotIndex = idx;
  const grid = document.getElementById('modalGrid');
  grid.innerHTML = ALIENS_DATA.map(a => `
    <div class="modal-item" onclick="selectAlien(${a.id})">
      <img src="${a.image}" alt="${a.name}">
      <span>${a.name}</span>
    </div>
  `).join('');
  document.getElementById('modalOverlay').hidden = false;
};

window.selectAlien = (id) => {
  const alien = ALIENS_DATA.find(a => a.id === id);
  if(state.activeModalSlotIndex !== null) {
    state.selectedAliens[state.activeModalSlotIndex] = alien;
    renderDNAGrid();
  }
  document.getElementById('modalOverlay').hidden = true;
};

document.getElementById('btnModalClose').onclick = () => document.getElementById('modalOverlay').hidden = true;

// 7. EVENT LISTENERS
document.getElementById('btnCycleCore').addEventListener('click', () => {
  const tabs = ['biomnitrix', 'ultimatrix', 'chaquetrix'];
  const next = tabs[(tabs.indexOf(state.activeTab) + 1) % tabs.length];
  switchTab(next);
});

DOM.tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

// MODULE 3: Tính năng đăng nhập giả lập
const modalSettings = document.getElementById('settingsModal');
const modalName = document.getElementById('playerNameModal');

document.getElementById('btnSettings').addEventListener('click', () => {
  modalSettings.hidden = false;
});
document.getElementById('btnSettingsClose').addEventListener('click', () => {
  modalSettings.hidden = true;
});

// Giả lập luồng đăng nhập Google
document.getElementById('btnGoogleLogin').addEventListener('click', () => {
  // Thay vì chuyển hướng thật, ta giả lập callback thành công, bật popup hỏi tên
  modalSettings.hidden = true;
  modalName.hidden = false;
});

document.getElementById('btnConfirmName').addEventListener('click', () => {
  const inputName = document.getElementById('playerNameInput').value.trim();
  if (inputName !== '') {
    state.playerName = inputName;
    updateHeaderSubtitle();
    modalName.hidden = true;
    
    // Cập nhật giao diện nút đăng nhập
    document.getElementById('btnGoogleLogin').hidden = true;
    document.getElementById('playerProfileInfo').hidden = false;
  }
});

DOM.btnProcess.addEventListener('click', () => {
  // MODULE 2: Update trạng thái radar
  DOM.radarCoreStatus.textContent = "ĐANG HOẠT ĐỘNG";
  DOM.radarCoreStatus.style.animation = "corePulse 0.5s ease-in-out infinite alternate";
  
  setTimeout(() => {
    DOM.radarCoreStatus.style.animation = "none";
  }, 2000);
});

// Init
switchTab('biomnitrix');
