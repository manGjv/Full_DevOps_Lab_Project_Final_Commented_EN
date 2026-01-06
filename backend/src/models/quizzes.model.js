import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  questions: [{
    text: {
      type: String,
      required: true
    },
    options: [String],
    correctIndex: {
      type: Number,
      required: true
    }
  }]
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
