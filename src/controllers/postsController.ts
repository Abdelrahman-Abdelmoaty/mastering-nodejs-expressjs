import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/CustomError";
import * as posts from "../database/posts";
import PostType from "../types/post";

// @desc Get all posts
// @route GET /api/posts
// @access Public
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
	let retrivedPosts: PostType[] | null = null;
	try {
		retrivedPosts = await posts.getPosts();
	} catch (error) {
		const customError = new CustomError(error.message);
		customError.status = 500;
		return next(customError);
	}

	res.status(200).json({
		success: true,
		message: "posts retrieved successfully",
		data: retrivedPosts,
	});
};

// @desc Get a single post
// @route GET /api/posts/:postId
// @access Public
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
	const postId = parseInt(req.params.postId);

	let post: PostType | null = null;
	try {
		post = await posts.getPost(postId);
	} catch (error) {
		const customError = new CustomError(error.message);
		customError.status = 500;
		return next(customError);
	}

	if (!post) {
		const error = new CustomError("Post not found");
		error.status = 404;
		return next(error);
	}

	res.status(200).json(post);
};

// @desc Create a new post
// @route POST /api/posts
// @access Private
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
	const data = {
		token: req.headers.authorization?.split(" ")[1],
		title: req.body.title,
		content: req.body.content,
	};

	try {
		const post = await posts.createPost(data);

		res.status(201).json({
			success: true,
			message: "Post created successfully",
			data: post,
		});
	} catch (error) {
		const customError = new CustomError(error.message);
		customError.status = 500;
		return next(customError);
	}
};

// @desc Update a post
// @route PUT /api/posts/:postId
// @access Private
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
	const postId = parseInt(req.params.postId);
	const data = {
		token: req.headers.authorization?.split(" ")[1],
		title: req.body.title,
		content: req.body.content,
	};

	try {
		const post = await posts.updatePost(postId, data);

		res.status(200).json({
			success: true,
			message: "Post updated successfully",
			data: post,
		});
	} catch (error) {
		if (error instanceof CustomError) {
			return next(error);
		} else {
			const customError = new CustomError(error.message);
			customError.status = 500;
			return next(customError);
		}
	}
};

// @desc Delete a post
// @route DELETE /api/posts/:postId
// @access Private
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
	const postId = parseInt(req.params.postId);
	const data = {
		token: req.headers.authorization?.split(" ")[1],
	};

	try {
		await posts.deletePost(postId, data);
		res.status(200).json({
			success: true,
			message: "Post deleted successfully",
		});
	} catch (error) {
		if (error instanceof CustomError) {
			return next(error);
		} else {
			const customError = new CustomError(error.message);
			customError.status = 500;
			return next(customError);
		}
	}
};

// @desc Like a post
// @route POST /api/posts/:postId/like
// @access Private
export const toggleLikePost = async (req: Request, res: Response, next: NextFunction) => {
	const postId = parseInt(req.params.postId);
	const data = {
		token: req.headers.authorization?.split(" ")[1],
	};

	try {
		const hasLiked = await posts.toggleLikePost(postId, data);

		res.status(200).json({
			success: true,
			message: hasLiked ? "Post unliked successfully" : "Post liked successfully",
		});
	} catch (error) {
		if (error instanceof CustomError) {
			return next(error);
		} else {
			const customError = new CustomError(error.message);
			customError.status = 500;
			return next(customError);
		}
	}
};

// @desc Comment on a post
// @route POST /api/posts/:postId/comment
// @access Private
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
	const postId = parseInt(req.params.postId);
	const data = {
		token: req.headers.authorization?.split(" ")[1],
		comment: req.body.comment,
	};

	try {
		const comment = await posts.createComment(postId, data);

		res.status(200).json({
			success: true,
			message: "Comment added successfully",
			data: comment,
		});
	} catch (error) {
		if (error instanceof CustomError) {
			return next(error);
		} else {
			const customError = new CustomError(error.message);
			customError.status = 500;
			return next(customError);
		}
	}
};

// @desc Delete a comment
// @route DELETE /api/posts/:postId/comment/:commentId
// @access Private
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
	const commentId = parseInt(req.params.commentId);
	const data = {
		token: req.headers.authorization?.split(" ")[1],
	};

	try {
		await posts.deleteComment(commentId, data);

		res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
		});
	} catch (error) {
		if (error instanceof CustomError) {
			return next(error);
		} else {
			const customError = new CustomError(error.message);
			customError.status = 500;
			return next(customError);
		}
	}
};
