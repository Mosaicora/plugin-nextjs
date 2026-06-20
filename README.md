# `@mosaicora/plugin-nextjs`

Native Next.js 16 App Router helpers for Mosaicora Open Graph images and typed
`mosaicora:og` JSON-LD v3 overrides.

## Install

```bash
pnpm add @mosaicora/plugin-nextjs
```

The framework-agnostic helpers are also available directly from
[`@mosaicora/plugin-mosaicora-core`](https://github.com/Mosaicora/plugin-mosaicora-core).

## Create Next.js metadata

```ts
import type { Metadata } from "next";
import { createMosaicoraMetadata } from "@mosaicora/plugin-nextjs";

const canonicalUrl = "https://example.com/products/view?sku=123&campaign=launch";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...createMosaicoraMetadata({
      siteId: "321cac22d2103fb1660c50bd",
      canonicalHref: canonicalUrl,
      fallbackHref: canonicalUrl,
      alt: "Professional product preview",
    }),
  };
}
```

The generated image URL preserves every query parameter in deterministic order,
places `.jpg` before the query string, ignores hashes, and keeps UTF-8 paths
readable.

## Render a v3 JSON-LD override

Keep your existing Schema.org fields and add only values that Mosaicora should
use exactly:

```tsx
import { MosaicoraOgJsonLd } from "@mosaicora/plugin-nextjs";

const canonicalUrl = "https://example.com/products/view?sku=123";

export default function ProductJsonLd() {
  return (
    <MosaicoraOgJsonLd
      schemaType="Product"
      name="Example product"
      description="A polished preview for every product page."
      url={canonicalUrl}
      offers={{
        "@type": "Offer",
        price: "49",
        priceCurrency: "USD",
      }}
      mosaicoraOg={{
        schemaVersion: 3,
        semanticValues: {
          "content.title": "Example product",
          "content.description": "A polished preview for every product page.",
          "content.url": canonicalUrl,
          "product.price": "$49",
          "product.features": ["Fast setup", "Consistent previews"],
        },
      }}
    />
  );
}
```

The component serializes JSON-LD safely for an HTML script element. The full
semantic contract is documented in
[Mosaicora OG Overrides v3](https://github.com/Mosaicora/plugin-mosaicora-core/blob/master/docs/mosaicora-og-overrides.md).

## Public API

- `getMosaicoraOgImageUrl`
- `createMosaicoraMetadata`
- `MosaicoraOgJsonLd`

The package also re-exports the core URL and JSON-LD helpers, plus
`MosaicoraOgOverride`, `MosaicoraOgSemanticValues`, role-specific types, and
the other public core types.

## Development

Core `1.0.0` must be available from npm before installing this repository.

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
npm pack --dry-run
```

Releases follow semantic versioning and publish from GitHub Releases to the
public npm registry with trusted publishing and provenance. Publish core before
publishing a Next.js version that depends on it.

## Contributing and security

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request and
[SECURITY.md](./SECURITY.md) before reporting a vulnerability.

Licensed under the [MIT License](./LICENSE).
