import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";
import { Category } from "../../models/Category";

class ListCategoriesUseCase {
    constructor(private categoriesRepository: ICategoriesRepository) {}

    execute(): Category[] {
        const allCategories = this.categoriesRepository.list();

        return allCategories;
    }
}

export { ListCategoriesUseCase };