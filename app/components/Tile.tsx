import React from "react";
import { TileData } from "../lib/gameData";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TileProps {
  data: TileData;
  className?: string; // For positioning in the grid
  style?: React.CSSProperties;
}

export function Tile({ data, className, style }: TileProps) {
  const isCorner = data.type === "CORNER";
  const isProperty = data.type === "PROPERTY";

  return (
    <div
      style={{ ...style, transform: "translateZ(2px)" }}
      className={twMerge(
        "relative border border-slate-900 bg-[#CDE6D0] flex flex-col justify-between select-none overflow-hidden shadow-sm transition-transform hover:translate-z-[4px]",
        isCorner ? "w-full h-full" : "text-center",
        className
      )}
    >
      {/* Color Bar for properties */}
      {isProperty && data.color && (
        <div
          className={clsx("h-1/5 w-full border-b border-slate-900", data.color)}
        />
      )}

      {/* Content */}
      <div
        className={clsx(
          "flex flex-col flex-1 p-1 items-center justify-center",
          isCorner ? "rotate-45" : ""
        )}
      >
        <span className="text-[0.65rem] font-bold leading-tight uppercase tracking-tight text-slate-900">
          {data.name}
        </span>

        {/* Price or Icon placeholder */}
        {data.price && !isCorner && (
          <span className="mt-1 text-xs font-normal text-slate-800">
            {data.price} €C
          </span>
        )}

        {/* Corner descriptions or Icons */}
        {isCorner && (
          <span className="text-[0.5rem] text-slate-600 max-w-[80%] text-center mt-1">
            {data.description}
          </span>
        )}

        {!isProperty && !isCorner && (
          <div className="mt-2 text-slate-500 font-serif italic text-[0.6rem]">
            ?
          </div>
        )}
      </div>
    </div>
  );
}
