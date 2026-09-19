import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

type NeonPalette = {
  backgroundTop: string;
  backgroundBottom: string;
  moon: string;
  grid: string;
  primary: string;
  secondary: string;
  building: string;
};

const palettes: NeonPalette[] = [
  {
    backgroundTop: "#07051f",
    backgroundBottom: "#1b0f3f",
    moon: "#23f0ff",
    grid: "#ff2bd6",
    primary: "#23f0ff",
    secondary: "#ff2bd6",
    building: "#090a16",
  },
  {
    backgroundTop: "#03121f",
    backgroundBottom: "#111343",
    moon: "#ffd166",
    grid: "#00f5d4",
    primary: "#00f5d4",
    secondary: "#f15bb5",
    building: "#06101a",
  },
  {
    backgroundTop: "#0d0221",
    backgroundBottom: "#240046",
    moon: "#e0aaff",
    grid: "#5aeeff",
    primary: "#ff4d6d",
    secondary: "#5aeeff",
    building: "#090112",
  },
];

export class CyberpunkGenerator implements CoverGenerator {
  readonly id = "cyberpunk";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, instanceId, quality, random, width } = context;
    const palette = palettes[Math.floor(random() * palettes.length)] ?? palettes[0];
    const skyId = `${instanceId}-cyber-sky`;
    const glowId = `${instanceId}-cyber-glow`;
    const moonX = width * (0.2 + random() * 0.6);
    const moonY = height * (0.18 + random() * 0.18);
    const moonR = Math.floor(height * (0.12 + random() * 0.08));

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <linearGradient id="${skyId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.backgroundTop}" />
      <stop offset="100%" stop-color="${palette.backgroundBottom}" />
    </linearGradient>
    <filter id="${glowId}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    ${animated ? buildAnimationStyles(animationDuration) : ""}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${skyId})" />
  <circle cx="${toFixed(moonX)}" cy="${toFixed(moonY)}" r="${moonR}" fill="${palette.moon}" opacity="0.82" filter="url(#${glowId})" />
  ${buildGrid({ height, palette, random, width })}
  ${buildBuildings({ animated, height, palette, quality, random, width })}
</svg>`;
  }
}

function buildGrid({
  height,
  palette,
  random,
  width,
}: {
  height: number;
  palette: NeonPalette;
  random: RandomSource;
  width: number;
}) {
  const horizon = height * 0.56;
  const vanishingX = width * (0.45 + random() * 0.1);
  const lines: string[] = [];

  for (let index = -8; index <= 8; index += 1) {
    const x = width / 2 + index * (width * 0.08);
    lines.push(`<line x1="${toFixed(vanishingX)}" y1="${toFixed(horizon)}" x2="${toFixed(x)}" y2="${height}" stroke="${palette.grid}" stroke-width="1.2" opacity="0.5" />`);
  }

  for (let index = 0; index < 12; index += 1) {
    const progress = index / 11;
    const y = horizon + Math.pow(progress, 1.8) * (height - horizon);
    lines.push(`<line x1="0" y1="${toFixed(y)}" x2="${width}" y2="${toFixed(y)}" stroke="${palette.grid}" stroke-width="${toFixed(0.8 + progress * 2)}" opacity="${toFixed(0.18 + progress * 0.32)}" />`);
  }

  return `<g>${lines.join("")}</g>`;
}

function buildBuildings({
  animated,
  height,
  palette,
  quality,
  random,
  width,
}: {
  animated: boolean;
  height: number;
  palette: NeonPalette;
  quality: GenerateContext["quality"];
  random: RandomSource;
  width: number;
}) {
  const count = scaleCount(14 + Math.floor(random() * 8), quality);
  const baseY = height * 0.78;
  const buildingWidth = width / count;
  const buildings: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const x = index * buildingWidth;
    const w = buildingWidth * (0.72 + random() * 0.22);
    const h = height * (0.18 + random() * 0.34);
    const y = baseY - h;
    const accent = random() > 0.5 ? palette.primary : palette.secondary;
    buildings.push(`<g>
      <rect x="${toFixed(x)}" y="${toFixed(y)}" width="${toFixed(w)}" height="${toFixed(h + height * 0.22)}" fill="${palette.building}" stroke="${accent}" stroke-width="1" opacity="0.96" />
      ${buildWindows({ accent, quality, random, x, y, w, h })}
      ${random() > 0.62 ? buildAntenna({ accent, animated, x: x + w / 2, y }) : ""}
    </g>`);
  }

  return `<g>${buildings.join("")}</g>`;
}

function buildWindows({
  accent,
  quality,
  random,
  x,
  y,
  w,
  h,
}: {
  accent: string;
  quality: GenerateContext["quality"];
  random: RandomSource;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const cols = scaleCount(Math.max(2, Math.floor(w / 22)), quality);
  const rows = scaleCount(Math.max(3, Math.floor(h / 26)), quality);
  const windows: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (random() < 0.38) {
        continue;
      }

      windows.push(`<rect x="${toFixed(x + 8 + col * (w - 16) / cols)}" y="${toFixed(y + 12 + row * (h - 20) / rows)}" width="${toFixed(Math.max(3, w / cols * 0.42))}" height="4" fill="${accent}" opacity="${toFixed(0.35 + random() * 0.55)}" />`);
    }
  }

  return windows.join("");
}

function buildAntenna({
  accent,
  animated,
  x,
  y,
}: {
  accent: string;
  animated: boolean;
  x: number;
  y: number;
}) {
  return `<g>
    <line x1="${toFixed(x)}" y1="${toFixed(y)}" x2="${toFixed(x)}" y2="${toFixed(y - 34)}" stroke="${accent}" stroke-width="1.5" />
    <circle cx="${toFixed(x)}" cy="${toFixed(y - 38)}" r="4" fill="#ff304f"${animated ? ' class="morphash-cyber-blink"' : ""} />
  </g>`;
}

function buildAnimationStyles(animationDuration: number) {
  return `<style>
      .morphash-cyber-blink { animation: morphashCyberBlink ${toFixed(animationDuration)}s infinite ease-in-out; }
      @keyframes morphashCyberBlink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
    </style>`;
}
