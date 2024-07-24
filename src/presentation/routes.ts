


import { Router } from 'express';
import { UserRoutes } from './user/routes';
import { InventoryRoutes } from './inventory/controller';
import { QuestRoutes } from './quest/routes';
import { ClanRoutes } from './clan/routes';
import { PlayerRoutes } from './player/routes';
import { ResourceRoutes } from './resource/routes';
import { ConstructionRoutes } from './constructions/routes';


export class AppRoutes {
  
  static get routes(): Router {
    const router = Router();

    router.use('/api/v1/player', PlayerRoutes.routes);
    router.use('/api/v1/user', UserRoutes.routes);
    router.use('/api/v1/inventory', InventoryRoutes.routes)
    router.use('/api/v1/clan', ClanRoutes.routes)
    router.use('/api/v1/quest', QuestRoutes.routes)
    router.use('/api/v1/resources', ResourceRoutes.routes)
    router.use('/api/v1/constructions', ConstructionRoutes.routes)

    return router;
  }

}
