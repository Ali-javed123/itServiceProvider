import { Router } from "express";

const UserRouter = Router();

import { Register } from "../controller/auth/register.js";
import { upload } from "../config/multer.js";
import { Login, profileGet, VerifyLoginOtp,profileUpdate } from "../controller/auth/login.js";
import { VerifyOtp ,ResendOtp} from "../controller/VerifyOtp.js";
import { isAuth } from "../middleware/isAuth.js";

UserRouter.post(
    "/register",
    upload.single("image"),
    Register
);
UserRouter.post(
    "/login",
    Login
);


UserRouter.post("/verify-otp", VerifyLoginOtp);
UserRouter.post("/resend-otp", VerifyOtp);

UserRouter.get("/profile/:id", profileGet);
UserRouter.put(
  "/profile/:id",
  isAuth,                   // 1st - Authenticate first
  upload.single("image"),   // 2nd - Handle file upload
  profileUpdate             // 3rd - Update profile (req.user is now available)
);

export  {   UserRouter as UserRoutes};