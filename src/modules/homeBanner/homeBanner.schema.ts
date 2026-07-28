import { Document } from "mongoose";
import { Schema, model } from "mongoose";

interface bannerImage {
    url: string;
    public_id: string;
}

interface banner extends Document {
    image: bannerImage;
    title: string;
    heading: string;
    btnTextOne: string;
    btnTextTwo: string;
}

const HBannerSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        heading: {
            type: String,
            required: true,
            trim: true,
        },
        btnTextOne: {
            type: String,
            required: true,
            trim: true,
        },
        btnTextTwo: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
    },
    {
        // ✅ Remove _id: false to allow automatic _id generation
        timestamps: true, // Adds createdAt and updatedAt
    }
);

export default model<banner>("HomeBanner", HBannerSchema);