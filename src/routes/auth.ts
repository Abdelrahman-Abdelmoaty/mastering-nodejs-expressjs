import express from "express";
import {
	register,
	login,
	getSession,
	forgotPassword,
} from "../controllers/authController";

const router = express.Router();

// Register a user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Get session
router.get("/session", getSession);

// Forgot password
router.post("/forgot-password", forgotPassword);

export default router;
