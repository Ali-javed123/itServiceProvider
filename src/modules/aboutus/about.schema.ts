import { Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { IFeature,IPage } from "../../types/about.type.js";


const FeatureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);


const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);
const AboutUs = new Schema<IPage>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image_two:ImageSchema,
image_one: ImageSchema,

    imgIcon1: {
      type: String,
      required: true,
    },

    imgIcon2: {
      type: String,
      required: true,
    },

    cardTitle: {
      type: String,
      required: true,
      trim: true,
    },

    cardDescription: {
      type: String,
      required: true,
      trim: true,
    },

    // featureIcon: {
    //   type: String,
    //   required: true,
    // },

    features: {
      type: [FeatureSchema],
      default: [],
    },

    btnText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IPage>("AboutUs", AboutUs);