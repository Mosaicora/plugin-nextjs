import { createElement } from "react";
import {
  buildMosaicoraOgJsonLd,
  serializeJsonLd,
  type MosaicoraOgJsonLdOptions,
} from "@mosaicora/plugin-mosaicora-core";

export type MosaicoraOgJsonLdProps = MosaicoraOgJsonLdOptions & {
  id?: string;
};

export function MosaicoraOgJsonLd(props: MosaicoraOgJsonLdProps) {
  const { id, ...jsonLdOptions } = props;
  const json = serializeJsonLd(buildMosaicoraOgJsonLd(jsonLdOptions));

  return createElement("script", {
    id,
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: json },
  });
}
