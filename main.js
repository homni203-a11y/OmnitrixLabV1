/**
 * main.js
 * ------------------------------------------------------------------
 * Entry point (ES Module). Quản lý toàn bộ STATE của ứng dụng, render
 * lại UI của cột trái (Sidebar) khi state thay đổi, và bắt tất cả các
 * sự kiện tương tác: chọn/xóa Alien, tăng giảm số ô, random, mở modal,
 * dung hợp, tải dữ liệu đấu trường.
 * ------------------------------------------------------------------
 */

import { fetchAliens, fetchBattleData } from "./api.js";
import { fuseAliens } from "./fusion.js";
import { SLOT_LIMITS } from "./data.js";

/* ==========================================================================
   STATE
   ========================================================================== */

const state = {
  allAliens: [], // Toàn bộ Alien tải về từ "API"
  slotCount: SLOT_LIMITS.DEFAULT, // Số ô hiện tại (2-5)
  selectedAliens: [], // Mảng song song với số ô: mỗi phần tử là Alien object hoặc null
  activeModalIndex: null, // Ô đang được nạp gen (null nếu đang ở chế độ Bộ sưu tập / đóng)
  isCollectionMode: false, // true = modal đang hiển thị dạng "Bộ sưu tập" (chỉ xem)
};

let toastTimer = null;

/* ==========================================================================
   DOM REFERENCES
   ========================================================================== */

const dnaGrid = document.getElementById("dnaGrid");
const slotCountDisplay = document.getElementById("slotCountDisplay");
const btnSlotMinus = document.getElementById("btnSlotMinus");
const btnSlotPlus = document.getElementById("btnSlotPlus");
const btnDice = document.getElementById("btnDice");
const btnProcess = document.getElementById("btnProcess");
const btnArena = document.getElementById("btnArena");
const btnCollection = document.getElementById("btnCollection");
const tabs = document.querySelectorAll(".tab");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalGrid = document.getElementById("modalGrid");
const btnModalClose = document.getElementById("btnModalClose");

const fusionResult = document.getElementById("fusionResult");
const toast = document.getElementById("toast");

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle("toast--error", isError);
  toast.hidden = false;
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

/* ==========================================================================
   RENDER: LƯỚI CÁC Ô ADN (SIDEBAR)
   ========================================================================== */

function renderEmptySlot(index) {
  return `
    <div class="dna-slot dna-slot--empty" data-index="${index}" data-role="empty-slot">
      <span class="slot-label">ADN ${index + 1}</span>

      <div class="slot-viewfinder" aria-hidden="true">
        <span class="corner corner--tl"></span>
        <span class="corner corner--tr"></span>
        <span class="corner corner--bl"></span>
        <span class="corner corner--br"></span>
      </div>

      <div class="slot-empty-center">
        <span class="slot-empty-arrow">↑</span>
        <span class="slot-empty-text">NẠP MÃ GEN</span>
      </div>

      <div class="slot-footer">
        <div class="slot-size">
          <span>⛶ SIZE</span>
          <strong>B.THƯỜNG</strong>
        </div>
        <div class="slot-size-blocks">
          <span class="size-block size-block--active"></span>
          <span class="size-block size-block--active"></span>
          <span class="size-block size-block--active"></span>
          <span class="size-block"></span>
          <span class="size-block"></span>
        </div>
      </div>
    </div>
  `;
}

function renderFilledSlot(index, alien) {
  return `
    <div class="dna-slot dna-slot--filled" data-index="${index}">
      <div class="slot-filled-header">
        <span class="slot-alien-name">${alien.name}</span>
        <button type="button" class="slot-remove-btn" data-index="${index}" data-role="remove-slot" aria-label="Gỡ ${alien.name}">✕</button>
      </div>
      <div class="slot-alien-image-wrap">
        <img class="slot-alien-image" src="${alien.image}" alt="${alien.name}" />
      </div>
    </div>
  `;
}

function renderSlots() {
  const html = state.selectedAliens
    .map((alien, index) => (alien ? renderFilledSlot(index, alien) : renderEmptySlot(index)))
    .join("");

  dnaGrid.innerHTML = html;

  // Cập nhật hiển thị bộ đếm & trạng thái disabled của nút +/-
  slotCountDisplay.textContent = String(state.slotCount);
  btnSlotMinus.disabled = state.slotCount <= SLOT_LIMITS.MIN;
  btnSlotPlus.disabled = state.slotCount >= SLOT_LIMITS.MAX;
}

/* ==========================================================================
   TĂNG / GIẢM SỐ Ô (SLOT COUNT)
   ========================================================================== */

function setSlotCount(nextCount) {
  const clamped = Math.max(SLOT_LIMITS.MIN, Math.min(SLOT_LIMITS.MAX, nextCount));
  if (clamped === state.slotCount) return;

  if (clamped < state.slotCount) {
    // Nếu giảm số ô, các ô bị cắt bớt mà đang chứa Alien phải được gỡ ra
    const removed = state.selectedAliens.slice(clamped).filter(Boolean);
    state.selectedAliens = state.selectedAliens.slice(0, clamped);
    if (removed.length > 0) {
      showToast(`Đã gỡ ${removed.length} Alien do giảm số ô ADN.`);
    }
  } else {
    // Nếu tăng số ô, thêm các ô trống mới vào cuối mảng
    const toAdd = clamped - state.selectedAliens.length;
    state.selectedAliens = state.selectedAliens.concat(Array(toAdd).fill(null));
  }

  state.slotCount = clamped;
  renderSlots();
}

btnSlotMinus.addEventListener("click", () => setSlotCount(state.slotCount - 1));
btnSlotPlus.addEventListener("click", () => setSlotCount(state.slotCount + 1));

/* ==========================================================================
   CLICK VÀO Ô ADN (mở modal nạp gen / gỡ gen)
   ========================================================================== */

dnaGrid.addEventListener("click", (event) => {
  const removeBtn = event.target.closest('[data-role="remove-slot"]');
  if (removeBtn) {
    event.stopPropagation();
    const index = Number(removeBtn.dataset.index);
    removeAlienFromSlot(index);
    return;
  }

  const emptySlot = event.target.closest('[data-role="empty-slot"]');
  if (emptySlot) {
    const index = Number(emptySlot.dataset.index);
    openInventoryModal(index);
  }
});

function removeAlienFromSlot(index) {
  if (!state.selectedAliens[index]) return;
  const removedName = state.selectedAliens[index].name;
  state.selectedAliens[index] = null;
  renderSlots();
  showToast(`Đã gỡ ${removedName} khỏi ADN ${index + 1}.`);
}

function assignAlienToSlot(index, alienId) {
  const alien = state.allAliens.find((a) => a.id === alienId);
  if (!alien) return;
  state.selectedAliens[index] = alien;
  renderSlots();
  closeModal();
  showToast(`Đã nạp ${alien.name} vào ADN ${index + 1}.`);
}

/* ==========================================================================
   MODAL: KHO ALIEN (dùng chung cho "Nạp mã gen" và "Bộ sưu tập")
   ========================================================================== */

function openInventoryModal(index) {
  state.activeModalIndex = index;
  state.isCollectionMode = false;
  modalTitle.textContent = `NẠP MÃ GEN — ADN ${index + 1}`;

  const selectedIds = new Set(state.selectedAliens.filter(Boolean).map((a) => a.id));

  modalGrid.innerHTML = state.allAliens
    .map((alien) => {
      const isTaken = selectedIds.has(alien.id);
      return `
        <div class="modal-item ${isTaken ? "modal-item--disabled" : ""}"
             data-id="${alien.id}"
             data-selectable="${isTaken ? "false" : "true"}">
          <img src="${alien.image}" alt="${alien.name}" />
          <span>${alien.name}</span>
          <small>${alien.species}</small>
        </div>
      `;
    })
    .join("");

  modalOverlay.hidden = false;
}

function openCollectionModal() {
  state.activeModalIndex = null;
  state.isCollectionMode = true;
  modalTitle.textContent = "BỘ SƯU TẬP ALIEN";

  modalGrid.innerHTML = state.allAliens
    .map(
      (alien) => `
        <div class="modal-item" data-id="${alien.id}" data-selectable="view-only">
          <img src="${alien.image}" alt="${alien.name}" />
          <span>${alien.name}</span>
          <small>${alien.species}</small>
        </div>
      `
    )
    .join("");

  modalOverlay.hidden = false;
}

function closeModal() {
  modalOverlay.hidden = true;
  state.activeModalIndex = null;
  state.isCollectionMode = false;
}

modalGrid.addEventListener("click", (event) => {
  const item = event.target.closest(".modal-item");
  if (!item) return;

  const alienId = Number(item.dataset.id);
  const mode = item.dataset.selectable;

  if (mode === "false") return; // Alien đã được chọn ở ô khác

  if (mode === "view-only") {
    const alien = state.allAliens.find((a) => a.id === alienId);
    if (alien) {
      showToast(
        `${alien.name} — SỨC MẠNH ${alien.stats.power} | TỐC ĐỘ ${alien.stats.speed} | GIÁP ${alien.stats.durability}`
      );
    }
    return;
  }

  if (state.activeModalIndex !== null) {
    assignAlienToSlot(state.activeModalIndex, alienId);
  }
});

btnModalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalOverlay.hidden) closeModal();
});

btnCollection.addEventListener("click", openCollectionModal);

/* ==========================================================================
   XÚC XẮC — NGẪU NHIÊN HÓA (không trùng lặp)
   ========================================================================== */

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

btnDice.addEventListener("click", () => {
  if (state.allAliens.length === 0) return;

  const shuffled = shuffleArray(state.allAliens);
  const picks = shuffled.slice(0, state.slotCount);

  // Đảm bảo mảng selectedAliens luôn đúng độ dài slotCount, không trùng Alien
  state.selectedAliens = Array(state.slotCount)
    .fill(null)
    .map((_, i) => picks[i] || null);

  renderSlots();
  showToast("Đã ngẫu nhiên hóa chuỗi gen!");
});

/* ==========================================================================
   TABS (ULTIMATE / BIOMNITRIX / CHAQUETRIX)
   ========================================================================== */

tabs.forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("tab-active");
      t.removeAttribute("aria-selected");
    });
    tabBtn.classList.add("tab-active");
    tabBtn.setAttribute("aria-selected", "true");
  });
});

/* ==========================================================================
   DUNG HỢP (FUSION) — nút "ĐANG XỬ LÝ..."
   ========================================================================== */

btnProcess.addEventListener("click", () => {
  const validAliens = state.selectedAliens.filter(Boolean);

  if (validAliens.length < 2) {
    showToast("Cần tối thiểu 2 mã gen hợp lệ để tiến hành dung hợp!", true);
    return;
  }

  const fused = fuseAliens(validAliens);
  if (!fused) {
    showToast("Dung hợp thất bại. Vui lòng thử lại.", true);
    return;
  }

  renderFusionResult(fused);
  showToast(`Dung hợp thành công: ${fused.name}!`);
});

function renderFusionResult(fused) {
  const statLabels = {
    power: "SỨC MẠNH",
    speed: "TỐC ĐỘ",
    durability: "GIÁP",
    intelligence: "TRÍ TUỆ",
    energy: "NĂNG LƯỢNG",
  };

  const chips = Object.entries(fused.stats)
    .map(
      ([key, value]) =>
        `<span class="fusion-stat-chip">${statLabels[key] || key}: <strong>${value}</strong></span>`
    )
    .join("");

  fusionResult.innerHTML = `
    <h3>${fused.name}</h3>
    <p>Chủng loài: ${fused.species} · Chỉ số sức mạnh tổng: ${fused.powerLevel}</p>
    <p>Thành phần: ${fused.componentAliens.join(" + ")}</p>
    <div class="fusion-stats">${chips}</div>
  `;
  fusionResult.hidden = false;

  // Tự động ẩn kết quả sau 7 giây để nhường chỗ cho radar
  clearTimeout(renderFusionResult._timer);
  renderFusionResult._timer = setTimeout(() => {
    fusionResult.hidden = true;
  }, 7000);
}

/* ==========================================================================
   ĐẤU TRƯỜNG — tải battle.json thật qua fetch()
   ========================================================================== */

btnArena.addEventListener("click", async () => {
  try {
    showToast("Đang kết nối tới đấu trường...");
    const data = await fetchBattleData();
    showToast(
      `${data.arena.name} — Hạng ${data.arena.difficulty} — Trạng thái: ${data.arena.status}`
    );
  } catch (err) {
    showToast(`Không thể tải dữ liệu đấu trường: ${err.message}`, true);
  }
});

/* ==========================================================================
   KHỞI TẠO ỨNG DỤNG
   ========================================================================== */

async function init() {
  // Hiển thị trạng thái tải ban đầu (skeleton đơn giản bằng cách disable nút)
  btnProcess.disabled = true;
  btnDice.disabled = true;

  try {
    const aliens = await fetchAliens();
    state.allAliens = aliens;
    state.selectedAliens = Array(state.slotCount).fill(null);
    renderSlots();
    showToast("Đã tải xong dữ liệu chuỗi gen.");
  } catch (err) {
    showToast(`Lỗi tải dữ liệu Alien: ${err.message}`, true);
  } finally {
    btnProcess.disabled = false;
    btnDice.disabled = false;
  }
}

init();
