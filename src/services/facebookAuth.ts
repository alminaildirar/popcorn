import { PassportStatic } from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { facebookVerify } from '../helpers/strategiesVerifyCallbacks';

import * as dotenv from 'dotenv'
dotenv.config()


export default (passport: PassportStatic) => {

    passport.use("facebook", new FacebookStrategy(

      {

        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/auth/facebook/callback",
        passReqToCallback: true,
        profileFields: ['displayName','email']

      },
      facebookVerify
    ));

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

}