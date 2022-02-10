import { RequestHandler } from "express";


export const getLogin: RequestHandler = (req, res) => {
    // if(req.userID){
    //   res.redirect('/aferin')
    // }
    res.render("login");
  };


  export const getRegister: RequestHandler = (req, res) => {
    res.render("register");
  };


  