import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

const palettes = [
  { skyTop: "#f6bd60", skyBottom: "#f7ede2", sun: "#fff1a8", light: "#e9c46a", mid: "#d98f45", dark: "#9d4e2f", cactus: "#31572c" },
  { skyTop: "#e76f51", skyBottom: "#ffd7a8", sun: "#fff3b0", light: "#f4a261", mid: "#c76d3d", dark: "#7f4f24", cactus: "#283618" },
  { skyTop: "#c08457", skyBottom: "#ffe8c2", sun: "#fff8dc", light: "#f1c27d", mid: "#d08c60", dark: "#8a5a44", cactus: "#344e41" },
];

export class DesertDunesGenerator implements CoverGenerator {
  readonly id = "desert-dunes";

  generate(context: GenerateContext) {
    const { height, instanceId, quality, random, width } = context;
    const palette = palettes[Math.floor(random() * palettes.length)] ?? palettes[0];
    const skyId = `${instanceId}-desert-sky`;
    const sunX = width * (0.18 + random() * 0.58);
    const sunY = height * (0.18 + random() * 0.2);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <linearGradient id="${skyId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.skyTop}" />
      <stop offset="100%" stop-color="${palette.skyBottom}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${skyId})" />
  <circle cx="${toFixed(sunX)}" cy="${toFixed(sunY)}" r="${toFixed(height * 0.12)}" fill="${palette.sun}" opacity="0.92" />
  ${buildDunes({ height, palette, random, width })}
  ${buildCacti({ height, palette, quality, random, width })}
</svg>`;
  }
}

function buildDunes({ height, palette, random, width }: { height: number; palette: (typeof palettes)[number]; random: RandomSource; width: number }) {
  const colors = [palette.light, palette.mid, palette.dark, "#6f3f2e"];
  const dunes: string[] = [];

  for (let index = 0; index < 4; index += 1) {
    const baseY = height * (0.54 + index * 0.105);
    const peakY = baseY - height * (0.08 + random() * 0.08);
    const cp1 = width * (0.18 + random() * 0.18);
    const cp2 = width * (0.6 + random() * 0.24);
    dunes.push(`<path d="M 0 ${height} L 0 ${toFixed(baseY)} C ${toFixed(cp1)} ${toFixed(peakY)} ${toFixed(cp2)} ${toFixed(baseY + height * 0.07)} ${width} ${toFixed(baseY - height * 0.02)} L ${width} ${height} Z" fill="${colors[index]}" />`);
    dunes.push(`<path d="M 0 ${toFixed(baseY)} C ${toFixed(cp1)} ${toFixed(peakY)} ${toFixed(cp2)} ${toFixed(baseY + height * 0.07)} ${width} ${toFixed(baseY - height * 0.02)}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.16" />`);
  }

  return dunes.join("");
}

function buildCacti({ height, palette, quality, random, width }: { height: number; palette: (typeof palettes)[number]; quality: GenerateContext["quality"]; random: RandomSource; width: number }) {
  const cacti: string[] = [];
  const count = scaleCount(3 + Math.floor(random() * 4), quality);

  for (let index = 0; index < count; index += 1) {
    const x = width * (0.08 + random() * 0.84);
    const y = height * (0.72 + random() * 0.18);
    const h = height * (0.08 + random() * 0.08);
    cacti.push(`<g stroke="${palette.cactus}" stroke-width="${toFixed(Math.max(5, width * 0.006))}" stroke-linecap="round" fill="none" opacity="0.94">
      <path d="M ${toFixed(x)} ${toFixed(y)} L ${toFixed(x)} ${toFixed(y - h)}" />
      <path d="M ${toFixed(x)} ${toFixed(y - h * 0.55)} C ${toFixed(x - 24)} ${toFixed(y - h * 0.55)} ${toFixed(x - 24)} ${toFixed(y - h * 0.82)} ${toFixed(x - 24)} ${toFixed(y - h * 0.82)}" />
      <path d="M ${toFixed(x)} ${toFixed(y - h * 0.42)} C ${toFixed(x + 22)} ${toFixed(y - h * 0.42)} ${toFixed(x + 22)} ${toFixed(y - h * 0.68)} ${toFixed(x + 22)} ${toFixed(y - h * 0.68)}" />
    </g>`);
  }

  return cacti.join("");
}
