const asyncHandler = require('express-async-handler');
const Product = require('../models/product.models');
const { fileSizeFormatter } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;

exports.createProduct = asyncHandler(async (req, res) => {
	const { name, sku, category, quantity, price, description } = req.body;

	if (!name || !category || !quantity || !price || !description) {
		res.status(400);
		throw new Error('Please fill in all fields');
	}

	let fileData = {};

	if (req.file) {
		let uploadedFile;
		try {
			uploadedFile = await cloudinary.uploader.upload(req.file.path, {
				folder: 'Invetory App',
				resource_type: 'image',
			});
		} catch (error) {
			res.status(500);
			throw new Error('Image could not be uploaded');
		}

		fileData = {
			fileName: req.file.originalname,
			filePath: uploadedFile.secure_url,
			fileType: req.file.mimetype,
			fileSize: fileSizeFormatter(req.file.size, 2),
		};
	}

	const product = await Product.create({
		user: req.user.id,
		name,
		sku,
		category,
		quantity,
		price,
		description,
		image: fileData,
	});

	res.status(201).json(product);
});

exports.getProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({ user: req.user.id }).sort('-createdAt');
	res.status(200).json(products);
});

exports.getSingleProduct = asyncHandler(async (req, res) => {
	const singleProduct = await Product.findById(req.params.id);
	if (!singleProduct) {
		res.status(404);
		throw new Error('Product not found');
	}
	if (singleProduct.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('User not authorized');
	}

	res.status(200).json(singleProduct);
});
