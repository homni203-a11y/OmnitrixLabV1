/**
 * script.js - Core System
 * Quản lý Web Audio (âm thanh Sci-fi), chuyển đổi Theme, và tương tác Tab cốt lõi.
 */

/* ==========================================================================
   1. HỆ THỐNG ÂM THANH - WEB AUDIO API (SCI-FI BEEP)
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
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1); 

    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.log("Audio context prevented or not supported yet.", e);
  }
}

// Bắt sự kiện click toàn cục để phát âm thanh phản hồi UI
document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.closest('button') || target.closest('.tab') || target.closest('.dna-slot')) {
    playSciFiBeep();
  }
});

/* ==========================================================================
   2. HỆ THỐNG CHUYỂN ĐỔI TAB & DYNAMIC THEMES
   ========================================================================== */
const tabs = document.querySelectorAll('.tab');
const rightPanel = document.getElementById('rightPanel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const themeName = tab.dataset.tab; 

    // Cập nhật trạng thái Active của Tab
    tabs.forEach(t => t.classList.remove('tab-active'));
    tab.classList.add('tab-active');

    // Chuyển đổi Theme màu sắc toàn cục trên thẻ body
    document.body.className = `theme-${themeName}`;

    // Kiểm tra xem tab có đang ở chế độ "Đang dần hoàn thiện" hay không
    const existingWip = document.getElementById('wipOverlay');
    const radarWrap = document.getElementById('radarWrap');

    if (themeName === 'ultimate' || themeName === 'chaquetrix') {
      // Nếu chưa có lớp WIP thì tạo mới gắn vào Cột phải
      if (!existingWip) {
        if (radarWrap) radarWrap.style.display = 'none';
        
        const wipDiv = document.createElement('div');
        wipDiv.id = 'wipOverlay';
        wipDiv.className = 'wip-overlay';
        wipDiv.innerHTML = `
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--theme-base)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <h2>ĐANG DẦN HOÀN THIỆN</h2>
          <p>Hệ thống lõi đang được cấu hình cho module này.</p>
        `;
        rightPanel.appendChild(wipDiv);
      } else {
        existingWip.hidden = false;
        if (radarWrap) radarWrap.style.display = 'none';
      }
    } else {
      // Ẩn bảng WIP, hiển thị lại Radar giao diện chính
      if (existingWip) {
        existingWip.remove();
      }
      if (radarWrap) {
        radarWrap.style.display = 'flex';
      }
    }
  });
});

/* ==========================================================================
   3. MÔ PHỎNG XỬ LÝ (DNA SLOTS & PROCESS BUTTON)
   ========================================================================== */
const btnProcess = document.getElementById('btnProcess');
const slotCountDisplay = document.getElementById('slotCountDisplay');
const dnaGrid = document.getElementById('dnaGrid');
let slotCount = 2;

function updateSlots(count) {
  if (!dnaGrid) return;
  dnaGrid.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const slot = document.createElement('div');
    slot.className = 'dna-slot';
    slot.innerHTML = `<span class="slot-label">ADN ${i}</span>`;
    dnaGrid.appendChild(slot);
  }
}

const btnPlus = document.getElementById('btnSlotPlus');
const btnMinus = document.getElementById('btnSlotMinus');

if (btnPlus && btnMinus) {
  btnPlus.addEventListener('click', () => {
    if(slotCount < 5) {
      slotCount++;
      slotCountDisplay.textContent = slotCount;
      updateSlots(slotCount);
    }
  });

  btnMinus.addEventListener('click', () => {
    if(slotCount > 2) {
      slotCount--;
      slotCountDisplay.textContent = slotCount;
      updateSlots(slotCount);
    }
  });
}

if (btnProcess) {
  btnProcess.addEventListener('click', () => {
    const isWIP = document.body.classList.contains('theme-ultimate') || document.body.classList.contains('theme-chaquetrix');
    if (isWIP) {
        alert("Hệ thống module này đang được nâng cấp, không thể dung hợp!");
    } else {
        btnProcess.textContent = "ĐANG XỬ LÝ GEN...";
        setTimeout(() => {
            btnProcess.textContent = "DUNG HỢP ADN";
        }, 1000);
    }
  });
}
