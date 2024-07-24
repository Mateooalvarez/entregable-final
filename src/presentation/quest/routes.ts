


import { Router } from 'express';
import { createQuestController, QuestController } from './controller';
import { QuestService } from '../services/quest.service';
import { PlayerService } from '../services/player.service';
import { UserService } from '../services/user.service';
import { assignQuestToPlayerController } from '../questPlayer/controller';


export class QuestRoutes {
  
  static get routes(): Router {
    const router = Router();

    const userService = new UserService();
    const playerService = new PlayerService(userService);
    const questService = new QuestService(playerService);
    const controller = new QuestController(questService);

    router.post('/:playerId/assign', controller.addQuestToPlayer)
    router.post('/api/quests', createQuestController)
    router.post('/quests/:id/assign', assignQuestToPlayerController)

    return router;
  }

}
