import { RequestHandler} from "express";
import { User } from "../entity/User";
import { Actor } from "../entity/Actor";
import * as fs from 'fs'



export const addActor: RequestHandler = async (req, res) => {
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
      const actor = await Actor.create({
        name,
        description,
        visible: visibility,
        image: imageurl,
        user: currentUser,
      });
      await Actor.save(actor);
      //YÖNLENDİRME DEĞİŞECEK!!!
      res.redirect("/dash");
    } catch (error) {}
  };


  export const getActor: RequestHandler = async (req, res) => {
    const currentUser = await User.findOne({id: req.userID})
    const actor = await Actor.createQueryBuilder("actor")
      .leftJoinAndSelect("actor.user", "user")
      .leftJoinAndSelect("actor.comments", "comments.content")
      .leftJoinAndSelect("actor.likes", "likes")
      .where("actor.id = :actorID", { actorID: req.params.id })
      .getOne();
  
    if (!actor) {
      return res.redirect("/dash");
    }
  
    let liked = false;
    for (let i = 0; i < actor.likes.length; i++) {
      actor.likes[i].ownerID == req.userID ? (liked = true) : (liked = false);
    }
  
    res.render("actor", { actor, liked, user: currentUser.username });
  };