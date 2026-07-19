// controllers/service-category.controller.ts

import type { Request, Response } from "express";
import slugify from "slugify";

import ServiceCategory from "../../modules/service/service.category.models.js";
import { TryCatch } from "../../config/TryCatch.js";
export interface CreateServiceCategoryDto {
  serviceCategory: string;
}


//how to create get service category controller
export const getServiceCategory = TryCatch(
  async (req: Request, res: Response) => {
      const servicesCategory = await ServiceCategory.find();
      return res.status(200).json({
      success: true,
      message: "Fetched all service categories successfully",
      count: servicesCategory.length, // Helpful for the frontend
      data: servicesCategory, // ✅ Fixed: Pass the variable, not the Model
    });
  


    
  }


)

export const createServiceCategory = async (
  req: Request<{}, {}, CreateServiceCategoryDto>,
  res: Response
): Promise<void> => {
  try {
    const { serviceCategory } = req.body;

    // Validation
    if (!serviceCategory) {
      res.status(400).json({
        success: false,
        message: "Service category is required.",
      });
      return;
    }

    // Duplicate Check
    const exists = await ServiceCategory.findOne({
      serviceCategory,
    });

    if (exists) {
      res.status(409).json({
        success: false,
        message: "Service category already exists.",
      });
      return;
    }

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

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};