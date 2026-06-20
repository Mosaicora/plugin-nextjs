import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  createMosaicoraMetadata,
  getMosaicoraOgImageUrl,
  MosaicoraOgJsonLd,
} from "../src/index.ts";

test("getMosaicoraOgImageUrl preserves and sorts all homepage queries", () => {
  assert.equal(
    getMosaicoraOgImageUrl({
      siteId: "site-123",
      fallbackHref: "https://example.com/?sku=123&page=2&campaign=launch",
    }),
    "https://cdn.mosaicora.io/s/site-123.jpg?campaign=launch&page=2&sku=123",
  );
});

test("getMosaicoraOgImageUrl prefers a nested canonical URL", () => {
  assert.equal(
    getMosaicoraOgImageUrl({
      siteId: "site-123",
      canonicalHref:
        "https://example.com/products/view/?sku=123&page=2&campaign=launch",
      fallbackHref: "https://fallback.example/ignored",
    }),
    "https://cdn.mosaicora.io/s/site-123/products/view.jpg?campaign=launch&page=2&sku=123",
  );
});

test("getMosaicoraOgImageUrl falls back from an invalid canonical URL", () => {
  assert.equal(
    getMosaicoraOgImageUrl({
      siteId: "site-123",
      canonicalHref: "invalid",
      fallbackHref: "https://example.com/fallback?locale=en",
    }),
    "https://cdn.mosaicora.io/s/site-123/fallback.jpg?locale=en",
  );
});

test("createMosaicoraMetadata returns the expected Next metadata shape", () => {
  const metadata = createMosaicoraMetadata({
    siteId: "site-123",
    fallbackHref: "https://example.com/products/view/?sku=123",
    alt: "Professional product preview",
  });

  assert.deepEqual(metadata, {
    openGraph: {
      images: [
        {
          url: "https://cdn.mosaicora.io/s/site-123/products/view.jpg?sku=123",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: "Professional product preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["https://cdn.mosaicora.io/s/site-123/products/view.jpg?sku=123"],
    },
  });
});

test("MosaicoraOgJsonLd renders the v3 contract", () => {
  const html = renderToStaticMarkup(
    MosaicoraOgJsonLd({
      schemaType: "Article",
      name: "How Mosaicora Generates Open Graph Images",
      mosaicoraOg: {
        schemaVersion: 3,
        semanticValues: {
          "content.title": "How Mosaicora Generates Open Graph Images",
          "person.name": "Mosaicora Team",
          "navigation.items": ["Overview", "Documentation"],
          "social.verified": true,
        },
      },
    }),
  );

  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"schemaVersion":3/);
  assert.match(html, /"semanticValues"/);
  assert.match(html, /"content.title"/);
});

test("MosaicoraOgJsonLd safely escapes less-than characters", () => {
  const html = renderToStaticMarkup(
    MosaicoraOgJsonLd({
      schemaType: "WebPage",
      name: "</script><script>alert(1)</script>",
      mosaicoraOg: { schemaVersion: 3, semanticValues: {} },
    }),
  );

  assert.equal(html.includes("<script>alert(1)</script>"), false);
  assert.match(html, /\\u003c\/script>/);
});

test("getMosaicoraOgImageUrl ignores hashes and keeps utf-8 paths readable", () => {
  assert.equal(
    getMosaicoraOgImageUrl({
      siteId: "site-123",
      canonicalHref:
        "https://example.com/%E4%B8%AD%E8%8F%AF%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD?lang=zh#overview",
      fallbackHref: "https://fallback.example/ignored",
    }),
    "https://cdn.mosaicora.io/s/site-123/中華人民共和国.jpg?lang=zh",
  );
});
