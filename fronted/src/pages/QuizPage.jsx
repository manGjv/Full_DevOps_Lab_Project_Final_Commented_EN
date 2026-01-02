import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import QuizQuestion from "../components/QuizQuestion";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get(`/quizzes?courseId=${courseId}`);
        setQuizzes(res.data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseId]);

  const handleChange = (quizIndex, ansIndex) => {
    setAnswers({ ...answers, [quizIndex]: ansIndex });
  };

  const handleSubmit = async () => {
    try {
      const quizId = quizzes[0]._id; // pour simplifier, 1 quiz
      const res = await api.post(`/quizzes/${quizId}/submit`, { answers: Object.values(answers) });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  if (result)
    return (
      <div>
        <Navbar />
        <div className="quiz-result">
          <h2>Quiz Result</h2>
          <p>Score: {result.score}/{result.total}</p>
          <p>Percentage: {result.percentage}%</p>
          <p>Feedback: {result.feedback}</p>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="quiz-container">
        {quizzes.map((quiz) => (
          <div key={quiz._id}>
            <h2>{quiz.title}</h2>
            {quiz.questions.map((q, i) => (
              <QuizQuestion
                key={i}
                question={q}
                index={i}
                answer={answers[i]}
                setAnswer={(ans) => handleChange(i, ans)}
              />
            ))}
          </div>
        ))}

        <button onClick={handleSubmit} className="btn">Submit Quiz</button>
      </div>
    </div>
  );
}
