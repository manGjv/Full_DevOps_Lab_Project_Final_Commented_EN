import express from "express";
import { 
    registerUser, 
    loginUser,
    listUsers,
    getUserById,
    deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", listUsers);           
router.get("/users/:id", getUserById);     
router.delete("/users/:id", deleteUser);   

export default router;
