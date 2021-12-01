import { ICreateCategoryDTO, ICategoriesRepository } from "./ICategoriesRepository";
import { Category } from "../models/Category";

class PostgresCategoriesRepository implements ICategoriesRepository {
    create({ name, description }: ICreateCategoryDTO): void {
    }

    findByName(name: string): Category | undefined {
        return undefined;
    }

    list(): Category[] {
        return [];
    }
}

export { PostgresCategoriesRepository };