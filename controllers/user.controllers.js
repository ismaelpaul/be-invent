const asyncHandler = require('express-async-handler');
const User = require('../models/user.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
	return res.status(200).json({ message: 'Logged out succesfully' });
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
