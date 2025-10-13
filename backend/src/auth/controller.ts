import { Request, Response } from 'express';
import { AuthService } from './service';

export class AuthController{
    static async signup(req: Request, res: Response) {
        try{
            //extract the info from the request body
            const {email, password, name} = req.body;
            
            //validate the input
            if(!email || !password ||!name) {
                return res.status(400).json({
                    success: false,
                    message: 'email and password are required'
                })
            }

            //validate th eemail format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                })
            }

            //validate the password length
            if(password.length < 8){
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 8 characters long'
                })
            }

            //call the service layer
            const result = await AuthService.signup({email, password, name});

            //send success response
            return res.status(200).json({
                success: true,
                message: 'user created successfully',
                data: result
            })


        }catch(error){
            res.status(500).json({ 
                success: false,
                message: 'Internal server error' });
        }
    }

    static async signin(req: Request, res: Response) {
        try{
            //extract the body from the request body
            const {email, password} = req.body;

            //validate the requuired fields
            if(!email || !password){
                return res.status(400).json({
                    message: 'email and password are required',
                    success: false
                })
            }

            //call service to handle errors
            const result = await AuthService.signin({email, password})

            //send success response
            res.status(200).json({
                success: true,
                message: 'user logged in successfully',
                data: result
            });
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    //handle get current user fields
    static async getProfile(req: Request, res: Response) {
        try{

            //extract the user id from the request
            const userId = req.userId;
            if(!userId){
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                })
            }
            
            //call service to handle errors
            const result = await AuthService.getProfile(userId);
            
            //send success response
            res.status(200).json({
                success: true,
                message: 'user profile fetched successfully',
                data: result
            });

        }catch(error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}