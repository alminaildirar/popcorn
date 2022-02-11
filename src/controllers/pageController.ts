import { RequestHandler } from "express";
import { Actor } from "../entity/Actor";
import { Film } from "../entity/Film";
import { FilmLikes } from "../entity/FilmLikes";
import { ActorLikes } from "../entity/ActorLikes";

export const getLogin: RequestHandler = (req, res) => {
  // if(req.userID){
  //   res.redirect('/aferin')
  // }
  res.render("login");
};

export const getRegister: RequestHandler = (req, res) => {
  res.render("register");
};

export const getAddFilm: RequestHandler = (req, res) => {
  res.render("add-film");
};

export const getAddActor: RequestHandler = (req, res) => {
  res.render("add-actor");
}

export const getDash: RequestHandler = async (req, res) => {

  
  const films = await Film.createQueryBuilder("film")
    .leftJoinAndSelect("film.user", "user")
    .leftJoinAndSelect("film.comments", "comments")
    .leftJoinAndSelect("film.likes", "likes")
    .take(2)
    .where("film.visible = true")
    .orderBy("film.created", "DESC")
    .getMany();

  const userFilmLikes = await FilmLikes.createQueryBuilder("filmlikes")
    .leftJoinAndSelect("filmlikes.film", "film")
    .where("filmlikes.ownerID = :filmuserID", { filmuserID: req.userID })
    .getMany();

  const userfilmLikes = [];
  for (let i = 0; i < userFilmLikes.length; i++) {
    userfilmLikes.push(userFilmLikes[i].film.id);
  }

  const actors = await Actor.createQueryBuilder("actor")
  .leftJoinAndSelect("actor.user", "user")
  .leftJoinAndSelect("actor.comments", "comments")
  .leftJoinAndSelect("actor.likes","likes")
  .take(2)
  .where("actor.visible = true")
  .orderBy("actor.created", "DESC")
  .getMany()

 const userActorLikes = await ActorLikes.createQueryBuilder("actorlikes")
   .leftJoinAndSelect("actorlikes.actor", "actor")
   .where("actorlikes.ownerID = :actoruserID", { actoruserID: req.userID })
   .getMany();

  const useractorLikes = [];
   for (let i = 0; i < userActorLikes.length; i++) {
    useractorLikes.push(userActorLikes[i].actor.id);
  }

  res.render("dash", {
     films,
    userfilmLikes,
    actors,
    useractorLikes
  });
};

export const getFilmEditPage:RequestHandler = async (req,res) => {
  
  const film = await Film.findOne({id: Number(req.params.id)})
  res.render("update-film", {film})

}

export const getActorEditPage:RequestHandler = async (req,res) => {
  
  const actor = await Actor.findOne({id: Number(req.params.id)})
  res.render("update-actor", {actor})

  }