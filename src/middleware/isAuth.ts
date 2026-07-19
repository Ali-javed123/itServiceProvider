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


// export const isAuth=async(req:AuthenticationRequest | any,res:Response,next:NextFunction)=>{
//     try {
//         const authHeader=req.headers.authorization;
//                 console.log("Authorization Header:", req.headers.authorization);

//         if(!authHeader || !authHeader.startsWith("Bearer ")){
//             res.status(401).json({message:"unauthorized please login"}) 
            
//         }
//         const token=authHeader.split(" ")[1] as any;
//         const decodedValue=jwt.verify(token,process.env.JWT_SECRET as string ) as JwtPayload;
//         if(!decodedValue || !decodedValue.user){
//             res.status(401).json({message:"Invalid token"}) 
//         }
//         req.user=decodedValue.user;
//         next();

// }catch (error) {
//     res.status(401).json({message:"unauthorized please login"})
// }
// }

import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticationRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const isAuth = (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};