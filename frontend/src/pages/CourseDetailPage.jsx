import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../api/courses.api";
import { updateTimeSpent } from "../api/users.api";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/courses.css";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await getCourseById(id);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (!user?.id) return;

    return () => {
      const timeSpent = (Date.now() - startTime) / 1000 / 60 / 60;
      if (timeSpent > 0.01) {
        updateTimeSpent(user.id, timeSpent).catch(console.error);
      }
    };
  }, [user?.id, startTime]);

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <>
      <Navbar />

      <div className="course-detail-container">
        <button onClick={() => navigate("/courses")} className="back-btn">
          ← Back to courses
        </button>

        <span className={`course-level level-${course.level}`}>
          {course.level}
        </span>

        <h2>{course.title}</h2>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          <span>👥 {course.enrolled} enrolled</span>
        </div>

        <h3>Lessons</h3>

        <ul className="lesson-list">
          {course.lessons
            .filter((lesson) => lesson.type !== "interactive")
            .map((lesson, idx) => (
              <li key={idx} className="lesson-item">
                <h4>{lesson.title}</h4>
                <p className="lesson-meta">
                  {lesson.type} • {lesson.duration || "N/A"}
                </p>

                {lesson.type === "video" && lesson.url && (
                  <iframe
                    src={lesson.url}
                    title={lesson.title}
                    allowFullScreen
                  />
                )}

                {lesson.type === "text" && lesson.content && (
                  <p>{lesson.content}</p>
                )}
              </li>
            ))}
        </ul>

        <div className="quiz-box">
          <h3>Ready to Test Your Knowledge?</h3>
          <p>Complete the quiz to earn badges and validate your understanding.</p>
          <button
            onClick={() => navigate(`/quiz?courseId=${course._id}`)}
            className="btn-primary"
          >
            Take Quiz 📝
          </button>
        </div>
      </div>
    </>
  );
}
