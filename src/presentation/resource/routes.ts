import { Router } from "express";
import { ResourceService } from "../services/resource.service";
import { ResoucesController } from "./controller";

export class ResourcesRouter {
  static get routes(): Router {
    const router = Router();

    const resourcesService = new ResourceService();
    const resourcesController = new ResoucesController(resourcesService);

    router.post("/", resourcesController.createResources);
    router.get("/", resourcesController.getAllResouces);

    return router;
  }
}