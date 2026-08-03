// services/service-category.service.ts

import slugify from "slugify";
import mongoose from "mongoose";
import ServiceCategory from "../../modules/service/service.category.models.js";
import Service from "../../modules/service/service.model.js";
import { RedisService } from "../../config/redis.js";

// Cache Keys
const CACHE_KEYS = {
  ALL_CATEGORIES: 'service_categories:all',
  CATEGORY_BY_ID: (id: string) => `service_category:${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `service_category:slug:${slug}`,
};

// export const ServiceCategoryService = {
  /**
   * Get all service categories with service count
   */
 export  const  getAllCategories=async()=> {
    const cacheKey = CACHE_KEYS.ALL_CATEGORIES;
    
    // Check cache
    const cached = await RedisService.get<any>(cacheKey);
    if (cached) {
      console.log('📦 Returning cached categories');
      return { data: cached, fromCache: true };
    }

    // Fetch from database
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
        $sort: { createdAt: -1 }
      },
    ]);

    // Cache the result
    await RedisService.set(cacheKey, categories, 3600);
    
    return { data: categories, fromCache: false };
  }

  /**
   * Create a new service category
   */
  export  const  CreateCategories=async(serviceCategory: string) =>{
    // Validate
    if (!serviceCategory?.trim()) {
      throw new Error("Service category is required.");
    }

    // Check duplicate
    const exists = await ServiceCategory.findOne({ serviceCategory: serviceCategory.trim() });
    if (exists) {
      throw new Error("Service category already exists.");
    }

    // Generate slug
    const slug = slugify(serviceCategory, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Create category
    const category = await ServiceCategory.create({
      serviceCategory: serviceCategory.trim(),
      slug,
    });

    // Invalidate cache
    await RedisService.clearCachePattern('service_categories:*');
    
    // Cache new category
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_ID(category._id.toString()), category, 3600);
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_SLUG(category.slug), category, 3600);

    return category;
  }

  /**
   * Get single category by ID
   */
  export  const  CreateCategoriesById=async(id: string)=> {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    // Check cache
    const cached = await RedisService.get<any>(CACHE_KEYS.CATEGORY_BY_ID(id));
    if (cached) {
      return { data: cached, fromCache: true };
    }

    const category = await ServiceCategory.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    // Cache the result
    await RedisService.set(CACHE_KEYS.CATEGORY_BY_ID(id), category, 3600);
    
    return { data: category, fromCache: false };
  }

  /**
   * Get category by slug
   */
  

  /**
   * Update category by ID
   */
export  const  updateCategory=async(id: string , serviceCategory: any)=> {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    // Validate input
    if (!serviceCategory?.trim()) {
      throw new Error("Service category is required.");
    }

    // Find category
    const category = await ServiceCategory.findById(id);
    if (!category) {
      throw new Error("Category not found.");
    }

    // Duplicate check (ignore current category)
    const duplicateCategory = await ServiceCategory.findOne({
      serviceCategory: serviceCategory.trim(),
      _id: { $ne: id },
    });
    if (duplicateCategory) {
      throw new Error("Service category already exists.");
    }

    // Save old slug for cache invalidation
    const oldSlug = category.slug;
    
    // Generate new slug
    const newSlug = slugify(serviceCategory, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Update category
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

    return category;
  }

  /**
   * Delete category by ID
   */
 export const  deleteCategory=async(id: string) =>{
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    // Find category
    const category = await ServiceCategory.findById(id);
    if (!category) {
      throw new Error("Category not found.");
    }

    // Delete category (pre-hook will handle service deletion)
    await ServiceCategory.findByIdAndDelete(id);

    // Clear all related caches
    await Promise.all([
      RedisService.deleteCache(CACHE_KEYS.CATEGORY_BY_ID(id)),
      RedisService.deleteCache(CACHE_KEYS.CATEGORY_BY_SLUG(category.slug)),
      RedisService.clearCachePattern('service_categories:*'),
      RedisService.clearCachePattern('services:*'),
    ]);

    return category;
  }
// };