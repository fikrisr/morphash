import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

type LandscapeTheme = {
  skyTop: string;
  skyBottom: string;
  sunMoon: string;
  isNight: boolean;
  m1: string;
  m2: string;
  f1: string;
  tree: string;
};

const themes: LandscapeTheme[] = [
  {
    skyTop: "#4facfe",
    skyBottom: "#00f2fe",
    sunMoon: "#fff7aa",
    isNight: false,
    m1: "#5c7c99",
    m2: "#3b5c77",
    f1: "#1d3e53",
    tree: "#0e2330",
  },
  {
    skyTop: "#35155D",
    skyBottom: "#E55604",
    sunMoon: "#FFCC70",
    isNight: false,
    m1: "#6C225F",
    m2: "#4B154B",
    f1: "#2B0B30",
    tree: "#160519",
  },
  {
    skyTop: "#050518",
    skyBottom: "#1f1c47",
    sunMoon: "#e0e7ff",
    isNight: true,
    m1: "#1b1b3a",
    m2: "#14142b",
    f1: "#0b0b18",
    tree: "#05050c",
  },
];

export class LandscapeGenerator implements CoverGenerator {
  readonly id = "landscape";

  generate(context: GenerateContext) {
    const { animated, animationDuration, height, instanceId, quality, random, width } = context;
    const theme = themes[Math.floor(random() * themes.length)] ?? themes[0];
    const skyGradientId = `${instanceId}-sky`;
    const sunX = width * (0.2 + random() * 0.6);
    const sunY = height * (0.2 + random() * 0.3);
    const sunR = Math.floor(25 + random() * 25);
    const stars = theme.isNight
      ? buildStars({ animated, animationDuration, height, quality, random, width })
      : "";
    const clouds = !theme.isNight
      ? buildClouds({ animated, animationDuration, height, random, width })
      : "";
    const backMountains = buildRidge({
      amp: 80,
      baseY: height * 0.48,
      height,
      pointsCount: 8,
      random,
      width,
    });
    const midMountains = buildRidge({
      amp: 70,
      baseY: height * 0.62,
      height,
      pointsCount: 7,
      random,
      width,
    });
    const frontHills = buildHill({
      baseY: height * 0.78,
      cpOffset: 90,
      height,
      random,
      width,
    });
    const trees = buildTrees({ height, quality, random, theme, width });

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <linearGradient id="${skyGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${theme.skyTop}" />
      <stop offset="100%" stop-color="${theme.skyBottom}" />
    </linearGradient>
    ${animated ? buildAnimationStyles(width, animationDuration) : ""}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${skyGradientId})" />
  ${stars}
  <circle cx="${toFixed(sunX)}" cy="${toFixed(sunY)}" r="${sunR}" fill="${theme.sunMoon}"${animated ? ' class="celestial"' : ""} />
  ${clouds}
  <path d="${backMountains}" fill="${theme.m1}" opacity="0.85" />
  <path d="${midMountains}" fill="${theme.m2}" />
  <path d="${frontHills}" fill="${theme.f1}" />
  ${trees}
</svg>`;
  }
}

function buildRidge({
  amp,
  baseY,
  height,
  pointsCount,
  random,
  width,
}: {
  amp: number;
  baseY: number;
  height: number;
  pointsCount: number;
  random: RandomSource;
  width: number;
}) {
  let d = `M 0 ${height} L 0 ${toFixed(baseY)}`;
  const step = width / pointsCount;

  for (let index = 1; index <= pointsCount; index += 1) {
    const x = index * step;
    const y = baseY + (random() - 0.5) * amp;
    d += ` L ${toFixed(x)} ${toFixed(y)}`;
  }

  return `${d} L ${width} ${height} Z`;
}

function buildHill({
  baseY,
  cpOffset,
  height,
  random,
  width,
}: {
  baseY: number;
  cpOffset: number;
  height: number;
  random: RandomSource;
  width: number;
}) {
  const cpX = width * (0.3 + random() * 0.4);
  const cpY = baseY - cpOffset;
  const endY = baseY + (random() - 0.5) * 40;

  return `M 0 ${height} L 0 ${toFixed(baseY)} Q ${toFixed(cpX)} ${toFixed(cpY)} ${width} ${toFixed(endY)} L ${width} ${height} Z`;
}

function buildStars({
  animated,
  animationDuration,
  height,
  quality,
  random,
  width,
}: {
  animated: boolean;
  animationDuration: number;
  height: number;
  quality: GenerateContext["quality"];
  random: RandomSource;
  width: number;
}) {
  const starCount = scaleCount(35 + Math.floor(random() * 20), quality);
  const stars: string[] = [];

  for (let index = 0; index < starCount; index += 1) {
    const sx = random() * width;
    const sy = random() * (height * 0.55);
    const sr = random() * 1.5 + 0.5;
    const duration = animationDuration * (0.7 + random() * 0.6);
    const delay = random() * animationDuration;

    stars.push(
      `<circle cx="${toFixed(sx)}" cy="${toFixed(sy)}" r="${toFixed(sr)}" fill="#ffffff"${animated ? ` class="twinkle" style="animation-duration:${toFixed(duration)}s; animation-delay:${toFixed(delay)}s;"` : ' opacity="0.72"'} />`,
    );
  }

  return stars.join("");
}

function buildClouds({
  animated,
  animationDuration,
  height,
  random,
  width,
}: {
  animated: boolean;
  animationDuration: number;
  height: number;
  random: RandomSource;
  width: number;
}) {
  const cloudCount = 2 + Math.floor(random() * 2);
  const clouds: string[] = [];

  for (let index = 0; index < cloudCount; index += 1) {
    const cx = animated ? 0 : width * (0.08 + random() * 0.82);
    const cy = height * (0.12 + random() * 0.25);
    const duration = animationDuration * (5 + random() * 3);
    const delay = index * animationDuration * -1.8;
    const animationProps = animated
      ? ` class="drift-cloud" style="animation-duration:${toFixed(duration)}s; animation-delay:${toFixed(delay)}s;"`
      : "";

    clouds.push(`<g${animationProps} opacity="0.38" fill="#ffffff" transform="translate(${toFixed(cx)} 0)">
    <ellipse cx="40" cy="${toFixed(cy)}" rx="40" ry="14" />
    <ellipse cx="70" cy="${toFixed(cy - 7)}" rx="28" ry="17" />
    <ellipse cx="100" cy="${toFixed(cy)}" rx="35" ry="13" />
  </g>`);
  }

  return clouds.join("");
}

function buildTrees({
  height,
  quality,
  random,
  theme,
  width,
}: {
  height: number;
  quality: GenerateContext["quality"];
  random: RandomSource;
  theme: LandscapeTheme;
  width: number;
}) {
  const treeCount = scaleCount(6 + Math.floor(random() * 6), quality);
  const trees: string[] = [];

  for (let index = 0; index < treeCount; index += 1) {
    const tx = width * (0.05 + random() * 0.9);
    const ty = height * 0.8 + random() * (height * 0.15);
    const tw = Math.floor(12 + random() * 12);
    const th = Math.floor(tw * 2.2);

    trees.push(
      `<polygon points="${toFixed(tx)},${toFixed(ty - th)} ${toFixed(tx - tw / 2)},${toFixed(ty)} ${toFixed(tx + tw / 2)},${toFixed(ty)}" fill="${theme.tree}" />`,
    );
  }

  return trees.join("");
}

function buildAnimationStyles(width: number, animationDuration: number) {
  return `<style>
      @keyframes twinkleAnim {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      .twinkle {
        animation: twinkleAnim infinite ease-in-out;
        transform-origin: center;
      }
      @keyframes cloudDrift {
        from { transform: translateX(-160px); }
        to { transform: translateX(${width + 160}px); }
      }
      .drift-cloud {
        animation: cloudDrift infinite linear;
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.88; }
        50% { opacity: 1; }
      }
      .celestial {
        animation: pulseGlow ${toFixed(animationDuration)}s infinite ease-in-out;
      }
    </style>`;
}
