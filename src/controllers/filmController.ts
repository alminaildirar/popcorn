import { RequestHandler} from "express";
import { Film } from "../entity/Film";
import { FilmLikes } from "../entity/FilmLikes";
import { User } from "../entity/User";
import * as fs from 'fs'
import { FilmComments } from "../entity/FilmComments";


export const addFilm: RequestHandler = async (req, res) => {
    try {
    
        console.log('geldi')
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