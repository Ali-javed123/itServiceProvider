import { 
  validate, 
  validateFile, 
  commonSchemas 
} from "../middleware/validation.middleware.js";
import { isAuth } from "../middleware/isAuth.js";
import { Router } from "express";
import { upload } from "../config/multer.js";

import {
  createChooseUS,
  getChooseUs,
    updateChooseUs,

} from "../controller/whyChooseUs/whychooseUs.controller.js";

import {
  createWhyChooseUsSchema,
  updateWhyChooseUsSchema,
  getWhyChooseUsQuerySchema,
  idParamSchema
} from "../validations/whyChooseUs.validation.js";

const WhyChooseUsRouter = Router();

WhyChooseUsRouter.use(isAuth);

WhyChooseUsRouter.post(
  "/chooseus",
  upload.single("image"),
  validate({
    body: createWhyChooseUsSchema,
  }),
  validateFile({
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: true,
  }),
  createChooseUS
);
WhyChooseUsRouter.get(
  "/chooseus",
  
  getChooseUs
);

WhyChooseUsRouter.put(
  "/chooseus/:id",
  upload.single("image"),
  validate({
    params: idParamSchema,
    body: updateWhyChooseUsSchema,
  }),
  validateFile({
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
  }),
  updateChooseUs
);

export default WhyChooseUsRouter;