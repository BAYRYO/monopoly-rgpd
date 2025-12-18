"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dice3D } from "./Dice3D";

interface DiceOverlayProps {
  targetRoll: [number, number] | null;
}

export function DiceOverlay({ targetRoll }: DiceOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [diceValues, setDiceValues] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    if (targetRoll) {
      setIsVisible(true);
      setIsRolling(true);
      // We can update the target values immediately,
      // the spinning animation will hide the fact that they are already set.
      // Or we can wait to set them until 'stop' if we want to be purist,
      // but setting them now ensures they are ready for the landing transition.
      // However, if we change them *while* spinning, it might jump.
      // Ideally we keep old values until we stop? No, we don't care where it started.
      setDiceValues(targetRoll);

      const stopTimeout = setTimeout(() => {
        setIsRolling(false);
      }, 1500);

      const hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 4500);

      return () => {
        clearTimeout(stopTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [targetRoll]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[100] flex flex-col items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex gap-16 mb-16" // Increased gap for 3D room
          >
            <Dice3D value={diceValues[0]} isRolling={isRolling} />
            <Dice3D value={diceValues[1]} isRolling={isRolling} />
          </motion.div>

          {!isRolling && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              className="text-6xl font-bold text-white font-mono drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
            >
              {diceValues[0] + diceValues[1]}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
