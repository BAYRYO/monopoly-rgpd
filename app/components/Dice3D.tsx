"use client";

import React from "react";
import { motion } from "motion/react";

interface Dice3DProps {
  value: number; // 1-6
  isRolling: boolean;
}

export function Dice3D({ value, isRolling }: Dice3DProps) {
  const getRotation = (val: number) => {
    switch (val) {
      case 1:
        return { rotateX: 0, rotateY: 0 };
      case 6:
        return { rotateX: 180, rotateY: 0 };
      case 2:
        return { rotateX: -90, rotateY: 0 };
      case 5:
        return { rotateX: 90, rotateY: 0 };
      case 3:
        return { rotateX: 0, rotateY: -90 };
      case 4:
        return { rotateX: 0, rotateY: 90 };
      default:
        return { rotateX: 0, rotateY: 0 };
    }
  };

  const rotation = getRotation(value);

  return (
    <div className="w-32 h-32" style={{ perspective: "1000px" }}>
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={
          isRolling
            ? {
                rotateX: [0, 360, 720],
                rotateY: [0, 720, 1080],
                rotateZ: [0, 180, 360],
              }
            : {
                rotateX: rotation.rotateX,
                rotateY: rotation.rotateY,
                rotateZ: 0,
              }
        }
        transition={
          isRolling
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }
            : {
                type: "spring",
                stiffness: 40,
                damping: 15,
                mass: 1.2,
              }
        }
      >
        {/* Front (1) */}
        <Face translateZ="64px">
          <Dot className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </Face>

        {/* Back (6) */}
        <Face translateZ="-64px" rotateY="180deg">
          <Dot className="top-4 left-4" />
          <Dot className="top-4 right-4" />
          <Dot className="top-1/2 left-4 -translate-y-1/2" />
          <Dot className="top-1/2 right-4 -translate-y-1/2" />
          <Dot className="bottom-4 left-4" />
          <Dot className="bottom-4 right-4" />
        </Face>

        {/* Right (3) */}
        <Face rotateY="90deg" translateZ="64px">
          <Dot className="top-4 left-4" />
          <Dot className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <Dot className="bottom-4 right-4" />
        </Face>

        {/* Left (4) */}
        <Face rotateY="-90deg" translateZ="64px">
          <Dot className="top-4 left-4" />
          <Dot className="top-4 right-4" />
          <Dot className="bottom-4 left-4" />
          <Dot className="bottom-4 right-4" />
        </Face>

        {/* Top (2) */}
        <Face rotateX="90deg" translateZ="64px">
          <Dot className="top-4 left-4" />
          <Dot className="bottom-4 right-4" />
        </Face>

        {/* Bottom (5) */}
        <Face rotateX="-90deg" translateZ="64px">
          <Dot className="top-4 left-4" />
          <Dot className="top-4 right-4" />
          <Dot className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <Dot className="bottom-4 left-4" />
          <Dot className="bottom-4 right-4" />
        </Face>
      </motion.div>
    </div>
  );
}

function Face({
  children,
  translateZ = "0",
  rotateX = "0",
  rotateY = "0",
  rotateZ = "0",
  className = "",
}: any) {
  return (
    <div
      className={`absolute w-32 h-32 bg-white border-2 border-slate-300 rounded-2xl shadow-inner flex items-center justify-center ${className}`}
      style={{
        transform: `rotateX(${rotateX}) rotateY(${rotateY}) rotateZ(${rotateZ}) translateZ(${translateZ})`,
        backfaceVisibility: "hidden", // Hidden backface for performance, faces should not be transparent
        backgroundColor: "white", // Ensure solid background
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-200 flex items-center justify-center relative">
        {children}
      </div>
    </div>
  );
}

function Dot({ className = "" }: { className?: string }) {
  const isAbs =
    className.includes("top") ||
    className.includes("bottom") ||
    className.includes("left") ||
    className.includes("right");
  return (
    <div
      className={`w-6 h-6 rounded-full bg-slate-800 shadow-[inset_1px_1px_4px_rgba(0,0,0,0.6)] ${
        isAbs ? "absolute" : ""
      } ${className}`}
    />
  );
}
