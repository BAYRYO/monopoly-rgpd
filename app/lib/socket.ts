"use client";

import io from "socket.io-client";

export const socket = io({
  path: "/socket.io",
  autoConnect: false, // Wait for user to join
});
