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
import { uploadImage, deleteImage } from "../../config/imageUploader.js";
import slugify from "slugify";
import { TryCatch } from "../../config/TryCatch.js";
import { RedisService } from "../../config/redis.js";
import type { 
  CreateServiceInput, 
  UpdateServiceInput, 
  ServiceQuery,
  ServiceResponse 
} from "../../validations/service.validation.js";

// ==========================
// Type Definitions - FIXED
// ==========================

// Make file optional with proper typing
interface CreateServiceRequest extends Request {
  body: CreateServiceInput;
  file?: Express.Multer.File; // Optional
}

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

    // Check if service exists
    const titleExists = await Service.findOne({
      title: title.trim(),
    });

    if (titleExists) {
      res.status(400).json({
        success: false,
        message: "Service already exists.",
      });
      return;
    }

    // Check Category Exists
    const categoryExists = await ServiceCategory.findById(category);

    if (!categoryExists) {
      res.status(404).json({
        success: false,
        message: "Service Category not found.",
      });
      return;
    }

    // Check Duplicate in Category
    const alreadyExists = await Service.findOne({
      title,
      category,
    });

    if (alreadyExists) {
      res.status(409).json({
        success: false,
        message: "Service already exists in this category.",
      });
      return;
    }

    // Generate Slug
    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Upload Image - with null check
    let uploadedImage = null;
    if (req.file) {
      uploadedImage = await uploadImage(req.file as any);
    }

    // Save Service
    const serviceData: any = {
      category: categoryExists._id,
      title,
      description,
      icon,
      slug,
    };

    if (uploadedImage) {
      serviceData.image = {
        url: uploadedImage.url,
        public_id: uploadedImage.public_id,
      };
    }

    const service = await Service.create(serviceData);

    // Populate Category
    const response = await Service.findById(service._id).populate({
      path: "category",
      select: "serviceCategory slug",
    });

    // Cache the new service
    if (response) {
      const cacheKey = getCacheKeys.service(service._id.toString());
      await RedisService.set(cacheKey, response, 3600);
      
      // Invalidate service list cache
      await clearServiceCaches();
    }

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

export const updateService = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { category, title, description, icon } = req.body;

    // Check Service Exists
    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found.",
      });
      return;
    }

    // Update Category
    if (category) {
      const categoryExists = await ServiceCategory.findById(category);

      if (!categoryExists) {
        res.status(404).json({
          success: false,
          message: "Service Category not found.",
        });
        return;
      }

      service.category = categoryExists._id;
    }

    // Check Duplicate if Title Changes
    if (title) {
      const alreadyExists = await Service.findOne({
        title,
        category: service.category,
        _id: { $ne: id },
      });

      if (alreadyExists) {
        res.status(409).json({
          success: false,
          message: "Service already exists in this category.",
        });
        return;
      }

      service.title = title;
      service.slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    // Update Description
    if (description) {
      service.description = description;
    }

    // Update Icon
    if (icon) {
      service.icon = icon;
    }

    // Update Image - with null check
    if (req.file) {
      if (service.image?.public_id) {
        await deleteImage(service.image.public_id);
      }

      const uploadedImage = await uploadImage(req.file);

      service.image = {
        url: uploadedImage.url,
        public_id: uploadedImage.public_id,
      };
    }

    await service.save();

    // Populate Category
    const response = await Service.findById(service._id).populate({
      path: "category",
      select: "serviceCategory slug",
    });

    // Update Cache
    if (response) {
      const cacheKey = getCacheKeys.service(id);
      await RedisService.set(cacheKey, response, 3600);
      
      // Invalidate service list cache
      await clearServiceCaches();
    }

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

export const deleteService = async (
  req: DeleteServiceRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find Service
    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found.",
      });
      return;
    }

    // Delete Cloudinary Image
    if (service.image?.public_id) {
      await deleteImage(service.image.public_id);
    }

    // Delete Service
    await Service.findByIdAndDelete(id);

    // Delete from Cache
    const cacheKey = getCacheKeys.service(id);
    await RedisService.deleteCache(cacheKey);
    
    // Invalidate service list cache
    await clearServiceCaches();

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

    // Check Cache First
    const cacheKey = getCacheKeys.service(id);
    const cachedService = await RedisService.get<ServiceResponse>(cacheKey);

    if (cachedService) {
      res.status(200).json({
        success: true,
        message: "Service fetched from cache.",
        data: cachedService,
      });
      return;
    }

    // Get from Database
    const service = await Service.findById(id).populate({
      path: "category",
      select: "serviceCategory slug",
    });

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found.",
      });
      return;
    }

    // Cache the result
    await RedisService.set(cacheKey, service, 3600);

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

export const GetService = TryCatch(
  async (req: GetServiceRequest, res: Response): Promise<void> => {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      category = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      minPrice,
      maxPrice                                                
    } = req.query;

    // Build Cache Key
    const cacheKey = getCacheKeys.serviceList(
      Number(page),
      Number(limit),
      search as string,
      category as string
    );

    // Check Cache First
    const cachedData = await RedisService.get<{
      data: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(cacheKey);

    if (cachedData) {
      res.status(200).json({
        success: true,
        message: "Services fetched from cache.",
        data: cachedData,
      });
      return;
    }

    // Build Query
    const query: any = {};
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Get Total Count
    const total = await Service.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    // Build Sort
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Get Services
    const services = await Service.find(query)
      .populate({
        path: "category",
        select: "serviceCategory slug",
      })
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Prepare Response
    const result = {
      data: services,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      currentPage: Number(page),
    };

    // Cache the Result
    await RedisService.set(cacheKey, result, 3600);

    res.status(200).json({
      success: true,
      message: "Services fetched successfully.",
      data: result,
    });
  }
);

// ==========================
// Bulk Delete Services
// ==========================

export const bulkDeleteServices = TryCatch(
  async (req: Request<{}, {}, { ids: string[] }>, res: Response): Promise<void> => {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: "No service IDs provided.",
      });
      return;
    }

    // Validate all IDs
    const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      res.status(400).json({
        success: false,
        message: "Invalid service IDs provided.",
        invalidIds,
      });
      return;
    }

    // Find services
    const services = await Service.find({ _id: { $in: ids } });

    if (services.length === 0) {
      res.status(404).json({
        success: false,
        message: "No services found.",
      });
      return;
    }

    // Delete images from Cloudinary
    for (const service of services) {
      if (service.image?.public_id) {
        await deleteImage(service.image.public_id);
      }
    }

    // Delete services
    await Service.deleteMany({ _id: { $in: ids } });

    // Clear cache for each service
    for (const id of ids) {
      const cacheKey = getCacheKeys.service(id);
      await RedisService.deleteCache(cacheKey);
    }
    
    // Clear service list cache
    await clearServiceCaches();

    res.status(200).json({
      success: true,
      message: `${services.length} services deleted successfully.`,
    });
  }
);

// ==========================
// Bulk Update Services Status
// ==========================

export const bulkUpdateServices = TryCatch(
  async (req: Request<{}, {}, { ids: string[]; data: UpdateServiceInput }>, res: Response): Promise<void> => {
    const { ids, data } = req.body;

    if (!ids || ids.length === 0) {
      res.status(400).json({
        success: false,
        message: "No service IDs provided.",
      });
      return;
    }

    if (!data || Object.keys(data).length === 0) {
      res.status(400).json({
        success: false,
        message: "No update data provided.",
      });
      return;
    }

    // Validate all IDs
    const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      res.status(400).json({
        success: false,
        message: "Invalid service IDs provided.",
        invalidIds,
      });
      return;
    }

    // Update services
    const updateData: any = { ...data };
    if (data.title) {
      updateData.slug = slugify(data.title, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    const result = await Service.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );

    // Clear cache for each service
    for (const id of ids) {
      const cacheKey = getCacheKeys.service(id);
      await RedisService.deleteCache(cacheKey);
    }
    
    // Clear service list cache
    await clearServiceCaches();

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} services updated successfully.`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
    });
  }
);