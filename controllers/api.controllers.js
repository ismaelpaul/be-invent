const { selectApi } = require('../models/api.models');

exports.getApi = (req, res, next) => {
	selectApi()
		.then((apis) => {
			res.status(200).send(apis);
		})
		.catch(next);
};
