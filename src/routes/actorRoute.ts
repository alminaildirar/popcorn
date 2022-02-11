import * as express from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import { addActor, getActor, getAllActors, getMyActors, likeActor, relikeActor, addActorComment, deleteCommentActor} from '../controllers/actorController'
import { getAddActor } from '../controllers/pageController';




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

router.get('/:id', verifyToken, getActor)





const actorRouter = router;
export default actorRouter;