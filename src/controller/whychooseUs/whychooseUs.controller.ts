import type { Request, Response } from "express";
import { TryCatch } from "../../config/TryCatch.js";
import  {ChooseUs} from "../../modules/whyChooseUS/whyChooseUs.scheema.js";
import { RedisService } from "../../config/redis.js";


const addchhooseUS=TryCatch(async(req:Request,res:Response)=>{
    const {title,heading,description,image,featured,subHeading,btnText} = req.body;
    if(!title || !heading || !description || !image || !featured || !subHeading || !btnText) {
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    const titleExist=await ChooseUs.findOne({title:title});
    if(titleExist){
        return res.status(400).json({
            success:false,
            message:"Title already exist"
        })
    }
    const headingExist=await ChooseUs.findOne({heading:heading});
    if(headingExist){
        return res.status(400).json({
            success:false,
            message:"Heading already exist"
        })
    }
    if(Array.isArray(featured)){
        for(const feature of featured){
            if(!feature.title || !feature.description || !feature.icon){
                return res.status(400).json({
                    success:false,
                    message:"All fields are required in featured"
                })
            }
        }
    }
    const chooseUs=await ChooseUs.create({
        title,
        heading,    
    description,
    image,
    featured,
    subHeading,
    btnText
    });
    return res.status(200).json({
        success:true,
        message:"ChooseUs added successfully",
        data:chooseUs
    })


 

})