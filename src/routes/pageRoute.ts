import * as express from 'express'
import { getDash, getLogin, getRegister} from '../controllers/pageController';
import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

router.get('/', getLogin)
router.get('/login', getLogin)
router.get('/register', getRegister)
router.get('/dash', verifyToken, getDash)


const pageRouter = router;
export default pageRouter;