import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Question } from "../lib/quizData";

interface QuizModalProps {
  isOpen: boolean;
  onClose: (correct: boolean) => void;
  propertyName: string;
  question: Question | null;
}

export function QuizModal({
  isOpen,
  onClose,
  propertyName,
  question,
}: QuizModalProps) {
  if (!isOpen || !question) return null;

  const handleAnswer = (index: number) => {
    const isCorrect = index === question.correctIndex;
    onClose(isCorrect);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full m-4 border-2 border-slate-900"
        >
          <h2 className="text-2xl font-bold mb-4 text-slate-800">
            Acquérir : <span className="text-indigo-600">{propertyName}</span>
          </h2>
          <p className="text-slate-600 mb-6 font-medium">
            Pour maîtriser ce concept RGPD, répondez correctement à la question
            :
          </p>

          <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
            <p className="text-lg font-semibold text-slate-800">
              {question.question}
            </p>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all font-medium text-slate-700"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
