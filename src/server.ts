/* eslint-disable no-console */
// src/server.ts
import { Server as HttpServer } from "http";
import app from "./app";
import "dotenv/config";
import { connectDB } from "./config/db";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./config/redis.config";
// import { connectDB } from "./config/db";

const port = envVars.PORT;
let server: HttpServer;

async function startServer() {
  await connectDB();
  server = app.listen(port, () => {
    console.log(`🚀 Server started at http://localhost:${port}`);
  });
}

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection at: Promise . Shutting down", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("Unhandled Rejection at: Promise . Shutting down"));

process.on("uncaughtException", (error) => {
  console.log("UnCaught Exception at: Promise . Shutting down", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// throw new Error("UnCaught Rejection at: Promise . Shutting down");

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("💥 Process terminated!");
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT RECEIVED. Shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("💥 Process terminated!");
      process.exit(1);
    });
  }
  process.exit(1);
});
