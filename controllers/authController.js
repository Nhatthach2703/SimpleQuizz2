// const User = require("../models/user");
// const bcrypt = require("bcryptjs");

// // Hiển thị trang login
// exports.getLogin = (req, res) => {
//   res.render("login", { error: null });
// };

// // Xử lý đăng nhập
// exports.postLogin = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.render("login", { error: "User not found!" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.render("login", { error: "Incorrect password!" });
//     }

//     req.session.user = user; // Lưu user vào session
//     return res.redirect("/dashboard");

//   } catch (error) {
//     console.error(error);
//     res.render("login", { error: "Server error, please try again later." });
//   }
// };

// // Hiển thị trang dashboard (chỉ khi đã đăng nhập)
// exports.getDashboard = (req, res) => {
//   if (!req.session.user) {
//     return res.redirect("/login");
//   }
//   res.render("dashboard", { user: req.session.user });
// };

// // Xử lý logout
// exports.logout = (req, res) => {
//   req.session.destroy(() => {
//     res.redirect("/login");
//   });
// };



const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user) return res.render("auth/login", { error: "Invalid credentials" });

//     // const isMatch = await bcrypt.compare(password, user.password);
//     // if (!isMatch) return res.render("auth/login", { error: "Invalid credentials" });
//     if (password !== user.password) {
//       return res.render("auth/login", { error: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

//     res.cookie("token", token, { httpOnly: true });
//     res.redirect("/");
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.render("auth/login", { error: "Invalid credentials" });

    if (!user || password !== user.password) {
      return res.render("auth/login", { error: "Invalid credentials" });
    }

    // Lưu thông tin vào session
    req.session.user = { id: user._id, username: user.username, admin: user.admin };

    const token = jwt.sign({ id: user._id, username: user.username, admin: user.admin }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("connect.sid"); // Xóa cookie session
    res.redirect("/"); // Chuyển hướng về trang đăng nhập
  });
};


