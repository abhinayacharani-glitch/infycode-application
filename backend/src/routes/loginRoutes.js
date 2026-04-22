/**
 * loginRoutes.js
 *
 * Unified login route — handles Admin, Trainer, and Student
 * POST /api/login
 */

import express from "express";
const router = express.Router();

import { unifiedLogin } from "../controllers/loginController.js";

// ✅ Unified Login — POST /api/login
router.post("/login", unifiedLogin);

export default router;
