import { RequestHandler } from "express";
import { User } from "../entity/User";
import { createToken } from "../helpers/createToken";

export const signJwt:RequestHandler = (req, res) => {
    
    
    try{
 
        const user = req.user as User
        
        
        //Create token
        const token = createToken(user.id, req.headers["user-agent"]);
    
        
        //Send jwt to cookie
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000});
        res.redirect('/dash')

    }catch(error){

    }

}