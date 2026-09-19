export type RandomSource = () => number;

export type MorphashQuality = "low" | "medium" | "high";

export type MorphashOptions = {
  animated?: boolean;
  animationDuration?: number;
  generator?: string;
  height?: number;
  quality?: MorphashQuality;
  seed?: number;
  width?: number;
};

export type GenerateContext = {
  animated: boolean;
  animationDuration: number;
  height: number;
  input: string;
  instanceId: string;
  quality: MorphashQuality;
  random: RandomSource;
  seed: number;
  width: number;
};

export interface CoverGenerator {
  readonly id: string;
  generate(context: GenerateContext): string;
}
