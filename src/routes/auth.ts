import express from "express";
import { register, login, getSession } from "../controllers/authController";

const router = express.Router();

// Register a user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Get session
router.get("/session", getSession);

export default router;
