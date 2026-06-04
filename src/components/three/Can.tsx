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

export function Can() {
  const group = useRef<THREE.Group>(null);
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null);
  const tintColor = useMemo(() => new THREE.Color(1, 1, 1), []);

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
        color: "#cfd0d4",
        metalness: 1,
        roughness: 0.28,
      }),
    [],
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
    }
  });

  return (
    <group ref={group} rotation={[0.04, 0, 0]}>
      {/* тело с этикеткой */}
      <mesh castShadow>
        <cylinderGeometry args={[R, R, H, 96, 1, true]} />
        <meshStandardMaterial
          ref={bodyMat}
          map={tex}
          roughness={0.5}
          metalness={0.08}
          envMapIntensity={0.7}
        />
      </mesh>

      {/* внутренняя «подложка», чтобы не просвечивало насквозь */}
      <mesh>
        <cylinderGeometry args={[R * 0.985, R * 0.985, H, 48, 1, true]} />
        <meshStandardMaterial color="#efe9da" side={THREE.BackSide} roughness={1} />
      </mesh>

      {/* верхний скос-плечо */}
      <mesh position={[0, H / 2, 0]} material={aluminum}>
        <cylinderGeometry args={[R * 0.86, R, 0.16, 96, 1, true]} />
      </mesh>
      {/* горлышко */}
      <mesh position={[0, H / 2 + 0.1, 0]} material={aluminum}>
        <cylinderGeometry args={[R * 0.84, R * 0.86, 0.06, 96]} />
      </mesh>
      {/* ободок крышки — лежит плашмя (горизонтально), не петлёй */}
      <mesh position={[0, H / 2 + 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]} material={aluminum}>
        <torusGeometry args={[R * 0.83, 0.022, 12, 96]} />
      </mesh>
      <mesh position={[0, H / 2 + 0.135, 0]} rotation={[-Math.PI / 2, 0, 0]} material={aluminum}>
        <circleGeometry args={[R * 0.83, 96]} />
      </mesh>

      {/* нижний скос */}
      <mesh position={[0, -H / 2, 0]} material={aluminum}>
        <cylinderGeometry args={[R, R * 0.84, 0.16, 96, 1, true]} />
      </mesh>
      {/* донце */}
      <mesh position={[0, -H / 2 - 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} material={aluminum}>
        <circleGeometry args={[R * 0.84, 96]} />
      </mesh>
    </group>
  );
}
