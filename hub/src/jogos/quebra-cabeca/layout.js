// Geometria em pixels lógicos de 960 × 600 e paleta da direção B (Papel recortado).
// Medidas de docs/quebra-cabeca/REGRAS-E-INTERACOES.md §6; sem Phaser, testável com node --test.
import { COLS, N } from './rules.js';

export const W = 960;
export const H = 600;
export const CELL = 96;
export const SLOT = 72;
export const TRAY_SCALE = SLOT / CELL;

export const C = {
  ink: 0x2a1f3d, paper: 0xfffaf2, grid: 0xe8d8c4, tray: 0x7fc8a9, sel: 0x6a3fc8, white: 0xffffff, sticker: 0xffd166,
};
export const CSS = { ink: '#2a1f3d', inkSoft: '#57466e', sel: '#6a3fc8', white: '#ffffff' };

// Cor da cartolina: lista fixa (DIRECAO-ARTISTICA.md). Nesta versão o jogo usa sempre o pêssego.
export const CARD_COLORS = { pessego: '#ffd9a8', menta: '#cdeedd', ceu: '#cfe3ff', lavanda: '#e6dcff' };
export const cardColor = name => CARD_COLORS[name] ?? CARD_COLORS.pessego;

export const BOARD = { x: 352, y: 84, w: 500, h: 308 };
export const TRAY = { x: 24, y: 404, w: 912, h: 184 };
export const MODEL = { x: 24, y: 112, w: 220, h: 132 };
export const PROGRESS = { x: 24, y: 300 };

// Inclinação de enfeite de cada lugar da bandeja (−3° a +2,5°).
export const TILTS = [-3, 2, -1.5, 2.5, -2.5, 1, -3, 2, -1, 2.5, -2, 1.5, -3, 2, -1.5];

// Canto superior esquerdo de cada casa e de cada lugar da bandeja (10 + 5, centralizados).
export const cellXY = c => [362 + (c % COLS) * CELL, 94 + Math.floor(c / COLS) * CELL];
export function slotXY(s) {
  const row = Math.floor(s / 10), col = s % 10;
  const count = row === 0 ? 10 : N - 10;
  const rowW = count * SLOT + (count - 1) * 12;
  return [TRAY.x + (TRAY.w - rowW) / 2 + col * (SLOT + 12), 418 + row * (SLOT + 12)];
}

// Barra: Ajuda e Som à direita; a instrução ocupa o resto. Sem o Sair, que é do hub.
export function barLayout({ sound = true } = {}) {
  const som = { x: W - 24 - 120, y: 8, w: 120, h: 56 };
  const ajuda = { x: (sound ? som.x - 14 : W - 24) - 136, y: 8, w: 136, h: 56 };
  const instr = { x: 24, w: ajuda.x - 14 - 24 };
  return { som: sound ? som : null, ajuda, instr };
}

// Escala FIT: o jogo inteiro cabe na área, centralizado, sem distorcer.
export function fitView(width, height) {
  const zoom = Math.min(width / W, height / H);
  return { zoom, x: (width - W * zoom) / 2, y: (height - H * zoom) / 2 };
}

// Imagem composta: 5:3, de onde saem os 15 recortes quadrados.
export const COMPOSED = { w: 1000, h: 600 };
const PIECE_PX = COMPOSED.w / COLS;
export const pieceFrame = p => ({ x: (p % COLS) * PIECE_PX, y: Math.floor(p / COLS) * PIECE_PX, w: PIECE_PX, h: PIECE_PX });

// `contain` põe a imagem inteira; `cover` é a mesma imagem ampliada para preencher a sobra.
export function composeRects(imgW, imgH, { w, h } = COMPOSED) {
  const contain = Math.min(w / imgW, h / imgH);
  const cover = Math.max(w / imgW, h / imgH);
  const rect = k => ({ x: (w - imgW * k) / 2, y: (h - imgH * k) / 2, w: imgW * k, h: imgH * k });
  return { contain: rect(contain), cover: rect(cover), fills: Math.abs(imgW / imgH - w / h) < 0.01 };
}
