import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const partsDir = join(root, "src", "lib", "aleph", "final-founder-image");
const output = join(root, "public", "images", "dr-wany-founder-final.webp");

const partNames = [
  "part0.b64",
  "part1.b64",
  "part2.b64",
  "part3.b64",
  "part4a.b64",
  "part4b.b64",
  "part5a.b64",
  "part5b.b64",
  "part6.b64",
  "part7.b64",
];

const encoded = partNames
  .map((name) => readFileSync(join(partsDir, name), "utf8").trim())
  .join("");

const image = Buffer.from(encoded, "base64");

if (
  image.length !== 87242 ||
  image.subarray(0, 4).toString("ascii") !== "RIFF" ||
  image.subarray(8, 12).toString("ascii") !== "WEBP"
) {
  throw new Error(`Founder image did not decode correctly (${image.length} bytes)`);
}

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, image);
console.log("Prepared final Dr. Wany portrait (1254x1254 WebP, 87242 bytes)");
