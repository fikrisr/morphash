import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { toFixed } from "../../svg";

type SunsetPalette = {
  skyTop: string;
  skyBottom: string;
  sun: string;
  waterTop: string;
  waterBottom: string;
  island: string;
};

const palettes: SunsetPalette[] = [
  { skyTop: "#ff9a3c", skyBottom: "#ffd166", sun: "#fff3b0", waterTop: "#118ab2", waterBottom: "#073b4c", island: "#132a13" },
  { skyTop: "#3a0ca3", skyBottom: "#f72585", sun: "#ffd6ff", waterTop: "#4361ee", waterBottom: "#03045e", island: "#10002b" },
  { skyTop: "#f77f00", skyBottom: "#fcbf49", sun: "#fff8dc", waterTop: "#2a9d8f", waterBottom: "#264653", island: "#1b4332" },
];

export class CoastalSunsetGenerator implements CoverGenerator {
  readonly id = "coastal-sunset";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, instanceId, random, width } = context;
    const palette = palettes[Math.floor(random() * palettes.length)] ?? palettes[0];
    const skyId = `${instanceId}-coastal-sky`;
    const waterId = `${instanceId}-coastal-water`;
    const sunX = width * (0.28 + random() * 0.44);
    const sunY = height * (0.36 + random() * 0.16);
    const horizon = height * 0.58;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <linearGradient id="${skyId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.skyTop}" />
      <stop offset="100%" stop-color="${palette.skyBottom}" />
    </linearGradient>
    <linearGradient id="${waterId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.waterTop}" />
      <stop offset="100%" stop-color="${palette.waterBottom}" />
    </linearGradient>
    ${animated ? buildAnimationStyles(animationDuration) : ""}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${skyId})" />
  <circle cx="${toFixed(sunX)}" cy="${toFixed(sunY)}" r="${toFixed(height * 0.12)}" fill="${palette.sun}" opacity="0.9" />
  <rect y="${toFixed(horizon)}" width="${width}" height="${toFixed(height - horizon)}" fill="url(#${waterId})" />
  ${buildReflections({ height, horizon, palette, sunX, sunY, width })}
  ${buildWaves({ animated, height, horizon, palette, random, width })}
  ${buildIsland({ height, palette, random, width })}
</svg>`;
  }
}

function buildReflections({
  height,
  horizon,
  palette,
  sunX,
  width,
}: {
  height: number;
  horizon: number;
  palette: SunsetPalette;
  sunX: number;
  sunY: number;
  width: number;
}) {
  const lines: string[] = [];

  for (let index = 0; index < 9; index += 1) {
    const y = horizon + 16 + index * (height * 0.035);
    const w = width * (0.1 + index * 0.035);
    lines.push(`<line x1="${toFixed(sunX - w / 2)}" y1="${toFixed(y)}" x2="${toFixed(sunX + w / 2)}" y2="${toFixed(y)}" stroke="${palette.sun}" stroke-width="${toFixed(3 + index * 0.4)}" opacity="${toFixed(0.42 - index * 0.032)}" />`);
  }

  return `<g>${lines.join("")}</g>`;
}

function buildWaves({
  animated,
  height,
  horizon,
  palette,
  random,
  width,
}: {
  animated: boolean;
  height: number;
  horizon: number;
  palette: SunsetPalette;
  random: RandomSource;
  width: number;
}) {
  const waves: string[] = [];

  for (let index = 0; index < 5; index += 1) {
    const y = horizon + height * (0.08 + index * 0.075);
    const amp = 10 + random() * 16;
    const d = buildWavePath({ amp, y, width });
    waves.push(`<path d="${d}" fill="none" stroke="${index % 2 === 0 ? palette.sun : "#ffffff"}" stroke-width="${toFixed(1.4 + index * 0.45)}" opacity="${toFixed(0.2 + index * 0.08)}"${animated ? ' class="morphash-wave-drift"' : ""} />`);
  }

  return `<g>${waves.join("")}</g>`;
}

function buildWavePath({ amp, width, y }: { amp: number; width: number; y: number }) {
  const segments = 8;
  let d = `M 0 ${toFixed(y)}`;

  for (let index = 0; index < segments; index += 1) {
    const x1 = (index + 0.25) * (width / segments);
    const x2 = (index + 0.5) * (width / segments);
    const x3 = (index + 1) * (width / segments);
    d += ` C ${toFixed(x1)} ${toFixed(y - amp)} ${toFixed(x2)} ${toFixed(y + amp)} ${toFixed(x3)} ${toFixed(y)}`;
  }

  return d;
}

function buildIsland({
  height,
  palette,
  random,
  width,
}: {
  height: number;
  palette: SunsetPalette;
  random: RandomSource;
  width: number;
}) {
  const x = random() > 0.5 ? width * 0.18 : width * 0.78;
  const y = height * 0.77;
  const topY = y - 128;

  return `<g color="${palette.island}" fill="${palette.island}">
    <ellipse cx="${toFixed(x)}" cy="${toFixed(y)}" rx="${toFixed(width * 0.11)}" ry="${toFixed(height * 0.035)}" />
    ${buildPalmTrunk({ x, y, topY })}
    ${buildPalmLeaves({ x, y: topY })}
    ${buildCoconuts({ x, y: topY })}
  </g>`;
}

function buildPalmTrunk({
  topY,
  x,
  y,
}: {
  topY: number;
  x: number;
  y: number;
}) {
  const trunk = `<path d="M ${toFixed(x - 6)} ${toFixed(y - 4)} C ${toFixed(x - 9)} ${toFixed(y - 48)} ${toFixed(x - 7)} ${toFixed(y - 88)} ${toFixed(x - 4)} ${toFixed(topY)}
    L ${toFixed(x + 4)} ${toFixed(topY)}
    C ${toFixed(x + 7)} ${toFixed(y - 88)} ${toFixed(x + 9)} ${toFixed(y - 48)} ${toFixed(x + 6)} ${toFixed(y - 4)} Z" fill="currentColor" />`;
  const rings: string[] = [];

  for (let index = 0; index < 7; index += 1) {
    const ringY = y - 22 - index * 15;
    rings.push(`<path d="M ${toFixed(x - 5)} ${toFixed(ringY)} Q ${toFixed(x)} ${toFixed(ringY + 4)} ${toFixed(x + 5)} ${toFixed(ringY)}" stroke="#ffffff" stroke-width="1.4" fill="none" opacity="0.18" />`);
  }

  return `<g>${trunk}${rings.join("")}</g>`;
}

function buildPalmLeaves({ x, y }: { x: number; y: number }) {
  const leaves = [
    buildPalmLeaf({ endX: x - 106, endY: y + 18, lift: -34, rootX: x, rootY: y, width: 13 }),
    buildPalmLeaf({ endX: x - 72, endY: y - 26, lift: -46, rootX: x, rootY: y, width: 12 }),
    buildPalmLeaf({ endX: x - 22, endY: y - 58, lift: -48, rootX: x, rootY: y, width: 10 }),
    buildPalmLeaf({ endX: x + 22, endY: y - 58, lift: -48, rootX: x, rootY: y, width: 10 }),
    buildPalmLeaf({ endX: x + 72, endY: y - 26, lift: -46, rootX: x, rootY: y, width: 12 }),
    buildPalmLeaf({ endX: x + 106, endY: y + 18, lift: -34, rootX: x, rootY: y, width: 13 }),
    buildPalmLeaf({ endX: x - 56, endY: y + 34, lift: -18, rootX: x, rootY: y + 3, width: 11 }),
    buildPalmLeaf({ endX: x + 56, endY: y + 34, lift: -18, rootX: x, rootY: y + 3, width: 11 }),
  ];

  return `<g color="inherit">${leaves.join("")}</g>`;
}

function buildPalmLeaf({
  endX,
  endY,
  lift,
  rootX,
  rootY,
  width,
}: {
  endX: number;
  endY: number;
  lift: number;
  rootX: number;
  rootY: number;
  width: number;
}) {
  const midX = (rootX + endX) / 2;
  const midY = (rootY + endY) / 2 + lift;

  return `<path d="M ${toFixed(rootX)} ${toFixed(rootY)}
    C ${toFixed(midX)} ${toFixed(midY)} ${toFixed(midX)} ${toFixed(midY)} ${toFixed(endX)} ${toFixed(endY)}
    C ${toFixed(midX)} ${toFixed(midY + width)} ${toFixed(midX)} ${toFixed(midY + width)} ${toFixed(rootX)} ${toFixed(rootY + 5)}
    Z" fill="currentColor" opacity="0.98" />`;
}

function buildCoconuts({ x, y }: { x: number; y: number }) {
  return `<g fill="#0b1f12" opacity="0.9">
    <circle cx="${toFixed(x - 9)}" cy="${toFixed(y + 8)}" r="6" />
    <circle cx="${toFixed(x + 5)}" cy="${toFixed(y + 10)}" r="6" />
    <circle cx="${toFixed(x - 1)}" cy="${toFixed(y + 20)}" r="5" />
  </g>`;
}

function buildAnimationStyles(animationDuration: number) {
  return `<style>
      .morphash-wave-drift { animation: morphashWaveDrift ${toFixed(animationDuration)}s infinite ease-in-out alternate; }
      @keyframes morphashWaveDrift { from { transform: translateX(-10px); } to { transform: translateX(10px); } }
    </style>`;
}
