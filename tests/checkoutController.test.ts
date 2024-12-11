import request from 'supertest';
import app from './test-app';
import checkout from '../routes/checkoutRoutes';

app.use('/checkout', checkout);

describe('POST /checkout/', () => {
	describe('Unit tests', () => {
		test('checking out with no order should fail', async () => {
			const response = await request(app).post('/checkout/');

			expect(response.status).toBe(400);
			expect(response.headers['content-type']).toMatch(/json/);
			expect(response.body).toEqual({
				success: false,
				message: 'No order received',
			});
		});

		test('checking out with empty order should fail', async () => {
			const response = await request(app)
				.post('/checkout/')
				.type('json')
				.send({ order: [] });

			expect(response.status).toBe(400);
			expect(response.headers['content-type']).toMatch(/json/);
			expect(response.body).toEqual({
				success: false,
				message: 'Empty order received',
			});
		});
	});

	describe('Integration tests', () => {
		test('checking out an order should return total price', async () => {
			const order = [
				{ id: 1, qty: 1 },
				{ id: 2, qty: 1 },
				{ id: 3, qty: 1 },
				{ id: 8, qty: 1 },
				{ id: 10, qty: 4 },
			];

			const response = await request(app)
				.post('/checkout/')
				.type('json')
				.send({ order: order });

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toMatch(/json/);
			expect(response.body).toEqual({ success: true, totalPrice: '$409.91' });
		});
	});
});
