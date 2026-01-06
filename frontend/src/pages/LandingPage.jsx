import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section className="landing-container">
        <h1>Cybersecurity Learning Platform</h1>
        <p className="landing-subtitle">
          Learn cybersecurity step by step with interactive courses, labs, and quizzes.
        </p>

        <div className="cta-buttons">
          <Link to="/register" className="btn">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-cards">
          <div className="feature-card">
            <h3>Structured Learning</h3>
            <p>
              Beginner to expert courses with a clear progression, combining
              theory, videos, and hands-on practice.
            </p>
          </div>
          <div className="feature-card">
            <h3>Quizzes & Assessments</h3>
            <p>
              Validate your understanding after each module and follow your
              progress with meaningful milestones.
            </p>
          </div>
          <div className="feature-card">
            <h3>Gamification</h3>
            <p>
              Earn badges and achievements to stay motivated while developing
              real-world cybersecurity skills.
            </p>
          </div>
        </div>
      </section>

      {/* DIFFERENT SECTION */}
<section className="cover-section">
  <div className="cover-content">
    <div className="cover-text">
      <h2>What Makes This Platform Different?</h2>
      <ul>
        <li>Clear explanations designed for non-technical beginners</li>
        <li>Hands-on labs in safe, realistic environments</li>
        <li>Progress tracking to visualize your learning journey</li>
        <li>Cybersecurity concepts aligned with real industry practices</li>
      </ul>
    </div>

    <div className="cover-image">
      <img
        src="/cyber-learning.png"
        alt="Cybersecurity learning illustration"
      />
    </div>
  </div>
</section>


      {/* HOW IT WORKS */}
<section className="steps-section">
  <h2>How It Works</h2>

  <div className="steps-container">
    <div className="step">
      <div className="step-circle">1</div>
      <h3>Choose a Path</h3>
      <p>
        Select a learning path based on your level: fundamentals, web security,
        network security, or advanced topics.
      </p>
    </div>

    <div className="step-line" />

    <div className="step">
      <div className="step-circle">2</div>
      <h3>Learn by Doing</h3>
      <p>
        Watch short lessons, read clear explanations, and practice with labs and
        interactive challenges.
      </p>
    </div>

    <div className="step-line" />

    <div className="step">
      <div className="step-circle">3</div>
      <h3>Track Progress</h3>
      <p>
        Monitor your progress, earn achievements, and identify areas for
        improvement.
      </p>
    </div>
  </div>
</section>


      {/* WHO IS IT FOR */}
      <section className="features-section light-section">
        <h2>Who Is This Platform For?</h2>
        <div className="features-cards">
          <div className="feature-card">
            <h3>Beginners</h3>
            <p>
              Start from scratch and build strong cybersecurity fundamentals,
              no prior experience required.
            </p>
          </div>
          <div className="feature-card">
            <h3>Students</h3>
            <p>
              Reinforce your studies with practical skills and real-world
              security scenarios.
            </p>
          </div>
          <div className="feature-card">
            <h3>Professionals</h3>
            <p>
              Deepen your security knowledge and prepare for more advanced roles
              in cybersecurity.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2>Start Learning Cybersecurity Today</h2>
        <p>
          Create your free account and begin your journey toward real-world
          cybersecurity skills.
        </p>
        <Link to="/register" className="btn btn-cta">
          Create a Free Account
        </Link>
      </section>
    </div>
  );
}
