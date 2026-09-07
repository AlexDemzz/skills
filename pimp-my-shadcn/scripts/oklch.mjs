#!/usr/bin/env node
// Convert sRGB hex colours to the oklch() strings shadcn's globals.css expects.
// Usage: node oklch.mjs "#1D1D1D" "#0271E6" ...   or   node oklch.mjs < file-with-one-hex-per-line
// Achromatic colours (chroma < 0.002) print as oklch(L 0 0) so greys stay exact greys.

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function hexToOklch(hex) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(full.slice(i, i + 2), 16) / 255));
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.hypot(a, bb);
  if (C < 0.002) return `oklch(${+L.toFixed(3)} 0 0)`;
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return `oklch(${+L.toFixed(3)} ${+C.toFixed(3)} ${+H.toFixed(1)})`;
}

const args = process.argv.slice(2);
const input = args.length ? args : (await import("node:fs")).readFileSync(0, "utf8").split(/\s+/).filter(Boolean);
for (const hex of input) console.log(`${hex}\t${hexToOklch(hex)}`);
