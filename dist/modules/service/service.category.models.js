import { Schema, model, Document } from "mongoose";
import Service from "./service.model.js";
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
ServiceCategorySchema.pre("findOneAndDelete", async function () {
    const category = await this.model.findOne(this.getFilter());
    if (category) {
        await Service.deleteMany({
            category: category._id,
        });
    }
});
ServiceCategorySchema.pre("findOneAndDelete", async function () {
    const category = await this.model.findOne(this.getFilter());
    if (category) {
        await Service.deleteMany({
            category: category._id,
        });
    }
});
export default model("ServiceCategory", ServiceCategorySchema);
//# sourceMappingURL=service.category.models.js.map