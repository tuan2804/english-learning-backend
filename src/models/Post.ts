// Post.ts
import mongoose, { Document, Schema } from "mongoose";

const CorrectionSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true }, // đổi text -> content
    explanation: { type: String, default: "" },
    votes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export interface IPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  category: "Writing" | "Grammar" | "Vocabulary";
  corrections: typeof CorrectionSchema[];
  bestCorrection?: mongoose.Types.ObjectId;
}

const PostSchema: Schema = new Schema<IPost>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["Writing", "Grammar", "Vocabulary"],
      required: true
    },
    corrections: [CorrectionSchema],
    bestCorrection: { type: mongoose.Schema.Types.ObjectId }
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
