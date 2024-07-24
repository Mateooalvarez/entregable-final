import { Request, Response } from 'express';
import { ResourceService } from '../services/resource.service';
import { CustomError } from '../../domain';

export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Something went very wrong! 🧨' });
  }

  createResource = async (req: Request, res: Response) => {
    try {
      const newResource = await this.resourceService.createResource(req.body);
      return res.status(201).json(newResource);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  getAllResources = async (req: Request, res: Response) => {
    try{
        const resources = await this.resourceService.getAllResources()
        return res.setMaxListeners(200).json(resources)
    }catch (error){
        this.handleError(error, res)
    }
  }
}
