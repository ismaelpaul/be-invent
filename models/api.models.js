const fs = require('fs/promises');

exports.selectApi = () => {
	return fs
		.readFile('./endpoints.json')
		.then((file) => {
			return JSON.parse(file);
		})
		.then((fileParsed) => {
			return fileParsed;
		});
};
