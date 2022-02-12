import { RequestHandler } from "express";
import { Actor } from "../entity/Actor";
import { Film } from "../entity/Film";
import { FilmLikes } from "../entity/FilmLikes";
import { ActorLikes } from "../entity/ActorLikes";
import { User } from "../entity/User";

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
};

export const getDash: RequestHandler = async (req, res) => {

  const topFilm = await Film.createQueryBuilder("film")
    .leftJoinAndSelect("film.likes", "likes")
    .addSelect("COUNT(likes.filmID)", "count")
    .groupBy("likes.filmID")
    .where("film.visible = true")
    .orderBy("count", "DESC")
    .getOne()

  const films = await Film.createQueryBuilder("film")
  .leftJoinAndSelect("film.user", "user")
  .leftJoinAndSelect("film.comments", "comments")
  .leftJoinAndSelect("film.likes", "likes")
  .where("film.visible = true")
  .andWhere("film.id = :filmID", {filmID: topFilm.id})
  .getMany();
     
  const userFilmLikes = await FilmLikes.createQueryBuilder("filmlikes")
    .leftJoinAndSelect("filmlikes.film", "film")
    .where("filmlikes.ownerID = :filmuserID", { filmuserID: req.userID })
    .getMany();

  const userfilmLikes = [];
  for (let i = 0; i < userFilmLikes.length; i++) {
    userfilmLikes.push(userFilmLikes[i].film.id);
  }

  const topActor = await Actor.createQueryBuilder("actor")
  .leftJoinAndSelect("actor.likes", "likes")
  .addSelect("COUNT(likes.actorID)", "count")
  .groupBy("likes.actorID")
  .where("actor.visible = true")
  .orderBy("count", "DESC")
  .getOne()

  
  const actors = await Actor.createQueryBuilder("actor")
  .leftJoinAndSelect("actor.user", "user")
  .leftJoinAndSelect("actor.comments", "comments")
  .leftJoinAndSelect("actor.likes","likes")
  .where("actor.visible = true")
  .andWhere("actor.id = :actorID", {actorID: topActor.id})
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
    useractorLikes,
  });
};

export const getFilmEditPage: RequestHandler = async (req, res) => {
  const film = await Film.findOne({ id: Number(req.params.id) });
  res.render("update-film", { film });
};

export const getActorEditPage: RequestHandler = async (req, res) => {
  const actor = await Actor.findOne({ id: Number(req.params.id) });
  res.render("update-actor", { actor });
};

// export const getOnBoard:RequestHandler = async (req,res) => {

//   res.render('onboard')

// }
