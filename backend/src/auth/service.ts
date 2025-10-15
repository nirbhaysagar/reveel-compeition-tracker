import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SignUpData {
    email: string;
    password: string;
    name?: string;
}

export interface SignInData{
    email: string;
    password: string;
}

export class AuthService{

    //hasd password for security purposes
    static async hashPassword(password: string):Promise<string> {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    //verify password against hash
    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    //generate JWT Token
    static generateToken(userId: string):string {
        const secret = process.env.JWT_SECRET;
        if(!secret){
            throw new Error('JWT_SECRET is not set');
        }
        return jwt.sign({userId}, secret, {expiresIn: '7d'});
    }

    //verify JWT Token
    static verifyToken(token: string): {userId: string} {
        const secret = process.env.JWT_SECRET;
        if(!secret){
            throw new Error('JWT_SECRET is not configured correctly');
        }
        return jwt.verify(token, secret) as {userId: string};
    }

    //create a new user account
    static async signup(data:SignUpData) {
        const {email, password, name} = data;

        //check if the user already exist

        const currentUser = await prisma.user.findUnique({
            where: {email}
        });
        if(currentUser){
            throw new Error('User already exists');
        }

        //hash password and create the user
        const hashedPassword = await this.hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });

        //generate Token
        const token = this.generateToken(user.id);

        return{
            user,
            token
        };
    }
    
         //Authenticate user login
    static async signin(data: SignInData){
        const{ email, password } = data;

        const currentUser = await prisma.user.findUnique({
            where:{email}
        })

        if(!currentUser){
            throw new Error('User not found');
        }

        //verify the password
        const isPasswordValidated = await this.verifyPassword(password, currentUser.password);
        if(!isPasswordValidated){
            throw new Error('Invalid password');
        }

        //return user data(without password)
        const  { password: _, ...userWithoutPassword } = currentUser;

        //generate Token
        const token = this.generateToken(currentUser.id);

        return{
            user: userWithoutPassword,
            token
        };

    }
    static async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
          }
        });
    
        if (!user) {
          throw new Error('User not found');
        }
    
        return user;
      }
    }