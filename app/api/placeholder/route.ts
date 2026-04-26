import { NextRequest } from "next/server";

function escapeXml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function clamp(input: string, max: number) {
  const s = input.trim();
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = clamp(searchParams.get("title") ?? "Produto", 40);
  const subtitle = clamp(searchParams.get("subtitle") ?? "Marquinhos Motos", 48);
  const price = clamp(searchParams.get("price") ?? "", 24);

  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const safePrice = escapeXml(price);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-label="${safeTitle}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0f19"/>
      <stop offset="55%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M 72 0 L 0 0 0 72" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>
    </pattern>
  </defs>

  <rect width="1200" height="1200" fill="url(#bg)"/>
  <rect width="1200" height="1200" fill="url(#grid)"/>

  <g filter="url(#shadow)">
    <rect x="96" y="128" width="1008" height="944" rx="48" fill="#0b1220" fill-opacity="0.72" stroke="#ffffff" stroke-opacity="0.10"/>
    <rect x="96" y="128" width="1008" height="14" rx="7" fill="url(#accent)"/>
  </g>

  <g font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="#ffffff">
    <text x="156" y="340" font-size="56" font-weight="700" opacity="0.95">${safeTitle}</text>
    <text x="156" y="410" font-size="30" font-weight="500" opacity="0.72">${safeSubtitle}</text>
    ${
      safePrice
        ? `<text x="156" y="508" font-size="44" font-weight="700" opacity="0.92">${safePrice}</text>`
        : ""
    }
  </g>

  <g>
    <circle cx="980" cy="360" r="150" fill="#f59e0b" fill-opacity="0.12"/>
    <circle cx="1015" cy="340" r="92" fill="#fbbf24" fill-opacity="0.16"/>
    <path d="M860 630 C 970 540, 1140 600, 1100 770 C 1060 940, 900 960, 820 860 C 740 760, 780 680, 860 630 Z" fill="#ffffff" fill-opacity="0.06"/>
  </g>

  <g>
    <text x="156" y="1010" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" font-size="22" fill="#ffffff" opacity="0.55">
      Foto ilustrativa — substitua pela foto do Instagram
    </text>
  </g>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}

