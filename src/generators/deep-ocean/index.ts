import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

export class DeepOceanGenerator implements CoverGenerator {
  readonly id = "deep-ocean";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, instanceId, quality, random, width } = context;
    const bgId = `${instanceId}-ocean-bg`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <linearGradient id="${bgId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf" />
      <stop offset="48%" stop-color="#075985" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    ${animated ? buildAnimationStyles(animationDuration) : ""}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${bgId})" />
  ${buildParticles({ animated, height, quality, random, width })}
  ${buildFish({ animated, height, quality, random, width })}
  ${buildJellyfish({ animated, height, quality, random, width })}
  ${buildCoral({ height, quality, random, width })}
</svg>`;
  }
}

function buildParticles({ animated, height, quality, random, width }: { animated: boolean; height: number; quality: GenerateContext["quality"]; random: RandomSource; width: number }) {
  const dots: string[] = [];

  for (let index = 0; index < scaleCount(80, quality); index += 1) {
    dots.push(`<circle cx="${toFixed(random() * width)}" cy="${toFixed(random() * height)}" r="${toFixed(0.8 + random() * 2)}" fill="#a7f3d0" opacity="${toFixed(0.16 + random() * 0.42)}"${animated ? ' class="morphash-marine-snow"' : ""} />`);
  }

  return dots.join("");
}

function buildFish({ animated, height, quality, random, width }: { animated: boolean; height: number; quality: GenerateContext["quality"]; random: RandomSource; width: number }) {
  const fish: string[] = [];
  const count = scaleCount(5 + Math.floor(random() * 5), quality);

  for (let index = 0; index < count; index += 1) {
    const x = width * (0.08 + random() * 0.84);
    const y = height * (0.22 + random() * 0.48);
    const size = height * (0.018 + random() * 0.022);
    const direction = random() > 0.5 ? 1 : -1;
    const color = random() > 0.5 ? "#67e8f9" : "#a7f3d0";

    fish.push(`<g${animated ? ' class="morphash-fish"' : ""}>
      <g transform="translate(${toFixed(x)} ${toFixed(y)}) scale(${direction} 1)" opacity="${toFixed(0.34 + random() * 0.34)}">
        <path d="M ${toFixed(-size * 1.4)} 0 C ${toFixed(-size * 0.7)} ${toFixed(-size * 0.72)} ${toFixed(size * 0.72)} ${toFixed(-size * 0.6)} ${toFixed(size * 1.45)} 0 C ${toFixed(size * 0.72)} ${toFixed(size * 0.6)} ${toFixed(-size * 0.7)} ${toFixed(size * 0.72)} ${toFixed(-size * 1.4)} 0 Z" fill="${color}" />
        <path d="M ${toFixed(-size * 1.36)} 0 L ${toFixed(-size * 2.2)} ${toFixed(-size * 0.72)} L ${toFixed(-size * 2)} 0 L ${toFixed(-size * 2.2)} ${toFixed(size * 0.72)} Z" fill="${color}" />
        <path d="M ${toFixed(size * 0.05)} ${toFixed(-size * 0.34)} L ${toFixed(-size * 0.45)} ${toFixed(-size * 1.05)} L ${toFixed(-size * 0.1)} ${toFixed(-size * 0.18)} Z" fill="#cffafe" opacity="0.5" />
        <circle cx="${toFixed(size * 0.92)}" cy="${toFixed(-size * 0.14)}" r="${toFixed(Math.max(1.2, size * 0.1))}" fill="#042f2e" />
      </g>
    </g>`);
  }

  return fish.join("");
}

function buildJellyfish({ animated, height, quality, random, width }: { animated: boolean; height: number; quality: GenerateContext["quality"]; random: RandomSource; width: number }) {
  const jelly: string[] = [];
  const count = scaleCount(3 + Math.floor(random() * 3), quality);

  for (let index = 0; index < count; index += 1) {
    const x = width * (0.18 + random() * 0.64);
    const y = height * (0.18 + random() * 0.38);
    const r = height * (0.035 + random() * 0.035);
    jelly.push(`<g opacity="0.68"${animated ? ' class="morphash-jelly"' : ""}>
      <path d="M ${toFixed(x - r)} ${toFixed(y)} Q ${toFixed(x)} ${toFixed(y - r * 1.35)} ${toFixed(x + r)} ${toFixed(y)} Q ${toFixed(x)} ${toFixed(y + r * 0.45)} ${toFixed(x - r)} ${toFixed(y)} Z" fill="#bfdbfe" />
      ${Array.from({ length: 5 }, (_, n) => {
        const tx = x - r * 0.65 + n * (r * 0.32);
        return `<path d="M ${toFixed(tx)} ${toFixed(y + r * 0.25)} C ${toFixed(tx - 10)} ${toFixed(y + r)} ${toFixed(tx + 12)} ${toFixed(y + r * 1.7)} ${toFixed(tx)} ${toFixed(y + r * 2.35)}" stroke="#bae6fd" stroke-width="2" fill="none" opacity="0.75" />`;
      }).join("")}
    </g>`);
  }

  return jelly.join("");
}

function buildCoral({ height, quality, random, width }: { height: number; quality: GenerateContext["quality"]; random: RandomSource; width: number }) {
  const coral: string[] = [];

  for (let index = 0; index < scaleCount(18, quality); index += 1) {
    const x = random() * width;
    const h = height * (0.06 + random() * 0.12);
    coral.push(`<path d="M ${toFixed(x)} ${height} C ${toFixed(x - 12)} ${toFixed(height - h * 0.4)} ${toFixed(x + 14)} ${toFixed(height - h * 0.7)} ${toFixed(x)} ${toFixed(height - h)}" stroke="${random() > 0.5 ? "#164e63" : "#155e75"}" stroke-width="${toFixed(4 + random() * 5)}" fill="none" stroke-linecap="round" />`);
  }

  return coral.join("");
}

function buildAnimationStyles(animationDuration: number) {
  return `<style>
    .morphash-marine-snow { animation: morphashMarineSnow ${toFixed(animationDuration * 1.2)}s infinite ease-in-out alternate; }
    .morphash-jelly { animation: morphashJelly ${toFixed(animationDuration)}s infinite ease-in-out alternate; }
    .morphash-fish { animation: morphashFish ${toFixed(animationDuration * 1.4)}s infinite ease-in-out alternate; transform-box: fill-box; transform-origin: center; }
    @keyframes morphashMarineSnow { to { transform: translateY(-10px); } }
    @keyframes morphashJelly { to { transform: translateY(-14px); } }
    @keyframes morphashFish { to { transform: translateX(18px); } }
  </style>`;
}
