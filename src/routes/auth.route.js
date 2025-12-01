import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const users = [];

const router = express.Router();

// -------------------------------
// CREATE - POST /api/auth/register
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
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            role: role || "learner"
        };

        users.push(newUser);

        res.status(201).json({
            message: "Account created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error){
        res.status(500).json({message: "Server error", error: error.message});
    }
});

// -------------------------------
// READ - GET /api/auth/users (list all users)
// -------------------------------
router.get("/users", (req, res) => {
    try {
        // Ne jamais retourner les mots de passe!
        const safeUsers = users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role
        }));

        res.status(200).json({
            count: safeUsers.length,
            users: safeUsers
        });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
});

// -------------------------------
// READ - GET /api/auth/users/:id (get specific user)
// -------------------------------
router.get("/users/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ne pas retourner le mot de passe
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
});

// -------------------------------
// POST /api/auth/login (authentication, not CRUD)
// -------------------------------
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

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
            process.env.JWT_SECRET || "secret-key-for-dev",
            { expiresIn: "2h"}
        );

        res.status(200).json({ 
            message: "Login successful", 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
});

// -------------------------------
// UPDATE - PUT /api/auth/users/:id
// -------------------------------
router.put("/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Trouver l'utilisateur
        const index = users.findIndex(u => u.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, email, password, role } = req.body;

        // Vérifier qu'au moins un champ est fourni
        if (!name && !email && !password && !role) {
            return res.status(400).json({ message: "At least one field must be provided to update" });
        }

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email && email !== users[index].email) {
            const emailExists = users.find(u => u.email === email && u.id !== id);
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Re-hash du mot de passe si modifié
        let updatedPassword = users[index].password;
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        // Mise à jour
        users[index] = {
            ...users[index],
            name: name ?? users[index].name,
            email: email ?? users[index].email,
            password: updatedPassword,
            role: role ?? users[index].role
        };

        res.status(200).json({ 
            message: "User updated", 
            user: {
                id: users[index].id,
                name: users[index].name,
                email: users[index].email,
                role: users[index].role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// -------------------------------
// DELETE - DELETE /api/auth/users/:id
// -------------------------------
router.delete("/users/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const index = users.findIndex(u => u.id === id);

        if (index === -1) {
            return res.status(404).json({ message: "User not found" });
        }

        const deletedUser = users[index];
        users.splice(index, 1);

        res.status(200).json({
            message: "User deleted successfully",
            user: {
                id: deletedUser.id,
                name: deletedUser.name,
                email: deletedUser.email,
                role: deletedUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export { users };
export default router;