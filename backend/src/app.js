import dotenv from "dotenv";

import express from "express";
import fs from "node:fs";
import path  from "node:path";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { errorHandler } from "./utils/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const rootDir = path.join(__dirname, "../..");
dotenv.config({path: path.join(rootDir, ".env")});

const app = express();

/*app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

app.use(express.json()); */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    credentials: true,
  })
);

app.use(express.json());


app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Hello from DevOps Lab" });
});
app.get("/health", (_req, res) => res.status(200).send("OK"));

const apiDir = path.join(__dirname, "routes");
if (fs.existsSync(apiDir)) {
  const files = fs.readdirSync(apiDir).filter(f => f.endsWith(".route.js"));
  
  for (const file of files) {
    const fileName = path.basename(file, ".route.js");  
    const fullPath = path.join(apiDir, file);
    
    try {
      const mod = require(fullPath);
      const router = mod.default || mod;
      
      if (router) {
        app.use(`/api/${fileName}`, router);
        console.log(`Auto-mounted: /api/${fileName} ← ${file}`);
      }
    } catch (error) {
      console.error(`Erreur auto-mount ${file}:`, error.message);
    }
  }
}

const autoDir = path.join(__dirname, "routes", "auto");
if (fs.existsSync(autoDir)) {
  const files = fs.readdirSync(autoDir).filter(f => f.endsWith(".route.js"));
  for (const f of files) {
    const full = path.join(autoDir, f);
    const mod = require(full);
    const router = mod.default || mod;
    if (router) {
      app.use("/api", router);
      console.log(`Auto-mounted auto: ${f}`);
    }
  }
}

app.use(errorHandler);

export default app;