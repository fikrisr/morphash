import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

export class FloatingIslandsGenerator implements CoverGenerator {
  readonly id = "floating-islands";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, quality, random, width } = context;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>${animated ? buildAnimationStyles(animationDuration) : ""}</defs>
  <rect width="${width}" height="${height}" fill="#dbeafe" />
  <circle cx="${toFixed(width * 0.78)}" cy="${toFixed(height * 0.18)}" r="${toFixed(height * 0.1)}" fill="#fef3c7" />
  ${buildClouds({ height, quality, random, width })}
  ${buildIsland({ animated, height, random, width, x: width * 0.28, y: height * 0.42, scale: 1.05 })}
  ${buildIsland({ animated, height, random, width, x: width * 0.62, y: height * 0.34, scale: 0.82 })}
  ${buildIsland({ animated, height, random, width, x: width * 0.74, y: height * 0.58, scale: 0.58 })}
</svg>`;
  }
}

function buildClouds({ height, quality, random, width }: { height: number; quality: GenerateContext["quality"]; random: RandomSource; width: number }) {
  const clouds: string[] = [];

  for (let index = 0; index < scaleCount(8, quality); index += 1) {
    const x = random() * width;
    const y = height * (0.58 + random() * 0.24);
    clouds.push(`<g fill="#ffffff" opacity="0.7">
      <ellipse cx="${toFixed(x)}" cy="${toFixed(y)}" rx="${toFixed(width * 0.06)}" ry="${toFixed(height * 0.025)}" />
      <ellipse cx="${toFixed(x + width * 0.04)}" cy="${toFixed(y - height * 0.016)}" rx="${toFixed(width * 0.04)}" ry="${toFixed(height * 0.03)}" />
      <ellipse cx="${toFixed(x + width * 0.08)}" cy="${toFixed(y)}" rx="${toFixed(width * 0.05)}" ry="${toFixed(height * 0.023)}" />
    </g>`);
  }

  return clouds.join("");
}

function buildIsland({ animated, height, scale, width, x, y }: { animated: boolean; height: number; random: RandomSource; scale: number; width: number; x: number; y: number }) {
  const islandW = width * 0.22 * scale;
  const islandH = height * 0.08 * scale;
  const bottom = y + islandH * 2.6;

  return `<g${animated ? ' class="morphash-floating-island"' : ""}>
    <path d="M ${toFixed(x - islandW / 2)} ${toFixed(y)} C ${toFixed(x - islandW * 0.2)} ${toFixed(y - islandH)} ${toFixed(x + islandW * 0.28)} ${toFixed(y - islandH)} ${toFixed(x + islandW / 2)} ${toFixed(y)} C ${toFixed(x + islandW * 0.22)} ${toFixed(y + islandH * 0.8)} ${toFixed(x - islandW * 0.24)} ${toFixed(y + islandH * 0.85)} ${toFixed(x - islandW / 2)} ${toFixed(y)} Z" fill="#3f6212" />
    <path d="M ${toFixed(x - islandW * 0.42)} ${toFixed(y + islandH * 0.25)} L ${toFixed(x - islandW * 0.16)} ${toFixed(bottom)} L ${toFixed(x + islandW * 0.1)} ${toFixed(y + islandH * 0.42)} L ${toFixed(x + islandW * 0.36)} ${toFixed(bottom - islandH * 0.45)} L ${toFixed(x + islandW * 0.48)} ${toFixed(y + islandH * 0.12)} Z" fill="#854d0e" />
    <rect x="${toFixed(x + islandW * 0.27)}" y="${toFixed(y + islandH * 0.02)}" width="${toFixed(6 * scale)}" height="${toFixed(height * 0.08 * scale)}" fill="#14532d" />
    <circle cx="${toFixed(x + islandW * 0.3)}" cy="${toFixed(y - islandH * 0.1)}" r="${toFixed(height * 0.035 * scale)}" fill="#15803d" />
    <path d="M ${toFixed(x - islandW * 0.2)} ${toFixed(y + islandH * 0.15)} C ${toFixed(x - islandW * 0.18)} ${toFixed(y + islandH)} ${toFixed(x - islandW * 0.17)} ${toFixed(y + islandH * 1.9)} ${toFixed(x - islandW * 0.19)} ${toFixed(y + islandH * 2.5)}" stroke="#38bdf8" stroke-width="${toFixed(4 * scale)}" fill="none" opacity="0.72" />
  </g>`;
}

function buildAnimationStyles(animationDuration: number) {
  return `<style>.morphash-floating-island { animation: morphashFloat ${toFixed(animationDuration)}s infinite ease-in-out alternate; } @keyframes morphashFloat { to { transform: translateY(-10px); } }</style>`;
}
