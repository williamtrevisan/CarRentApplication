import { ICreateUserTokenDTO } from "../dto/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

interface IUsersTokensRepository {
  create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserToken>;
  deleteByPk(id: string): Promise<void>;
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken>;
}

export { IUsersTokensRepository };
