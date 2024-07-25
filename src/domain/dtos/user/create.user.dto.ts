import { regularExps } from "../../../config/regular-exp";


export class CreateUserDto {
  private constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly email: string
  ) {}

  static createUser(object: { [key: string]: any }): [string?, CreateUserDto?] {
    const { username, password, email } = object;

    if (!username) return ["name is required"];
    if (!email) return ["email is required"];
    if (!regularExps.email.test(email)) return ["Invalid email"];
    if (!password) return ["pasword is required"];
    if (!regularExps.password.test(password))
      return [
        "The password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ];

    return [undefined, new CreateUserDto(username, password, email)];
  }
}