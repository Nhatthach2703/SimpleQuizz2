const Question = require('../models/question'); 
const Quiz = require('../models/quiz');

exports.getQuizzes = async (req, res) => {
  const quizzes = await Quiz.find();
  res.render('quiz/list', { quizzes });
};

exports.getQuizDetails = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');
  res.render('quiz/details', { quiz });
};

exports.createQuiz = async (req, res) => {
  if (req.method === 'POST') {
    const { title, description } = req.body;
    await Quiz.create({ title, description });
    res.redirect('/quizzes');
  } else {
    res.render('quiz/create');
  }
};

// Hiển thị trang chỉnh sửa quiz
exports.editQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).send("Quiz không tồn tại");
    }
    res.render('quiz/edit', { quiz });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi lấy dữ liệu quiz");
  }
};

// Xử lý cập nhật quiz (PUT request)
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );
    if (!quiz) {
      return res.status(404).send("Quiz không tồn tại");
    }
    res.redirect('/quizzes');
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi cập nhật quiz");
  }
};


exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).send("Quiz không tồn tại");
    }
    res.redirect('/quizzes');
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi xóa quiz");
  }
};

exports.createOrAddQuestion = async (req, res) => {
  try {
      const quizId = req.params.quizId;
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
          return res.status(404).send("Quiz not found");
      }

      if (req.method === "GET") {
          return res.render("quiz/addQuestionToQuiz", { quiz, user: req.session.user });
      } 
      
      if (req.method === "POST") {
          console.log("Received data:", req.body);

          let { text, options, correctAnswerIndex, keywords } = req.body;
          const author = req.session.user ? req.session.user.id : null;

          if (!text || !options || !correctAnswerIndex || !author) {
              return res.status(400).send("Missing required fields!");
          }

          // Chuyển đổi dữ liệu
          options = options.split(',').map(opt => opt.trim());
          correctAnswerIndex = correctAnswerIndex.split(',')
              .map(num => parseInt(num.trim()))
              .filter(num => !isNaN(num));

          keywords = keywords ? keywords.split(',').map(kw => kw.trim()) : [];

          const newQuestion = new Question({
              text,
              author,
              options,
              correctAnswerIndex,
              keywords
          });

          await newQuestion.save();

          quiz.questions.push(newQuestion._id);
          await quiz.save();

          return res.redirect(`/quizzes/${quizId}`);
      }

  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
};





