import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function handler(req, res) {
  if (!req.headers.cookie) return res.status(200).json({ user: null });

  const { token } = cookie.parse(req.headers.cookie || "");
  if (!token) return res.status(200).json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      user: {
        email: decoded.email,
        username: decoded.username
      }
    });
  } catch (err) {
    return res.status(200).json({ user: null });
  }
}
