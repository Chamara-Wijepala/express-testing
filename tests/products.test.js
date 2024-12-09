const request = require('supertest');
const app = require('./test-app');
const products = require('../routes/productsRoutes');
const db = require('../db/db.json');

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
