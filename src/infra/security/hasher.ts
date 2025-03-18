import { v4 as uuidv4 } from "uuid";

export class Hasher implements HasherInterface {
  generateUuid(): string {
    return uuidv4();
  }
}