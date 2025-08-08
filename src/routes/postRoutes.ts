import express from "express";
import { createPost, getPosts, getPostById, deletePost } from "../controllers/postController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.delete("/:id", protect, deletePost);

export default router;
