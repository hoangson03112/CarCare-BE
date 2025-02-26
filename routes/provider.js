const express = require("express");
const router = express.Router();
const Provider = require("../models/Provider");
const Booking = require("../models/Booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const provider = await Provider.findOne({ email });
  if (!provider || !(await bcrypt.compare(password, provider.password))) {
    return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
  }
  const token = jwt.sign(
    { id: provider._id, role: "provider" },
    process.env.JWT_SECRET
  );
  res.json({ token });
});

router.get("/bookings", auth, async (req, res) => {
  if (req.user.role !== "provider")
    return res.status(403).json({ error: "Không có quyền" });
  const bookings = await Booking.find({ providerId: req.user.id }).populate(
    "userId",
    "name"
  );
  res.json(bookings);
});

router.put("/booking/:id", auth, async (req, res) => {
  const { status, reason } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (booking.providerId.toString() !== req.user.id)
    return res.status(403).json({ error: "Không có quyền" });
  booking.status = status === "Không nhận" ? `Không nhận: ${reason}` : status;
  await booking.save();
  res.json(booking);
});

router.get("/stats", auth, async (req, res) => {
  const bookings = await Booking.find({ providerId: req.user.id });
  const revenue = bookings.reduce(
    (sum, b) => (b.status === "Đã nhận" ? sum + b.price : sum),
    0
  );
  const customerCount = bookings.length;
  res.json({ revenue, customerCount });
});

module.exports = router;
