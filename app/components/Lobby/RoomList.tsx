import React from "react";
import { Users, Lock } from "lucide-react";
import { useSocket } from "../../providers/SocketProvider";
import { useRouter } from "next/navigation";

export function RoomList() {
  const { rooms } = useSocket();
  const router = useRouter();

  const handleJoin = (roomId: string) => {
    // For now we just redirect, the game page handles the join event
    router.push(`/game?room=${roomId}`);
  };

  if (rooms.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
        Aucun salon disponible. Créez-en un !
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar h-[200px]">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="group flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                {room.name}
              </span>
              {room.isPrivate && <Lock size={14} className="text-slate-500" />}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              En attente
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400 bg-black/20 px-2 py-1 rounded-lg">
              <Users size={14} />
              <span className="text-sm font-medium">
                {room.players.length}/{room.maxPlayers}
              </span>
            </div>
            <button
              onClick={() => handleJoin(room.id)}
              className="px-4 py-2 bg-slate-800 hover:bg-emerald-500 text-slate-300 hover:text-slate-900 text-sm font-bold rounded-lg transition-all"
            >
              Rejoindre
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
