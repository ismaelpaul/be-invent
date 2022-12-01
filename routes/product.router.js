const express = require('express');
const { createProduct } = require('../controllers/product.controllers');
const { protect } = require('../middleware/auth.middleware');

const productRouter = express.Router();

productRouter.post('/', protect, createProduct);

module.exports = productRouter;
