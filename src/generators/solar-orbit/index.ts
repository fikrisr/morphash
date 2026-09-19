import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { toFixed } from "../../svg";

const planetColors = ["#38bdf8", "#f97316", "#a78bfa", "#84cc16", "#facc15"];

export class SolarOrbitGenerator implements CoverGenerator {
  readonly id = "solar-orbit";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, random, width } = context;
    const cx = width / 2;
    const cy = height / 2;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>${animated ? buildAnimationStyles(animationDuration) : ""}</defs>
  <rect width="${width}" height="${height}" fill="#020617" />
  <circle cx="${toFixed(cx)}" cy="${toFixed(cy)}" r="${toFixed(height * 0.06)}" fill="#facc15" opacity="0.95" />
  ${buildOrbits({ animated, cx, cy, height, random, width })}
</svg>`;
  }
}

function buildOrbits({ animated, cx, cy, height, random, width }: { animated: boolean; cx: number; cy: number; height: number; random: RandomSource; width: number }) {
  const orbitCount = 4;
  const orbits: string[] = [];

  for (let index = 0; index < orbitCount; index += 1) {
    const rx = width * (0.16 + index * 0.09);
    const ry = height * (0.08 + index * 0.055);
    const angle = random() * 360;
    const planetX = cx + Math.cos(angle) * rx;
    const planetY = cy + Math.sin(angle) * ry;
    const color = planetColors[Math.floor(random() * planetColors.length)] ?? planetColors[0];
    const planetR = height * (0.016 + random() * 0.018);

    orbits.push(`<g transform="rotate(${toFixed(-18 + index * 11)} ${toFixed(cx)} ${toFixed(cy)})"${animated ? ` class="morphash-orbit morphash-orbit-${index}"` : ""}>
      <ellipse cx="${toFixed(cx)}" cy="${toFixed(cy)}" rx="${toFixed(rx)}" ry="${toFixed(ry)}" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="6 10" opacity="0.32" />
      <circle cx="${toFixed(planetX)}" cy="${toFixed(planetY)}" r="${toFixed(planetR)}" fill="${color}" />
      ${index === 2 ? `<ellipse cx="${toFixed(planetX)}" cy="${toFixed(planetY)}" rx="${toFixed(planetR * 1.9)}" ry="${toFixed(planetR * 0.45)}" fill="none" stroke="#e2e8f0" stroke-width="2" opacity="0.7" />` : ""}
    </g>`);
  }

  return orbits.join("");
}

function buildAnimationStyles(animationDuration: number) {
  return `<style>
    .morphash-orbit { transform-origin: center; animation: morphashOrbit ${toFixed(animationDuration * 8.8)}s infinite linear; }
    .morphash-orbit-1 { animation-duration: ${toFixed(animationDuration * 11.6)}s; }
    .morphash-orbit-2 { animation-duration: ${toFixed(animationDuration * 14.4)}s; }
    .morphash-orbit-3 { animation-duration: ${toFixed(animationDuration * 17.2)}s; }
    @keyframes morphashOrbit { to { transform: rotate(360deg); } }
  </style>`;
}
