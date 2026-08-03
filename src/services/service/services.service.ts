
import Service from "../../modules/service/service.model.js";
import ServiceCategory from "../../modules/service/service.category.models.js";
import { uploadImage, deleteImage } from "../../config/imageUploader.js";
import slugify from "slugify";
import { TryCatch } from "../../config/TryCatch.js";
import { RedisService } from "../../config/redis.js";


import type { Request, Response } from "express";



import type { 
ServiceResponse 
} from "../../validations/service.validation.js";


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


const clearServiceCaches = async () => {
  try {
    await RedisService.clearCachePattern('services:*');
  } catch (error) {
    console.error('Error clearing service cache:', error);
  }
};






export const CreateSerice=TryCatch(async(req:Request,res:Response,data:any)=>{
  const { category, title, description, icon, file } = data;
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
      return response;
    
})




export const updateService=TryCatch(async(req:Request,res:Response,data:any)=>{
  const { id, category, title, description, icon } = data;
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
})


export const deleteService=TryCatch(async(req:Request,res:Response,id:any)=>{

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

   } )

export const getServiceByID=TryCatch(async(req:Request,res:Response,id:any)=>{
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
  
})




