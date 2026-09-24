import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const partsDir = join(root, "src", "lib", "aleph", "final-founder-image");
const output = join(root, "public", "images", "dr-wany-founder-4k.avif");

const chunks = [];
for (let index = 0; index <= 7; index += 1) {
  chunks.push(readFileSync(join(partsDir, `part${index}.b64`), "utf8").trim());
}

const image = Buffer.from(chunks.join(""), "base64");
if (image.length !== 65754 || !image.subarray(4, 12).toString("ascii").includes("ftyp")) {
  throw new Error(`Founder image did not decode correctly (${image.length} bytes)`);
}

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, image);
console.log(`Prepared final Dr. Wany portrait (${image.length} bytes)`);
