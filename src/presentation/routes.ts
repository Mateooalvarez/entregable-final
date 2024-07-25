import { Router } from "express";
import { InventoryRoutes } from "./inventory/controller";
import { QuestRoutes } from "./quest/routes";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { UserRoutes } from "./user/routes";
import { PlayerRoutes } from "./player/routes";
import { ResourcesRouter } from "./resource/routes";
import { ClanRoutes } from "./clan/routes";
import { ConstructionRoutes } from "./constructions/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/v1/user", UserRoutes.routes);
    
    router.use(AuthMiddleware.protect);

    router.use("/api/v1/player", PlayerRoutes.routes);
    router.use("/api/v1/inventory", InventoryRoutes.routes);
    router.use("/api/v1/resources", ResourcesRouter.routes);
    router.use("/api/v1/constructions", ConstructionRoutes.routes);
    router.use("/api/v1/clan", ClanRoutes.routes);
    router.use("/api/v1/quest", QuestRoutes.routes);

    return router;
  }
}