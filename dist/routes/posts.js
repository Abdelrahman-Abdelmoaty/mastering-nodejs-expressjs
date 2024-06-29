"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsController_1 = require("../controllers/postsController");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const router = express_1.default.Router();
// router.use(authenticate);
// Get all posts
router.get("/", postsController_1.getPosts);
// Get a single post
router.get("/:postId", postsController_1.getPost);
// Create a new post
router.post("/", authenticate_1.default, postsController_1.createPost);
// Update a post
router.put("/:postId", authenticate_1.default, postsController_1.updatePost);
// Delete a post
router.delete("/:postId", authenticate_1.default, postsController_1.deletePost);
// Like a post
router.post("/:postId/like", authenticate_1.default, postsController_1.toggleLikePost);
// Comment on a post
router.post("/:postId/comment", authenticate_1.default, postsController_1.createComment);
// Delete a comment
router.delete("/:postId/comment/:commentId", authenticate_1.default, postsController_1.deleteComment);
exports.default = router;
//# sourceMappingURL=posts.js.map