"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../lib/socket";
import type { Socket } from "socket.io-client";

interface Room {
  id: string;
  name: string;
  players: string[];
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
}

interface SocketContextType {
  socket: Socket;
  rooms: Room[];
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket,
  rooms: [],
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRoomsList(updatedRooms: Room[]) {
      setRooms(updatedRooms);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("rooms_list", onRoomsList);

    // Initial connection attempt
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("rooms_list", onRoomsList);

      // Optional: disconnect on unmount, but often we want to keep it alive
      // socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, rooms, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
