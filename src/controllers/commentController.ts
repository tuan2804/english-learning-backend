import { Request, Response } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";

// Thêm comment
export const addComment = async (req: Request, res: Response) => {
  try {
    const { postId, content } = req.body;

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    const comment = await Comment.create({
      postId,
      userId: (req as any).user.userId,
      content
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Thêm comment thất bại", error });
  }
};

// Lấy tất cả comment của một bài viết
export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Lấy danh sách comment thất bại", error });
  }
};
