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

function updateProductById(req, res) {
	const { body } = req;
	const { id } = req.params;
	const productIndex = db.findIndex((product) => product.id === Number(id));

	if (productIndex === -1) {
		res.status(404).json({ success: false, message: 'Product not found' });
	} else {
		const updatedProduct = { ...db[id - 1], ...body };
		db[id - 1] = updatedProduct;

		res.status(200).json({ success: true });
	}
}

function deleteProductById(req, res) {
	const { id } = req.params;
	const productIndex = db.findIndex((product) => product.id === Number(id));

	if (productIndex === -1) {
		res.status(404).json({ success: false, message: 'Product not found' });
	} else {
		db.splice(id - 1, 1);

		res
			.status(200)
			.json({ success: true, message: 'Product deleted successfully' });
	}
}

module.exports = {
	addProduct,
	getProductById,
	getAllProducts,
	updateProductById,
	deleteProductById,
};
