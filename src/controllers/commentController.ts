// controllers/commentController.ts
import { Request, Response } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";
import Vote from "../models/Vote";

// Thêm comment
export const addComment = async (req: Request, res: Response) => {
  try {
    const { postId, content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Nội dung không được để trống" });
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    let comment = await Comment.create({
      postId,
      userId: (req as any).user.userId,
      content
    });

    comment = await comment.populate("userId", "username email");

    res.status(201).json({
      ...comment.toObject(),
      votes: 0
    });
  } catch (error) {
    res.status(500).json({ message: "Thêm comment thất bại", error });
  }
};

// Lấy tất cả comment của một bài viết kèm số vote
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .lean();

    // Lấy toàn bộ votes count trong 1 lần
    const commentIds = comments.map(c => c._id);
    const votesCount = await Vote.aggregate([
      { $match: { commentId: { $in: commentIds } } },
      { $group: { _id: "$commentId", count: { $sum: 1 } } }
    ]);

    const votesMap = votesCount.reduce((acc, v) => {
      acc[v._id.toString()] = v.count;
      return acc;
    }, {} as Record<string, number>);

    const commentsWithVotes = comments.map(c => ({
      ...c,
      votes: votesMap[c._id.toString()] || 0
    }));

    res.json(commentsWithVotes);
  } catch (error) {
    res.status(500).json({ message: "Lấy danh sách comment thất bại", error });
  }
};
