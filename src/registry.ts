import type { CoverGenerator } from "./types";

const generators = new Map<string, CoverGenerator>();

export function registerGenerator(generator: CoverGenerator) {
  generators.set(generator.id, generator);
}

export function unregisterGenerator(id: string) {
  return generators.delete(id);
}

export function getGenerator(id: string) {
  return generators.get(id);
}

export function listGenerators() {
  return Array.from(generators.keys());
}

