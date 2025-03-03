const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http"); // Thêm dòng này
require("dotenv").config();
const route = require('./routes');
const authRoutes = require("./routes/auth");
const garageRouter = require("./routes/garageRoutes");
const appointment = require("./routes/appointments");

const app = express();
const server = http.createServer(app); // Tạo server HTTP chung
const io = socketIo(server); // Gắn Socket.IO vào server

// Object để lưu trữ socket của từng gara
const garaSockets = {};

io.on("connection", (socket) => {
  console.log("Một client đã kết nối");

  // Gara đăng ký với garaId
  socket.on("register_gara", (garaId) => {
    garaSockets[garaId] = socket;
    console.log(`Gara ${garaId} đã đăng ký`);
  });

  // Nhận sự kiện đặt lịch mới từ người dùng
  socket.on("new_booking", (data) => {
    const { garaId, bookingInfo } = data;
    if (garaSockets[garaId]) {
      garaSockets[garaId].emit("booking_notification", bookingInfo);
      console.log(`Đã gửi thông báo đến gara ${garaId}`);
    } else {
      console.log(`Gara ${garaId} không online`);
    }
  });

  // Xử lý khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Client đã ngắt kết nối");
    for (let garaId in garaSockets) {
      if (garaSockets[garaId] === socket) {
        delete garaSockets[garaId];
        console.log(`Gara ${garaId} đã ngắt kết nối`);
        break;
      }
    }
  });
});

app.use(cors());
app.use(express.json());
route(app);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api", garageRouter);
app.use("/appointment", appointment);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Sử dụng server.listen
