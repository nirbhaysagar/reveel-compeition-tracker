import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/service';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // 2. Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7); // Remove 'Bearer ' (7 characters)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // 3. Verify token and get user ID
    const { userId } = AuthService.verifyToken(token);

    // 4. Get user data from database
    const user = await AuthService.getUserById(userId);

    // 5. Add user info to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name || undefined
    };

    // 6. Continue to next middleware/controller
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // 7. Handle token verification errors
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};