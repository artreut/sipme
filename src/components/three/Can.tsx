"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { canTarget, pointer, sceneState } from "@/lib/canStore";

const R = 0.5; // радиус банки
const H = 2.4; // высота тела
/** сдвиг этикетки по окружности, чтобы крупный логотип SIPME смотрел в камеру */
const LABEL_OFFSET = 0.12;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Процедурные карты конденсата: bump (капли «выпуклые») и roughness
 * (капли глянцевые/мокрые, тело — матовое). Рисуем сотни капель
 * разного размера на canvas и заворачиваем по телу банки.
 */
function makeDropletMaps() {
  const size = 1024;
  const draw = (bg: string, beadInner: string, beadOuter: string) => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    // мелкая зернистость матовой поверхности
    const grain = ctx.createImageData(size, size);
    for (let i = 0; i < grain.data.length; i += 4) {
      const v = 118 + (Math.random() * 24 - 12);
      grain.data[i] = grain.data[i + 1] = grain.data[i + 2] = v;
      grain.data[i + 3] = 14;
    }
    ctx.putImageData(grain, 0, 0);
    const N = 1300;
    for (let i = 0; i < N; i++) {
      const r = Math.pow(Math.random(), 2.0) * 22 + 1.6;
      const px = Math.random() * size;
      const py = Math.random() * size;
      const g = ctx.createRadialGradient(px - r * 0.32, py - r * 0.32, 0, px, py, r);
      g.addColorStop(0, beadInner);
      g.addColorStop(0.62, beadInner);
      g.addColorStop(1, beadOuter);
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
  // bump: тело чёрное, капли светлые (выпуклые)
  const bump = draw("#0a0a0a", "#ffffff", "#0a0a0a");
  // roughness: тело матовое (свет.), капли глянцевые (тёмные)
  const rough = draw("#dadada", "#1c1c1c", "#dadada");
  return { bump, rough };
}

export function Can() {
  const group = useRef<THREE.Group>(null);
  const bodyMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const tintColor = useMemo(() => new THREE.Color(1, 1, 1), []);
  const baseCream = useMemo(() => new THREE.Color("#f4ece0"), []);
  const drops = useMemo(() => makeDropletMaps(), []);

  const tex = useTexture("/assets/sticker.png", (t) => {
    const tx = t as THREE.Texture;
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.wrapS = THREE.RepeatWrapping;
    tx.wrapT = THREE.ClampToEdgeWrapping;
    tx.anisotropy = 8;
    tx.center.set(0.5, 0.5);
    tx.offset.x = LABEL_OFFSET;
    tx.needsUpdate = true;
  });

  const aluminum = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4c5c9",
        metalness: 1,
        roughness: 0.4,
      }),
    [],
  );

  // кремовый материал скосов — продолжает этикетку (с тем же конденсатом)
  const creamMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f4ece0",
        roughness: 1,
        metalness: 0,
        bumpMap: drops.bump,
        bumpScale: 0.022,
        roughnessMap: drops.rough,
        clearcoat: 0.5,
        clearcoatRoughness: 0.34,
        envMapIntensity: 1,
      }),
    [drops],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    sceneState.ready = true;

    // плавность кадронезависимая
    const k = 1 - Math.pow(0.0016, delta);

    // вращение — главное «крутится при скролле» + микро-параллакс от курсора
    g.rotation.y = lerp(g.rotation.y, canTarget.rotY, k);
    g.rotation.x = lerp(g.rotation.x, canTarget.rotX + pointer.y * 0.18, k);
    g.rotation.z = lerp(g.rotation.z, -pointer.x * 0.06, k);

    // лёгкая левитация
    const bob = Math.sin(state.clock.elapsedTime * 0.9) * 0.045;

    g.position.x = lerp(g.position.x, canTarget.posX + pointer.x * 0.12, k);
    g.position.y = lerp(g.position.y, canTarget.posY + bob, k);

    const s = lerp(g.scale.x, canTarget.scale, k);
    g.scale.setScalar(s);

    // тон тела (нота вкуса)
    if (bodyMat.current) {
      tintColor.setRGB(canTarget.tint.r, canTarget.tint.g, canTarget.tint.b);
      bodyMat.current.color.lerp(tintColor, k);
      // скосы: база-крем, умноженная на текущий оттенок
      creamMat.color.setRGB(
        baseCream.r * canTarget.tint.r,
        baseCream.g * canTarget.tint.g,
        baseCream.b * canTarget.tint.b,
      );
    }
  });

  return (
    <group ref={group} rotation={[0.04, 0, 0]}>
      {/* тело: этикетка + рельеф конденсата */}
      <mesh castShadow>
        <cylinderGeometry args={[R, R, H, 96, 1, true]} />
        <meshPhysicalMaterial
          ref={bodyMat}
          map={tex}
          bumpMap={drops.bump}
          bumpScale={0.032}
          roughnessMap={drops.rough}
          roughness={1}
          metalness={0.0}
          clearcoat={0.5}
          clearcoatRoughness={0.32}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* внутренняя «подложка», чтобы не просвечивало насквозь */}
      <mesh>
        <cylinderGeometry args={[R * 0.985, R * 0.985, H, 48, 1, true]} />
        <meshStandardMaterial color="#efe9da" side={THREE.BackSide} roughness={1} />
      </mesh>

      {/* ВЕРХ: кремовый скос продолжает этикетку */}
      <mesh position={[0, H / 2 + 0.09, 0]} material={creamMat}>
        <cylinderGeometry args={[R * 0.8, R, 0.18, 96, 1, true]} />
      </mesh>
      {/* тонкий серебристый ободок сверху */}
      <mesh position={[0, H / 2 + 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} material={aluminum}>
        <torusGeometry args={[R * 0.8, 0.016, 14, 96]} />
      </mesh>
      {/* крышка (слегка утоплена) */}
      <mesh position={[0, H / 2 + 0.172, 0]} rotation={[-Math.PI / 2, 0, 0]} material={aluminum}>
        <circleGeometry args={[R * 0.79, 96]} />
      </mesh>

      {/* НИЗ: кремовый скос продолжает этикетку */}
      <mesh position={[0, -H / 2 - 0.09, 0]} material={creamMat}>
        <cylinderGeometry args={[R, R * 0.82, 0.18, 96, 1, true]} />
      </mesh>
      {/* тонкий серебристый ободок снизу */}
      <mesh position={[0, -H / 2 - 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} material={aluminum}>
        <torusGeometry args={[R * 0.82, 0.016, 14, 96]} />
      </mesh>
      {/* донце (утоплено, светлый алюминий) */}
      <mesh position={[0, -H / 2 - 0.172, 0]} rotation={[-Math.PI / 2, 0, 0]} material={aluminum}>
        <circleGeometry args={[R * 0.81, 96]} />
      </mesh>
    </group>
  );
}
