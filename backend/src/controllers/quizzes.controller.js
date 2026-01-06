import Quiz from "../models/quizzes.model.js";

function calculateScore(quiz, answers) {
    let score = 0;
    const totalQuestions = quiz.questions.length;

    for (let i = 0; i < totalQuestions; i++) {
        const question = quiz.questions[i];
        if (answers[i] !== undefined && answers[i] === question.correctIndex) {
            score++;
        }
    }
    
    return {
        score: score,
        total: totalQuestions,
        feedback: score === totalQuestions ? "Félicitations ! Badge débloqué." : "À revoir."
    };
}

// GET /api/quizzes
export async function listQuizzes(req, res, next) {
    try {
        const { courseId } = req.query; 
        const filter = courseId ? { course: courseId } : {}; 
        const quizzes = await Quiz.find(filter).lean();

        res.status(200).json({
            count: quizzes.length,
            quizzes,
        });
    } catch (err) {
        next(err);
    }
}

// POST /api/quizzes
export async function createQuiz(req, res, next) {
    try {
        const { courseId, title, questions } = req.body;

        if (!courseId || !title) {
            return res.status(400).json({ message: "courseId et title sont requis" });
        }

        const created = await Quiz.create({
            course: courseId,
            title,
            questions: questions || [],
        });

        res.status(201).json({
            message: "Quiz créé avec succès",
            quiz: created,
        });
    } catch (err) {
        next(err);
    }
}

// GET /api/quizzes/:id
export async function getQuiz(req, res, next) {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId).select("-correctIndex").lean(); 

        if (!quiz) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }

        res.status(200).json(quiz);
    } catch (err) {
        next(err); 
    }
}

// PUT /api/quizzes/:id
export async function updateQuiz(req, res, next) {
    try {
        const quizId = req.params.id;
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }

        res.status(200).json({
            message: "Quiz mis à jour avec succès",
            quiz: updatedQuiz,
        });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/quizzes/:id
export async function deleteQuiz(req, res, next) {
    try {
        const quizId = req.params.id;
        const result = await Quiz.findByIdAndDelete(quizId);

        if (!result) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }

        res.status(204).end(); 
    } catch (err) {
        next(err);
    }
}

// POST /api/quizzes/:id/submit
export async function submitQuiz(req, res, next) {
    try {
        const quizId = req.params.id;
        const { answers } = req.body; 

        if (!answers) {
            return res.status(400).json({ message: "Les réponses du quiz sont manquantes" });
        }
        const quiz = await Quiz.findById(quizId).lean();

        if (!quiz) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }

        const result = calculateScore(quiz, answers);

        res.status(200).json({
            quizId: quizId,
            score: result.score,
            total: result.total,
            percentage: (result.score / result.total) * 100,
            feedback: result.feedback
        });
    } catch (err) {
        next(err);
    }
}