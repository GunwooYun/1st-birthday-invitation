// Normalizes photos in src/assets/photos before they are committed:
// - bakes EXIF orientation into the pixels (phones store rotated JPEGs)
// - strips all metadata (EXIF, GPS location, thumbnails) — the repo is public
// - downsizes to MAX_EDGE px on the long edge and re-encodes as JPEG
// Run: node scripts/normalize-photos.mjs   (idempotent; already-small files are re-encoded once)
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PHOTO_DIR = path.resolve('src/assets/photos');
const MAX_EDGE = 2000;
const JPEG_QUALITY = 85;
const PHOTO_PATTERN = /\.(jpe?g|png|webp)$/i;

const files = (await readdir(PHOTO_DIR)).filter((name) => PHOTO_PATTERN.test(name)).sort();

for (const name of files) {
  const file = path.join(PHOTO_DIR, name);
  const before = (await stat(file)).size;
  // Read fully first, then overwrite in place (rename over the file can hit EPERM on Windows).
  const source = await readFile(file);
  const { data, info } = await sharp(source)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  await writeFile(file, data);
  console.log(
    `${name.padEnd(22)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)} ${Math.round(before / 1024)}KB → ${Math.round(info.size / 1024)}KB`,
  );
}
