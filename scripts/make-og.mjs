// Builds public/og.jpg (1200x630, the KakaoTalk preview card) from a source photo.
// Run: node scripts/make-og.mjs [source]   (default source: src/assets/photos/hero.jpg)
// The whole photo is fitted inside the card (nothing cropped off the face) over a blurred,
// slightly darkened copy of itself as the background.
import path from 'node:path';
import sharp from 'sharp';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const JPEG_QUALITY = 84;
const BACKDROP_BLUR = 40;
const BACKDROP_BRIGHTNESS = 0.8;

const source = path.resolve(process.argv[2] ?? 'src/assets/photos/hero.jpg');
const target = path.resolve('public/og.jpg');

const oriented = await sharp(source).rotate().toBuffer();

const backdrop = await sharp(oriented)
  .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover' })
  .blur(BACKDROP_BLUR)
  .modulate({ brightness: BACKDROP_BRIGHTNESS })
  .toBuffer();

const foreground = await sharp(oriented).resize(OG_WIDTH, OG_HEIGHT, { fit: 'inside' }).toBuffer();

const info = await sharp(backdrop)
  .composite([{ input: foreground, gravity: 'centre' }])
  .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
  .toFile(target);

console.log(
  `wrote ${path.relative(process.cwd(), target)} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB) from ${path.relative(process.cwd(), source)}`,
);
