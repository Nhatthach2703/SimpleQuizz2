// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// router.get("/", userController.getAllUsers);
// router.post("/", userController.createUser);
// // router.post("/:userId/quizzes/:quizId/submit", userController.submitQuiz);
// // router.get("/:userId/history", userController.getUserHistory);

// module.exports = router;



const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require("../authentication/auth");

// router.post('/', UserController.createUser);
router.get('/', verifyToken, verifyAdmin, UserController.getAllUsers);
// router.get('/:userId', UserController.getUserById);

module.exports = router;
