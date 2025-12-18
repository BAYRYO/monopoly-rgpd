import React from "react";
import { motion } from "motion/react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

interface GameControlsProps {
  onRoll: () => void;
  canRoll: boolean;
  lastRoll: [number, number] | null;
  message: string;
  money: number;
  phase: string;
  onEndTurn: () => void;
  playerName: string;
}

const DiceIcon = ({ value }: { value: number }) => {
  const Icon =
    [Dice1, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][value] || Dice1;
  return (
    <div>
      <Icon className="w-8 h-8" />
    </div>
  );
};

export function GameControls({
  onRoll,
  canRoll,
  lastRoll,
  message,
  money,
  phase,
  onEndTurn,
  playerName,
}: GameControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 shadow-xl z-50 flex items-center justify-between">
      {/* Player Stats */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-slate-800">{playerName}</h2>
        <div className="text-xl text-emerald-600 font-mono font-bold">
          {money} €C{" "}
          <span className="text-sm text-slate-500 font-normal">
            (Crédits Conformité)
          </span>
        </div>
      </div>

      {/* Message Bar */}
      <div className="flex-1 mx-8 text-center">
        <p className="text-lg text-slate-700 font-medium">{message}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {lastRoll && (
          <div className="flex gap-2 mr-4 bg-slate-100 p-2 rounded-lg opacity-75">
            <DiceIcon value={lastRoll[0]} />
            <DiceIcon value={lastRoll[1]} />
          </div>
        )}

        {canRoll ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRoll}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Lancer les dés
          </motion.button>
        ) : (
          <button
            disabled
            className="px-6 py-3 bg-slate-300 text-slate-500 font-bold rounded-full cursor-not-allowed"
          >
            Lancer les dés
          </button>
        )}

        {phase === "ACTION" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEndTurn}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
          >
            Fin du tour
          </motion.button>
        )}
      </div>
    </div>
  );
}
