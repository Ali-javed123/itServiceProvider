import { Schema, model, } from "mongoose";


import type { Document, Types } from "mongoose";
export interface Feature extends Document {
    icon: string;
    title: string;
    
}

export interface IChooseUs extends Document {
    title: string;
    heading: string;
    description: string;
    image: {
        url: string;
        public_id: string;
    };
   
    featured: Feature[];
    subHeading: string;
    btnText: string;    
}

const FeatureSchema = new Schema<Feature>({
    icon: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
});


const WhyChoosUsSchema = new Schema<IChooseUs>(
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
description: {
    type: String,
    required: true,
    trim: true,
},
subHeading: {
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

btnText: {
    type: String,
    required: true,
    trim: true,
},
        featured: {
            type: [FeatureSchema],
            required: true,
        },



    },
    {
    
        timestamps: true, // Adds createdAt and updatedAt
    }
)
export const ChooseUs = model<IChooseUs>("ChooseUs", WhyChoosUsSchema);
