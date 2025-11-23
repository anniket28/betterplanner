import connectDB from "@/middleware/connectDb";
import Otp from "@/models/Otp";
import User from "@/models/User";
import jwt from "jsonwebtoken";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const record = await Otp.findOne({ email });
  if (!record) {
    return res.status(400).json({ error: "OTP expired or invalid" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Incorrect OTP" });
  }

  await Otp.deleteOne({ email });

  // 🔥 Check if user exists
  let user = await User.findOne({ email });

  if (!user) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    user = await User.create({
      email,
      username: email.split("@")[0], // simple username
      timezone: timezone,
      createdAt: new Date()
    });
  }

  // 🔥 Create JWT with username + email
  const token = jwt.sign(
    { email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.setHeader("Set-Cookie", [
    `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`,
  ]);

  return res.status(200).json({
    message: "Login successful",
    email: user.email,
    username: user.username
  });
}

export default connectDB(handler);
