



import { Request, Response } from 'express';
import { AddQuestPlayerDTO, CustomError } from '../../domain';
import { QuestService } from '../services/quest.service';
import { CreateQuestDTO } from '../../domain/dtos/quest/createQuest.dto';

export class QuestController {

  constructor(
    private readonly questService: QuestService
  ){}

  private handleError = (error: unknown, res: Response) => {
    if( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    console.log(error)
    return res.status(500).json({ message: 'Something went very wrong! 🧨' })
  }

  addQuestToPlayer = async (req: Request, res: Response) => {
    const { playerId } = req.params;
    const [ error, addQuestPlayerDTO ] = AddQuestPlayerDTO.create(req.body);
    if( error ) return res.status(422).json({ message: error })
    
    this.questService.addQuestToPlayer(+playerId, addQuestPlayerDTO!)
      .then(resp => res.status(200).json({ message: 'Quest added to player' }))
      .catch(error => this.handleError(error, res))
  }
}
export const createQuestController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extraemos los datos de la quest del cuerpo de la solicitud
    const { name, description, reward, exp } = req.body;

    // Validamos que todos los campos requeridos estén presentes
    if (!name || !description || !reward || exp === undefined) {
      res.status(400).json({ error: 'Missing required fields: name, description, reward, exp' });
      return;
    }

    // Crea un objeto de tipo CreateQuestDTO
    const questData: CreateQuestDTO = { name, description, reward, exp };

    // Llamamos al servicio para crear la nueva quest
    const newQuest = await QuestService.createQuest(questData);

    // Respondemos con la nueva quest creada
    res.status(201).json(newQuest);
  } catch (error) {
    console.error('Error creating quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};