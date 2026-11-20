import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "admin") return res.status(403).json({ success: false, message: "Customer access only" });
    req.auth = decoded;
    req.body.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
