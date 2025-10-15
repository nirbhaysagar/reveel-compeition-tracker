import {  Router } from 'express';
import { ProductController } from './prod.controller';
import { authMiddleware } from '../middleware/auth.Middleware';

const router = Router();

//all products routes required authentication
router.use(authMiddleware);

//product routes
router.post('/', ProductController.createProduct);
router.get('/', ProductController.getUserProducts);
router.delete('/:id', ProductController.deleteProduct);

export default router;