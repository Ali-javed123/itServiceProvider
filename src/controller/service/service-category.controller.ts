    // controllers/service-category.controller.ts

    import type { Request, Response ,NextFunction} from "express";
    import slugify from "slugify";
    import mongoose from "mongoose";

    import ServiceCategory from "../../modules/service/service.category.models.js";
    import { TryCatch } from "../../config/TryCatch.js";
    import type {CreateServiceCategoryDto,DeleteServiceCategoryDto,UpdateServiceCategoryDto} from '../../types/serviceCategory.js'
    

    
    //how to create get service category controller
    export const getServiceCategories = async (req: Request, res: Response) => {
      try {
        const categories = await ServiceCategory.aggregate([
          {
            $lookup: {
              from: "services", // collection name
              localField: "_id",
              foreignField: "category",
              as: "services",
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ]);

        return res.status(200).json({
          success: true,
          data: categories,
        });
      } catch (error:any) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };


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


export const deleteCategoryService = async (
  req: Request<{ id: string }>,  // ✅ Use correct type
  res: Response,
  next: NextFunction  // ✅ Add next parameter
): Promise<void> => {
  try {
    const { id } = req.params;

    console.log("📝 Deleting category with ID:", id);  // Debug log

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid Category Id.",
      });
      return;
    }

    // Find Category
    const category = await ServiceCategory.findById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    // ✅ Delete Category
    await ServiceCategory.findByIdAndDelete(id);

    console.log("✅ Category deleted successfully:", category.serviceCategory);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: category,  // ✅ Include deleted data (optional)
    });
  } catch (error: any) {
    console.error("❌ Delete Category Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export const updateServiceCategory = async (
  req: Request<{ id: string }, {}, UpdateServiceCategoryDto>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { serviceCategory } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category id.",
      });
      return;
    }

    // Validate Input
    if (!serviceCategory?.trim()) {
      res.status(400).json({
        success: false,
        message: "Service category is required.",
      });
      return;
    }

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
    const slug = slugify(serviceCategory, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Update
    category.serviceCategory = serviceCategory.trim();
    category.slug = slug;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};