import express from 'express';
import productsController from '../controllers/productsController';

const router = express.Router();

router.post('/', productsController.addProduct);
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.patch('/:id', productsController.updateProductById);
router.delete('/:id', productsController.deleteProductById);

export default router;
