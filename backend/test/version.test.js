/**
 * Integration test for GET /version.
 * Focus: HTTP behavior & payload shape.
 */
import request from "supertest"; // outil pour faire des requetes HTTP
import app from "../src/app.js"; 
import { describe, it, expect } from "vitest"; // permet de faire des tests

// describe sert à regrouper plusieurs tests 
describe("GET /version", () => {
  // it définit un test individuel
  it("returns package version as a non-empty string", async () => {
    const res = await request(app).get("/version"); // envoie une requete GET à /version sur le serveur express (await permet d'attendre la réponse pour continuer)
    expect(res.status).toBe(200); // le code HTTP doit etre 200
    expect(typeof res.body.version).toBe("string"); // le champ doit être une chaine de caractères
    expect(res.body.version.length).toBeGreaterThan(0); // la chaine ne doit pas être vide
  });

  it("responds with JSON content-type", async () => {
    const res = await request(app).get("/version");
    expect(res.headers["content-type"]).toMatch(/application\/json/); // vérifie que le serveur renvoie un en-tete HTTP Content-Type : application/json
  });
});
