import request from "supertest";
import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../src/app.js";
import Course from "../../src/models/courses.model.js";

let mongo;
let seeded;

// ===== Fonction pour seed la base de test =====
async function seedCourses() {
  const docs = await Course.create([
    {
      title: "Detecting Phishing Emails",
      domain: "Email Security",
      level: "beginner",
      description: "Learn to identify fraudulent emails and phishing attempts",
      lessons: [
        { title: "Introduction to Phishing", type: "video", duration: "10 min" },
        { title: "Common Red Flags", type: "text", duration: "15 min" },
      ],
      enrolled: 245,
      completionRate: 78,
    },
    {
      title: "Network Security Fundamentals",
      domain: "Network Security",
      level: "intermediate",
      description: "Understanding network protocols and common attack vectors",
      lessons: [
        { title: "TCP/IP Deep Dive", type: "video", duration: "20 min" },
        { title: "Firewall Configuration", type: "interactive", duration: "30 min" },
      ],
      enrolled: 189,
      completionRate: 65,
    },
    {
      title: "Advanced Penetration Testing",
      domain: "Offensive Security",
      level: "expert",
      description: "Master advanced techniques for security assessments",
      lessons: [
        { title: "Exploit Development", type: "video", duration: "45 min" },
        { title: "Post-Exploitation", type: "lab", duration: "60 min" },
      ],
      enrolled: 67,
      completionRate: 52,
    },
  ]);
  return docs;
}

// ===== Configuration MongoMemoryServer =====
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    dbName: "test-courses",
  }); 
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

// ===== Nettoyage des collections avant chaque test =====
beforeEach(async () => {
  await Course.deleteMany({});
  seeded = await seedCourses();
});

// ===== Début des tests =====
describe("Courses API - CRUD Operations (MongoMemoryServer)", () => {

  // ===== CREATE =====
  describe("CREATE - POST /api/courses", () => {
    it("should create a new course and return 201", async () => {
      const newCourse = {
        title: "Introduction to Cryptography",
        domain: "Cryptography",
        level: "beginner",
        description: "Learn the basics of encryption and decryption",
        lessons: [
          { title: "Symmetric Encryption", type: "video", duration: "20 min" },
        ],
      };

      const res = await request(app).post("/api/courses").send(newCourse);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Course created successfully");
      expect(res.body.course).toHaveProperty("_id");
      expect(res.body.course.title).toBe("Introduction to Cryptography");
      expect(res.body.course.enrolled).toBe(0);
      expect(res.body.course.completionRate).toBe(0);
    });

    it("should return 400 when title is missing", async () => {
      const invalidCourse = { domain: "Network Security", level: "beginner" };
      const res = await request(app).post("/api/courses").send(invalidCourse);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Missing required fields");
    });

    it("should return 400 when domain is missing", async () => {
      const invalidCourse = { title: "Some Course", level: "expert" };
      const res = await request(app).post("/api/courses").send(invalidCourse);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Missing required fields");
    });

    it("should return 400 for invalid level", async () => {
      const invalidCourse = {
        title: "Test Course",
        domain: "Testing",
        level: "master",
      };
      const res = await request(app).post("/api/courses").send(invalidCourse);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid level");
    });

    it("should accept level in uppercase and convert to lowercase", async () => {
      const newCourse = {
        title: "Advanced Malware Analysis",
        domain: "Malware",
        level: "EXPERT",
      };

      const res = await request(app).post("/api/courses").send(newCourse);

      expect(res.status).toBe(201);
      expect(res.body.course.level).toBe("expert");
    });
  });

  // ===== READ LIST =====
  describe("READ - GET /api/courses", () => {
    it("should return 200 and an array of courses", async () => {
      const res = await request(app).get("/api/courses");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.courses)).toBe(true);
      expect(res.body.count).toBe(3);
    });

    it("should filter courses by level=beginner", async () => {
      const res = await request(app).get("/api/courses?level=beginner");

      expect(res.status).toBe(200);
      expect(res.body.level).toBe("beginner");
      expect(res.body.count).toBe(1);
      expect(res.body.courses[0].level).toBe("beginner");
    });

    it("should return 400 for invalid level", async () => {
      const res = await request(app).get("/api/courses?level=invalid");

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid level");
    });
  });

  // ===== READ BY ID =====
  describe("READ - GET /api/courses/:id", () => {
    it("should return a course by valid Mongo ID", async () => {
      const course = seeded[0];
      const id = course._id.toString();
      const res = await request(app).get(`/api/courses/${id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", id);
      expect(res.body.title).toBe("Detecting Phishing Emails");
    });

    it("should return 404 for non-existent course", async () => {
      const fakeId = "64b0f2c2f2f2f2f2f2f2f2f2";
      const res = await request(app).get(`/api/courses/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Course not found");
    });

    it("should return 400 for invalid course ID format", async () => {
      const res = await request(app).get("/api/courses/abc");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid course ID");
    });
  });

  // ===== UPDATE =====
  describe("UPDATE - PUT /api/courses/:id", () => {
    it("should update a course title and return 200", async () => {
      const id = seeded[0]._id.toString();
      const updateData = { title: "Advanced Phishing Detection" };

      const res = await request(app).put(`/api/courses/${id}`).send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Course updated successfully");
      expect(res.body.course.title).toBe("Advanced Phishing Detection");
    });

    it("should return 400 when no fields are provided", async () => {
      const id = seeded[0]._id.toString();
      const res = await request(app).put(`/api/courses/${id}`).send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("At least one field");
    });

    it("should return 400 for invalid level on update", async () => {
      const id = seeded[0]._id.toString();
      const updateData = { level: "master" };

      const res = await request(app).put(`/api/courses/${id}`).send(updateData);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid level");
    });

    it("should return 400 for invalid course ID format", async () => {
      const res = await request(app).put("/api/courses/abc").send({ title: "New Title" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid course ID");
    });

    it("should return 404 when updating non-existent course", async () => {
      const fakeId = "64b0f2c2f2f2f2f2f2f2f2f2";
      const res = await request(app).put(`/api/courses/${fakeId}`).send({ title: "New Title" });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Course not found");
    });
  });

  // ===== DELETE =====
  describe("DELETE - DELETE /api/courses/:id", () => {
    it("should delete a course and return 200", async () => {
      const id = seeded[2]._id.toString();
      const res = await request(app).delete(`/api/courses/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Course deleted successfully");
      expect(res.body.course._id).toBe(id);
    });

    it("should return 404 when deleting non-existent course", async () => {
      const fakeId = "64b0f2c2f2f2f2f2f2f2f2f2";
      const res = await request(app).delete(`/api/courses/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Course not found");
    });

    it("should return 400 for invalid course ID format", async () => {
      const res = await request(app).delete("/api/courses/xyz");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid course ID");
    });

    it("should actually remove the course from the list", async () => {
      const id = seeded[1]._id.toString();

      const beforeRes = await request(app).get(`/api/courses/${id}`);
      expect(beforeRes.status).toBe(200);

      const delRes = await request(app).delete(`/api/courses/${id}`);
      expect(delRes.status).toBe(200);

      const afterRes = await request(app).get(`/api/courses/${id}`);
      expect(afterRes.status).toBe(404);
    });
  });
});
