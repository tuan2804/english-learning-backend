import express from "express";
import { addComment, getCommentsByPost } from "../controllers/commentController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/:postId", getCommentsByPost);

export default router;
