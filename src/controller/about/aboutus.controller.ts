// controllers/aboutus.controller.ts
import type { Request, Response, RequestHandler } from "express";
import { TryCatch } from "../../config/TryCatch.js";
import * as AboutService from "../../services/about/about.service.js";

/**
 * Create a new About Us page
 */
export const createPage: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    const files = req.files as {
      image_one?: Express.Multer.File[];
      image_two?: Express.Multer.File[];
    };

    const page = await AboutService.createPage(body, files);

    res.status(201).json({
      success: true,
      message: "Page created successfully.",
      data: page,
    });
  }
);

/**
 * Get all About Us pages
 */
export const getAllPages: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const result = await AboutService.getAllPages();

    res.status(200).json({
      success: true,
      data: result.data,
      fromCache: result.fromCache,
      message: "Pages fetched successfully.",
    });
  }
);

/**
 * Get single About Us page by ID
 */
export const getPageById: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    const result = await AboutService.getPageById(id as any);

    res.status(200).json({
      success: true,
      data: result.data,
      fromCache: result.fromCache,
      message: "Page fetched successfully.",
    });
  }
);

/**
 * Update About Us page
 */
export const updatePage: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const body = req.body;
    const files = req.files as {
      image_one?: Express.Multer.File[];
      image_two?: Express.Multer.File[];
    };

    const updatedPage = await AboutService.updatePage(id as any, body, files);

    res.status(200).json({
      success: true,
      message: "Page updated successfully.",
      data: updatedPage,
    });
  }
);

/**
 * Delete About Us page
 */
export const deletePage: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    await AboutService.deletePage(id as any);

    res.status(200).json({
      success: true,
      message: "Page deleted successfully.",
    });
  }
);

/**
 * Get page by slug (optional)
 */
export const getPageBySlug: RequestHandler = TryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    
    const result = await AboutService.getPageBySlug(slug as any);

    res.status(200).json({
      success: true,
      data: result.data,
      fromCache: result.fromCache,
      message: "Page fetched successfully.",
    });
  }
);