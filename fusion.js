/**
 * fusion.js
 * ------------------------------------------------------------------
 * Thuật toán "dung hợp" (fusion) các Alien đã được chọn vào các ô ADN.
 * Đây là logic thuần (pure function) — không đụng tới DOM — để main.js
 * gọi và tự quyết định hiển thị kết quả ra sao.
 * ------------------------------------------------------------------
 */

const STAT_KEYS = ["power", "speed", "durability", "intelligence", "energy"];
const MAX_STAT = 10;

/**
 * generateFusionName
 * Ghép tên các Alien thành một cái tên lai mới.
 * Quy tắc: lấy nửa đầu của Alien này + nửa sau của Alien kế tiếp,
 * xoay vòng qua tất cả các Alien được chọn.
 */
function generateFusionName(aliens) {
  if (aliens.length === 1) return aliens[0].name;

  const parts = aliens.map((alien) => {
    const half = Math.ceil(alien.name.length / aliens.length) + 1;
    return alien.name.slice(0, half);
  });

  const raw = parts.join("");
  // Viết hoa chữ cái đầu, phần còn lại giữ nguyên để trông giống danh xưng
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * calculateFusedStats
 * Lấy trung bình cộng của từng chỉ số, sau đó cộng thêm "hiệu ứng cộng
 * hưởng" (synergy bonus) tỉ lệ với số lượng Alien tham gia, giới hạn
 * (cap) ở mức MAX_STAT để không vượt trần thang điểm.
 */
function calculateFusedStats(aliens) {
  const synergyBonus = (aliens.length - 1) * 0.5;
  const fusedStats = {};

  STAT_KEYS.forEach((key) => {
    const sum = aliens.reduce((acc, alien) => acc + alien.stats[key], 0);
    const average = sum / aliens.length;
    const boosted = average + synergyBonus;
    fusedStats[key] = Math.min(MAX_STAT, Math.round(boosted * 10) / 10);
  });

  return fusedStats;
}

/**
 * resolveDominantSpecies
 * Nếu nhiều Alien cùng species thì lấy species đó, ngược lại gắn nhãn
 * "HYBRID" (chủng lai, không xác định).
 */
function resolveDominantSpecies(aliens) {
  const counts = new Map();
  aliens.forEach((alien) => {
    counts.set(alien.species, (counts.get(alien.species) || 0) + 1);
  });

  let dominant = null;
  let max = 0;
  counts.forEach((count, species) => {
    if (count > max) {
      max = count;
      dominant = species;
    }
  });

  return max > 1 ? dominant : "HYBRID";
}

/**
 * fuseAliens
 * Hàm chính, export ra ngoài cho main.js sử dụng.
 * @param {Array} aliens - danh sách các Alien đã chọn (không chứa null/undefined)
 * @returns {Object|null} kết quả dung hợp, hoặc null nếu không đủ điều kiện
 */
export function fuseAliens(aliens) {
  const valid = (aliens || []).filter(Boolean);

  if (valid.length < 2) {
    return null;
  }

  const fusedStats = calculateFusedStats(valid);
  const powerLevel = STAT_KEYS.reduce((acc, key) => acc + fusedStats[key], 0);

  return {
    name: generateFusionName(valid),
    species: resolveDominantSpecies(valid),
    stats: fusedStats,
    powerLevel: Math.round(powerLevel * 10) / 10,
    componentAliens: valid.map((alien) => alien.name),
  };
}
