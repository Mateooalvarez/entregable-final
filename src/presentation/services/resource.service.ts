import { create } from "domain";
import { Resource } from "../../data";
import { CustomError } from "../../domain";
import { CreateResoucesDTO } from "../../domain/dtos/resources/create-resources.dto";

export class ResourceService {
  async findOneResourceById(id: number) {
    const resource = await Resource.findOne({
      where: {
        id,
      },
    });

    if (!resource) throw CustomError.notFound("Resource not found");

    return resource;
  }
  async findOneResourceByname(name: string) {
    const resources = await Resource.findOne({
      where: {
        name,
      },
    });
    if (resources)
      throw CustomError.badRequest("This name is already existing");
    return resources;
  }
  async createResources(createResoucesDTO: CreateResoucesDTO) {
    const resourceExisting = await this.findOneResourceByname(
      CreateResoucesDTO.name
    );

    if (resourceExisting)
      throw CustomError.badRequest("Nombre de recurso ya existe");

    const resource = new Resource();
    resource.name = createResoucesDTO.name.toLocaleLowerCase().trim();
    resource.description = createResoucesDTO.description
      .toLocaleLowerCase()
      .trim();

    try {
      return await resource.save();
    } catch (error) {
      throw CustomError.internalServer("Something went wrong...");
    }
  }
  async findAllResources() {
    const resource = await Resource.find();
    return resource;
  }

}