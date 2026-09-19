import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

type CircuitPalette = {
  background: string;
  chip: string;
  pad: string;
  pin: string;
  trace: string;
};

const palettes: CircuitPalette[] = [
  { background: "#063b2f", chip: "#101820", pad: "#f7c948", pin: "#d9e2ec", trace: "#d6b44c" },
  { background: "#06070d", chip: "#101827", pad: "#22d3ee", pin: "#94a3b8", trace: "#38bdf8" },
  { background: "#eef2f7", chip: "#1f2937", pad: "#94a3b8", pin: "#64748b", trace: "#64748b" },
];

export class CircuitBoardGenerator implements CoverGenerator {
  readonly id = "circuit-board";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, instanceId, quality, random, width } = context;
    const palette = palettes[Math.floor(random() * palettes.length)] ?? palettes[0];
    const glowId = `${instanceId}-circuit-glow`;
    const chipW = width * 0.24;
    const chipH = height * 0.34;
    const chipX = width / 2 - chipW / 2;
    const chipY = height / 2 - chipH / 2;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <filter id="${glowId}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    ${animated ? buildAnimationStyles() : ""}
  </defs>
  <rect width="${width}" height="${height}" fill="${palette.background}" />
  ${buildGrid({ height, palette, width })}
  ${buildTraces({ animated, animationDuration, chipH, chipW, chipX, chipY, glowId, height, palette, quality, random, width })}
  ${buildChip({ chipH, chipW, chipX, chipY, palette })}
</svg>`;
  }
}

function buildGrid({ height, palette, width }: { height: number; palette: CircuitPalette; width: number }) {
  const lines: string[] = [];
  const step = 48;

  for (let x = 0; x <= width; x += step) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${palette.trace}" stroke-width="0.5" opacity="0.08" />`);
  }

  for (let y = 0; y <= height; y += step) {
    lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${palette.trace}" stroke-width="0.5" opacity="0.08" />`);
  }

  return `<g>${lines.join("")}</g>`;
}

function buildTraces({
  animated,
  animationDuration,
  chipH,
  chipW,
  chipX,
  chipY,
  glowId,
  height,
  palette,
  quality,
  random,
  width,
}: {
  animated: boolean;
  animationDuration: number;
  chipH: number;
  chipW: number;
  chipX: number;
  chipY: number;
  glowId: string;
  height: number;
  palette: CircuitPalette;
  quality: GenerateContext["quality"];
  random: RandomSource;
  width: number;
}) {
  const paths: string[] = [];
  const traceCount = scaleCount(18 + Math.floor(random() * 12), quality);

  for (let index = 0; index < traceCount; index += 1) {
    const side = Math.floor(random() * 4);
    const start = chipEdgePoint({ chipH, chipW, chipX, chipY, index, side, total: traceCount });
    const end = boardEdgePoint({ height, random, side, width });
    const midX = start.x + (end.x - start.x) * (0.35 + random() * 0.3);
    const midY = start.y + (end.y - start.y) * (0.35 + random() * 0.3);
    const d = `M ${toFixed(start.x)} ${toFixed(start.y)} L ${toFixed(midX)} ${toFixed(start.y)} L ${toFixed(midX)} ${toFixed(midY)} L ${toFixed(end.x)} ${toFixed(midY)} L ${toFixed(end.x)} ${toFixed(end.y)}`;

    paths.push(`<path id="morphash-circuit-trace-${index}" d="${d}" fill="none" stroke="${palette.trace}" stroke-width="${toFixed(1.7 + random() * 1.3)}" opacity="0.72" />`);
    paths.push(`<circle cx="${toFixed(end.x)}" cy="${toFixed(end.y)}" r="${toFixed(3 + random() * 4)}" fill="${palette.pad}" opacity="0.9" />`);

    if (animated && index % 3 === 0) {
      paths.push(`<circle r="4" fill="${palette.pad}" filter="url(#${glowId})" class="morphash-circuit-pulse">
        <animateMotion dur="${toFixed(animationDuration * (0.65 + random() * 0.45))}s" repeatCount="indefinite" path="${d}" />
      </circle>`);
    }
  }

  return `<g>${paths.join("")}</g>`;
}

function buildChip({
  chipH,
  chipW,
  chipX,
  chipY,
  palette,
}: {
  chipH: number;
  chipW: number;
  chipX: number;
  chipY: number;
  palette: CircuitPalette;
}) {
  const pins: string[] = [];
  const pinCount = 9;

  for (let index = 0; index < pinCount; index += 1) {
    const y = chipY + 18 + index * ((chipH - 36) / (pinCount - 1));
    pins.push(`<rect x="${toFixed(chipX - 16)}" y="${toFixed(y - 4)}" width="16" height="8" fill="${palette.pin}" opacity="0.86" />`);
    pins.push(`<rect x="${toFixed(chipX + chipW)}" y="${toFixed(y - 4)}" width="16" height="8" fill="${palette.pin}" opacity="0.86" />`);
  }

  return `<g>
    ${pins.join("")}
    <rect x="${toFixed(chipX)}" y="${toFixed(chipY)}" width="${toFixed(chipW)}" height="${toFixed(chipH)}" rx="10" fill="${palette.chip}" stroke="${palette.pin}" stroke-width="2" />
    <rect x="${toFixed(chipX + chipW * 0.18)}" y="${toFixed(chipY + chipH * 0.22)}" width="${toFixed(chipW * 0.64)}" height="${toFixed(chipH * 0.56)}" rx="6" fill="#000000" opacity="0.22" />
  </g>`;
}

function chipEdgePoint({
  chipH,
  chipW,
  chipX,
  chipY,
  index,
  side,
  total,
}: {
  chipH: number;
  chipW: number;
  chipX: number;
  chipY: number;
  index: number;
  side: number;
  total: number;
}) {
  const progress = (index % Math.ceil(total / 4)) / Math.ceil(total / 4);

  if (side === 0) return { x: chipX + progress * chipW, y: chipY };
  if (side === 1) return { x: chipX + chipW, y: chipY + progress * chipH };
  if (side === 2) return { x: chipX + progress * chipW, y: chipY + chipH };

  return { x: chipX, y: chipY + progress * chipH };
}

function boardEdgePoint({
  height,
  random,
  side,
  width,
}: {
  height: number;
  random: RandomSource;
  side: number;
  width: number;
}) {
  if (side === 0) return { x: width * random(), y: height * 0.05 };
  if (side === 1) return { x: width * 0.95, y: height * random() };
  if (side === 2) return { x: width * random(), y: height * 0.95 };

  return { x: width * 0.05, y: height * random() };
}

function buildAnimationStyles() {
  return `<style>
      .morphash-circuit-pulse { opacity: 0.9; }
    </style>`;
}
