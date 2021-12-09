import { ICreateUserDTO } from "../dto/ICreateUserDTO";
import { User } from "../entities/User";

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findByPk(id: string): Promise<User>;
}

export { IUsersRepository };
