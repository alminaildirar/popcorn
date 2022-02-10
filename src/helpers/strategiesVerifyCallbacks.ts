import { User } from "../entity/User";

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

    }

}