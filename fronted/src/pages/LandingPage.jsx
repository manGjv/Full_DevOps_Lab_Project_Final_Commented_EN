import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div>
      <Navbar />

      <section className="landing-container">
        <h1>Cybersecurity Learning Platform</h1>
        <p>Boost your cybersecurity skills with interactive courses, quizzes, and gamified learning paths.</p>
        
        <div className="cta-buttons">
          <Link to="/register" className="btn">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-cards">
          <div className="feature-card">
            <h3>Structured Learning</h3>
            <p>Courses for Beginner, Intermediate, and Expert levels, with videos and interactive exercises.</p>
          </div>
          <div className="feature-card">
            <h3>Quizzes & Assessments</h3>
            <p>Test your knowledge after each module and track your progress over time.</p>
          </div>
          <div className="feature-card">
            <h3>Gamification</h3>
            <p>Earn badges, points, and climb the leaderboard to stay motivated.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
