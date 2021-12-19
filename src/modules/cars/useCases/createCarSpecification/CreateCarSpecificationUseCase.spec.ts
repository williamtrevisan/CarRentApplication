import { v4 as uuidV4 } from "uuid";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("should not be able to add a new specification to an nonexistent car", async () => {
    expect(async () => {
      const car_id = "1234";
      const specification_id = ["54321"];

      await createCarSpecificationUseCase.execute({ car_id, specification_id });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to add a new specification to the car", async () => {
    const car = await carsRepositoryInMemory.create({
      id: uuidV4(),
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category",
    });
    const specification = await specificationsRepositoryInMemory.create({
      name: "Name Specification",
      description: "Description Specification",
    });
    const specification2 = await specificationsRepositoryInMemory.create({
      name: "Name Specification 2",
      description: "Description Specification 2",
    });

    const carSpecification = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specification_id: [specification.id, specification2.id],
    });

    expect(carSpecification.id).toEqual(car.id);
    expect(carSpecification).toHaveProperty("specifications");
    expect(carSpecification.specifications.length).toBe(2);
  });
});
