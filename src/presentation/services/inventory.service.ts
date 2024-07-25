import { Inventory, Items, Player, Resource } from "../../data";
import { Inventory_item } from "../../data/postgres/models/inventoryItem.model";
import { Inventory_resource } from "../../data/postgres/models/inventoryResource.model";
import { AddItemToIventory, CustomError } from "../../domain";
import { ItemService } from "./item.service";
import { ResourceService } from "./resource.service";

export class InventoryService {
  constructor(
    private readonly itemService: ItemService,
    private readonly resourceService: ResourceService
  ) {}

  async addItemToInventory(
    id: number,
    addItemToIventoryDTO: AddItemToIventory
  ) {
    const inventory = await this.findOneInventoryByPlayerId(id);

    if (addItemToIventoryDTO.itemId) {
      const item = await this.itemService.findOneItemById(
        addItemToIventoryDTO.itemId
      );
      if (inventory) {
        const inventory_item = new Inventory_item();
        inventory_item.item = item;
        inventory_item.quantity = addItemToIventoryDTO.quantity;
        inventory_item.inventory = inventory;
        try {
          await inventory_item.save();
        } catch (error) {
          throw CustomError.internalServer("Something went wrong");
        }
      } else {
        const inventory = await this.createInventory(id);
        const inventory_item = new Inventory_item();
        inventory_item.item = item;
        inventory_item.quantity = addItemToIventoryDTO.quantity;
        inventory_item.inventory = inventory;
        try {
          await inventory_item.save();
        } catch (error) {
          throw CustomError.internalServer("Something went wrong");
        }
      }
    }

    if (addItemToIventoryDTO.resourceId) {
      const resource = await this.resourceService.findOneResourceById(
        addItemToIventoryDTO.resourceId
      );
      if (inventory) {
        const inventory_resource = new Inventory_resource();
        inventory_resource.resource = resource;
        inventory_resource.quantity = addItemToIventoryDTO.quantity;
        inventory_resource.inventory = inventory;
        try {
          await inventory_resource.save();
        } catch (error) {
          throw CustomError.internalServer("Something went wrong");
        }
      } else {
        const inventory = await this.createInventory(id);
        const inventory_resource = new Inventory_resource();
        inventory_resource.resource = resource;
        inventory_resource.quantity = addItemToIventoryDTO.quantity;
        inventory_resource.inventory = inventory;
        try {
          await inventory_resource.save();
        } catch (error) {
          throw CustomError.internalServer("Something went wrong");
        }
      }
    }

    return {
      message: "Object added to inventory",
    };
  }
  async findOneInventoryByPlayerId(playerId: number) {
    const player = await Player.findOne({
      where: {
        id: playerId,
      },
      relations: ["inventory"],
      select: {
        inventory: {
          id: true,
        },
      },
    });
    if (!player) throw CustomError.notFound("Player not found");

    const inventory = player.inventory;

    return inventory;
  }

  async findOneInventoryByPlayerId2(playerId: number) {
    const player = await Player.findOne({
      where: {
        id: playerId,
      },
      relations: ["inventory"],
      select: {
        inventory: {
          id: true,
        },
      },
    });
    if (!player) throw CustomError.notFound("Player not found");

    const inventory = player.inventory;

    if (!inventory) throw CustomError.notFound("Player no tiene inventario");

    return inventory;
  }


  async createInventory(playerId: number) {
    const player = await Player.findOne({
      where: {
        id: playerId,
      },
    });

    if (!player) throw CustomError.notFound("Player not found");

    const inventory = new Inventory();
    inventory.player = player;

    try {
      return await inventory.save();
    } catch (error) {
      throw CustomError.internalServer("Something went wrong");
    }
  }


  async findInventoryPlayerId(playerId: number) {
    const inventory2 = await this.findOneInventoryByPlayerId2(playerId);

    if (!inventory2) return CustomError.notFound("player not existing");

    const inventoryOfPlayer = await Inventory.findOne({
      where: {
        id: inventory2.id,
      },
      relations: {
        inventory_item: {
          item:true,
        },
        inventory_resource:{
          resource: true,
        },
        
      },
    });

    if (!inventoryOfPlayer) {
      throw CustomError.notFound("player not inventories");
    }

    return inventoryOfPlayer;
  }
}