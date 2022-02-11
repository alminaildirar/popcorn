//This middleware is used to check before create user
import { RequestHandler } from 'express';
import {check, validationResult} from 'express-validator';
import { User } from '../entity/User';

//This is used to check errors for register process
export const registrationValidation = [
    check("email").trim().notEmpty().withMessage("Check your e-mail"),
    check("username","Username must be at least characters long.").trim().notEmpty().isLength({min:3}),
    check("password","Password must be at least characters long.").trim().notEmpty().isLength({min:3}),
    //This custom function is used to check if password and confirmpassword are match or not.
    check("confirm_password").trim().custom((value, {req}) => {
        if(value != req.body.password){
            throw new Error("Passwords do not match");
        }
        return true;
    })

]

export const checkErrorsForRegister:RequestHandler = async(req, res, next) => {

    //This array is used to store errors which get from validation result
    const errors: Array<String> = validationResult(req).array().map(error => error.msg)
    
    //Check the username is already exist?
    if(await User.findOne({username: req.body.username})){
        errors.push('Username already exist.')   
    }

    //Check the email is already exist?
    if(await User.findOne({email: req.body.email})){
        errors.push('Email already exist. ')
    }
   
    //If there is error go again register page, if not go next 
    errors.length > 0 ? res.render('register', {errors}) : next()
}