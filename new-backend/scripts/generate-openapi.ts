import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildOpenApiSpec } from "../apps/gateway/src/openapi";

const run = async () => {
  const outputDir = resolve(process.cwd(), "docs");
  const outputFile = resolve(outputDir, "openapi.json");
  const spec = buildOpenApiSpec();

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, JSON.stringify(spec, null, 2), "utf8");

  console.log(`OpenAPI spec written to ${outputFile}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
