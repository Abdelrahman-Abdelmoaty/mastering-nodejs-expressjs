import express from "express";
import {
	createPost,
	deletePost,
	getPost,
	getPosts,
	updatePost,
	toggleLikePost,
	createComment,
	deleteComment,
} from "../controllers/postsController";
import authenticate from "../middlewares/authenticate";

const router = express.Router();
// router.use(authenticate);

// Get all posts
router.get("/", getPosts);

// Get a single post
router.get("/:postId", getPost);

// Create a new post
router.post("/", authenticate, createPost);

// Update a post
router.put("/:postId", authenticate, updatePost);

// Delete a post
router.delete("/:postId", authenticate, deletePost);

// Like a post
router.post("/:postId/like", authenticate, toggleLikePost);

// Comment on a post
router.post("/:postId/comment", authenticate, createComment);

// Delete a comment
router.delete("/:postId/comment/:commentId", authenticate, deleteComment);

export default router;
