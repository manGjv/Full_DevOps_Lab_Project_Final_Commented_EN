/**
 * Integration test for GET /health.
 */
import request from "supertest"; // bibliothèque pour simuler des requetes HTTP
import app from "../src/app.js";
import { describe, it, expect } from "vitest";

describe("GET /health", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/health"); // simule une requete HTTP GET vers /health
    expect(res.status).toBe(200); // on vérifie qye la réponse HTTP renvoie le code de statut 200
  });
});
