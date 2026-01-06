import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { awardBadge } from "../api/users.api";
import QuizQuestion from "../components/QuizQuestion";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "../styles/quizz.css";

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("courseId");

  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [badgeAwarded, setBadgeAwarded] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setError("Missing course ID");
      setLoading(false);
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const res = await api.get(`/quizzes?courseId=${courseId}`);
        if (!res.data.quizzes || res.data.quizzes.length === 0) {
          setError("No quiz available for this course");
        } else {
          setQuizzes(res.data.quizzes);
        }
      } catch (err) {
        console.error(err);
        setError("Error loading quiz");
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
    if (quizzes.length === 0) return;

    const quiz = quizzes[0];
    const totalQuestions = quiz.questions.length;
    const answeredQuestions = Object.keys(answers).length;

    // Check that all questions have been answered
    if (answeredQuestions < totalQuestions) {
      alert(`Please answer all questions (${answeredQuestions}/${totalQuestions} answered)`);
      return;
    }

    setSubmitting(true);
    try {
      const quizId = quiz._id;
      const res = await api.post(`/quizzes/${quizId}/submit`, { 
        answers: Object.values(answers) 
      });
      setResult(res.data);

      // Award badge if 100%
      if (res.data.percentage === 100) {
        try {
          await awardBadge(quiz.title, courseId);
          setBadgeAwarded(true);
        } catch (badgeErr) {
          console.error("Error awarding badge:", badgeErr);
          // Don't fail the quiz submission if badge award fails
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error submitting quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setError(null);
    setBadgeAwarded(false);
  };

  const handleBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) return <Loader />;

  if (error && quizzes.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="quiz-error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="btn">
            Back
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    const isPassed = result.percentage >= 70;
    const isPerfect = result.percentage === 100;
    
    return (
      <div>
        <Navbar />
        <div className={`quiz-result ${isPassed ? 'passed' : 'failed'}`}>
          <div className="result-icon">
            {isPerfect ? '🏆' : isPassed ? '🎉' : '📚'}
          </div>
          <h2>
            {isPerfect ? 'Perfect Score!' : isPassed ? 'Congratulations!' : 'Keep Learning'}
          </h2>
          <div className="result-stats">
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">{result.score}/{result.total}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Percentage</span>
              <span className="stat-value">{result.percentage}%</span>
            </div>
          </div>
          <p className="result-feedback">{result.feedback}</p>
          
          {isPerfect && badgeAwarded && (
            <div className="badge-unlocked">
              🏆 Badge Unlocked: {quizzes[0]?.title}
            </div>
          )}

          <div className="result-actions">
            {!isPassed && (
              <button onClick={handleRetry} className="btn btn-secondary">
                Retry
              </button>
            )}
            <button onClick={handleBackToCourse} className="btn btn-primary">
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="quiz-container">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="quiz-content">
            <div className="quiz-header">
              <h1>{quiz.title}</h1>
              <p className="quiz-info">
                {quiz.questions.length} questions · 
                {Object.keys(answers).length}/{quiz.questions.length} answered
              </p>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` 
                }}
              />
            </div>

            <div className="questions-list">
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

            <div className="quiz-actions">
              <button 
                onClick={handleSubmit} 
                className="btn btn-primary"
                disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
