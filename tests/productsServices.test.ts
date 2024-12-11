import { validateProduct } from '../services/productsServices';

describe('Tests for validateProduct', () => {
	it('invalidates when passed an object in the incorrect format', () => {
		expect(validateProduct({ foo: 'bar', fizz: 'buzz' })).toEqual({
			isValid: false,
			message: 'Received data is in an incorrect format',
		});
	});
	it('invalidates when passed an object in the correct format but with incorrect data types', () => {
		const product = {
			name: 'Ergonomic Office Chair',
			price: '199.99',
			stock: true,
		};
		expect(validateProduct(product)).toEqual({
			isValid: false,
			message: 'Received data is in correct format but have incorrect types',
		});
	});
	it('validates when passed an object in the correct format', () => {
		const product = {
			name: 'Ergonomic Office Chair',
			price: 199.99,
			stock: 12,
		};
		expect(validateProduct(product)).toEqual({ isValid: true });
	});
});
