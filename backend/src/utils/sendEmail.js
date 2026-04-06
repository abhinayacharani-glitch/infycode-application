import nodemailer from "nodemailer";

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

  const mailOptions = {
    from: `"InfyCode" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${to}`);
    if (info.messageId) {
      console.log(`Message ID: ${info.messageId}`);
    }
    return { success: true, info };
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);
    throw error; // Re-throw to allow controllers to handle specifically
  }
};

export default sendEmail;