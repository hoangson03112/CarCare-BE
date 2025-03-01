const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Không có token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token không hợp lệ" });
  }
};

// Tạo booking (khách hàng)
router.post("/", authMiddleware, async (req, res) => {
  const { carInfo, condition, service, time } = req.body;
  if (req.user.role !== "customer")
    return res.status(403).json({ error: "Chỉ khách hàng mới được booking" });
  try {
    const booking = new Booking({
      customerId: req.user.id,
      carInfo,
      condition,
      service,
      time,
    });
    await booking.save();
    res.status(201).json({ message: "Booking thành công", booking });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Xem danh sách booking (khách hàng hoặc garage)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === "customer") {
      bookings = await Booking.find({ customerId: req.user.id }).populate(
        "garageId",
        "username"
      );
    } else if (req.user.role === "garage") {
      bookings = await Booking.find({
        $or: [{ garageId: req.user.id }, { garageId: null, status: "pending" }],
      }).populate("customerId", "username");
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Kiểm tra thời gian trống của garage
router.get("/availability", authMiddleware, async (req, res) => {
  if (req.user.role !== "garage")
    return res.status(403).json({ error: "Chỉ garage mới xem được" });
  try {
    const { date } = req.query; // Truyền ngày cần kiểm tra từ frontend (YYYY-MM-DD)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      garageId: req.user.id,
      time: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["accepted", "completed"] },
    });

    res.json(bookings.map((b) => ({ time: b.time, status: b.status })));
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Nhận hoặc từ chối booking (garage)
router.put("/:id", authMiddleware, async (req, res) => {
  const { status, reason } = req.body;
  if (req.user.role !== "garage")
    return res.status(403).json({ error: "Chỉ garage mới được xử lý" });
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Booking không hợp lệ hoặc đã được xử lý" });
    }
    booking.status = status;
    if (status === "accepted") {
      booking.garageId = req.user.id;
    } else if (status === "rejected") {
      booking.feedback = reason || "Không có lý do";
    }
    await booking.save();
    res.json({
      message: `Đã ${status === "accepted" ? "nhận" : "từ chối"} booking`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Gửi feedback (khách hàng)
router.post("/:id/feedback", authMiddleware, async (req, res) => {
  const { feedback } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (
      req.user.role !== "customer" ||
      booking.customerId.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Không có quyền" });
    }
    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ error: "Chỉ được feedback khi dịch vụ hoàn thành" });
    }
    booking.feedback = feedback;
    await booking.save();
    res.json({ message: "Gửi feedback thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
