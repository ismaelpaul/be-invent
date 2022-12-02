const express = require('express');
const { getApi } = require('../controllers/api.controllers');
const contactRouter = require('./contact.router');
const productRouter = require('./product.router');
const userRouter = require('./user.router');

const apiRouter = express.Router();

// /api
apiRouter.get('/', getApi);

// /user
apiRouter.use('/user', userRouter);

// /products
apiRouter.use('/products', productRouter);

// /contact
apiRouter.use('/contact', contactRouter);

module.exports = apiRouter;
