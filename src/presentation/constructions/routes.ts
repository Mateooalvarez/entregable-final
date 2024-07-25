import { Router } from 'express';
import { ConstructionController } from './controller';
import { ConstructionsService } from '../services/construction.service';
import { UserService } from '../services/user.service';
import { PlayerService } from '../services/player.service';

export class ConstructionRoutes {
  static get routes(): Router {
    const router = Router();

    const userService = new UserService()
    const playerService = new PlayerService(userService)
    const constructionsService = new ConstructionsService(playerService);
    const constructionController = new ConstructionController(constructionsService);

    router.post('/', constructionController.createConstruction);
    router.post('/players/:id/constructions', constructionController.createConstruction);

    return router;
  }
}
