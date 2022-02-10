import * as express from 'express'
import { getLogin} from '../controllers/pageController';

const router = express.Router();

router.get('/', getLogin)


const pageRouter = router;
export default pageRouter;