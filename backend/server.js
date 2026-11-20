import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import platformRouter from "./routes/platformRoute.js";
const app = express();
const port = process.env.PORT || 4000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const allowedOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:5173,http://localhost:5174")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error("Origin not allowed by CORS"));
}, credentials: true }));
app.use(express.json({ limit: "1mb" }));

// Lightweight per-IP throttle for authentication and write endpoints.
const requestBuckets = new Map();
app.use((req, res, next) => {
  if (!(["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) && !req.path.includes("/login")) return next();
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const bucket = requestBuckets.get(key) || { count: 0, resetAt: now + 60_000 };
  if (now > bucket.resetAt) { bucket.count = 0; bucket.resetAt = now + 60_000; }
  bucket.count += 1;
  requestBuckets.set(key, bucket);
  if (bucket.count > 60) return res.status(429).json({ success: false, message: "Too many requests. Please try again shortly." });
  next();
});

app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/platform", platformRouter);
app.get("/", (req, res) => res.json({ success: true, service: "MealMate API", status: "online" }));
app.get("/health", (req, res) => res.json({ success: true, status: "healthy", uptime: process.uptime() }));
app.use((err, req, res, next) => {
  console.error("Request error:", err.message);
  if (res.headersSent) return next(err);
  return res.status(err.message.includes("CORS") ? 403 : 500).json({ success: false, message: err.message.includes("CORS") ? "Origin not allowed" : "Internal server error" });
});

const start = async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing from backend environment variables");
    await connectDB();
    app.listen(port, () => console.log(`MealMate API listening on port ${port}`));
  } catch (error) {
    console.error("API startup failed:", error.message);
    process.exit(1);
  }
};
start();
