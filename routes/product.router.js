const express = require('express');
const { createProduct } = require('../controllers/product.controllers');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../utils/fileUpload');

const productRouter = express.Router();

productRouter.post('/', protect, upload.single('image'), createProduct);

module.exports = productRouter;
