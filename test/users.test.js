import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js"; // adapte le chemin si ton app.js est ailleurs

describe("Users API", () => {
  // Test de la route /api/users/:id/progress
  it("GET /api/users/1/progress should return user progress", async () => {
    const res = await request(app).get("/api/users/1/progress");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("points");
    expect(res.body).toHaveProperty("hoursSpent");
    expect(res.body).toHaveProperty("modulesCompleted");
    expect(res.body).toHaveProperty("badges");
    expect(Array.isArray(res.body.badges)).toBe(true);
  });

  // Test de la route /api/users/:id/badges
  it("GET /api/users/1/badges should return badges", async () => {
    const res = await request(app).get("/api/users/1/badges");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("badges");
    expect(Array.isArray(res.body.badges)).toBe(true);
  });

  // Test utilisateur non existant
  it("GET /api/users/999/progress should return 404", async () => {
    const res = await request(app).get("/api/users/999/progress");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });
});
