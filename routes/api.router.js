const express = require('express');
const { getApi } = require('../controllers/api.controllers');
const productRouter = require('./product.router');
const userRouter = require('./user.router');

const apiRouter = express.Router();

// /api
apiRouter.get('/', getApi);

// /user
apiRouter.use('/user', userRouter);

// /products
apiRouter.use('/products', productRouter);

module.exports = apiRouter;
