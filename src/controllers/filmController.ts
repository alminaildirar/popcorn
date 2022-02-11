import { RequestHandler } from "express";
import { Film } from "../entity/Film";
import { FilmLikes } from "../entity/FilmLikes";
import { User } from "../entity/User";
import * as fs from "fs";
import { FilmComments } from "../entity/FilmComments";
import { RepositoryNotFoundError } from "typeorm";

export const addFilm: RequestHandler = async (req, res) => {
  try {
    
    if (!req.userID) return res.redirect("/login");

    if (!req.body.name || !req.body.description) {
      const errors: string = "Film name/Film description is required.";
      return res.render("add-film", { errors });
    }
    
    const currentUser = await User.findOne({ id: req.userID });

    const uploadDir = "public/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const imageName = req.files.image["name"];
    const image = req.files.image["data"];
    fs.writeFileSync(uploadDir + "/" + imageName, image);
    const imageurl = "/uploads/" + imageName;

    const { name, description } = req.body;
    let visibility: boolean;
    req.body.visibility ? (visibility = false) : (visibility = true);
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
  const currentUser = await User.findOne({ id: req.userID });
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

export const getMyFilms: RequestHandler = async (req, res) => {
  //const currentUser = await User.findOne({id: req.userID})
  const myFilms = await Film.createQueryBuilder("film")
    .leftJoinAndSelect("film.user", "user")
    .leftJoinAndSelect("film.comments", "comments")
    .leftJoinAndSelect("film.likes", "likes")
    .where("film.user.id = :userID", { userID: req.userID })
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

  res.render("my-films", { myFilms, userfilmLikes });
};

export const likeFilm: RequestHandler = async (req, res) => {
  const currentFilm = await Film.findOne({ id: Number(req.params.id) });

  const like = await FilmLikes.create({
    ownerID: req.userID,
    film: currentFilm,
  });

  await FilmLikes.save(like);

  if (req.params.src === "dash") {
    return res.redirect("/dash");
  } else if (req.params.src === "single") {
    return res.redirect(`/film/${req.params.id}`);
  } else if (req.params.src === "all") {
    return res.redirect(`/film/films`);
  }

  res.redirect("/film/my-films");
};

export const relikeFilm: RequestHandler = async (req, res) => {
  const userlikes = await FilmLikes.createQueryBuilder("filmlikes")
    .leftJoinAndSelect("filmlikes.film", "film")
    .where("filmlikes.ownerID = :userID", { userID: req.userID })
    .andWhere("filmlikes.film = :filmID", { filmID: Number(req.params.id) })
    .getOne();

  const idToBeDeleted = userlikes.id;

  const likeToBeDeleted = await FilmLikes.findOne({ id: idToBeDeleted });
  await FilmLikes.remove(likeToBeDeleted);

  if (req.params.src === "dash") {
    return res.redirect("/dash");
  } else if (req.params.src === "single") {
    return res.redirect(`/film/${req.params.id}`);
  } else if (req.params.src === "all") {
    return res.redirect(`/film/films`);
  }

  res.redirect("/film/my-films");
};

export const addFilmComment: RequestHandler = async (req, res) => {
  const currentUser = await User.findOne({ id: req.userID });

  const currentFilm = await Film.findOne({ id: Number(req.params.id) });
  const { content } = req.body;

  const comment = FilmComments.create({
    content,
    author: currentUser.username,
    film: currentFilm,
  });

  await FilmComments.save(comment);

  res.redirect(`/film/${req.params.id}`);
};

export const deleteCommentFilm: RequestHandler = async (req, res) => {
  const commentToBeDeleted = await FilmComments.findOne({
    id: Number(req.params.id),
  });
  await FilmComments.remove(commentToBeDeleted);

  res.redirect(`/film/${req.params.filmID}`);
};

export const updateFilm: RequestHandler = async (req, res) => {
  const uploadDir = "public/uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const imageName = req.files.image["name"];
  const image = req.files.image["data"];

  fs.writeFileSync(uploadDir + "/" + imageName, image);
  const imageurl = "/uploads/" + imageName;

  const filmToBeCheck = await Film.createQueryBuilder("film")
    .leftJoinAndSelect("film.user", "user")
    .where("film.id = :filmID", { filmID: req.params.id })
    .getOne();

  if (filmToBeCheck.user.id === req.userID) {
    const { name, description } = req.body;
    let visibility;
    req.body.visibility ? (visibility = false) : (visibility = true);

    const film = await Film.findOne({ id: Number(req.params.id) });
    film.name = name;
    film.description = description;
    film.visible = visibility;
    film.image = imageurl;
    await Film.save(film);

    return res.redirect("/film/my-films");
  }

  return res.redirect("/dash");
};

export const deleteFilm: RequestHandler = async (req, res) => {
  const filmToBeCheck = await Film.createQueryBuilder("film")
    .leftJoinAndSelect("film.user", "user")
    .where("film.id = :filmID", { filmID: req.params.id })
    .getOne();

  if (filmToBeCheck.user.id === req.userID) {
    const film = await Film.findOne({ id: Number(req.params.id) });
    await Film.remove(film);
    return res.redirect("/film/my-films");
  }

  return res.redirect("/dash");
};
