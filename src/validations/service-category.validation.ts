// validations/service-category.validation.ts
import { z } from 'zod';
import { objectIdSchema } from '../middleware/validation.middleware.js';

// Create Service Category Schema - Matches validate() expected structure
export const createServiceCategorySchema = {
  body: z.object({
    serviceCategory: z.string()
      .min(2, 'Service category must be at least 2 characters')
      .max(50, 'Service category must not exceed 50 characters')
      .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Service category can only contain letters, numbers, spaces, hyphens and ampersand')
      .trim()
  })
};

// Update Service Category Schema
export const updateServiceCategorySchema = {
  params: z.object({
    id: objectIdSchema 
  }),
  body: z.object({
    serviceCategory: z.string()
      .min(2, 'Service category must be at least 2 characters')
      .max(50, 'Service category must not exceed 50 characters')
      .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Service category can only contain letters, numbers, spaces, hyphens and ampersand')
      .trim()
  })
};

// Delete Service Category Schema
export const deleteServiceCategorySchema = {
  params: z.object({
    id: objectIdSchema
  })
};

// Get Service Categories Schema
export const getServiceCategoriesSchema = {
  query: z.object({
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    search: z.string().trim().optional()
  })
};

// Type exports for controllers
export type CreateServiceCategoryInput = {
  body: z.infer<typeof createServiceCategorySchema.body>;
};

export type UpdateServiceCategoryInput = {
  params: z.infer<typeof updateServiceCategorySchema.params>;
  body: z.infer<typeof updateServiceCategorySchema.body>;
};

export type DeleteServiceCategoryInput = {
  params: z.infer<typeof deleteServiceCategorySchema.params>;
};