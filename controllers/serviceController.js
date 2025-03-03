const Service = require('../models/Service')

exports.getServiceByName = async (req, res) => {
    try {
        const { name } = req.params;
        const service = await Service.findOne({ name }).lean();
        
        if (!service) {
            return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
        }
        
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm dịch vụ', error });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().lean();

        if (!services.length) {
            return res.status(404).json({ message: 'Không có dịch vụ nào' });
        }

        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách dịch vụ', error });
    }
};