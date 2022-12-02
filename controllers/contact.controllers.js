const asyncHandler = require('express-async-handler');
const User = require('../models/user.models');
const { sendEmail } = require('../utils/sendEmail');

exports.contactUs = asyncHandler(async (req, res) => {
	const { subject, message } = req.body;

	const user = await User.findById(req.user._id);

	if (!user) {
		res.status(400);
		throw new Error('User not found, please sign up.');
	}

	if (!subject || !message) {
		res.status(400);
		throw new Error('Please add subject and message');
	}

	const send_to = process.env.EMAIL_USER;
	const sent_from = process.env.EMAIL_USER;
	const reply_to = user.email;

	try {
		await sendEmail(subject, message, send_to, sent_from, reply_to);
		res.status(200).json({ sucess: true, message: 'Email sent' });
	} catch (error) {
		res.status(500);
		throw new Error('Email not sent, please try again.');
	}
});
