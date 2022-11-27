const express = require('express');
const { getApi } = require('../controllers/api.controllers');
const userRouter = require('./user.router');

const apiRouter = express.Router();

// /api
apiRouter.get('/', getApi);

// /user
apiRouter.use('/user', userRouter);

module.exports = apiRouter;
