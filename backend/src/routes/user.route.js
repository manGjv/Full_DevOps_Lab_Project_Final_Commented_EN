import express from "express";
import User from "../models/user.model.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { 
    registerUser, 
    loginUser,
    listUsers,
    getUserById,
    deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// AUTH ROUTES (existing)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", listUsers);           
router.get("/users/:id", getUserById);     
router.delete("/users/:id", deleteUser);   

// PROFILE ROUTES (new)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Ensure user can only update their own profile
    if (req.userId !== id && req.userRole !== 'admin') {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER BADGES
router.get("/:id/badges", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate('badges.courseId', 'title domain')
      .select('badges');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ badges: user.badges || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER PROGRESS
router.get("/:id/progress", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('points hoursSpent modulesCompleted badges');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      points: user.points || 0,
      hoursSpent: user.hoursSpent || 0,
      modulesCompleted: user.modulesCompleted || 0,
      badgesCount: user.badges?.length || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user time spent
router.post("/:id/time", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { hoursToAdd } = req.body;

    // Ensure user can only update their own time
    if (req.userId !== id && req.userRole !== 'admin') {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add time (convert to number and validate)
    const timeToAdd = Number(hoursToAdd) || 0;
    user.hoursSpent = (user.hoursSpent || 0) + timeToAdd;

    await user.save();

    res.json({ 
      success: true,
      hoursSpent: user.hoursSpent 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
