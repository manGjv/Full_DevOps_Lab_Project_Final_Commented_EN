import express from "express";
import { 
    listQuizzes, 
    createQuiz, 
    getQuiz, 
    updateQuiz, 
    deleteQuiz, 
    submitQuiz 
} from "../controllers/quizzes.controller.js";

const router = express.Router();

router.route("/")
    .get(listQuizzes) 
    .post(createQuiz); 

router.route("/:id")
    .get(getQuiz) 
    .put(updateQuiz)
    .delete(deleteQuiz);

router.post("/:id/submit", submitQuiz);

export default router;