// src/models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Champs pour l'authentification
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["learner", "teacher", "admin"], default: "learner" },

    // Champs pour la progression (cyberlearning)
    points: { type: Number, default: 0 },
    hoursSpent: { type: Number, default: 0 },
    modulesCompleted: { type: Number, default: 0 },
    badges: { type: [String], default: [] }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
