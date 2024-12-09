const request = require('supertest');
const app = require('./test-app');
const helloworld = require('../routes/helloworld');

app.use('/', helloworld);

test('helloworld route works', (done) => {
	request(app)
		.get('/')
		.expect('Content-Type', /json/)
		.expect({ success: true, message: 'hello world' })
		.expect(200, done);
});
