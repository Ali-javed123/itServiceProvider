// src/validations/service.validation.ts
import { z } from 'zod';
import { objectIdSchema, validators, commonSchemas, paginationSchema } from '../middleware/validation.middleware.js';

// ==========================
// Service Validation Schemas
// ==========================

// Create Service Schema
export const createServiceSchema = z.object({
  category: objectIdSchema,
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  icon: validators.nonEmptyString.max(50, 'Icon must be less than 50 characters'),
  slug: validators.slug.optional(),
});

// Update Service Schema (Partial)
export const updateServiceSchema = createServiceSchema.partial();

// Service Query Schema (Extended Pagination)
export const serviceQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  category: objectIdSchema.optional(),
  status: z.enum(['active', 'inactive']).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

// Bulk Service Update
export const bulkServiceSchema = commonSchemas.bulkIds.extend({
  data: updateServiceSchema,
});

// Service Response Schema
export const serviceResponseSchema = z.object({
  _id: objectIdSchema,
  category: objectIdSchema,
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  slug: z.string(),
  image: z.object({
    url: z.string().url(),
    public_id: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ==========================
// Type Exports
// ==========================

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceQuery = z.infer<typeof serviceQuerySchema>;
export type BulkServiceInput = z.infer<typeof bulkServiceSchema>;
export type ServiceResponse = z.infer<typeof serviceResponseSchema>;