export default function QuizQuestion({ question, index, answer, setAnswer }) {
  return (
    <div className="quiz-question">
      <p><strong>Q{index + 1}:</strong> {question.text}</p>
      {question.options.map((opt, i) => (
        <div key={i}>
          <input
            type="radio"
            id={`q${index}-opt${i}`}
            name={`q${index}`}
            value={i}
            checked={answer === i}
            onChange={() => setAnswer(i)}
          />
          <label htmlFor={`q${index}-opt${i}`}>{opt}</label>
        </div>
      ))}
    </div>
  );
}
