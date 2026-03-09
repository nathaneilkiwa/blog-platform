const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  toggleLike,
  editComment,
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Debug logging (optional - remove in production)
console.log('✓ Post routes loaded');
console.log('  - Controller functions:', Object.keys({
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  toggleLike
}).join(', '));

// Post routes
router.route("/")
  .get(getPosts)
  .post(protect, createPost);

router.route("/:id")
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Like route
router.put("/:id/like", protect, toggleLike);

// Comment routes
router.post("/:id/comments", protect, addComment);
router.put("/:postId/comments/:commentId", protect, updateComment);
router.delete("/:postId/comments/:commentId", protect, deleteComment);

router.route("/:postId/comments/:commentId")
  .put(protect, editComment)
  .delete(protect, deleteComment);

module.exports = router;