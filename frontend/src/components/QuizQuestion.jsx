import "../styles/quizz.css";

export default function QuizQuestion({ question, index, answer, setAnswer }) {
  return (
    <div className={`quiz-question ${answer !== undefined ? 'answered' : ''}`}>
      <div className="question-header">
        <span className="question-number">Question {index + 1}</span>
        {answer !== undefined && <span className="answered-badge">✓</span>}
      </div>
      
      <p className="question-text">{question.text}</p>
      
      <div className="options-list">
        {question.options.map((opt, i) => (
          <label 
            key={i} 
            className={`option-item ${answer === i ? 'selected' : ''}`}
            htmlFor={`q${index}-opt${i}`}
          >
            <input
              type="radio"
              id={`q${index}-opt${i}`}
              name={`q${index}`}
              value={i}
              checked={answer === i}
              onChange={() => setAnswer(i)}
              className="option-radio"
            />
            <span className="option-label">
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{opt}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}