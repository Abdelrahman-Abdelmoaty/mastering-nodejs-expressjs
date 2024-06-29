"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.toggleLikePost = exports.deletePost = exports.updatePost = exports.createPost = exports.getPost = exports.getPosts = void 0;
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const db_1 = __importDefault(require("../lib/db"));
const auth_1 = require("./auth");
const getPosts = async () => {
    const posts = await db_1.default.post.findMany({
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
exports.getPosts = getPosts;
const getPost = async (id) => {
    const post = await db_1.default.post.findUnique({
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
exports.getPost = getPost;
const createPost = async (data) => {
    const session = await (0, auth_1.getSession)(data.token);
    const post = await db_1.default.post.create({
        data: {
            title: data.title,
            content: data.content,
            userId: session.userId,
        },
    });
    return post;
};
exports.createPost = createPost;
const updatePost = async (id, data) => {
    const session = await (0, auth_1.getSession)(data.token);
    const post = await db_1.default.post.findUnique({
        where: {
            postId: id,
        },
    });
    if (!post) {
        const error = new CustomError_1.default("Post not found");
        error.status = 404;
        throw error;
    }
    if (post?.userId !== session.userId) {
        const error = new CustomError_1.default("Unauthorized");
        error.status = 401;
        throw error;
    }
    const newPost = await db_1.default.post.update({
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
exports.updatePost = updatePost;
const deletePost = async (id, data) => {
    const session = await (0, auth_1.getSession)(data.token);
    const post = await db_1.default.post.findUnique({
        where: {
            postId: id,
        },
    });
    if (!post) {
        const error = new CustomError_1.default("Post not found");
        error.status = 404;
        throw error;
    }
    if (post?.userId !== session.userId) {
        const error = new CustomError_1.default("Unauthorized");
        error.status = 401;
        throw error;
    }
    await db_1.default.post.delete({
        where: {
            postId: id,
        },
    });
    return;
};
exports.deletePost = deletePost;
const toggleLikePost = async (postId, data) => {
    const session = await (0, auth_1.getSession)(data.token);
    const post = await db_1.default.post.findUnique({
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
        const error = new CustomError_1.default("Post not found");
        error.status = 404;
        throw error;
    }
    const hasLiked = post.likes.some((like) => like.userId === session.userId);
    if (hasLiked) {
        await db_1.default.like.deleteMany({
            where: {
                userId: session.userId,
                postId,
            },
        });
        return true;
    }
    else {
        await db_1.default.like.create({
            data: {
                userId: session.userId,
                postId,
            },
        });
        return false;
    }
};
exports.toggleLikePost = toggleLikePost;
const createComment = async (postId, data) => {
    const session = await (0, auth_1.getSession)(data.token);
    const post = await db_1.default.post.findUnique({
        where: {
            postId,
        },
    });
    if (!post) {
        const error = new CustomError_1.default("Post not found");
        error.status = 404;
        throw error;
    }
    await db_1.default.comment.create({
        data: {
            comment: data.comment,
            userId: session.userId,
            postId,
        },
    });
    return;
};
exports.createComment = createComment;
const deleteComment = async (commentId, data) => {
    const session = await (0, auth_1.getSession)(data.token);
    const comment = await db_1.default.comment.findUnique({
        where: {
            commentId,
        },
    });
    if (!comment) {
        const error = new CustomError_1.default("Comment not found");
        error.status = 404;
        throw error;
    }
    if (comment.userId !== session.userId) {
        const error = new CustomError_1.default("Unauthorized");
        error.status = 401;
        throw error;
    }
    await db_1.default.comment.delete({
        where: {
            commentId,
        },
    });
    return;
};
exports.deleteComment = deleteComment;
//# sourceMappingURL=posts.js.map