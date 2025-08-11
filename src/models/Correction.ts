// models/Correction.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICorrection extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  explanation?: string;
  createdAt: Date;
}

const CorrectionSchema = new Schema<ICorrection>(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    explanation: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<ICorrection>("Correction", CorrectionSchema);
