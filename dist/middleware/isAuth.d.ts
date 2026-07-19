import type { Request, NextFunction, Response } from "express";
export interface User extends Document {
    _id: number;
    nama: string;
    email: string;
}
export interface AuthenticationRequest extends Request {
    user?: User | null;
}
export declare const isAuth: (req: AuthenticationRequest | any, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=isAuth.d.ts.map