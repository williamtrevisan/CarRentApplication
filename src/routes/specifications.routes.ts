import { Router } from 'express';

import { CreateSpecificationService } from '../services/CreateSpecificationService';

import { SpecificationsRepository } from '../repositories/SpecificationsRepository';

const specificationsRoutes = Router();
const specificationsRepository = new SpecificationsRepository();

specificationsRoutes.post('/', (request, response) => {
    const { name, description } = request.body;

    const createSpecificationsService = new CreateSpecificationService(specificationsRepository);
    createSpecificationsService.execute({ name, description });

    return response.status(201).send();
});

export { specificationsRoutes };