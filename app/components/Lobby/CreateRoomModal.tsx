import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { useSocket } from "../../providers/SocketProvider";
import { useRouter } from "next/navigation";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    console.log(
      "CreateRoomModal mounted. Socket connected:",
      socket?.connected
    );
    if (!socket) return;

    const onRoomCreated = (roomId: string) => {
      console.log("Room created event received!", roomId);
      router.push(`/game?room=${roomId}`);
    };

    const onError = (msg: string) => {
      console.error("Socket error:", msg);
      alert("Erreur: " + msg);
    };

    socket.on("room_created", onRoomCreated);
    socket.on("error", onError);

    return () => {
      socket.off("room_created", onRoomCreated);
      socket.off("error", onError);
    };
  }, [socket, router]);

  const handleCreateRoom = () => {
    console.log("Attempting to create room:", roomName);
    if (!roomName.trim()) return;

    console.log("Emitting create_room event...");
    socket.emit("create_room", {
      name: roomName,
      isPrivate,
      password: isPrivate ? password : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Nouveau Salon</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Nom du salon
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Ex: Partie des Pros"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Visibilité
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsPrivate(false)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    !isPrivate
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <Globe size={18} />
                  Public
                </button>
                <button
                  onClick={() => setIsPrivate(true)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                    isPrivate
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <Lock size={18} />
                  Privé
                </button>
              </div>
            </div>

            {isPrivate && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
              >
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secret123"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-950 border-t border-slate-800">
            <button
              onClick={handleCreateRoom}
              disabled={!roomName.trim()}
              className="block w-full text-center py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-colors"
            >
              Créer et Jouer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
