import { Request, Response } from "express";
import { CustomError, JoinMember } from "../../domain";
import { ClanService } from "../services/clan.service";
import { AddClansDto } from "../../domain/dtos/clan/add-clans.dto";

export class ClanController {
  constructor(private readonly clanService: ClanService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };

  addMemberToClan = async (req: Request, res: Response) => {
    const { playerReceiverId } = req.params;
    const [error, joinMemberDTO] = JoinMember.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.clanService
      .addMemberToClan(+playerReceiverId, joinMemberDTO!)
      .then((resp) => res.status(200).json({ message: "Member added to clan" }))
      .catch((error) => this.handleError(error, res));
  };
  //------------------------------------------------------------------
  createClan = async (req: Request, res: Response) => {
    const [error, createClanDto] = AddClansDto.create(req.body);
    if (error) return res.status(422).json({ message: error });

    this.clanService
      .createClan(createClanDto!)
      .then((clan) => res.status(201).json(clan))
      .catch((error) => this.handleError(error, res));
  };

  getClanMembersById = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    if (isNaN(+id)) {
      return res.status(400).json({ message: "El id debe ser un número" });
    }
    this.clanService
      .findClanMembersById(+id)
      .then((member) => res.status(200).json(member))
      .catch((error: any) => {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json({ message: error.message });
        }
        return this.handleError(error, res);
      });
  };
}