import request from 'supertest';
import app from './test-app';
import products from '../routes/productsRoutes';
import prisma from '../db/prisma';
import db from '../db/db.json';

app.use('/products', products);

describe('POST /products/', () => {
	let newProductId: number;
	it('returns an error when no data is sent', async () => {
		const response = await request(app).post('/products/').type('json');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'Received data is in an incorrect format',
		});
	});
	it('returns an error when an empty object is sent', async () => {
		const response = await request(app)
			.post('/products/')
			.type('json')
			.send({});

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'Received data is in an incorrect format',
		});
	});
	it('returns an error when data with incorrect types are sent', async () => {
		const newProduct = {
			name: 'Ergonomic Office Chair',
			price: '199.99',
			stock: true,
		};
		const response = await request(app)
			.post('/products/')
			.type('json')
			.send(newProduct);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			success: false,
			message: 'Received data is in correct format but have incorrect types',
		});
	});
	it('adds new product to database when valid data is sent', async () => {
		const newProduct = {
			name: 'Ergonomic Office Chair',
			price: 199.99,
			stock: 12,
		};
		const response = await request(app)
			.post('/products/')
			.type('json')
			.send(newProduct);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			success: true,
			newProductId: expect.any(Number),
		});

		newProductId = response.body.newProductId;
	});

	afterAll(async () => {
		if (newProductId) {
			await prisma.product.delete({
				where: { id: newProductId },
			});
		}
	});
});

describe.only('GET', () => {
	describe('/products/', () => {
		it('returns a list of all products', async () => {
			const response = await request(app).get('/products/');

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toMatch(/json/);
			expect(response.body).toEqual({
				success: true,
				products: expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						name: expect.any(String),
						price: expect.any(Number),
						stock: expect.any(Number),
					}),
				]),
			});
		});
	});

	describe('/products/:id', () => {
		it('returns an error when passed an invalid id', async () => {
			const response = await request(app).get('/products/foo');

			expect(response.status).toBe(400);
			expect(response.headers['content-type']).toMatch(/json/);
			expect(response.body).toEqual({
				success: false,
				message: 'Received invalid product id',
			});
		});
		/*
		This test fails because of an unknown error. Everything works as it should,
		all the correct values are being returned, but it still fails because of the
		error.

		What causes the error is unknown, but it could possibly be an issue with
		supertest, as the endpoint works when using postman.
		*/
		it('fails to get a non-existent product', async () => {
			const response = await request(app).get('/products/0');

			expect(response.status).toBe(404);
			expect(response.headers['content-type']).toMatch(/json/);
			expect(response.body).toEqual({
				success: false,
				message: "A product with the given id doesn't exist",
			});
		});
		it('returns a product when it exists in the database', async () => {
			const response = await request(app).get('/products/1');

			expect(response.status).toBe(200);
			expect(response.headers['content-type']).toMatch(/json/);
			expect(response.body).toEqual({
				success: true,
				product: {
					id: 1,
					name: 'Wireless Headphones',
					price: 99.99,
					stock: 25,
				},
			});
		});
	});
});

describe('Update operations', () => {
	test('should update product by id', (done) => {
		const updatedProduct = {
			id: 11,
			name: 'Ergonomic Office Chair',
			price: 149.99,
			stock: 12,
		};

		request(app)
			.patch(`/products/${updatedProduct.id}`)
			.type('json')
			.send(updatedProduct)
			.then(() => {
				request(app)
					.get(`/products/${updatedProduct.id}`)
					.expect({ success: true, product: updatedProduct })
					.expect(200, done);
			});
	});

	test('should fail to update non-existent product', (done) => {
		const updatedProduct = {
			id: 12,
			name: 'Ergonomic Office Chair',
			price: 149.99,
			stock: 12,
		};

		request(app)
			.patch(`/products/${updatedProduct.id}`)
			.type('json')
			.send(updatedProduct)
			.expect({ success: false, message: 'Product not found' })
			.expect(404, done);
	});
});

describe('Delete operations', () => {
	test('should delete product by id', async () => {
		const productIdToDelete = 11;

		await request(app)
			.delete(`/products/${productIdToDelete}`)
			.expect(200)
			.expect({
				success: true,
				message: 'Product deleted successfully',
			});

		expect(
			db.find((product) => product.id === productIdToDelete)
		).toBeUndefined();
	});

	test('should fail to delete non-existent product', async () => {
		const productIdToDelete = 12;

		await request(app)
			.delete(`/products/${productIdToDelete}`)
			.expect(404)
			.expect({ success: false, message: 'Product not found' });
	});
});
