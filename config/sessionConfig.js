const session = require('express-session');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'mySecretKey', // Khóa bí mật
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // Hết hạn sau 1 giờ (ms)
    httpOnly: true, // Bảo mật hơn
    secure: false // Đặt true nếu dùng HTTPS
  }
});

module.exports = sessionConfig;
