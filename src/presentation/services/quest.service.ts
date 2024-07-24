import { DeepPartial } from 'typeorm';
import { Quest, Quest_player } from '../../data';
import { AddQuestPlayerDTO, CustomError } from '../../domain';
import { CreateQuestDTO } from '../../domain/dtos/quest/createQuest.dto';
import { PlayerService } from './player.service';


export class QuestService {

  constructor(
    private readonly playerService: PlayerService
  ){}

  async addQuestToPlayer( playerId: number, addQuestPlayerDTO: AddQuestPlayerDTO){
    const playerPromise =  this.playerService.findOnePlayer(playerId);
    const questPromise =  this.findOneQuestById(addQuestPlayerDTO.questId);

    const [player, quest] = await Promise.all([playerPromise, questPromise])

    const questPlayer = new Quest_player();
    questPlayer.player = player;
    questPlayer.quest = quest;

    try {
      return await questPlayer.save()
    } catch (error){
      throw CustomError.internalServer("Something went wrong")
    }
  }

  async findOneQuestById(id: number){
    const quest = await Quest.findOne({
      where: {
        id
      }
    })

    if (!quest) throw CustomError.notFound("Quest not found");

    return quest;
  }

  public static async createQuest(questData: CreateQuestDTO): Promise<Quest> {
    try {
      // Aseguramos que questData cumpla con DeepPartial<Quest>
      const questEntity: DeepPartial<Quest> = {
        name: questData.name,
        description: questData.description,
        reward: questData.reward,
        exp: questData.exp,
      };

      // Creamos una nueva instancia de Quest
      const newQuest = Quest.create(questEntity);

      // Guardamos la nueva quest en la base de datos
      const savedQuest = await newQuest.save() as Quest;

      return savedQuest;
    } catch (error) {
      throw new Error('Failed to create quest');
    }
  }
}
