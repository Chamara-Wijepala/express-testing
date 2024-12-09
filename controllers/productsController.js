const db = require('../db/db.json');

function addProduct(req, res) {
	const { body } = req;

	db.push(body);
	console.log(db);

	res.status(200).json({ success: true });
}

function getAllProducts(req, res) {
	res.status(200).json({ success: true, products: db });
}

function getProductById(req, res) {
	const product = db[req.params.id - 1];

	if (!product) {
		res
			.status(404)
			.json({ success: false, message: "That item doesn't exist" });
	} else {
		res.status(200).json({ success: true, product: product });
	}
}

module.exports = {
	addProduct,
	getProductById,
	getAllProducts,
};
