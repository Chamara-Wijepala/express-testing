import request from 'supertest';
import app from './test-app';
import products from '../routes/productsRoutes';
import db from '../db/db.json';

app.use('/products', products);

describe('Create operations', () => {
	test('should add new product to list', (done) => {
		const newProduct = {
			id: 11,
			name: 'Ergonomic Office Chair',
			price: 199.99,
			stock: 12,
		};

		request(app)
			.post('/products/')
			.type('json')
			.send(newProduct)
			.then(() => {
				request(app)
					.get(`/products/${newProduct.id}`)
					.expect({ success: true, product: db[newProduct.id - 1] })
					.expect(200, done);
			});
	});
});

describe('Read operations', () => {
	test('should get all products', (done) => {
		request(app)
			.get('/products/')
			.expect('Content-Type', /json/)
			.expect({
				success: true,
				products: db,
			})
			.expect(200, done);
	});

	test('should get product by id', (done) => {
		request(app)
			.get('/products/1')
			.expect('Content-Type', /json/)
			.expect({
				success: true,
				product: db[0],
			})
			.expect(200, done);
	});

	test('should fail to get non-existent product', (done) => {
		request(app)
			.get(`/products/${db.length + 1}`)
			.expect('Content-Type', /json/)
			.expect({
				success: false,
				message: "That item doesn't exist",
			})
			.expect(404, done);
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
