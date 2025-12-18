import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  interface PlayerInfo {
    id: string;
    pseudo: string;
    money: number;
    position: number;
  }

  // In-memory room storage (for MVP)
  interface Room {
    id: string;
    name: string;
    players: PlayerInfo[];
    maxPlayers: number;
    isPrivate: boolean;
    password?: string;
    gameState: "waiting" | "playing";
    currentPlayerIndex: number;
  }

  const rooms: Record<string, Room> = {
    // Default room for testing
    "default-room": {
      id: "default-room",
      name: "Salon Public",
      players: [],
      maxPlayers: 10,
      isPrivate: false,
      gameState: "waiting",
      currentPlayerIndex: 0,
    },
  };

  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    // Send available rooms to newly connected player
    socket.emit("rooms_list", Object.values(rooms));

    socket.on("create_room", (data) => {
      const roomId = data.name.toLowerCase().replace(/\s+/g, "-"); // Simple ID generation

      if (rooms[roomId]) {
        socket.emit("error", "Room already exists");
        return;
      }

      rooms[roomId] = {
        id: roomId,
        name: data.name,
        players: [],
        maxPlayers: 4,
        isPrivate: data.isPrivate,
        password: data.password,
        gameState: "waiting",
        currentPlayerIndex: 0,
      };

      io.emit("rooms_list", Object.values(rooms)); // Broadcast update
      socket.emit("room_created", roomId);
    });

    socket.on("join_room", (data: { roomId: string; pseudo: string }) => {
      const roomId = data.roomId || "default-room";
      const pseudo = data.pseudo || `Guest-${socket.id.substr(0, 4)}`;

      const room = rooms[roomId] || rooms["default-room"];
      if (room) {
        socket.join(room.id);

        // Check if player already in room
        const existingPlayer = room.players.find((p) => p.id === socket.id);
        if (!existingPlayer) {
          room.players.push({
            id: socket.id,
            pseudo,
            money: 1500,
            position: 0,
          });
        } else {
          // Update pseudo if rejoining?
          existingPlayer.pseudo = pseudo;
        }

        console.log(`Socket ${socket.id} (${pseudo}) joined ${room.id}`);

        // Notify others in room
        socket.to(room.id).emit("player_joined", { id: socket.id, pseudo });

        // If game is already playing, send current state to joined player
        if (room.gameState === "playing") {
          socket.emit("game_state_sync", {
            gameState: room.gameState,
            currentPlayerId: room.players[room.currentPlayerIndex].id,
          });
        }

        // Update room list player counts for everyone
        io.emit("rooms_list", Object.values(rooms));
      }
    });

    socket.on(
      "update_player_state",
      (data: { roomId: string; money: number; position: number }) => {
        const room = rooms[data.roomId];
        if (room) {
          const player = room.players.find((p) => p.id === socket.id);
          if (player) {
            player.money = data.money;
            player.position = data.position;
            // Broadcast update/room list
            io.emit("rooms_list", Object.values(rooms));
          }
        }
      }
    );

    socket.on("start_game", (roomId) => {
      const room = rooms[roomId];
      if (room && room.gameState === "waiting" && room.players.length >= 1) {
        room.gameState = "playing";
        room.currentPlayerIndex = 0;
        io.to(roomId).emit("game_started", {
          firstPlayerId: room.players[0].id,
        });
        console.log(`Game started in room ${roomId}`);
      }
    });

    socket.on("roll_dice", (data) => {
      const room = rooms[data.roomId];
      // Validation: ensure it is this player's turn (optional but good practice)
      if (room && room.players[room.currentPlayerIndex].id === socket.id) {
        console.log("Roll Event:", data);
        io.to(data.roomId).emit("roll_dice_update", data);
      }
    });

    socket.on("end_turn", (roomId) => {
      const room = rooms[roomId];
      if (room && room.gameState === "playing") {
        // Verify it was actually the current player asking to end turn
        if (room.players[room.currentPlayerIndex].id === socket.id) {
          room.currentPlayerIndex =
            (room.currentPlayerIndex + 1) % room.players.length;
          const nextPlayerId = room.players[room.currentPlayerIndex].id;

          io.to(roomId).emit("turn_update", {
            activePlayerId: nextPlayerId,
          });
          console.log(
            `Turn passed. Next player: ${nextPlayerId} in room ${roomId}`
          );
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
      // Remove player from rooms
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const index = room.players.findIndex((p) => p.id === socket.id);
        if (index !== -1) {
          const wasCurrentTurn = index === room.currentPlayerIndex;

          room.players.splice(index, 1);

          // If the player who left was current player, advance turn
          if (room.gameState === "playing" && room.players.length > 0) {
            if (wasCurrentTurn) {
              // If we removed the player at currentPlayerIndex, the next player
              // effectively slides into that index, unless it was the last index.
              // We need to keep index within bounds.
              if (room.currentPlayerIndex >= room.players.length) {
                room.currentPlayerIndex = 0;
              }
              // Notify of turn change
              io.to(roomId).emit("turn_update", {
                activePlayerId: room.players[room.currentPlayerIndex].id,
              });
            } else if (index < room.currentPlayerIndex) {
              // If a player *before* the current one left, current index shifts down
              room.currentPlayerIndex--;
            }
          }

          // Clean up empty rooms if not default
          if (room.players.length === 0 && roomId !== "default-room") {
            delete rooms[roomId];
          }
        }
      }
      io.emit("rooms_list", Object.values(rooms));
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
