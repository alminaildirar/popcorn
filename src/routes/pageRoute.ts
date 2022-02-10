import * as express from 'express'
import { getLogin, getRegister} from '../controllers/pageController';

const router = express.Router();

router.get('/', getLogin)
router.get('/login', getLogin)
router.get('/register', getRegister)


const pageRouter = router;
export default pageRouter;