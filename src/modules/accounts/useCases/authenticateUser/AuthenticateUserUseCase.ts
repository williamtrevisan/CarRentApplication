import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

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
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private readonly usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const { SECRET_TOKEN, EXPIRES_IN_TOKEN, SECRET_REFRESH_TOKEN, EXPIRES_IN_REFRESH_TOKEN } = process.env;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Email or password incorrect!", 422);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!", 422);
    }

    const token = sign({}, SECRET_TOKEN, {
      subject: user.id,
      expiresIn: EXPIRES_IN_TOKEN,
    });

    const refresh_token = sign({ email }, SECRET_REFRESH_TOKEN, {
      subject: user.id,
      expiresIn: EXPIRES_IN_REFRESH_TOKEN
    })

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date,
      refresh_token
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}

export { AuthenticateUserUseCase };
