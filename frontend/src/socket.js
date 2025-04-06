// src/socket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = (userId) => {
  socket = io("http://localhost:5000", {
    query: { userId },
    transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => socket;
