import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

export default app;
