import "reflect-metadata";
import {createConnection} from "typeorm";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import * as express from "express";
import * as passport from "passport";
import * as fileUpload from 'express-fileupload'
import * as methodOverride from 'method-override'
import passportStrategyGoogle from './services/googleAuth'
import passportStrategyFacebook from './services/facebookAuth'
import passportStrategyLocal from './services/LocalAuth'
import pageRoute from './routes/pageRoute'
import authRoute from './routes/authRoute'
import userRoute from './routes/userRoute'
import filmRoute from './routes/filmRoute'
import actorRoute from "./routes/actorRoute";


dotenv.config();

createConnection().then(async connection => {

//------Init Express App---------
const app = express();
app.set("view engine", "ejs");
app.locals.moment = require('moment');

app.use(express.static("public"));
// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(fileUpload())
app.use(methodOverride('_method', {methods:['POST','GET']}))



app.use('/', pageRoute)
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/film', filmRoute)
app.use('/actor', actorRoute)

passportStrategyGoogle(passport);
passportStrategyFacebook(passport);
passportStrategyLocal(passport);

app.use((Error, res) => {
  res.status(400).json({Error});
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running.`);
  });

}).catch(error => console.log(error));
