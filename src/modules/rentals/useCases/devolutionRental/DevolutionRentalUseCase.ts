import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private readonly rentalsRepository: IRentalsRepository,

    @inject("CarsRepository")
    private readonly carsRepository: ICarsRepository,

    @inject("DayjsDateProvider")
    private readonly dateProvider: IDateProvider,
  ) {}

  async execute({ id, user_id }: IRequest): Promise<void> {
    const rental = await this.rentalsRepository.findByPk(id);
    if (!rental) {
      throw new AppError("Rental does not exists!");
    }
  }
}

export { DevolutionRentalUseCase };
