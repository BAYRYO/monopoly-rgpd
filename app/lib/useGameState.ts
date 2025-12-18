import { useState, useEffect, useCallback } from "react";
import { BOARD_SIZE, TileData, GAME_BOARD } from "./gameData";
import { socket } from "./socket";

export interface PlayerState {
  id: string;
  position: number;
  money: number;
  properties: number[];
  inJail: boolean;
  jailTurns: number;
}

export type GamePhase = "ROLL" | "move" | "ACTION" | "END_TURN";

export interface PlayerInfo {
  id: string;
  pseudo: string;
  money: number;
  position: number;
}

export const useGameState = (roomId: string = "default-room") => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isJoined, setIsJoined] = useState(false);
  const [player, setPlayer] = useState<PlayerState>({
    id: "me",
    position: 0,
    money: 1500,
    properties: [],
    inJail: false,
    jailTurns: 0,
  });

  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [phase, setPhase] = useState<GamePhase>("ROLL");
  const [lastRoll, setLastRoll] = useState<[number, number] | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>(
    socket.connected ? "En attente..." : "Connexion au serveur..."
  );

  const isMyTurn = socket.id === activePlayerId;

  const getPlayerName = useCallback(
    (id: string) => {
      if (id === socket.id) return "Vous";
      const p = players.find((p) => p.id === id);
      return p ? p.pseudo : `Joueur ${id.substr(0, 4)}`;
    },
    [players]
  );

  useEffect(() => {
    function onConnect() {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      setMessage("Connecté au serveur !");
    }

    function onDisconnect() {
      console.log("Socket disconnected");
      setIsConnected(false);
      setMessage("Déconnecté.");
    }

    function onRoomsList(rooms: { id: string; players: PlayerInfo[] }[]) {
      console.log("Received rooms list:", rooms);
      const currentRoom = rooms.find((r) => r.id === roomId);
      console.log("Current room:", currentRoom);
      if (currentRoom) {
        console.log("Setting players:", currentRoom.players);
        setPlayers(currentRoom.players);
      } else {
        console.log("Room not found in list:", roomId);
      }
    }

    function onRollUpdate(data: {
      die1: number;
      die2: number;
      playerId: string;
    }) {
      setLastRoll([data.die1, data.die2]);

      const pName = data.playerId === socket.id ? "Vous avez" : "Un joueur a";
      setMessage(`${pName} fait ${data.die1 + data.die2}`);

      if (data.playerId === socket.id) {
        setPlayer((prev) => {
          const totalMoves = data.die1 + data.die2;
          const newPos = (prev.position + totalMoves) % BOARD_SIZE;
          let newMoney = prev.money;

          if (newPos < prev.position) {
            newMoney += 200;
          }
          return { ...prev, position: newPos, money: newMoney };
        });
        setPhase("ACTION");
      }
    }

    function onGameStarted(data: { firstPlayerId: string }) {
      setActivePlayerId(data.firstPlayerId);
    }

    function onTurnUpdate(data: { activePlayerId: string }) {
      setActivePlayerId(data.activePlayerId);
      setLastRoll(null);
      if (data.activePlayerId === socket.id) {
        setPhase("ROLL");
      }
    }

    function onGameStateSync(data: {
      gameState: string;
      currentPlayerId: string;
    }) {
      if (data.gameState === "playing") {
        setActivePlayerId(data.currentPlayerId);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rooms_list", onRoomsList);
    socket.on("roll_dice_update", onRollUpdate);
    socket.on("game_started", onGameStarted);
    socket.on("turn_update", onTurnUpdate);
    socket.on("game_state_sync", onGameStateSync);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("rooms_list", onRoomsList);
      socket.off("roll_dice_update", onRollUpdate);
      socket.off("game_started", onGameStarted);
      socket.off("turn_update", onTurnUpdate);
      socket.off("game_state_sync", onGameStateSync);
    };
  }, [roomId]);

  // Effect to update message when activePlayerId or players change
  useEffect(() => {
    if (activePlayerId) {
      const name = getPlayerName(activePlayerId);
      setMessage(
        activePlayerId === socket.id
          ? "C'est à votre tour !"
          : `Tour de ${name}`
      );
    }
  }, [activePlayerId, players, getPlayerName]);

  // Sync player state to server whenever it changes
  useEffect(() => {
    if (isConnected && isJoined && roomId) {
      socket.emit("update_player_state", {
        roomId,
        money: player.money,
        position: player.position,
      });
    }
  }, [player.money, player.position, isConnected, isJoined, roomId]);

  const rollDice = useCallback(() => {
    if (phase !== "ROLL" || !isConnected || !isMyTurn) return;

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;

    socket.emit("roll_dice", {
      roomId,
      die1,
      die2,
      playerId: socket.id,
    });
  }, [phase, isConnected, roomId, isMyTurn]);

  const endTurn = useCallback(() => {
    if (!isMyTurn) return;
    setPhase("END_TURN");
    socket.emit("end_turn", roomId);
  }, [isMyTurn, roomId]);

  const joinRoom = useCallback(
    (pseudo: string) => {
      if (isConnected) {
        socket.emit("join_room", { roomId, pseudo });
        setIsJoined(true);
      }
    },
    [isConnected, roomId]
  );

  const currentTile: TileData = GAME_BOARD[player.position];

  return {
    player,
    phase,
    lastRoll,
    message,
    currentTile,
    rollDice,
    endTurn,
    setPhase,
    setPlayer,
    isConnected,
    isMyTurn,
    activePlayerId,
    players,
    getPlayerName,
    joinRoom,
    isJoined,
  };
};
