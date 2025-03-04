const Service = require("../models/Service");
const mongoose = require("mongoose");

exports.getServiceByID = async (req, res) => {
  try {
    const { IDService } = req.params;
   
    
    // Kiểm tra xem IDService có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(IDService)) {
      return res.status(400).json({ message: "ID dịch vụ không hợp lệ" });
    }

  
    const service = await Service.findOne({ _id: IDService });

    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tìm dịch vụ", error });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().lean();

    if (!services.length) {
      return res.status(404).json({ message: "Không có dịch vụ nào" });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách dịch vụ", error });
  }
};
exports.getAllServicesOfGarage = async (req, res) => {};
