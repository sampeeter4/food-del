import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

const createToken = (user) => jwt.sign(
  { id: user._id.toString(), role: user.role || "customer" },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!validator.isEmail(email) || !password) return res.status(400).json({ success: false, message: "Enter a valid email and password" });
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    return res.json({ success: true, token: createToken(user), user: { name: user.name, email: user.email, role: user.role || "customer" } });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to log in right now" });
  }
};

const registerUser = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (name.length < 2 || name.length > 80) return res.status(400).json({ success: false, message: "Name must be between 2 and 80 characters" });
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Please enter a valid email" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters" });
    if (await userModel.findOne({ email })) return res.status(409).json({ success: false, message: "An account with this email already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({ name, email, password: hashedPassword, role: "customer" });
    return res.status(201).json({ success: true, token: createToken(user), user: { name: user.name, email: user.email, role: "customer" } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "An account with this email already exists" });
    console.error("Registration failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to create account right now" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";
    if (!adminEmail || !passwordHash) return res.status(503).json({ success: false, message: "Admin credentials are not configured on the server" });
    const emailMatches = email === adminEmail;
    const passwordMatches = password.length > 0 && await bcrypt.compare(password, passwordHash);
    if (!emailMatches || !passwordMatches) return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    const token = jwt.sign({ id: "admin", role: "admin", email: adminEmail }, process.env.JWT_SECRET, { expiresIn: "8h" });
    return res.json({ success: true, token, admin: { email: adminEmail, role: "admin" } });
  } catch (error) {
    console.error("Admin login failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to log in right now" });
  }
};

export { loginUser, registerUser, adminLogin };
