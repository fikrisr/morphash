# Morphash

Deterministic SVG cover generator for articles, docs, and project pages.

Morphash turns a string into a visual cover. The same input always produces the same output, which makes it useful for blog cards, Open Graph images, documentation headers, release notes, and generated placeholders.

## Features

- Pure SVG output
- Deterministic hash-based generation
- Multiple built-in generators
- Default hash-based random generator selection
- Optional SVG animations
- Configurable animation duration
- Extensible generator registry
- Works well for npm and CDN packaging

## Basic Usage

```ts
import { morphash } from "morphash";

const svg = morphash("Scaling backend workers");
```

By default, Morphash uses `generator: "random"`. This is deterministic, not runtime-random. The same input string maps to the same built-in generator as long as the registered generator list stays the same.

## Options

```ts
const svg = morphash("Circuit breaker patterns", {
  generator: "circuit-board",
  width: 1200,
  height: 630,
  quality: "medium",
  animated: true,
  animationDuration: 8,
});
```

Available options:

```ts
type MorphashOptions = {
  animated?: boolean;
  animationDuration?: number;
  generator?: string;
  height?: number;
  quality?: "low" | "medium" | "high";
  seed?: number;
  width?: number;
};
```

- `generator`: generator id. Defaults to `"random"`.
- `width`: SVG width. Defaults to `1200`.
- `height`: SVG height. Defaults to `630`.
- `quality`: controls node density. Defaults to `"medium"`.
- `animated`: enables generator animation when supported.
- `animationDuration`: base animation duration in seconds. Defaults to `5`.
- `seed`: overrides the hash derived from the input string.

If a generator id does not exist, Morphash falls back to deterministic random selection instead of throwing.

## Built-In Generators

- `random`
- `landscape`
- `cyberpunk`
- `deep-space`
- `circuit-board`
- `coastal-sunset`
- `desert-dunes`
- `pixel-dungeon`
- `torii-bamboo`
- `solar-orbit`
- `deep-ocean`
- `blueprint`
- `floating-islands`

## Data URI

```ts
import { morphash, svgToDataUri } from "morphash";

const svg = morphash("Deploy pipeline");
const src = svgToDataUri(svg);
```

## Custom Generator

Morphash is built around a small generator interface.

```ts
import type { CoverGenerator, GenerateContext } from "morphash";
import { registerGenerator } from "morphash";

class MyGenerator implements CoverGenerator {
  readonly id = "my-generator";

  generate(ctx: GenerateContext) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ctx.width} ${ctx.height}">
      <rect width="${ctx.width}" height="${ctx.height}" fill="#111827" />
    </svg>`;
  }
}

registerGenerator(new MyGenerator());
```

Then use it:

```ts
const svg = morphash("Custom cover", {
  generator: "my-generator",
});
```

## Performance Notes

- Use `quality: "low"` when rendering many covers in a list or dashboard.
- Use `quality: "medium"` for normal article cards and Open Graph images.
- Use `quality: "high"` for larger hero images.
- `width`, `height`, and `animationDuration` are clamped internally to prevent accidental oversized SVG output.

## Design Notes

Morphash follows a generator registry architecture:

- Core logic handles input normalization, hash generation, seeded randomness, option defaults, and generator resolution.
- Each visual theme is isolated in its own generator module.
- New themes can be added without modifying existing generator internals.
- The core depends on the `CoverGenerator` interface, not on specific generator implementations.
