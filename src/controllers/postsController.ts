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
// @route GET /api/posts/:id
// @access Public
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);

	let post: PostType | null = null;
	try {
		post = await posts.getPost(id);
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
// @route PUT /api/posts/:id
// @access Private
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);
	const data = {
		token: req.headers.authorization?.split(" ")[1],
		title: req.body.title,
		content: req.body.content,
	};

	try {
		const post = await posts.updatePost(id, data);

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
// @route DELETE /api/posts/:id
// @access Private
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
	const id = parseInt(req.params.id);
	const data = {
		token: req.headers.authorization?.split(" ")[1],
	};

	try {
		await posts.deletePost(id, data);
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
