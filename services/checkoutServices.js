const db = require('../db/db.json');

function validateOrder(order) {
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
			if (order[i].qty > db[order[i].id - 1].stock) {
				return {
					isValid: false,
					message: 'An item in the order exceeds the current stock',
				};
			}
		}
		return { isValid: true };
	}
}

function calculateTotalPrice(order) {
	const shippingCost = 49.99;
	let total = 0;

	for (let i = 0; i < order.length; i++) {
		total += db[order[i].id - 1].price * order[i].qty;
	}

	if (total < 400) total += shippingCost;

	return total.toFixed(2);
}

module.exports = {
	validateOrder,
	calculateTotalPrice,
};
