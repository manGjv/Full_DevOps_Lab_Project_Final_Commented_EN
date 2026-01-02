import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById } from "../api/courses.api";
import Navbar from "../components/Navbar";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

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

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div>
      <Navbar />
      <div className="course-detail-container">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <p><strong>Level:</strong> {course.level}</p>
        <p><strong>Enrolled:</strong> {course.enrolled}</p>

        <h3>Lessons</h3>
        <ul>
          {course.lessons.map((lesson, idx) => (
            <li key={idx}>
              {lesson.title} ({lesson.type}) - {lesson.duration || "N/A"}
            </li>
          ))}
        </ul>

        <Link to={`/quizzes?courseId=${course._id}`} className="btn">
          Go to Quiz
        </Link>
      </div>
    </div>
  );
}
