const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please, add a name'],
		},
		email: {
			type: String,
			required: [true, 'Please, add an email'],
			unique: true,
			trim: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please enter a valid email',
			],
		},
		password: {
			type: String,
			required: [true, 'Please, add a password'],
			minLength: [6, 'Password must have at least 6 characters'],
			maxLength: [23, 'Password must not have more than 23 characters'],
		},
		picture: {
			type: String,
			required: [true, 'Please, add an profile picture'],
			default: 'https://i.ibb.co/4pDNDk1/avatar.png',
		},
		phone: {
			type: String,
			default: '+44',
		},
		bio: {
			type: String,
			default: 'Bio',
			maxLength: [250, 'Bio must not have more than 250 characters'],
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
