import { Category } from '../models/Category';
import { ICreateCategoryDTO, ICategoriesRepository } from "./ICategoriesRepository";

class CategoriesRepository implements ICategoriesRepository {
    private categories: Category[];

    constructor() {
        this.categories = [];
    }

    create({ name, description }: ICreateCategoryDTO): void {
        const category = new Category();

        Object.assign(category, {
            name,
            description,
            created_at: new Date()
        });

        this.categories.push(category);
    }

    findByName(name: string): Category | undefined {
        return this.categories.find((category) => category.name === name);
    }

    list(): Category[] {
        return this.categories;
    }
}

export { CategoriesRepository };