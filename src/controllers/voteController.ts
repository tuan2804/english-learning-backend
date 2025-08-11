import { Request, Response } from "express";
import Vote from "../models/Vote";
import Comment from "../models/Comment";

// Thêm hoặc bỏ Like
export const toggleVote = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const userId = (req as any).user.userId;

    // Kiểm tra comment tồn tại
    const commentExists = await Comment.findById(commentId);
    if (!commentExists) {
      return res.status(404).json({ message: "Comment không tồn tại" });
    }

    // Kiểm tra đã like chưa
    const existingVote = await Vote.findOne({ commentId, userId });
    if (existingVote) {
      // Nếu đã like => bỏ like
      await Vote.deleteOne({ _id: existingVote._id });
      return res.json({ message: "Bỏ like thành công", liked: false });
    }

    // Nếu chưa like => thêm like
    const vote = await Vote.create({ commentId, userId });
    res.status(201).json({ message: "Like thành công", liked: true, vote });
  } catch (error) {
    res.status(500).json({ message: "Like thất bại", error });
  }
};

// Lấy số like của một comment
export const getVotesByComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const count = await Vote.countDocuments({ commentId });
    res.json({ commentId, likes: count });
  } catch (error) {
    res.status(500).json({ message: "Lấy số like thất bại", error });
  }
};
