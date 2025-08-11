// src/controllers/correctionController.ts
import { Request, Response } from "express";
import Post from "../models/Post";
import Vote from "../models/Vote";
import mongoose from "mongoose";

// Thêm correction
export const createCorrection = async (req: Request, res: Response) => {
  try {
    const { postId, content, explanation } = req.body;
    const userId = (req as any).user.userId;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Nội dung correction không được để trống" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    const correction = {
      user: new mongoose.Types.ObjectId(userId),
      content,
      explanation: explanation || "",
      votes: 0
    };

    post.corrections.push(correction as any);
    await post.save();

    // Populate user cho correction vừa thêm
    const populatedPost = await Post.findById(postId)
        .populate("corrections.user", "username email")
        .lean();

    const newCorrection = populatedPost?.corrections[populatedPost.corrections.length - 1];

    res.status(201).json(newCorrection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Thêm correction thất bại", err });
  }
};

// Vote correction
export const voteCorrection = async (req: Request, res: Response) => {
  try {
    const { correctionId, postId } = req.body;
    const userId = (req as any).user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const correction = (post.corrections as any[]).find(
      c => c._id?.toString() === correctionId
    );
    if (!correction) return res.status(404).json({ message: "Correction not found" });

    const existing = await Vote.findOne({
      commentId: correctionId,
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (existing) {
      await Vote.deleteOne({ _id: existing._id });
      correction.votes = Math.max(0, (correction.votes || 0) - 1);
      await post.save();
      return res.json({ message: "Unliked", liked: false, votes: correction.votes });
    }

    await Vote.create({
      commentId: correctionId,
      userId: new mongoose.Types.ObjectId(userId)
    });
    correction.votes = (correction.votes || 0) + 1;
    await post.save();
    return res.status(201).json({ message: "Liked", liked: true, votes: correction.votes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Vote failed", err });
  }
};

// Chọn best correction
export const chooseBestCorrection = async (req: Request, res: Response) => {
  try {
    const { postId, correctionId } = req.params;
    const userId = (req as any).user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const correction = (post.corrections as any[]).find(
      c => c._id?.toString() === correctionId
    );
    if (!correction) return res.status(404).json({ message: "Correction not found" });

    post.bestCorrection = correction._id;
    await post.save();

    res.json({ message: "Best correction set", bestCorrection: correction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Choose best failed", err });
  }
};
