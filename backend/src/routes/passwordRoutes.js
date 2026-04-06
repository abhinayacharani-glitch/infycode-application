import express from "express";
const router = express.Router();

import { forgotPassword, verifyOTP, resetPassword } from "../controllers/PasswordController.js";
import sendEmail from "../utils/sendEmail.js";

// ✅ Test email credentials (remove after testing)
router.get("/test-email", async (req, res) => {
    try {
        await sendEmail({
            to: process.env.EMAIL_USER,
            subject: "InfyCode Email Test",
            html: "<p>If you see this, your email config is working! ✅</p>",
        });
        res.json({ message: "Test email sent successfully to " + process.env.EMAIL_USER });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Send OTP to email
router.post("/forgot-password", forgotPassword);

// ✅ Verify OTP → returns a reset token on success
router.post("/verify-otp", verifyOTP);

// ✅ Reset password using token (from verify-otp)
router.post("/reset-password", resetPassword);

export default router;
