import cookie from "cookie";
import jwt from "jsonwebtoken";

export function getUserFromRequest(req) {
    if (!req.headers.cookie) return null;

    const { token } = cookie.parse(req.headers.cookie || "");
    if (!token) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}
