import request from "supertest";
import {describe, it, expect, beforeEach} from "vitest";
import app from "../src/app.js";
import { users } from "../src/routes/auth.route.js";
import bcrypt from "bcrypt";

describe("Auth API - CRUD Operations", () => {
    beforeEach(() => {
        // Réinitialiser le tableau users avant chaque test
        users.length = 0;
    });

    // ===== CREATE - POST /api/auth/register =====
    describe("CREATE - POST /api/auth/register", () => {
        it("should create a new user and return 201", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Pierre Martin",
                    email: "pierre.martin@gmail.com",
                    password: "1234",
                    role: "learner"
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("message", "Account created successfully");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("id");
            expect(res.body.user.name).toBe("Pierre Martin");
            expect(res.body.user).not.toHaveProperty("password"); // Security check
        });

        it("should set default role to 'learner' if not provided", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Alice",
                    email: "alice@gmail.com",
                    password: "pass123"
                });

            expect(res.status).toBe(201);
            expect(res.body.user.role).toBe("learner");
        });

        it("should fail if the email already exists", async () => {
            users.push({ 
                id: 1, 
                name: "Pierre Martin", 
                email: "pierre.martin@gmail.com", 
                password: "1234", 
                role: "learner"
            });

            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    name: "Pierre Dupont",
                    email: "pierre.martin@gmail.com",
                    password: "5678",
                });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Email already registered");
        });

        it("should fail if name is missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ 
                    email: "pierre.martin@gmail.com",
                    password: "1234"
                });
            
            expect(res.status).toBe(400);
            expect(res.body.message).toContain("required");
        });

        it("should fail if email is missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ 
                    name: "Pierre",
                    password: "1234"
                });
            
            expect(res.status).toBe(400);
            expect(res.body.message).toContain("required");
        });

        it("should fail if password is missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ 
                    name: "Pierre",
                    email: "pierre@gmail.com"
                });
            
            expect(res.status).toBe(400);
            expect(res.body.message).toContain("required");
        });
    });

    // ===== READ - GET /api/auth/users =====
    describe("READ - GET /api/auth/users", () => {
        it("should return all users without passwords", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push(
                { id: 1, name: "Pierre", email: "pierre@gmail.com", password: hashed, role: "learner" },
                { id: 2, name: "Marie", email: "marie@gmail.com", password: hashed, role: "admin" }
            );

            const res = await request(app).get("/api/auth/users");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("count", 2);
            expect(res.body).toHaveProperty("users");
            expect(Array.isArray(res.body.users)).toBe(true);
            expect(res.body.users[0]).not.toHaveProperty("password");
        });

        it("should return empty array when no users exist", async () => {
            const res = await request(app).get("/api/auth/users");

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(0);
            expect(res.body.users).toEqual([]);
        });
    });

    // ===== READ - GET /api/auth/users/:id =====
    describe("READ - GET /api/auth/users/:id", () => {
        it("should return a specific user by ID", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({ id: 1, name: "Pierre", email: "pierre@gmail.com", password: hashed, role: "learner" });

            const res = await request(app).get("/api/auth/users/1");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("id", 1);
            expect(res.body).toHaveProperty("name", "Pierre");
            expect(res.body).not.toHaveProperty("password");
        });

        it("should return 404 if user does not exist", async () => {
            const res = await request(app).get("/api/auth/users/999");

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("message", "User not found");
        });

        it("should return 400 for invalid user ID format", async () => {
            const res = await request(app).get("/api/auth/users/abc");

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Invalid user ID");
        });
    });

    // ===== POST /api/auth/login (Authentication) =====
    describe("POST /api/auth/login", () => {
        it("should log in an existing user", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({ 
                id: 1, 
                name: "Pierre Martin", 
                email:"pierre.martin@gmail.com", 
                password: hashed, 
                role: "learner"
            });

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "pierre.martin@gmail.com", password: "1234"});
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "Login successful");
            expect(res.body).toHaveProperty("token");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).not.toHaveProperty("password");
        });

        it("should fail if the user does not exist", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "nonexistent@gmail.com", password: "1234"});
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("message", "User not found");
        });

        it("should fail if the password is incorrect", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({ 
                id: 1, 
                name: "Pierre Martin", 
                email: "pierre.martin@gmail.com", 
                password: hashed, 
                role: "learner"
            });

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "pierre.martin@gmail.com", password: "wrong"});

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("message", "Incorrect password");
        });

        it("should fail if email is missing", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ password: "1234" });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain("required");
        });

        it("should fail if password is missing", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "pierre@gmail.com" });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain("required");
        });
    });

    // ===== UPDATE - PUT /api/auth/users/:id =====
    describe("UPDATE - PUT /api/auth/users/:id", () => {
        it("should update an existing user", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({
                id: 1,
                name: "Pierre",
                email: "pierre@gmail.com",
                password: hashed,
                role: "learner"
            });

            const res = await request(app)
                .put("/api/auth/users/1")
                .send({
                    name: "Pierre Martin",
                    role: "admin"
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "User updated");
            expect(res.body.user.name).toBe("Pierre Martin");
            expect(res.body.user.role).toBe("admin");
            expect(res.body.user).not.toHaveProperty("password");
        });

        it("should update only provided fields (partial update)", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({
                id: 1,
                name: "Pierre",
                email: "pierre@gmail.com",
                password: hashed,
                role: "learner"
            });

            const res = await request(app)
                .put("/api/auth/users/1")
                .send({
                    email: "new.email@gmail.com"
                });

            expect(res.status).toBe(200);
            expect(res.body.user.email).toBe("new.email@gmail.com");
            expect(res.body.user.name).toBe("Pierre");
            expect(res.body.user.role).toBe("learner");
        });

        it("should rehash password when updated", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({
                id: 1,
                name: "Pierre",
                email: "pierre@gmail.com",
                password: hashed,
                role: "learner"
            });

            const res = await request(app)
                .put("/api/auth/users/1")
                .send({ password: "newpass" });

            expect(res.status).toBe(200);

            // Vérifier que le nouveau mot de passe fonctionne
            const user = users.find(u => u.id === 1);
            const isMatch = await bcrypt.compare("newpass", user.password);
            expect(isMatch).toBe(true);
        });

        it("should return 404 if user does not exist", async () => {
            const res = await request(app)
                .put("/api/auth/users/999")
                .send({ name: "Test" });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("message", "User not found");
        });

        it("should return 400 if no fields are provided", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({
                id: 1,
                name: "Pierre",
                email: "pierre@gmail.com",
                password: hashed,
                role: "learner"
            });

            const res = await request(app)
                .put("/api/auth/users/1")
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.message).toContain("At least one field");
        });

        it("should return 400 if email is already in use by another user", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push(
                { id: 1, name: "Pierre", email: "pierre@gmail.com", password: hashed, role: "learner" },
                { id: 2, name: "Marie", email: "marie@gmail.com", password: hashed, role: "learner" }
            );

            const res = await request(app)
                .put("/api/auth/users/1")
                .send({ email: "marie@gmail.com" });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain("already in use");
        });

        it("should return 400 for invalid user ID format", async () => {
            const res = await request(app)
                .put("/api/auth/users/abc")
                .send({ name: "Test" });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Invalid user ID");
        });
    });

    // ===== DELETE - DELETE /api/auth/users/:id =====
    describe("DELETE - DELETE /api/auth/users/:id", () => {
        it("should delete an existing user", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({ 
                id: 1, 
                name: "Pierre", 
                email: "pierre@gmail.com",
                password: hashed,
                role: "learner"
            });

            const res = await request(app).delete("/api/auth/users/1");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "User deleted successfully");
            expect(res.body.user).toHaveProperty("id", 1);
            expect(res.body.user).not.toHaveProperty("password");
            expect(users.length).toBe(0);
        });

        it("should return 404 if user does not exist", async () => {
            const res = await request(app).delete("/api/auth/users/999");

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("message", "User not found");
        });

        it("should return 400 for invalid user ID format", async () => {
            const res = await request(app).delete("/api/auth/users/abc");

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Invalid user ID");
        });

        it("should actually remove the user from the list", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push(
                { id: 1, name: "Pierre", email: "pierre@gmail.com", password: hashed, role: "learner" },
                { id: 2, name: "Marie", email: "marie@gmail.com", password: hashed, role: "admin" }
            );

            // Vérifier qu'il y a 2 utilisateurs
            expect(users.length).toBe(2);

            // Supprimer le premier
            await request(app).delete("/api/auth/users/1");

            // Vérifier qu'il n'en reste qu'un
            expect(users.length).toBe(1);
            expect(users[0].id).toBe(2);
        });
    });
});