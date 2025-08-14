/* eslint-disable no-console */
// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { envVars } from "./env";

dotenv.config();

const uri = envVars.DB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};
