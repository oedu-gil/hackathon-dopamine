// Geometria pura (px CSS) para celular retrato, celular deitado e tablet, conforme o protótipo aprovado.

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const MIN_SLOT = 56;
const MIN_OPT = 96;
const BELOW = 100; // do fim dos cartões até o fim da mensagem (dica + mensagem)

function belowBoard(slotsBottom) {
  const hintY = slotsBottom + 49;
  return { hint: { y: hintY }, msg: { y: hintY + 39 } };
}

function endButtons(cx, cy) {
  return [
    { id: 'again', x: cx - 8 - 168, y: cy - 24, w: 168, h: 48 },
    { id: 'exit', x: cx + 8, y: cy - 24, w: 96, h: 48 },
  ];
}

function row(count, slot, gap, cx, cy) {
  const x0 = cx - (count * slot + (count - 1) * gap) / 2 + slot / 2;
  return Array.from({ length: count }, (_, i) => ({ x: x0 + i * (slot + gap), y: cy }));
}

function stacked(w, h, wide) {
  const top = 72;
  const title = wide ? 28 : 22;
  const ctx = wide ? 19 : 17;
  const titleY = top + title / 2 + 2;
  const ctxY = titleY + title / 2 + 6 + ctx * 0.65;
  const headBottom = ctxY + ctx * 0.65 + 8;
  const gap = wide ? 16 : 10;
  const rowGap = 30;
  let slot = wide ? clamp((w - 140) / 5, 96, 150) : clamp((w - 64) / 3, 72, 112);
  let opt = wide ? clamp(w * 0.2, 140, 190) : clamp(w * 0.36, 120, 170);
  const slotsH = () => (wide ? slot : 2 * slot + rowGap);
  const need = () => headBottom + 12 + slotsH() + BELOW + 12 + opt + 79;
  while (need() > h && (slot > MIN_SLOT || opt > MIN_OPT)) {
    slot = Math.max(MIN_SLOT, slot - 2);
    opt = Math.max(MIN_OPT, opt - 2);
  }
  const trayH = opt + 79;
  const trayY = h - trayH;
  const boardTop = headBottom + Math.max(12, (trayY - headBottom - slotsH() - BELOW) / 2);
  const slots = wide
    ? row(5, slot, gap, w / 2, boardTop + slot / 2)
    : [...row(3, slot, gap, w / 2, boardTop + slot / 2), ...row(2, slot, gap, w / 2, boardTop + slot * 1.5 + rowGap)];
  const optY = trayY + 50 + opt / 2;
  return {
    mode: wide ? 'wide' : 'narrow', w, h, slot, opt,
    hintBtn: { x: w - 120, y: 12, w: 104, h: 48 },
    title: { x: w / 2, y: titleY, size: title },
    ctx: { x: w / 2, y: ctxY, size: ctx },
    slots, center: w / 2,
    ...belowBoard(boardTop + slotsH()),
    tray: { x: 0, y: trayY, w, h: trayH, radius: 0 },
    trayTitle: { x: w / 2, y: trayY + 27 },
    options: [{ x: w / 2 - opt / 2 - 12, y: optY }, { x: w / 2 + opt / 2 + 12, y: optY }],
    end: endButtons(w / 2, trayY + 74),
  };
}

// Celular deitado: fileira à esquerda, bandeja de opções à direita.
function sideBySide(w, h) {
  const top = 64;
  const opt = clamp(h * 0.28, 104, 130);
  const trayW = 2 * opt + 64;
  const leftW = w - trayW;
  const slot = clamp((leftW - 80) / 5, MIN_SLOT, 100);
  const titleY = top + 13;
  const ctxY = titleY + 28;
  const headBottom = ctxY + 19;
  const boardTop = headBottom + Math.max(8, (h - headBottom - slot - BELOW) / 2);
  const trayH = h - top;
  const titleTrayY = top + trayH / 2 - (34 + opt) / 2 + 11;
  const optY = titleTrayY + 23 + opt / 2;
  const trayCx = leftW + trayW / 2;
  return {
    mode: 'side', w, h, slot, opt,
    hintBtn: { x: w - 120, y: 8, w: 104, h: 48 },
    title: { x: leftW / 2, y: titleY, size: 20 },
    ctx: { x: leftW / 2, y: ctxY, size: 17 },
    slots: row(5, slot, 10, leftW / 2, boardTop + slot / 2), center: leftW / 2,
    ...belowBoard(boardTop + slot),
    tray: { x: leftW, y: top, w: trayW, h: trayH, radius: 16 },
    trayTitle: { x: trayCx, y: titleTrayY },
    options: [{ x: trayCx - opt / 2 - 12, y: optY }, { x: trayCx + opt / 2 + 12, y: optY }],
    end: [
      { id: 'again', x: trayCx - 84, y: optY - 56, w: 168, h: 48 },
      { id: 'exit', x: trayCx - 84, y: optY + 8, w: 168, h: 48 },
    ],
  };
}

export function computeLayout(w, h) {
  if (w > h && h < 500) return sideBySide(w, h);
  return stacked(w, h, w >= 600);
}
