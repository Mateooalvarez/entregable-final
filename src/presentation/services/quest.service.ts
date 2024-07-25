import { DeepPartial } from 'typeorm';
import { Quest, Quest_player } from '../../data';
import { AddQuestPlayerDTO, CustomError } from '../../domain';
import { PlayerService } from './player.service';
import { CreateQuestDto } from '../../domain/dtos/quest/createQuest.dto';


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

  async findQuestByname(name: string) {
    const quest = await Quest.findOne({
      where: {
        name,
      },
    });
    if (quest) throw CustomError.badRequest("This name is already existing");
    return quest;
  }

  async createQuest(createQuestDto: CreateQuestDto) {
    const questExisting = await this.findQuestByname(createQuestDto.name);
    if (questExisting)
      throw CustomError.badRequest("name of quest existing...✕✕✕");

    const quest = new Quest();
    quest.name = createQuestDto.name.toLocaleLowerCase().trim();
    quest.description = createQuestDto.description.toLocaleLowerCase().trim();
    quest.reward = createQuestDto.reward.toLocaleLowerCase().trim();
    quest.exp = createQuestDto.exp;

    try {
      return await quest.save();
    } catch (error) {
      throw CustomError.internalServer("Something went wrong...");
    }
  }
}

