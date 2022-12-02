const express = require('express');
const {
	createProduct,
	getProducts,
	getSingleProduct,
	deleteProduct,
	updateProduct,
} = require('../controllers/product.controllers');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../utils/fileUpload');

const productRouter = express.Router();

productRouter.post('/', protect, upload.single('image'), createProduct);
productRouter.get('/', protect, getProducts);
productRouter.get('/:id', protect, getSingleProduct);
productRouter.delete('/:id', protect, deleteProduct);
productRouter.patch('/:id', protect, upload.single('image'), updateProduct);

module.exports = productRouter;
