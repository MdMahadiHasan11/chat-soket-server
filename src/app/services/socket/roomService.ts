/* eslint-disable @typescript-eslint/consistent-generic-constructors */
/* eslint-disable no-console */
import type { Server as SocketIOServer, Socket } from "socket.io";
import type { UserSocketManager } from "./userSocketManager";

export interface Room {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  members: string[];
  isPrivate: boolean;
  createdAt: Date;
}

export class RoomService {
  private io: SocketIOServer;
  private userSocketManager: UserSocketManager;
  private rooms: Map<string, Room> = new Map();

  constructor(io: SocketIOServer, userSocketManager: UserSocketManager) {
    this.io = io;
    this.userSocketManager = userSocketManager;
  }

  public handleConnection(socket: Socket): void {
    const userId = socket.data.userId;

    // Handle joining a room
    socket.on("joinRoom", async (data: { roomId: string }) => {
      try {
        await this.handleJoinRoom(socket, data.roomId);
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("roomError", { error: "Failed to join room" });
      }
    });

    // Handle leaving a room
    socket.on("leaveRoom", async (data: { roomId: string }) => {
      try {
        await this.handleLeaveRoom(socket, data.roomId);
      } catch (error) {
        console.error("Error leaving room:", error);
        socket.emit("roomError", { error: "Failed to leave room" });
      }
    });

    // Handle room message
    socket.on(
      "roomMessage",
      async (data: {
        roomId: string;
        message: string;
        messageType?: "text" | "image" | "file";
      }) => {
        try {
          await this.handleRoomMessage(socket, data);
        } catch (error) {
          console.error("Error sending room message:", error);
          socket.emit("roomError", { error: "Failed to send message" });
        }
      }
    );

    // Handle creating a room
    socket.on(
      "createRoom",
      async (data: {
        name: string;
        description?: string;
        isPrivate?: boolean;
      }) => {
        try {
          await this.handleCreateRoom(socket, data);
        } catch (error) {
          console.error("Error creating room:", error);
          socket.emit("roomError", { error: "Failed to create room" });
        }
      }
    );

    console.log(`🏠 Room service initialized for user: ${userId}`);
  }

  public handleDisconnection(socket: Socket): void {
    const userId = socket.data.userId;

    // Leave all rooms
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room.startsWith("room:")) {
        socket.leave(room);
        const roomId = room.replace("room:", "");
        socket.to(room).emit("userLeftRoom", { userId, roomId });
      }
    });

    console.log(`🏠 Room service disconnected for user: ${userId}`);
  }

  private async handleJoinRoom(socket: Socket, roomId: string): Promise<void> {
    const userId = socket.data.userId;

    // TODO: Check if user has permission to join room
    // const room = await RoomModel.findById(roomId);
    // if (!room || (room.isPrivate && !room.members.includes(userId))) {
    //   socket.emit("roomError", { error: "Access denied" });
    //   return;
    // }

    // Join the room
    socket.join(`room:${roomId}`);

    // Notify other room members
    socket.to(`room:${roomId}`).emit("userJoinedRoom", {
      userId,
      roomId,
      userInfo: this.userSocketManager.getUserInfo(userId),
    });

    // Send confirmation to user
    socket.emit("roomJoined", { roomId });

    console.log(`🏠 User ${userId} joined room: ${roomId}`);
  }

  private async handleLeaveRoom(socket: Socket, roomId: string): Promise<void> {
    const userId = socket.data.userId;

    // Leave the room
    socket.leave(`room:${roomId}`);

    // Notify other room members
    socket.to(`room:${roomId}`).emit("userLeftRoom", { userId, roomId });

    // Send confirmation to user
    socket.emit("roomLeft", { roomId });

    console.log(`🏠 User ${userId} left room: ${roomId}`);
  }

  private async handleRoomMessage(
    socket: Socket,
    data: {
      roomId: string;
      message: string;
      messageType?: "text" | "image" | "file";
    }
  ): Promise<void> {
    const userId = socket.data.userId;
    const { roomId, message, messageType = "text" } = data;

    const roomMessage = {
      id: `room_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      senderId: userId,
      senderInfo: this.userSocketManager.getUserInfo(userId),
      message,
      messageType,
      timestamp: new Date(),
    };

    // TODO: Save message to database
    // await RoomMessageModel.create(roomMessage);

    // Broadcast to all room members
    this.io.to(`room:${roomId}`).emit("roomMessage", roomMessage);

    console.log(`🏠 Room message sent in ${roomId} by ${userId}`);
  }

  private async handleCreateRoom(
    socket: Socket,
    data: { name: string; description?: string; isPrivate?: boolean }
  ): Promise<void> {
    const userId = socket.data.userId;
    const { name, description, isPrivate = false } = data;

    const room: Room = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      createdBy: userId,
      members: [userId],
      isPrivate,
      createdAt: new Date(),
    };

    // TODO: Save room to database
    // await RoomModel.create(room);

    // Store room in memory (temporary)
    this.rooms.set(room.id, room);

    // Join creator to the room
    socket.join(`room:${room.id}`);

    // Send confirmation to creator
    socket.emit("roomCreated", room);

    console.log(`🏠 Room ${room.id} created by ${userId}`);
  }

  // Public methods for external use
  public async sendRoomNotification(
    roomId: string,
    message: string,
    type: "info" | "warning" | "success" = "info"
  ): Promise<void> {
    this.io.to(`room:${roomId}`).emit("roomNotification", {
      message,
      type,
      timestamp: new Date(),
    });
  }

  public getRoomMembers(roomId: string): string[] {
    const room = this.io.sockets.adapter.rooms.get(`room:${roomId}`);
    if (!room) return [];

    return Array.from(room)
      .map((socketId) => {
        const user = this.userSocketManager.getUserBySocketId(socketId);
        return user ? user.userId : null;
      })
      .filter(Boolean) as string[];
  }
}
