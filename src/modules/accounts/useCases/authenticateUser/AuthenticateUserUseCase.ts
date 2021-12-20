import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import auth from "@config/auth";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private readonly usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private readonly dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const { 
      secretToken,
      expiresInToken,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresInRefreshTokenDays
    } = auth;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Email or password incorrect!", 422);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!", 422);
    }

    const token = sign({}, secretToken, {
      subject: user.id,
      expiresIn: expiresInToken,
    });

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: user.id,
      expiresIn: expiresInRefreshToken
    })

    const expiresDate = this.dateProvider.addDays(
      expiresInRefreshTokenDays
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: expiresDate,
      refresh_token: refreshToken
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
      refresh_token: refreshToken
    };
  }
}

export { AuthenticateUserUseCase };
