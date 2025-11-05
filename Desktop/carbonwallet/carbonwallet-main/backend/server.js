import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // ✅ Authentication routes

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).send("✅ CarbonWallet Server is running successfully!");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);

// ✅ MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carbonwallet";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(`✅ MongoDB connected successfully → ${MONGO_URI}`)
  )
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit if DB fails to connect
  });

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
});
