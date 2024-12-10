const express = require('express');
const products = require('./routes/productsRoutes');
const checkout = require('./routes/checkoutRoutes');

const app = express();

app.use(express.json());

app.use('/products', products);
app.use('/checkout', checkout);

app.listen(3000, () => console.log('Server Running'));
