#!/usr/bin/env node
// Check the DESIGN.md this skill writes against the css file it maps onto.
// Usage: node check-design.mjs DESIGN.md <css file>
// Silence and exit 0 is the pass; every finding is one line on stderr.

import { readFileSync } from "node:fs";

const [mdPath, cssPath] = process.argv.slice(2);
if (!mdPath || !cssPath) {
  console.error("usage: check-design.mjs DESIGN.md <css file>");
  process.exit(2);
}
const findings = [];
const md = readFileSync(mdPath, "utf8");
const css = readFileSync(cssPath, "utf8");

// ---- frontmatter: the YAML subset the reference documents (nested maps, inline {} and [], quoted scalars, # comments)
const fm = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!fm) {
  console.error("no frontmatter block");
  process.exit(1);
}
const [, yaml, body] = fm;

function stripComment(s) {
  let out = "", q = null;
  for (const ch of s) {
    if (q) { out += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") q = ch;
    if (ch === "#") break;
    out += ch;
  }
  return out.trimEnd();
}
function scalar(raw) {
  const s = raw.trim();
  if (/^".*"$/.test(s) || /^'.*'$/.test(s)) return s.slice(1, -1);
  if (s.startsWith("[")) return splitInline(s.slice(1, -1)).map(scalar);
  if (s.startsWith("{")) {
    const obj = {};
    for (const part of splitInline(s.slice(1, -1))) {
      const i = part.indexOf(":");
      obj[scalar(part.slice(0, i))] = scalar(part.slice(i + 1));
    }
    return obj;
  }
  return s;
}
function splitInline(s) {
  const parts = []; let depth = 0, q = null, cur = "";
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") q = ch;
    if (ch === "[" || ch === "{") depth++;
    if (ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) { parts.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur);
  return parts;
}
function parseBlock(lines, indent) {
  const obj = {};
  while (lines.length) {
    const line = stripComment(lines[0]);
    if (!line.trim()) { lines.shift(); continue; }
    const ind = line.match(/^ */)[0].length;
    if (ind < indent) break;
    lines.shift();
    const i = line.indexOf(":", ind);
    const key = scalar(line.slice(ind, i));
    const rest = line.slice(i + 1).trim();
    obj[key] = rest ? scalar(rest) : parseBlock(lines, ind + 1);
  }
  return obj;
}
const front = parseBlock(yaml.split("\n"), 0);

// ---- required keys
for (const k of ["source", "colors", "typography", "rounded", "spacing", "components", "shadcnMapping"]) {
  if (!(k in front)) findings.push(`frontmatter: missing "${k}"`);
}

// ---- colours are sampled hexes
const HEX = /^#[0-9a-fA-F]{6}$/;
for (const [name, v] of Object.entries(front.colors ?? {})) {
  if (!HEX.test(v)) findings.push(`colors.${name}: "${v}" is not a 6-digit hex`);
}

// ---- {colors.x} / {rounded.y} references resolve
const walk = (v, path) => {
  if (typeof v === "string") {
    for (const m of v.matchAll(/\{(\w+)\.([\w-]+)\}/g)) {
      if (!(front[m[1]] ?? {})[m[2]]) findings.push(`${path}: reference {${m[1]}.${m[2]}} does not resolve`);
    }
  } else if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
  }
};
walk(front.components ?? {}, "components");

// ---- every :root variable has a light/dark pair
const root = css.match(/^:root\s*\{([\s\S]*?)^\}/m)?.[1] ?? "";
const vars = [...new Set([...root.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1]))];
if (!vars.length) findings.push(`${cssPath}: no :root block with variables`);
const map = front.shadcnMapping ?? {};
for (const v of vars) {
  const pair = map[v];
  if (pair === undefined) { findings.push(`shadcnMapping: missing "${v}"`); continue; }
  if (v === "--radius") continue;
  if (!Array.isArray(pair) || pair.length !== 2 || !pair.every((h) => HEX.test(h))) {
    findings.push(`shadcnMapping."${v}": expected ["#light", "#dark"]`);
  }
}

// ---- body headings
for (const h of ["Overview", "Colour", "Typography", "Shape and depth", "Layout", "Components", "States", "Do / Don't"]) {
  if (!new RegExp(`^#{1,3} ${h.replace(/[/.]/g, "\\$&")}\\s*$`, "m").test(body)) findings.push(`body: missing "## ${h}"`);
}

for (const f of findings) console.error(f);
process.exit(findings.length ? 1 : 0);
