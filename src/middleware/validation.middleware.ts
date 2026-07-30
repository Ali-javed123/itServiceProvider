// src/middleware/validation.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { Types } from 'mongoose';

// ==========================
// Type Definitions
// ==========================

type ValidationSchemas = {
  body?: any;
  query?: any;
  params?: any;
  file?: any;
};

// Extend Request with validated data
declare global {
  namespace Express {
    interface Request {
      validated?: {
        body?: any;
        query?: any;
        params?: any;
        file?: any;
      };
    }
  }
}

// ==========================
// Base Validation Schemas (Reusable)
// ==========================

// MongoDB ObjectId Validation
export const objectIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  {
    message: 'Invalid MongoDB ObjectId format',
  }
);

// Pagination Schema (Global)
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search Schema (Global)
export const searchSchema = z.object({
  search: z.string().trim().optional(),
  searchFields: z.array(z.string()).optional(),
});

// Date Range Schema (Global)
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ==========================
// Global Validation Middleware
// ==========================

/**
 * Global validation middleware with type inference
 * Supports body, query, params, and file validation
 * Uses Object.assign instead of direct assignment
 */
export const validate = (schemas: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData: any = {};

      // Validate body
      if (schemas.body) {
        const parsedBody = await schemas.body.parseAsync(req.body);
        // Use Object.assign instead of direct assignment
        Object.assign(req, { body: parsedBody });
        validatedData.body = parsedBody;
      }

      // Validate query - create a new object instead of assigning
      if (schemas.query) {
        const parsedQuery = await schemas.query.parseAsync(req.query);
        // Replace query by creating a new object
        req.query = { ...parsedQuery };
        validatedData.query = parsedQuery;
      }

      // Validate params
      if (schemas.params) {
        const parsedParams = await schemas.params.parseAsync(req.params);
        // Use Object.assign instead of direct assignment
        Object.assign(req, { params: parsedParams });
        validatedData.params = parsedParams;
      }

      // Validate file
      if (schemas.file) {
        const parsedFile = await schemas.file.parseAsync(req.file);
        validatedData.file = parsedFile;
      }

      // Store validated data
      req.validated = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: formattedErrors,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(error);
    }
  };
};

// ==========================
// File Validation Middleware
// ==========================

export const validateFile = (options: {
  allowedTypes?: string[];
  maxSize?: number;
  required?: boolean;
} = {}) => {
  const {
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize = 5 * 1024 * 1024, // 5MB
    required = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const file = req.file;

    // Check if file is required
    if (required && !file) {
      res.status(400).json({
        success: false,
        message: 'File is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // If no file and not required, skip validation
    if (!file) {
      next();
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(file.mimetype)) {
      res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      res.status(400).json({
        success: false,
        message: `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};

// ==========================
// Conditional Validation
// ==========================

export const validateIf = (condition: (req: Request) => boolean, schema: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (condition(req)) {
      try {
        const parsedBody = await schema.parseAsync(req.body);
        Object.assign(req, { body: parsedBody });
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          }));

          res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors,
          });
          return;
        }
        next(error);
        return;
      }
    }
    next();
  };
};

// ==========================
// Custom Validators (Reusable)
// ==========================

export const validators = {
  // Email validation
  email: z.string().email('Invalid email format'),

  // Phone number validation
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),

  // URL validation
  url: z.string().url('Invalid URL'),

  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  // Slug validation
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),

  // Array of ObjectIds
  objectIds: z.array(objectIdSchema),

  // Non-empty string
  nonEmptyString: z.string().min(1, 'Field cannot be empty').trim(),
};

// ==========================
// Common Request Schemas
// ==========================

export const commonSchemas = {
  // ID param
  idParam: z.object({
    id: objectIdSchema,
  }),

  // Slug param
  slugParam: z.object({
    slug: z.string().trim().min(1),
  }),

  // Pagination with search
  paginatedSearch: paginationSchema.merge(searchSchema),

  // Date range with pagination
  dateRangePaginated: paginationSchema.merge(dateRangeSchema),

  // Bulk IDs
  bulkIds: z.object({
    ids: z.array(objectIdSchema).min(1, 'At least one ID is required'),
  }),

  // Status update
  statusUpdate: z.object({
    status: z.enum(['active', 'inactive', 'draft', 'archived']),
  }),
};

// ==========================
// Type Exports
// ==========================

export type ValidationSchemasType = ValidationSchemas;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;