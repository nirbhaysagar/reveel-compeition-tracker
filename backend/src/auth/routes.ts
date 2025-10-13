import { Router } from 'express';
import { AuthController } from './controller';
import { authMiddleware } from '../middleware/auth.Middleware';


const router = Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);

//protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;