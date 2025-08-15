/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SocketEvents {
  // Connection events
  connection: () => void;
  disconnect: (reason: string) => void;

  // Chat events
  sendMessage: (data: {
    receiverId: string;
    message: string;
    messageType?: "text" | "image" | "file";
  }) => void;
  newMessage: (message: any) => void;
  messageSent: (data: any) => void;
  messageError: (error: { error: string }) => void;
  markAsRead: (data: { messageId: string }) => void;
  messageRead: (data: any) => void;
  typing: (data: { receiverId: string; isTyping: boolean }) => void;
  userTyping: (data: { userId: string; isTyping: boolean }) => void;

  // Notification events
  newNotification: (notification: any) => void;
  notificationRead: (data: { notificationId: string }) => void;
  getUnreadNotifications: () => void;
  unreadNotifications: (notifications: any[]) => void;

  // Room events
  joinRoom: (data: { roomId: string }) => void;
  leaveRoom: (data: { roomId: string }) => void;
  roomJoined: (data: { roomId: string }) => void;
  roomLeft: (data: { roomId: string }) => void;
  roomMessage: (data: {
    roomId: string;
    message: string;
    messageType?: "text" | "image" | "file";
  }) => void;
  createRoom: (data: {
    name: string;
    description?: string;
    isPrivate?: boolean;
  }) => void;
  roomCreated: (room: any) => void;
  userJoinedRoom: (data: any) => void;
  userLeftRoom: (data: any) => void;
  roomError: (error: { error: string }) => void;
  roomNotification: (data: any) => void;

  // System events
  onlineUsers: (users: any[]) => void;
  systemMessage: (data: any) => void;
}
