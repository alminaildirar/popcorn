import * as express from 'express'
import { createUser, logoutUser} from '../controllers/userController';



//http://localhost:5000//user/
const router = express.Router();


router.post('/register', createUser)
router.get('/logout', logoutUser )




const pageRouter = router;
export default pageRouter;