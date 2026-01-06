// src/models/course.model.js
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    type:     { type: String, enum: ["video", "text", "interactive", "lab"], default: "video" },
    duration: { type: String },
    content:  { type: String },
    url:  { type: String }     
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title:          { type: String, required: true },
    domain:         { type: String, required: true },
    level:          { type: String, enum: ["beginner", "intermediate", "expert"], required: true },
    description:    { type: String, default: "" },
    lessons:        { type: [lessonSchema], default: [] },
    enrolled:       { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema, "Courses");
