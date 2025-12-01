import express from "express";
const router = express.Router();

// "Base de données" en mémoire
let usersProgress = [
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

/* ---------------------------
      CRUD USERS
----------------------------*/

// GET /api/users  → List all
router.get("/", (req, res) => {
  res.status(200).json(usersProgress);
});

// GET /api/users/:id  → Retrieve by ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = usersProgress.find(u => u.id === id);

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /api/users  → Create
router.post("/", (req, res) => {
  const { name, points, hoursSpent, modulesCompleted, badges } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required field: name" });
  }

  const newUser = {
    id: usersProgress.length + 1,
    name,
    points: points ?? 0,
    hoursSpent: hoursSpent ?? 0,
    modulesCompleted: modulesCompleted ?? 0,
    badges: badges ?? []
  };

  usersProgress.push(newUser);
  res.status(201).json(newUser);
});

// PUT /api/users/:id  → Update
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = usersProgress.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  usersProgress[index] = { ...usersProgress[index], ...req.body };
  res.json(usersProgress[index]);
});

// DELETE /api/users/:id  → Delete
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = usersProgress.length;

  usersProgress = usersProgress.filter(u => u.id !== id);

  if (usersProgress.length === before) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(204).end();
});


/* ---------------------------
   EXTRA ROUTES (non CRUD)
----------------------------*/

// GET /api/users/:id/progress
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

// GET /api/users/:id/badges
router.get("/:id/badges", (req, res) => {
  const id = parseInt(req.params.id);
  const user = usersProgress.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({ badges: user.badges });
});

export default router;
