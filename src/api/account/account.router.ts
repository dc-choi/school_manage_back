import { Router } from 'express';

import AccountController from './account.controller';

import AuthMiddleware from '../auth/auth.middleware'

export const path = '/account';
export const router = Router();

router.get('/', new AuthMiddleware().authorization, new AccountController().getAccount);
