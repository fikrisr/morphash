import type { MorphashQuality } from "./types";

export function svgToDataUri(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function toFixed(value: number) {
  return value.toFixed(1);
}

export function qualityScale(quality: MorphashQuality) {
  if (quality === "low") {
    return 0.62;
  }

  if (quality === "high") {
    return 1.35;
  }

  return 1;
}

export function scaleCount(base: number, quality: MorphashQuality) {
  return Math.max(1, Math.round(base * qualityScale(quality)));
}
