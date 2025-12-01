import express from "express";
const router = express.Router();

// Simulating courses stored in memory
let courses = [
  {
    id: 1,
    title: "Detecting Phishing Emails",
    domain: "Email Security",
    level: "beginner",
    description: "Learn to identify fraudulent emails and phishing attempts",
    lessons: [
      { id: 1, name: "Introduction to Phishing", type: "video", duration: "10 min" },
      { id: 2, name: "Common Red Flags", type: "text", duration: "15 min" }
    ],
    enrolled: 245,
    completionRate: 78
  },
  {
    id: 2,
    title: "Network Security Fundamentals",
    domain: "Network Security",
    level: "intermediate",
    description: "Understanding network protocols and common attack vectors",
    lessons: [
      { id: 3, name: "TCP/IP Deep Dive", type: "video", duration: "20 min" },
      { id: 4, name: "Firewall Configuration", type: "interactive", duration: "30 min" }
    ],
    enrolled: 189,
    completionRate: 65
  },
  {
    id: 3,
    title: "Advanced Penetration Testing",
    domain: "Offensive Security",
    level: "expert",
    description: "Master advanced techniques for security assessments",
    lessons: [
      { id: 5, name: "Exploit Development", type: "video", duration: "45 min" },
      { id: 6, name: "Post-Exploitation", type: "lab", duration: "60 min" }
    ],
    enrolled: 67,
    completionRate: 52
  }
];

// GET /api/courses - List all courses with optional level filtering
router.get("/", (req, res) => {
  try {
    const { level } = req.query;
    
    // If level parameter is provided, filter courses
    if (level) {
      const validLevels = ["beginner", "intermediate", "expert"];
      
      if (!validLevels.includes(level.toLowerCase())) {
        return res.status(400).json({ 
          error: "Invalid level. Must be: beginner, intermediate, or expert" 
        });
      }
      
      const filteredCourses = courses.filter(
        course => course.level === level.toLowerCase()
      );
      
      return res.status(200).json({
        count: filteredCourses.length,
        level: level,
        courses: filteredCourses
      });
    }
    
    // Return all courses if no filter
    res.status(200).json({
      count: courses.length,
      courses: courses
    });
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/courses/:id - Get specific course details
router.get("/:id", (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }
    
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    res.status(200).json(course);
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/courses - Create a new course (for Content Manager)
router.post("/", (req, res) => {
  try {
    const { title, domain, level, description, lessons } = req.body;
    
    // Validation
    if (!title || !domain || !level) {
      return res.status(400).json({ 
        error: "Missing required fields: title, domain, level" 
      });
    }
    
    const validLevels = ["beginner", "intermediate", "expert"];
    if (!validLevels.includes(level.toLowerCase())) {
      return res.status(400).json({ 
        error: "Invalid level. Must be: beginner, intermediate, or expert"
      });
    }
    
    // Create new course
    const newCourse = {
      id: courses.length + 1,
      title,
      domain,
      level: level.toLowerCase(),
      description: description || "",
      lessons: lessons || [],
      enrolled: 0,
      completionRate: 0
    };
    
    courses.push(newCourse);
    
    res.status(201).json({
      message: "Course created successfully",
      course: newCourse
    });
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/courses/:id - Update an existing course
router.put("/:id", (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }
    
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    const { title, domain, level, description, lessons } = req.body;
    
    // Validation: at least one field should be provided
    if (!title && !domain && !level && !description && lessons === undefined) {
      return res.status(400).json({ 
        error: "At least one field must be provided to update" 
      });
    }
    
    // Validate level if provided
    if (level) {
      const validLevels = ["beginner", "intermediate", "expert"];
      if (!validLevels.includes(level.toLowerCase())) {
        return res.status(400).json({ 
          error: "Invalid level. Must be: beginner, intermediate, or expert"
        });
      }
    }
    
    // Update only provided fields
    const updatedCourse = {
      ...courses[courseIndex],
      ...(title && { title }),
      ...(domain && { domain }),
      ...(level && { level: level.toLowerCase() }),
      ...(description !== undefined && { description }),
      ...(lessons && { lessons })
    };
    
    courses[courseIndex] = updatedCourse;
    
    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse
    });
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/courses/:id - Delete a course
router.delete("/:id", (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }
    
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex === -1) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    const deletedCourse = courses[courseIndex];
    courses.splice(courseIndex, 1);
    
    res.status(200).json({
      message: "Course deleted successfully",
      course: deletedCourse
    });
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
