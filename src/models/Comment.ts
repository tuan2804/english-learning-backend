import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
}

const CommentSchema: Schema = new Schema<IComment>(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
