import { Request, Response } from "express";
import { AddQuestPlayerDTO, CustomError } from "../../domain";
import { QuestService } from "../services/quest.service";
import { CreateQuestDto } from "../../domain/dtos/quest/createQuest.dto";

export class QuestController {
  constructor(private readonly questService: QuestService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };

  addQuestToPlayer = async (req: Request, res: Response) => {
    const { playerId } = req.params;
    const [error, addQuestPlayerDTO] = AddQuestPlayerDTO.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.questService
      .addQuestToPlayer(+playerId, addQuestPlayerDTO!)
      .then((resp) =>
        res.status(200).json({ message: "Quest added to player" })
      )
      .catch((error) => this.handleError(error, res));
  };

  createQuest = async (req: Request, res: Response) => {
    const [error, createQuestDto] = CreateQuestDto.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.questService
      .createQuest(createQuestDto!)
      .then((clan) => res.status(201).json(clan))
      .catch((error) => this.handleError(error, res));
  };
}