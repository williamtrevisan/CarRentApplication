import { getRepository, Repository } from "typeorm";

import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";

import { Rental } from "../entities/Rental";

class RentalsRepository implements IRentalsRepository {
  private readonly repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    id,
    user_id,
    car_id,
    expected_return_date,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      id,
      user_id,
      car_id,
      expected_return_date,
      end_date,
      total,
    });

    await this.repository.save(rental);

    return rental;
  }

  async findByPk(id: string): Promise<Rental> {
    return this.repository.findOne(id);
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    return this.repository.find({
      where: { user_id },
      relations: ["car"],
    });
  }

  findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.repository.findOne({
      where: { car_id, end_date: null },
    });
  }

  findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.repository.findOne({
      where: { user_id, end_date: null },
    });
  }
}

export { RentalsRepository };
