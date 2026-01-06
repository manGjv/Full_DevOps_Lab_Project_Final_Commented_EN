import { useState } from "react";
import "../styles/AdminPanel.css";
export default function AdminPanel() {
  // ---------- UTILISATEUR ----------
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [userMsg, setUserMsg] = useState("");

  const handleCreateUser = async () => {
    try {
      const res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: userPassword,
          role: userRole,
        }),
      });
      if (!res.ok) throw new Error("Failed to create user");
      setUserMsg("Utilisateur créé ✅");
      setUserName(""); setUserEmail(""); setUserPassword("");
    } catch (err) {
      setUserMsg(err.message);
    }
  };

  // ---------- COURS ----------
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseMsg, setCourseMsg] = useState("");

  const handleCreateCourse = async () => {
    try {
      const res = await fetch("/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: courseTitle, description: courseDesc }),
      });
      if (!res.ok) throw new Error("Failed to create course");
      setCourseMsg("Cours créé ✅");
      setCourseTitle(""); setCourseDesc("");
    } catch (err) {
      setCourseMsg(err.message);
    }
  };

  // ---------- QUIZ ----------
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: 0 }]);
  const [quizMsg, setQuizMsg] = useState("");

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: 0 }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const qCopy = [...questions];
    if (field === "question") qCopy[index].question = value;
    else if (field.startsWith("option")) {
      const optIndex = parseInt(field.replace("option", ""));
      qCopy[index].options[optIndex] = value;
    } else if (field === "answer") qCopy[index].answer = parseInt(value);
    setQuestions(qCopy);
  };

  const handleCreateQuiz = async () => {
    try {
      const res = await fetch("/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: quizTitle, questions }),
      });
      if (!res.ok) throw new Error("Failed to create quiz");
      setQuizMsg("Quiz créé ✅");
      setQuizTitle(""); setQuestions([{ question: "", options: ["", "", "", ""], answer: 0 }]);
    } catch (err) {
      setQuizMsg(err.message);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      {/* ---------- UTILISATEUR ---------- */}
      <section className="admin-section">
        <h2>Créer un utilisateur</h2>
        <input placeholder="Nom" value={userName} onChange={e => setUserName(e.target.value)} />
        <input placeholder="Email" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
        <input placeholder="Mot de passe" value={userPassword} onChange={e => setUserPassword(e.target.value)} type="password" />
        <select value={userRole} onChange={e => setUserRole(e.target.value)}>
          <option value="student">Étudiant</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleCreateUser}>Créer Utilisateur</button>
        {userMsg && <p className="admin-msg">{userMsg}</p>}
      </section>

      {/* ---------- COURS ---------- */}
      <section className="admin-section">
        <h2>Créer un cours</h2>
        <input placeholder="Titre du cours" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} />
        <textarea placeholder="Description" value={courseDesc} onChange={e => setCourseDesc(e.target.value)} />
        <button onClick={handleCreateCourse}>Créer Cours</button>
        {courseMsg && <p className="admin-msg">{courseMsg}</p>}
      </section>

      {/* ---------- QUIZ ---------- */}
      <section className="admin-section">
        <h2>Créer un quiz</h2>
        <input placeholder="Titre du quiz" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} />
        {questions.map((q, i) => (
          <div key={i} className="quiz-question">
            <input
              placeholder={`Question ${i + 1}`}
              value={q.question}
              onChange={e => handleQuestionChange(i, "question", e.target.value)}
            />
            {q.options.map((opt, j) => (
              <input
                key={j}
                placeholder={`Option ${j + 1}`}
                value={opt}
                onChange={e => handleQuestionChange(i, `option${j}`, e.target.value)}
              />
            ))}
            <input
              type="number"
              min="0"
              max="3"
              placeholder="Indice bonne réponse (0-3)"
              value={q.answer}
              onChange={e => handleQuestionChange(i, "answer", e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleAddQuestion}>Ajouter une question</button>
        <button onClick={handleCreateQuiz}>Créer Quiz</button>
        {quizMsg && <p className="admin-msg">{quizMsg}</p>}
      </section>
    </div>
  );
}
