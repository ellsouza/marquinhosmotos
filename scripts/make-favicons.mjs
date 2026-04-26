import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

function sample(src, x, y) {
  const w = src.width;
  const h = src.height;
  const clampedX = Math.max(0, Math.min(w - 1, x));
  const clampedY = Math.max(0, Math.min(h - 1, y));
  const idx = (w * clampedY + clampedX) << 2;
  return [
    src.data[idx],
    src.data[idx + 1],
    src.data[idx + 2],
    src.data[idx + 3],
  ];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function bilinearResize(src, dstW, dstH) {
  const dst = new PNG({ width: dstW, height: dstH });
  const xScale = src.width / dstW;
  const yScale = src.height / dstH;

  for (let y = 0; y < dstH; y++) {
    const srcY = (y + 0.5) * yScale - 0.5;
    const y0 = Math.floor(srcY);
    const y1 = y0 + 1;
    const ty = srcY - y0;
    for (let x = 0; x < dstW; x++) {
      const srcX = (x + 0.5) * xScale - 0.5;
      const x0 = Math.floor(srcX);
      const x1 = x0 + 1;
      const tx = srcX - x0;

      const p00 = sample(src, x0, y0);
      const p10 = sample(src, x1, y0);
      const p01 = sample(src, x0, y1);
      const p11 = sample(src, x1, y1);

      const r0 = lerp(p00[0], p10[0], tx);
      const g0 = lerp(p00[1], p10[1], tx);
      const b0 = lerp(p00[2], p10[2], tx);
      const a0 = lerp(p00[3], p10[3], tx);

      const r1 = lerp(p01[0], p11[0], tx);
      const g1 = lerp(p01[1], p11[1], tx);
      const b1 = lerp(p01[2], p11[2], tx);
      const a1 = lerp(p01[3], p11[3], tx);

      const r = lerp(r0, r1, ty);
      const g = lerp(g0, g1, ty);
      const b = lerp(b0, b1, ty);
      const a = lerp(a0, a1, ty);

      const idx = (dstW * y + x) << 2;
      dst.data[idx] = Math.round(r);
      dst.data[idx + 1] = Math.round(g);
      dst.data[idx + 2] = Math.round(b);
      dst.data[idx + 3] = Math.round(a);
    }
  }

  return dst;
}

function pasteCentered(dst, src, padTop = 0) {
  const offsetX = Math.floor((dst.width - src.width) / 2);
  const offsetY = Math.floor((dst.height - src.height) / 2) + padTop;

  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const dstX = x + offsetX;
      const dstY = y + offsetY;
      if (dstX < 0 || dstX >= dst.width || dstY < 0 || dstY >= dst.height)
        continue;
      const srcIdx = (src.width * y + x) << 2;
      const dstIdx = (dst.width * dstY + dstX) << 2;
      dst.data[dstIdx] = src.data[srcIdx];
      dst.data[dstIdx + 1] = src.data[srcIdx + 1];
      dst.data[dstIdx + 2] = src.data[srcIdx + 2];
      dst.data[dstIdx + 3] = src.data[srcIdx + 3];
    }
  }
}

const repoRoot = process.cwd();
const inputPath =
  process.argv[2] ??
  path.join(repoRoot, "public", "img", "logo-cutout.png");
const outDir = path.join(repoRoot, "public", "img");

const logo = PNG.sync.read(fs.readFileSync(inputPath));

const sizes = [32, 192, 512];
for (const size of sizes) {
  const canvas = new PNG({ width: size, height: size });
  const padding = Math.round(size * 0.14);
  const maxW = size - padding * 2;
  const maxH = size - padding * 2;
  const scale = Math.min(maxW / logo.width, maxH / logo.height);
  const w = Math.max(1, Math.round(logo.width * scale));
  const h = Math.max(1, Math.round(logo.height * scale));

  const resized = bilinearResize(logo, w, h);
  pasteCentered(canvas, resized, 0);
  const outPath = path.join(outDir, `favicon-${size}.png`);
  fs.writeFileSync(outPath, PNG.sync.write(canvas, { colorType: 6 }));
  console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
}

