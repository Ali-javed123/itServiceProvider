import { Schema, model ,Document} from "mongoose";

import Service from "./service.model.js";


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


ServiceCategorySchema.pre("findOneAndDelete", async function () {
  const category = await this.model.findOne(this.getFilter());

  if (category) {
    await Service.deleteMany({
      category: category._id,
    });
  }
});ServiceCategorySchema.pre("findOneAndDelete", async function () {
  const category = await this.model.findOne(this.getFilter());

  if (category) {
    await Service.deleteMany({
      category: category._id,
    });
  }
});

export default model<IServiceCategory>(
  "ServiceCategory",
  ServiceCategorySchema
);