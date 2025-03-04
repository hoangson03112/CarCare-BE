const express = require("express");
const Garage = require("../models/Garage");

const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// Lấy danh sách tất cả các gara
router.get("/garages", async (req, res) => {
  try {
    const garages = await Garage.find({});

    // Trả về danh sách gara
    res.status(200).json({ garages });
  } catch (error) {
    console.error("Lỗi lấy danh sách gara:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách gara" });
  }
});

router.get("/:garageId", async (req, res) => {
  try {
    const { garageId } = req.params;

    // Kiểm tra xem garageId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(garageId)) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    const garage = await Garage.findOne({ _id: garageId });

    if (!garage) {
      return res.status(404).json({ error: "Gara không tồn tại" });
    }

    res.status(200).json(garage);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin gara:", error);
    res.status(500).json({
      error: "Lỗi server khi lấy thông tin gara",
      details: error.message,
    });
  }
});
router.get("/:garageId/owner-name", async (req, res) => {
  try {
    // Lấy garageId từ params
    const { garageId } = req.params;

    // Kiểm tra garageId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(garageId)) {
      return res.status(400).json({
        success: false,
        message: "Garage ID không hợp lệ",
      });
    }

    const userName = await User.findById(garageId).select("fullName");

    if (!userName) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user",
      });
    }

    // Trả về phản hồi
    return res.status(200).json({
      success: true,
      message: "Lấy tên chủ gara thành công",
      data: {
        ownerName: userName,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy tên chủ gara:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tên chủ gara",
      error: error.message,
    });
  }
});
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });


    res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi lấy danh sách gara:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách gara" });
  }
});

module.exports = router;
