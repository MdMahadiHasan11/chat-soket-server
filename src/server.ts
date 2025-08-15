/* eslint-disable no-console */
import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import "dotenv/config";
import { connectDB } from "./config/db";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./config/redis.config";
import { initializeSocketIO } from "./app/services/socket/socketService";
// import { initializeSocketIO } from "./services/socket/socketService";

const port = envVars.PORT;
let server: HttpServer;
let io: SocketIOServer;

async function startServer() {
  try {
    // Connect to databases first
    await connectDB();
    await connectRedis();

    // Create HTTP server
    server = app.listen(port, () => {
      console.log(`🚀 Server started at http://localhost:${port}`);
    });

    // Initialize Socket.IO with the HTTP server
    io = new SocketIOServer(server, {
      cors: {
        origin:
          process.env.NODE_ENV === "production" ? [envVars.FRONTEND_URL] : "*",
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Initialize Socket.IO services
    initializeSocketIO(io);

    // Seed super admin after server starts
    await seedSuperAdmin();

    console.log("✅ All services initialized successfully");
  } catch (error) {
    console.error("❌ Server initialization failed:", error);
    process.exit(1);
  }
}

// Graceful shutdown handlers
const gracefulShutdown = (signal: string) => {
  console.log(`👋 ${signal} RECEIVED. Shutting down gracefully`);

  if (server) {
    server.close(() => {
      console.log("💥 HTTP server closed");

      if (io) {
        io.close(() => {
          console.log("💥 Socket.IO server closed");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  } else {
    process.exit(0);
  }
};

// Error handlers
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  gracefulShutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start the server
startServer();

// Export for use in other modules
export { io };
