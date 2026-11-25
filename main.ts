// One Line, One Laugh: Roast Your Fridge
// Entry: a single line roasting the entrant's fridge. Gate (RULES.txt):
// /output/entry.txt must be UTF-8 text of 1-200 characters, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My fridge has a 'freshness zone' — bold claim from an appliance that thinks ketchup is a vegetable and calls a shriveled lime 'citrus-adjacent.'";

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  fail(`entry must be 1-${MAX_CHARS} characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
// Real guard improvement: reject control characters and any leading or
// trailing whitespace (both would be invisible junk in a one-line roast),
// and verify the written file reads back byte-identical to the line.
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  fail("entry must not have leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
const back = readFileSync(outPath, "utf8");
if (back !== LINE + "\n") {
  fail("read-back check failed: file on disk does not match the entry line");
}
console.log(`wrote ${outPath} (${LINE.length} chars)`);
