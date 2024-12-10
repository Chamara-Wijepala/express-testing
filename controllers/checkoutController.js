const {
	validateOrder,
	calculateTotalPrice,
} = require('../services/checkoutServices');

function checkoutOrder(req, res) {
	const { order } = req.body;

	const validation = validateOrder(order);
	if (!validation.isValid) {
		return res
			.status(400)
			.json({ success: false, message: validation.message });
	}

	const totalPrice = calculateTotalPrice(order);
	res.status(200).json({ success: true, totalPrice: '$' + totalPrice });
}

module.exports = {
	checkoutOrder,
};
