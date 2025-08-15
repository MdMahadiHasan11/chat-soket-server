/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { Server, Socket } from "socket.io";
import type { UserSocketManager } from "./userSocketManager";
import { MessageServices } from "../../modules/chat-socket/messageService";
// import { MessageServices } from "../../modules/chat-socket/message/message.service";
// import { MessageServices } from "../messageService";

export class MessageSocketService {
  private io: Server;
  private userSocketManager: UserSocketManager;

  constructor(io: Server, userSocketManager: UserSocketManager) {
    this.io = io;
    this.userSocketManager = userSocketManager;
  }

  // Handle connection
  handleConnection(socket: Socket): void {
    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, text, media } = data;
        const senderId = socket.data.userId;

        // Create message in database
        const messagePayload = {
          senderId,
          receiverId,
          text,
          media,
          seen: false,
          isDeleted: false,
        };

        const newMessage = await MessageServices.createMessage(messagePayload);

        // Send to receiver if online
        const receiverSocketId = this.userSocketManager.getSocketId(receiverId);
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Confirm to sender
        socket.emit("messageSent", newMessage);

        console.log("[v0] Message sent successfully:", newMessage._id);
      } catch (error) {
        console.error("[v0] Error sending message:", error);
        socket.emit("error", {
          type: "MESSAGE_SEND_ERROR",
          message: "Failed to send message",
        });
      }
    });

    socket.on("markAsSeen", async (data) => {
      try {
        const { messageId } = data;
        const userId = socket.data.userId;

        await MessageServices.markAsSeen(messageId, userId);

        // Notify sender that message was seen
        const message = await MessageServices.getMessageById(messageId);
        if (message) {
          this.notifyMessageSeen(
            message.senderId.toString(),
            messageId,
            userId
          );
        }

        console.log("[v0] Message marked as seen:", messageId);
      } catch (error) {
        console.error("[v0] Error marking message as seen:", error);
        socket.emit("error", {
          type: "MARK_SEEN_ERROR",
          message: "Failed to mark message as seen",
        });
      }
    });

    socket.on("typing", (data) => {
      // Handle typing notification
      this.notifyTyping(data.receiverId, {
        senderId: socket.data.userId,
        isTyping: data.isTyping,
      });
    });

    socket.on("getMessages", async (data) => {
      try {
        const { receiverId } = data;
        const userId = socket.data.userId;

        const result = await MessageServices.getAllMessages(userId, receiverId);
        socket.emit("messagesLoaded", result.data);

        console.log("[v0] Messages loaded for user:", userId);
      } catch (error) {
        console.error("[v0] Error loading messages:", error);
        socket.emit("error", {
          type: "LOAD_MESSAGES_ERROR",
          message: "Failed to load messages",
        });
      }
    });
  }

  // Handle disconnection
  handleDisconnection(socket: Socket): void {
    // Clean up any message-related resources
    console.log("[v0] Message service disconnection handled for:", socket.id);
  }

  // Send message to specific user
  async sendMessageToUser(receiverId: string, message: any): Promise<boolean> {
    const receiverSocketId = this.userSocketManager.getSocketId(receiverId);
    if (receiverSocketId) {
      this.io.to(receiverSocketId).emit("newMessage", message);
      return true;
    }
    return false;
  }

  // Broadcast message to multiple users
  async broadcastMessage(userIds: string[], message: any): Promise<boolean[]> {
    const results = await Promise.all(
      userIds.map((userId) => this.sendMessageToUser(userId, message))
    );
    return results;
  }

  // Send notification
  async sendNotification(userId: string, notification: any): Promise<boolean> {
    const userSocketId = this.userSocketManager.getSocketId(userId);
    if (userSocketId) {
      this.io.to(userSocketId).emit("notification", notification);
      return true;
    }
    return false;
  }

  // Get online users count
  getOnlineUsersCount(): number {
    return this.userSocketManager.getOnlineUsersCount();
  }

  // Get online users list
  getOnlineUsers(): string[] {
    return this.userSocketManager.getOnlineUserIds();
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSocketManager.isUserOnline(userId);
  }

  // Send message seen notification
  async notifyMessageSeen(
    senderId: string,
    messageId: string,
    seenBy: string
  ): Promise<boolean> {
    const senderSocketId = this.userSocketManager.getSocketId(senderId);
    if (senderSocketId) {
      this.io.to(senderSocketId).emit("messageSeen", {
        messageId,
        seenBy,
        seenAt: new Date(),
      });
      return true;
    }
    return false;
  }

  // Send typing notification
  async notifyTyping(receiverId: string, typingData: any): Promise<boolean> {
    const receiverSocketId = this.userSocketManager.getSocketId(receiverId);
    if (receiverSocketId) {
      this.io.to(receiverSocketId).emit("userTyping", typingData);
      return true;
    }
    return false;
  }
}
