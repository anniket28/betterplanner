import nodemailer from "nodemailer";
import connectDB from "@/middleware/connectDb";
import Otp from "@/models/Otp";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  // 1. Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Store OTP in DB (clear old OTP)
  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
  });

  try {
    // 3. Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.NEXT_PUBLIC_SENDER_EMAIL_ID,
        pass: process.env.NEXT_PUBLIC_SENDER_EMAIL_PASSWORD
      },
    });

    // 4. Send email
    await transporter.sendMail({
      from: `"BetterPlanner" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP for BetterPlanner Login",
      html: `
        <p>Your OTP for login is:</p>
        <h2 style="font-size: 24px; letter-spacing: 2px;">${otp}</h2>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
      `,
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}

export default connectDB(handler);
