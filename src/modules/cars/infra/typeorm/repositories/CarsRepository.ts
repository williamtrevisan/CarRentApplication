import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
  private readonly repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    id,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    return this.repository.save(car);
  }

  async findByPk(id: string): Promise<Car> {
    return this.repository.findOne(id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.repository.findOne({ license_plate });
  }

  async findAvailable(
    name?: string,
    brand?: string,
    category_id?: string
  ): Promise<Car[]> {
    const carsQuery = await this.repository
      .createQueryBuilder("car")
      .where("car.available = :available", { available: true });

    if (name) {
      carsQuery.andWhere("car.name = :name", { name });
    }

    if (brand) {
      carsQuery.andWhere("car.brand = :brand", { brand });
    }

    if (category_id) {
      carsQuery.andWhere("car.category_id = :category_id", { category_id });
    }

    return carsQuery.getMany();
  }
}

export { CarsRepository };
