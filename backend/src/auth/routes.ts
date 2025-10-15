import { Router } from 'express';
import { AuthController } from './controller';
import { authMiddleware } from '../middleware/auth.Middleware';


const router = Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.signin);

//protected routes
router.get('/me', authMiddleware, AuthController.getProfile);

export default router;