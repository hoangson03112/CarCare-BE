const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// 📌 Đặt lịch hẹn mới
router.post("/book", async (req, res) => {
  try {
    const { customer, garage, vehicle, service, date, time } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!customer || !garage || !vehicle || !service || !date || !time) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Tạo lịch hẹn mới
    const newAppointment = new Booking({
      customer,
      garage,
      vehicle,
      service,
      date,
      time,
    });

    await newAppointment.save();
    res
      .status(201)
      .json({ message: "Đặt lịch thành công!", appointment: newAppointment });
  } catch (error) {
    console.error("Lỗi khi đặt lịch:", error);
    res.status(500).json({ error: "Lỗi server khi đặt lịch" });
  }
});

router.get("/user/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const appointments = await Booking.find({
      customer: customerId,
    }).populate("garage", "name address");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Lỗi khi lấy lịch hẹn của user:", error);
    res.status(500).json({ error: "Lỗi server khi lấy lịch hẹn của user" });
  }
});

// 📌 Lấy danh sách lịch hẹn của Gara
router.get("/garage/:garageId", async (req, res) => {
  try {
    const { garageId } = req.params;
    const appointments = await Booking.find({ garage: garageId }).populate(
      "customer",
      "name phone"
    );

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Lỗi khi lấy lịch hẹn của gara:", error);
    res.status(500).json({ error: "Lỗi server khi lấy lịch hẹn của gara" });
  }
});

// 📌 Cập nhật trạng thái lịch hẹn (VD: xác nhận, hoàn thành, hủy)
router.patch("/:appointmentId/status", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    const updatedAppointment = await Booking.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Lịch hẹn không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật trạng thái thành công",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    res.status(500).json({ error: "Lỗi server khi cập nhật trạng thái" });
  }
});

// 📌 Hủy lịch hẹn
router.delete("/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const deletedAppointment = await Booking.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Lịch hẹn không tồn tại" });
    }

    res.status(200).json({ message: "Đã hủy lịch hẹn" });
  } catch (error) {
    console.error("Lỗi khi hủy lịch hẹn:", error);
    res.status(500).json({ error: "Lỗi server khi hủy lịch hẹn" });
  }
});

module.exports = router;
