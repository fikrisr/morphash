import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

type StarNode = {
  x: number;
  y: number;
  r: number;
};

const nebulaColors = ["#7c3aed", "#06b6d4", "#f472b6", "#22c55e"];

export class DeepSpaceGenerator implements CoverGenerator {
  readonly id = "deep-space";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, instanceId, quality, random, width } = context;
    const bgId = `${instanceId}-space-bg`;
    const nebulaId = `${instanceId}-nebula`;
    const planetX = width * (random() > 0.5 ? 0.82 : 0.18);
    const planetY = height * (0.22 + random() * 0.48);
    const planetR = height * (0.055 + random() * 0.055);
    const nodes = buildNodes({ height, quality, random, width });

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <radialGradient id="${bgId}" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#172554" />
      <stop offset="55%" stop-color="#080f2d" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <radialGradient id="${nebulaId}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${pick(nebulaColors, random)}" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    ${animated ? buildAnimationStyles(animationDuration) : ""}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${bgId})" />
  <circle cx="${toFixed(width * (0.2 + random() * 0.6))}" cy="${toFixed(height * (0.1 + random() * 0.35))}" r="${toFixed(height * 0.34)}" fill="url(#${nebulaId})" opacity="0.7" />
  ${buildConstellations(nodes)}
  ${nodes.map((node) => `<circle cx="${toFixed(node.x)}" cy="${toFixed(node.y)}" r="${toFixed(node.r)}" fill="#ffffff" opacity="${toFixed(0.58 + random() * 0.38)}"${animated ? ' class="morphash-space-star"' : ""} />`).join("")}
  ${buildRingPlanet({ planetR, planetX, planetY })}
</svg>`;
  }
}

function buildNodes({
  height,
  quality,
  random,
  width,
}: {
  height: number;
  quality: GenerateContext["quality"];
  random: RandomSource;
  width: number;
}) {
  const count = scaleCount(44 + Math.floor(random() * 34), quality);
  const nodes: StarNode[] = [];

  for (let index = 0; index < count; index += 1) {
    nodes.push({
      x: width * (0.04 + random() * 0.92),
      y: height * (0.06 + random() * 0.78),
      r: 0.8 + random() * 1.5,
    });
  }

  return nodes;
}

function buildConstellations(nodes: StarNode[]) {
  const lines: string[] = [];

  nodes.forEach((node, index) => {
    const nearest = nodes
      .map((candidate, candidateIndex) => ({
        candidate,
        candidateIndex,
        distance: distance(node, candidate),
      }))
      .filter((item) => item.candidateIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    nearest.forEach(({ candidate, distance: lineDistance }) => {
      if (lineDistance < 180) {
        lines.push(`<line x1="${toFixed(node.x)}" y1="${toFixed(node.y)}" x2="${toFixed(candidate.x)}" y2="${toFixed(candidate.y)}" stroke="#93c5fd" stroke-width="0.7" opacity="0.22" />`);
      }
    });
  });

  return `<g>${lines.join("")}</g>`;
}

function buildRingPlanet({
  planetR,
  planetX,
  planetY,
}: {
  planetR: number;
  planetX: number;
  planetY: number;
}) {
  return `<g opacity="0.9">
    <ellipse cx="${toFixed(planetX)}" cy="${toFixed(planetY)}" rx="${toFixed(planetR * 1.75)}" ry="${toFixed(planetR * 0.42)}" fill="none" stroke="#c4b5fd" stroke-width="3" opacity="0.65" transform="rotate(-16 ${toFixed(planetX)} ${toFixed(planetY)})" />
    <circle cx="${toFixed(planetX)}" cy="${toFixed(planetY)}" r="${toFixed(planetR)}" fill="#475569" />
    <path d="M ${toFixed(planetX - planetR)} ${toFixed(planetY)} C ${toFixed(planetX - planetR * 0.3)} ${toFixed(planetY + planetR * 0.2)} ${toFixed(planetX + planetR * 0.5)} ${toFixed(planetY + planetR * 0.05)} ${toFixed(planetX + planetR)} ${toFixed(planetY - planetR * 0.18)}" stroke="#e0e7ff" stroke-width="2" fill="none" opacity="0.4" />
  </g>`;
}

function distance(a: StarNode, b: StarNode) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pick<T>(items: T[], random: RandomSource) {
  return items[Math.floor(random() * items.length)] ?? items[0];
}

function buildAnimationStyles(animationDuration: number) {
  return `<style>
      .morphash-space-star { animation: morphashSpaceTwinkle ${toFixed(animationDuration)}s infinite ease-in-out; transform-origin: center; }
      @keyframes morphashSpaceTwinkle { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
    </style>`;
}
