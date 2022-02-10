import { RequestHandler} from "express";
import { Film } from "../entity/Film";
import { FilmLikes } from "../entity/FilmLikes";
import { User } from "../entity/User";
import * as fs from 'fs'
import { FilmComments } from "../entity/FilmComments";


export const addFilm: RequestHandler = async (req, res) => {
    try {
    
      
      if (!req.userID) res.redirect("/login");
      const currentUser = await User.findOne({ id: req.userID });
  
      const uploadDir = "public/uploads"
      if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir)
      }
  
      const imageName  = req.files.image['name'];
      const image = req.files.image['data']
  
      fs.writeFileSync(uploadDir + '/' + imageName,image);
      const imageurl = '/uploads/' + imageName
  
      const { name, description } = req.body;
      let visibility;
      req.body.visibility ? (visibility = true) : (visibility = false);
      const film = await Film.create({
        name,
        description,
        visible: visibility,
        image: imageurl,
        user: currentUser,
      });
      await Film.save(film);
      //YÖNLENDİRME DEĞİŞECEK!!!
      res.redirect("/dash");
    } catch (error) {}
  };

  export const getFilm: RequestHandler = async (req, res) => {
    const currentUser = await User.findOne({id: req.userID})
    const film = await Film.createQueryBuilder("film")
      .leftJoinAndSelect("film.user", "user")
      .leftJoinAndSelect("film.comments", "comments.content")
      .leftJoinAndSelect("film.likes", "likes")
      .where("film.id = :filmID", { filmID: req.params.id })
      .getOne();
  
    if (!film) {
      return res.redirect("/dash");
    }
  
    let liked = false;
    for (let i = 0; i < film.likes.length; i++) {
      film.likes[i].ownerID == req.userID ? (liked = true) : (liked = false);
    }
  
    res.render("film", { film, liked, user: currentUser.username });
  };

  export const getAllFilms: RequestHandler = async (req, res) => {

    const page = req.query.page || 1;
    const totalFilms = (await Film.find({ visible: true })).length;
  
    const films = await Film.createQueryBuilder("film")
      .leftJoinAndSelect("film.user", "user")
      .leftJoinAndSelect("film.comments", "comments")
      .leftJoinAndSelect("film.likes", "likes")
      .take(5)
      .skip((Number(page) - 1) * 5)
      .where("film.visible = true")
      .orderBy("film.created", "DESC")
      .getMany();
  
    const userlikes = await FilmLikes.createQueryBuilder("filmlikes")
      .leftJoinAndSelect("filmlikes.film", "film")
      .where("filmlikes.ownerID = :userID", { userID: req.userID })
      .getMany();
  
    const userfilmLikes = [];
    for (let i = 0; i < userlikes.length; i++) {
      userfilmLikes.push(userlikes[i].film.id);
    }
    res.render("films", {
      films,
      userfilmLikes,
      pages: Math.ceil(totalFilms / 5),
      current: page,
    });
  };