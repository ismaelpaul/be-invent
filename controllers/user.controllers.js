const asyncHandler = require('express-async-handler');
const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../models/token.models');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail');

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error(
			'One or more required fields are empty. Please fill in all required fields'
		);
	}

	if (password.length < 6) {
		res.status(400);
		throw new Error('Password must have at least 6 characters');
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('Email has already been registered');
	}

	// Create new user
	const user = await User.create({
		name,
		email,
		password,
	});

	// Generate token
	const token = generateToken(user._id);

	// Send HTTP-only cookie
	res.cookie('token', token, {
		path: '/',
		httpOnly: true,
		expires: new Date(Date.now() + 1000 * 86400), //1 day,
		sameSite: 'none',
		secure: true,
	});

	if (user) {
		const { _id, name, email, picture, phone, bio } = user;

		res.status(201).json({ _id, name, email, picture, phone, bio, token });
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

exports.loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error('Please add email and password');
	}

	const userExists = await User.findOne({ email });

	if (!userExists) {
		res.status(400);
		throw new Error('User not found, please sign up');
	}

	const passwordIsCorrent = await bcrypt.compare(password, userExists.password);

	// Generate token
	const token = generateToken(userExists._id);

	// Send HTTP-only cookie
	res.cookie('token', token, {
		path: '/',
		httpOnly: true,
		expires: new Date(Date.now() + 1000 * 86400), //1 day,
		sameSite: 'none',
		secure: true,
	});

	if (userExists && passwordIsCorrent) {
		const { _id, name, email, picture, phone, bio } = userExists;

		res.status(200).json({ _id, name, email, picture, phone, bio, token });
	} else {
		res.status(400);
		throw new Error('Invalid email or password');
	}
});

exports.logoutUser = asyncHandler(async (req, res) => {
	res.cookie('token', '', {
		path: '/',
		httpOnly: true,
		expires: new Date(0), // expires cookie
		sameSite: 'none',
		secure: true,
	});
	return res.status(200).json({ message: 'Logged out successfully' });
});

exports.getUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		const { _id, name, email, picture, phone, bio } = user;

		res.status(200).json({ _id, name, email, picture, phone, bio });
	} else {
		throw new Error('User not found');
	}
});

exports.loggedinUser = asyncHandler(async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.json(false);
	}

	const verified = jwt.verify(token, process.env.JWT_SECRET);

	if (verified) {
		return res.json(true);
	}
	return res.json(false);
});

exports.updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		const { name, email, picture, phone, bio } = user;
		user.email = email;
		user.name = req.body.name || name;
		user.picture = req.body.picture || picture;
		user.phone = req.body.phone || phone;
		user.bio = req.body.bio || bio;

		const updateUser = await user.save();
		res.status(200).json({
			_id: updateUser._id,
			name: updateUser.name,
			email: updateUser.email,
			picture: updateUser.picture,
			phone: updateUser.phone,
			bio: updateUser.bio,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

exports.updatePassword = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	const { oldPassword, password } = req.body;

	if (!user) {
		res.status(400);
		throw new Error('User not found, please sign up');
	}

	if (!oldPassword || !password) {
		res.status(400);
		throw new Error('Please add old and new password');
	}

	const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

	if (user && passwordIsCorrect) {
		user.password = password;
		await user.save();
		res.status(200).send('Password was changed successfully');
	} else {
		res.status(400);
		throw new Error('Old password is incorrect');
	}
});

exports.forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const userExists = await User.findOne({ email });

	if (!userExists) {
		res.status(404);
		throw new Error('User does not exist');
	}

	// Delete token if it exists in DB
	let token = await Token.findOne({ userId: userExists._id });
	if (token) {
		await Token.deleteOne();
	}

	// Reset token
	let resetToken = crypto.randomBytes(32).toString('hex') + userExists._id;
	console.log(resetToken);

	// Hash token before saving to DB
	const hashedToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	await new Token({
		userId: userExists._id,
		token: hashedToken,
		createdAt: Date.now(),
		expiresAt: Date.now() + 30 * (60 * 1000), //30 mins
	}).save();

	const resetUrl = `${process.env.CLIENT_URL}/reset-passowrd/${resetToken}`;

	const message = `
		<h2>Hello ${userExists.name},</h2>
		<p>Please use the url below to reset your password.</p>
		<p>The reset link is valid for only 30 minutes.</p>


		<a href=${resetUrl} clicktracking=off>${resetUrl}</a>

		<p>Kind regards,</p>

		<p>Invetário App Team</p>
	`;

	const subject = '(No Reply) Password Reset Request';
	const send_to = userExists.email;
	const sent_from = process.env.EMAIL_USER;

	try {
		await sendEmail(subject, message, send_to, sent_from);
		res.status(200).json({ sucess: true, message: 'Reset email sent' });
	} catch (error) {
		res.status(500);
		throw new Error('Email not sent, please try again.');
	}
});

exports.resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body;
	const { resetToken } = req.params;

	// Hash token, then compare to Token in DB
	const hashedToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	const userToken = await Token.findOne({
		token: hashedToken,
		expiresAt: { $gt: Date.now() },
	});

	if (!userToken) {
		res.status(404);
		throw new Error('Invalid or expired token');
	}

	const userExists = await User.findOne({ _id: userToken.userId });

	userExists.password = password;

	await userExists.save();

	res
		.status(200)
		.json({ message: 'Password reset successfully, please login' });
});
