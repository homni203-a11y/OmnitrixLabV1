/**
 * script.js - Core System
 * Quản lý Web Audio, Theme Switching, và liên kết các sự kiện tương tác
 */

/* ==========================================================================
   1. HỆ THỐNG ÂM THANH - WEB AUDIO API (SCI-FI BEEP)
   ========================================================================== */
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSciFiBeep() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
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
}

// Lắng nghe sự kiện click phát tiếng beep
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
const wipOverlay = document.getElementById('wipOverlay');
const radarWrap = document.getElementById('radarWrap');
const radarCore = document.getElementById('radarCore');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const themeName = tab.dataset.tab; 

    // Reset và set active
    tabs.forEach(t => t.classList.remove('tab-active'));
    tab.classList.add('tab-active');

    // Chuyển đổi Theme toàn cục
    document.body.className = `theme-${themeName}`;

    if (themeName === 'ultimate' || themeName === 'chaquetrix') {
      wipOverlay.hidden = false;
      radarWrap.style.opacity = '0.15';
      radarWrap.style.filter = 'blur(4px)';
      radarCore.style.animationPlayState = 'paused'; 
    } else {
      wipOverlay.hidden = true;
      radarWrap.style.opacity = '1';
      radarWrap.style.filter = 'none';
      radarCore.style.animationPlayState = 'running'; 
    }
  });
});

/* ==========================================================================
   3. MÔ PHỎNG XỬ LÝ (MỞ RỘNG TỪ YÊU CẦU TRƯỚC)
   ========================================================================== */
const btnProcess = document.getElementById('btnProcess');
const slotCountDisplay = document.getElementById('slotCountDisplay');
let slotCount = 2;

document.getElementById('btnSlotPlus').addEventListener('click', () => {
  if(slotCount < 5) slotCount++;
  slotCountDisplay.textContent = slotCount;
});

document.getElementById('btnSlotMinus').addEventListener('click', () => {
  if(slotCount > 2) slotCount--;
  slotCountDisplay.textContent = slotCount;
});

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
