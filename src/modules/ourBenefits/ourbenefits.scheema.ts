import { Schema, model, } from "mongoose";


import type { Document, Types } from "mongoose";


export interface Featured  extends Document {
    heading: string;
    description: string;
    image: {
        url: string;
        public_id: string;
    };
    icon: string;
    
}
export interface list  extends Document {
list: string;
}
export interface Ourbenefits extends Document {
    title: string;
    heading: string;
    featured: Featured[];
    list: list[];
    subHeading: string;
    btnText: string;

    
}



const FeatureSchema = new Schema<Featured>({
    icon: {
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
});



const listScheema = new Schema<list>({
    list: {
        type: String,
        required: true,
        trim: true,
    },
    
});




const ourBenefitScheema = new Schema<Ourbenefits>({
    title: {
        type: String,    
        required: true,
        trim: true,
    },
    list: [listScheema],
    featured:[FeatureSchema],
    subHeading:{
        type: String,
        required: true,
        trim: true},
    
    btnText:{
        type: String,
        required: true,trim: true,},
        
})
export const OurBenefits = model<Ourbenefits>("OurBenefits", ourBenefitScheema);
