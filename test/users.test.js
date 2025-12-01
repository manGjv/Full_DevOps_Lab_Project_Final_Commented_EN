import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js"; 

describe("Users API CRUD + special routes", () => {


it("GET /api/users should return all users", async () => {
const res = await request(app).get("/api/users");

expect(res.status).toBe(200);
expect(Array.isArray(res.body)).toBe(true);


});


it("GET /api/users/1 should return user 1", async () => {
const res = await request(app).get("/api/users/1");

expect(res.status).toBe(200);
expect(res.body).toHaveProperty("id", 1);


});

it("GET /api/users/999 should return 404", async () => {
const res = await request(app).get("/api/users/999");

expect(res.status).toBe(404);
expect(res.body).toHaveProperty("error");


});

/* ------------------------------
POST (Create)
------------------------------*/
it("POST /api/users should create a new user", async () => {
const newUser = {
name: "Charlie",
points: 50,
hoursSpent: 3,
modulesCompleted: 1,
badges: ["Newbie"]
};


const res = await request(app)
  .post("/api/users")
  .send(newUser);

expect(res.status).toBe(201);
expect(res.body).toHaveProperty("id");
expect(res.body.name).toBe("Charlie");


});

/* ------------------------------
PUT (Update)
------------------------------*/
it("PUT /api/users/1 should update user 1", async () => {
const res = await request(app)
.put("/api/users/1")
.send({ points: 200 });

expect(res.status).toBe(200);
expect(res.body.points).toBe(200);


});

it("PUT /api/users/999 should return 404", async () => {
const res = await request(app)
.put("/api/users/999")
.send({ points: 300 });

expect(res.status).toBe(404);


});

/* ------------------------------
DELETE
------------------------------*/
it("DELETE /api/users/2 should delete user 2", async () => {
const res = await request(app).delete("/api/users/2");


expect(res.status).toBe(204);


});

it("DELETE /api/users/999 should return 404", async () => {
const res = await request(app).delete("/api/users/999");


expect(res.status).toBe(404);


});

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
