"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { pointer } from "@/lib/canStore";

const CanScene = dynamic(() => import("./three/CanScene"), { ssr: false });

export default function Experience() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div className="scene-bg" aria-hidden />
      <div className="can-glow" aria-hidden />
      <CanScene />
    </>
  );
}
