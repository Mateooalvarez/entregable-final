



import { Request, Response } from 'express';
import { CustomError, JoinMember } from '../../domain';
import { ClanService, getMembersByClanId } from '../services/clan.service';

export class ClanController {

  constructor(
    private readonly clanService: ClanService
  ){}

  private handleError = (error: unknown, res: Response) => {
    if( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ message: error.message })
    }

    console.log(error)
    return res.status(500).json({ message: 'Something went very wrong! 🧨' })
  }

  addMemberToClan = async (req: Request, res: Response) => {
    const { playerReceiverId } = req.params;
    const [ error, joinMemberDTO ] = JoinMember.create(req.body);
    if( error ) return res.status(422).json({ message: error })

    this.clanService.addMemberToClan(+playerReceiverId, joinMemberDTO!)
      .then(resp => res.status(200).json({ message: 'Member added to clan' }))
      .catch(error => this.handleError(error, res))
    
  }
}
  export const createClanHandler = (clanService: ClanService) => async (req: Request, res: Response) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
  
    try {
      const newClan = await clanService.createClan(name);
      return res.status(201).json(newClan);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating clan'});
    }
  }

  export const getClanMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const clanId = parseInt(req.params.id, 10);
  
      if (isNaN(clanId)) {
        res.status(400).json({ error: 'Invalid clan ID' });
        return;
      }
  
      const members = await getMembersByClanId(clanId);
  
      if (!members) {
        res.status(404).json({ error: 'Clan not found or no members' });
        return;
      }
  
      res.json(members);
    } catch (error) {
      console.error('Error fetching clan members:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

