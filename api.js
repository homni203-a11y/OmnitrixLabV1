/**
 * api.js
 * ------------------------------------------------------------------
 * Tầng "giả lập API" — bọc dữ liệu tĩnh trong data.js bằng Promise +
 * setTimeout để mô phỏng độ trễ mạng thật, và dùng fetch() thật để
 * tải file battle.json (JSON tĩnh nằm cùng thư mục).
 * ------------------------------------------------------------------
 */

import { ALIENS_DATA } from "./data.js";

const FAKE_NETWORK_DELAY_MS = 600;

/**
 * fetchAliens
 * Giả lập gọi API GET /api/aliens.
 * Trả về Promise resolve với mảng Alien sau một khoảng trễ giả lập.
 * (Có thể dùng để demo trạng thái loading trên UI).
 */
export function fetchAliens() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Trả về bản sao (deep-ish clone) để tránh main.js vô tình
        // sửa trực tiếp vào nguồn dữ liệu gốc.
        const clone = ALIENS_DATA.map((alien) => ({
          ...alien,
          stats: { ...alien.stats },
        }));
        resolve(clone);
      } catch (err) {
        reject(err);
      }
    }, FAKE_NETWORK_DELAY_MS);
  });
}

/**
 * fetchBattleData
 * Gọi fetch() thật tới file battle.json nằm cùng cấp thư mục.
 * Dùng cho nút "ĐẤU TRƯỜNG" ở Header.
 */
export async function fetchBattleData() {
  const response = await fetch("./battle.json");
  if (!response.ok) {
    throw new Error(`Không thể tải battle.json (HTTP ${response.status})`);
  }
  return response.json();
}
