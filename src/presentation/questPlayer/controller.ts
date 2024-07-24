import { Request, Response } from 'express';
import { QuestPlayerService } from '../services/questPlayer.service';
import { AssignQuestDTO } from '../../domain/dtos/quest/assignQuest.dto';

export const assignQuestToPlayerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const questId = parseInt(req.params.id, 10);  // Obtenemos el ID de la quest desde la URL
    const { playerId, completed }: AssignQuestDTO = req.body;  // Extraemos los datos del cuerpo de la solicitud

    // Validamos que playerId esté presente
    if (!playerId) {
      res.status(400).json({ error: 'Missing required field: playerId' });
      return;
    }

    // Llamamos al servicio para asignar la quest al jugador
    const assignedQuestPlayer = await QuestPlayerService.assignQuest(questId, { playerId, completed });

    // Respondemos con la asignación realizada
    res.status(201).json(assignedQuestPlayer);
  } catch (error) {
    console.error('Error assigning quest to player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getPlayerQuestsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const playerId = parseInt(req.params.id, 10);

    // Validamos que el playerId es un número válido
    if (isNaN(playerId)) {
      res.status(400).json({ error: 'Invalid player ID' });
      return;
    }

    // Llamamos al servicio para obtener las quests del jugador
    const quests = await QuestPlayerService.getQuestsByPlayerId(playerId);

    res.status(200).json(quests);
  } catch (error) {
    console.error('Error retrieving player quests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
