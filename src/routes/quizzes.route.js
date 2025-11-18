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
        // CORRECTION 1 : La clé '1' doit être entre guillemets.
        correctAnswers: { "1": "const" } // Pour la notation 
    },
    { 
        id: 102, 
        courseId: 1, 
        title: "Express Routes", 
        level: "intermediate",
        questions: [{ qid: 1, text: "Status for POST success?" }],
        // CORRECTION 2 : La clé '1' doit être entre guillemets.
        correctAnswers: { "1": "201" }
    },
    { 
        id: 201, 
        courseId: 2, 
        title: "Docker Basics", 
        level: "beginner",
        questions: [{ qid: 1, text: "Command to build image?" }],
        // CORRECTION 3 : La clé '1' doit être entre guillemets.
        correctAnswers: { "1": "docker build" }
    }
];

// Fonction utilitaire de notation (Simplifiée)
// La fonction calculateScore reste inchangée, car elle accède 
// aux clés via la notation [clé] qui fonctionne pour les chaînes.
const calculateScore = (quiz, answers) => {
    let score = 0;
    const totalQuestions = quiz.questions.length;
    
    for (const q of quiz.questions) {
        // q.qid est 1. La ligne suivante vérifie answers[1] contre quiz.correctAnswers["1"]
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

// GET /api/quizzes/:courseId
router.get("/:courseId", (req, res) => {
    // Récupérer le courseId depuis les paramètres de l'URL
    const courseId = parseInt(req.params.courseId);

    // Filtrer les quizzes par courseId
    const courseQuizzes = quizzes.filter(q => q.courseId === courseId);

    if (courseQuizzes.length === 0) {
        // Retourne 404 si aucun quiz n'est trouvé pour ce cours
        return res.status(404).json({ error: "No quizzes found for this course" });
    }

    res.status(200).json(courseQuizzes);
});

// POST /api/quizzes/:id/submit
router.post("/:id/submit", (req, res) => {
    const quizId = parseInt(req.params.id);
    const { answers } = req.body; // { answers: { qid: 1, "reponse" } }
    
    // 1. Validation de base des données
    if (!answers || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: "Missing quiz answers" });
    }

    // 2. Trouver le quiz
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
    }

    // 3. Calculer le score et le feedback (voir fonction calculateScore)
    const result = calculateScore(quiz, answers);
    
    // 4. Mettre à jour la progression de l'utilisateur (logique simplifiée)
    // Ici, vous ajouteriez la logique d'appel à l'API Progression (/api/users/{id}/progress)
    
    // 5. Réponse
    res.status(200).json({
        quizId: quizId,
        score: result.score,
        total: result.total,
        percentage: (result.score / result.total) * 100,
        feedback: result.feedback
    });
});

// POST /api/quizzes
router.post("/", (req, res) => {
    // Dans une application réelle, une vérification du JWT (Content Manager role) serait ici.
    
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

    res.status(201).json(newQuiz); // 201 Created
});

export default router;