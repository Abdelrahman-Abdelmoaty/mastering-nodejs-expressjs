import express from "express";
import {
	createPost,
	deletePost,
	getPost,
	getPosts,
	updatePost,
} from "../controllers/postsController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();
// router.use(authenticate);

// Get all posts
router.get("/", getPosts);

// Get a single post
router.get("/:id", getPost);

// Create a new post
router.post("/", authenticate, createPost);

// Update a post
router.put("/:id", authenticate, updatePost);

// Delete a post
router.delete("/:id", authenticate, deletePost);

export default router;
