import { TryCatch } from "../../config/TryCatch.js";
import HomeBanner from "../../modules/homeBanner/homeBanner.schema.js";
import { uploadImage } from "../../config/imageUploader.js";
import type { Request, Response } from "express";

export const createBanner = TryCatch(async (req: Request, res: Response) => {
    const { title, heading, btnTextOne, btnTextTwo } = req.body;

    // ✅ Add return statements to stop execution
    if (!title || !heading || !btnTextOne || !btnTextTwo) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    // Check if banner already exists
    const ifExistTitle = await HomeBanner.findOne({ title });
    const ifExistHeading = await HomeBanner.findOne({ heading });

    if (ifExistTitle) {
        return res.status(409).json({
            success: false,
            message: "Title already exists."
        });
    }

    if (ifExistHeading) {
        return res.status(409).json({
            success: false,
            message: "Heading already exists."
        });
    }

    // ✅ Handle image upload
    let image = null;
    if (req.file) {
        image = await uploadImage(req.file);
    }

    // ✅ Create banner with image
    const banner = await HomeBanner.create({
        title,
        heading,
        btnTextOne,
        btnTextTwo,
        image: image || undefined
     } as any);

    return res.status(201).json({
        success: true,
        message: "Banner created successfully.",
        data: banner
    });
});

export const getBanner = TryCatch(async (req: Request, res: Response) => {
    // ✅ Add await to execute the query
    const banners = await HomeBanner.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
        success: true,
        message: "Banners fetched successfully.",
        data: banners
    });
});

// ✅ Add get by ID
export const getBannerById = TryCatch(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const banner = await HomeBanner.findById(id);
    
    if (!banner) {
        return res.status(404).json({
            success: false,
            message: "Banner not found."
        });
    }
    
    return res.status(200).json({
        success: true,
        message: "Banner fetched successfully.",
        data: banner
    });
});

// ✅ Add update banner
export const updateBanner = TryCatch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, heading, btnTextOne, btnTextTwo } = req.body;

    // Check if banner exists
    const existingBanner = await HomeBanner.findById(id);
    if (!existingBanner) {
        return res.status(404).json({
            success: false,
            message: "Banner not found."
        });
    }

    // Check for duplicate title (excluding current banner)
    if (title && title !== existingBanner.title) {
        const duplicateTitle = await HomeBanner.findOne({ 
            title,
            _id: { $ne: existingBanner._id } 
        });
        if (duplicateTitle) {
            return res.status(409).json({
                success: false,
                message: "Title already exists."
            });
        }
    }

    // Handle image upload
    let image = existingBanner.image;
    if (req.file) {
        image = await uploadImage(req.file);
    }

    // Update banner
    const updatedBanner = await HomeBanner.findByIdAndUpdate(
        id,
        {
            title: title || existingBanner.title,
            heading: heading || existingBanner.heading,
            btnTextOne: btnTextOne || existingBanner.btnTextOne,
            btnTextTwo: btnTextTwo || existingBanner.btnTextTwo,
            image: image
        },
        { new: true }
    );

    return res.status(200).json({
        success: true,
        message: "Banner updated successfully.",
        data: updatedBanner
    });
});

// ✅ Add delete banner
export const deleteBanner = TryCatch(async (req: Request, res: Response) => {
    const { id } = req.params;

    const banner = await HomeBanner.findByIdAndDelete(id);
    
    if (!banner) {
        return res.status(404).json({
            success: false,
            message: "Banner not found."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Banner deleted successfully.",
        data: null
    });
});