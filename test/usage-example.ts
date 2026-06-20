import type { Metadata } from "next";

import {
  createMosaicoraMetadata,
  MosaicoraOgJsonLd,
  type MosaicoraOgOverride,
  type OgImageUrlOptions,
} from "../src/index.ts";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Example page",
    ...createMosaicoraMetadata({
      siteId: "site-123",
      canonicalHref: "https://example.com/products/view?sku=123",
      fallbackHref: "https://example.com/products/view?sku=123",
    }),
  };
}

export default function ExamplePage() {
  return MosaicoraOgJsonLd({
    schemaType: "WebPage",
    name: "Example page",
    url: "https://example.com/products/view?sku=123",
    mosaicoraOg: {
      schemaVersion: 3,
      semanticValues: {
        "content.title": "Example page",
        "content.description": "A professional example preview.",
        "content.url": "https://example.com/products/view?sku=123",
      },
    },
  });
}

const legacyOverride: MosaicoraOgOverride = {
  schemaVersion: 3,
  semanticValues: {
    // @ts-expect-error Legacy flat fields are not supported by v3.
    title: "Legacy title",
  },
};

const unknownRole: MosaicoraOgOverride = {
  schemaVersion: 3,
  semanticValues: {
    // @ts-expect-error Unknown semantic roles are rejected.
    "content.unknown": "Unknown",
  },
};

const incorrectValue: MosaicoraOgOverride = {
  schemaVersion: 3,
  semanticValues: {
    // @ts-expect-error product.features requires a string array.
    "product.features": "Fast",
  },
};

const imageOptions: OgImageUrlOptions = {
  siteId: "site-123",
  fallbackHref: "https://example.com/?sku=123",
  // @ts-expect-error Query allow-listing was removed in v1.
  allowList: ["sku"],
};

void [legacyOverride, unknownRole, incorrectValue, imageOptions];
