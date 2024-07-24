import { Router } from 'express';
import { ResourceController } from './controller';
import { ResourceService } from '../services/resource.service';

export class ResourceRoutes {
  static get routes(): Router {
    const router = Router();

    const resourceService = new ResourceService();
    const resourceController = new ResourceController(resourceService);

    router.post('/', resourceController.createResource);
    router.post('/', resourceController.getAllResources);

    return router;
  }
}
