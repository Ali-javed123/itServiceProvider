import type { Request, Response } from "express";
import { TryCatch } from "../../config/TryCatch.js";
import  {ChooseUs} from "../../modules/whyChooseUS/whyChooseUs.scheema.js";
import { RedisService } from "../../config/redis.js";
import { uploadImage, deleteImage } from "../../config/imageUploader.js";

import type { CreateWhyChooseUsInput, UpdateWhyChooseUsInput } from "../../validations/whyChooseUs.validation.js";

const getCacheKeys = {
  chooseUs: (id: string) => `chooseus:${id}`,
  chooseUsList: (page: number, limit: number, search: string = '') => {
    return `chooseus:page=${page}:limit=${limit}:search=${search}`;
  }
};
const clearChooseUsCaches = async () => {
  try {
    await RedisService.clearCachePattern('chooseus:*');
  } catch (error) {
    console.error('Error clearing choose us cache:', error);
  }
};


// controller/whyChooseUs/whychooseUs.controller.js

export const createChooseUS = TryCatch(async (req: Request, res: Response) => {
  const { title, heading, description, image, featured, subHeading, btnText } = req.body;

  // Parse featured if it's a string (coming from FormData)
  let parsedFeatured = featured;
  if (typeof featured === 'string') {
    try {
      parsedFeatured = JSON.parse(featured);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid featured format. Must be a valid JSON array."
      });
    }
  }

  // Ensure featured is an array
  if (!Array.isArray(parsedFeatured)) {
    parsedFeatured = [parsedFeatured];
  }

  const titleExist = await ChooseUs.findOne({ title: title });
  if (titleExist) {
    return res.status(400).json({
      success: false,
      message: "Title already exist"
    });
  }

  const headingExist = await ChooseUs.findOne({ heading: heading });
  if (headingExist) {
    return res.status(400).json({
      success: false,
      message: "Heading already exist"
    });
  }

  let uploadedImage = null;
  if (req.file) {
    uploadedImage = await uploadImage(req.file as any);
  }

  const chooseUsData: any = {
    title,
    heading,
    description,
    subHeading,
    btnText,
    featured: parsedFeatured, // Use parsed array
  };

  if (uploadedImage) {
    chooseUsData.image = {
      url: uploadedImage.url,
      public_id: uploadedImage.public_id,
    };
  }

  const chooseUs = await ChooseUs.create(chooseUsData);
  const cacheKey = getCacheKeys.chooseUs(chooseUs._id.toString());
  await RedisService.set(cacheKey, chooseUs, 3600);
  await clearChooseUsCaches();

  return res.status(200).json({
    success: true,
    message: "ChooseUs added successfully",
    data: chooseUs
  });
});
export const getChooseUs=TryCatch(async(req:Request,res:Response)=>{
    const chooseUs = await ChooseUs.find();
    return res.status(200).json({
        success:true,
        message:"ChooseUs fetched successfully",
        data:chooseUs
    })
})

// controller/whyChooseUs/whychooseUs.controller.js

export const updateChooseUs = TryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, heading, description, image, featured, subHeading, btnText } = req.body;

  const existingChooseUs = await ChooseUs.findById(id);
  if (!existingChooseUs) {
    return res.status(404).json({
      success: false,
      message: "ChooseUs entry not found"
    });
  }

  if (title) {
    const titleExist = await ChooseUs.findOne({
      _id: { $ne: id }, // Use _id instead of id
      title: title.trim()
    } as any);
    if (titleExist) {
      return res.status(400).json({
        success: false,
        message: "Title already exists"
      });
    }
    existingChooseUs.title = title;
  }

  if (heading) {
    const HeadingExist = await ChooseUs.findOne({
      _id: { $ne: id }, // Use _id instead of id
      heading: heading.trim()
    } as any);
    if (HeadingExist) {
      return res.status(400).json({
        success: false,
        message: "Heading already exists"
      });
    }
    existingChooseUs.heading = heading;
  }

  if (description) existingChooseUs.description = description;
  if (subHeading) existingChooseUs.subHeading = subHeading;
  if (btnText) existingChooseUs.btnText = btnText;

  // Parse featured if it's a string (coming from FormData)
  if (featured) {
    let parsedFeatured = featured;
    if (typeof featured === 'string') {
      try {
        parsedFeatured = JSON.parse(featured);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid featured format. Must be a valid JSON array."
        });
      }
    }
    // Ensure it's an array
    existingChooseUs.featured = Array.isArray(parsedFeatured) ? parsedFeatured : [parsedFeatured];
  }

  // Update image if new file uploaded
  if (req.file) {
    // Delete old image if exists
    if (existingChooseUs.image?.public_id) {
      await deleteImage(existingChooseUs.image.public_id);
    }

    const uploadedImage = await uploadImage(req.file as any);
    existingChooseUs.image = {
      url: uploadedImage.url,
      public_id: uploadedImage.public_id,
    };
  }

  await existingChooseUs.save();

  // Update cache
  const cacheKey = getCacheKeys.chooseUs(id as any);
  await RedisService.set(cacheKey, existingChooseUs, 3600);

  // Invalidate list cache
  await clearChooseUsCaches();

  return res.status(200).json({
    success: true,
    message: "ChooseUs updated successfully",
    data: existingChooseUs
  });
});