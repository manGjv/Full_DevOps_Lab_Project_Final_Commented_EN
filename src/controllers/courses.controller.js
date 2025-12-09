// src/controllers/course.controller.js
import Course from "../models/courses.model.js";

const ALLOWED_LEVELS = ["beginner", "intermediate", "expert"];

export async function listCourses(req, res, next) {
  try {
    const { level } = req.query;
    const filter = {};

    if (level) {
      const norm = level.toLowerCase();
      if (!ALLOWED_LEVELS.includes(norm)) {
        return res.status(400).json({ error: "Invalid level" });
      }
      filter.level = norm;
    }

    const courses = await Course.find(filter).lean();
    res.status(200).json({
      level: level?.toLowerCase() || undefined,
      count: courses.length,
      courses,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCourseById(req, res, next) {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const course = await Course.findById(id).lean();
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req, res, next) {
  try {
    const { title, domain, level, description, lessons } = req.body;
    if (!title || !domain || !level) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const norm = String(level).toLowerCase();
    if (!ALLOWED_LEVELS.includes(norm)) {
      return res.status(400).json({ error: "Invalid level" });
    }

    const created = await Course.create({
      title,
      domain,
      level: norm,
      description: description || "",
      lessons: lessons || [],
    });

    res.status(201).json({
      message: "Course created successfully",
      course: created,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const { title, domain, level, description, lessons } = req.body;

    if (!title && !domain && !level && !description && lessons === undefined) {
      return res
        .status(400)
        .json({ error: "At least one field must be provided to update" });
    }

    const update = {};
    if (title) update.title = title;
    if (domain) update.domain = domain;
    if (level) {
      const norm = level.toLowerCase();
      if (!ALLOWED_LEVELS.includes(norm)) {
        return res
          .status(400)
          .json({ error: "Invalid level. Must be: beginner, intermediate, or expert" });
      }
      update.level = norm;
    }
    if (description !== undefined) update.description = description;
    if (lessons) update.lessons = lessons;

    const updated = await Course.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const deleted = await Course.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({
      message: "Course deleted successfully",
      course: deleted,
    });
  } catch (err) {
    next(err);
  }
}
