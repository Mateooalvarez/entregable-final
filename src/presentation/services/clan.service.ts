import { ClanMember, ClanMemberRole, Clan } from "../../data";
import { CustomError, JoinMember } from "../../domain";
import { AddClansDto } from "../../domain/dtos/clan/add-clans.dto";
import { PlayerService } from "./player.service";

export class ClanService {
  constructor(private readonly playerService: PlayerService) {}

  async addMemberToClan(playerReceiverId: number, joinMemberDTO: JoinMember) {
    const playerReceiverPromise =
      this.playerService.findOnePlayer(playerReceiverId);

    const playerSenderPromise = this.playerService.findOnePlayer(
      joinMemberDTO.senderMemberId
    );

    const [playerReceiver, playerSender] = await Promise.all([
      playerReceiverPromise,
      playerSenderPromise,
    ]);

    if (!playerReceiver)
      throw CustomError.notFound("Player Receiver not found");
    if (!playerSender) throw CustomError.notFound("Player Sender not found");

    const allowedRoles = [
      ClanMemberRole.MASTER,
      ClanMemberRole.OFFICER,
      ClanMemberRole.SUBOFFICER,
    ];

    if (!allowedRoles.includes(playerSender.clanMembers[0].role)) {
      throw CustomError.badRequest(
        "You don't have permission to join this clan"
      );
    }

    const clanMember = new ClanMember();
    clanMember.player = playerReceiver;
    clanMember.clan = playerSender.clanMembers[0].clan;

    try {
      return await clanMember.save();
    } catch (error) {
      throw CustomError.internalServer("Something went wrong");
    }
  }

  async createClan(addClanDto: AddClansDto) {
    const clanExisting = await this.finClanByname(addClanDto.name);
    if (clanExisting)
      throw CustomError.badRequest("name of clan existing...✕✕✕");

    const clan = new Clan();
    clan.name = addClanDto.name.toLocaleLowerCase().trim();
    clan.description = addClanDto.description.toLocaleLowerCase().trim();

    try {
      return await clan.save();
    } catch (error) {
      throw CustomError.internalServer("Something went wrong...");
    }
  }

  async finClanByname(name: string) {
    const clan = await Clan.findOne({
      where: {
        name,
      },
    });
    if (clan) throw CustomError.badRequest("This name is already existing");
    return clan;
  }
  async findClanMembersById(id: number) {
    const clan = await Clan.findOne({
      where: {
        id,
      },
      relations: {
        clanMembers: {
          player: true,
        },
      },
    });

    console.log(clan);
    if (!clan) throw CustomError.badRequest("This clan not existing");
    return clan;
  }
}