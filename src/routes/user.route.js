// src/routes/user.route.js
import express from "express";
import {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// /api/users          → list
router.get("/", listUsers);

// /api/users/:id      → get one
router.get("/:id", getUserById);

// /api/users/:id      → update
router.put("/:id", updateUser);

// /api/users/:id      → delete
router.delete("/:id", deleteUser);

// BONUS: progress & badges pour les tests users.test.js / integration user.test.js
router.get("/:id/progress", async (req, res, next) => {
  try {
    const user = await getUserForExtras(req, res);
    if (!user) return;
    res.status(200).json({
      points: user.points || 0,
      hoursSpent: user.hoursSpent || 0,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/badges", async (req, res, next) => {
  try {
    const user = await getUserForExtras(req, res);
    if (!user) return;
    res.status(200).json({
      badges: user.badges || [],
    });
  } catch (err) {
    next(err);
  }
});

// petite fonction utilitaire pour éviter de répéter la logique
import User from "../models/user.model.js";
async function getUserForExtras(req, res) {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({ message: "Invalid user ID" });
    return null;
  }
  const user = await User.findById(id).lean();
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }
  return user;
}

export default router;