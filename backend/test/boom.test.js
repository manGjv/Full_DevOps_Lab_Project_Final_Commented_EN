/**
 * Integration test for GET /boom.
 * Ensures global error handler shapes the response.
 */
import request from "supertest"; // permet d'envoyer de fausses requetes HTTP 
import app from "../src/app.js";
import { describe, it, expect } from "vitest";

describe("GET /boom", () => {
  it("returns 500 with error payload", async () => {
    const res = await request(app).get("/boom"); // simule une requete HTTP GET sur la route /boom (await permet d'attendre la réponse du serveur)
    expect(res.status).toBe(500); // le code HTTP doit etre 500 (Internal Server Error)
    expect(res.body.error).toBe(true); // le crops JSON doit contenir error = true
    expect(typeof res.body.message).toBe("string"); // il doit y avoir une clé message (string)
  });
});
