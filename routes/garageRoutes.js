const express = require("express");
const Garage = require("../models/Garage");
const User = require("../models/User");

const router = express.Router();

// Lấy danh sách tất cả các gara
router.get("/garages", async (req, res) => {
  try {
    // Lấy danh sách tất cả user có vai trò "garage_owner" và populate thông tin gara
    const garages = await User.find({ role: "garage_owner" }).populate(
      "garage"
    );

    // Trả về danh sách gara
    res.status(200).json({ garages });
  } catch (error) {
    console.error("Lỗi lấy danh sách gara:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách gara" });
  }
});

// Lấy thông tin chi tiết gara theo ID
router.get("/:garageId", async (req, res) => {
  try {
    const { garageId } = req.params;

    // Chỉ lấy thông tin gara mà không populate owner
    const garage = await Garage.findById(garageId);

    if (!garage) {
      return res.status(404).json({ error: "Gara không tồn tại" });
    }

    res.status(200).json(garage);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin gara:", error);
    res.status(500).json({ error: "Lỗi server khi lấy thông tin gara" });
  }
});

module.exports = router;
