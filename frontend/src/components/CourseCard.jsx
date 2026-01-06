import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  const levelClass = `level-${course.level}`;

  return (
    <div className={`course-card ${levelClass}`}>
      <span className="course-level">{course.level}</span>

      <h3>{course.title}</h3>

      <p>{course.description}</p>

      <Link to={`/courses/${course._id}`}>View course</Link>
    </div>
  );
}
