import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest"; 
import app from "../../src/app.js"; 
import mongoose from "mongoose"; 
import Quiz from "../../src/models/quizzes.model.js"; 
import { MongoMemoryServer } from "mongodb-memory-server";

const FAKE_MONGO_ID = new mongoose.Types.ObjectId().toString();
let createdQuizId; 
let existingCourseId = "507f1f77bcf86cd799439011"; 
let mongoServer;

describe("Integration Test: Quizzes API - Full CRUD", () => { 
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const testUri = mongoServer.getUri();
        await mongoose.connect(testUri);
    }, 30000);

    afterAll(async () => {
        await mongoose.disconnect();
        if (mongoServer) await mongoServer.stop();
    });

    it("POST /api/quizzes should create a new quiz, return 201, and save its Mongo ID", async () => {
        const newQuizData = { 
            courseId: existingCourseId, 
            title: "Test Integration - Creation", 
            questions: [
                { 
                    text: "Question pour le test",
                    options: ["Option 0", "Option 1"],
                    correctIndex: 0 
                }
            ]
        };

        const res = await request(app)
            .post("/api/quizzes")
            .send(newQuizData);

        expect(res.status).toBe(201); 
        expect(res.body).toHaveProperty("quiz"); 
        expect(res.body.quiz.title).toBe("Test Integration - Creation");
        
        createdQuizId = res.body.quiz._id; 
    });
    
    it("GET /api/quizzes/:id should return the specific quiz created", async () => {
        const res = await request(app).get(`/api/quizzes/${createdQuizId}`);
        
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(createdQuizId);
        expect(res.body.questions[0].correctIndex).toBe(0); 
    });
    
    it("GET /api/quizzes?courseId=... should filter quizzes by course ID", async () => {
        const res = await request(app).get(`/api/quizzes?courseId=${existingCourseId}`);
        
        expect(res.status).toBe(200); 
        expect(res.body).toHaveProperty("quizzes");
        expect(res.body.quizzes.some(q => q._id === createdQuizId)).toBe(true);
    });

    it("PUT /api/quizzes/:id should update the quiz title and return 200", async () => {
        const updateData = { title: "Titre mis à jour par PUT" };
        const res = await request(app)
            .put(`/api/quizzes/${createdQuizId}`)
            .send(updateData);

        expect(res.status).toBe(200);
        expect(res.body.quiz.title).toBe("Titre mis à jour par PUT");
    });

    it("POST /api/quizzes/:id/submit should calculate and return the score", async () => {
        const res = await request(app)
            .post(`/api/quizzes/${createdQuizId}/submit`)
            .send({
                answers: { "0": 0 } 
            });
            
        expect(res.status).toBe(200); 
        expect(res.body.score).toBe(1); 
        expect(res.body.percentage).toBe(100);
    });
    
    it("DELETE /api/quizzes/:id should remove the created quiz and return 204", async () => {
        const res = await request(app).delete(`/api/quizzes/${createdQuizId}`);

        expect(res.status).toBe(204); 
        
        const checkRes = await request(app).get(`/api/quizzes/${createdQuizId}`);
        expect(checkRes.status).toBe(404);
    });
    
    it("GET /api/quizzes/:id with a non-existent but valid Mongo ID should return 404", async () => {
        const res = await request(app).get(`/api/quizzes/${FAKE_MONGO_ID}`);
        expect(res.status).toBe(404);
    });
});