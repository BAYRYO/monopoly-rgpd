import React, { useState, useRef, useEffect } from "react";
import { Tile } from "./Tile";
import { PlayerToken } from "./PlayerToken";
import { GAME_BOARD, TileData } from "../lib/gameData";

interface BoardProps {
  playerPos: number;
}

export function Board({ playerPos }: BoardProps) {
  const [rotation, setRotation] = useState({ x: 50, z: -10 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to position tiles in the CSS Grid
  const getTileStyle = (index: number) => {
    // ... (keep existing logic if possible, or just re-include it since I am replacing the top of the file)
    const GRID_SIZE = 11;
    const max = GRID_SIZE;

    let r = 1,
      c = 1;

    if (index === 0) {
      r = max;
      c = max;
    } else if (index > 0 && index < 10) {
      r = max;
      c = max - index;
    } else if (index === 10) {
      r = max;
      c = 1;
    } else if (index > 10 && index < 20) {
      r = max - (index - 10);
      c = 1;
    } else if (index === 20) {
      r = 1;
      c = 1;
    } else if (index > 20 && index < 30) {
      r = 1;
      c = 1 + (index - 20);
    } else if (index === 30) {
      r = 1;
      c = max;
    } else if (index > 30 && index < 40) {
      r = 1 + (index - 30);
      c = max;
    }

    return {
      gridColumnStart: c,
      gridRowStart: r,
    };
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) setIsDragging(true); // Left click only
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setRotation((prev) => ({
      x: Math.max(0, Math.min(85, prev.x - e.movementY * 0.5)), // Clamp X rotation
      z: prev.z + e.movementX * 0.5,
    }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
  };

  return (
    <div
      className={`perspective-[1500px] flex items-center justify-center py-20 w-full h-full overflow-hidden select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div
        className="relative w-[1000px] h-[1000px] bg-[#e6e6e6] border-[16px] border-[#4a4a4a] shadow-[0_50px_100px_rgba(0,0,0,0.5)] grid gap-0.5 p-0.5 transition-transform duration-75 ease-out"
        style={{
          gridTemplateColumns: "1.75fr repeat(9, 1fr) 1.75fr",
          gridTemplateRows: "1.75fr repeat(9, 1fr) 1.75fr",
          transform: `rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg) scale(${zoom})`,
          transformStyle: "preserve-3d",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(0,0,0,0.1), 20px 20px 0px #2a2a2a",
        }}
      >
        {/* Center Logo Area */}
        <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-emerald-50/80 flex flex-col items-center justify-center border border-slate-200 backdrop-blur-sm">
          <h1
            className="text-8xl font-black text-slate-800 tracking-tighter uppercase mb-4 rotate-[-15deg] opacity-20 select-none"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
          >
            RGPD Poly
          </h1>
          <div className="text-center text-slate-400 max-w-md">
            <p>Apprenez la protection des données en jouant !</p>
            <p className="text-xs mt-2">
              Collectez des propriétés, évitez les amendes CNIL.
            </p>
          </div>
        </div>

        {/* Tiles */}
        {GAME_BOARD.map((tile: TileData) => (
          <Tile
            key={tile.id}
            data={tile}
            className="z-10 bg-white"
            // Pass style directly for grid positioning
            {...{ style: getTileStyle(tile.id) }}
          />
        ))}

        {/* Player Token Layer */}
        {/* The token is absolutely positioned relative to the grid or placed inside the grid cells? 
                The PlayerToken component uses layout animations and grid positioning.
                Ideally it is a sibling to tiles in the grid container.
            */}
        <PlayerToken tileId={playerPos} />
      </div>
    </div>
  );
}
