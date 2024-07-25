import { Request, Response } from "express";
import { CreateUserDto, CustomError, LoginUserDTO } from "../../domain";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };

  findOneUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService.findeOneUser(+id)
    
    .then((user) => res.status(200).json(user))
    .catch((error) => this.handleError(error, res));
    
  };

  registerUser = (req: Request, res: Response) => {
    const [error, createUserDto] = CreateUserDto.createUser(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .register(createUserDto!)
      .then((user) => res.status(201).json(user))
      .catch((error: unknown) => this.handleError(error, res));
  };

  login = async (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .login(loginUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };
}