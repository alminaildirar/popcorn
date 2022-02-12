import { RequestHandler } from 'express';
import { User } from '../entity/User';
import { Actor } from '../entity/Actor';
import { ActorLikes } from '../entity/ActorLikes';
import { ActorComments } from '../entity/ActorComments';
import * as fs from 'fs';

export const addActor: RequestHandler = async (req, res) => {
  try {
    //Check first is there a user logged in?If not, go back login
    if (!req.userID) res.redirect('/login');

    //Check are all required fields are filled?
    if (!req.body.name || !req.body.description) {
      const errors: string = 'Actor name/Actor description is required.';
      return res.render('add-actor', { errors });
    }
    const currentUser = await User.findOne({ id: req.userID });

    //Check upload folder is exist?if not create for the image to be uploaded by the user
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

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
    res.status(201).redirect('/actor/my-actors');
  } catch (error) {
    throw new Error();
  }
};

//This is used to get single film page
export const getActor: RequestHandler = async (req, res) => {
  const currentUser = await User.findOne({ id: req.userID });
  const actor = await Actor.createQueryBuilder('actor')
    .leftJoinAndSelect('actor.user', 'user')
    .leftJoinAndSelect('actor.comments', 'comments.content')
    .leftJoinAndSelect('actor.likes', 'likes')
    .where('actor.id = :actorID', { actorID: req.params.id })
    .getOne();

  if (!actor) {
    return res.redirect('/dash');
  }
  //This is used to user can like/re-like on single pages.
  let liked = false;
  for (let i = 0; i < actor.likes.length; i++) {
    actor.likes[i].ownerID == req.userID ? (liked = true) : (liked = false);
  }

  res.status(200).render('actor', { actor, liked, user: currentUser.username });
};

//To list all visible actors
export const getAllActors: RequestHandler = async (req, res) => {
  try {
    //For pagination, get 5 films per page.
    const page = req.query.page || 1;
    const totalActors = (await Actor.find({ visible: true })).length;

    const actors = await Actor.createQueryBuilder('actor')
      .leftJoinAndSelect('actor.user', 'user')
      .leftJoinAndSelect('actor.comments', 'comments')
      .leftJoinAndSelect('actor.likes', 'likes')
      .take(5)
      .skip((Number(page) - 1) * 5)
      .where('actor.visible = true')
      .orderBy('actor.created', 'DESC')
      .getMany();

    const userlikes = await ActorLikes.createQueryBuilder('actorlikes')
      .leftJoinAndSelect('actorlikes.actor', 'actor')
      .where('actorlikes.ownerID = :userID', { userID: req.userID })
      .getMany();

    const useractorLikes = [];
    for (let i = 0; i < userlikes.length; i++) {
      useractorLikes.push(userlikes[i].actor.id);
    }
    res.status(200).render('actors', {
      actors,
      useractorLikes,
      pages: Math.ceil(totalActors / 5),
      current: page,
    });
  } catch (Error) {
    throw new Error();
  }
};

//To list all my own actors
export const getMyActors: RequestHandler = async (req, res) => {
  try {
    const myActors = await Actor.createQueryBuilder('actor')
      .leftJoinAndSelect('actor.user', 'user')
      .leftJoinAndSelect('actor.comments', 'comments')
      .leftJoinAndSelect('actor.likes', 'likes')
      .where('actor.user.id = :userID', { userID: req.userID })
      .orderBy('actor.created', 'DESC')
      .getMany();

    //i used that query in order to get current user's like
    const userlikes = await ActorLikes.createQueryBuilder('actorlikes')
      .leftJoinAndSelect('actorlikes.actor', 'actor')
      .where('actorlikes.ownerID = :userID', { userID: req.userID })
      .getMany();

    //To prevent like over and over again, i used that array for like/re-like buttons visibility
    const useractorLikes = [];
    for (let i = 0; i < userlikes.length; i++) {
      useractorLikes.push(userlikes[i].actor.id);
    }

    res.status(200).render('my-actors', { myActors, useractorLikes });
  } catch (Error) {
    throw new Error();
  }
};

export const likeActor: RequestHandler = async (req, res) => {
  try {
    const currentActor = await Actor.findOne({ id: Number(req.params.id) });

    const like = await ActorLikes.create({
      ownerID: req.userID,
      actor: currentActor,
    });
    await ActorLikes.save(like);

    //used to redirect the user to the page from whichever page user came from
    if (req.params.src === 'dash') {
      return res.redirect('/dash');
    } else if (req.params.src === 'single') {
      return res.redirect(`/actor/${req.params.id}`);
    } else if (req.params.src === 'all') {
      return res.redirect(`/actor/actors`);
    }
    res.redirect('/actor/my-actors');
  } catch (Error) {
    throw new Error();
  }
};

export const relikeActor: RequestHandler = async (req, res) => {
  try {
    const userlikes = await ActorLikes.createQueryBuilder('actorlikes')
      .leftJoinAndSelect('actorlikes.actor', 'actor')
      .where('actorlikes.ownerID = :userID', { userID: req.userID })
      .andWhere('actorlikes.actor = :actorID', {
        actorID: Number(req.params.id),
      })
      .getOne();

    const idToBeDeleted = userlikes.id;

    const likeToBeDeleted = await ActorLikes.findOne({ id: idToBeDeleted });
    await ActorLikes.remove(likeToBeDeleted);

    //used to redirect the user to the page from whichever page user came from
    if (req.params.src === 'dash') {
      return res.redirect('/dash');
    } else if (req.params.src === 'single') {
      return res.redirect(`/actor/${req.params.id}`);
    } else if (req.params.src === 'all') {
      return res.redirect(`/actor/actors`);
    }
    res.status(200).redirect('/actor/my-actors');
  } catch (Error) {
    throw new Error();
  }
};

export const addActorComment: RequestHandler = async (req, res) => {
  try {
    const currentUser = await User.findOne({ id: req.userID });

    const currentActor = await Actor.findOne({ id: Number(req.params.id) });
    const { content } = req.body;

    const comment = ActorComments.create({
      content,
      author: currentUser.username,
      actor: currentActor,
    });
    await ActorComments.save(comment);

    res.status(201).redirect(`/actor/${req.params.id}`);
  } catch (Error) {
    throw new Error();
  }
};

export const deleteCommentActor: RequestHandler = async (req, res) => {
  try {
    const commentToBeDeleted = await ActorComments.findOne({
      id: Number(req.params.id),
    });
    await ActorComments.remove(commentToBeDeleted);

    res.status(200).redirect(`/actor/${req.params.actorID}`);
  } catch (Error) {
    throw new Error();
  }
};

export const updateActor: RequestHandler = async (req, res) => {
  try {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const actorForImage = await Actor.findOne({ id: Number(req.params.id) });
    let imageurl;
    if(!req.files){
      imageurl = actorForImage.image;
    }else{
      const imageName = req.files.image['name'];
      const image = req.files.image['data'];
      fs.writeFileSync(uploadDir + '/' + imageName, image);
      imageurl = '/uploads/' + imageName;
    }

    const actorToBeCheck = await Actor.createQueryBuilder('actor')
      .leftJoinAndSelect('actor.user', 'user')
      .where('actor.id = :actorID', { actorID: req.params.id })
      .getOne();

    if (actorToBeCheck.user.id === req.userID) {
      const { name, description } = req.body;
      let visibility;
      req.body.visibility ? (visibility = false) : (visibility = true);

      const actor = await Actor.findOne({ id: Number(req.params.id) });
      actor.name = name;
      actor.description = description;
      actor.visible = visibility;
      actor.image = imageurl;
      await Actor.save(actor);

      return res.status(200).redirect('/actor/my-actors');
    }
    return res.redirect('/dash');
  } catch (Error) {
    throw new Error();
  }
};

export const deleteActor: RequestHandler = async (req, res) => {
  try {
    const actorToBeCheck = await Actor.createQueryBuilder('actor')
      .leftJoinAndSelect('actor.user', 'user')
      .where('actor.id = :actorID', { actorID: req.params.id })
      .getOne();

    if (actorToBeCheck.user.id === req.userID) {
      const actor = await Actor.findOne({ id: Number(req.params.id) });
      await Actor.remove(actor);
      return res.status(200).redirect('/actor/my-actors');
    }
    return res.redirect('/dash');
  } catch (Error) {
    throw new Error();
  }
};
