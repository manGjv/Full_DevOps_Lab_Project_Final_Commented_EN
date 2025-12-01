import request from "supertest";
import app from "../src/app.js";
import { describe, it, expect, beforeEach } from "vitest";

describe("Courses API - CRUD Operations", () => {
  
  // ===== TESTS CREATE (POST) =====
  describe("CREATE - POST /api/courses", () => {
    
    it("should create a new course and return 201", async () => {
      const newCourse = {
        title: "Introduction to Cryptography",
        domain: "Cryptography",
        level: "beginner",
        description: "Learn the basics of encryption and decryption",
        lessons: [
          { id: 1, name: "Symmetric Encryption", type: "video", duration: "20 min" }
        ]
      };

      const res = await request(app)
        .post("/api/courses")
        .send(newCourse);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("Course created successfully");
      expect(res.body).toHaveProperty("course");
      expect(res.body.course).toHaveProperty("id");
      expect(res.body.course.title).toBe("Introduction to Cryptography");
    });

    it("should set default values for enrolled and completionRate", async () => {
      const newCourse = {
        title: "Web Application Security",
        domain: "Web Security",
        level: "intermediate"
      };

      const res = await request(app)
        .post("/api/courses")
        .send(newCourse);

      expect(res.status).toBe(201);
      expect(res.body.course.enrolled).toBe(0);
      expect(res.body.course.completionRate).toBe(0);
      expect(res.body.course.lessons).toEqual([]);
    });

    it("should return 400 when title is missing", async () => {
      const invalidCourse = {
        domain: "Network Security",
        level: "beginner"
      };

      const res = await request(app)
        .post("/api/courses")
        .send(invalidCourse);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("Missing required fields");
    });

    it("should return 400 when domain is missing", async () => {
      const invalidCourse = {
        title: "Some Course",
        level: "expert"
      };

      const res = await request(app)
        .post("/api/courses")
        .send(invalidCourse);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Missing required fields");
    });

    it("should return 400 for invalid level", async () => {
      const invalidCourse = {
        title: "Test Course",
        domain: "Testing",
        level: "master" // Invalid level
      };

      const res = await request(app)
        .post("/api/courses")
        .send(invalidCourse);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid level");
    });

    it("should accept level in uppercase and convert to lowercase", async () => {
      const newCourse = {
        title: "Advanced Malware Analysis",
        domain: "Malware",
        level: "EXPERT" // Uppercase
      };

      const res = await request(app)
        .post("/api/courses")
        .send(newCourse);

      expect(res.status).toBe(201);
      expect(res.body.course.level).toBe("expert"); // Should be lowercase
    });
  });

  // ===== TESTS READ (GET) =====
  describe("READ - GET /api/courses", () => {
    
    it("should return 200 and an array of courses", async () => {
      const res = await request(app).get("/api/courses");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("count");
      expect(res.body).toHaveProperty("courses");
      expect(Array.isArray(res.body.courses)).toBe(true);
    });

    it("should return at least 3 initial courses", async () => {
      const res = await request(app).get("/api/courses");
      expect(res.status).toBe(200);
      expect(res.body.count).toBeGreaterThanOrEqual(3);
      expect(res.body.courses.length).toBeGreaterThanOrEqual(3);
    });

    it("should filter courses by level=beginner", async () => {
      const res = await request(app).get("/api/courses?level=beginner");
      expect(res.status).toBe(200);
      expect(res.body.level).toBe("beginner");
      expect(res.body.count).toBeGreaterThanOrEqual(1);
      expect(res.body.courses[0].level).toBe("beginner");
    });

    it("should filter courses by level=intermediate", async () => {
      const res = await request(app).get("/api/courses?level=intermediate");
      expect(res.status).toBe(200);
      expect(res.body.level).toBe("intermediate");
      expect(res.body.courses.every(c => c.level === "intermediate")).toBe(true);
    });

    it("should return 400 for invalid level", async () => {
      const res = await request(app).get("/api/courses?level=invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("Invalid level");
    });
  });

  describe("READ - GET /api/courses/:id", () => {
    
    it("should return 200 and the course with id=1", async () => {
      const res = await request(app).get("/api/courses/1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body.id).toBe(1);
      expect(res.body.title).toBe("Detecting Phishing Emails");
    });

    it("should return course with all required fields", async () => {
      const res = await request(app).get("/api/courses/2");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("title");
      expect(res.body).toHaveProperty("domain");
      expect(res.body).toHaveProperty("level");
      expect(res.body).toHaveProperty("description");
      expect(res.body).toHaveProperty("lessons");
      expect(res.body).toHaveProperty("enrolled");
      expect(res.body).toHaveProperty("completionRate");
    });

    it("should return 404 for non-existent course", async () => {
      const res = await request(app).get("/api/courses/999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Course not found");
    });

    it("should return 400 for invalid course ID format", async () => {
      const res = await request(app).get("/api/courses/abc");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Invalid course ID");
    });
  });

  // ===== TESTS UPDATE (PUT) =====
  describe("UPDATE - PUT /api/courses/:id", () => {
    
    it("should update a course title and return 200", async () => {
      const updateData = {
        title: "Advanced Phishing Detection"
      };

      const res = await request(app)
        .put("/api/courses/1")
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("Course updated successfully");
      expect(res.body.course.title).toBe("Advanced Phishing Detection");
      expect(res.body.course.domain).toBe("Email Security"); // Should remain unchanged
    });

    it("should update multiple fields at once", async () => {
      const updateData = {
        title: "Intermediate Network Security",
        level: "expert",
        description: "Updated description for advanced learners"
      };

      const res = await request(app)
        .put("/api/courses/2")
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.course.title).toBe("Intermediate Network Security");
      expect(res.body.course.level).toBe("expert");
      expect(res.body.course.description).toBe("Updated description for advanced learners");
    });

    it("should return 404 when updating non-existent course", async () => {
      const updateData = { title: "New Title" };

      const res = await request(app)
        .put("/api/courses/999")
        .send(updateData);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Course not found");
    });

    it("should return 400 when no fields are provided", async () => {
      const res = await request(app)
        .put("/api/courses/1")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("At least one field must be provided");
    });

    it("should return 400 for invalid level on update", async () => {
      const updateData = {
        level: "master" // Invalid
      };

      const res = await request(app)
        .put("/api/courses/1")
        .send(updateData);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid level");
    });

    it("should return 400 for invalid course ID format", async () => {
      const updateData = { title: "New Title" };

      const res = await request(app)
        .put("/api/courses/abc")
        .send(updateData);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid course ID");
    });
  });

  // ===== TESTS DELETE (DELETE) =====
  describe("DELETE - DELETE /api/courses/:id", () => {
    
    it("should delete a course and return 200", async () => {
      const res = await request(app).delete("/api/courses/3");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("Course deleted successfully");
      expect(res.body.course).toHaveProperty("id");
      expect(res.body.course.id).toBe(3);
    });

    it("should return 404 when deleting non-existent course", async () => {
      const res = await request(app).delete("/api/courses/999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Course not found");
    });

    it("should return 400 for invalid course ID format", async () => {
      const res = await request(app).delete("/api/courses/xyz");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid course ID");
    });

    it("should actually remove the course from the list", async () => {
      // First, verify course exists
      const beforeRes = await request(app).get("/api/courses/2");
      expect(beforeRes.status).toBe(200);

      // Delete it
      const deleteRes = await request(app).delete("/api/courses/2");
      expect(deleteRes.status).toBe(200);

      // Verify it's gone
      const afterRes = await request(app).get("/api/courses/2");
      expect(afterRes.status).toBe(404);
    });
  });

  // ===== TESTS SUPPLÉMENTAIRES =====
  describe("Additional Edge Cases", () => {
    
    it("should handle courses with lessons array", async () => {
      const res = await request(app).get("/api/courses/1");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.lessons)).toBe(true);
    });

    it("should return courses with proper data types", async () => {
      const res = await request(app).get("/api/courses");
      expect(res.status).toBe(200);
      
      const firstCourse = res.body.courses[0];
      expect(typeof firstCourse.id).toBe("number");
      expect(typeof firstCourse.title).toBe("string");
      expect(typeof firstCourse.enrolled).toBe("number");
      expect(typeof firstCourse.completionRate).toBe("number");
    });
  });
});
