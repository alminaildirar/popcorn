import * as express from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import { addActor, getActor} from '../controllers/actorController'




//http://localhost:5000//actor/
const router = express.Router();


router.post('/add-actor', verifyToken, addActor)
router.get('/:id', verifyToken, getActor)
router.get('/all-actor', verifyToken)




const actorRouter = router;
export default actorRouter;