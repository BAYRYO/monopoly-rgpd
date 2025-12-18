"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { CreateRoomModal } from "./components/Lobby/CreateRoomModal";
import { RoomList } from "./components/Lobby/RoomList";

export default function LandingPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center p-8">
      {/* Hero Section */}
      <div className="text-center mt-12 mb-16">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-7xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500"
        >
          RGPD POLY
        </motion.h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
          Le jeu ultime pour maîtriser la protection des données. Créez un
          salon, invitez vos collègues et dominez le marché de la conformité !
        </p>
      </div>

      {/* Actions */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Room Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500/50 transition-colors backdrop-blur-sm flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 text-3xl">
            +
          </div>
          <h2 className="text-2xl font-bold mb-2">Créer un salon</h2>
          <p className="text-slate-400 mb-8">
            Lancez une nouvelle partie et définissez les règles.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors"
          >
            Créer une partie
          </button>
        </motion.div>

        {/* Join Room Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-cyan-500/50 transition-colors backdrop-blur-sm flex flex-col"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 text-2xl">
              #
            </div>
            <div>
              <h2 className="text-xl font-bold">Salons publics</h2>
              <p className="text-slate-400 text-sm">
                Rejoindre une partie en cours
              </p>
            </div>
          </div>

          <RoomList />
        </motion.div>
      </div>

      {/* Quick Access (Dev) */}
      <div className="mt-12 text-slate-600">
        <Link
          href="/game"
          className="hover:text-emerald-400 transition-colors text-sm"
        >
          Accès rapide au plateau (Dev Mode) &rarr;
        </Link>
      </div>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </main>
  );
}
