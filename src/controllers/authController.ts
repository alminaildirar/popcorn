import * as passport from 'passport'


//------------------------ GOOGLE -------------------------------------------------
export const googleAuthScope = passport.authenticate("google", { scope: ["profile", "email"] })
export const googleAuth = passport.authenticate("google", {failureRedirect: "/login"})


//------------------- -----FACEBOOK----------------------------------------
export const facebookAuthScope = passport.authenticate("facebook", { scope: "email" })
export const facebookAuth =   passport.authenticate("facebook", {failureRedirect: "/login"})


//-------------------------LOCAL LOGIN----------------------------------------
export const localAuth = passport.authenticate("local", {failureRedirect: "/login"});