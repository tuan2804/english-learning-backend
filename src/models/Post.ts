import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  category: "Writing" | "Grammar" | "Vocabulary";
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
    }
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
