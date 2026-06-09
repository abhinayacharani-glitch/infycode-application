import nodemailer from "nodemailer";
import { randomUUID } from "crypto";

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const domain = (process.env.EMAIL_USER || "infycode@gmail.com").split("@")[1] || "gmail.com";
  const messageId = `<${randomUUID()}@${domain}>`;

  const mailOptions = {
    from: `"InfyCode Learning Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    // ── Anti-Spam Headers ──────────────────────────────────────────────────
    messageId,
    headers: {
      "X-Mailer": "InfyCode Mailer v1.0",
      "X-Priority": "3",
      "Precedence": "bulk",
      "List-Unsubscribe": `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>`,
      "MIME-Version": "1.0",
    },
    // Include plain text as fallback (massively reduces spam score)
    text: html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?(p|div|h[1-6]|tr|li)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${to} | MessageId: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
};

export default sendEmail;