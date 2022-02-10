import * as express from 'express'
import { verifyToken } from '../middlewares/verifyToken';
import { addFilm } from '../controllers/filmController';




//http://localhost:5000//film/
const router = express.Router();


router.post('/add-film', verifyToken, addFilm)
router.get('/all-film', verifyToken)




const filmRouter = router;
export default filmRouter;