import { RequestHandler} from "express";
import { User } from "../entity/User";
import { Actor } from "../entity/Actor";
import { ActorLikes } from "../entity/ActorLikes";
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
      req.body.visibility ? (visibility = false) : (visibility = true);
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

export const getAllActors: RequestHandler = async (req, res) => {

    const page = req.query.page || 1;
    const totalActors = (await Actor.find({ visible: true })).length;
  
    const actors = await Actor.createQueryBuilder("actor")
      .leftJoinAndSelect("actor.user", "user")
      .leftJoinAndSelect("actor.comments", "comments")
      .leftJoinAndSelect("actor.likes", "likes")
      .take(5)
      .skip((Number(page) - 1) * 5)
      .where("actor.visible = true")
      .orderBy("actor.created", "DESC")
      .getMany();
  
    const userlikes = await ActorLikes.createQueryBuilder("actorlikes")
      .leftJoinAndSelect("actorlikes.actor", "actor")
      .where("actorlikes.ownerID = :userID", { userID: req.userID })
      .getMany();
  
    const useractorLikes = [];
    for (let i = 0; i < userlikes.length; i++) {
      useractorLikes.push(userlikes[i].actor.id);
    }
    res.render("actors", {
      actors,
      useractorLikes,
      pages: Math.ceil(totalActors / 5),
      current: page,
    });
};

export const getMyActors: RequestHandler = async (req, res) => {
  //const currentUser = await User.findOne({id: req.userID})
  const myActors = await Actor.createQueryBuilder("actor")
    .leftJoinAndSelect("actor.user", "user")
    .leftJoinAndSelect("actor.comments", "comments")
    .leftJoinAndSelect("actor.likes", "likes")
    .where("actor.user.id = :userID", { userID: req.userID })
    .orderBy("actor.created", "DESC")
    .getMany();

  const userlikes = await ActorLikes.createQueryBuilder("actorlikes")
    .leftJoinAndSelect("actorlikes.actor", "actor")
    .where("actorlikes.ownerID = :userID", { userID: req.userID })
    .getMany();

  const useractorLikes = [];
  for (let i = 0; i < userlikes.length; i++) {
    useractorLikes.push(userlikes[i].actor.id);
  }

  res.render("my-actors", { myActors, useractorLikes });
};

export const likeActor: RequestHandler = async (req, res) => {
  const currentActor = await Actor.findOne({ id: Number(req.params.id) });

  const like = await ActorLikes.create({
    ownerID: req.userID,
    actor: currentActor,
  });

  await ActorLikes.save(like);

  if (req.params.src === "dash") {
    return res.redirect("/dash");
  } else if (req.params.src === "single") {
    return res.redirect(`/actor/${req.params.id}`);
  }else if(req.params.src === "all"){
    return res.redirect(`/actor/actors`);
  }

  res.redirect("/actor/my-actors");
};

