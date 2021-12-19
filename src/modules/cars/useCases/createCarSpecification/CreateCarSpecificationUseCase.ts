import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  car_id: string;
  specification_id: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private readonly carsRepository: ICarsRepository,

    @inject("SpecificationsRepository")
    private readonly specificationsRepository: ISpecificationsRepository
  ) {}

  async execute({ car_id, specification_id }: IRequest): Promise<Car> {
    const car = await this.carsRepository.findByPk(car_id);
    if (!car) {
      throw new AppError("Car does not exists!");
    }

    const specifications = await this.specificationsRepository.findByPks(
      specification_id
    );

    car.specifications = specifications;

    await this.carsRepository.create(car);

    return car;
  }
}

export { CreateCarSpecificationUseCase };
