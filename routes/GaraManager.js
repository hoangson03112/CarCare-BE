const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// 📌 Lấy danh sách lịch hẹn "pending" (cần xử lý)
router.get("/pending", async (req, res) => {
  try {
    const pendingAppointments = await Appointment.find({
      status: "pending",
    }).populate("customer", "fullName email phone");
    res.status(200).json(pendingAppointments);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// 📌 Chấp nhận lịch hẹn (Cập nhật trạng thái thành "confirmed")
router.put("/accept/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn!" });
    }

    // Cập nhật trạng thái thành "confirmed"
    appointment.status = "confirmed";
    await appointment.save();

    // Giả lập thông báo (Có thể thay bằng gửi email/sms)
    console.log(`🔔 Lịch hẹn của ${appointment.customer} đã được chấp nhận!`);

    res
      .status(200)
      .json({ message: "Lịch hẹn đã được chấp nhận!", appointment });
  } catch (error) {
    console.error("Lỗi khi chấp nhận lịch hẹn:", error);
    res.status(500).json({ error: "Lỗi server khi chấp nhận lịch hẹn" });
  }
});

// 📌 Từ chối lịch hẹn với lý do (Cập nhật trạng thái thành "cancelled")
router.put("/reject/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Cần nhập lý do từ chối!" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn!" });
    }

    // Cập nhật trạng thái thành "cancelled" và lưu lý do từ chối
    appointment.status = "cancelled";
    appointment.reason = reason; // Cần thêm trường `reason` trong model
    await appointment.save();

    // Giả lập thông báo từ chối (Có thể thay bằng gửi email/sms)
    console.log(
      `❌ Lịch hẹn của ${appointment.customer} đã bị từ chối! Lý do: ${reason}`
    );

    res.status(200).json({ message: "Lịch hẹn đã bị từ chối!", appointment });
  } catch (error) {
    console.error("Lỗi khi từ chối lịch hẹn:", error);
    res.status(500).json({ error: "Lỗi server khi từ chối lịch hẹn" });
  }
});

module.exports = router;
