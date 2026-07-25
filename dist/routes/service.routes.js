import { createServiceCategory, getServiceCategories, deleteCategoryService } from '../controller/service/service-category.controller.js';
import { Router } from "express";
import { createService } from '../controller/service/service.controller.js';
import { upload } from "../config/multer.js";
import { updateService, deleteService, GetService } from '../controller/service/service.controller.js';
import { isAuth } from "../middleware/isAuth.js";
const ServiceRouter = Router();
ServiceRouter.post("/service-category", isAuth, createServiceCategory);
ServiceRouter.get("/service-category", isAuth, getServiceCategories);
ServiceRouter.delete("/service-category/:id", isAuth, deleteCategoryService);
ServiceRouter.post("/service", isAuth, upload.single("image"), createService);
ServiceRouter.get("/service", isAuth, GetService);
ServiceRouter.put("/service/:id", isAuth, upload.single("image"), updateService);
ServiceRouter.delete("/service/:id", isAuth, deleteService);
export default ServiceRouter;
//# sourceMappingURL=service.routes.js.map