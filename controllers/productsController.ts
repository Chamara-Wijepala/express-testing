import type { Request, Response, NextFunction } from 'express';
import db from '../db/db.json';
import prisma from '../db/prisma';
import { validateProduct } from '../services/productsServices';

async function addProduct(req: Request, res: Response, next: NextFunction) {
	const { body } = req;

	const validation = validateProduct(body);
	if (!validation.isValid) {
		res.status(400).json({ success: false, message: validation.message });
	}

	try {
		const newProduct = await prisma.product.create({
			data: body,
		});

		res.status(200).json({ success: true, newProductId: newProduct.id });
	} catch (error) {
		next(error);
	}
}

async function getAllProducts(req: Request, res: Response) {
	const products = await prisma.product.findMany();

	res.status(200).json({ success: true, products });
}

async function getProductById(req: Request, res: Response) {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		res
			.status(400)
			.json({ success: false, message: 'Received invalid product id' });
	}

	const product = await prisma.product.findUnique({
		where: {
			id: id,
		},
	});

	if (!product) {
		res.status(404).json({
			success: false,
			message: "A product with the given id doesn't exist",
		});
	} else {
		res.status(200).json({ success: true, product: product });
	}
}

async function updateProductById(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { body } = req;
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		res
			.status(400)
			.json({ success: false, message: 'Received invalid product id' });
		return;
	}

	const validation = validateProduct(body);
	if (!validation.isValid) {
		res.status(400).json({ success: false, message: validation.message });
		return;
	}

	try {
		const updatedProduct = await prisma.product.update({
			where: {
				id: id,
			},
			data: body,
		});

		res.status(200).json({ success: true, productId: updatedProduct.id });
	} catch (err) {
		res.status(404).json({
			success: false,
			message: 'Product not found',
		});
	}
}

async function deleteProductById(req: Request, res: Response) {
	const id = Number(req.params.id);
	// const productIndex = db.findIndex((product) => product.id === Number(id));

	if (Number.isNaN(id)) {
		res
			.status(400)
			.json({ success: false, message: 'Received invalid product id' });
		return;
	}

	try {
		await prisma.product.delete({
			where: {
				id: id,
			},
		});

		res.status(200).json({ success: true });
	} catch (err) {
		res.status(404).json({
			success: false,
			message: 'Product not found',
		});
	}

	// if (productIndex === -1) {
	// 	res.status(404).json({ success: false, message: 'Product not found' });
	// } else {
	// 	db.splice(id - 1, 1);

	// 	res
	// 		.status(200)
	// 		.json({ success: true, message: 'Product deleted successfully' });
	// }
}

export default {
	addProduct,
	getProductById,
	getAllProducts,
	updateProductById,
	deleteProductById,
};
