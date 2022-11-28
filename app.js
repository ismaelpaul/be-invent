const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api.router');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(express.json());

// Route
app.use('/api', apiRouter);

// Error
app.use('/*', (req, res) => {
	res.status(404).send({ msg: 'Page not found.' });
});

app.use(errorHandler);

module.exports = app;
