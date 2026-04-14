import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
// Allow the Vite dev server and any localhost port used during development.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://infycode-application.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
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
//app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Welcome to InfyCode Template Backend...");
});

// API Routes
app.use("/api", authRoutes);              // /api/student/login, /api/student/register
app.use("/api/admin", adminRoutes);       // /api/admin/login, /api/admin/register
app.use("/api/trainer", trainerRoutes);   // /api/trainer/login, /api/trainer/register
app.use("/api/password", passwordRoutes); // /api/password/forgot-password, /api/password/reset-password
app.use("/api/courses", courseRoutes);    // /api/courses CRUD

export default app;
