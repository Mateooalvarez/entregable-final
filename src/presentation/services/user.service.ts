import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { User } from "../../data/postgres/models/user.model";
import { CreateUserDto, CustomError, LoginUserDTO } from "../../domain";

export class UserService {
  constructor() {}

  async register(createUserDto: CreateUserDto) {
    const existUser = await User.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUser) throw CustomError.badRequest("Email already exist");
    const user = new User();

    user.username = createUserDto.username.toLocaleLowerCase().trim();
    user.email = createUserDto.email.toLocaleLowerCase().trim();
    user.password = bcryptAdapter.hash(createUserDto.password);

    try {
      return await user.save();
    } catch (error: any) {
      throw CustomError.internalServer("Something went very wrong! 😵‍💫");
    }
  }

  public async login(loginUserDto: LoginUserDTO) {
    const user = await User.findOne({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!user) throw CustomError.unAuthorized("Invalid credentials 11");

    const istMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!istMatching) throw CustomError.unAuthorized("Invalid password");

    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token)
      throw CustomError.internalServer("Error while creating JWT -- 😵‍💫");

    return {
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async findeOneUser(id: number) {
    const user = await User.findOne({
      where: {
        id,
      },
      relations: ["players"],
    });
    if (!user) throw CustomError.notFound("User not found");

    return user;
  }
}
 