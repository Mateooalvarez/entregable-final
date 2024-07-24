import { Construction } from "../../data";
import { AppDataSource } from "./inventory.service";

export class ConstructionService {
  async createConstruction(data: Partial<Construction>) {
    const constructionRepository = AppDataSource.getRepository(Construction);
    const newConstruction = constructionRepository.create(data);
    await constructionRepository.save(newConstruction);
    return newConstruction;
  }

  async getconstructionsbyPlayer(playerId: number){
    const constructionRepository = AppDataSource.getMongoRepository(Construction)
    return await constructionRepository.find({
        where: {
            player: {
                id: playerId
            }
        }
    })
  }
}
