const asyncHandler = require('express-async-handler');
const User = require('../models/user.models');

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

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		const { _id, name, email, picture, phone, bio } = user;

		res.status(201).json({ _id, name, email, picture, phone, bio });
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});
