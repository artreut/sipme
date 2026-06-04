"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { canTarget, pointer, sceneState } from "@/lib/canStore";

/** сдвиг этикетки по окружности, чтобы крупный логотип SIPME смотрел в камеру */
const LABEL_OFFSET = 0.38;
const MODEL = "/assets/can.glb";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

useGLTF.preload(MODEL);

/** Процедурный конденсат: bump (выпуклые капли) + roughness (мокрые блики). */
function makeDropletMaps() {
  const size = 1024;
  const draw = (bg: string, inner: string, outer: string) => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1100; i++) {
      const r = Math.pow(Math.random(), 2.1) * 18 + 1.4;
      const px = Math.random() * size;
      const py = Math.random() * size;
      const g = ctx.createRadialGradient(px - r * 0.32, py - r * 0.32, 0, px, py, r);
      g.addColorStop(0, inner);
      g.addColorStop(0.62, inner);
      g.addColorStop(1, outer);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2.6, 4.2);
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = 8;
    return t;
  };
  return { bump: draw("#0a0a0a", "#ffffff", "#0a0a0a"), rough: draw("#dadada", "#1c1c1c", "#dadada") };
}

/**
 * Берём геометрию модели, делим треугольники на «тело» (этикетка) и
 * «крышки» (металл) по нормали грани, и генерим цилиндрическую UV для тела.
 * Возвращаем геометрию с двумя группами: 0 — тело, 1 — металл.
 */
function processGeometry(src: THREE.BufferGeometry) {
  const g = src.index ? src.toNonIndexed() : src.clone();
  const pos = g.attributes.position as THREE.BufferAttribute;
  const nor = (g.attributes.normal as THREE.BufferAttribute) ?? null;
  const triCount = pos.count / 3;

  // ось высоты модели — Z
  let zMin = Infinity;
  let zMax = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    if (z < zMin) zMin = z;
    if (z > zMax) zMax = z;
  }

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const cc = new THREE.Vector3();
  const faceN = new THREE.Vector3();
  // металл = торцы (нормаль вдоль оси) ИЛИ верхние/нижние ободки по высоте,
  // чтобы на скосах не было края этикетки — только жесть
  const TOP = 0.95;
  const BOTTOM = 0.05;
  const span = zMax - zMin;
  const isMetalArr: boolean[] = [];
  for (let t = 0; t < triCount; t++) {
    a.fromBufferAttribute(pos, t * 3);
    b.fromBufferAttribute(pos, t * 3 + 1);
    cc.fromBufferAttribute(pos, t * 3 + 2);
    faceN.crossVectors(b.sub(a), cc.sub(a)).normalize();
    // нормированная высота трёх вершин
    const z0 = (pos.getZ(t * 3) - zMin) / span;
    const z1 = (pos.getZ(t * 3 + 1) - zMin) / span;
    const z2 = (pos.getZ(t * 3 + 2) - zMin) / span;
    // металл только если ВСЕ вершины выше TOP (или ниже BOTTOM) — граница
    // ложится ровно по кольцу вершин, без зигзага
    const allTop = z0 > TOP && z1 > TOP && z2 > TOP;
    const allBottom = z0 < BOTTOM && z1 < BOTTOM && z2 < BOTTOM;
    isMetalArr.push(Math.abs(faceN.z) > 0.5 || allTop || allBottom);
  }

  const sideTris: number[] = [];
  const metalTris: number[] = [];
  for (let t = 0; t < triCount; t++) (isMetalArr[t] ? metalTris : sideTris).push(t);
  const order = [...sideTris, ...metalTris];

  const np = new Float32Array(pos.count * 3);
  const nn = new Float32Array(pos.count * 3);
  const nuv = new Float32Array(pos.count * 2);

  let w = 0;
  for (const t of order) {
    // цилиндрическая развёртка: u — угол вокруг оси Z, v — высота
    const us: number[] = [];
    const vs: number[] = [];
    for (let k = 0; k < 3; k++) {
      const si = t * 3 + k;
      us.push(-Math.atan2(pos.getY(si), pos.getX(si)) / (Math.PI * 2) + 0.5);
      vs.push((pos.getZ(si) - zMin) / (zMax - zMin));
    }
    // шов: если треугольник пересекает стык u=0/1 — сдвигаем малые u на +1,
    // чтобы текстура шла непрерывно (геометрия non-indexed, соседи не страдают)
    if (Math.max(...us) - Math.min(...us) > 0.5) {
      for (let k = 0; k < 3; k++) if (us[k] < 0.5) us[k] += 1;
    }
    for (let k = 0; k < 3; k++) {
      const si = t * 3 + k;
      np[w * 3] = pos.getX(si);
      np[w * 3 + 1] = pos.getY(si);
      np[w * 3 + 2] = pos.getZ(si);
      if (nor) {
        nn[w * 3] = nor.getX(si);
        nn[w * 3 + 1] = nor.getY(si);
        nn[w * 3 + 2] = nor.getZ(si);
      }
      nuv[w * 2] = us[k];
      nuv[w * 2 + 1] = vs[k];
      w++;
    }
  }

  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(np, 3));
  if (nor) out.setAttribute("normal", new THREE.BufferAttribute(nn, 3));
  out.setAttribute("uv", new THREE.BufferAttribute(nuv, 2));
  out.addGroup(0, sideTris.length * 3, 0); // тело — этикетка
  out.addGroup(sideTris.length * 3, metalTris.length * 3, 1); // ободки/торцы — металл
  if (!nor) out.computeVertexNormals();
  return out;
}

export function Can() {
  const group = useRef<THREE.Group>(null);
  const bodyMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const tintColor = useMemo(() => new THREE.Color(1, 1, 1), []);
  const drops = useMemo(() => makeDropletMaps(), []);

  const gltf = useGLTF(MODEL);
  const geo = useMemo(() => {
    let g: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && !g) g = (o as THREE.Mesh).geometry as THREE.BufferGeometry;
    });
    return g ? processGeometry(g) : null;
  }, [gltf]);

  const tex = useTexture("/assets/label-v2.jpg", (t) => {
    const tx = t as THREE.Texture;
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.wrapS = THREE.RepeatWrapping;
    tx.wrapT = THREE.ClampToEdgeWrapping;
    tx.anisotropy = 8;
    tx.center.set(0.5, 0.5);
    tx.offset.x = LABEL_OFFSET;
    tx.rotation = Math.PI;
    tx.flipY = false;
    tx.needsUpdate = true;
  });

  const aluminum = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e2e3e6", metalness: 0.65, roughness: 0.42, envMapIntensity: 1.2 }),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    sceneState.ready = true;

    const k = 1 - Math.pow(0.0016, delta);
    g.rotation.y = lerp(g.rotation.y, canTarget.rotY, k);
    g.rotation.x = lerp(g.rotation.x, canTarget.rotX + pointer.y * 0.18, k);
    g.rotation.z = lerp(g.rotation.z, canTarget.rotZ - pointer.x * 0.06, k);
    const bob = Math.sin(state.clock.elapsedTime * 0.9) * 0.045;
    g.position.x = lerp(g.position.x, canTarget.posX + pointer.x * canTarget.parallax, k);
    g.position.y = lerp(g.position.y, canTarget.posY + bob - pointer.y * canTarget.parallax * 0.35, k);
    g.scale.setScalar(lerp(g.scale.x, canTarget.scale, k));

    if (bodyMat.current) {
      tintColor.setRGB(canTarget.tint.r, canTarget.tint.g, canTarget.tint.b);
      bodyMat.current.color.lerp(tintColor, k);
    }
  });

  if (!geo) return null;

  return (
    <group ref={group}>
      {/* модель стоит вертикально (ось Z → Y), отцентрована, в наш масштаб */}
      <mesh
        geometry={geo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.3, 0]}
        scale={0.503}
        castShadow
      >
        <meshPhysicalMaterial
          ref={bodyMat}
          attach="material-0"
          map={tex}
          bumpMap={drops.bump}
          bumpScale={0.026}
          roughnessMap={drops.rough}
          roughness={1}
          metalness={0}
          clearcoat={0.5}
          clearcoatRoughness={0.32}
          envMapIntensity={1}
        />
        <primitive object={aluminum} attach="material-1" />
      </mesh>
    </group>
  );
}
