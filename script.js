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

  // Tạo bộ dao động tạo tiếng (Oscillator)
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // Cấu hình âm thanh phong cách điện tử (Square wave)
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // Pitch khởi đầu
  oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1); // Pitch giảm nhanh

  // Chỉnh âm lượng (Fade out cực nhanh tạo tiếng click)
  gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  // Kết nối và phát
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

// Bắt sự kiện click toàn cục để phát âm thanh trên các phần tử tương tác
document.addEventListener('click', (event) => {
  const target = event.target;
  if (
    target.closest('button') || 
    target.closest('.tab') || 
    target.closest('.dna-slot')
  ) {
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
    const themeName = tab.dataset.tab; // Lấy tên: ultimate, biomnitrix, chaquetrix

    // Xử lý Active UI cho Tab
    tabs.forEach(t => t.classList.remove('tab-active'));
    tab.classList.add('tab-active');

    // Cập nhật Theme Color qua Body Class (Điều khiển toàn bộ UI)
    document.body.className = `theme-${themeName}`;

    // Điều hướng Khung Phải (Right Panel)
    if (themeName === 'ultimate' || themeName === 'chaquetrix') {
      // Hiển thị khung "Đang dần hoàn thiện"
      wipOverlay.hidden = false;
      radarWrap.style.opacity = '0.15';
      radarWrap.style.filter = 'blur(4px)';
      radarCore.style.animationPlayState = 'paused'; // Dừng rung lắc
    } else {
      // Trả về bình thường cho Biomnitrix
      wipOverlay.hidden = true;
      radarWrap.style.opacity = '1';
      radarWrap.style.filter = 'none';
      radarCore.style.animationPlayState = 'running'; // Kích hoạt rung lắc
    }
  });
});

/* ==========================================================================
   3. GIẢ LẬP SỰ KIỆN NÚT BẤM CƠ BẢN
   ========================================================================== */
const btnProcess = document.getElementById('btnProcess');
const btnDice = document.getElementById('btnDice');
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
