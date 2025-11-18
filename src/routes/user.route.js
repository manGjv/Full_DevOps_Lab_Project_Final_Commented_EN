import express from "express";
const router = express.Router();

// "Base de données" en mémoire
const usersProgress = [
  {
    id: 1,
    name: "Alice",
    points: 120,
    hoursSpent: 10,
    modulesCompleted: 3,
    badges: ["Beginner", "Fast Learner"]
  },
  {
    id: 2,
    name: "Bob",
    points: 80,
    hoursSpent: 5,
    modulesCompleted: 1,
    badges: ["Beginner"]
  }
];

// GET /api/users/:id/progress - Récupérer progression
router.get("/:id/progress", (req, res) => {
  const id = parseInt(req.params.id);
  const user = usersProgress.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    points: user.points,
    hoursSpent: user.hoursSpent,
    modulesCompleted: user.modulesCompleted,
    badges: user.badges
  });
});

// GET /api/users/:id/badges - Récupérer badges
router.get("/:id/badges", (req, res) => {
  const id = parseInt(req.params.id);
  const user = usersProgress.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ badges: user.badges });
});

export default router;
