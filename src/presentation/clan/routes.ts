

import { Router } from 'express';
import { ClanController } from './controller';
import { PlayerService } from '../services/player.service';
import { UserService } from '../services/user.service';
import { ClanService } from '../services/clan.service';


export class ClanRoutes {
  
  static get routes(): Router {
    const router = Router();

    const userService = new UserService();
    const playerService = new PlayerService(userService);
    const clanService = new ClanService(playerService);
    const controller = new ClanController(clanService);

    router.post('/', controller.addMemberToClan)
    router.post('/:playerReceiverId/join', controller.addMemberToClan)
    router.get('/api/clans/:id/members', controller.getClanMembersById)

    return router;
  }

}
