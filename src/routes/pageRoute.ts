import * as express from 'express'
import { getAllFilms } from '../controllers/filmController';
import { getDash, getLogin, getRegister, getAddFilm, getAddActor} from '../controllers/pageController';
import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

router.get('/', getLogin)
router.get('/login', getLogin)
router.get('/register', getRegister)

router.get('/dash', verifyToken, getDash)


const pageRouter = router;
export default pageRouter;