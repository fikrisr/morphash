import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

export class ToriiBambooGenerator implements CoverGenerator {
  readonly id = "torii-bamboo";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, quality, random, width } = context;
    const sunX = width * (0.46 + (random() - 0.5) * 0.18);
    const sunY = height * 0.36;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>${animated ? buildAnimationStyles(animationDuration) : ""}</defs>
  <rect width="${width}" height="${height}" fill="#f6eadc" />
  <circle cx="${toFixed(sunX)}" cy="${toFixed(sunY)}" r="${toFixed(height * 0.18)}" fill="#c1121f" opacity="0.9" />
  ${buildBamboo({ height, quality, random, width })}
  ${buildTorii({ height, width })}
  ${buildPetals({ animated, height, quality, random, width })}
</svg>`;
  }
}

function buildBamboo({ height, quality, random, width }: { height: number; quality: GenerateContext["quality"]; random: RandomSource; width: number }) {
  const stalks: string[] = [];

  for (let index = 0; index < scaleCount(18, quality); index += 1) {
    const side = index % 2 === 0 ? 0.08 : 0.82;
    const x = width * (side + random() * 0.12);
    const sw = 5 + random() * 6;
    stalks.push(`<g stroke="#1f3d2b" stroke-width="${toFixed(sw)}" opacity="${toFixed(0.36 + random() * 0.34)}">
      <line x1="${toFixed(x)}" y1="0" x2="${toFixed(x + (random() - 0.5) * 34)}" y2="${height}" />
      ${Array.from({ length: 6 }, (_, n) => `<line x1="${toFixed(x - sw)}" y1="${toFixed(n * height / 6)}" x2="${toFixed(x + sw)}" y2="${toFixed(n * height / 6 + 4)}" />`).join("")}
    </g>`);
  }

  return stalks.join("");
}

function buildTorii({ height, width }: { height: number; width: number }) {
  const cx = width / 2;
  const base = height * 0.78;
  const red = "#9d0208";
  const dark = "#1f1f1f";

  return `<g>
    <rect x="${toFixed(cx - width * 0.22)}" y="${toFixed(base - height * 0.26)}" width="${toFixed(width * 0.44)}" height="${toFixed(height * 0.035)}" fill="${dark}" />
    <rect x="${toFixed(cx - width * 0.27)}" y="${toFixed(base - height * 0.31)}" width="${toFixed(width * 0.54)}" height="${toFixed(height * 0.045)}" fill="${red}" />
    <rect x="${toFixed(cx - width * 0.18)}" y="${toFixed(base - height * 0.21)}" width="${toFixed(width * 0.36)}" height="${toFixed(height * 0.035)}" fill="${red}" />
    <rect x="${toFixed(cx - width * 0.15)}" y="${toFixed(base - height * 0.26)}" width="${toFixed(width * 0.035)}" height="${toFixed(height * 0.31)}" fill="${red}" />
    <rect x="${toFixed(cx + width * 0.115)}" y="${toFixed(base - height * 0.26)}" width="${toFixed(width * 0.035)}" height="${toFixed(height * 0.31)}" fill="${red}" />
    <rect x="${toFixed(cx - width * 0.19)}" y="${toFixed(base)}" width="${toFixed(width * 0.38)}" height="${toFixed(height * 0.04)}" fill="${dark}" opacity="0.85" />
  </g>`;
}

function buildPetals({ animated, height, quality, random, width }: { animated: boolean; height: number; quality: GenerateContext["quality"]; random: RandomSource; width: number }) {
  const petals: string[] = [];

  for (let index = 0; index < scaleCount(22, quality); index += 1) {
    petals.push(`<ellipse cx="${toFixed(random() * width)}" cy="${toFixed(random() * height * 0.62)}" rx="5" ry="2.5" fill="#f4a6b8" opacity="0.76" transform="rotate(${toFixed(random() * 180)})"${animated ? ' class="morphash-petal"' : ""} />`);
  }

  return petals.join("");
}

function buildAnimationStyles(animationDuration: number) {
  return `<style>.morphash-petal { animation: morphashPetal ${toFixed(animationDuration * 1.4)}s infinite ease-in-out alternate; } @keyframes morphashPetal { from { transform: translateX(-12px); } to { transform: translateX(24px); } }</style>`;
}
