import { useState } from "react";
import Navbar from "../components/Navbar";

export default function TestPage() {
  const [level, setLevel] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Ici tu pourrais appeler un endpoint pour évaluer le test
    setSubmitted(true);
  };

  return (
    <div>
      <Navbar />
      <div className="test-container">
        <h2>Initial Knowledge Test</h2>
        <p>Answer a few questions to identify your level:</p>

        {!submitted ? (
          <>
            <p>Question sample (placeholder)</p>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Select your level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>

            <button onClick={handleSubmit} className="btn">Submit</button>
          </>
        ) : (
          <p>Your recommended level: <strong>{level}</strong></p>
        )}
      </div>
    </div>
  );
}
