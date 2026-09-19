import { BlueprintGenerator } from "./generators/blueprint";
import { CircuitBoardGenerator } from "./generators/circuit-board";
import { CoastalSunsetGenerator } from "./generators/coastal-sunset";
import { CyberpunkGenerator } from "./generators/cyberpunk";
import { DeepSpaceGenerator } from "./generators/deep-space";
import { DeepOceanGenerator } from "./generators/deep-ocean";
import { DesertDunesGenerator } from "./generators/desert-dunes";
import { FloatingIslandsGenerator } from "./generators/floating-islands";
import { LandscapeGenerator } from "./generators/landscape";
import { PixelDungeonGenerator } from "./generators/pixel-dungeon";
import { SolarOrbitGenerator } from "./generators/solar-orbit";
import { ToriiBambooGenerator } from "./generators/torii-bamboo";
import { registerGenerator } from "./registry";

registerGenerator(new BlueprintGenerator());
registerGenerator(new CircuitBoardGenerator());
registerGenerator(new CoastalSunsetGenerator());
registerGenerator(new CyberpunkGenerator());
registerGenerator(new DeepSpaceGenerator());
registerGenerator(new DeepOceanGenerator());
registerGenerator(new DesertDunesGenerator());
registerGenerator(new FloatingIslandsGenerator());
registerGenerator(new LandscapeGenerator());
registerGenerator(new PixelDungeonGenerator());
registerGenerator(new SolarOrbitGenerator());
registerGenerator(new ToriiBambooGenerator());

export {
  defaultAnimationDuration,
  defaultGenerator,
  defaultGeneratorPool,
  defaultHeight,
  defaultQuality,
  defaultWidth,
  maxAnimationDuration,
  maxDimension,
  morphash,
  randomGenerator,
} from "./core";
export { hashString } from "./hash";
export { createPrng } from "./prng";
export {
  getGenerator,
  listGenerators,
  registerGenerator,
  unregisterGenerator,
} from "./registry";
export { svgToDataUri } from "./svg";
export { BlueprintGenerator } from "./generators/blueprint";
export { CircuitBoardGenerator } from "./generators/circuit-board";
export { CoastalSunsetGenerator } from "./generators/coastal-sunset";
export { CyberpunkGenerator } from "./generators/cyberpunk";
export { DeepSpaceGenerator } from "./generators/deep-space";
export { DeepOceanGenerator } from "./generators/deep-ocean";
export { DesertDunesGenerator } from "./generators/desert-dunes";
export { FloatingIslandsGenerator } from "./generators/floating-islands";
export { LandscapeGenerator } from "./generators/landscape";
export { PixelDungeonGenerator } from "./generators/pixel-dungeon";
export { SolarOrbitGenerator } from "./generators/solar-orbit";
export { ToriiBambooGenerator } from "./generators/torii-bamboo";
export type {
  CoverGenerator,
  GenerateContext,
  MorphashOptions,
  MorphashQuality,
  RandomSource,
} from "./types";
