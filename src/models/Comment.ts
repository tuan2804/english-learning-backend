// src/models/Comment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  votes: number;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>("Comment", CommentSchema);
