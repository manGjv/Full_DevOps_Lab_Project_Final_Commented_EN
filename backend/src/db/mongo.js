import { MongoClient } from "mongodb";

let client;
let db;

export async function connectToDb(uri) {
  try {
    client = new MongoClient(uri || process.env.MONGO_URI);
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB:", db.databaseName);
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

// Optionnel : fonction pour fermer la connexion (utile pour les tests)
export async function disconnectDb() {
  if (client) {
    await client.close();
    db = null;
  }
}
