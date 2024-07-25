import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AddConstructionsDto } from '../../domain/dtos/constructions/add-constructions.dto';
import { ConstructionsService } from '../services/construction.service';

export class ConstructionController {
  constructor(private readonly constructionService: ConstructionsService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: 'Something went very wrong! 🧨' });
  }

  createConstruction = async (req: Request, res: Response) => {
    const [error, createConstructionsDto] =
    AddConstructionsDto.createConstructions(req.body);
  if (error) throw res.status(422).json({ message: error });

  this.constructionService
    .createConstructions(createConstructionsDto!)
    .then((construc) => res.status(201).json(construc))
    .catch((error) => this.handleError(error, res));
};
}

