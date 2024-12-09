const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

router.post('/', productsController.addProduct);
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.patch('/:id', productsController.updateProductById);
router.delete('/:id', productsController.deleteProductById);

module.exports = router;
