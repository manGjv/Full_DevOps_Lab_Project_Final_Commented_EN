import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js"; 

describe("Users API CRUD + special routes", () => {

/* ------------------------------
SPECIAL ROUTES
------------------------------*/
it("GET /api/users/1/progress should return progress", async () => {
const res = await request(app).get("/api/users/1/progress");

expect(res.status).toBe(200);
expect(res.body).toHaveProperty("points");
expect(res.body).toHaveProperty("hoursSpent");
expect(res.body).toHaveProperty("modulesCompleted");
expect(res.body).toHaveProperty("badges");


});

it("GET /api/users/1/badges should return badges", async () => {
const res = await request(app).get("/api/users/1/badges");


expect(res.status).toBe(200);
expect(Array.isArray(res.body.badges)).toBe(true);


});

});
