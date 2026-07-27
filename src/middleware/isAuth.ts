// middleware/isAuth.ts
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
): void => {  // ✅ void return type
  try {
    const authHeader = req.headers.authorization;

    console.log("🔐 Auth Header:", authHeader); // Debug log

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token is required.",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    if (!decoded || !decoded.id) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email || "",
    };

    console.log("✅ User authenticated:", req.user); // Debug log
    next();
  } catch (error: any) {
    console.error("❌ Auth Error:", error.message);
    
    // ✅ Specific error messages
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
      return;
    }
    
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: "Authentication failed. Please login.",
    });
  }
};