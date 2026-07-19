// import type { Request,NextFunction, Response } from "express"
// import jwt, { type JwtPayload } from "jsonwebtoken";
// export interface User extends Document{
//     _id:number,
//     nama:string
//     email:string
// }
// export interface AuthenticationRequest extends Request{
// user?:User |null
// }
import jwt, {} from "jsonwebtoken";
export const isAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login.",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
//# sourceMappingURL=isAuth.js.map