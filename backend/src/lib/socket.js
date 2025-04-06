/*import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };*/

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  // Send online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
    // Ensure userId exists before deleting
    const disconnectedUser = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUser) {
      delete userSocketMap[disconnectedUser];
      console.log(`User ${disconnectedUser} removed from online users`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Handle reconnection
  socket.on("reconnect", () => {
    console.log(`User ${userId} reconnected with socket ${socket.id}`);
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };

