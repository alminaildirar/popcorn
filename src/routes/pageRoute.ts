import * as express from 'express'
import { getAllFilms } from '../controllers/filmController';
import { getDash, getLogin, getRegister} from '../controllers/pageController';
import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

router.get('/', getLogin)
router.get('/login', getLogin)
router.get('/register', getRegister)

// //buraya dikkat
// router.get('/dash', verifyToken, getOnBoard)
router.get('/dash', verifyToken, getDash)


const pageRouter = router;
export default pageRouter;