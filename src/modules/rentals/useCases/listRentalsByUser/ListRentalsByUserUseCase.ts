import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListRentalsByUserUseCase {
  constructor(
    @inject("RentalsRepository")
    private readonly rentalsRepository: IRentalsRepository
  ) {}

  async execute(user_id: string): Promise<Rental[]> {
    return this.rentalsRepository.findByUser(user_id);
  }
}

export { ListRentalsByUserUseCase };
