import * as express from "express";
import { googleAuthScope, googleAuth } from "../controllers/authController";
import { signJwt } from "../middlewares/signJwt";

const router = express.Router();

//http://localhost:5000/auth


//-------------Routers For Google Auth------------------------
router.get("/google", googleAuthScope )
router.get("/google/callback", googleAuth, signJwt)


const authRouter = router;
export default authRouter;