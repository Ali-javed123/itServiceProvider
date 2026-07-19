import { Schema, model, } from "mongoose";
const ServiceSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
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
    icon: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
export default model("Service", ServiceSchema);
//# sourceMappingURL=service.model.js.map