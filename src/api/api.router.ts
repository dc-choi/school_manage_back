import { Router } from 'express';

import * as auth from './auth/auth.router';
import * as company from './company/company.router';
import * as recipe from './recipe/recipe.router';
import * as ingredient from './ingredient/ingredient.router';

export const path = '/api';
export const router = Router();

router.use(auth.path, auth.router);
router.use(company.path, company.router);
router.use(recipe.path, recipe.router);
router.use(ingredient.path, ingredient.router);
