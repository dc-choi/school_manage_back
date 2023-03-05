import { Router } from 'express';

import AccountController from './account.controller';

import AuthMiddleware from '@/api/auth/auth.middleware'

export const path = '/account';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AccountController().get);
