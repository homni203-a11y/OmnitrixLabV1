// Đảm bảo file data.js và fusion.js của bạn tồn tại trong cùng thư mục
import { ALIENS_GOC, STAT_KEYS, STAT_LABELS } from "./data.js";
import { performFusion } from "./fusion.js";

const state = {
    selectedForFusion: [],
    slotCount: 2 // Mặc định 2, tối đa 5
};

let resultRadarChart = null;

document.addEventListener("DOMContentLoaded", () => {
    setupCounters();
    setupRandomizer();
    renderInventory();
    renderSlots();

    document.getElementById("fuse-btn").addEventListener("click", handleFuse);
});

// 1. CHỈNH SỐ LƯỢNG SLOT (2 - 5)
function setupCounters() {
    const btnInc = document.getElementById("btn-increase");
    const btnDec = document.getElementById("btn-decrease");
    const display = document.getElementById("slot-count-display");

    btnInc.addEventListener("click", () => {
        if (state.slotCount < 5) {
            state.slotCount++;
            display.textContent = state.slotCount;
            renderSlots();
        }
    });

    btnDec.addEventListener("click", () => {
        if (state.slotCount > 2) {
            state.slotCount--;
            display.textContent = state.slotCount;
            // Nếu giảm slot mà đang chọn thừa, cắt bớt đuôi
            if (state.selectedForFusion.length > state.slotCount) {
                state.selectedForFusion.length = state.slotCount;
                renderInventory();
            }
            renderSlots();
        }
    });
}

// 2. RANDOM NHANH ALIEN THEO SỐ SLOT (XÚC XẮC)
function setupRandomizer() {
    document.getElementById("btn-random").addEventListener("click", () => {
        // Trộn mảng gốc
        const shuffled = [...ALIENS_GOC].sort(() => 0.5 - Math.random());
        // Lấy đúng số lượng slot
        state.selectedForFusion = shuffled.slice(0, state.slotCount).map(a => a.id);
        
        renderInventory();
        renderSlots();
    });
}

// 3. RENDER KHO LƯU TRỮ CHỌN NHANH
function renderInventory() {
    const grid = document.getElementById("alien-grid");
    grid.innerHTML = ALIENS_GOC.map(alien => {
        const isSelected = state.selectedForFusion.includes(alien.id);
        return `
            <div class="alien-item ${isSelected ? 'selected' : ''}" data-id="${alien.id}">
                <img src="${alien.image}" alt="${alien.name}" onerror="this.style.display='none'">
                <span>${alien.name}</span>
            </div>
        `;
    }).join("");

    grid.querySelectorAll('.alien-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            if (state.selectedForFusion.includes(id)) {
                state.selectedForFusion = state.selectedForFusion.filter(a => a !== id);
            } else {
                if (state.selectedForFusion.length < state.slotCount) {
                    state.selectedForFusion.push(id);
                } else {
                    // Nếu đầy thì thay thế thằng đầu tiên
                    state.selectedForFusion.shift();
                    state.selectedForFusion.push(id);
                }
            }
            renderInventory();
            renderSlots();
        });
    });
}

// 4. RENDER CÁC SLOT GIAO DIỆN MỚI
function renderSlots() {
    const container = document.getElementById("fusion-slots");
    let html = "";

    for (let i = 0; i < state.slotCount; i++) {
        const alienId = state.selectedForFusion[i];
        
        if (alienId) {
            const alien = ALIENS_GOC.find(a => a.id === alienId);
            html += `
                <div class="dna-card">
                    <div class="dna-card__header">
                        <span>ADN ${i + 1}</span>
                        <button class="btn-close" onclick="removeSlot('${alienId}')">✕</button>
                    </div>
                    <div class="dna-card__box">
                        <img src="${alien.image}" alt="${alien.name}">
                        <span class="dna-name">${alien.name}</span>
                    </div>
                    <div class="dna-card__footer">
                        <span>⛶ SIZE</span>
                        <div class="size-bars">
                            <div class="bar active"></div><div class="bar active"></div>
                            <div class="bar active"></div><div class="bar"></div>
                        </div>
                        <span style="color: var(--omnitrix-green);">B.THƯỜNG</span>
                    </div>
                </div>
            `;
        } else {
            // UI Trống giống khung ngắm trong ảnh
            html += `
                <div class="dna-card empty">
                    <div class="dna-card__header">
                        <span>ADN ${i + 1}</span>
                    </div>
                    <div class="dna-card__box">
                        <span class="empty-icon">↑</span>
                        <span class="empty-text">NẠP MÃ GEN</span>
                    </div>
                    <div class="dna-card__footer">
                        <span>⛶ SIZE</span>
                        <div class="size-bars">
                            <div class="bar"></div><div class="bar"></div>
                            <div class="bar"></div><div class="bar"></div>
                        </div>
                        <span>---</span>
                    </div>
                </div>
            `;
        }
    }
    
    container.innerHTML = html;

    // Check trạng thái nút
    const btn = document.getElementById("fuse-btn");
    if (state.selectedForFusion.length < 2) {
        btn.disabled = true;
        document.getElementById("fuse-text").innerText = "CẦN ÍT NHẤT 2 GEN";
    } else {
        btn.disabled = false;
        document.getElementById("fuse-text").innerText = "BẮT ĐẦU DUNG HỢP";
    }
}

// Hàm global để xóa thẻ từ HTML inline onclick
window.removeSlot = function(id) {
    state.selectedForFusion = state.selectedForFusion.filter(a => a !== id);
    renderInventory();
    renderSlots();
}

// 5. XỬ LÝ DUNG HỢP VÀ VẼ RADAR
function handleFuse() {
    const parents = state.selectedForFusion.map(id => ALIENS_GOC.find(a => a.id === id));
    
    document.getElementById("fuse-spinner").style.display = "inline-block";
    document.getElementById("fuse-btn").disabled = true;

    setTimeout(() => {
        // Dùng code dung hợp của bạn
        const result = performFusion(parents);
        
        document.getElementById("empty-state").classList.add("hidden");
        document.getElementById("result-content").classList.remove("hidden");

        // Điền text
        document.getElementById("res-id").textContent = result.name.substring(0,6).toUpperCase() + "-" + state.selectedForFusion.length;
        document.getElementById("res-name").textContent = result.name;
        document.getElementById("res-danger").textContent = result.dangerLevel;
        document.getElementById("res-type").textContent = result.types;
        
        // Hiện ảnh Alien đầu tiên làm nền
        document.getElementById("res-image").src = result.parents[0].image;

        // Vẽ biểu đồ
        drawRadar(result);

        document.getElementById("fuse-spinner").style.display = "none";
        document.getElementById("fuse-btn").disabled = false;
    }, 800);
}

function drawRadar(result) {
    const ctx = document.getElementById("radar-chart").getContext("2d");
    if (resultRadarChart) resultRadarChart.destroy();
    
    resultRadarChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: STAT_KEYS.map(k => STAT_LABELS[k]),
            datasets: [{
                label: "Chỉ số",
                data: STAT_KEYS.map(k => result.stats[k]),
                backgroundColor: "rgba(29, 242, 165, 0.2)",
                borderColor: "#1df2a5",
                pointBackgroundColor: "#1df2a5",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: "rgba(255,255,255,0.1)" },
                    grid: { color: "rgba(255,255,255,0.1)" },
                    pointLabels: { color: "#8b949e", font: { size: 10 } },
                    ticks: { display: false },
                    min: 0, max: 100
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}
