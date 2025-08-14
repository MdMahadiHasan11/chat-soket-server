"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./config/redis.config");
// import { connectDB } from "./config/db";
const port = env_1.envVars.PORT;
let server;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.connectDB)();
        server = app_1.default.listen(port, () => {
            console.log(`🚀 Server started at http://localhost:${port}`);
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield startServer();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
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
