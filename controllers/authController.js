// const User = require('~/models/User');
// const jwt = require('jsonwebtoken');

// // Đăng ký
// exports.register = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;
//         const user = await User.create({ name, email, password, role });
//         res.status(201).json({ message: 'Đăng ký thành công' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Đăng nhập
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         if (!user || !(await user.comparePassword(password))) {
//             return res.status(400).json({ error: 'Sai email hoặc mật khẩu' });
//         }

//         const token = jwt.sign({ userId: user._id, role: user.role }, 'secretKey', { expiresIn: '1d' });

//         res.json({ 
//             message: 'Đăng nhập thành công', 
//             token, 
//             user: { _id: user._id, name: user.name, email: user.email, role: user.role } 
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Đăng xuất
// exports.logout = (req, res) => {
//     res.json({ message: 'Đăng xuất thành công' });
// };

// // Lấy thông tin người dùng
// exports.getUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.userId).select('-password');
//         if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
