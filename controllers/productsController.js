const db = require('../db/db.json');
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
	getProductById,
	getAllProducts,
};
