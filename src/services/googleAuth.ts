import { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { googleVerify } from '../helpers/StrategiesVerifyCallbacks';


export default (passport: PassportStatic) => {
    
    passport.use("google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback: true,
      },
      
      googleVerify

    )
  )

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

}