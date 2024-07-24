import { Clan, ClanMember, ClanMemberRole, PostgresDatabase } from '../../data';
import { CustomError, JoinMember } from '../../domain';
import { AppDataSource } from './inventory.service';
import { PlayerService } from './player.service';

export class ClanService {
  constructor(private readonly playerService: PlayerService) {}

  async addMemberToClan(playerReceiverId: number, joinMemberDTO: JoinMember) {
    // Buscar jugador receptor
    const playerReceiverPromise = this.playerService.findOnePlayer(playerReceiverId);
    // Buscar jugador remitente
    const playerSenderPromise = this.playerService.findOnePlayer(joinMemberDTO.senderMemberId);

    const [playerReceiver, playerSender] = await Promise.all([playerReceiverPromise, playerSenderPromise]);

    // Validar existencia de jugadores
    if (!playerReceiver) throw CustomError.notFound('Player Receiver not found');
    if (!playerSender) throw CustomError.notFound('Player Sender not found');

    // Validar rol del remitente
    const allowedRoles = [ClanMemberRole.MASTER, ClanMemberRole.OFFICER, ClanMemberRole.SUBOFFICER];
    const senderClanMember = playerSender.clanMembers?.[0];

    if (!senderClanMember || !allowedRoles.includes(senderClanMember.role)) {
      throw CustomError.badRequest("You don't have permission to join this clan");
    }

    // Crear nueva instancia de ClanMember y asignar jugador y clan
    const clanMember = new ClanMember();
    clanMember.player = playerReceiver;
    clanMember.clan = senderClanMember.clan;

    // Guardar ClanMember en la base de datos
    try {
      return await clanMember.save();
    } catch (error) {
      throw CustomError.internalServer('Something went wrong while adding member to clan');
    }
  }

  async createClan(name: string): Promise<Clan> {
    try {
      // Crear nueva instancia de Clan y asignar nombre
      const clan = new Clan();
      clan.name = name;
      // Guardar clan en la base de datos
      await clan.save();
      return clan;
    } catch (error) {
      throw CustomError.internalServer('Error creating clan');
    }
  }
}
  export const getMembersByClanId = async (clanId: number): Promise<ClanMember[] | null> => {
    try {
      const repository = AppDataSource.getRepository(ClanMember);
      const members = await repository.find({
        where: { clan: { id: clanId } },
        relations: ['clan'],
      });
  
      return members.length ? members : null;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Failed to retrieve clan members');
    }
  };


