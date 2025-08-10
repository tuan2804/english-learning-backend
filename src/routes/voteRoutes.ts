import express from "express";
import { toggleVote, getVotesByComment } from "../controllers/voteController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect, toggleVote);
router.get("/:commentId", getVotesByComment);

export default router;
