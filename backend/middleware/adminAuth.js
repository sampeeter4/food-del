import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ success: false, message: "Admin login required" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ success: false, message: "Admin access required" });
    req.auth = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired admin token" });
  }
};

export default adminAuth;
