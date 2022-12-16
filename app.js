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
		origin: 'http://127.0.0.1:5173',
		credentials: true,
	})
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route
app.use('/api', apiRouter);

// Error
app.use('/*', (req, res) => {
	res.status(404).send({ msg: 'Page not found.' });
});

app.use(errorHandler);

module.exports = app;
