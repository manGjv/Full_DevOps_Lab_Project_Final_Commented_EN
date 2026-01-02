import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description || "No description available"}</p>
      <p>
        <strong>Level:</strong> {course.level}
      </p>
      <p>
        <strong>Enrolled:</strong> {course.enrolled} learners
      </p>
      <Link to={`/courses/${course._id}`}>View Course</Link>
    </div>
  );
}
