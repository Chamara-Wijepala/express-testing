import type { Request, Response } from 'express';
import db from '../db/db.json';

function addProduct(req: Request, res: Response) {
	const { body } = req;

	db.push(body);

	res.status(200).json({ success: true });
}

function getAllProducts(req: Request, res: Response) {
	res.status(200).json({ success: true, products: db });
}

function getProductById(req: Request, res: Response) {
	const product = db[Number(req.params.id) - 1];

	if (!product) {
		res
			.status(404)
			.json({ success: false, message: "That item doesn't exist" });
	} else {
		res.status(200).json({ success: true, product: product });
	}
}

function updateProductById(req: Request, res: Response) {
	const { body } = req;
	const id = Number(req.params.id);
	const productIndex = db.findIndex((product) => product.id === Number(id));

	if (productIndex === -1) {
		res.status(404).json({ success: false, message: 'Product not found' });
	} else {
		const updatedProduct = { ...db[id - 1], ...body };
		db[id - 1] = updatedProduct;

		res.status(200).json({ success: true });
	}
}

function deleteProductById(req: Request, res: Response) {
	const id = Number(req.params.id);
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

export default {
	addProduct,
	getProductById,
	getAllProducts,
	updateProductById,
	deleteProductById,
};
