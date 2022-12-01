const asyncHandler = require('express-async-handler');
const Product = require('../models/product.models');

exports.createProduct = asyncHandler(async (req, res) => {
	const { name, sku, category, quantity, price, description } = req.body;

	if (!name || !category || !quantity || !price || !description) {
		res.status(400);
		throw new Error('Please fill in all fields');
	}

	const product = await Product.create({
		user: req.user.id,
		name,
		sku,
		category,
		quantity,
		price,
		description,
	});

	res.status(201).json(product);
});
