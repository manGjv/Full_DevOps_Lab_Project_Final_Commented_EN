import express from "express";
const router = express.Router();

// Simulation de la 'base de données' des quizzes
let quizzes = [
    { 
        id: 101, 
        courseId: 1, 
        title: "Introduction à JavaScript", 
        level: "beginner",
        questions: [{ qid: 1, text: "var vs const ?" }],
        correctAnswers: { "1": "const" }
    },
    { 
        id: 102, 
        courseId: 1, 
        title: "Express Routes", 
        level: "intermediate",
        questions: [{ qid: 1, text: "Status for POST success?" }],
        correctAnswers: { "1": "201" }
    },
    { 
        id: 201, 
        courseId: 2, 
        title: "Docker Basics", 
        level: "beginner",
        questions: [{ qid: 1, text: "Command to build image?" }],
        correctAnswers: { "1": "docker build" }
    }
];

// Fonction utilitaire de notation (Simplifiée)
const calculateScore = (quiz, answers) => {
    let score = 0;
    const totalQuestions = quiz.questions.length;
    
    for (const q of quiz.questions) {
        if (answers[q.qid] === quiz.correctAnswers[q.qid]) {
            score++;
        }
    }
    return { 
        score: score, 
        total: totalQuestions, 
        feedback: score === totalQuestions ? "Félicitations ! Badge débloqué." : "À revoir."
    };
};

// --- READ (R) : Récupérer tous les quizzes (/api/quizzes)
// Correspond à "List all" dans la table des endpoints.
router.get("/", (req, res) => {
    // Dans une application réelle, on pourrait ajouter une pagination ou des filtres.
    res.status(200).json(quizzes); 
});

// --- READ (R) : Récupérer les quizzes d'un cours (existant)
// GET /api/quizzes/:courseId
router.get("/:courseId", (req, res) => {
    const courseId = parseInt(req.params.courseId);
    const courseQuizzes = quizzes.filter(q => q.courseId === courseId);

    if (courseQuizzes.length === 0) {
        return res.status(404).json({ error: "No quizzes found for this course" }); 
    }

    res.status(200).json(courseQuizzes);
});

// --- READ (R) : Récupérer un quiz par ID (Complément à l'existant)
// Correspond à "Retrieve by ID" dans la table des endpoints, avec un ID unique pour l'entité.
// GET /api/quizzes/quiz/:id
router.get("/quiz/:id", (req, res) => {
    const id = Number(req.params.id); 
    const quiz = quizzes.find(q => q.id === id); 

    if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" }); 
    }

    res.json(quiz); 
});

// --- CREATE (C) : Créer un nouveau quiz (existant)
// POST /api/quizzes - Correspond à "Create" dans la table des endpoints.
router.post("/", (req, res) => {
    // ... (Logique de validation et de création existante)
    const { courseId, title, level, questions, correctAnswers } = req.body;

    if (!courseId || !title || !questions || !correctAnswers) {
        return res.status(400).json({ error: "Missing required fields for quiz creation" });
    }

    const newQuiz = {
        id: quizzes.length > 0 ? quizzes[quizzes.length - 1].id + 1 : 1,
        courseId: courseId,
        title: title,
        level: level || "intermediate",
        questions: questions,
        correctAnswers: correctAnswers
    };

    quizzes.push(newQuiz); 

    res.status(201).json(newQuiz); // 201 Created [cite: 58]
});

// --- POST : Soumettre les réponses au quiz (existant)
// POST /api/quizzes/:id/submit
router.post("/:id/submit", (req, res) => {
    // ... (Logique de soumission existante)
    const quizId = parseInt(req.params.id);
    const { answers } = req.body;
    
    if (!answers || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: "Missing quiz answers" });
    }

    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
    }

    const result = calculateScore(quiz, answers);
    
    res.status(200).json({
        quizId: quizId,
        score: result.score,
        total: result.total,
        percentage: (result.score / result.total) * 100,
        feedback: result.feedback
    });
});


// --- UPDATE (U) : Mettre à jour un quiz existant
// PUT /api/quizzes/:id - Correspond à "Update" dans la table des endpoints.
router.put("/:id", (req, res) => {
    const id = Number(req.params.id); 
    const index = quizzes.findIndex(q => q.id === id); 

    if (index === -1) {
        return res.status(404).json({ error: "Quiz not found" }); 
    }
    
    // Fusionne les données existantes avec le nouveau corps de la requête (req.body)
    quizzes[index] = { ...quizzes[index], ...req.body }; 
    
    res.json(quizzes[index]); 
});

// --- DELETE (D) : Supprimer un quiz
// DELETE /api/quizzes/:id - Correspond à "Delete" dans la table des endpoints.
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id); 
    const before = quizzes.length; 
    
    // Filtre pour garder tous les quizzes dont l'ID est différent de celui à supprimer
    quizzes = quizzes.filter(q => q.id !== id); 

    if (quizzes.length === before) {
        return res.status(404).json({ error: "Quiz not found" }); 
    }
    
    res.status(204).end(); // 204 No Content - Succès sans corps de réponse [cite: 77]
});


export default router;