/* eslint-disable no-console */
import type { Server as SocketIOServer } from "socket.io";
import { UserSocketManager } from "./userSocketManager";
import { ChatService } from "./chatService";
import { NotificationService } from "./notificationService";
import { RoomService } from "./roomService";
import { MessageSocketService } from "./messageSocketService";
import { authenticateSocket } from "../../middlewares/socketAuth";
// import { authenticateSocket } from "../../middleware/socketAuth";

let globalSocketService: SocketService | null = null;

export class SocketService {
  private io: SocketIOServer;
  private userSocketManager: UserSocketManager;
  private chatService: ChatService;
  private notificationService: NotificationService;
  private roomService: RoomService;
  private messageSocketService: MessageSocketService;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.userSocketManager = new UserSocketManager();
    this.chatService = new ChatService(io, this.userSocketManager);
    this.notificationService = new NotificationService(
      io,
      this.userSocketManager
    );
    this.roomService = new RoomService(io, this.userSocketManager);
    this.messageSocketService = new MessageSocketService(
      io,
      this.userSocketManager
    );
  }

  public initialize(): void {
    // Authentication middleware
    this.io.use(authenticateSocket);

    this.io.on("connection", (socket) => {
      console.log(`🔌 User connected: ${socket.id}`);

      // Extract user info from authenticated socket
      const userId = socket.data.userId;
      const userInfo = socket.data.user;

      // Register user socket
      this.userSocketManager.addUser(userId, socket.id, userInfo);

      // Emit online users update
      this.io.emit("onlineUsers", this.userSocketManager.getOnlineUsers());

      // Initialize services for this socket
      // this.chatService.handleConnection(socket);
      // this.notificationService.handleConnection(socket);
      // this.roomService.handleConnection(socket);
      // this.messageSocketService.handleConnection(socket);

      // Handle disconnection
      socket.on("disconnect", (reason) => {
        console.log(`🔌 User disconnected: ${socket.id}, Reason: ${reason}`);

        // Remove user from socket manager
        this.userSocketManager.removeUser(userId);

        // Emit updated online users
        this.io.emit("onlineUsers", this.userSocketManager.getOnlineUsers());

        // Handle service-specific disconnection
        this.chatService.handleDisconnection(socket);
        this.notificationService.handleDisconnection(socket);
        this.roomService.handleDisconnection(socket);
        this.messageSocketService.handleDisconnection(socket);
      });

      // Handle errors
      socket.on("error", (error) => {
        console.error(`❌ Socket error for ${socket.id}:`, error);
      });
    });
  }

  // Utility methods for external use
  public getUserSocketManager(): UserSocketManager {
    return this.userSocketManager;
  }

  public getChatService(): ChatService {
    return this.chatService;
  }

  public getNotificationService(): NotificationService {
    return this.notificationService;
  }

  public getRoomService(): RoomService {
    return this.roomService;
  }

  public getMessageSocketService(): MessageSocketService {
    return this.messageSocketService;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

// Initialize and export socket service
export const initializeSocketIO = (io: SocketIOServer): SocketService => {
  const socketService = new SocketService(io);
  socketService.initialize();
  globalSocketService = socketService;
  return socketService;
};

export const getIO = (): SocketIOServer => {
  if (!globalSocketService) {
    throw new Error(
      "Socket.IO not initialized. Call initializeSocketIO first."
    );
  }
  return globalSocketService.getIO();
};

//uses in others files

// routes/post.ts
// import { getIO } from "../socket/SocketService";
// import { userSocketManager } from "../wherever/you/expose"; // বা get থেকে নিন

// router.post("/notify/:userId", async (req, res) => {
//   const io = getIO();
//   const socketId = userSocketManager.getSocketId(req.params.userId);
//   if (socketId) io.to(socketId).emit("notification", { msg: "Hello!" });
//   res.json({ ok: true });
// });
