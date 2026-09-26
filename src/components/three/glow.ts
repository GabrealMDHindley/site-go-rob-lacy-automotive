import * as THREE from "three";

/** Canvas-generated radial glow sprite, shared by every 3D scene on the site. */
export function makeGlowTexture(hex: string, hard = true): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const color = new THREE.Color(hex);
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const rg = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, `rgba(${r},${g},${b},1)`);
  rg.addColorStop(hard ? 0.55 : 0.35, `rgba(${r},${g},${b},.4)`);
  rg.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}
