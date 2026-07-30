// service.route.ts
import {
  createServiceCategory, 
  getServiceCategories, 
  deleteCategoryService,
  updateServiceCategory,
  getCategoryById,
  getCategoryBySlug
} from '../controller/service/service-category.controller.js';

import { Router } from "express";
import { createService } from '../controller/service/service.controller.js';
import { upload } from "../config/multer.js";
import { updateService, deleteService, GetService } from '../controller/service/service.controller.js';
import { isAuth } from "../middleware/isAuth.js";

import { 
  validate, 
  validateFile, 
  commonSchemas 
} from "../middleware/validation.middleware.js";
import { 
  createServiceSchema, 
  updateServiceSchema, 
  serviceQuerySchema,
} from "../validations/service.validation.js";

import { 
  createServiceCategorySchema, 
  updateServiceCategorySchema, 
  deleteServiceCategorySchema,
  getServiceCategoriesSchema 
} from "../validations/service-category.validation.js";

import { z } from 'zod';

const ServiceRouter = Router();
ServiceRouter.use(isAuth);

// ============ SERVICE CATEGORY ROUTES ============

// Create category
ServiceRouter.post(
  "/service-category", 
  isAuth,
  validate(createServiceCategorySchema),
  createServiceCategory
);

// Get all categories with pagination
ServiceRouter.get(
  "/service-category", 
  isAuth,
  // validate(getServiceCategoriesSchema),
  getServiceCategories
);

// Get category by ID
ServiceRouter.get(
  "/service-category/:id",
  isAuth,
  validate({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
    })
  }),
  getCategoryById
);

// Get category by slug
ServiceRouter.get(
  "/service-category/slug/:slug",
  isAuth,
  validate({
    params: z.object({
      slug: z.string().trim().min(1)
    })
  }),
  getCategoryBySlug
);

// Update category
ServiceRouter.put(
  "/service-category/:id",
  isAuth,
  validate(updateServiceCategorySchema),
  updateServiceCategory
);

// Delete category
ServiceRouter.delete(
  "/service-category/:id", 
  isAuth,
  validate(deleteServiceCategorySchema),
  deleteCategoryService
);

// ============ SERVICE ROUTES ============

ServiceRouter.post(
  "/service",
  upload.single("image"),
  validate({
    body: createServiceSchema,
  }),
  validateFile({
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024,
    required: true,
  }),
  (req, res, next) => {
    void createService(req as any, res as any);
  }
);

ServiceRouter.get(
  "/service",
  validate({
    query: serviceQuerySchema
  }),
  GetService
);

ServiceRouter.put(
  "/service/:id",
  upload.single("image"),
  validate({
    params: commonSchemas.idParam,
    body: updateServiceSchema,
  }),
  validateFile({
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024,
    required: false,
  }),
  updateService
);

ServiceRouter.delete(
  "/service/:id",
  validate({
    params: commonSchemas.idParam
  }),
  deleteService
);

export default ServiceRouter;