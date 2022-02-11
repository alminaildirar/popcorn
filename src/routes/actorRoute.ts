import * as express from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import { addActor, getActor, getAllActors, getMyActors, likeActor, relikeActor, addActorComment, deleteCommentActor, updateActor, deleteActor} from '../controllers/actorController'
import { getActorEditPage, getAddActor } from '../controllers/pageController';




//http://localhost:5000//actor/
const router = express.Router();

router.get('/actors', verifyToken, getAllActors)
router.get('/add-actor', verifyToken, getAddActor)
router.post('/add-actor', verifyToken, addActor)
router.get('/my-actors', verifyToken, getMyActors)
router.get('/like/:id/:src', verifyToken, likeActor)
router.get('/re-like/:id/:src', verifyToken, relikeActor )
router.post('/add-comment/:id', verifyToken, addActorComment )
router.delete('/deleteComment/:id/:actorID',verifyToken, deleteCommentActor)
router.get('/update-actor/:id',verifyToken, getActorEditPage )
router.put('/update/:id', verifyToken, updateActor)
router.delete('/delete/:id/',verifyToken, deleteActor)

router.get('/:id', verifyToken, getActor)





const actorRouter = router;
export default actorRouter;