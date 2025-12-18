import React from "react";
import { User, Wallet, MapPin } from "lucide-react";
import { PlayerInfo } from "../lib/useGameState";

interface PlayerListProps {
  players: PlayerInfo[];
  activePlayerId: string | null;
}

export function PlayerList({ players, activePlayerId }: PlayerListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-indigo-600" />
        Joueurs ({players.length})
      </h3>

      <div className="space-y-3">
        {players.map((player) => {
          const isActive = player.id === activePlayerId;
          return (
            <div
              key={player.id}
              className={`p-3 rounded-lg border transition-all ${
                isActive
                  ? "bg-indigo-50 border-indigo-200 shadow-sm"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`font-bold ${
                    isActive ? "text-indigo-700" : "text-slate-700"
                  }`}
                >
                  {player.pseudo}
                </span>
                {isActive && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium animate-pulse">
                    En cours
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1" title="Argent">
                  <Wallet className="w-4 h-4 text-emerald-500" />
                  <span className="font-mono font-medium text-emerald-700">
                    {player.money} €C
                  </span>
                </div>
                <div className="flex items-center gap-1" title="Position">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Case {player.position}</span>
                </div>
              </div>
            </div>
          );
        })}

        {players.length === 0 && (
          <p className="text-slate-400 italic text-center text-sm">
            En attente de joueurs...
          </p>
        )}
      </div>
    </div>
  );
}
