import express from "express";
import cors from "cors";
import loginRoutes from "./routes/loginRoutes.js";       // Unified login (admin/trainer/student)
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import counsellingRoutes from "./routes/counsellingRoutes.js";
import syllabusRoutes from "./routes/syllabusRoutes.js";
import { publishFAQ, getNewPublishedFAQs } from "./controllers/faqController.js";

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
// Allow the Vite dev server and any localhost port used during development.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
  "https://infycode-application.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, same-origin)
      const isLocal = origin && (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      );

      if (!origin || allowedOrigins.includes(origin) || isLocal) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin '${origin}' not allowed`));
      }
    },


    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send("Welcome to InfyCode Template Backend...");
});

// API Routes
app.use("/api", loginRoutes);             // POST /api/login  ← unified for admin / trainer / student
app.use("/api", authRoutes);              // /api/student/register, /api/student/login, OTP routes
app.use("/api/admin", adminRoutes);       // /api/admin/dashboard, /api/admin/stats, /api/admin/batches
app.use("/api/trainer", trainerRoutes);   // /api/trainer/register, /api/trainer/verify-otp, /api/trainer/dashboard
app.use("/api/password", passwordRoutes); // /api/password/forgot-password, /api/password/reset-password
app.use("/api/courses", courseRoutes);    // /api/courses CRUD
app.use("/api/syllabuses", syllabusRoutes); // /api/syllabuses CRUD
app.use("/api/faqs", faqRoutes);          // /api/faqs FAQ operations
app.use("/api/student", studentRoutes);   // /api/student operations
app.use("/api/counselling", counsellingRoutes); // /api/counselling operations

export default app;
