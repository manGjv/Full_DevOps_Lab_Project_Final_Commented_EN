import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    registerUser,
    loginUser
} from "../../src/controllers/user.controller.js";

import User from "../../src/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock Mongoose + bcrypt + jwt
vi.mock("../../src/models/user.model.js");
vi.mock("bcrypt");
vi.mock("jsonwebtoken");

function mockReq(data) {
    return { body: data, params: {}, query: {} };
}

function mockRes() {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

describe("User Controller - Unit Tests", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------
    // REGISTER
    // -------------------------
    it("registerUser → creates a new user", async () => {
        const req = mockReq({
            name: "Test",
            email: "test@mail.com",
            password: "123456"
        });

        const res = mockRes();

        User.findOne.mockResolvedValue(null); // email not taken
        bcrypt.hash.mockResolvedValue("hashedPassword");

        User.create.mockResolvedValue({
            _id: "abc123",
            name: "Test",
            email: "test@mail.com",
            role: "learner"
        });

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Account created successfully",
            user: {
                id: "abc123",
                name: "Test",
                email: "test@mail.com",
                role: "learner"
            }
        });
    });

    // -------------------------
    // LOGIN
    // -------------------------
    it("loginUser → returns a token on success", async () => {
        const req = mockReq({
            email: "test@mail.com",
            password: "123456"
        });

        const res = mockRes();

        User.findOne.mockResolvedValue({
            _id: "abc123",
            email: "test@mail.com",
            password: "hashedPass",
            role: "learner"
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("fakeToken");

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Login successful",
                token: "fakeToken"
            })
        );
    });
});
