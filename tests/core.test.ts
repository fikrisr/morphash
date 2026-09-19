import { describe, expect, it } from "vitest";
import {
  defaultGeneratorPool,
  listGenerators,
  maxAnimationDuration,
  maxDimension,
  morphash,
} from "../src";

describe("morphash core", () => {
  it("renders deterministically for the same input and options", () => {
    const first = morphash("stable input", {
      animated: true,
      animationDuration: 8,
      generator: "deep-ocean",
      quality: "medium",
    });
    const second = morphash("stable input", {
      animated: true,
      animationDuration: 8,
      generator: "deep-ocean",
      quality: "medium",
    });

    expect(second).toBe(first);
  });

  it("uses deterministic random as the default generator", () => {
    const first = morphash("random default");
    const second = morphash("random default");

    expect(second).toBe(first);
    expect(first).toContain("<svg");
  });

  it("falls back to deterministic random when the requested generator is missing", () => {
    expect(() => {
      morphash("missing generator", {
        generator: "does-not-exist",
      });
    }).not.toThrow();
  });

  it("keeps the default random pool explicit and registered", () => {
    const registered = new Set(listGenerators());

    defaultGeneratorPool.forEach((generatorId) => {
      expect(registered.has(generatorId)).toBe(true);
    });
  });

  it("applies animation duration to animated SVG output", () => {
    const svg = morphash("slow waves", {
      animated: true,
      animationDuration: 9,
      generator: "coastal-sunset",
    });

    expect(svg).toContain("9.0s");
  });

  it("clamps excessive dimensions and animation duration", () => {
    const svg = morphash("clamped", {
      animated: true,
      animationDuration: 999,
      generator: "coastal-sunset",
      height: 99999,
      width: 99999,
    });

    expect(svg).toContain(`width="${maxDimension}"`);
    expect(svg).toContain(`height="${maxDimension}"`);
    expect(svg).toContain(`${maxAnimationDuration.toFixed(1)}s`);
  });

  it("reduces SVG size with low quality", () => {
    const low = morphash("quality check", {
      generator: "deep-ocean",
      quality: "low",
    });
    const high = morphash("quality check", {
      generator: "deep-ocean",
      quality: "high",
    });

    expect(low.length).toBeLessThan(high.length);
  });
});

