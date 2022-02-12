import { RequestHandler } from 'express';
import { Film } from '../entity/Film';
import { FilmLikes } from '../entity/FilmLikes';
import { User } from '../entity/User';
import * as fs from 'fs';
import { FilmComments } from '../entity/FilmComments';


export const addFilm: RequestHandler = async (req, res) => {
  try {
    //Check first is there a user logged in?If not, go back login
    if (!req.userID) return res.redirect('/login');

    //Check are all required fields are filled?
    if (!req.body.name || !req.body.description) {
      const errors: string = 'Film name/Film description is required.';
      return res.render('add-film', { errors });
    }

    const currentUser = await User.findOne({ id: req.userID });
    //Check upload folder is exist?if not create for the image to be uploaded by the user
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    //If the user does not upload image, added default image.
    let imageurl;
    if(!req.files){
      imageurl = '/uploads/default.jpg'
    }else{
      const imageName = req.files.image['name'];
      const image = req.files.image['data'];
      fs.writeFileSync(uploadDir + '/' + imageName, image);
      imageurl = '/uploads/' + imageName;
    }


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

    res.status(201).redirect('/film/my-films');
  } catch (error) {
    throw new Error();
  }
};

//This is used to get single film page
export const getFilm: RequestHandler = async (req, res) => {
  try {
    const currentUser = await User.findOne({ id: req.userID });
    const film = await Film.createQueryBuilder('film')
      .leftJoinAndSelect('film.user', 'user')
      .leftJoinAndSelect('film.comments', 'comments.content')
      
      .leftJoinAndSelect('film.likes', 'likes')
      .where('film.id = :filmID', { filmID: req.params.id })
      .getOne();

  

    if (!film) {
      return res.redirect('/dash');
    }
    //This is used to user can like/re-like on single pages.
    let liked = false;
    for (let i = 0; i < film.likes.length; i++) {
      film.likes[i].ownerID == req.userID ? (liked = true) : (liked = false);
    }

    res.status(200).render('film', { film, liked, user: currentUser.username});
  } catch (Error) {
    throw new Error();
  }
};

//To list all visible films
export const getAllFilms: RequestHandler = async (req, res) => {
  try {
    //For pagination, get 5 films per page.
    const page = req.query.page || 1;
    const totalFilms = (await Film.find({ visible: true })).length;

    const films = await Film.createQueryBuilder('film')
      .leftJoinAndSelect('film.user', 'user')
      .leftJoinAndSelect('film.comments', 'comments')
      .leftJoinAndSelect('film.likes', 'likes')
      .take(5)
      .skip((Number(page) - 1) * 5)
      .where('film.visible = true')
      .orderBy('film.created', 'DESC')
      .getMany();

    //i used that query in order to get current user's like
    const userlikes = await FilmLikes.createQueryBuilder('filmlikes')
      .leftJoinAndSelect('filmlikes.film', 'film')
      .where('filmlikes.ownerID = :userID', { userID: req.userID })
      .getMany();

    //To prevent like over and over again, i used that array for like/re-like buttons visibility
    const userfilmLikes = [];
    for (let i = 0; i < userlikes.length; i++) {
      userfilmLikes.push(userlikes[i].film.id);
    }
    res.status(200).render('films', {
      films,
      userfilmLikes,
      pages: Math.ceil(totalFilms / 5),
      current: page
    });
  } catch (Error) {
    throw new Error();
  }
};

//To list all my own films
export const getMyFilms: RequestHandler = async (req, res) => {
  try {
    const myFilms = await Film.createQueryBuilder('film')
      .leftJoinAndSelect('film.user', 'user')
      .leftJoinAndSelect('film.comments', 'comments')
      .leftJoinAndSelect('film.likes', 'likes')
      .where('film.user.id = :userID', { userID: req.userID })
      .orderBy('film.created', 'DESC')
      .getMany();

    //i used that query in order to get current user's like
    const userlikes = await FilmLikes.createQueryBuilder('filmlikes')
      .leftJoinAndSelect('filmlikes.film', 'film')
      .where('filmlikes.ownerID = :userID', { userID: req.userID })
      .getMany();

    //To prevent like over and over again, i used that array for like/re-like buttons visibility
    const userfilmLikes = [];
    for (let i = 0; i < userlikes.length; i++) {
      userfilmLikes.push(userlikes[i].film.id);
    }
    
    res.status(200).render('my-films', { myFilms, userfilmLikes });
  } catch (Error) {
    throw new Error();
  }
};

export const likeFilm: RequestHandler = async (req, res) => {
  try {
    const currentFilm = await Film.findOne({ id: Number(req.params.id) });
    const like = await FilmLikes.create({
      ownerID: req.userID,
      film: currentFilm,
    });
    await FilmLikes.save(like);

    //used to redirect the user to the page from whichever page user came from
    if (req.params.src === 'dash') {
      return res.redirect('/dash');
    } else if (req.params.src === 'single') {
      return res.redirect(`/film/${req.params.id}`);
    } else if (req.params.src === 'all') {
      return res.redirect(`/film/films`);
    }

    res.status(201).redirect('/film/my-films');
  } catch (Error) {
    throw new Error();
  }
};

export const relikeFilm: RequestHandler = async (req, res) => {
  try {
    const userlikes = await FilmLikes.createQueryBuilder('filmlikes')
      .leftJoinAndSelect('filmlikes.film', 'film')
      .where('filmlikes.ownerID = :userID', { userID: req.userID })
      .andWhere('filmlikes.film = :filmID', { filmID: Number(req.params.id) })
      .getOne();

    const idToBeDeleted = userlikes.id;

    const likeToBeDeleted = await FilmLikes.findOne({ id: idToBeDeleted });
    await FilmLikes.remove(likeToBeDeleted);

    //used to redirect the user to the page from whichever page user came from
    if (req.params.src === 'dash') {
      return res.redirect('/dash');
    } else if (req.params.src === 'single') {
      return res.redirect(`/film/${req.params.id}`);
    } else if (req.params.src === 'all') {
      return res.redirect(`/film/films`);
    }
    res.status(200).redirect('/film/my-films');
  } catch (Error) {
    throw new Error();
  }
};

export const addFilmComment: RequestHandler = async (req, res) => {
  try {
    const currentUser = await User.findOne({ id: req.userID });
    const currentFilm = await Film.findOne({ id: Number(req.params.id) });
    const { content } = req.body;

    const comment = FilmComments.create({
      content,
      author: currentUser.username,
      film: currentFilm,
    });

    await FilmComments.save(comment);
    res.status(201).redirect(`/film/${req.params.id}`);
  } catch (Error) {
    throw new Error();
  }
};

export const deleteCommentFilm: RequestHandler = async (req, res) => {
  try {
    const commentToBeDeleted = await FilmComments.findOne({
      id: Number(req.params.id),
    });
    await FilmComments.remove(commentToBeDeleted);

    res.status(200).redirect(`/film/${req.params.filmID}`);
  } catch (Error) {
    throw new Error();
  }
};

export const updateFilm: RequestHandler = async (req, res) => {
  try {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filmForImage = await Film.findOne({ id: Number(req.params.id) });
    let imageurl;
    if(!req.files){
      imageurl = filmForImage.image;
    }else{
      const imageName = req.files.image['name'];
      const image = req.files.image['data'];
      fs.writeFileSync(uploadDir + '/' + imageName, image);
      imageurl = '/uploads/' + imageName;
    }

    const filmToBeCheck = await Film.createQueryBuilder('film')
      .leftJoinAndSelect('film.user', 'user')
      .where('film.id = :filmID', { filmID: req.params.id })
      .getOne();

    //check first film's creator is current user?
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

      return res.redirect('/film/my-films');
    }
    return res.redirect('/dash');
  } catch (Error) {
    throw new Error();
  }
};

export const deleteFilm: RequestHandler = async (req, res) => {
  try {
    const filmToBeCheck = await Film.createQueryBuilder('film')
      .leftJoinAndSelect('film.user', 'user')
      .where('film.id = :filmID', { filmID: req.params.id })
      .getOne();

    if (filmToBeCheck.user.id === req.userID) {
      const film = await Film.findOne({ id: Number(req.params.id) });
      await Film.remove(film);
      return res.redirect('/film/my-films');
    }
    return res.redirect('/dash');
  } catch (Error) {
    throw new Error();
  }
};
