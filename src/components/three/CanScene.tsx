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
      <directionalLight position={[0, -3, 4]} intensity={0.14} color="#ea5b5b" />

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
            intensity={0.45}
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
          {/* узкая яркая полоса спереди — студийный блик + искры на каплях */}
          <Lightformer
            intensity={3.2}
            position={[1.6, 0.4, 3]}
            scale={[0.5, 5, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={1.4}
            position={[-1.8, 0.2, 2.4]}
            scale={[0.35, 4, 1]}
            color="#fff3ea"
          />
        </Environment>
      </Suspense>

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.42}
        blur={2.3}
        far={4.5}
        scale={7.5}
        resolution={1024}
        color="#1a0606"
      />
    </Canvas>
  );
}
