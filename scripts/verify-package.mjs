import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "dist/index.js",
  "dist/index.d.ts",
  "dist/json-ld.js",
  "dist/metadata.js",
  "README.md",
  "LICENSE",
];

await Promise.all(requiredFiles.map((file) => access(new URL(`../${file}`, import.meta.url))));

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

if (packageJson.private === true) {
  throw new Error("Public packages cannot be marked private.");
}
if (packageJson.publishConfig?.access !== "public") {
  throw new Error("publishConfig.access must be public.");
}
if (packageJson.dependencies?.["@mosaicora/plugin-mosaicora-core"] !== "^1.0.1") {
  throw new Error("The Next.js package must depend on the stable core v1 contract.");
}
if (packageJson.main !== "./dist/index.js" || packageJson.types !== "./dist/index.d.ts") {
  throw new Error("Package entry points must reference the compiled dist output.");
}
