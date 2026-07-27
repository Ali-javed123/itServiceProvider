// controllers/aboutus.controller.ts
import type { Request, Response, RequestHandler } from "express";
import AboutUs from "../../modules/aboutus/about.schema.js";
import { TryCatch } from "../../config/TryCatch.js";
import { uploadImage } from "../../config/imageUploader.js";
import type { CreatePageDto, UpdatePageDto } from "../../types/about.type.js";

// Use explicit RequestHandler type with generics
export const createPage: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreatePageDto;
    const {
      title,
      description,
      imgIcon1,
      imgIcon2,
      cardTitle,
      cardDescription,
      btnText,
      features,
    } = body;

    // Validation
    if (
      !title ||
      !description ||
      !imgIcon1 ||
      !imgIcon2 ||
      !cardTitle ||
      !cardDescription ||
      !features ||
      !btnText
    ) {
      res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
      return;
    }

    // Multer files
    const files = req.files as {
      image_one?: Express.Multer.File[];
      image_two?: Express.Multer.File[];
    };

    if (!files?.image_one?.length || !files?.image_two?.length) {
      res.status(400).json({
        success: false,
        message: "image_one and image_two are required.",
      });
      return;
    }

    // Upload Images
    const imageOne = await uploadImage(files.image_one[0]!);
    const imageTwo = await uploadImage(files.image_two[0]!);

    // Parse features if coming as FormData
    let parsedFeatures = features;
    if (typeof features === "string") {
      parsedFeatures = JSON.parse(features);
    }

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

    res.status(201).json({
      success: true,
      message: "Page created successfully.",
      data: page,
    });
  }
);

export const getAllPages: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const pages = await AboutUs.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: pages,
      message: "Pages fetched successfully.",
    });
  }
);

export const updatePage: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const body = req.body as UpdatePageDto;
    const {
      title,
      description,
      imgIcon1,
      imgIcon2,
      cardTitle,
      cardDescription,
      btnText,
      features,
    } = body;

    const existingPage = await AboutUs.findById(id);
    if (!existingPage) {
      res.status(404).json({
        success: false,
        message: "Page not found.",
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};
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

    // Handle image uploads
    const files = req.files as {
      image_one?: Express.Multer.File[];
      image_two?: Express.Multer.File[];
    };

    if (files?.image_one?.length) {
      const imageOne = await uploadImage(files.image_one[0]!);
      updateData.image_one = imageOne;
    }

    if (files?.image_two?.length) {
      const imageTwo = await uploadImage(files.image_two[0]!);
      updateData.image_two = imageTwo;
    }

    const updatedPage = await AboutUs.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Page updated successfully.",
      data: updatedPage,
    });
  }
);

export const deletePage: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const page = await AboutUs.findByIdAndDelete(id);
    if (!page) {
      res.status(404).json({
        success: false,
        message: "Page not found.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Page deleted successfully.",
    });
  }
);

export const getPageById: RequestHandler= TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const id:any= req.params.id;
    const page = await AboutUs.findById(id);
    if (!page) {
      res.status(404).json({
        success: false,
        message: "Page not found.",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: page,
      message: "Page fetched successfully.",
    });
  }
);