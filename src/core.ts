import { hashString } from "./hash";
import { createPrng } from "./prng";
import { getGenerator } from "./registry";
import type { CoverGenerator, MorphashOptions, MorphashQuality } from "./types";

export const defaultWidth = 1200;
export const defaultHeight = 630;
export const defaultGenerator = "random";
export const defaultAnimationDuration = 5;
export const defaultQuality: MorphashQuality = "medium";
export const randomGenerator = "random";
export const maxDimension = 4096;
export const maxAnimationDuration = 120;

export const defaultGeneratorPool = [
  "blueprint",
  "circuit-board",
  "coastal-sunset",
  "cyberpunk",
  "deep-ocean",
  "deep-space",
  "desert-dunes",
  "floating-islands",
  "landscape",
  "pixel-dungeon",
  "solar-orbit",
  "torii-bamboo",
] as const;

export function morphash(input: string, options: MorphashOptions = {}) {
  const normalizedInput = normalizeInput(input);
  const seed = options.seed ?? hashString(normalizedInput);
  const requestedGeneratorId = options.generator ?? defaultGenerator;
  const { generator, generatorId } = resolveGenerator(requestedGeneratorId, seed);

  return generator.generate({
    animated: options.animated ?? false,
    animationDuration: normalizeAnimationDuration(options.animationDuration),
    height: normalizeDimension(options.height, defaultHeight),
    input: normalizedInput,
    instanceId: createInstanceId(seed, generatorId),
    quality: normalizeQuality(options.quality),
    random: createPrng(seed),
    seed,
    width: normalizeDimension(options.width, defaultWidth),
  });
}

function resolveGenerator(requestedGeneratorId: string, seed: number) {
  if (requestedGeneratorId !== randomGenerator) {
    const generator = getGenerator(requestedGeneratorId);

    if (generator) {
      return { generator, generatorId: requestedGeneratorId };
    }
  }

  return resolveRandomGenerator(seed);
}

function resolveRandomGenerator(seed: number): {
  generator: CoverGenerator;
  generatorId: string;
} {
  const generatorIds = defaultGeneratorPool;

  for (let offset = 0; offset < generatorIds.length; offset += 1) {
    const generatorId = generatorIds[(seed + offset) % generatorIds.length];

    if (!generatorId) {
      continue;
    }

    const generator = getGenerator(generatorId);

    if (generator) {
      return { generator, generatorId };
    }
  }

  throw new Error("Morphash cannot render because no generators are registered.");
}

function normalizeAnimationDuration(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return defaultAnimationDuration;
  }

  return clamp(value, 0.1, maxAnimationDuration);
}

function normalizeInput(input: string) {
  return input.trim().toLowerCase() || "untitled";
}

function normalizeDimension(value: number | undefined, fallback: number) {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }

  return clamp(Math.floor(value), 1, maxDimension);
}

function normalizeQuality(value: MorphashQuality | undefined) {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return defaultQuality;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createInstanceId(seed: number, generatorId: string) {
  return `morphash-${generatorId}-${seed.toString(36)}`;
}
