import { useState, useEffect } from "react";
import { getCourses } from "../api/courses.api";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar";
import "../styles/courses.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getCourses(level);
        setCourses(res.data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [level]);

  return (
    <>
      <Navbar />

      <div className="courses-container">
        <h2>Courses</h2>

        <div className="filter">
          <label>Filter by level:</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
