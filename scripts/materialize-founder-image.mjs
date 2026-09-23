import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const partsDir = join(root, "src", "lib", "aleph", "founder-image");
const output = join(root, "public", "images", "dr-wany-founder.jpg");

const chunks = [];
for (let index = 0; index <= 5; index += 1) {
  const source = readFileSync(join(partsDir, `part${index}.ts`), "utf8");
  const match = source.match(/^export default "([A-Za-z0-9+/=]+)";\s*$/);
  if (!match) {
    throw new Error(`Invalid founder image data in part${index}.ts`);
  }
  chunks.push(match[1]);
}

const image = Buffer.from(chunks.join(""), "base64");
if (image.length < 50_000 || !image.subarray(4, 12).toString("ascii").includes("ftyp")) {
  throw new Error("Founder image did not decode to a valid AVIF payload");
}

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, image);
console.log(`Prepared high-resolution Dr. Wany portrait (${image.length} bytes)`);
