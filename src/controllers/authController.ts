import * as passport from 'passport'



export const googleAuthScope = passport.authenticate("google", { scope: ["profile", "email"] })
export const googleAuth = passport.authenticate("google", {failureRedirect: "/login"})