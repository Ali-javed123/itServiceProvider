import { Schema, model, } from "mongoose";


import type { Document, Types } from "mongoose";


export interface IService extends Document {
  category: Types.ObjectId;

  title: string;

  image: {
    url: string;
    public_id: string;
  };
  description: string;

  icon: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IService>("Service", ServiceSchema);