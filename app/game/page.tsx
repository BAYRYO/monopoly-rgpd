"use client";

import { DiceOverlay } from "../components/DiceOverlay";
import { Board } from "../components/Board";
import { GameControls } from "../components/GameControls";
import { QuizModal } from "../components/QuizModal";
import { PlayerList } from "../components/PlayerList";
import { useGameState } from "../lib/useGameState";
import { useState, useEffect } from "react";
import { socket } from "../lib/socket";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Question, QUIZ_QUESTIONS } from "../lib/quizData";

function GameContent() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [pseudoInput, setPseudoInput] = useState("");
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room") || "default-room";

  const {
    player,
    setPlayer,
    phase,
    lastRoll,
    message,
    currentTile,
    rollDice,
    endTurn,
    isMyTurn,
    activePlayerId,
    players,
    joinRoom,
    isJoined,
    isConnected,
  } = useGameState(roomId);

  useEffect(() => {
    if (socket.disconnected) {
      socket.connect();
    }
  }, []);

  // Handle landing on a tile
  useEffect(() => {
    if (phase === "ACTION" && isMyTurn && !showQuiz) {
      if (
        currentTile.type === "PROPERTY" &&
        !player.properties.includes(currentTile.id)
      ) {
        // Trigger Quiz only if not already showing and not owned
        const randomQuestion =
          QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
        setCurrentQuestion(randomQuestion);
        setShowQuiz(true);
      } else {
        // Auto-end turn for other tiles for now (or handle them later)
        // setTimeout(endTurn, 1000);
        // Let's keep manual end turn for clarity or auto?
        // Let's not auto-end, let user click "End Turn" or handle via modal for others too?
        // Actually for non-properties, usually nothing happens or just a message.
        // Let's just let the user click "End Turn".
      }
    }
  }, [phase, isMyTurn, currentTile, showQuiz, player.properties, endTurn]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pseudoInput.trim()) {
      joinRoom(pseudoInput.trim());
    }
  };

  const handleRoll = () => {
    rollDice();
  };

  const handleStartGame = () => {
    socket.emit("start_game", roomId);
  };

  const handleQuizClose = (correct: boolean) => {
    setShowQuiz(false);
    if (correct && currentTile.price) {
      // Buy Property Logic (Client side prediction/update)
      // Ideally this should be server side, but we are using client state mostly for this demo
      setPlayer((prev) => ({
        ...prev,
        money: prev.money - (currentTile.price || 0),
        properties: [...prev.properties, currentTile.id],
      }));
      // Show success message?
    }
    // End turn after quiz
    endTurn();
  };

  if (!isJoined) {
    return (
      <main className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">
            Monopoly RGPD
          </h1>
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Choisissez votre pseudo
              </label>
              <input
                type="text"
                value={pseudoInput}
                onChange={(e) => setPseudoInput(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: DataGuardian"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              disabled={!isConnected}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg mt-2 disabled:opacity-50"
            >
              {isConnected ? "Rejoindre la partie" : "Connexion..."}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-8 pb-32">
      <DiceOverlay targetRoll={lastRoll} />

      <div className="flex gap-8 items-start w-full max-w-7xl">
        {/* Left Side - Board */}
        <div className="flex-1 flex justify-center">
          <Board playerPos={player.position} />
        </div>

        {/* Right Side - Leaderboard */}
        <div className="w-80 flex-shrink-0">
          <PlayerList players={players} activePlayerId={activePlayerId} />

          {!activePlayerId && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow-lg border border-slate-200">
              <p className="font-bold text-lg mb-2 text-slate-800">
                Partie en attente
              </p>
              <button
                onClick={handleStartGame}
                className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transition-colors"
              >
                Démarrer la partie
              </button>
            </div>
          )}
        </div>
      </div>

      <GameControls
        onRoll={handleRoll}
        canRoll={phase === "ROLL" && isMyTurn}
        lastRoll={lastRoll}
        message={message}
        money={player.money}
        phase={phase}
        onEndTurn={endTurn}
        playerName={players.find((p) => p.id === socket.id)?.pseudo || "Vous"}
      />

      <QuizModal
        isOpen={showQuiz}
        onClose={handleQuizClose}
        propertyName={currentTile.name}
        question={currentQuestion}
      />

      <div className="fixed top-4 right-4 flex gap-2">
        <button
          onClick={() => {
            const q = QUIZ_QUESTIONS[0];
            setCurrentQuestion(q);
            setShowQuiz(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow text-xs"
        >
          Test Quiz
        </button>
        <div className="bg-slate-800 text-white px-4 py-2 rounded shadow text-xs">
          Room: {roomId}
        </div>
      </div>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <GameContent />
    </Suspense>
  );
}
