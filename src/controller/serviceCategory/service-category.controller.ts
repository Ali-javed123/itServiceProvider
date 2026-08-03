// controllers/service-category.controller.ts

import type { Request, Response } from "express";
import { getAllCategories,CreateCategories,deleteCategory,updateCategory,CreateCategoriesById } from "../../services/serviceCategory/service.category.js";
import { TryCatch } from "../../config/TryCatch.js";

/**
 * Get all service categories
 */
export const getServiceCategories = TryCatch(async (req: Request, res: Response) => {
  const result = await getAllCategories();
  
  res.status(200).json({
    success: true,
    data: result.data,
    fromCache: result.fromCache
  });
});

/**
 * Create a new service category
 */
export const createServiceCategory = TryCatch(async (req: Request, res: Response) => {
  const { serviceCategory } = req.body;
  
  const category = await CreateCategories(serviceCategory);
  
  res.status(201).json({
    success: true,
    data: category,
    message: "Service category created successfully"
  });
});

/**
 * Get single category by ID
 */
export const getCategoryByID = TryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await CreateCategoriesById(id as string);
  
  res.status(200).json({
    success: true,
    data: result.data,
    fromCache: result.fromCache
  });
});

/**
 * Get category by slug
 */


/**
 * Update service category
 */
export const updateServiceCategory = TryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { serviceCategory } = req.body;
  
  const updatedCategory = await updateCategory(id as string, serviceCategory);
  
  res.status(200).json({
    success: true,
    data: updatedCategory,
    message: "Category updated successfully"
  });
});

/**
 * Delete service category
 */
export const deleteCategoryService = TryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const deletedCategory = await deleteCategory(id as string);
  
  res.status(200).json({
    success: true,
    data: deletedCategory,
    message: "Category deleted successfully"
  });
});