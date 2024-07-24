import { Request, Response } from 'express';
import { ConstructionService } from '../services/construction.service';
import { CustomError } from '../../domain';

export class ConstructionController {
  constructor(private readonly constructionService: ConstructionService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: 'Something went very wrong! 🧨' });
  }

  createConstruction = async (req: Request, res: Response) => {
    try {
      const newConstruction = await this.constructionService.createConstruction(req.body);
      return res.status(201).json(newConstruction);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  getconstructionsbyPlayer = async ( req: Request, res: Response) => {
    const {id} = req.params
    try{
        const constructions = await this.constructionService.getconstructionsbyPlayer(+id)
        return res.status(200).json(constructions)
    }catch (error){
        this.handleError(error, res)
    }
  }
}
