import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const users = [];

const router = express.Router();

// -------------------------------
// POST /api/auth/register
// -------------------------------
router.post("/register", async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        // Vérification des champs obligatoires
        if(!name || !email || !password){
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        // Verification si l'utilisateur existe déjà
        const existingUser = users.find(u => u.email === email);
        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création utilisateur
        const newUser = {
            id: users.length+1,
            name,
            email,
            password: hashedPassword,
            role: role || "learner"
        };

        users.push(newUser);

        res.status(201).json({message: "Account created successfully"});
    } catch (error){
        res.status(500).json({message: "Server error", error});
    }
});

// -------------------------------
// POST /api/auth/login
// -------------------------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email === email);
        if(!user) {
            return res.status(404).json({message : "User not found"});
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ message: "Incorrect password"});
        }

        // Création JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h"}
        );

        res.json({ message: "Login successful", token});
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

export default router;
