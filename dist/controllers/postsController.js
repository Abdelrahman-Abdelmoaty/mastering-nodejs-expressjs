"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.toggleLikePost = exports.deletePost = exports.updatePost = exports.createPost = exports.getPost = exports.getPosts = void 0;
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const posts = __importStar(require("../database/posts"));
// @desc Get all posts
// @route GET /api/posts
// @access Public
const getPosts = async (req, res, next) => {
    let retrivedPosts = null;
    try {
        retrivedPosts = await posts.getPosts();
    }
    catch (error) {
        const customError = new CustomError_1.default(error.message);
        customError.status = 500;
        return next(customError);
    }
    res.status(200).json({
        success: true,
        message: "posts retrieved successfully",
        data: retrivedPosts,
    });
};
exports.getPosts = getPosts;
// @desc Get a single post
// @route GET /api/posts/:postId
// @access Public
const getPost = async (req, res, next) => {
    const postId = parseInt(req.params.postId);
    let post = null;
    try {
        post = await posts.getPost(postId);
    }
    catch (error) {
        const customError = new CustomError_1.default(error.message);
        customError.status = 500;
        return next(customError);
    }
    if (!post) {
        const error = new CustomError_1.default("Post not found");
        error.status = 404;
        return next(error);
    }
    res.status(200).json(post);
};
exports.getPost = getPost;
// @desc Create a new post
// @route POST /api/posts
// @access Private
const createPost = async (req, res, next) => {
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
    }
    catch (error) {
        const customError = new CustomError_1.default(error.message);
        customError.status = 500;
        return next(customError);
    }
};
exports.createPost = createPost;
// @desc Update a post
// @route PUT /api/posts/:postId
// @access Private
const updatePost = async (req, res, next) => {
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
    }
    catch (error) {
        if (error instanceof CustomError_1.default) {
            return next(error);
        }
        else {
            const customError = new CustomError_1.default(error.message);
            customError.status = 500;
            return next(customError);
        }
    }
};
exports.updatePost = updatePost;
// @desc Delete a post
// @route DELETE /api/posts/:postId
// @access Private
const deletePost = async (req, res, next) => {
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
    }
    catch (error) {
        if (error instanceof CustomError_1.default) {
            return next(error);
        }
        else {
            const customError = new CustomError_1.default(error.message);
            customError.status = 500;
            return next(customError);
        }
    }
};
exports.deletePost = deletePost;
// @desc Like a post
// @route POST /api/posts/:postId/like
// @access Private
const toggleLikePost = async (req, res, next) => {
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
    }
    catch (error) {
        if (error instanceof CustomError_1.default) {
            return next(error);
        }
        else {
            const customError = new CustomError_1.default(error.message);
            customError.status = 500;
            return next(customError);
        }
    }
};
exports.toggleLikePost = toggleLikePost;
// @desc Comment on a post
// @route POST /api/posts/:postId/comment
// @access Private
const createComment = async (req, res, next) => {
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
    }
    catch (error) {
        if (error instanceof CustomError_1.default) {
            return next(error);
        }
        else {
            const customError = new CustomError_1.default(error.message);
            customError.status = 500;
            return next(customError);
        }
    }
};
exports.createComment = createComment;
// @desc Delete a comment
// @route DELETE /api/posts/:postId/comment/:commentId
// @access Private
const deleteComment = async (req, res, next) => {
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
    }
    catch (error) {
        if (error instanceof CustomError_1.default) {
            return next(error);
        }
        else {
            const customError = new CustomError_1.default(error.message);
            customError.status = 500;
            return next(customError);
        }
    }
};
exports.deleteComment = deleteComment;
//# sourceMappingURL=postsController.js.map