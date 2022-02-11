import * as express from 'express'
import { createUser, logoutUser} from '../controllers/userController';
import { registrationValidation, checkErrorsForRegister  } from '../middlewares/registerValidation';



//http://localhost:5000//user/
const router = express.Router();


router.post('/register', registrationValidation, checkErrorsForRegister, createUser)
router.get('/logout', logoutUser )




const pageRouter = router;
export default pageRouter;