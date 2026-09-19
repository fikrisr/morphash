import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";

const palettes = [
  ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"],
  ["#1a1c2c", "#5d275d", "#b13e53", "#ef7d57"],
  ["#10141f", "#2d4263", "#c84b31", "#ecdbba"],
];

export class PixelDungeonGenerator implements CoverGenerator {
  readonly id = "pixel-dungeon";

  generate(context: GenerateContext) {
    const { height, random, width } = context;
    const palette = palettes[Math.floor(random() * palettes.length)] ?? palettes[0];
    const cols = 24;
    const rows = 14;
    const cellW = width / cols;
    const cellH = height / rows;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" shape-rendering="crispEdges">
  <rect width="${width}" height="${height}" fill="${palette[0]}" />
  ${buildPixels({ cellH, cellW, cols, palette, random, rows })}
  ${buildCastle({ cellH, cellW, cols, palette, rows })}
  ${buildSword({ cellH, cellW, palette })}
</svg>`;
  }
}

function buildPixels({ cellH, cellW, cols, palette, random, rows }: { cellH: number; cellW: number; cols: number; palette: string[]; random: RandomSource; rows: number }) {
  const pixels: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (random() > 0.1) continue;
      pixels.push(`<rect x="${col * cellW}" y="${row * cellH}" width="${cellW}" height="${cellH}" fill="${palette[1 + Math.floor(random() * 3)]}" opacity="0.24" />`);
    }
  }

  return pixels.join("");
}

function buildCastle({ cellH, cellW, cols, palette, rows }: { cellH: number; cellW: number; cols: number; palette: string[]; rows: number }) {
  const baseY = rows - 5;
  const start = Math.floor(cols / 2) - 5;

  return `<g fill="${palette[1]}">
    <rect x="${start * cellW}" y="${baseY * cellH}" width="${10 * cellW}" height="${4 * cellH}" />
    <rect x="${(start + 1) * cellW}" y="${(baseY - 2) * cellH}" width="${2 * cellW}" height="${2 * cellH}" />
    <rect x="${(start + 7) * cellW}" y="${(baseY - 2) * cellH}" width="${2 * cellW}" height="${2 * cellH}" />
    <rect x="${(start + 4) * cellW}" y="${(baseY - 1) * cellH}" width="${2 * cellW}" height="${cellH}" />
    <rect x="${(start + 4) * cellW}" y="${(baseY + 2) * cellH}" width="${2 * cellW}" height="${2 * cellH}" fill="${palette[0]}" />
    <rect x="${(start + 2) * cellW}" y="${(baseY + 1) * cellH}" width="${cellW}" height="${cellH}" fill="${palette[3]}" />
    <rect x="${(start + 7) * cellW}" y="${(baseY + 1) * cellH}" width="${cellW}" height="${cellH}" fill="${palette[3]}" />
  </g>`;
}

function buildSword({ cellH, cellW, palette }: { cellH: number; cellW: number; palette: string[] }) {
  return `<g>
    <rect x="${cellW * 4}" y="${cellH * 8}" width="${cellW}" height="${cellH * 3}" fill="${palette[3]}" />
    <rect x="${cellW * 3}" y="${cellH * 10}" width="${cellW * 3}" height="${cellH}" fill="${palette[2]}" />
    <rect x="${cellW * 4}" y="${cellH * 11}" width="${cellW}" height="${cellH}" fill="${palette[1]}" />
    <rect x="${cellW * 3}" y="${cellH * 12}" width="${cellW * 3}" height="${cellH}" fill="${palette[1]}" />
  </g>`;
}

