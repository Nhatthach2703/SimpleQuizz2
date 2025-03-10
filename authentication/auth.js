const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Question = require("../models/question");
const session = require("express-session");

// Middleware xác thực người dùng
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    // res.status(401).json({ message: "Unauthorized. No token provided!" });
    req.flash("error", "Unauthorized. No token provided!");
    return res.redirect(req.get("Referer") || "/quizzes");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Lưu user vào request để dùng sau
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden. Invalid token." });
  }
};

// Middleware xác thực Admin
exports.verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.admin !== true) {
    // return res.status(403).json({ message: "You are not authorized to perform this operation!" });
    req.flash("error", "You are not authorized to perform this operation!");
    return res.redirect(req.get("Referer") || "/quizzes"); // Chuyển hướng về trang danh sách quiz
    // res.locals.errorMessage = "You are not authorized to perform this operation!";
    // return res.render("\index");
    // return res.redirect("/quizzes");
  }
  next();
};

// Middleware xác thực quyền tác giả của câu hỏi
// exports.verifyAuthor = async (req, res, next) => {
//   try {
//     const question = await Question.findById(req.params.questionId);

//     if (!question) return res.status(404).json({ message: "Question not found" });

//     if (!question.author.equals(req.user._id)) {
//       return res.status(403).json({ message: "You are not the author of this question" });
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
exports.verifyAuthor = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate("author");

    if (!question) {
      req.flash("error", "Question not found!");
      return res.redirect("/questions");
    }

    if (!req.session.user || !question.author || !question.author._id.equals(req.session.user.id)) {
      // console.log("verifyAuthor: ", req.session.user);
      // console.log("verifyAuthor: ", question.author);
      req.flash("error", "You are not the author of this question!");
      return res.redirect("/questions");
    }
    

    next();
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal server error!");
    res.redirect("/questions");
  }
};

