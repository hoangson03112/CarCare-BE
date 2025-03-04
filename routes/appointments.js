const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// 📌 Đặt lịch hẹn mới
router.post("/book", async (req, res) => {
  try {
    const { customer, garage, vehicle, service, date, time } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!customer || !garage || !vehicle || !service || !date || !time) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Tạo lịch hẹn mới
    const newAppointment = new Appointment({
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

//gara
router.put("/appointment/:id/status", async (req, res) => {
  try {
    const { status, reason } = req.body;
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

    // Kiểm tra trạng thái hợp lệ
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ!" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn" });
    }

    // Nếu hủy lịch hẹn mà không có lý do -> báo lỗi
    if (status === "cancelled" && !reason) {
      return res.status(400).json({ error: "Phải có lý do khi hủy lịch hẹn!" });
    }

    appointment.status = status;
    appointment.reason = status === "cancelled" ? reason : null;
    await appointment.save();

    res.json({
      message: `Lịch hẹn đã được ${
        status === "confirmed"
          ? "xác nhận"
          : status === "completed"
          ? "hoàn thành"
          : "hủy"
      }`,
      appointment,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái lịch hẹn:", error);
    res.status(500).json({ error: "Lỗi server khi cập nhật trạng thái" });
  }
});

// 📌 Lấy danh sách lịch hẹn
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    console.error("Lỗi lấy danh sách lịch hẹn:", error);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách lịch hẹn" });
  }
});

// 📌 Xóa lịch hẹn
router.delete("/appointment/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Không tìm thấy lịch hẹn để xóa" });
    }

    res.json({ message: "Xóa lịch hẹn thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa lịch hẹn:", error);
    res.status(500).json({ error: "Lỗi server khi xóa lịch hẹn" });
  }
});

module.exports = router;
