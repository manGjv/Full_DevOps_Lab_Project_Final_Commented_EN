import { describe, it, expect } from "vitest"; 

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

describe("Unit Test: calculateScore", () => {
    
    const mockQuiz = {
        title: "Test Unit Score",
        questions: [
            { text: "Question 1", options: ["A", "B"], correctIndex: 0 },
            { text: "Question 2", options: ["Vrai", "Faux"], correctIndex: 1 } 
        ]
    };

    it("should return a perfect score when all answers are correct", () => {
        const correctAnswers = { 0: 0, 1: 1 };
        const result = calculateScore(mockQuiz, correctAnswers);

        expect(result.score).toBe(2);
        expect(result.total).toBe(2);
        expect(result.feedback).toBe("Félicitations ! Badge débloqué.");
    });

    it("should return zero score when all answers are incorrect", () => {
        const incorrectAnswers = { 0: 1, 1: 0 };
        const result = calculateScore(mockQuiz, incorrectAnswers);

        expect(result.score).toBe(0);
        expect(result.total).toBe(2);
        expect(result.feedback).toBe("À revoir.");
    });

    it("should return a partial score when one answer is correct", () => {
        const partialAnswers = { 0: 0, 1: 0 };
        const result = calculateScore(mockQuiz, partialAnswers);

        expect(result.score).toBe(1);
        expect(result.total).toBe(2);
        expect(result.feedback).toBe("À revoir.");
    });

    it("should handle missing answers gracefully", () => {
        const missingAnswers = { 0: 0 }; 
        const result = calculateScore(mockQuiz, missingAnswers);
        
        expect(result.score).toBe(1);
        expect(result.total).toBe(2);
    });
});