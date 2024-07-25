import { Items } from '../../data';
import { CustomError } from '../../domain';

export class ItemService {

  async findOneItemById(id: number){
    const item = await Items.findOne({
      where: {
        id,
      }
    })

    if (!item) throw CustomError.notFound("Item not found")
    
    return item;
  }
}