import mongoose, { Document, Schema } from "mongoose";

export interface IVote extends Document {
  commentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const VoteSchema: Schema = new Schema<IVote>(
  {
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

// Không cho 1 user vote 2 lần cho cùng 1 comment
VoteSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IVote>("Vote", VoteSchema);
