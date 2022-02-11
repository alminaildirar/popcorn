import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";



declare global {
    namespace Express {
      export interface Request {
        userID: number;
        
      }
    }
}

export const verifyToken: RequestHandler = async(req,res,next) => {

    try{
      
         const token = req.cookies.jwt;

         if(!token) return res.render('login');
         
         jwt.verify(token, process.env.TOKEN_SECRET, (err,decoded) => {
             req.userID = decoded.userID
             
             if(err){
                 res.render('login')
             }
         })
         next()
    }catch(error){

    }


}


