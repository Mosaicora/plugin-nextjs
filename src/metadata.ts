import type { Metadata } from "next";
import {
  buildOgImageUrl,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  type OgImageUrlOptions,
} from "@mosaicora/plugin-mosaicora-core";

export type CreateMosaicoraMetadataOptions = OgImageUrlOptions & {
  alt?: string;
};

export function getMosaicoraOgImageUrl(options: OgImageUrlOptions): string {
  return buildOgImageUrl(options);
}

export function createMosaicoraMetadata(
  options: CreateMosaicoraMetadataOptions,
): Partial<Metadata> {
  const imageUrl = getMosaicoraOgImageUrl(options);

  return {
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          type: OG_IMAGE_TYPE,
          alt: options.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  };
}
