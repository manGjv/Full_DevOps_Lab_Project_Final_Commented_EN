// test/integration/authApi.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";

let mongoServer;
let testUser;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  testUser = await User.create({
    name: "Test User",
    email: "test@mail.com",
    password: await bcrypt.hash("123456", 10),
    points: 50,
    hoursSpent: 10,
    badges: ["beginner"],
  });
});

describe("Users API - CRUD Operations", () => {
  it("GET /api/users → returns list", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body.users)).toEqual(true);
    expect(res.body.count).toEqual(1);
  });

  it("GET /api/users/:id → returns specific user", async () => {
    const res = await request(app).get(`/api/users/${testUser._id}`);
    expect(res.status).toEqual(200);
    expect(res.body.email).toEqual(testUser.email);
  });

  it("DELETE /api/users/:id → deletes the user", async () => {
    const res = await request(app).delete(`/api/users/${testUser._id}`);
    expect(res.status).toEqual(200);

    const deletedUser = await User.findById(testUser._id);
    expect(deletedUser).toBeNull();
  });

  it("POST /api/auth/login → authenticates user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "123456" });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});