/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
export interface OnlineUser {
  userId: string;
  socketId: string;
  connectedAt: Date;
  userInfo?: any;
}

export class UserSocketManager {
  private userSocketMap: Map<string, OnlineUser> = new Map<
    string,
    OnlineUser
  >();

  public addUser(userId: string, socketId: string, userInfo?: any): void {
    this.userSocketMap.set(userId, {
      userId,
      socketId,
      connectedAt: new Date(),
      userInfo,
    });
    console.log(`✅ User ${userId} added to socket manager`);
  }

  public removeUser(userId: string): void {
    if (this.userSocketMap.has(userId)) {
      this.userSocketMap.delete(userId);
      console.log(`✅ User ${userId} removed from socket manager`);
    }
  }

  public getSocketId(userId: string): string | null {
    const user = this.userSocketMap.get(userId);
    return user ? user.socketId : null;
  }

  public getUserBySocketId(socketId: string): OnlineUser | null {
    for (const user of this.userSocketMap.values()) {
      if (user.socketId === socketId) {
        return user;
      }
    }
    return null;
  }

  public getOnlineUsers(): OnlineUser[] {
    return Array.from(this.userSocketMap.values());
  }

  public getOnlineUserIds(): string[] {
    return Array.from(this.userSocketMap.keys());
  }

  public isUserOnline(userId: string): boolean {
    return this.userSocketMap.has(userId);
  }

  public getOnlineUsersCount(): number {
    return this.userSocketMap.size;
  }

  public getUserInfo(userId: string): any {
    const user = this.userSocketMap.get(userId);
    return user ? user.userInfo : null;
  }
}
