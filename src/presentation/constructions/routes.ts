import { Router } from 'express';
import { ConstructionController } from './controller';
import { ConstructionService } from '../services/construction.service';

export class ConstructionRoutes {
  static get routes(): Router {
    const router = Router();

    const constructionService = new ConstructionService();
    const constructionController = new ConstructionController(constructionService);

    router.post('/', constructionController.createConstruction);
    router.post('/players/:id/constructions', constructionController.getconstructionsbyPlayer);

    return router;
  }
}
