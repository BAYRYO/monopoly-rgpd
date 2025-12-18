import React from "react";
import { motion } from "motion/react";

interface PlayerTokenProps {
  tileId: number;
}

// Helper to get grid coordinates based on tile ID for a 40-tile board (11x11 grid)
// 0=Start (bottom-right), then going left to 10 (bottom-left)
// 10-20 up (left side)
// 20-30 right (top side)
// 30-40 down (right side)
// Grid is 11x11.
// 0 is at row 11, col 11 (if 1-indexed) => row 10, col 10 (0-indexed)
// actually traditionally Monopoly GO is Bottom-Right.
// Let's layout:
// Bottom Row: 9 tiles + 2 corners.
// Let's use CSS Grid Area names or just row/col calculations.
// A standard board has 4 sides of 11 spaces (including corners). Total 40 spaces.
// Board Grid 11x11.
// Indices:
// 0 (Go): Row 11, Col 11
// 1-9: Low Row (Right to Left): Row 11, Cols 10 down to 2
// 10 (Jail): Row 11, Col 1
// 11-19: Left Row (Bottom to Top): Row 10 down to 2, Col 1
// 20 (Free Parking): Row 1, Col 1
// 21-29: Top Row (Left to Right): Row 1, Cols 2 to 10
// 30 (Go To Jail): Row 1, Col 11
// 31-39: Right Row (Top to Bottom): Row 2 to 10, Col 11

const getGridPosition = (index: number) => {
  // 0-indexed grid, 0..10
  const GRID_SIZE = 11;
  const max = GRID_SIZE; // 1-based for grid-row/col

  if (index === 0) return { r: max, c: max };
  if (index > 0 && index < 10) return { r: max, c: max - index };
  if (index === 10) return { r: max, c: 1 };

  if (index > 10 && index < 20) return { r: max - (index - 10), c: 1 };
  if (index === 20) return { r: 1, c: 1 };

  if (index > 20 && index < 30) return { r: 1, c: 1 + (index - 20) };
  if (index === 30) return { r: 1, c: max };

  if (index > 30 && index < 40) return { r: 1 + (index - 30), c: max };

  return { r: max, c: max };
};

export function PlayerToken({ tileId }: PlayerTokenProps) {
  const pos = getGridPosition(tileId);

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        gridColumnStart: pos.c,
        gridRowStart: pos.r,
        transform: "translateZ(20px)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{ transformStyle: "preserve-3d" }}
      className="z-50 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white shadow-[0_10px_20px_rgba(0,0,0,0.4)] flex items-center justify-center relative place-self-center pointer-events-none"
    >
      <div className="w-2 h-2 bg-white rounded-full" />
    </motion.div>
  );
}
