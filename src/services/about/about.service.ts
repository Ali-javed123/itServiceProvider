// services/about.service.ts
import AboutUs from "../../modules/aboutus/about.schema.js";
import { uploadImage } from "../../config/imageUploader.js";
import { RedisService } from "../../config/redis.js";
import type { CreatePageDto, UpdatePageDto } from "../../types/about.type.js";

// Cache Keys
const CACHE_KEYS = {
  ALL_PAGES: 'about:all',
  PAGE_BY_ID: (id: string) => `about:${id}`,
};

/**
 * Create a new About Us page
 */
export const createPage = async (
  data: CreatePageDto,
  files: {
    image_one?: Express.Multer.File[];
    image_two?: Express.Multer.File[];
  }
) => {
  // Validate required fields
  const {
    title,
    description,
    imgIcon1,
    imgIcon2,
    cardTitle,
    cardDescription,
    btnText,
    features,
  } = data;

  if (
    !title || !description || !imgIcon1 || !imgIcon2 ||
    !cardTitle || !cardDescription || !features || !btnText
  ) {
    throw new Error("All required fields are mandatory.");
  }

  // Validate images
  if (!files?.image_one?.length || !files?.image_two?.length) {
    throw new Error("image_one and image_two are required.");
  }

  // Upload Images
  const [imageOne, imageTwo] = await Promise.all([
    uploadImage(files.image_one[0]!),
    uploadImage(files.image_two[0]!),
  ]);

  // Parse features if coming as FormData
  let parsedFeatures = features;
  if (typeof features === "string") {
    parsedFeatures = JSON.parse(features);
  }

  // Create page
  const page = await AboutUs.create({
    title,
    description,
    image_one: imageOne,
    image_two: imageTwo,
    imgIcon1,
    imgIcon2,
    cardTitle,
    cardDescription,
    btnText,
    features: parsedFeatures,
  });

  // Invalidate cache
  await RedisService.clearCachePattern('about:*');

  return page;
};

/**
 * Get all About Us pages
 */
export const getAllPages = async () => {
  const cacheKey = CACHE_KEYS.ALL_PAGES;
  
  // Check cache
  const cached = await RedisService.get<any>(cacheKey);
  if (cached) {
    console.log('📦 Returning cached about pages');
    return { data: cached, fromCache: true };
  }

  // Fetch from database
  const pages = await AboutUs.find().sort({ createdAt: -1 });

  // Cache the result
  await RedisService.set(cacheKey, pages, 3600);
  
  return { data: pages, fromCache: false };
};

/**
 * Get single About Us page by ID
 */
export const getPageById = async (id: string) => {
  // Validate ID
  if (!id) {
    throw new Error("Page ID is required");
  }

  const cacheKey = CACHE_KEYS.PAGE_BY_ID(id);
  
  // Check cache
  const cached = await RedisService.get<any>(cacheKey);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  const page = await AboutUs.findById(id);
  if (!page) {
    throw new Error("Page not found");
  }

  // Cache the result
  await RedisService.set(cacheKey, page, 3600);
  
  return { data: page, fromCache: false };
};

/**
 * Update About Us page
 */
export const updatePage = async (
  id: string,
  data: UpdatePageDto,
  files?: {
    image_one?: Express.Multer.File[];
    image_two?: Express.Multer.File[];
  }
) => {
  // Validate ID
  if (!id) {
    throw new Error("Page ID is required");
  }

  // Check if page exists
  const existingPage = await AboutUs.findById(id);
  if (!existingPage) {
    throw new Error("Page not found");
  }

  // Prepare update data
  const updateData: any = {};
  
  // Only add fields that are provided
  const { title, description, imgIcon1, imgIcon2, cardTitle, cardDescription, btnText, features } = data;
  
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (imgIcon1) updateData.imgIcon1 = imgIcon1;
  if (imgIcon2) updateData.imgIcon2 = imgIcon2;
  if (cardTitle) updateData.cardTitle = cardTitle;
  if (cardDescription) updateData.cardDescription = cardDescription;
  if (btnText) updateData.btnText = btnText;
  
  if (features) {
    updateData.features = typeof features === "string" 
      ? JSON.parse(features) 
      : features;
  }

  // Handle image uploads if provided
  if (files) {
    const uploadPromises = [];
    
    if (files.image_one?.length) {
      uploadPromises.push(
        uploadImage(files.image_one[0]!).then(url => { updateData.image_one = url; })
      );
    }
    
    if (files.image_two?.length) {
      uploadPromises.push(
        uploadImage(files.image_two[0]!).then(url => { updateData.image_two = url; })
      );
    }
    
    if (uploadPromises.length > 0) {
      await Promise.all(uploadPromises);
    }
  }

  // Update page
  const updatedPage = await AboutUs.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  // Clear all related caches
  await Promise.all([
    RedisService.deleteCache(CACHE_KEYS.PAGE_BY_ID(id)),
    RedisService.clearCachePattern('about:*'),
  ]);

  // Cache updated page
  await RedisService.set(CACHE_KEYS.PAGE_BY_ID(id), updatedPage, 3600);

  return updatedPage;
};

/**
 * Delete About Us page
 */
export const deletePage = async (id: string) => {
  // Validate ID
  if (!id) {
    throw new Error("Page ID is required");
  }

  // Find and delete
  const page = await AboutUs.findByIdAndDelete(id);
  if (!page) {
    throw new Error("Page not found");
  }

  // Clear all related caches
  await Promise.all([
    RedisService.deleteCache(CACHE_KEYS.PAGE_BY_ID(id)),
    RedisService.clearCachePattern('about:*'),
  ]);

  return page;
};

/**
 * Get page by slug (if you have slugs)
 */
export const getPageBySlug = async (slug: string) => {
  if (!slug) {
    throw new Error("Slug is required");
  }

  const cacheKey = `about:slug:${slug}`;
  
  // Check cache
  const cached = await RedisService.get<any>(cacheKey);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  const page = await AboutUs.findOne({ slug });
  if (!page) {
    throw new Error("Page not found");
  }

  await RedisService.set(cacheKey, page, 3600);
  
  return { data: page, fromCache: false };
};