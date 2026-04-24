import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const outPath = "public/models/pastoral-terrain.obj";
mkdirSync(dirname(outPath), { recursive: true });

const size = 4.8;
const segments = 76;
const baseY = -1.2;

const vertices = [];
const lines = [];

function addVertex(x, y, z) {
  vertices.push([x, y, z]);
  lines.push(`v ${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)}`);
  return vertices.length;
}

function terrainHeight(x, z) {
  const broad = 0.46 * Math.exp(-((x * x + z * z) / 18));
  const ridge = 0.23 * Math.sin(x * 1.15) * Math.cos(z * 0.92);
  const eastHill = 0.26 * Math.exp(-(((x - 1.55) ** 2) + ((z + 1.35) ** 2)) / 1.8);
  const westHill = 0.2 * Math.exp(-(((x + 1.85) ** 2) + ((z - 1.4) ** 2)) / 2.4);
  const saddle = -0.11 * Math.exp(-(((x + 0.25) ** 2) + ((z + 0.2) ** 2)) / 0.75);
  return broad + ridge + eastHill + westHill + saddle;
}

const topIdx = Array.from({ length: segments + 1 }, () => Array(segments + 1).fill(0));
const bottomIdx = Array.from({ length: segments + 1 }, () => Array(segments + 1).fill(0));

for (let zi = 0; zi <= segments; zi++) {
  const z = -size + (zi / segments) * size * 2;
  for (let xi = 0; xi <= segments; xi++) {
    const x = -size + (xi / segments) * size * 2;
    const y = terrainHeight(x, z);
    topIdx[zi][xi] = addVertex(x, y, z);
    bottomIdx[zi][xi] = addVertex(x, baseY, z);
  }
}

lines.push("", "g terrain_top", "s 1");
for (let zi = 0; zi < segments; zi++) {
  for (let xi = 0; xi < segments; xi++) {
    const a = topIdx[zi][xi];
    const b = topIdx[zi][xi + 1];
    const c = topIdx[zi + 1][xi + 1];
    const d = topIdx[zi + 1][xi];
    lines.push(`f ${a} ${b} ${c}`);
    lines.push(`f ${a} ${c} ${d}`);
  }
}

lines.push("", "g terrain_bottom", "s off");
for (let zi = 0; zi < segments; zi++) {
  for (let xi = 0; xi < segments; xi++) {
    const a = bottomIdx[zi][xi];
    const b = bottomIdx[zi + 1][xi];
    const c = bottomIdx[zi + 1][xi + 1];
    const d = bottomIdx[zi][xi + 1];
    lines.push(`f ${a} ${b} ${c}`);
    lines.push(`f ${a} ${c} ${d}`);
  }
}

function wallFace(topA, topB, botA, botB) {
  lines.push(`f ${topA} ${topB} ${botB}`);
  lines.push(`f ${topA} ${botB} ${botA}`);
}

lines.push("", "g terrain_walls", "s off");

for (let xi = 0; xi < segments; xi++) {
  wallFace(topIdx[0][xi], topIdx[0][xi + 1], bottomIdx[0][xi], bottomIdx[0][xi + 1]);
  wallFace(topIdx[segments][xi + 1], topIdx[segments][xi], bottomIdx[segments][xi + 1], bottomIdx[segments][xi]);
}

for (let zi = 0; zi < segments; zi++) {
  wallFace(topIdx[zi + 1][0], topIdx[zi][0], bottomIdx[zi + 1][0], bottomIdx[zi][0]);
  wallFace(topIdx[zi][segments], topIdx[zi + 1][segments], bottomIdx[zi][segments], bottomIdx[zi + 1][segments]);
}

writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${outPath} with ${vertices.length} vertices`);
