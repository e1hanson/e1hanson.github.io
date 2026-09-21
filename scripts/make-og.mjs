// Генерирует public/og.png (1200×630) — плитка Фибоначчи со спиралью на графитовом фоне.
// Запуск: node scripts/make-og.mjs. Текста на картинке нет намеренно: системные шрифты сборщика непредсказуемы.
import sharp from 'sharp';

const W = 1200;
const H = 630;
const unit = 60; // плитка 13×8 → 780×480
const ox = (W - 13 * unit) / 2;
const oy = (H - 8 * unit) / 2;
const gap = 8;

const tiles = [
  [9, 5, 1],
  [8, 5, 1],
  [8, 6, 2],
  [10, 5, 3],
  [8, 0, 5],
  [0, 0, 8],
];

const rects = tiles
  .map(([x, y, s]) => {
    const size = s * unit - gap;
    const px = ox + x * unit + gap / 2;
    const py = oy + y * unit + gap / 2;
    const r = size * 0.13;
    return `
    <rect x="${px + 5}" y="${py + 5}" width="${size}" height="${size}" rx="${r}" fill="#000" opacity="0.45" filter="url(#blur)"/>
    <rect x="${px - 5}" y="${py - 5}" width="${size}" height="${size}" rx="${r}" fill="#fff" opacity="0.07" filter="url(#blur)"/>
    <rect x="${px}" y="${py}" width="${size}" height="${size}" rx="${r}" fill="#23262b"/>`;
  })
  .join('');

const p = (x, y) => `${ox + x * unit} ${oy + y * unit}`;
const arc = (r, x, y) => `A${r * unit} ${r * unit} 0 0 0 ${p(x, y)}`;
const spiral = `M${p(10, 6)} ${arc(1, 9, 5)} ${arc(1, 8, 6)} ${arc(2, 10, 8)} ${arc(3, 13, 5)} ${arc(5, 8, 0)} ${arc(8, 0, 8)}`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
    <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${ox + 10 * unit}" y1="${oy + 6 * unit}" x2="${ox}" y2="${oy + 8 * unit}">
      <stop offset="0" stop-color="#5cbbff"/>
      <stop offset="1" stop-color="#ff5fba"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#23262b"/>
  ${rects}
  <path d="${spiral}" fill="none" stroke="url(#g)" stroke-width="6" stroke-linecap="round"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('public/og.png готов');
