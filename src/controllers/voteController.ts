import { Request, Response } from "express";
import Vote from "../models/Vote";
import Comment from "../models/Comment";

// Thêm hoặc bỏ vote
export const toggleVote = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const userId = (req as any).user.userId;

    // Kiểm tra comment tồn tại
    const commentExists = await Comment.findById(commentId);
    if (!commentExists) {
      return res.status(404).json({ message: "Comment không tồn tại" });
    }

    // Kiểm tra đã vote chưa
    const existingVote = await Vote.findOne({ commentId, userId });
    if (existingVote) {
      // Nếu đã vote => bỏ vote
      await Vote.deleteOne({ _id: existingVote._id });
      return res.json({ message: "Bỏ vote thành công", voted: false });
    }

    // Nếu chưa vote => thêm vote
    const vote = await Vote.create({ commentId, userId });
    res.status(201).json({ message: "Vote thành công", voted: true, vote });
  } catch (error) {
    res.status(500).json({ message: "Vote thất bại", error });
  }
};

// Lấy số vote của một comment
export const getVotesByComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const count = await Vote.countDocuments({ commentId });
    res.json({ commentId, votes: count });
  } catch (error) {
    res.status(500).json({ message: "Lấy số vote thất bại", error });
  }
};
