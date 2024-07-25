// import { Player, Quest, Quest_player } from "../../data";
// import { AssignQuestDTO } from "../../domain/dtos/quest/assignQuest.dto";
// import { QuestResponseDTO } from "../../domain/dtos/quest/questResponse.dto";
// import { AppDataSource } from "./inventory.service";

// export class QuestPlayerService {
//   // Método para asignar una quest a un jugador
//   public static async assignQuest(questId: number, assignQuestData: AssignQuestDTO): Promise<Quest_player> {
//     try {
//       const { playerId, completed = false } = assignQuestData;  // Extraemos playerId y completed

//       // Verificamos si la quest existe
//       const quest = await AppDataSource.getRepository(Quest).findOne({ where: { id: questId } });
//       if (!quest) {
//         throw new Error('Quest not found');
//       }

//       // Verificamos si el jugador existe
//       const player = await AppDataSource.getRepository(Player).findOne({ where: { id: playerId } });
//       if (!player) {
//         throw new Error('Player not found');
//       }

//       // Creamos una nueva relación Quest_player
//       const questPlayer = new Quest_player();
//       questPlayer.quest = quest;
//       questPlayer.player = player;
//       questPlayer.completed = completed;

//       // Guardamos la relación en la base de datos
//       const savedQuestPlayer = await AppDataSource.getRepository(Quest_player).save(questPlayer);

//       return savedQuestPlayer;
//     } catch (error) {
//       console.error('Error assigning quest:', error);
//       throw new Error('Failed to assign quest');
//     }
//   }

//   public static async getQuestsByPlayerId(playerId: number): Promise<QuestResponseDTO[]> {
//     try {
//       const quests = await AppDataSource
//         .getRepository(Quest_player)
//         .createQueryBuilder('questPlayer')
//         .leftJoinAndSelect('questPlayer.quest', 'quest')
//         .where('questPlayer.player.id = :playerId', { playerId })
//         .select([
//           'quest.id',
//           'quest.name',
//           'quest.description',
//           'quest.reward',
//           'quest.exp',
//           'questPlayer.completed'
//         ])
//         .getMany();

//       return quests.map(qp => ({
//         id: qp.quest.id,
//         name: qp.quest.name,
//         description: qp.quest.description,
//         reward: qp.quest.reward,
//         exp: qp.quest.exp,
//         completed: qp.completed
//       }));
//     } catch (error) {
//       console.error('Error retrieving quests for player:', error);
//       throw new Error('Failed to retrieve quests for player');
//     }
//   }

// }
