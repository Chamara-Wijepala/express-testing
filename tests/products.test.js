const request = require('supertest');
const app = require('./test-app');
const products = require('../routes/productsRoutes');
const db = require('../db/db.json');

app.use('/products', products);

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
			.get('/products/12')
			.expect('Content-Type', /json/)
			.expect({
				success: false,
				message: "That item doesn't exist",
			})
			.expect(404, done);
	});
});
