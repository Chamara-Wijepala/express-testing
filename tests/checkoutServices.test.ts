import db from '../db/db.json';
import {
	validateOrder,
	calculateTotalPrice,
} from '../services/checkoutServices';

describe('Tests for validateOrder', () => {
	test('should invalidate non-existent order', () => {
		// @ts-ignore
		expect(validateOrder(undefined, db)).toEqual({
			isValid: false,
			message: 'No order received',
		});
	});

	test('should invalidate empty order', () => {
		expect(validateOrder([], db)).toEqual({
			isValid: false,
			message: 'Empty order received',
		});
	});

	test('should invalidate incorrect order', () => {
		// @ts-ignore
		expect(validateOrder([{ id: 1, foo: 'bar' }], db)).toEqual({
			isValid: false,
			message: 'The order does not match the correct format',
		});
	});

	test('should validate correct order format', () => {
		expect(validateOrder([{ id: 1, qty: 2 }], db)).toEqual({
			isValid: true,
		});
	});

	test('should invalidate if quantity exceeds stock', () => {
		expect(validateOrder([{ id: 1, qty: 26 }], db)).toEqual({
			isValid: false,
			message: 'An item in the order exceeds the current stock',
		});
	});
});

describe('Tests for calculateTotalPrice', () => {
	test('should return total price with shipping costs', () => {
		// total cost is 359.92
		const order = [
			{ id: 1, qty: 1 },
			{ id: 2, qty: 1 },
			{ id: 3, qty: 1 },
			{ id: 8, qty: 1 },
			{ id: 10, qty: 4 },
		];

		expect(calculateTotalPrice(order, db)).toBe('409.91');
	});

	test('should exclude shipping costs if total price is 400 and over', () => {
		const order = [
			{ id: 1, qty: 1 },
			{ id: 2, qty: 1 },
			{ id: 3, qty: 1 },
			{ id: 4, qty: 1 },
			{ id: 8, qty: 1 },
			{ id: 10, qty: 4 },
		];

		expect(calculateTotalPrice(order, db)).toBe('659.91');
	});
});
