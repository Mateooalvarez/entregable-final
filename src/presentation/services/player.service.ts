import { Player } from "../../data";
import { CreatePlayerDTO, CustomError } from "../../domain";
import { UserService } from "./user.service";

export class PlayerService {
  constructor(private readonly userService: UserService) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO, userId: number) {
    const userPromise = this.userService.findeOneUser(userId);

    const playerPromise = this.findOnePlayerByName(createPlayerDTO.name);

    const [userData, playerData] = await Promise.all([
      userPromise,
      playerPromise,
    ]);

    const player = new Player();
    player.user = userData;

    player.name = createPlayerDTO.name.toLocaleLowerCase().trim();

    try {
      return await player.save();
    } catch (error) {
      throw CustomError.internalServer("Something went wrong");
    }
  }
  async findOnePlayer(id: number) {
    const player = await Player.findOne({
      where: {
        id,
      },
      relations: ["user", "clanMembers", "clanMembers.clan"],
      select: {
        user: {
          id: true,
          username: true,
          email: true,
        },
      },
    });

    if (!player) throw CustomError.notFound("Player not found");

    return player;
  }
  async findOnePlayerByName(name: string) {
    const player = await Player.findOne({
      where: {
        name,
      },
    });

    if (player) throw CustomError.badRequest("This name is already taken");

    return player;
  }

  async findPlayerConstructionsById(id: number) {
    const player = await Player.findOne({
      where: {
        id,
      },
      relations: ["constructions"],
      select: {
        constructions: {
          id: true,
          name: true,
          type: true,
          level: true,
        },
      },
    });

    if (!player) throw CustomError.notFound("Player not found");

    return player;
  }
  async findOnePlayerQuestById(id: number) {
    const player = await Player.findOne({
      where: {
        id,
      },
      relations: {
        quest_players: {
          quest: true,
        },
      },
    });

    if (!player) throw CustomError.notFound("Player not found");

    return player;
  }
}