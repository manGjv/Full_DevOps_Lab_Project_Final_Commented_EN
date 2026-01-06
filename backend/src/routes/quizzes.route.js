import express from "express";
import Quiz from "../models/quizzes.model.js";

const router = express.Router();

// GET quizzes by courseId
router.get("/", async (req, res) => {
  try {
    const { courseId } = req.query;
    
    console.log("Quiz request - courseId:", courseId); // Debug log
    
    if (!courseId) {
      return res.status(400).json({ error: "courseId is required" });
    }

    const quizzes = await Quiz.find({ course: courseId });
    
    console.log("Found quizzes:", quizzes.length); // Debug log
    
    res.json({ quizzes });
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST submit quiz
router.post("/:quizId/submit", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctIndex) {
        score++;
      }
    });

    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    let feedback = "";
    if (percentage === 100) {
      feedback = "Perfect! You got everything right!";
    } else if (percentage >= 70) {
      feedback = "Good job! You passed the quiz.";
    } else {
      feedback = "Keep learning! Review the material and try again.";
    }

    res.json({
      score,
      total,
      percentage,
      feedback
    });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
