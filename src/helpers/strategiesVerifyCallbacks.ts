import { User } from "../entity/User";
import { compare } from "bcrypt";


export const googleVerify = async(request, accessToken, refreshToken, profile, done) => {

    try{
        const existingUser = await User.findOne({email: profile.email});
        if(existingUser){
            return done(null,existingUser);
        }
        const newUser = await User.create({
            method: 'google',
            email: profile.email,
            username: profile.email.substring(0,(profile.email.indexOf('@')))

        })
        await newUser.save();
        return done(null,newUser)

    }catch(error){
        throw new Error();
    }

};

export const facebookVerify = async(request, accessToken, refreshToken, profile, done) => {
    try{
        const existingUser = await User.findOne({email: profile._json.email});
        if(existingUser){
            return done(null,existingUser);
        }
        const newUser = await User.create({
            method: 'facebook',
            email: profile._json.email,
            username: profile._json.email.substring(0,(profile._json.email.indexOf('@')))
            
        })
        await newUser.save();
        return done(null,newUser)

    }catch(error){
        throw new Error();
    }
};

export const localVerify = async (username,password,done) => {
    try{
        const user = await User.findOne({username})
        if(!user){

            return done(null,false,{message: 'User not found.'})
        }
        await compare(password, user.password, (err,res)=> {

            if(res){ 
                return done(null,user) 
 
            }else{
                return done(null,false)
            }
        })

    }catch(err){
        return done(err,null)
    }
};


