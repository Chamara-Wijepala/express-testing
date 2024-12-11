export function validateProduct(product: any): {
	isValid: boolean;
	message?: string;
} {
	if ('name' in product && 'price' in product && 'stock' in product) {
		if (
			typeof product.name !== 'string' ||
			typeof product.price !== 'number' ||
			typeof product.stock !== 'number'
		) {
			return {
				isValid: false,
				message: 'Received data is in correct format but have incorrect types',
			};
		}
		return { isValid: true };
	}
	return {
		isValid: false,
		message: 'Received data is in an incorrect format',
	};
}
