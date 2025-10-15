import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProduct{
    name: string;
    url: string;
    selector: string;
    userId: string;
}

export interface UpdateProduct{
    name?: string;
    selector?: string;
    isActive?: boolean;
}

export class ProductService{

    //create a new product to track
    static async createProduct(data: CreateProduct): Promise<any> {
        const{ name, url, selector, userId} = data;

        //validate the url format
        try{
            new URL(url);
        }catch(error){
            throw new Error('Invalid URL format');
        }
    
    //check if the user exists
    const user = await prisma.user.findUnique({
        where: {id: userId}
    })

    if(!user){
        throw new Error('User not found');
    }

    //create the product
    const product = await prisma.product.create({
        data: {
            name,
            url,
            selector,
            userId: userId,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            url: true,
            selector: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return product;
    }

    //get all products for the user
    static async getAllProducts(userId: string): Promise<any> {
    const products  =await prisma.product.findMany({
        where: { userId: userId },  
        select : {
            id: true,
            name: true,
            url: true,
            selector: true,
            isActive: true,
            updatedAt: true,
            createdAt: true,
        }  })        ;
        return products;
    }

    //delete a product
    static async deleteProduct(productId: string, userId: string) {
        //check if the product exist and belongs to user
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: productId,
                userId: userId,
            }
        });
        if(!existingProduct) {
            throw new Error('Product not found');
        }

        //delete the product (cascade deleted price history and alerts)
        await prisma.product.delete({
            where: { id: productId }
        })

        return {message: 'Product deleted successfully'};
    }

    //get all active products (for scraping job)
    static async getActiveProducts(): Promise<any> {
        const products = await prisma.product.findMany({
            where: { isActive: true},
            select: {
                id: true,
                name: true,
                url: true,
                selector: true,
                updatedAt: true,
                createdAt: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                    }
                }
            }
        });

        return products;
    }
}
