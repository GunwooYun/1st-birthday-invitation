// Builds public/og.jpg (1200x630, the KakaoTalk preview card) from a source photo.
// Run: node scripts/make-og.mjs [source]   (default source: src/assets/photos/hero.jpg)
// The photo is center-cropped to 1.91:1; nothing is drawn on top of it.
import path from 'node:path';
import sharp from 'sharp';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const JPEG_QUALITY = 84;

const source = path.resolve(process.argv[2] ?? 'src/assets/photos/hero.jpg');
const target = path.resolve('public/og.jpg');

const info = await sharp(source)
  .rotate() // honor EXIF orientation from phone cameras
  .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
  .toFile(target);

console.log(
  `wrote ${path.relative(process.cwd(), target)} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB) from ${path.relative(process.cwd(), source)}`,
);
