import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: { type: [String], required: true, validate: v => v.length >= 2 },
    correctIndex: { type: Number, required: true } 
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    questions: { type: [questionSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema, "Quizzes");