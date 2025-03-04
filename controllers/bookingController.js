const Booking = require("../models/Booking");
const mongoose = require("mongoose");
const Garage = require("../models/Garage");
// Lấy tất cả booking
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().lean();
    // const bookings = await Booking.find().populate('customerId').populate('garageId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách booking", error });
  }
};

// Tạo booking mới
exports.createBooking = async (req, res) => {
  try {
    // Kiểm tra xác thực người dùng
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Không thể xác thực người dùng" });
    }

    // Kiểm tra dữ liệu đầu vào
    const { garageId, services } = req.body;
    if (!garageId) {
      return res.status(400).json({ message: "Thiếu garageId" });
    }
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res
        .status(400)
        .json({ message: "Thiếu hoặc sai định dạng services" });
    }

    // Chuẩn hóa dữ liệu services
    const formattedServices = services.map((service) => ({
      serviceId: service.serviceId || service,
    }));

    // Tạo booking mới
    const newBooking = new Booking({
      customerId: req.user.id,
      garageId,
      services: formattedServices,
      bookingDate: req.body.bookingDate,
      bookingTime: req.body.bookingTime,
      totalPrice: req.body.totalPrice,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
    }
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật booking (bao gồm lý do hủy nếu bị Cancelled)
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancelReason } = req.body;

    const updateData = { status };
    if (status === "Cancelled" && cancelReason) {
      updateData.cancelReason = cancelReason;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật booking", error });
  }
};

exports.getBookingsByGarage = async (req, res) => {
  try {
    const user = req.user;
    const gara = await Garage.findOne({ owner: user.id });

    const bookings = await Booking.find({ garageId: gara._id });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
