import { Router } from "express";
import { createPage ,updatePage,deletePage,getAllPages,getPageById} from "../controller/service/aboutus.controller.js";
import { upload } from "../config/multer.js";
import { isAuth } from "../middleware/isAuth.js";

const AboutRouter = Router();
AboutRouter.get("/aboutus",isAuth,getAllPages);
AboutRouter.get("/aboutus/:id",getPageById);
AboutRouter.post(
  "/aboutus",
  upload.fields([
    { name: "image_one", maxCount: 1 },
    { name: "image_two", maxCount: 1 },
  ]),
  createPage
);
AboutRouter.put(
  "/aboutus/:id",
  upload.fields([
    { name: "image_one", maxCount: 1 },
    { name: "image_two", maxCount: 1 },
  ]),
  updatePage
);
AboutRouter.delete("/aboutus/:id",deletePage);
export default AboutRouter;