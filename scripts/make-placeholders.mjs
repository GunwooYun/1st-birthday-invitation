// Generates pastel placeholder photos until real photos are available.
// Run: node scripts/make-placeholders.mjs
// Output: src/assets/photos/*.jpg and public/og.jpg (overwrites existing files).
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Keep in sync with src/config/invitation.ts (EVENT/VENUE) until a real og.jpg replaces the placeholder.
const OG_SUBTITLE = '2027년 5월 9일 일요일 · 빕스 은평점';
const OUT_DIR = path.resolve('src/assets/photos');
const PUBLIC_DIR = path.resolve('public');
const JPEG_QUALITY = 82;

const PALETTES = [
  ['#FBD5DB', '#FFF1E6'],
  ['#CFE8D8', '#F3FAF4'],
  ['#FFE4C4', '#FFF7EC'],
  ['#D9E4F5', '#F4F7FC'],
  ['#EAD9F2', '#FAF5FC'],
  ['#FBE3C9', '#FFF4E6'],
  ['#D6EEF0', '#F2FAFB'],
  ['#FBD5DB', '#E9F3EC'],
];

function blob(cx, cy, r, fill, opacity) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}"/>`;
}

function placeholderSvg({ width, height, label, sub, palette }) {
  const [from, to] = palette;
  const base = Math.min(width, height);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  ${blob(width * 0.2, height * 0.25, base * 0.22, '#FFFFFF', 0.45)}
  ${blob(width * 0.8, height * 0.3, base * 0.16, '#FFFFFF', 0.35)}
  ${blob(width * 0.5, height * 0.72, base * 0.3, '#FFFFFF', 0.4)}
  ${blob(width * 0.5, height * 0.72, base * 0.19, from, 0.6)}
  <text x="50%" y="${height * 0.5}" text-anchor="middle" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif"
        font-size="${base * 0.09}" fill="#6B5B55" font-weight="700">${label}</text>
  <text x="50%" y="${height * 0.5 + base * 0.11}" text-anchor="middle" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif"
        font-size="${base * 0.045}" fill="#8B7B76">${sub}</text>
</svg>`;
}

async function render(file, spec) {
  const svg = Buffer.from(placeholderSvg(spec));
  await sharp(svg).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(file);
  console.log('wrote', path.relative(process.cwd(), file));
}

const SPECS = [
  { name: 'hero.jpg', width: 1080, height: 1440, label: '소은이 대표 사진', sub: '임시 이미지 · 실제 사진으로 교체' },
  { name: 'timeline-birth.jpg', width: 900, height: 900, label: '탄생', sub: '임시 이미지' },
  { name: 'timeline-100.jpg', width: 900, height: 900, label: '백일', sub: '임시 이미지' },
  { name: 'timeline-first.jpg', width: 900, height: 900, label: '첫돌', sub: '임시 이미지' },
  ...Array.from({ length: 6 }, (_, i) => ({
    name: `gallery-${String(i + 1).padStart(2, '0')}.jpg`,
    width: 900,
    height: i % 3 === 1 ? 900 : 1200,
    label: `갤러리 ${i + 1}`,
    sub: '임시 이미지',
  })),
];

await mkdir(OUT_DIR, { recursive: true });
await Promise.all(
  SPECS.map((spec, i) => render(path.join(OUT_DIR, spec.name), { ...spec, palette: PALETTES[i % PALETTES.length] })),
);
await render(path.join(PUBLIC_DIR, 'og.jpg'), {
  width: 1200,
  height: 630,
  label: '소은이의 첫 번째 생일에 초대합니다',
  sub: OG_SUBTITLE,
  palette: PALETTES[0],
});
await writeFile(path.join(OUT_DIR, '.gitkeep'), '');
