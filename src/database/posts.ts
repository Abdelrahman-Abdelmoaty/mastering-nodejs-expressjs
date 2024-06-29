import CustomError from "../errors/CustomError";
import prisma from "../lib/db";
import { getSession } from "./auth";

export const getPosts = async () => {
	const posts = await prisma.post.findMany({
		include: {
			user: {
				select: {
					userId: true,
					username: true,
				},
			},
			likes: {
				select: {
					userId: true,
				},
			},
			comments: {
				select: {
					commentId: true,
					comment: true,
				},
			},
		},
	});
	return posts;
};

export const getPost = async (id: number) => {
	const post = await prisma.post.findUnique({
		where: {
			postId: id,
		},
		include: {
			user: {
				select: {
					userId: true,
					username: true,
				},
			},
			likes: {
				select: {
					userId: true,
				},
			},
			comments: {
				select: {
					commentId: true,
					comment: true,
				},
			},
		},
	});
	return post;
};

export const createPost = async (data: {
	token: string;
	title: string;
	content: string;
}) => {
	const session = await getSession(data.token);

	const post = await prisma.post.create({
		data: {
			title: data.title,
			content: data.content,
			userId: session.userId,
		},
	});
	return post;
};

export const updatePost = async (
	id: number,
	data: {
		token: string;
		title: string;
		content: string;
	}
) => {
	const session = await getSession(data.token);
	const post = await prisma.post.findUnique({
		where: {
			postId: id,
		},
	});

	if (!post) {
		const error = new CustomError("Post not found");
		error.status = 404;
		throw error;
	}

	if (post?.userId !== session.userId) {
		const error = new CustomError("Unauthorized");
		error.status = 401;
		throw error;
	}

	const newPost = await prisma.post.update({
		where: {
			postId: id,
		},
		data: {
			title: data.title,
			content: data.content,
		},
	});
	return newPost;
};

export const deletePost = async (
	id: number,
	data: {
		token: string;
	}
) => {
	const session = await getSession(data.token);
	const post = await prisma.post.findUnique({
		where: {
			postId: id,
		},
	});

	if (!post) {
		const error = new CustomError("Post not found");
		error.status = 404;
		throw error;
	}

	if (post?.userId !== session.userId) {
		const error = new CustomError("Unauthorized");
		error.status = 401;
		throw error;
	}

	await prisma.post.delete({
		where: {
			postId: id,
		},
	});

	return;
};

export const toggleLikePost = async (postId: number, data: { token: string }) => {
	const session = await getSession(data.token);
	const post = await prisma.post.findUnique({
		where: {
			postId,
		},
		include: {
			likes: {
				select: {
					userId: true,
				},
			},
		},
	});

	if (!post) {
		const error = new CustomError("Post not found");
		error.status = 404;
		throw error;
	}

	const hasLiked = post.likes.some((like) => like.userId === session.userId);

	if (hasLiked) {
		await prisma.like.deleteMany({
			where: {
				userId: session.userId,
				postId,
			},
		});

		return true;
	} else {
		await prisma.like.create({
			data: {
				userId: session.userId,
				postId,
			},
		});
		return false;
	}
};

export const createComment = async (
	postId: number,
	data: { token: string; comment: string }
) => {
	const session = await getSession(data.token);
	const post = await prisma.post.findUnique({
		where: {
			postId,
		},
	});

	if (!post) {
		const error = new CustomError("Post not found");
		error.status = 404;
		throw error;
	}

	await prisma.comment.create({
		data: {
			comment: data.comment,
			userId: session.userId,
			postId,
		},
	});

	return;
};

export const deleteComment = async (commentId: number, data: { token: string }) => {
	const session = await getSession(data.token);
	const comment = await prisma.comment.findUnique({
		where: {
			commentId,
		},
	});

	if (!comment) {
		const error = new CustomError("Comment not found");
		error.status = 404;
		throw error;
	}

	if (comment.userId !== session.userId) {
		const error = new CustomError("Unauthorized");
		error.status = 401;
		throw error;
	}

	await prisma.comment.delete({
		where: {
			commentId,
		},
	});

	return;
};
