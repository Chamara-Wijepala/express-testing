import prisma from '../db/prisma';
import {
	validateOrder,
	calculateTotalPrice,
} from '../services/checkoutServices';
import type { Request, Response } from 'express';

async function checkoutOrder(req: Request, res: Response) {
	const { order } = req.body;
	const products = await prisma.product.findMany();

	const validation = validateOrder(order, products);
	if (!validation.isValid) {
		res.status(400).json({ success: false, message: validation.message });
		return;
	}

	const totalPrice = calculateTotalPrice(order, products);
	res.status(200).json({ success: true, totalPrice: '$' + totalPrice });
}

export default {
	checkoutOrder,
};
