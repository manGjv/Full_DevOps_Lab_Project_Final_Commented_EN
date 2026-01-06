import express from "express";
import User from "../models/user.model.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Award badge when user gets 100% on quiz
router.post("/award", authMiddleware, async (req, res) => {
  try {
    const { quizTitle, courseId } = req.body;
    const userId = req.userId;

    console.log("Badge award request:", { userId, quizTitle, courseId });

    if (!quizTitle || !courseId) {
      return res.status(400).json({ error: "quizTitle and courseId are required" });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.badges) {
      user.badges = [];
    }

    // Check if badge already exists
    const badgeExists = user.badges.some(
      badge => badge.courseId?.toString() === courseId && badge.quizTitle === quizTitle
    );

    if (badgeExists) {
      console.log("Badge already exists");
      return res.json({ 
        success: true, 
        message: "Badge already earned",
        badges: user.badges 
      });
    }

    // Add new badge
    user.badges.push({
      quizTitle,
      courseId,
      earnedAt: new Date()
    });

    // Award points for badge (optional)
    user.points = (user.points || 0) + 100;

    await user.save();

    console.log("Badge awarded successfully!");

    res.json({ 
      success: true, 
      message: "Badge awarded!",
      badges: user.badges,
      newBadge: {
        quizTitle,
        courseId,
        earnedAt: new Date()
      }
    });
  } catch (err) {
    console.error("Error awarding badge:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
