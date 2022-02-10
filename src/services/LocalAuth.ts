import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { localVerify } from '../helpers/strategiesVerifyCallbacks';

import { User } from '../entity/User';



export default (passport: PassportStatic) => {

    passport.use("local", new LocalStrategy(
      {usernameField:'username', passwordField:'password'},
      localVerify
  ))

    passport.serializeUser(function (user, done) {
        done(null, user);
      });
  
      passport.deserializeUser(function (user, done) {
        done(null, user);
      });


}
