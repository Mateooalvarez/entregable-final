export class CreateResoucesDTO {
  private constructor(
    public readonly name: string,
    public readonly description: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateResoucesDTO?] {
    const { name, description } = object;

    if (!name) return ["name is required"];
    if (!description) return ["plis description"];

    return [undefined, new CreateResoucesDTO(name, description)];
  }
}