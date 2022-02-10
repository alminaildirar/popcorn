import * as express from "express";
import { googleAuthScope, googleAuth, facebookAuth, facebookAuthScope } from "../controllers/authController";
import { signJwt } from "../middlewares/signJwt";

const router = express.Router();

//http://localhost:5000/auth


//-------------Routers For Google Auth------------------------
router.get("/google", googleAuthScope )
router.get("/google/callback", googleAuth, signJwt)

//-------------Routers For Facebook Auth----------------------
router.get("/facebook", facebookAuthScope);
router.get("/facebook/callback", facebookAuth, signJwt);


const authRouter = router;
export default authRouter;