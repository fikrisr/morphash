import type { CoverGenerator, GenerateContext, RandomSource } from "../../types";
import { scaleCount, toFixed } from "../../svg";

export class BlueprintGenerator implements CoverGenerator {
  readonly id = "blueprint";

  generate(context: GenerateContext) {
    const { height, quality, random, seed, width } = context;
    const hashLabel = `HASH-0x${seed.toString(16).toUpperCase()}`;
    const gridSize = 18 + Math.floor(random() * 14);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <rect width="${width}" height="${height}" fill="#082f49" />
  ${buildGrid({ height, small: gridSize, width })}
  ${buildWireframe({ height, random, width })}
  ${buildCrosshairs({ height, quality, random, width })}
  <text x="${toFixed(width * 0.06)}" y="${toFixed(height * 0.12)}" fill="#e0f2fe" font-family="monospace" font-size="${toFixed(height * 0.035)}">${hashLabel}</text>
  <text x="${toFixed(width * 0.06)}" y="${toFixed(height * 0.18)}" fill="#bae6fd" font-family="monospace" font-size="${toFixed(height * 0.026)}">RES:${width}x${height}</text>
</svg>`;
  }
}

function buildGrid({
  height,
  small,
  width,
}: {
  height: number;
  small: number;
  width: number;
}) {
  const lines: string[] = [];
  const large = small * 4;

  for (let x = 0; x <= width; x += small) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#e0f2fe" stroke-width="${x % large === 0 ? 1 : 0.4}" opacity="${x % large === 0 ? 0.28 : 0.12}" />`);
  }

  for (let y = 0; y <= height; y += small) {
    lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#e0f2fe" stroke-width="${y % large === 0 ? 1 : 0.4}" opacity="${y % large === 0 ? 0.28 : 0.12}" />`);
  }

  return lines.join("");
}

function buildWireframe({
  height,
  random,
  width,
}: {
  height: number;
  random: RandomSource;
  width: number;
}) {
  const variant = Math.floor(random() * 3);

  if (variant === 1) {
    return buildCylinderWireframe({ height, random, width });
  }

  if (variant === 2) {
    return buildPrismWireframe({ height, random, width });
  }

  return buildBoxWireframe({ height, random, width });
}

function buildBoxWireframe({
  height,
  random,
  width,
}: {
  height: number;
  random: RandomSource;
  width: number;
}) {
  const x = width * (0.38 + random() * 0.18);
  const y = height * (0.22 + random() * 0.16);
  const w = width * (0.2 + random() * 0.14);
  const h = height * (0.2 + random() * 0.18);
  const dx = width * (0.05 + random() * 0.06);
  const dy = height * (0.04 + random() * 0.08);

  return `<g fill="none" stroke="#f8fafc" stroke-width="2" opacity="0.82">
    <rect x="${toFixed(x)}" y="${toFixed(y)}" width="${toFixed(w)}" height="${toFixed(h)}" />
    <rect x="${toFixed(x + dx)}" y="${toFixed(y - dy)}" width="${toFixed(w)}" height="${toFixed(h)}" />
    <line x1="${toFixed(x)}" y1="${toFixed(y)}" x2="${toFixed(x + dx)}" y2="${toFixed(y - dy)}" />
    <line x1="${toFixed(x + w)}" y1="${toFixed(y)}" x2="${toFixed(x + w + dx)}" y2="${toFixed(y - dy)}" />
    <line x1="${toFixed(x)}" y1="${toFixed(y + h)}" x2="${toFixed(x + dx)}" y2="${toFixed(y + h - dy)}" />
    <line x1="${toFixed(x + w)}" y1="${toFixed(y + h)}" x2="${toFixed(x + w + dx)}" y2="${toFixed(y + h - dy)}" />
    ${buildDimensionLines({ h, w, x, y })}
  </g>`;
}

function buildCylinderWireframe({
  height,
  random,
  width,
}: {
  height: number;
  random: RandomSource;
  width: number;
}) {
  const cx = width * (0.34 + random() * 0.34);
  const cy = height * (0.5 + random() * 0.12);
  const rx = width * (0.1 + random() * 0.08);
  const ry = height * (0.045 + random() * 0.035);
  const h = height * (0.24 + random() * 0.18);

  return `<g fill="none" stroke="#f8fafc" stroke-width="2" opacity="0.82">
    <ellipse cx="${toFixed(cx)}" cy="${toFixed(cy - h / 2)}" rx="${toFixed(rx)}" ry="${toFixed(ry)}" />
    <ellipse cx="${toFixed(cx)}" cy="${toFixed(cy + h / 2)}" rx="${toFixed(rx)}" ry="${toFixed(ry)}" />
    <line x1="${toFixed(cx - rx)}" y1="${toFixed(cy - h / 2)}" x2="${toFixed(cx - rx)}" y2="${toFixed(cy + h / 2)}" />
    <line x1="${toFixed(cx + rx)}" y1="${toFixed(cy - h / 2)}" x2="${toFixed(cx + rx)}" y2="${toFixed(cy + h / 2)}" />
    <line x1="${toFixed(cx - rx * 1.35)}" y1="${toFixed(cy)}" x2="${toFixed(cx + rx * 1.35)}" y2="${toFixed(cy)}" stroke-dasharray="8 8" opacity="0.65" />
  </g>`;
}

function buildPrismWireframe({
  height,
  random,
  width,
}: {
  height: number;
  random: RandomSource;
  width: number;
}) {
  const cx = width * (0.42 + random() * 0.22);
  const y = height * (0.24 + random() * 0.16);
  const w = width * (0.22 + random() * 0.14);
  const h = height * (0.28 + random() * 0.18);
  const apexY = y - height * (0.08 + random() * 0.08);

  return `<g fill="none" stroke="#f8fafc" stroke-width="2" opacity="0.82">
    <polygon points="${toFixed(cx)},${toFixed(apexY)} ${toFixed(cx - w / 2)},${toFixed(y + h)} ${toFixed(cx + w / 2)},${toFixed(y + h)}" />
    <polygon points="${toFixed(cx + w * 0.18)},${toFixed(apexY + h * 0.12)} ${toFixed(cx - w * 0.32)},${toFixed(y + h * 0.86)} ${toFixed(cx + w * 0.68)},${toFixed(y + h * 0.86)}" />
    <line x1="${toFixed(cx)}" y1="${toFixed(apexY)}" x2="${toFixed(cx + w * 0.18)}" y2="${toFixed(apexY + h * 0.12)}" />
    <line x1="${toFixed(cx - w / 2)}" y1="${toFixed(y + h)}" x2="${toFixed(cx - w * 0.32)}" y2="${toFixed(y + h * 0.86)}" />
    <line x1="${toFixed(cx + w / 2)}" y1="${toFixed(y + h)}" x2="${toFixed(cx + w * 0.68)}" y2="${toFixed(y + h * 0.86)}" />
  </g>`;
}

function buildDimensionLines({
  h,
  w,
  x,
  y,
}: {
  h: number;
  w: number;
  x: number;
  y: number;
}) {
  return `<g stroke="#bae6fd" stroke-width="1" opacity="0.62">
    <line x1="${toFixed(x)}" y1="${toFixed(y + h + 28)}" x2="${toFixed(x + w)}" y2="${toFixed(y + h + 28)}" />
    <line x1="${toFixed(x)}" y1="${toFixed(y + h + 18)}" x2="${toFixed(x)}" y2="${toFixed(y + h + 38)}" />
    <line x1="${toFixed(x + w)}" y1="${toFixed(y + h + 18)}" x2="${toFixed(x + w)}" y2="${toFixed(y + h + 38)}" />
  </g>`;
}

function buildCrosshairs({
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
  const marks = Array.from({ length: scaleCount(3, quality) }, () => [
    width * (0.12 + random() * 0.76),
    height * (0.22 + random() * 0.62),
    12 + random() * 16,
  ]);

  return marks.map(([x, y, r]) => `<g stroke="#bae6fd" stroke-width="1.4" opacity="0.72">
    <circle cx="${toFixed(x)}" cy="${toFixed(y)}" r="${toFixed(r)}" fill="none" />
    <line x1="${toFixed(x - r * 1.55)}" y1="${toFixed(y)}" x2="${toFixed(x + r * 1.55)}" y2="${toFixed(y)}" />
    <line x1="${toFixed(x)}" y1="${toFixed(y - r * 1.55)}" x2="${toFixed(x)}" y2="${toFixed(y + r * 1.55)}" />
  </g>`).join("");
}
