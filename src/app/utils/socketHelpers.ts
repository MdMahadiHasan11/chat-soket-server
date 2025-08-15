/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
// import { io } from "../server";

import { io } from "../../server";

// Helper functions to emit events from anywhere in the application

export const emitToUser = (userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
  console.log(`📡 Emitted ${event} to user: ${userId}`);
};

export const emitToRoom = (roomId: string, event: string, data: any) => {
  io.to(`room:${roomId}`).emit(event, data);
  console.log(`📡 Emitted ${event} to room: ${roomId}`);
};

export const broadcastToAll = (event: string, data: any) => {
  io.emit(event, data);
  console.log(`📡 Broadcasted ${event} to all users`);
};

export const emitToMultipleUsers = (
  userIds: string[],
  event: string,
  data: any
) => {
  userIds.forEach((userId) => {
    emitToUser(userId, event, data);
  });
};

// Get online users count
export const getOnlineUsersCount = (): number => {
  return io.sockets.sockets.size;
};

// Get all connected socket IDs
export const getAllSocketIds = (): string[] => {
  return Array.from(io.sockets.sockets.keys());
};
