/**
 * Integration test for GET /info.
 * Validates the merged info object from helpers.
 */
import request from "supertest"; // permet d'envoyer des requetes HTTP 
import app from "../src/app.js";
import { describe, it, expect } from "vitest";

describe("GET /info", () => {
  it("returns app info", async () => {
    const res = await request(app).get("/info"); // envoie une requete GET à /info
    expect(res.status).toBe(200); // on vérifie que le statu est 200 (succès)
    // on vérifie que name, version et node sont des string
    expect(typeof res.body.name).toBe("string");
    expect(typeof res.body.version).toBe("string");
    expect(typeof res.body.node).toBe("string");
    expect(typeof res.body.uptime).toBe("number"); // on vérifie que uptime est un nombre
  });

  it("has plausible node version & non-negative uptime", async () => {
    const res = await request(app).get("/info");
    expect(res.body.node).toMatch(/^v\d+\.\d+\.\d+/); // on vérifie que la version de Node.js a le bon format
    expect(res.body.uptime).toBeGreaterThanOrEqual(0); // on vérifie que uptime n'est pas négatif
  });
});
