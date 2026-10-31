export function validateActivity(value, baseUrl = 'https://local.invalid/activity.json') {
  if (!value || typeof value.theme !== 'string' || !value.theme.trim()) throw new Error('Informe o tema da atividade.');
  if (!Array.isArray(value.images) || value.images.length !== 3) throw new Error('Escolha exatamente três imagens diferentes.');
  const ids = new Set();
  const urls = new Set();
  const base = new URL(baseUrl);
  const images = value.images.map(image => {
    if (!image || typeof image.id !== 'string' || !image.id.trim() || ids.has(image.id.trim()) || typeof image.description !== 'string' || !image.description.trim() || typeof image.url !== 'string' || !image.url.trim()) throw new Error('Cada imagem precisa de identificador único, caminho e descrição.');
    const url = new URL(image.url, base);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== base.origin || url.username || url.password || urls.has(url.href)) throw new Error('Use três arquivos diferentes, servidos junto com o jogo.');
    ids.add(image.id.trim()); urls.add(url.href);
    return Object.freeze({ id: image.id.trim(), url: url.href, description: image.description.trim() });
  });
  return Object.freeze({ theme: value.theme.trim(), images: Object.freeze(images) });
}

export function shuffledDeck(images, random = Math.random) {
  const cards = images.flatMap(image => [0, 1].map(copy => Object.freeze({ ...image, key: `${image.id}-${copy}` })));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return Object.freeze(cards);
}

export class MemoryRound {
  #selected = [];
  #matched = new Set();
  #phase = 'ready';
  #attempts = 0;
  constructor(images, random = Math.random) { this.cards = shuffledDeck(images, random); }
  get state() { return { phase: this.#phase, selected: [...this.#selected], matched: [...this.#matched], pairs: this.#matched.size / 2, attempts: this.#attempts, cards: this.cards }; }
  start() { if (this.#phase !== 'ready') return false; this.#phase = 'playing'; return true; }
  select(index) {
    if (this.#phase !== 'playing' || !Number.isInteger(index) || !this.cards[index] || this.#selected.includes(index) || this.#matched.has(index)) return false;
    this.#selected.push(index);
    if (this.#selected.length === 2) {
      this.#attempts++;
      const [a, b] = this.#selected;
      if (this.cards[a].id === this.cards[b].id) {
        this.#matched.add(a); this.#matched.add(b); this.#selected = [];
        if (this.#matched.size === 6) this.#phase = 'completed';
      } else this.#phase = 'mismatch';
    }
    return true;
  }
  closeMismatch() { if (this.#phase !== 'mismatch') return false; this.#selected = []; this.#phase = 'playing'; return true; }
}

export function cardLayout(width, height) {
  const columns = height > width ? 2 : 3;
  const rows = 6 / columns;
  const gap = width < 400 ? 12 : 16;
  const w = (width - gap * (columns - 1) - 8) / columns;
  const h = (height - gap * (rows - 1) - 8) / rows;
  return Array.from({ length: 6 }, (_, index) => ({ x: 4 + (index % columns) * (w + gap), y: 4 + Math.floor(index / columns) * (h + gap), width: w, height: h }));
}
