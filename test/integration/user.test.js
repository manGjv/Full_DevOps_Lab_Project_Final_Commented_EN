// test/integration/user.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/user.model.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

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
    password: "123456",
    points: 50,
    hoursSpent: 10,
    badges: ["beginner"],
  });
});

describe("Users API CRUD + special routes", () => {
  it("GET /api/users/:id/progress should return progress", async () => {
    const res = await request(app).get(
      `/api/users/${testUser._id}/progress`
    );

    expect(res.status).toEqual(200);
    expect(res.body.points).toEqual(50);
    expect(res.body.hoursSpent).toEqual(10);
  });

  it("GET /api/users/:id/badges should return badges", async () => {
    const res = await request(app).get(
      `/api/users/${testUser._id}/badges`
    );

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body.badges)).toEqual(true);
    expect(res.body.badges).toContain("beginner");
  });
});