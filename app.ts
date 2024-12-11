import express from 'express';
import products from './routes/productsRoutes';
import checkout from './routes/checkoutRoutes';

const app = express();

app.use(express.json());

app.use('/products', products);
app.use('/checkout', checkout);

app.listen(3000, () => console.log('Server Running'));
