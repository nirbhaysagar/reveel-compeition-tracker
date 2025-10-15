import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './auth/routes';
import productRoutes from './products/prod.routes';

// Load environment variables with explicit path
const envPath = path.resolve(__dirname, '../.env');
console.log('🔍 Looking for .env at:', envPath);
dotenv.config({ path: envPath });

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Reveel backend is running!'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);



// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to Reveel API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      health: '/health'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Reveel backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
