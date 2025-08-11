import express from "express";
import { createCorrection, voteCorrection, chooseBestCorrection } from "../controllers/correctionController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, createCorrection); // body: { postId, content, explanation }
router.post("/vote", protect, voteCorrection); // body: { postId, correctionId }
router.patch("/:postId/best/:correctionId", protect, chooseBestCorrection);

export default router;