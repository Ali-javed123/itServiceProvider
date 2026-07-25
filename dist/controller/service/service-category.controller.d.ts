import type { Request, Response, NextFunction } from "express";
import type { CreateServiceCategoryDto, UpdateServiceCategoryDto } from '../../types/serviceCategory.js';
export declare const getServiceCategories: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createServiceCategory: (req: Request<{}, {}, CreateServiceCategoryDto>, res: Response) => Promise<void>;
export declare const deleteCategoryService: (req: Request<{
    id: string;
}>, // ✅ Use correct type
res: Response, next: NextFunction) => Promise<void>;
export declare const updateServiceCategory: (req: Request<{
    id: string;
}, {}, UpdateServiceCategoryDto>, res: Response) => Promise<void>;
//# sourceMappingURL=service-category.controller.d.ts.map