// import type { Request, Response } from "express";
// import mongoose from "mongoose";

// import ServiceSchema from "../../modules/service/service.model.js";
// import ServiceCategory from "../../modules/service/service.category.models.js";
// import Service from "../../modules/service/service.model.js";
// import { uploadImage, deleteImage } from "../../config/imageUploader.js";

// import { generateToken } from "../../middleware/generateToken.js";
// import slugify from "slugify";
// import ServiceModel from "../../modules/service/service.model.js";

// import { TryCatch } from "../../config/TryCatch.js";






// export interface CreateServiceDto {
//   category: string;
//   title: string;
//   icon: string;
//   description: string;

// }
// interface ServiceParams {
//   id: string;
// }




// export const createService = async (
//   req: Request<{}, {}, CreateServiceDto>,
//   res: Response
// ): Promise<void> => {
//   try {
//       console.log("Controller Hit");

//     const { category, title, description, icon } = req.body;

//     // ==========================
//     // Validation
//     // ==========================
//     if (!category || !title || !description || !icon) {
//       res.status(400).json({
//         success: false,
//         message: "All fields are required.",
//       });
//       return;
//     }

//     if (!req.file) {
//       res.status(400).json({
//         success: false,
//         message: "Service image is required.",
//       });
//       return;
//     }
// const titleExists = await Service.findOne({
//   title: title.trim(),
// });

//     if(titleExists){
//       res.status(400).json({
//         success: false,
//         message: "Service  already exists.",
//       });
//       return;
//     }

//     // ==========================
//     // ObjectId Validation
//     // ==========================
//     if (!mongoose.Types.ObjectId.isValid(category)) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid Service Category Id.",
//       });
//       return;
//     }

//     // ==========================
//     // Category Exists
//     // ==========================
//     const categoryExists = await ServiceCategory.findById(category);

//     if (!categoryExists) {
//       res.status(404).json({
//         success: false,
//         message: "Service Category not found.",
//       });
//       return;
//     }

//     // ==========================
//     // Duplicate Check
//     // ==========================
//     const alreadyExists = await Service.findOne({
//       title,
//       category,
//     });

//     if (alreadyExists) {
//       res.status(409).json({
//         success: false,
//         message: "Service already exists in this category.",
//       });
//       return;
//     }

//     // ==========================
//     // Generate Slug
//     // ==========================
//     const slug = slugify(title, {
//       lower: true,
//       strict: true,
//       trim: true,
//     });

//     // ==========================
//     // Upload Image
//     // ==========================
//     const uploadedImage = await uploadImage(req.file);

//     // ==========================
//     // Save Service
//     // ========================== 
//     const service = await Service.create({
//       category: categoryExists._id,
//       title,
//       description,
//       icon,
//       slug,
//       image: {
//         url: uploadedImage.url,
//         public_id: uploadedImage.public_id,
//       },
//     });

//     // ==========================
//     // Populate Category
//     // ==========================
//     const response = await Service.findById(service._id).populate({
//       path: "category",
//       select: "serviceCategory slug",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Service created successfully.",
//       data: response,
//     });
//   } catch (error) {
//     console.error(error);

//       res.status(500).json({
//     success: false,
//     error: String(error),
//   });

//   }
// };



// export const updateService = async (
//   req: Request<{ id: string }, {}, CreateServiceDto>,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { category, title, description, icon } = req.body;

//     // Check Service Exists
//     const service = await Service.findById(id);

//     if (!service) {
//       res.status(404).json({
//         success: false,
//         message: "Service not found.",
//       });
//       return;
//     }

//     // Update Category
//     if (category) {
//       if (!mongoose.Types.ObjectId.isValid(category)) {
//         res.status(400).json({
//           success: false,
//           message: "Invalid Service Category Id.",
//         });
//         return;
//       }

//       const categoryExists = await ServiceCategory.findById(category);

//       if (!categoryExists) {
//         res.status(404).json({
//           success: false,
//           message: "Service Category not found.",
//         });
//         return;
//       }

                
//       service.category = categoryExists._id;
//     }

//     // Duplicate Check
//     if (title) {
//       const alreadyExists = await Service.findOne({
//         title,
//         category: service.category,
//         _id: { $ne: id },
//       });

//       if (alreadyExists) {
//         res.status(409).json({
//           success: false,
//           message: "Service already exists in this category.",
//         });
//         return;
//       }
      

//       service.title = title;

//       service.slug = slugify(title, {
//         lower: true,
//         strict: true,
//         trim: true,
//       });
//     }

//     // Update Description
//     if (description) {
//       service.description = description;
//     }

//     // Update Icon
//     if (icon) {
//       service.icon = icon;
//     }

//     // Update Image
//     if (req.file) {
//       if (service.image?.public_id) {
//         await deleteImage(service.image.public_id);
//       }

//       const uploadedImage = await uploadImage(req.file);

//       service.image = {
//         url: uploadedImage.url,
//         public_id: uploadedImage.public_id,
//       };
//     }

//     await service.save();

//     const response = await Service.findById(service._id).populate({
//       path: "category",
//       select: "serviceCategory slug",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Service updated successfully.",
//       data: response,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error.",
//       error,
//     });
//   }
// };


// export const deleteService = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params as { id?: string };

//     if (!id) {
//       res.status(400).json({
//         success: false,
//         message: "Service id is required.",
//       });
//       return;
//     }

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid Service Id.",
//       });
//       return;
//     }

//     // Find Service
//     const service = await Service.findById(id);

//     if (!service) {
//       res.status(404).json({
//         success: false,
//         message: "Service not found.",
//       });
//       return;
//     }

//     // Delete Cloudinary Image
//     if (service.image?.public_id) {
//       await deleteImage(service.image.public_id);
//     }

//     // Delete Service
//     await Service.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: "Service deleted successfully.",
//     });
//   } catch (error: any) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };
// export const GetService=TryCatch(
//   async (req: Request, res: Response) => {
//     const services = await ServiceModel.find();


//     res.status(200).json({
//       success: true,
//       message: "Services fetched successfully.",
//       data: services,
//     });

//   })

// src/controller/service/service.controller.ts
// service.controller.ts
import type { Request, Response } from "express";
import mongoose from "mongoose";
import Service from "../../modules/service/service.model.js";
import ServiceCategory from "../../modules/service/service.category.models.js";
import slugify from "slugify";
import { TryCatch } from "../../config/TryCatch.js";
import { RedisService } from "../../config/redis.js";
import type { 
  CreateServiceInput, 
  UpdateServiceInput, 
  ServiceQuery,
  ServiceResponse 
} from "../../validations/service.validation.js";


import { CreateSerice ,updateService,deleteService,getServiceByID} from "../../services/service/services.service.js";
import type {CreateServiceRequest} from "../../types/service.type.js";
// ==========================
// Type Definitions - FIXED
// ==========================

// Make file optional with proper typing

interface UpdateServiceRequest extends Request {
  params: { id: string };
  body: UpdateServiceInput;
  file?: Express.Multer.File; // Optional
}

// Use Record for query to avoid type conflicts
interface GetServiceRequest extends Request {
  query: Record<string, any>;
}

interface DeleteServiceRequest extends Request {
  params: { id: string };
}

// ==========================
// Cache Keys Helper
// ==========================

const getCacheKeys = {
  service: (id: string) => `service:${id}`,
  services: (query: any) => {
    const key = `services:${JSON.stringify(query)}`;
    return key;
  },
  serviceList: (page: number, limit: number, search: string = '', category: string = '') => {
    return `services:page=${page}:limit=${limit}:search=${search}:category=${category}`;
  }
};

// ==========================
// Helper function to clear service caches
// ==========================

const clearServiceCaches = async () => {
  try {
    await RedisService.clearCachePattern('services:*');
  } catch (error) {
    console.error('Error clearing service cache:', error);
  }
};

// ==========================
// Create Service
// ==========================

export const createService = async (
  req: CreateServiceRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("Controller Hit - Create Service");

    const { category, title, description, icon } = req.body;
    const data={
      category,
      title,
      description,
      icon,
      file:req.file

    }
    const response = await CreateSerice(req,res,data as any);

    // Check if service exists
    
    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: response,
    });
  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: String(error),
    });
  }
};

// ==========================
// Update Service
// ==========================

export const updateController = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { category, title, description, icon} = req.body;
    const data={
      category,
      title,
      description,
      icon,
      file:req.file,
      id

    }
    const response = await updateService(req,res,data as any);
    // Check Service Exists
    

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: response,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: String(error),
    });
  }
};


// ==========================
// Delete Service
// ==========================


export const deleteController = async (
  req: DeleteServiceRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    deleteService(req,res,id as any);
    // Find Service
    

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error: any) {
    console.error("Delete Service Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete service",
    });
  }
};

// ==========================
// Get Service by ID (with caching)
// ==========================

export const getServiceById = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
   const service = await getServiceByID(req,res,id as any);

    // Check Cache First```
    
    res.status(200).json({
      success: true,
      message: "Service fetched successfully.",
      data: service,
    });
  }
);

// ==========================
// Get All Services (with caching and pagination)
// ==========================

export const GetService=TryCatch(
  async (req: Request, res: Response) => {
      const services = await Service.find();


    res.status(200).json({
      success: true,
      message: "Services fetched successfully.",
      data: services,
    });

    

  })

// ==========================
// Bulk Delete Services
// ==========================



// ==========================
// Bulk Update Services Status
// ==========================

