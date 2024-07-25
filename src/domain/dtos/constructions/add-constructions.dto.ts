export class AddConstructionsDto {
    private constructor(
      public readonly name: string,
      public readonly type: string,
      public readonly location: string,
      public readonly playerId: number
    ) {}
  
    static createConstructions(object: {
      [key: string]: any;
    }): [string?, AddConstructionsDto?] {
      const { name, type, location, playerId } = object;
  
      if (!name) return ["Missing name"];
      if (!type) return ["Missing type"];
      if (!location) return ["Missing location"];
      if (!playerId) return ["Missing player id"];
  
      return [undefined, new AddConstructionsDto(name, type, location, playerId)];
    }
  }