import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  buildOgImageCacheBuster,
  createMosaicoraMetadata,
  getMosaicoraOgImageUrl,
  MosaicoraOgJsonLd,
  type OgImageCacheBuster,
} from "../src/index.ts";

test("getMosaicoraOgImageUrl encodes and sorts all homepage queries", () => {
  assert.equal(
    getMosaicoraOgImageUrl({
      siteId: "site-123",
      pageHref: "https://example.com/?sku=123&page=2&campaign=launch",
    }),
    "https://cdn.mosaicora.io/s/site-123/%3Fcampaign%3Dlaunch%26page%3D2%26sku%3D123.jpg",
  );
});

test("getMosaicoraOgImageUrl encodes a nested page URL", () => {
  assert.equal(
    getMosaicoraOgImageUrl({
      siteId: "site-123",
      pageHref:
        "https://example.com/products/view/?sku=123&page=2&campaign=launch",
    }),
    "https://cdn.mosaicora.io/s/site-123/products/view%3Fcampaign%3Dlaunch%26page%3D2%26sku%3D123.jpg",
  );
});

test("getMosaicoraOgImageUrl rejects an invalid page URL", () => {
  assert.throws(() =>
    getMosaicoraOgImageUrl({ siteId: "site-123", pageHref: "invalid" }),
  );
});

test("createMosaicoraMetadata returns the expected Next metadata shape", () => {
  const metadata = createMosaicoraMetadata({
    siteId: "site-123",
    pageHref: "https://example.com/products/view/?sku=123",
    alt: "Professional product preview",
  });

  assert.deepEqual(metadata, {
    openGraph: {
      images: [
        {
          url: "https://cdn.mosaicora.io/s/site-123/products/view%3Fsku%3D123.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: "Professional product preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["https://cdn.mosaicora.io/s/site-123/products/view%3Fsku%3D123.jpg"],
    },
  });
});

test("createMosaicoraMetadata shares a cache-busting image URL across platforms", () => {
  const cacheBuster: OgImageCacheBuster = "monthly";
  const metadata = createMosaicoraMetadata({
    siteId: "site-123",
    pageHref: "https://example.com/products/view",
    cacheBuster,
  });
  const openGraphImages = metadata.openGraph?.images;
  const openGraphImage = Array.isArray(openGraphImages)
    ? openGraphImages[0]
    : openGraphImages;
  const openGraphUrl =
    typeof openGraphImage === "string" || openGraphImage instanceof URL
      ? String(openGraphImage)
      : String(openGraphImage?.url);
  const twitterImages = metadata.twitter?.images;
  const twitterImage = Array.isArray(twitterImages)
    ? twitterImages[0]
    : twitterImages;
  const twitterUrl = String(twitterImage);

  assert.match(
    buildOgImageCacheBuster(cacheBuster),
    /^\d{4}-\d{2}$/,
  );
  assert.match(
    openGraphUrl,
    /^https:\/\/cdn\.mosaicora\.io\/s\/site-123\/products\/view\.jpg\?v=\d{4}-\d{2}$/,
  );
  assert.equal(twitterUrl, openGraphUrl);
});

test("createMosaicoraMetadata shares an explicit cache version across platforms", () => {
  const metadata = createMosaicoraMetadata({
    siteId: "site-123",
    pageHref: "https://example.com/products/view?v=legacy",
    cacheBuster: "monthly",
    cacheVersion: "release-42",
  });
  const openGraphImages = metadata.openGraph?.images;
  const openGraphImage = Array.isArray(openGraphImages)
    ? openGraphImages[0]
    : openGraphImages;
  const openGraphUrl =
    typeof openGraphImage === "string" || openGraphImage instanceof URL
      ? String(openGraphImage)
      : String(openGraphImage?.url);
  const twitterImages = metadata.twitter?.images;
  const twitterImage = Array.isArray(twitterImages)
    ? twitterImages[0]
    : twitterImages;

  assert.equal(
    openGraphUrl,
    "https://cdn.mosaicora.io/s/site-123/products/view.jpg?v=release-42",
  );
  assert.equal(String(twitterImage), openGraphUrl);
});

test("MosaicoraOgJsonLd renders the v3 contract", () => {
  const html = renderToStaticMarkup(
    MosaicoraOgJsonLd({
      schemaType: "Article",
      name: "How Mosaicora Generates Open Graph Images",
      mosaicoraOg: {
        schemaVersion: 3,
        templateId: "6a36446a0021410e8044",
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
  assert.match(html, /"templateId":"6a36446a0021410e8044"/);
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
      pageHref:
        "https://example.com/%E4%B8%AD%E8%8F%AF%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD?lang=zh#overview",
    }),
    "https://cdn.mosaicora.io/s/site-123/中華人民共和国%3Flang%3Dzh.jpg",
  );
});
