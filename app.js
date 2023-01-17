const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api.router');
const errorHandler = require('./middleware/error.middleware');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	cors({
		origin: ['http://localhost:5173', 'https://invent-app.netlify.app/'],
		credentials: true,
	})
);

app.use((req, res, next) => {
	res.header(
		'Access-Control-Allow-Headers, *, Access-Control-Allow-Origin',
		'Origin, X-Requested-with, Content_Type,Accept,Authorization',
		'http://localhost:4200'
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
		return res.status(200).json({});
	}
	next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route
app.use('/api', apiRouter);

// Error
app.use('/*', (req, res) => {
	res.status(404).send({ msg: 'Page not found.' });
});

app.use(errorHandler);

module.exports = app;
