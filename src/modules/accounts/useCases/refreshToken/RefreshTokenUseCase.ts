import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private readonly usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private readonly dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<ITokenResponse> {
    const { sub: user_id, email } = verify(
      token,
      auth.secretRefreshToken
    ) as IPayload;
    const {
      secretToken,
      expiresInToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresInRefreshTokenDays,
    } = auth;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );
    if (!userToken) {
      throw new AppError("Refresh token does not exists!");
    }

    await this.usersTokensRepository.deleteByPk(userToken.id);

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: user_id,
      expiresIn: expiresInRefreshToken,
    });

    const expiresDate = this.dateProvider.addDays(expiresInRefreshTokenDays);

    await this.usersTokensRepository.create({
      user_id,
      expires_date: expiresDate,
      refresh_token: refreshToken,
    });

    const newToken = sign({}, secretToken, {
      subject: user_id,
      expiresIn: expiresInToken,
    });

    return {
      token: newToken,
      refresh_token: refreshToken,
    };
  }
}

export { RefreshTokenUseCase };
