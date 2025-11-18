// test/quizzes.test.js

// Importe explicitement les fonctions de la suite de tests (Mocha/Vitest)
import { describe, it, expect } from "vitest"; // Si le projet utilise Vitest
// Si le projet utilise Mocha, cette ligne peut être omise si la configuration est correcte
// Mais dans un environnement NodeJS moderne, l'import est souvent obligatoire.

import request from "supertest"; // Pour simuler la requête HTTP
import app from "../src/app.js"; // Votre application Express

// Décrit la suite de tests pour l'API Quizzes
describe("Quizzes API", () => { 

    // --- Test 1 : Récupérer les quizzes pour un cours (GET /api/quizzes/1) ---
    it("GET /api/quizzes/1 should return an array of quizzes", async () => {
        const res = await request(app).get("/api/quizzes/1");
        
        // Assertion 1: Le statut HTTP doit être 200 OK
        expect(res.status).toBe(200); 
        
        // Assertion 2: Le corps de la réponse doit être un tableau (liste de quizzes)
        expect(Array.isArray(res.body)).toBe(true); 
    });

    // --- Test 2 : Créer un nouveau quiz (POST /api/quizzes) ---
    it("POST /api/quizzes should add a new quiz and return 201", async () => {
        // Corps JSON minimal pour la création
        const newQuizData = { 
            courseId: 3, 
            title: "Test Unitaires CI", 
            questions: [{ qid: 1, text: "Q1" }],
            correctAnswers: { "1": "A" }
        };

        const res = await request(app)
            .post("/api/quizzes")
            .send(newQuizData);

        // Assertion 1: Le statut HTTP doit être 201 Created (comme dans le Lab)
        expect(res.status).toBe(201); 
        
        // Assertion 2: L'objet retourné doit avoir une propriété 'id'
        expect(res.body).toHaveProperty("id"); 
    });
    
    // --- Test 3 : Soumettre les réponses et obtenir le score (POST /api/quizzes/101/submit) ---
    it("POST /api/quizzes/101/submit should return the score object", async () => {
        const res = await request(app)
            .post("/api/quizzes/101/submit")
            .send({
                answers: { "1": "const" } // Réponses correctes pour le Quiz 101 (basé sur les données du Lab)
            });
            
        // Assertion 1: Le statut HTTP doit être 200 OK 
        expect(res.status).toBe(200); 

        // Assertion 2: L'objet retourné doit contenir la propriété 'score' et 'total'
        expect(res.body).toHaveProperty("score"); 
        expect(res.body).toHaveProperty("total");
    });
});