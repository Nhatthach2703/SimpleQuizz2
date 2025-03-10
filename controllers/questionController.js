const Question = require('../models/question');

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("author", "username");
    res.render('question/list', { questions });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi lấy danh sách câu hỏi");
  }
};


exports.getQuestionDetails = async (req, res) => {
  const question = await Question.findById(req.params.id);
  res.render('question/details', { question });
};

// exports.createQuestion = async (req, res) => {
//   if (req.method === 'POST') {
//     const { text, answer, quizId } = req.body;
//     await Question.create({ text, answer, quiz: quizId });
//     res.redirect('/questions');
//   } else {
//     res.render('question/create');
//   }
// };
exports.createQuestion = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { text, options, correctAnswerIndex, keywords } = req.body;
      const author = req.session.user ? req.session.user.id : null;
      await Question.create({
        text,
        author,
        options: options.split(','), // Chuyển chuỗi thành mảng
        correctAnswerIndex: correctAnswerIndex.split(',').map(Number), // Chuyển chuỗi thành mảng số
        keywords: keywords ? keywords.split(',') : [] // Nếu có keywords thì chuyển thành mảng
      });
 
      res.redirect('/questions');
    } catch (error) {
      console.error(error);
      res.status(500).send("Lỗi khi tạo câu hỏi");
    }
  } else {
    res.render('question/create');
  }
};


// exports.editQuestion = async (req, res) => {
//   const question = await Question.findById(req.params.id);
//   if (req.method === 'POST') {
//     question.text = req.body.text;
//     question.answer = req.body.answer;
//     await question.save();
//     res.redirect('/questions');
//   } else {
//     res.render('question/edit', { question });
//   }
// };
exports.editQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("author", "username");
    if (!question) {
      return res.status(404).send("Question not found");
    }

    if (req.method === 'PUT') {
      // Lấy dữ liệu từ form
      const { text, options, correctAnswerIndex, keywords } = req.body;

      // Cập nhật thông tin câu hỏi
      question.text = text;
      question.options = options.split(','); // Chuyển chuỗi thành mảng
      question.correctAnswerIndex = correctAnswerIndex.split(',').map(Number);
      question.keywords = keywords ? keywords.split(',') : [];

      await question.save();
      return res.redirect('/questions');
    }

    // Nếu là GET, render form chỉnh sửa
    res.render('question/edit', { question });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
};
// exports.editQuestion = async (req, res) => {
//   try {
//     const question = await Question.findById(req.params.id).populate("author", "username");
//     if (!question) {
//       req.flash("error", "Question not found!");
//       return res.redirect("/questions");
//     }

//     // Kiểm tra nếu user không phải là tác giả
//     if (req.user && question.author && question.author._id.toString() !== req.user._id.toString()) {
//       req.flash("error", "You are not authorized to edit this question!");
//       return res.redirect("/questions");
//     }

//     if (req.method === 'PUT') {
//       // Lấy dữ liệu từ form
//       const { text, options, correctAnswerIndex, keywords } = req.body;

//       // Kiểm tra dữ liệu đầu vào trước khi cập nhật
//       if (!text || !options || !correctAnswerIndex) {
//         req.flash("error", "Text, options, and correct answers are required!");
//         return res.redirect(`/questions/${question._id}/edit`);
//       }

//       // Cập nhật thông tin câu hỏi
//       question.text = text.trim();
//       question.options = options.split(',').map(opt => opt.trim()); // Chuyển chuỗi thành mảng và loại bỏ khoảng trắng
//       question.correctAnswerIndex = correctAnswerIndex.split(',').map(num => Number(num.trim()));
//       question.keywords = keywords ? keywords.split(',').map(kw => kw.trim()) : [];

//       await question.save();
//       req.flash("success", "Question updated successfully!");
//       return res.redirect('/questions');
//     }

//     // Nếu là GET, render form chỉnh sửa
//     res.render('question/edit', { question, user: req.user });
//   } catch (error) {
//     console.error(error);
//     req.flash("error", "An error occurred while processing your request.");
//     res.redirect("/questions");
//   }
// };



// exports.deleteQuestion = async (req, res) => {
//   await Question.findByIdAndDelete(req.params.id);
//   res.redirect('/questions');
// };
exports.deleteQuestion = async (req, res) => {
  try {
      const questionId = req.params.id;
      await Question.findByIdAndDelete(questionId);
      res.redirect('/questions');
  } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).send('Internal Server Error');
  }
};