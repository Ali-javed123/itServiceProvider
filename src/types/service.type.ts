
import type { 
  CreateServiceInput, 
  UpdateServiceInput, 
  ServiceQuery,
  ServiceResponse 
} from "../validations/service.validation.js";
import type { Request, Response } from "express";


export interface CreateServiceRequest extends Request {
  body: CreateServiceInput;
  file?: Express.Multer.File; // Optional
}
