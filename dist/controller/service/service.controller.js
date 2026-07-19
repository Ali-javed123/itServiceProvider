import mongoose from "mongoose";
import ServiceSchema from "../../modules/service/service.model.js";
import ServiceCategory from "../../modules/service/service.category.models.js";
import Service from "../../modules/service/service.model.js";
import { uploadImage, deleteImage } from "../../config/imageUploader.js";
import { generateToken } from "../../middleware/generateToken.js";
import slugify from "slugify";
import ServiceModel from "../../modules/service/service.model.js";
import { TryCatch } from "../../config/TryCatch.js";
export const createService = async (req, res) => {
    try {
        console.log("Controller Hit");
        const { category, title, description, icon } = req.body;
        // ==========================
        // Validation
        // ==========================
        if (!category || !title || !description || !icon) {
            res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
            return;
        }
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "Service image is required.",
            });
            return;
        }
        // ==========================
        // ObjectId Validation
        // ==========================
        if (!mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).json({
                success: false,
                message: "Invalid Service Category Id.",
            });
            return;
        }
        // ==========================
        // Category Exists
        // ==========================
        const categoryExists = await ServiceCategory.findById(category);
        if (!categoryExists) {
            res.status(404).json({
                success: false,
                message: "Service Category not found.",
            });
            return;
        }
        // ==========================
        // Duplicate Check
        // ==========================
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
        // ==========================
        // Generate Slug
        // ==========================
        const slug = slugify(title, {
            lower: true,
            strict: true,
            trim: true,
        });
        // ==========================
        // Upload Image
        // ==========================
        const uploadedImage = await uploadImage(req.file);
        // ==========================
        // Save Service
        // ========================== 
        const service = await Service.create({
            category: categoryExists._id,
            title,
            description,
            icon,
            slug,
            image: {
                url: uploadedImage.url,
                public_id: uploadedImage.public_id,
            },
        });
        // ==========================
        // Populate Category
        // ==========================
        const response = await Service.findById(service._id).populate({
            path: "category",
            select: "serviceCategory slug",
        });
        res.status(201).json({
            success: true,
            message: "Service created successfully.",
            data: response,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: String(error),
        });
    }
};
export const updateService = async (req, res) => {
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
            if (!mongoose.Types.ObjectId.isValid(category)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid Service Category Id.",
                });
                return;
            }
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
        // Duplicate Check
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
        // Update Image
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
        const response = await Service.findById(service._id).populate({
            path: "category",
            select: "serviceCategory slug",
        });
        res.status(200).json({
            success: true,
            message: "Service updated successfully.",
            data: response,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
            error,
        });
    }
};
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid Service Id.",
            });
            return;
        }
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
        res.status(200).json({
            success: true,
            message: "Service deleted successfully.",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
export const GetService = TryCatch(async (req, res) => {
    const services = await ServiceModel.find();
    res.status(200).json({
        success: true,
        message: "Services fetched successfully.",
        data: services,
    });
});
//# sourceMappingURL=service.controller.js.map