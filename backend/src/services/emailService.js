import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail", // Change if using SendGrid or another service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email notification when a user's FAQ is answered.
 * @param {string} userEmail - The email of the user who asked the question.
 * @param {string} question - The user's original question.
 * @param {string} answer - The admin's provided answer.
 */
export const sendFAQEmail = async (userEmail, question, answer) => {
  try {
    const mailOptions = {
      from: `"InfyCode Support" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your Question Has Been Answered 🎉",
      text: `Hello,

Thank you for reaching out with your question. We truly appreciate your curiosity and engagement.

Here is your question:
${question}

Here is the answer from our team:
${answer}

If you have more questions, feel free to ask anytime!

Best regards,
Support Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}: ${info.response}`);
    return true;
  } catch (error) {
    console.error("Error sending FAQ email:", error);
    // Don't throw the error to prevent blocking the main response, 
    // but return false so the caller knows it failed if they need to.
    return false;
  }
};
