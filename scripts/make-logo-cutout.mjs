import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

function colorDistanceSq(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function getPixel(png, x, y) {
  const idx = (png.width * y + x) << 2;
  return [
    png.data[idx],
    png.data[idx + 1],
    png.data[idx + 2],
    png.data[idx + 3],
  ];
}

function setAlpha(png, x, y, a) {
  const idx = (png.width * y + x) << 2;
  png.data[idx + 3] = a;
}

function floodFillBackgroundToTransparent(png, thresholdSq) {
  const w = png.width;
  const h = png.height;
  const visited = new Uint8Array(w * h);

  const bg = getPixel(png, 0, 0);
  const bgRgb = [bg[0], bg[1], bg[2]];

  const qx = new Int32Array(w * h);
  const qy = new Int32Array(w * h);
  let qh = 0;
  let qt = 0;

  function push(x, y) {
    const i = y * w + x;
    if (visited[i]) return;
    visited[i] = 1;
    qx[qt] = x;
    qy[qt] = y;
    qt++;
  }

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  while (qh < qt) {
    const x = qx[qh];
    const y = qy[qh];
    qh++;

    const p = getPixel(png, x, y);
    const d = colorDistanceSq([p[0], p[1], p[2]], bgRgb);
    if (d > thresholdSq) continue;
    setAlpha(png, x, y, 0);

    if (x > 0) push(x - 1, y);
    if (x + 1 < w) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y + 1 < h) push(x, y + 1);
  }
}

function cropToOpaque(png) {
  const w = png.width;
  const h = png.height;
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (w * y + x) << 2;
      const a = png.data[idx + 3];
      if (a === 0) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < minX || maxY < minY) return png;

  const outW = maxX - minX + 1;
  const outH = maxY - minY + 1;
  const out = new PNG({ width: outW, height: outH });
  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      const srcIdx = (w * (y + minY) + (x + minX)) << 2;
      const dstIdx = (outW * y + x) << 2;
      out.data[dstIdx] = png.data[srcIdx];
      out.data[dstIdx + 1] = png.data[srcIdx + 1];
      out.data[dstIdx + 2] = png.data[srcIdx + 2];
      out.data[dstIdx + 3] = png.data[srcIdx + 3];
    }
  }
  return out;
}

const repoRoot = process.cwd();
const inputPath =
  process.argv[2] ?? path.join(repoRoot, "public", "img", "logo.png");
const outputPath =
  process.argv[3] ?? path.join(repoRoot, "public", "img", "logo-cutout.png");

const raw = fs.readFileSync(inputPath);
const png = PNG.sync.read(raw);

// Works for black/near-black solid backgrounds. Flood-fill only the border-connected background
// so internal black logo shapes remain intact.
floodFillBackgroundToTransparent(png, 38 * 38);
const cropped = cropToOpaque(png);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, PNG.sync.write(cropped, { colorType: 6 }));

console.log(`Wrote ${path.relative(repoRoot, outputPath)}`);

