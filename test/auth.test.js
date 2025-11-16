import request from "supertest";
import {describe, it, expect, beforeEach} from "vitest";
import app from "../src/app.js";


describe("Auth API", () => {
    beforeEach(() => {
        // Réinitialiser le tableau users avant chaque test
        users.length = 0;
    });

    // -------------------------------
    // Test POST /register
    // -------------------------------
    describe("POST /register", () => {
        it("create a new user", async () => {
            const res = await request(app)
                .post("/register")
                .send({
                    name: "Pierre Martin",
                    email: "pierre.martin@gmail.com",
                    password: "1234",
                    role: "learner"
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("message", "Account created successfully");
        });

        it("should fail if the email already exists", async () => {
            // ajouter un utilisateur existant
            users.push({ id: 1, name: "Pierre Martin", email: "pierre.martin@gmail.com", password: "1234", role: "learner"});

            const res = await request(app)
                .post("/register")
                .send({
                    name: "Pierre Martin",
                    email: "pierre.martin@gmail.com",
                    password: "1234",
                });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Email already registered");
        });

        it("should fail if fields are missing", async () => {
            const res = await request(app)
                .post("/register")
                .send({ email: "pierre.martin@gmail.com"});
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message");
        });
    });

    // -------------------------------
    // Test POST /login
    // -------------------------------
    describe("POST /login", () => {
        it("log in an existing user", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({ id: 1, name: "Pierre Martin", email:"pierre.martin@gmail.com", password: hashed, role: "learner"});

            const res = await request(app)
                .post("/login")
                .send({ email: "pierre.martin@gmail.com", password: "1234"});
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "Login successful");
            expect(res.body).toHaveProperty("token");
        });

        it("should fail if the user does not exist", async () => {
            const res = await request(app)
                .post("/login")
                .send({ email: "martin.pierre@gmail.com", password: "1234"});
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("message", "User not found");
        });

        it("should fail if the password is incorrect", async () => {
            const hashed = await bcrypt.hash("1234", 10);
            users.push({ id: 1, name: "Pierre Martin", email: "pierre.martin@gmail.com", password: hashed, role: "learner"});

            const res = await request(app)
                .post("/login")
                .send({ email: "pierre.martin@gmail.com", password: "4321"});

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty("message", "Incorrect password");
        });
    });
});

