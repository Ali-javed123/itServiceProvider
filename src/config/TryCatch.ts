import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

export const TryCatch = (handler: RequestHandler): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
};