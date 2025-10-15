import { Request, Response } from 'express';
import { ProductService, CreateProduct, UpdateProduct } from './prod.service';

export class ProductController {
  // Create a new product to track
  static async createProduct(req: Request, res: Response) {
    try {
      const { name, url, selector } = req.body;
      const userId = req.user?.id;

      // Validate required fields
      if (!name || !url || !selector) {
        return res.status(400).json({
          success: false,
          message: 'Name, URL, and CSS selector are required'
        });
      }

      // Validate user authentication
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Create product
      const product = await ProductService.createProduct({
        name,
        url,
        selector,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: product
      });

    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  // Get all products for the current user
  static async getUserProducts(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const products = await ProductService.getAllProducts(userId);

      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products
      });

    } catch (error) {
      console.error('Get products error:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }

  // Delete a product
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      await ProductService.deleteProduct(id, userId);

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });

    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}