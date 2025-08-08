import { Request, Response } from "express";
import Post from "../models/Post";

// Create a post
export const createPost = async (req: Request, res: Response) => {
  const { title, content, category } = req.body;
  const userId = (req as any).user.userId;

  try {
    const post = await Post.create({ title, content, category, user: userId });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: "Tạo bài viết thất bại", error });
  }
};

// Get all posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("user", "username email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get single post
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "username");
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    const userId = (req as any).user.userId;
    if (post.user.toString() !== userId)
      return res.status(403).json({ message: "Không có quyền xóa bài viết" });

    await post.deleteOne();
    res.json({ message: "Đã xóa bài viết" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
