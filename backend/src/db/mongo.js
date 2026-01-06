import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

let client;
let db;

dotenv.config({ path: path.resolve("../.env") }); 

export async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDb() first.");
  }
  return db;
}

export async function disconnectDb() {
  if (client) {
    await client.close();
    db = null;
  }
}
