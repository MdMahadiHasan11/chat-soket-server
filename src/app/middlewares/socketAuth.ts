/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import type { Socket } from "socket.io";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { verifyToken } from "../utils/jwt";

export interface SocketAuthData {
  userId: string;
  user: any;
}
// interface IDecodedToken {
//   userId: string;
//   email: string;
//   role: Role;
//   iat?: number; // issued at  }
//   exp?: number; // expiration time
// }

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token =
      socket.handshake.auth?.token || (socket.handshake.query?.token as string);
    if (!token) {
      return next(new Error("Authentication token required"));
    }

    // Verify JWT token
    // const decoded: IDecodedToken = jwt.verify(
    //   token,
    //   envVars.JWT_ACCESS_SECRET
    // ) as any;
    const decoded = verifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return next(new Error("Invalid authentication token"));
    }

    // TODO: Optionally fetch user details from database
    // const user = await UserModel.findById(decoded.userId);
    // if (!user) {
    //   return next(new Error("User not found"));
    // }

    // Attach user data to socket
    socket.data = {
      userId: decoded.userId,
      user: decoded, // or full user object from database
    } as SocketAuthData;
    console.log(`🔐 Socket authenticated for user: ${decoded.userId}`);
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Authentication failed"));
  }
};
