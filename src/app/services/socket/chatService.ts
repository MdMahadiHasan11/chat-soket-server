/* eslint-disable no-console */
import type { Server as SocketIOServer, Socket } from "socket.io";
import type { UserSocketManager } from "./userSocketManager";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  messageType: "text" | "image" | "file";
  isRead: boolean;
}

export class ChatService {
  private io: SocketIOServer;
  private userSocketManager: UserSocketManager;

  constructor(io: SocketIOServer, userSocketManager: UserSocketManager) {
    this.io = io;
    this.userSocketManager = userSocketManager;
  }

  public handleConnection(socket: Socket): void {
    const userId = socket.data.userId;

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Handle private message
    socket.on(
      "sendMessage",
      async (data: {
        receiverId: string;
        message: string;
        messageType?: "text" | "image" | "file";
      }) => {
        try {
          await this.handlePrivateMessage(socket, data);
        } catch (error) {
          console.error("Error handling private message:", error);
          socket.emit("messageError", { error: "Failed to send message" });
        }
      }
    );

    // Handle message read status
    socket.on("markAsRead", async (data: { messageId: string }) => {
      try {
        await this.handleMarkAsRead(socket, data);
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    });

    // Handle typing indicators
    socket.on("typing", (data: { receiverId: string; isTyping: boolean }) => {
      this.handleTyping(socket, data);
    });

    console.log(`💬 Chat service initialized for user: ${userId}`);
  }

  public handleDisconnection(socket: Socket): void {
    const userId = socket.data.userId;
    socket.leave(`user:${userId}`);
    console.log(`💬 Chat service disconnected for user: ${userId}`);
  }

  private async handlePrivateMessage(
    socket: Socket,
    data: {
      receiverId: string;
      message: string;
      messageType?: "text" | "image" | "file";
    }
  ): Promise<void> {
    const senderId = socket.data.userId;
    const { receiverId, message, messageType = "text" } = data;

    // Create message object
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      receiverId,
      message,
      messageType,
      timestamp: new Date(),
      isRead: false,
    };

    // TODO: Save message to database
    // await MessageModel.create(chatMessage);

    // Send to receiver if online
    const receiverSocketId = this.userSocketManager.getSocketId(receiverId);
    if (receiverSocketId) {
      this.io.to(`user:${receiverId}`).emit("newMessage", chatMessage);
    }

    // Send confirmation to sender
    socket.emit("messageSent", {
      ...chatMessage,
      delivered: !!receiverSocketId,
    });

    console.log(`💬 Message sent from ${senderId} to ${receiverId}`);
  }

  private async handleMarkAsRead(
    socket: Socket,
    data: { messageId: string }
  ): Promise<void> {
    const userId = socket.data.userId;
    const { messageId } = data;

    // TODO: Update message read status in database
    // await MessageModel.findByIdAndUpdate(messageId, { isRead: true });

    // Notify sender that message was read
    // TODO: Get message details from database to find sender
    // const message = await MessageModel.findById(messageId);
    // if (message) {
    //   this.io.to(`user:${message.senderId}`).emit("messageRead", {
    //     messageId,
    //     readBy: userId,
    //     readAt: new Date(),
    //   });
    // }

    console.log(`💬 Message ${messageId} marked as read by ${userId}`);
  }

  private handleTyping(
    socket: Socket,
    data: { receiverId: string; isTyping: boolean }
  ): void {
    const senderId = socket.data.userId;
    const { receiverId, isTyping } = data;

    // Send typing indicator to receiver
    this.io.to(`user:${receiverId}`).emit("userTyping", {
      userId: senderId,
      isTyping,
    });
  }

  // Public methods for external use
  public async sendNotificationMessage(
    userId: string,
    message: string
  ): Promise<void> {
    this.io.to(`user:${userId}`).emit("systemMessage", {
      message,
      timestamp: new Date(),
      type: "notification",
    });
  }

  public async broadcastMessage(message: string): Promise<void> {
    this.io.emit("systemMessage", {
      message,
      timestamp: new Date(),
      type: "broadcast",
    });
  }
}
