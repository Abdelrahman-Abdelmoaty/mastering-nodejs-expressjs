import CustomError from "../errors/CustomError";
import prisma from "../utils/db";
import { getSession } from "./auth";

export const getPosts = async () => {
	const posts = await prisma.post.findMany({
		include: {
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
