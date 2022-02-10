import "reflect-metadata";
import {createConnection} from "typeorm";
import * as dotenv from "dotenv";
import * as express from "express";
import * as passport from "passport";

dotenv.config();

createConnection().then(async connection => {

//------Init Express App---------
const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running.`);
  });




}).catch(error => console.log(error));
