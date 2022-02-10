import * as express from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import { addActor, getActor, getAllActors} from '../controllers/actorController'
import { getAddActor } from '../controllers/pageController';




//http://localhost:5000//actor/
const router = express.Router();

router.get('/add-actor', verifyToken, getAddActor)
router.post('/add-actor', verifyToken, addActor)
router.get('/actors', verifyToken, getAllActors)
router.get('/:id', verifyToken, getActor)





const actorRouter = router;
export default actorRouter;