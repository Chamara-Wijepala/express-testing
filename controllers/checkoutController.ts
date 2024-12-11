import type { Request, Response } from 'express';
import {
	validateOrder,
	calculateTotalPrice,
} from '../services/checkoutServices';

function checkoutOrder(req: Request, res: Response) {
	const { order } = req.body;

	const validation = validateOrder(order);
	if (!validation.isValid) {
		res.status(400).json({ success: false, message: validation.message });
	}

	const totalPrice = calculateTotalPrice(order);
	res.status(200).json({ success: true, totalPrice: '$' + totalPrice });
}

export default {
	checkoutOrder,
};
