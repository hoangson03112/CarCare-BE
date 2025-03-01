const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Garage = require("../models/Garage");
const router = express.Router();

// Đăng ký người dùng
router.post("/register", async (req, res) => {
  const { fullName, phone, email, password } = req.body;
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã được sử dụng" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới với role mặc định là "user"
    const user = new User({
      fullName,
      phone,
      email,
      password: hashedPassword,
      role: "customer",
    });

    await user.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Lỗi server khi đăng ký" });
  }
});

// API Đăng ký tài khoản gara
router.post("/register-garage", async (req, res) => {
  const {
    fullName,
    phone,
    email,
    password,
    garageName,
    address,
    services,
    workingHours,
  } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã được sử dụng" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // **Bước 1: Tạo user trước (không có garage)**
    const user = new User({
      name: fullName,
      phone,
      email,
      password: hashedPassword,
      role: "garage_owner",
      garage: null, // ✅ Cho phép null ban đầu
    });

    await user.save(); // ✅ Lưu user trước

    // **Bước 2: Tạo gara**
    const newGarage = new Garage({
      owner: user._id,
      name: garageName,
      address,
      phone,
      services,
      workingHours,
    });

    await newGarage.save(); // ✅ Lưu gara

    // **Bước 3: Cập nhật user với garage đã có**
    await User.findByIdAndUpdate(user._id, { garage: newGarage._id });

    res
      .status(201)
      .json({ message: "Đăng ký gara thành công", user, garage: newGarage });
  } catch (error) {
    console.error("Register garage error:", error);
    res.status(500).json({ error: "Lỗi server khi đăng ký tài khoản gara" });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Email hoặc mật khẩu không đúng" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Trả về thông tin người dùng và token
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Lỗi server khi đăng nhập" });
  }
});

module.exports = router;
