// src/controllers/user.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER - POST /api/auth/register
export async function registerUser(req, res, next) {
  console.log("Register body:", req.body);
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "learner",
    });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

// LOGIN - POST /api/auth/login
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret-key-for-dev",
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        hoursSpent: user.hoursSpent,
        modulesCompleted: user.modulesCompleted,
        badges: user.badges,
      },
    });
  } catch (err) {
    next(err);
  }
}

// LIST USERS - GET /api/users ou /api/auth/users
export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json({ count: users.length, users });
  } catch (err) {
    next(err);
  }
}

// alias pour compatibilité éventuelle
export const getAllUsers = listUsers;

// GET USER BY ID - GET /api/users/:id
export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// UPDATE USER - PUT /api/users/:id
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { name, email, password, role } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email already in use" });
    }

    if (!name && !email && !password && !role) {
      return res
        .status(400)
        .json({ message: "At least one field must be provided" });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({
      message: "User updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        hoursSpent: user.hoursSpent,
        modulesCompleted: user.modulesCompleted,
        badges: user.badges,
      },
    });
  } catch (err) {
    next(err);
  }
}

// DELETE USER - DELETE /api/users/:id
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User deleted successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}