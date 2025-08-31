const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/userMode");
const validator = require("validator");
const { sendVerificationEmail } = require("../utils/email");

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_DEFAULT_SECRET";
const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; 

// ------------------ REGISTER ------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.length < 2) return res.status(400).json({ error: "Name must be at least 2 characters" });
    if (!email || !validator.isEmail(email)) return res.status(400).json({ error: "Invalid email address" });
    if (!password || password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password))
      return res.status(400).json({ error: "Password must include uppercase letter, number, and special character" });

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + VERIFICATION_TOKEN_EXPIRY;

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry: tokenExpiry,
      role: "student",
    });

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ VERIFY EMAIL ------------------
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    // Verify email
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ LOGIN ------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.isEmailVerified) return res.status(403).json({ error: "Please verify your email first" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("teacherToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,   
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
