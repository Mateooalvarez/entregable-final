import { Request, Response } from "express";
import {  CustomError } from "../../domain";
import { ResourceService } from "../services/resource.service";
import { CreateResoucesDTO } from "../../domain/dtos/resources/create-resources.dto";

export class ResoucesController {
  constructor(
   
    private readonly resourcesService: ResourceService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went very wrong 🧨🧨🧨" });
  };

  createResources = async (req: Request, res: Response) => {
    const [error, createResourcesDTO] = CreateResoucesDTO.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.resourcesService
      .createResources(createResourcesDTO!)
      .then((resource) => res.status(201).json(resource))
      .catch((error) => this.handleError(error, res));
  };

  getAllResouces = async (req: Request, res: Response) => {
    this.resourcesService
      .findAllResources()
      .then((resources) => res.status(200).json(resources))
      .catch((error: unknown) => this.handleError(error, res));
  };
}