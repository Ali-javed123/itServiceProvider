import { Schema, model ,Document} from "mongoose";




export interface IServiceCategory extends Document {
  serviceCategory: string;
  slug: string;
  createdAt: Date;
  unique: true;
  updatedAt: Date;
}

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IServiceCategory>(
  "ServiceCategory",
  ServiceCategorySchema
);