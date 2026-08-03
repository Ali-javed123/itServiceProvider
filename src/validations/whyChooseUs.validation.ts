// src/validations/whyChooseUs.validation.ts

import { z } from 'zod';
import { commonSchemas } from '../middleware/validation.middleware.js';

// ==========================
// Feature Schema
// ==========================

export const featureSchema = z.object({
  icon: z.string()
    .min(1, 'Icon is required')
    .max(50, 'Icon must be less than 50 characters')
    .trim(),
  title: z.string()
    .min(3, 'Feature title must be at least 3 characters')
    .max(100, 'Feature title must be less than 100 characters')
    .trim(),
});

// ==========================
// Why Choose Us Schemas
// ==========================

// Create Why Choose Us Schema
export const createWhyChooseUsSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  heading: z.string()
    .min(3, 'Heading must be at least 3 characters')
    .max(200, 'Heading must be less than 200 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
  subHeading: z.string()
    .min(3, 'Sub heading must be at least 3 characters')
    .max(200, 'Sub heading must be less than 200 characters')
    .trim(),
  btnText: z.string()
    .min(2, 'Button text must be at least 2 characters')
    .max(50, 'Button text must be less than 50 characters')
    .trim(),
  featured: z.union([
    z.array(featureSchema), // Handle as array
    z.string().transform((val) => { // Handle as string (from FormData)
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    })
  ]).pipe(z.array(featureSchema).min(1, 'At least one feature is required').max(10, 'Maximum 10 features allowed')),
});

// Update Why Choose Us Schema (Partial)
export const updateWhyChooseUsSchema = createWhyChooseUsSchema.partial();

// Get Why Choose Us Query Schema
export const getWhyChooseUsQuerySchema = z.object({
  page: z.coerce.number()
    .int()
    .positive()
    .default(1)
    .optional(),
  limit: z.coerce.number()
    .int()
    .positive()
    .max(100)
    .default(10)
    .optional(),
  search: z.string().trim().optional(),
});

// ID Param Schema
export const idParamSchema = z.object({
  id: commonSchemas.idParam.shape.id,
});

// ==========================
// Type Exports
// ==========================

export type CreateWhyChooseUsInput = z.infer<typeof createWhyChooseUsSchema>;
export type UpdateWhyChooseUsInput = z.infer<typeof updateWhyChooseUsSchema>;
export type WhyChooseUsQuery = z.infer<typeof getWhyChooseUsQuerySchema>;