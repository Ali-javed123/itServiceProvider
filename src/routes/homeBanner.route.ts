import expess from "express";
import { upload } from "../config/multer.js";
import { isAuth } from "../middleware/isAuth.js";
import { createBanner ,getBanner} from "../controller/homeBanner/homeBanner.controller.js";
const HomeBannerouter = expess.Router();

HomeBannerouter.post('/homebanner',isAuth,upload.single('image'),createBanner);
HomeBannerouter.get('/homebanner',isAuth,getBanner);
export default HomeBannerouter
