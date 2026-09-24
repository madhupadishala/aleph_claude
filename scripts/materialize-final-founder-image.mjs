import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const partsDir = join(root, "src", "lib", "aleph", "final-founder-image");
const output = join(root, "public", "images", "dr-wany-founder-4k.avif");

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
if (image.length !== 65754 || !image.subarray(4, 12).toString("ascii").includes("ftyp")) {
  throw new Error(`Founder image did not decode correctly (${image.length} bytes)`);
}

const ispe = image.indexOf(Buffer.from("ispe"));
if (ispe < 0) {
  throw new Error("Founder image is missing AVIF dimensions");
}
const width = image.readUInt32BE(ispe + 8);
const height = image.readUInt32BE(ispe + 12);
if (width !== 3840 || height !== 3840) {
  throw new Error(`Founder image dimensions are ${width}x${height}, expected 3840x3840`);
}

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, image);
console.log(`Prepared final Dr. Wany portrait (${width}x${height}, ${image.length} bytes)`);
