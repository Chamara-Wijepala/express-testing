import db from '../db/db.json';
import type { Product } from '@prisma/client';
import type { Order } from '../types';

export function validateOrder(
	order: undefined | [] | Order[],
	products: Product[]
) {
	if (!order) {
		return { isValid: false, message: 'No order received' };
	}
	if (Array.isArray(order) && order.length < 1) {
		return { isValid: false, message: 'Empty order received' };
	}
	if (order[0].id === undefined || order[0].qty === undefined) {
		return {
			isValid: false,
			message: 'The order does not match the correct format',
		};
	}
	if (typeof order[0].id === 'number' && typeof order[0].qty === 'number') {
		for (let i = 0; i < order.length; i++) {
			if (order[i].qty > products[order[i].id - 1].stock) {
				return {
					isValid: false,
					message: 'An item in the order exceeds the current stock',
				};
			}
		}
		return { isValid: true };
	}

	return { isValid: false, message: 'There was an unknown error' };
}

export function calculateTotalPrice(order: Order[], products: Product[]) {
	const shippingCost = 49.99;

	let total = 0;
	for (let i = 0; i < order.length; i++) {
		total += products[order[i].id - 1].price * order[i].qty;
	}

	if (total < 400) total += shippingCost;

	return total.toFixed(2);
}
