//     // controllers/service-category.controller.ts

//     import type { Request, Response ,NextFunction} from "express";
//     import slugify from "slugify";
//     import mongoose from "mongoose";

//     import ServiceCategory from "../../modules/service/service.category.models.js";
//     import { TryCatch } from "../../config/TryCatch.js";
//     import type {CreateServiceCategoryDto,DeleteServiceCategoryDto,UpdateServiceCategoryDto} from '../../types/serviceCategory.js'
    

    
//     //how to create get service category controller
//     export const getServiceCategories = async (req: Request, res: Response) => {
//       try {
//         const categories = await ServiceCategory.aggregate([
//           {
//             $lookup: {
//               from: "services", // collection name
//               localField: "_id",
//               foreignField: "category",
//               as: "services",
//             },
//           },
//           {
//             $sort: {
//               createdAt: -1,
//             },
//           },
//         ]);

//         return res.status(200).json({
//           success: true,
//           data: categories,
//         });
//       } catch (error:any) {
//         return res.status(500).json({
//           success: false,
//           message: error.message,
//         });
//       }
//     };


//     export const createServiceCategory = async (
//       req: Request<{}, {}, CreateServiceCategoryDto>,
//       res: Response
//     ): Promise<void> => {
//       try {
//         const { serviceCategory } = req.body;                     

//         // Validation
//         if (!serviceCategory) {
//           res.status(400).json({
//             success: false,
//             message: "Service category is required.",
//           });
//           return;
//         }

//         // Duplicate Check
//         const exists = await ServiceCategory.findOne({
//           serviceCategory,
//         });

//         if (exists) {
//           res.status(409).json({
//             success: false,
//             message: "Service category already exists.",
//           });
//           return;
//         }

//         // Auto Generate Slug
//         const slug = slugify(serviceCategory, {
//           lower: true,
//           strict: true,
//           trim: true,
//         });

//         const category = await ServiceCategory.create({
//           serviceCategory,
//           slug,
//         });

//         res.status(201).json({
//           success: true,
//           data: category,
//         });
//       } catch (error) {
//         res.status(500).json({
//           success: false,
//           message: "Internal Server Error",
//           error,
//         });
//       }
//     };


// export const deleteCategoryService = async (
//   req: Request<{ id: string }>,  // ✅ Use correct type
//   res: Response,
//   next: NextFunction  // ✅ Add next parameter
// ): Promise<void> => {
//   try {
//     const { id } = req.params;

//     console.log("📝 Deleting category with ID:", id);  // Debug log

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid Category Id.",
//       });
//       return;
//     }

//     // Find Category
//     const category = await ServiceCategory.findById(id);

//     if (!category) {
//       res.status(404).json({
//         success: false,
//         message: "Category not found.",
//       });
//       return;
//     }

//     // ✅ Delete Category
//     await ServiceCategory.findByIdAndDelete(id);

//     console.log("✅ Category deleted successfully:", category.serviceCategory);

//     res.status(200).json({
//       success: true,
//       message: "Category deleted successfully.",
//       data: category,  // ✅ Include deleted data (optional)
//     });
//   } catch (error: any) {
//     console.error("❌ Delete Category Error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };


// export const updateServiceCategory = async (
//   req: Request<{ id: string }, {}, UpdateServiceCategoryDto>,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { serviceCategory } = req.body;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid category id.",
//       });
//       return;
//     }

//     // Validate Input
//     if (!serviceCategory?.trim()) {
//       res.status(400).json({
//         success: false,
//         message: "Service category is required.",
//       });
//       return;
//     }

//     // Check Category Exists
//     const category = await ServiceCategory.findById(id);

//     if (!category) {
//       res.status(404).json({
//         success: false,
//         message: "Category not found.",
//       });
//       return;
//     }

//     // Duplicate Check (Ignore Current Category)
//     const duplicateCategory = await ServiceCategory.findOne({
//       serviceCategory: serviceCategory.trim(),
//       _id: { $ne: id },
//     });

//     if (duplicateCategory) {
//       res.status(409).json({
//         success: false,
//         message: "Service category already exists.",
//       });
//       return;
//     }

//     // Generate New Slug
//     const slug = slugify(serviceCategory, {
//       lower: true,
//       strict: true,
//       trim: true,
//     });

//     // Update
//     category.serviceCategory = serviceCategory.trim();
//     category.slug = slug;

//     await category.save();

//     res.status(200).json({
//       success: true,
//       message: "Category updated successfully.",
//       data: category,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };
// controllers/service-category.controller.ts
import type { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import mongoose from "mongoose";
import ServiceCategory from "../../modules/service/service.category.models.js";
import Service from "../../modules/service/service.model.js";
import { RedisService } from "../../config/redis.js";
import type { 
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
  DeleteServiceCategoryInput 
} from "../../validations/service-category.validation.js";

// Cache Keys
const CACHE_KEYS = {
  ALL_CATEGORIES: 'service_categories:all',
  CATEGORY_BY_ID: (id: string) => `service_category:${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `service_category:slug:${slug}`,
};

// Get Service Categories with Caching
export const getServiceCategories = async (req: Request, res: Response) => {
  try {
    // Create cache key
    const cacheKey = 'service_categories:all';
    
    // Try to get from cache
    const cachedData = await RedisService.get<any>(cacheKey);
    if (cachedData) {
      console.log('📦 Returning cached categories');
      return res.status(200).json({
        success: true,
        data: cachedData,
        fromCache: true
      });
    }

    // Get categories with services count
    const categories = await ServiceCategory.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "category",
          as: "services",
        },
      },
      {
        $addFields: {
          serviceCount: { $size: "$services" }
        }
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    // Cache the result
    await RedisService.set(cacheKey, categories, 3600);

    return res.status(200).json({
      success: true,
      data: categories,
      fromCache: false
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Create Service Category with Cache Invalidation
export const createServiceCategory = async (
  req: Request<{}, {}, { serviceCategory: string }>,
  res: Response
): Promise<void> => {
  try {
    const { serviceCategory } = req.body;

    // Auto Generate Slug
    const slug = slugify(serviceCategory, {
      lower: true,
      strict: true,
      trim: true,
    });

    const category = await ServiceCategory.create({
      serviceCategory,
      slug,
    });

    // Invalidate all categories cache
    await RedisService.clearCachePattern('service_categories:*');
    
    // Cache the new category
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_ID(category._id.toString()), category, 3600);
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_SLUG(category.slug), category, 3600);

    res.status(201).json({
      success: true,
      data: category,
      message: 'Service category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Delete Service Category with Cache Invalidation
export const deleteCategoryService = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find Category
    const category = await ServiceCategory.findById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    // Delete Category (triggers pre-hook for service deletion)
    await ServiceCategory.findByIdAndDelete(id);

    // Clear all related caches
    await Promise.all([
      RedisService.deleteCache(CACHE_KEYS.CATEGORY_BY_ID(id)),
      RedisService.deleteCache(CACHE_KEYS.CATEGORY_BY_SLUG(category.slug)),
      RedisService.clearCachePattern('service_categories:*'),
      RedisService.clearCachePattern('services:*'),
    ]);

    console.log("✅ Category deleted and cache cleared:", category.serviceCategory);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: category,
    });
  } catch (error: any) {
    console.error("❌ Delete Category Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Update Service Category with Cache Invalidation
export const updateServiceCategory = async (
  req: Request<{ id: string }, {}, { serviceCategory: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { serviceCategory } = req.body;

    // Check Category Exists
    const category = await ServiceCategory.findById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    // Duplicate Check (Ignore Current Category)
    const duplicateCategory = await ServiceCategory.findOne({
      serviceCategory: serviceCategory.trim(),
      _id: { $ne: id },
    });

    if (duplicateCategory) {
      res.status(409).json({
        success: false,
        message: "Service category already exists.",
      });
      return;
    }

    // Generate New Slug
    const newSlug = slugify(serviceCategory, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Save old slug for cache invalidation
    const oldSlug = category.slug;

    // Update
    category.serviceCategory = serviceCategory.trim();
    category.slug = newSlug;
    await category.save();

    // Clear all related caches
    await Promise.all([
      RedisService.deleteCache(CACHE_KEYS.CATEGORY_BY_ID(id)),
      RedisService.deleteCache(CACHE_KEYS.CATEGORY_BY_SLUG(oldSlug)),
      RedisService.deleteCache(CACHE_KEYS.CATEGORY_BY_SLUG(newSlug)),
      RedisService.clearCachePattern('service_categories:*'),
    ]);

    // Cache updated category
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_ID(id), category, 3600);
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_SLUG(newSlug), category, 3600);

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Get Single Category by ID with Caching
export const getCategoryById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });
    }

    // Try to get from cache
    const cachedCategory = await RedisService.get<any>(CACHE_KEYS.CATEGORY_BY_ID(id));
    if (cachedCategory) {
      return res.status(200).json({
        success: true,
        data: cachedCategory,
        fromCache: true
      });
    }

    const category = await ServiceCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Cache the result
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_ID(id), category, 3600);

    res.status(200).json({
      success: true,
      data: category,
      fromCache: false
    });
  } catch (error: any) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Category by Slug with Caching
export const getCategoryBySlug = async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;

    // Try to get from cache
    const cachedCategory = await RedisService.get<any>(CACHE_KEYS.CATEGORY_BY_SLUG(slug));
    if (cachedCategory) {
      return res.status(200).json({
        success: true,
        data: cachedCategory,
        fromCache: true
      });
    }

    const category = await ServiceCategory.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Cache the result
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_SLUG(slug), category, 3600);

    res.status(200).json({
      success: true,
      data: category,
      fromCache: false
    });
  } catch (error: any) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};