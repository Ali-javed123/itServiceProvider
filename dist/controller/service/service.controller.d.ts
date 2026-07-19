import type { Request, Response } from "express";
export interface CreateServiceDto {
    category: string;
    title: string;
    icon: string;
    description: string;
}
interface ServiceParams {
    id: string;
}
export declare const createService: (req: Request<{}, {}, CreateServiceDto>, res: Response) => Promise<void>;
export declare const updateService: (req: Request<{
    id: string;
}, {}, CreateServiceDto>, res: Response) => Promise<void>;
export declare const deleteService: (req: Request<ServiceParams>, res: Response) => Promise<void>;
export declare const GetService: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export {};
//# sourceMappingURL=service.controller.d.ts.map