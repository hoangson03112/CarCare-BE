const Booking = require("../models/Booking");

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
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      service,
      bookingDate,
      garageId,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !customerId ||
      !customerName ||
      !customerPhone ||
      !service ||
      !bookingDate ||
      !garageId
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi tạo booking", error: error.message });
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
