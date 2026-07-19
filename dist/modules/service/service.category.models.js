import { Schema, model, Document } from "mongoose";
const ServiceCategorySchema = new Schema({
    serviceCategory: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
export default model("ServiceCategory", ServiceCategorySchema);
//# sourceMappingURL=service.category.models.js.map