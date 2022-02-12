import { RequestHandler } from 'express';
import { Actor } from '../entity/Actor';
import { Film } from '../entity/Film';
import { FilmLikes } from '../entity/FilmLikes';
import { ActorLikes } from '../entity/ActorLikes';
import { User } from '../entity/User';

//Get Login Page
export const getLogin: RequestHandler = (req, res) => {
  try {
    res.status(200).render('login');
  } catch (Error) {
    throw new Error();
  }
};

//Get Register Page
export const getRegister: RequestHandler = (req, res) => {
  try {
    res.status(200).render('register');
  } catch (Error) {
    throw new Error();
  }
};

//Get Add Film Page
export const getAddFilm: RequestHandler = (req, res) => {
  try {
    res.status(200).render('add-film');
  } catch (Error) {
    throw new Error();
  }
};

//Get Add Actor Page
export const getAddActor: RequestHandler = (req, res) => {
  try {
    res.status(200).render('add-actor');
  } catch (Error) {
    throw new Error();
  }
};

//Get Dashbord Page, User will see top rated film, and top rated actor on dashboard.
export const getDash: RequestHandler = async (req, res) => {
  try {
    //Get top rated film
    const topFilm = await Film.createQueryBuilder('film')
      .leftJoinAndSelect('film.likes', 'likes')
      .addSelect('COUNT(likes.filmID)', 'count')
      .groupBy('likes.filmID')
      .where('film.visible = true')
      .orderBy('count', 'DESC')
      .getOne();

    //I used this because i need to get film likes, comments too.
    const films = await Film.createQueryBuilder('film')
      .leftJoinAndSelect('film.user', 'user')
      .leftJoinAndSelect('film.comments', 'comments')
      .leftJoinAndSelect('film.likes', 'likes')
      .where('film.visible = true')
      .andWhere('film.id = :filmID', { filmID: topFilm.id })
      .getMany();

    //i used that query in order to get current user's like
    const userFilmLikes = await FilmLikes.createQueryBuilder('filmlikes')
      .leftJoinAndSelect('filmlikes.film', 'film')
      .where('filmlikes.ownerID = :filmuserID', { filmuserID: req.userID })
      .getMany();

    //To prevent like over and over again, i used that array for like/re-like buttons visibility
    const userfilmLikes = [];
    for (let i = 0; i < userFilmLikes.length; i++) {
      userfilmLikes.push(userFilmLikes[i].film.id);
    }

    //Same as film, this query gets top rated actor(which one has more likes?)
    const topActor = await Actor.createQueryBuilder('actor')
      .leftJoinAndSelect('actor.likes', 'likes')
      .addSelect('COUNT(likes.actorID)', 'count')
      .groupBy('likes.actorID')
      .where('actor.visible = true')
      .orderBy('count', 'DESC')
      .getOne();

    //To get top rated actors details, i used this query.
    const actors = await Actor.createQueryBuilder('actor')
      .leftJoinAndSelect('actor.user', 'user')
      .leftJoinAndSelect('actor.comments', 'comments')
      .leftJoinAndSelect('actor.likes', 'likes')
      .where('actor.visible = true')
      .andWhere('actor.id = :actorID', { actorID: topActor.id })
      .orderBy('actor.created', 'DESC')
      .getMany();

    //i used that query in order to get current user's like
    const userActorLikes = await ActorLikes.createQueryBuilder('actorlikes')
      .leftJoinAndSelect('actorlikes.actor', 'actor')
      .where('actorlikes.ownerID = :actoruserID', { actoruserID: req.userID })
      .getMany();

    //To prevent like over and over again, i used that array for like/re-like buttons visibility
    const useractorLikes = [];
    for (let i = 0; i < userActorLikes.length; i++) {
      useractorLikes.push(userActorLikes[i].actor.id);
    }

    res.status(200).render('dash', {
      films,
      userfilmLikes,
      actors,
      useractorLikes,
    });
  } catch (Error) {
    throw new Error();
  }
};

//Get Update Film Page
export const getFilmEditPage: RequestHandler = async (req, res) => {
  try {
    const film = await Film.findOne({ id: Number(req.params.id) });
    res.status(200).render('update-film', { film });
  } catch (Error) {
    throw new Error();
  }
};

//Get Update Actor Page
export const getActorEditPage: RequestHandler = async (req, res) => {
  try {
    const actor = await Actor.findOne({ id: Number(req.params.id) });
    
    res.status(200).render('update-actor', { actor });
  } catch (Error) {
    throw new Error();
  }
};
