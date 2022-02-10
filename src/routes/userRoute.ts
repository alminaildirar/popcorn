import * as express from 'express'
import { createUser} from '../controllers/userController';



//http://localhost:5000//user/
const router = express.Router();


router.post('/register', createUser)



const pageRouter = router;
export default pageRouter;