import { createServiceCategory, getServiceCategory } from '../controller/service/service-category.controller.js';
import { Router } from "express";
import { createService } from '../controller/service/service.controller.js';
import { upload } from "../config/multer.js";
import { updateService, deleteService, GetService } from '../controller/service/service.controller.js';
const ServiceRouter = Router();
ServiceRouter.post("/service-category", createServiceCategory);
ServiceRouter.get("/service-category", getServiceCategory);
ServiceRouter.post("/service", upload.single("image"), createService);
ServiceRouter.get("/service", GetService);
ServiceRouter.put("/service/:id", upload.single("image"), updateService);
ServiceRouter.delete("/service/:id", deleteService);
export default ServiceRouter;
//# sourceMappingURL=service.routes.js.map