import { Resource } from '../../data';
import { CustomError } from '../../domain';
import { AppDataSource } from './inventory.service';


export class ResourceService {

  async createResource(data: Partial<Resource>) {
    const resourceRepository = AppDataSource.getRepository(Resource);
    const newResource = resourceRepository.create(data);
    await resourceRepository.save(newResource)
    return newResource
  }

  async getAllResources(){
    const resourceRepository = AppDataSource.getRepository(Resource)
    return await resourceRepository.find()
  }

  async findOneResourceById(id: number){
    const resource = await Resource.findOne({
      where: {
        id: id
      }
    })

    if (!resource) throw CustomError.notFound("Resource not found")

    return resource;
  }

}