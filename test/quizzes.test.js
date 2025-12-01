// test/quizzes.test.js

// Importe explicitement les fonctions de la suite de tests (Vitest)
import { describe, it, expect } from "vitest"; 
import request from "supertest"; // Pour simuler la requête HTTP
// NOTE: Assurez-vous que le fichier '../src/app.js' exporte votre application Express
// et que vos routes Quizzes sont bien incluses.
import app from "../src/app.js"; 

// Définit un ID de quiz qui sera créé lors de l'exécution
// pour être utilisé dans les tests suivants (GET, DELETE).
let createdQuizId; 

// Décrit la suite de tests pour l'API Quizzes
describe("Quizzes API - Tests C-R-D", () => { 

    // --- READ (R) : Récupérer les quizzes pour un cours (GET /api/quizzes/1) ---
    it("GET /api/quizzes/1 should return an array of quizzes for course 1", async () => {
        const res = await request(app).get("/api/quizzes/1");
        
        // Assertion 1: Le statut HTTP doit être 200 OK
        expect(res.status).toBe(200); 
        
        // Assertion 2: Le corps de la réponse doit être un tableau
        expect(Array.isArray(res.body)).toBe(true); 

        // Assertion 3: S'assurer que les quizzes sont bien filtrés par courseId 1
        expect(res.body.every(q => q.courseId === 1)).toBe(true);
    });

    // --- CREATE (C) : Créer un nouveau quiz (POST /api/quizzes) ---
    it("POST /api/quizzes should add a new quiz and return 201, saving its ID for future tests", async () => {
        // Corps JSON minimal pour la création
        const newQuizData = { 
            courseId: 3, 
            title: "Test Unitaires CI", 
            questions: [{ qid: 1, text: "Q1: What is CI?" }],
            correctAnswers: { "1": "Continuous Integration" }
        };

        const res = await request(app)
            .post("/api/quizzes")
            .send(newQuizData);

        // Assertion 1: Le statut HTTP doit être 201 Created
        expect(res.status).toBe(201); 
        
        // Assertion 2: L'objet retourné doit avoir une propriété 'id'
        expect(res.body).toHaveProperty("id"); 

        // Sauvegarde l'ID pour le test de lecture et de suppression
        createdQuizId = res.body.id; 
    });
    
    // --- READ (R) : Récupérer un quiz par ID (GET /api/quizzes/quiz/:id) ---
    it("GET /api/quizzes/quiz/:id should return the specific quiz created", async () => {
        // Utilise l'ID créé dans le test précédent
        const res = await request(app).get(`/api/quizzes/quiz/${createdQuizId}`);
        
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdQuizId);
        expect(res.body.title).toBe("Test Unitaires CI");
    });

    // --- READ (R) : Tester un ID non trouvé (GET /api/quizzes/quiz/9999) ---
    it("GET /api/quizzes/quiz/9999 should return 404 Not Found", async () => {
        const res = await request(app).get("/api/quizzes/quiz/9999");
        
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
    
    // --- Soumission (Action spécifique) : Tester la soumission (POST /api/quizzes/101/submit) ---
    it("POST /api/quizzes/101/submit should return the score object", async () => {
        const res = await request(app)
            .post("/api/quizzes/101/submit")
            .send({
                answers: { "1": "const" } // Réponse correcte pour Quiz 101
            });
            
        // Assertion 1: Le statut HTTP doit être 200 OK 
        expect(res.status).toBe(200); 

        // Assertion 2: L'objet retourné doit contenir le score
        expect(res.body).toHaveProperty("score"); 
        expect(res.body.score).toBe(1); // Score attendu
        expect(res.body).toHaveProperty("total");
    });
    
    // --- DELETE (D) : Supprimer le quiz créé (DELETE /api/quizzes/:id) ---
    it("DELETE /api/quizzes/:id should remove the created quiz and return 204", async () => {
        const res = await request(app).delete(`/api/quizzes/${createdQuizId}`);

        // Assertion 1: Le statut HTTP doit être 204 No Content
        expect(res.status).toBe(204); 
        
        // Assertion 2: Le corps de la réponse doit être vide pour un 204
        expect(res.body).toEqual({}); 
        
        // Vérification finale: Tenter de récupérer le quiz supprimé doit renvoyer 404
        const checkRes = await request(app).get(`/api/quizzes/quiz/${createdQuizId}`);
        expect(checkRes.status).toBe(404);
    });
    
    // --- DELETE (D) : Tester un ID non trouvé (DELETE /api/quizzes/9999) ---
    it("DELETE /api/quizzes/9999 should return 404 Not Found", async () => {
        const res = await request(app).delete("/api/quizzes/9999");
        
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});