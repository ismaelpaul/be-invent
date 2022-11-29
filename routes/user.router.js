const express = require('express');
const {
	registerUser,
	loginUser,
	logoutUser,
	getUser,
	loggedinUser,
	updateUser,
	updatePassword,
	forgotPassword,
} = require('../controllers/user.controllers');
const { protect } = require('../middleware/auth.middleware');

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser);
userRouter.get('/profile', protect, getUser);
userRouter.get('/loggedin', loggedinUser);
userRouter.patch('/update-profile', protect, updateUser);
userRouter.patch('/update-password', protect, updatePassword);
userRouter.post('/forgot-password', forgotPassword);

module.exports = userRouter;
