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
    const minimumRentalTime = 1;
    let total = 0;

    const rental = await this.rentalsRepository.findByPk(id);
    if (!rental) {
      throw new AppError("Rental does not exists!");
    }

    const car = await this.carsRepository.findByPk(rental.car_id);

    let daily = this.dateProvider.compareInDays(
      rental.start_date,
      this.dateProvider.dateNow()
    );
    if (daily < minimumRentalTime) {
      daily = minimumRentalTime;
    }

    const delay = this.dateProvider.compareInDays(
      this.dateProvider.dateNow(),
      rental.expected_return_date
    );
    if (delay > 0) {
      total = delay * car.fine_amount;
    }

    total += daily * car.daily_rate;
    
    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);
  }
}

export { DevolutionRentalUseCase };
