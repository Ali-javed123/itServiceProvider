import type { Request, Response, NextFunction } from "express";
export interface AuthenticationRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}
export declare const isAuth: (req: AuthenticationRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=isAuth.d.ts.map