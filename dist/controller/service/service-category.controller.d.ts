import type { Request, Response } from "express";
export interface CreateServiceCategoryDto {
    serviceCategory: string;
}
export declare const getServiceCategory: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const createServiceCategory: (req: Request<{}, {}, CreateServiceCategoryDto>, res: Response) => Promise<void>;
//# sourceMappingURL=service-category.controller.d.ts.map