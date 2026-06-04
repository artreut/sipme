"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Lightformer,
} from "@react-three/drei";
import { Can } from "./Can";

export default function CanScene() {
  return (
    <Canvas
      className="can-canvas"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.2], fov: 30 }}
    >
      <AdaptiveDpr pixelated />

      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.35} castShadow />
      <directionalLight position={[-6, 2, -2]} intensity={0.5} color="#ffd8c2" />
      <directionalLight position={[0, -3, 4]} intensity={0.25} color="#ea5b5b" />

      <Suspense fallback={null}>
        <Can />
        <Environment resolution={256}>
          <Lightformer
            intensity={2.2}
            position={[0, 2, 4]}
            scale={[6, 6, 1]}
            color="#fffaf0"
          />
          <Lightformer
            intensity={1.1}
            position={[-4, 0, 2]}
            scale={[3, 6, 1]}
            color="#ffd9c6"
          />
          <Lightformer
            intensity={0.8}
            position={[4, 1, -2]}
            scale={[3, 6, 1]}
            color="#ea5b5b"
          />
          <Lightformer
            intensity={1.6}
            position={[0, 5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[8, 8, 1]}
            color="#ffffff"
          />
        </Environment>
      </Suspense>

      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.32}
        blur={2.8}
        far={4}
        scale={9}
        resolution={512}
        color="#2d0304"
      />
    </Canvas>
  );
}
