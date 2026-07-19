import { Router } from "express";
const UserRouter = Router();
import { Register } from "../controller/auth/register.js";
import { upload } from "../config/multer.js";
UserRouter.post("/register", upload.single("image"), Register);
export default UserRouter;
//# sourceMappingURL=User.routes.js.map