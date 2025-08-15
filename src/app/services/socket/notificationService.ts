/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { Server as SocketIOServer, Socket } from "socket.io";
import type { UserSocketManager } from "./userSocketManager";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

export class NotificationService {
  private io: SocketIOServer;
  private userSocketManager: UserSocketManager;

  constructor(io: SocketIOServer, userSocketManager: UserSocketManager) {
    this.io = io;
    this.userSocketManager = userSocketManager;
  }

  public handleConnection(socket: Socket): void {
    const userId = socket.data.userId;

    // Handle notification acknowledgment
    socket.on("notificationRead", async (data: { notificationId: string }) => {
      try {
        await this.markNotificationAsRead(data.notificationId, userId);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    });

    // Handle get unread notifications
    socket.on("getUnreadNotifications", async () => {
      try {
        await this.sendUnreadNotifications(socket, userId);
      } catch (error) {
        console.error("Error getting unread notifications:", error);
      }
    });

    console.log(`🔔 Notification service initialized for user: ${userId}`);
  }

  public handleDisconnection(socket: Socket): void {
    const userId = socket.data.userId;
    console.log(`🔔 Notification service disconnected for user: ${userId}`);
  }

  // Send notification to specific user
  public async sendNotificationToUser(
    userId: string,
    notification: Omit<Notification, "id" | "userId" | "isRead" | "createdAt">
  ): Promise<void> {
    const fullNotification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      isRead: false,
      createdAt: new Date(),
      ...notification,
    };

    // TODO: Save notification to database
    // await NotificationModel.create(fullNotification);

    // Send to user if online
    const socketId = this.userSocketManager.getSocketId(userId);
    if (socketId) {
      this.io.to(`user:${userId}`).emit("newNotification", fullNotification);
    }

    console.log(`🔔 Notification sent to user: ${userId}`);
  }

  // Send notification to multiple users
  public async sendNotificationToUsers(
    userIds: string[],
    notification: Omit<Notification, "id" | "userId" | "isRead" | "createdAt">
  ): Promise<void> {
    const promises = userIds.map((userId) =>
      this.sendNotificationToUser(userId, notification)
    );
    await Promise.all(promises);
  }

  // Broadcast notification to all online users
  public async broadcastNotification(
    notification: Omit<Notification, "id" | "userId" | "isRead" | "createdAt">
  ): Promise<void> {
    const onlineUsers = this.userSocketManager.getOnlineUserIds();
    await this.sendNotificationToUsers(onlineUsers, notification);
  }

  private async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<void> {
    // TODO: Update notification in database
    // await NotificationModel.findOneAndUpdate(
    //   { _id: notificationId, userId },
    //   { isRead: true }
    // );

    console.log(
      `🔔 Notification ${notificationId} marked as read by ${userId}`
    );
  }

  private async sendUnreadNotifications(
    socket: Socket,
    userId: string
  ): Promise<void> {
    // TODO: Get unread notifications from database
    // const unreadNotifications = await NotificationModel.find({
    //   userId,
    //   isRead: false
    // }).sort({ createdAt: -1 });

    const unreadNotifications: Notification[] = []; // Placeholder

    socket.emit("unreadNotifications", unreadNotifications);
  }
}
